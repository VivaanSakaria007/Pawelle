import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

interface SyncUserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: 'guest' | 'customer' | 'staff' | 'admin';
  created_at: string;
  updated_at?: string;
}

interface StoredAccount {
  profile: SyncUserProfile;
  passwordHash: string;
}

interface SyncDatabase {
  revision: number;
  registeredUsers: Record<string, StoredAccount>;
  collections: Record<string, unknown>;
}

const ALLOWED_COLLECTION_KEYS = new Set([
  'settings',
  'services',
  'service_categories',
  'locations',
  'staff',
  'products',
  'product_categories',
  'blog_posts',
  'blog_categories',
  'reviews',
  'pets',
  'appointments',
  'grooming_records',
  'orders',
  'contact_messages',
  'customers'
]);

const RESERVED_SANDBOX_EMAILS = new Set([
  'director@pawelle.com',
  'clara.vance@pawelle.com',
  'jessica.vance@example.com'
]);

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 32).toString('hex');
  return `scrypt:${salt}:${derived}`;
}

function verifyPassword(password: string, stored: string): boolean {
  if (!stored) return false;
  if (stored.startsWith('scrypt:')) {
    const [, salt, hex] = stored.split(':');
    if (!salt || !hex) return false;
    const derived = crypto.scryptSync(password, salt, 32).toString('hex');
    const a = Buffer.from(derived, 'hex');
    const b = Buffer.from(hex, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }
  return password === stored;
}

function readJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    const maxBytes = 4 * 1024 * 1024; // 4 MB limit for compressed pet thumbnails
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('Request payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const text = Buffer.concat(chunks).toString('utf8');
        resolve(text ? JSON.parse(text) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

/**
 * Shared local persistence & Server-Sent Events (SSE) plugin for dev & preview servers.
 * Enables instant cross-browser-profile and cross-device sync over LAN without requiring Supabase keys.
 */
export function pawelleSyncPlugin(dbFilePath?: string): Plugin {
  const storagePath =
    dbFilePath ||
    process.env.PAWELLE_DB_PATH ||
    path.resolve(process.cwd(), '.pawelle-local-db.json');
  const sseClients = new Set<ServerResponse>();

  const loadDb = (): SyncDatabase => {
    try {
      if (fs.existsSync(storagePath)) {
        const raw = fs.readFileSync(storagePath, 'utf8');
        const parsed = JSON.parse(raw) as Partial<SyncDatabase>;
        return {
          revision: typeof parsed.revision === 'number' ? parsed.revision : 1,
          registeredUsers: parsed.registeredUsers && typeof parsed.registeredUsers === 'object' ? parsed.registeredUsers : {},
          collections: parsed.collections && typeof parsed.collections === 'object' ? parsed.collections : {}
        };
      }
    } catch {
      // Fallback to fresh store
    }
    return { revision: 1, registeredUsers: {}, collections: {} };
  };

  let db: SyncDatabase = loadDb();

  const saveDb = () => {
    try {
      const tempPath = `${storagePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf8');
      fs.renameSync(tempPath, storagePath);
    } catch {
      try {
        fs.writeFileSync(storagePath, JSON.stringify(db, null, 2), 'utf8');
      } catch {
        // ignore disk write issues in read-only env
      }
    }
  };

  const broadcastUpdate = (keys: string[]) => {
    const payload = JSON.stringify({
      revision: db.revision,
      keys,
      updatedAt: new Date().toISOString()
    });
    for (const client of sseClients) {
      try {
        client.write(`event: state-update\ndata: ${payload}\n\n`);
      } catch {
        sseClients.delete(client);
      }
    }
  };

  const upsertCustomerIntoCollection = (profile: SyncUserProfile, initialCustomers?: SyncUserProfile[]) => {
    if (profile.role !== 'customer') return;
    let current: SyncUserProfile[] = Array.isArray(db.collections.customers)
      ? ([...(db.collections.customers as SyncUserProfile[])])
      : Array.isArray(initialCustomers)
        ? [...initialCustomers]
        : [];

    const emailLower = profile.email.trim().toLowerCase();
    const idx = current.findIndex(
      c => c.id === profile.id || c.email?.trim().toLowerCase() === emailLower
    );

    const merged: SyncUserProfile = {
      ...(idx >= 0 ? current[idx] : {}),
      ...profile,
      email: emailLower,
      role: 'customer',
      updated_at: new Date().toISOString()
    };

    if (idx >= 0) {
      current[idx] = merged;
    } else {
      current.unshift(merged);
    }
    db.collections.customers = current;
  };

  const getPublicRegisteredCustomers = (): SyncUserProfile[] => {
    return Object.values(db.registeredUsers)
      .map(entry => entry?.profile)
      .filter((p): p is SyncUserProfile => Boolean(p && p.id && p.email && p.role === 'customer'));
  };

  const attachMiddleware = (middlewares: any) => {
    middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
      const urlPath = (req.url || '').split('?')[0];
      if (!urlPath.startsWith('/api/pawelle-sync/')) {
        return next();
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
      }

      try {
        // 1. SSE Event Stream
        if (req.method === 'GET' && urlPath === '/api/pawelle-sync/stream') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, no-transform');
          res.setHeader('Connection', 'keep-alive');
          res.flushHeaders?.();

          sseClients.add(res);
          res.write(`event: connected\ndata: ${JSON.stringify({ revision: db.revision })}\n\n`);

          const keepAlive = setInterval(() => {
            try {
              res.write(': ping\n\n');
            } catch {
              clearInterval(keepAlive);
              sseClients.delete(res);
            }
          }, 25000);

          req.on('close', () => {
            clearInterval(keepAlive);
            sseClients.delete(res);
          });
          return;
        }

        // 2. Full State Read (never includes password hashes)
        if (req.method === 'GET' && urlPath === '/api/pawelle-sync/state') {
          sendJson(res, 200, {
            revision: db.revision,
            collections: db.collections,
            registeredCustomerProfiles: getPublicRegisteredCustomers()
          });
          return;
        }

        // 3. Atomic Upsert / Delete / Replace Collection Action
        if (req.method === 'POST' && urlPath === '/api/pawelle-sync/action') {
          const body = await readJsonBody(req);
          const key = String(body?.key || '');
          const op = String(body?.op || 'replace');

          if (!ALLOWED_COLLECTION_KEYS.has(key)) {
            sendJson(res, 400, { error: 'Unsupported collection key' });
            return;
          }

          if (op === 'upsert' && body?.item && typeof body.item === 'object') {
            if (!Array.isArray(db.collections[key])) {
              db.collections[key] = Array.isArray(body.initialItems) ? [...body.initialItems] : [];
            }
            const arr = [...(db.collections[key] as any[])];
            const item = body.item;
            const idx = item.id ? arr.findIndex((existing: any) => existing?.id === item.id) : -1;
            if (idx >= 0) {
              arr[idx] = { ...arr[idx], ...item };
            } else if (body.prepend === false) {
              arr.push(item);
            } else {
              arr.unshift(item);
            }
            db.collections[key] = arr;
          } else if (op === 'delete' && body?.id) {
            if (!Array.isArray(db.collections[key])) {
              db.collections[key] = Array.isArray(body.initialItems) ? [...body.initialItems] : [];
            }
            db.collections[key] = (db.collections[key] as any[]).filter((existing: any) => existing?.id !== body.id);
          } else if (op === 'replace' && body?.data !== undefined) {
            db.collections[key] = body.data;
          } else {
            sendJson(res, 400, { error: 'Invalid sync action payload' });
            return;
          }

          db.revision += 1;
          saveDb();
          broadcastUpdate([key]);
          sendJson(res, 200, { ok: true, revision: db.revision });
          return;
        }

        // 4. Customer Registration across all devices / Chrome profiles
        if (req.method === 'POST' && urlPath === '/api/pawelle-sync/auth/register') {
          const body = await readJsonBody(req);
          const cleanEmail = String(body?.email || '').trim().toLowerCase();
          const cleanName = String(body?.fullName || '').trim();
          const password = String(body?.password || '');
          const cleanPhone = typeof body?.phone === 'string' && body.phone.trim() ? body.phone.trim() : undefined;

          if (!cleanEmail || !cleanName || !password) {
            sendJson(res, 400, { error: 'Please complete all required fields (Full Name, Email, Password).' });
            return;
          }
          if (password.length < 8) {
            sendJson(res, 400, { error: 'Password must be at least 8 characters long for security.' });
            return;
          }
          if (RESERVED_SANDBOX_EMAILS.has(cleanEmail) || db.registeredUsers[cleanEmail]) {
            sendJson(res, 409, { error: 'An account with this email address is already registered. Please sign in instead.' });
            return;
          }

          const newProfile: SyncUserProfile = {
            id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            email: cleanEmail,
            full_name: cleanName,
            phone: cleanPhone,
            role: 'customer',
            created_at: new Date().toISOString()
          };

          db.registeredUsers[cleanEmail] = {
            profile: newProfile,
            passwordHash: hashPassword(password)
          };

          upsertCustomerIntoCollection(newProfile, Array.isArray(body?.initialCustomers) ? body.initialCustomers : undefined);
          db.revision += 1;
          saveDb();
          broadcastUpdate(['customers']);
          sendJson(res, 201, { profile: newProfile, revision: db.revision });
          return;
        }

        // 5. Cross-device Login Verification
        if (req.method === 'POST' && urlPath === '/api/pawelle-sync/auth/login') {
          const body = await readJsonBody(req);
          const cleanEmail = String(body?.email || '').trim().toLowerCase();
          const password = String(body?.password || '');
          const account = db.registeredUsers[cleanEmail];

          if (!account) {
            sendJson(res, 404, { error: 'Account not found on server' });
            return;
          }
          if (!verifyPassword(password, account.passwordHash)) {
            sendJson(res, 401, { error: 'Invalid email or password. Please check your password and try again.' });
            return;
          }

          if (account.profile.role === 'customer') {
            upsertCustomerIntoCollection(account.profile, Array.isArray(body?.initialCustomers) ? body.initialCustomers : undefined);
            db.revision += 1;
            saveDb();
            broadcastUpdate(['customers']);
          }
          sendJson(res, 200, { profile: account.profile });
          return;
        }

        // 6. Cross-device Customer Profile Updates & Sync
        if (req.method === 'POST' && urlPath === '/api/pawelle-sync/auth/profile') {
          const body = await readJsonBody(req);
          const cleanEmail = String(body?.email || '').trim().toLowerCase();
          const profile = body?.profile as SyncUserProfile | undefined;

          if (!cleanEmail || !profile?.id) {
            sendJson(res, 400, { error: 'Invalid profile payload' });
            return;
          }

          if (db.registeredUsers[cleanEmail]) {
            const existing = db.registeredUsers[cleanEmail].profile;
            db.registeredUsers[cleanEmail].profile = {
              ...existing,
              full_name: profile.full_name || existing.full_name,
              phone: profile.phone !== undefined ? profile.phone : existing.phone,
              avatar_url: profile.avatar_url !== undefined ? profile.avatar_url : existing.avatar_url,
              role: existing.role,
              updated_at: new Date().toISOString()
            };
          }

          if ((profile.role || 'customer') === 'customer') {
            upsertCustomerIntoCollection(profile, Array.isArray(body?.initialCustomers) ? body.initialCustomers : undefined);
          }

          db.revision += 1;
          saveDb();
          broadcastUpdate(['customers']);
          sendJson(res, 200, { ok: true, revision: db.revision });
          return;
        }

        sendJson(res, 404, { error: 'Unknown sync endpoint' });
      } catch (err: any) {
        sendJson(res, 500, { error: err?.message || 'Sync server error' });
      }
    });
  };

  return {
    name: 'pawelle-local-sync',
    configureServer(server) {
      attachMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      attachMiddleware(server.middlewares);
    }
  };
}
