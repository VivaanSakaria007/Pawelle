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

interface PasswordResetRecord {
  email: string;
  tokenHash: string;
  expiresAt: number;
}

interface SyncDatabase {
  revision: number;
  registeredUsers: Record<string, StoredAccount>;
  passwordResets?: Record<string, PasswordResetRecord>;
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
  'customers',
  'newsletter_subscribers'
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

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendTransactionalEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { sent: false, reason: 'RESEND_API_KEY not configured' };
  }
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || 'PAWELLE Sanctuary <onboarding@resend.dev>';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [options.to],
        subject: options.subject,
        html: options.html
      })
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      return { sent: false, reason: `Resend HTTP ${response.status}: ${errText}` };
    }
    return { sent: true };
  } catch (err: any) {
    return { sent: false, reason: err?.message || 'Email request failed' };
  }
}

/**
 * Shared persistence, server-side validation, rate limiting, and SSE sync plugin.
 * Powers cross-device realtime sync, health checks, password reset tokens, and optional Resend emails.
 */
export function pawelleSyncPlugin(dbFilePath?: string): Plugin {
  const storagePath =
    dbFilePath ||
    process.env.PAWELLE_DB_PATH ||
    path.resolve(process.cwd(), '.pawelle-local-db.json');
  const sseClients = new Set<ServerResponse>();
  const rateBuckets = new Map<string, { count: number; resetAt: number }>();

  const checkRateLimit = (ip: string, bucket: string, maxRequests: number, windowMs: number): boolean => {
    const key = `${bucket}:${ip}`;
    const now = Date.now();
    const existing = rateBuckets.get(key);
    if (!existing || now > existing.resetAt) {
      rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    if (existing.count >= maxRequests) {
      return false;
    }
    existing.count += 1;
    return true;
  };

  const loadDb = (): SyncDatabase => {
    try {
      if (fs.existsSync(storagePath)) {
        const raw = fs.readFileSync(storagePath, 'utf8');
        const parsed = JSON.parse(raw) as Partial<SyncDatabase>;
        return {
          revision: typeof parsed.revision === 'number' ? parsed.revision : 1,
          registeredUsers:
            parsed.registeredUsers && typeof parsed.registeredUsers === 'object' ? parsed.registeredUsers : {},
          passwordResets:
            parsed.passwordResets && typeof parsed.passwordResets === 'object' ? parsed.passwordResets : {},
          collections: parsed.collections && typeof parsed.collections === 'object' ? parsed.collections : {}
        };
      }
    } catch {
      // Fallback to fresh store
    }
    return { revision: 1, registeredUsers: {}, passwordResets: {}, collections: {} };
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
      // Apply Baseline Production Security Headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

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

      const clientIp = String(
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
          req.socket?.remoteAddress ||
          'unknown'
      );

      try {
        // 0. Health Check for Render / Uptime Monitors
        if (req.method === 'GET' && urlPath === '/api/pawelle-sync/health') {
          sendJson(res, 200, {
            status: 'ok',
            service: 'pawelle-sync',
            revision: db.revision,
            uptimeSeconds: Math.round(process.uptime()),
            emailConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
            supabaseConfigured: Boolean(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY),
            timestamp: new Date().toISOString()
          });
          return;
        }

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

        // 2. Full State Read (never includes password hashes or reset tokens)
        if (req.method === 'GET' && urlPath === '/api/pawelle-sync/state') {
          sendJson(res, 200, {
            revision: db.revision,
            collections: db.collections,
            registeredCustomerProfiles: getPublicRegisteredCustomers()
          });
          return;
        }

        // 3. Atomic Upsert / Delete / Replace Collection Action with Concurrency Validation
        if (req.method === 'POST' && urlPath === '/api/pawelle-sync/action') {
          if (!checkRateLimit(clientIp, 'action', 180, 60_000)) {
            sendJson(res, 429, { error: 'Rate limit exceeded. Please wait briefly and try again.' });
            return;
          }

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

            // Server-side atomic double-booking check for Appointments
            if (key === 'appointments' && item.status !== 'cancelled' && item.status !== 'no_show') {
              const targetStart = new Date(item.starts_at).getTime();
              const targetEnd = new Date(item.ends_at).getTime();
              if (Number.isFinite(targetStart) && Number.isFinite(targetEnd)) {
                const collision = arr.find((existing: any) => {
                  if (!existing || existing.id === item.id) return false;
                  if (existing.location_id !== item.location_id) return false;
                  if (existing.status === 'cancelled' || existing.status === 'no_show') return false;
                  const aStart = new Date(existing.starts_at).getTime();
                  const aEnd = new Date(existing.ends_at).getTime();
                  return targetStart < aEnd && targetEnd > aStart;
                });
                if (collision) {
                  sendJson(res, 409, {
                    error: 'This suite time slot was just reserved by another guest. Please select another time.'
                  });
                  return;
                }
              }
            }

            // Server-side inventory guard for Orders
            if (key === 'orders' && Array.isArray(item.items) && Array.isArray(db.collections.products)) {
              const isNewOrder = !arr.some((existing: any) => existing?.id === item.id);
              if (isNewOrder) {
                const serverProducts = db.collections.products as any[];
                for (const line of item.items) {
                  const prod = serverProducts.find((p: any) => p?.id === line.product_id);
                  if (prod && typeof prod.stock_quantity === 'number' && prod.stock_quantity < Number(line.quantity || 0)) {
                    sendJson(res, 409, {
                      error: `Insufficient stock on server for ${prod.name}. Remaining: ${prod.stock_quantity}.`
                    });
                    return;
                  }
                }
              }
            }

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
          if (!checkRateLimit(clientIp, 'auth', 25, 60_000)) {
            sendJson(res, 429, { error: 'Too many authentication attempts. Please wait a minute and try again.' });
            return;
          }

          const body = await readJsonBody(req);
          const cleanEmail = String(body?.email || '').trim().toLowerCase();
          const cleanName = String(body?.fullName || '').trim();
          const password = String(body?.password || '');
          const cleanPhone = typeof body?.phone === 'string' && body.phone.trim() ? body.phone.trim() : undefined;

          if (!cleanEmail || !cleanName || !password) {
            sendJson(res, 400, { error: 'Please complete all required fields (Full Name, Email, Password).' });
            return;
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            sendJson(res, 400, { error: 'Please enter a valid email address.' });
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

          void sendTransactionalEmail({
            to: cleanEmail,
            subject: 'Welcome to PAWELLE Sanctuary',
            html: `<p>Dear ${escapeHtml(cleanName)},</p><p>Your PAWELLE client sanctuary profile has been created. You may now register companions and reserve tailored grooming sessions.</p>`
          });

          sendJson(res, 201, { profile: newProfile, revision: db.revision });
          return;
        }

        // 5. Cross-device Login Verification
        if (req.method === 'POST' && urlPath === '/api/pawelle-sync/auth/login') {
          if (!checkRateLimit(clientIp, 'auth', 25, 60_000)) {
            sendJson(res, 429, { error: 'Too many sign-in attempts. Please wait a minute and try again.' });
            return;
          }

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

        // 6. Password Reset Request (stores hashed 30-min token & dispatches email if Resend configured)
        if (req.method === 'POST' && urlPath === '/api/pawelle-sync/auth/request-reset') {
          if (!checkRateLimit(clientIp, 'auth', 15, 60_000)) {
            sendJson(res, 429, { error: 'Too many reset requests. Please wait a minute and try again.' });
            return;
          }

          const body = await readJsonBody(req);
          const cleanEmail = String(body?.email || '').trim().toLowerCase();
          const origin = String(body?.origin || '').replace(/\/$/, '');

          if (!cleanEmail || !cleanEmail.includes('@')) {
            sendJson(res, 400, { error: 'Please provide a valid email address.' });
            return;
          }

          let emailDispatched = false;
          const account = db.registeredUsers[cleanEmail];
          if (account) {
            const rawToken = crypto.randomBytes(24).toString('hex');
            const tokenHash = hashToken(rawToken);
            if (!db.passwordResets) db.passwordResets = {};

            // Clean expired tokens
            const now = Date.now();
            for (const [key, rec] of Object.entries(db.passwordResets)) {
              if (!rec || rec.expiresAt < now) delete db.passwordResets[key];
            }

            db.passwordResets[tokenHash] = {
              email: cleanEmail,
              tokenHash,
              expiresAt: now + 30 * 60 * 1000
            };
            saveDb();

            const resetLink = origin ? `${origin}/reset-password?token=${rawToken}` : `/reset-password?token=${rawToken}`;
            const emailRes = await sendTransactionalEmail({
              to: cleanEmail,
              subject: 'PAWELLE Password Reset Instructions',
              html: `<p>Hello ${escapeHtml(account.profile.full_name)},</p><p>Reset your PAWELLE password using the secure link below (valid for 30 minutes):</p><p><a href="${escapeHtml(resetLink)}">${escapeHtml(resetLink)}</a></p>`
            });
            emailDispatched = emailRes.sent;
          }

          sendJson(res, 200, { ok: true, emailDispatched });
          return;
        }

        // 7. Password Reset Completion (by recovery token OR active signed-in email)
        if (req.method === 'POST' && urlPath === '/api/pawelle-sync/auth/complete-reset') {
          if (!checkRateLimit(clientIp, 'auth', 15, 60_000)) {
            sendJson(res, 429, { error: 'Too many password updates. Please wait a minute.' });
            return;
          }

          const body = await readJsonBody(req);
          const token = typeof body?.token === 'string' ? body.token.trim() : '';
          const directEmail = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
          const newPassword = String(body?.newPassword || '');

          if (newPassword.length < 8) {
            sendJson(res, 400, { error: 'New password must be at least 8 characters long.' });
            return;
          }

          let targetEmail = '';
          if (token) {
            const tHash = hashToken(token);
            const record = db.passwordResets?.[tHash];
            if (!record || record.expiresAt < Date.now()) {
              sendJson(res, 400, { error: 'This password reset link is invalid or has expired. Please request a new one.' });
              return;
            }
            targetEmail = record.email;
            delete db.passwordResets![tHash];
          } else if (directEmail && db.registeredUsers[directEmail]) {
            targetEmail = directEmail;
          } else {
            sendJson(res, 400, { error: 'Invalid or missing password reset authorization.' });
            return;
          }

          if (!db.registeredUsers[targetEmail]) {
            sendJson(res, 404, { error: 'Registered account not found.' });
            return;
          }

          db.registeredUsers[targetEmail].passwordHash = hashPassword(newPassword);
          saveDb();
          sendJson(res, 200, { ok: true });
          return;
        }

        // 8. Cross-device Customer Profile Updates & Sync
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

        // 9. Transactional Notification Dispatch Hook (Appointments, Orders, Inquiry Replies)
        if (req.method === 'POST' && urlPath === '/api/pawelle-sync/email') {
          if (!checkRateLimit(clientIp, 'email', 30, 60_000)) {
            sendJson(res, 429, { error: 'Email rate limit exceeded.' });
            return;
          }
          const body = await readJsonBody(req);
          const to = String(body?.to || '').trim();
          const subject = String(body?.subject || '').trim();
          const message = String(body?.message || '').trim();

          if (!to || !subject || !message) {
            sendJson(res, 400, { error: 'Missing email recipient, subject, or message.' });
            return;
          }

          const result = await sendTransactionalEmail({
            to,
            subject,
            html: `<div style="font-family: Georgia, serif; color: #1f2421; line-height: 1.6;"><h2 style="color: #1e3f35;">PAWELLE Sanctuary</h2><p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p></div>`
          });
          sendJson(res, 200, { ok: true, ...result });
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
