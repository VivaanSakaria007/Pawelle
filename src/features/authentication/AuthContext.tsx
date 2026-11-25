import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { dbStore } from '../../services/store';

export interface PermittedProfileUpdates {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  authError: string | null;
  clearError: () => void;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (email: string, password: string, fullName: string, phone?: string) => Promise<{ needsEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  completePasswordReset: (newPassword: string) => Promise<void>;
  updateProfile: (updates: PermittedProfileUpdates) => Promise<void>;
  isMockEnvironment: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AUTH_GUEST_INTENT_KEY = 'pawelle_auth_guest_intent';
export const AUTH_LOGOUT_MARKER_KEY = 'pawelle_explicit_logout';

export function clearTransientAuthNavigationState(): void {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(AUTH_GUEST_INTENT_KEY);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('pawelle_last_route');
      localStorage.removeItem('pawelle_account_tab');
    }
  } catch {
    // ignore storage restrictions
  }
}

// Offline sandbox accounts for verification when Supabase credentials are absent
// Note: Password validation is enforced even in sandbox mode to avoid bypass vulnerabilities
const SANDBOX_ACCOUNTS: Record<string, { profile: UserProfile; passwordHash: string }> = {
  'director@pawelle.com': {
    profile: {
      id: 'usr-sandbox-admin',
      email: 'director@pawelle.com',
      full_name: 'Alexander Hawthorne',
      phone: '+44 20 7946 0800',
      role: 'admin',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      created_at: '2026-01-01T08:00:00Z'
    },
    passwordHash: 'PawelleAdmin2026!'
  },
  'clara.vance@pawelle.com': {
    profile: {
      id: 'usr-sandbox-staff',
      email: 'clara.vance@pawelle.com',
      full_name: 'Clara Vance',
      phone: '+44 20 7946 0812',
      role: 'staff',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      created_at: '2026-08-15T09:00:00Z'
    },
    passwordHash: 'PawelleStaff2026!'
  },
  'jessica.vance@example.com': {
    profile: {
      id: 'usr-demo-customer',
      email: 'jessica.vance@example.com',
      full_name: 'Jessica Vance',
      phone: '+44 7946 0991',
      role: 'customer',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      created_at: '2026-09-01T10:00:00Z'
    },
    passwordHash: 'PawelleClient2026!'
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // CRITICAL SECURITY FIX: Never default to Jessica Vance or any demo user! Default is ALWAYS null (guest)
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearError = () => setAuthError(null);

  // Initialize session restoration
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      setIsLoading(true);

      const client = supabase;
      if (isSupabaseConfigured && client) {
        try {
          const { data: { session }, error: sessionError } = await client.auth.getSession();
          if (sessionError) throw sessionError;

          if (session?.user && isMounted) {
            // Load user profile securely from Supabase database
            const { data: profile, error: profileError } = await client
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (!profileError && profile) {
              // Ensure role is server-validated
              const resolved: UserProfile = {
                id: profile.id,
                email: profile.email || session.user.email || '',
                full_name: profile.full_name || '',
                phone: profile.phone,
                avatar_url: profile.avatar_url,
                role: (profile.role as UserRole) || 'customer',
                created_at: profile.created_at || new Date().toISOString()
              };
              setUser(resolved);
              dbStore.upsertCustomerProfile(resolved);
            } else {
              // Fallback to basic session user if profile record is still provisioning
              const fallbackUser: UserProfile = {
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || 'Valued Client',
                phone: session.user.user_metadata?.phone,
                role: 'customer',
                created_at: session.user.created_at
              };
              setUser(fallbackUser);
              dbStore.upsertCustomerProfile(fallbackUser);
            }
          } else if (isMounted) {
            setUser(null);
          }
        } catch (err: any) {
          console.warn('[PAWELLE Auth] Session restoration warning:', err.message);
          if (isMounted) setUser(null);
        } finally {
          if (isMounted) setIsLoading(false);
        }

        // Subscribe to auth state updates (token refresh, sign out, password recovery)
        const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
          if (!isMounted) return;

          if (event === 'SIGNED_OUT' || !session) {
            setUser(null);
          } else if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) {
            const { data: profile } = await client
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              const updatedProfile: UserProfile = {
                id: profile.id,
                email: profile.email || session.user.email || '',
                full_name: profile.full_name || '',
                phone: profile.phone,
                avatar_url: profile.avatar_url,
                role: (profile.role as UserRole) || 'customer',
                created_at: profile.created_at || new Date().toISOString()
              };
              setUser(updatedProfile);
              dbStore.upsertCustomerProfile(updatedProfile);
            }
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } else {
        // Mock / Sandbox environment check
        try {
          const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('pawelle_sandbox_session') : null;
          if (stored) {
            const parsed = JSON.parse(stored);
            // Verify structure
            if (parsed && parsed.id && parsed.email && parsed.role) {
              setUser(parsed);
              dbStore.upsertCustomerProfile(parsed);
            } else {
              localStorage.removeItem('pawelle_sandbox_session');
            }
          }
        } catch {
          // ignore parsing error
        } finally {
          if (isMounted) setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Secure Sign In
  const login = async (email: string, password: string): Promise<UserProfile> => {
    setIsLoggingOut(false);
    setIsLoading(true);
    setAuthError(null);

    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(AUTH_LOGOUT_MARKER_KEY);
      }
    } catch {
      // ignore
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setIsLoading(false);
      const err = 'Please provide both your registered email address and password.';
      setAuthError(err);
      throw new Error(err);
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (error) throw error;
        if (!data.user) throw new Error('Authentication succeeded but no user identity was returned.');

        // Load profile from database
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        let resolvedUser: UserProfile;
        if (profileErr || !profile) {
          // Default to customer role if trigger is delayed
          resolvedUser = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            full_name: data.user.user_metadata?.full_name || 'Client',
            phone: data.user.user_metadata?.phone,
            role: 'customer',
            created_at: data.user.created_at
          };
        } else {
          resolvedUser = profile as UserProfile;
        }

        setUser(resolvedUser);
        dbStore.upsertCustomerProfile(resolvedUser);
        return resolvedUser;
      } else {
        // Offline / LAN Synced Server Verification
        if (SANDBOX_ACCOUNTS[cleanEmail]) {
          const sandboxAcc = SANDBOX_ACCOUNTS[cleanEmail];
          if (sandboxAcc.passwordHash !== password) {
            throw new Error('Invalid email or password. Please check your password and try again.');
          }
          setUser(sandboxAcc.profile);
          dbStore.upsertCustomerProfile(sandboxAcc.profile);
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('pawelle_sandbox_session', JSON.stringify(sandboxAcc.profile));
          }
          return sandboxAcc.profile;
        }

        // First try shared Vite sync server (allows login from another Chrome profile or friend's phone!)
        if (typeof fetch === 'function' && typeof window !== 'undefined' && /^https?:/.test(window.location?.origin || '')) {
          try {
            const syncRes = await fetch('/api/pawelle-sync/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: cleanEmail,
                password,
                initialCustomers: dbStore.getInitialCustomers()
              })
            });
            const syncContentType = syncRes.headers.get('content-type') || '';
            if (syncContentType.includes('application/json')) {
              const syncData = await syncRes.json();
              if (syncRes.ok && syncData?.profile) {
                const syncedProfile = syncData.profile as UserProfile;
                setUser(syncedProfile);
                dbStore.upsertCustomerProfile(syncedProfile, false);
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem('pawelle_sandbox_session', JSON.stringify(syncedProfile));
                }
                return syncedProfile;
              }
              if (syncRes.status === 401) {
                throw new Error(syncData?.error || 'Invalid email or password. Please check your password and try again.');
              }
              // 404 falls through to local cache check in case user registered purely offline
            }
          } catch (syncErr: any) {
            if (syncErr?.message?.includes('Invalid email or password')) {
              throw syncErr;
            }
          }
        }

        const registeredUsersKey = 'pawelle_sandbox_registered_users';
        let customUsers: Record<string, { profile: UserProfile; passwordHash: string }> = {};
        try {
          const stored = localStorage.getItem(registeredUsersKey);
          if (stored) customUsers = JSON.parse(stored);
        } catch {
          // ignore
        }

        const account = customUsers[cleanEmail] || SANDBOX_ACCOUNTS[cleanEmail];

        if (!account) {
          throw new Error('Invalid email or password. Please verify your credentials or register for an account.');
        }

        if (account.passwordHash !== password) {
          throw new Error('Invalid email or password. Please check your password and try again.');
        }

        setUser(account.profile);
        dbStore.upsertCustomerProfile(account.profile);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('pawelle_sandbox_session', JSON.stringify(account.profile));
        }
        return account.profile;
      }
    } catch (err: any) {
      const msg = err.message || 'An error occurred during authentication.';
      setAuthError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Secure Registration
  const register = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ): Promise<{ needsEmailConfirmation?: boolean }> => {
    setIsLoading(true);
    setAuthError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanEmail || !password || !cleanName) {
      setIsLoading(false);
      const err = 'Please complete all required fields (Full Name, Email, Password).';
      setAuthError(err);
      throw new Error(err);
    }

    if (password.length < 8) {
      setIsLoading(false);
      const err = 'Password must be at least 8 characters long for security.';
      setAuthError(err);
      throw new Error(err);
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanName,
              phone: phone?.trim() || null
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          // Create or set user profile
          const newProfile: UserProfile = {
            id: data.user.id,
            email: cleanEmail,
            full_name: cleanName,
            phone: phone?.trim(),
            role: 'customer', // strictly customer on public registration
            created_at: new Date().toISOString()
          };
          dbStore.upsertCustomerProfile(newProfile);
          if (data.session) {
            setUser(newProfile);
          }
        }

        return { needsEmailConfirmation: !data.session };
      } else {
        // Shared Vite LAN / multi-profile registration with localStorage fallback
        if (typeof fetch === 'function' && typeof window !== 'undefined' && /^https?:/.test(window.location?.origin || '')) {
          try {
            const syncRes = await fetch('/api/pawelle-sync/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: cleanEmail,
                password,
                fullName: cleanName,
                phone: phone?.trim(),
                initialCustomers: dbStore.getInitialCustomers()
              })
            });
            const syncContentType = syncRes.headers.get('content-type') || '';
            if (syncContentType.includes('application/json')) {
              const syncData = await syncRes.json();
              if (!syncRes.ok) {
                throw new Error(syncData?.error || 'Registration failed. Please check your information.');
              }
              const newProfile = syncData.profile as UserProfile;
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem('pawelle_sandbox_session', JSON.stringify(newProfile));
              }
              dbStore.upsertCustomerProfile(newProfile, false);
              setUser(newProfile);
              return { needsEmailConfirmation: false };
            }
          } catch (syncErr: any) {
            if (syncErr?.message && !syncErr.message.includes('Failed to fetch') && !syncErr.message.includes('NetworkError')) {
              throw syncErr;
            }
          }
        }

        // Offline sandbox registration fallback
        const registeredUsersKey = 'pawelle_sandbox_registered_users';
        let customUsers: Record<string, { profile: UserProfile; passwordHash: string }> = {};
        try {
          const stored = localStorage.getItem(registeredUsersKey);
          if (stored) customUsers = JSON.parse(stored);
        } catch {
          // ignore
        }

        if (customUsers[cleanEmail] || SANDBOX_ACCOUNTS[cleanEmail]) {
          throw new Error('An account with this email address is already registered. Please sign in instead.');
        }

        const newProfile: UserProfile = {
          id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          email: cleanEmail,
          full_name: cleanName,
          phone: phone?.trim(),
          role: 'customer', // Self-registration ALWAYS assigns customer role
          created_at: new Date().toISOString()
        };

        customUsers[cleanEmail] = {
          profile: newProfile,
          passwordHash: password
        };

        localStorage.setItem(registeredUsersKey, JSON.stringify(customUsers));
        localStorage.setItem('pawelle_sandbox_session', JSON.stringify(newProfile));
        dbStore.upsertCustomerProfile(newProfile);
        setUser(newProfile);

        return { needsEmailConfirmation: false };
      }
    } catch (err: any) {
      const msg = err.message || 'Registration failed. Please check your information.';
      setAuthError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Out — clears all user-scoped session & transient route state cleanly
  const logout = async () => {
    setIsLoggingOut(true);
    setIsLoading(true);
    setAuthError(null);
    clearTransientAuthNavigationState();

    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(AUTH_LOGOUT_MARKER_KEY, '1');
      }
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('pawelle_sandbox_session');
      }
      setUser(null);
    } catch (err: any) {
      console.error('[PAWELLE Auth] Logout error:', err);
      // Ensure user is cleared even if network fails
      setUser(null);
    } finally {
      setIsLoading(false);
      setIsLoggingOut(false);
    }
  };

  // Password Reset Request
  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);
    setAuthError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setIsLoading(false);
      throw new Error('Please enter your registered email address.');
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/reset-password`
        });
        if (error) throw error;
      } else {
        // Offline sandbox simulation: verify email exists
        const registeredUsersKey = 'pawelle_sandbox_registered_users';
        let customUsers: Record<string, any> = {};
        try {
          const stored = localStorage.getItem(registeredUsersKey);
          if (stored) customUsers = JSON.parse(stored);
        } catch {
          // ignore
        }
        if (!customUsers[cleanEmail] && !SANDBOX_ACCOUNTS[cleanEmail]) {
          // To prevent user enumeration in production, we still return gracefully,
          // but simulate success
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to send password reset email.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Password Reset Completion
  const completePasswordReset = async (newPassword: string) => {
    setIsLoading(true);
    setAuthError(null);

    if (!newPassword || newPassword.length < 8) {
      setIsLoading(false);
      throw new Error('New password must be at least 8 characters long.');
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
      } else {
        if (!user) throw new Error('No active password reset session found.');
        // Update sandbox stored password
        const registeredUsersKey = 'pawelle_sandbox_registered_users';
        let customUsers: Record<string, any> = {};
        try {
          const stored = localStorage.getItem(registeredUsersKey);
          if (stored) customUsers = JSON.parse(stored);
          if (customUsers[user.email]) {
            customUsers[user.email].passwordHash = newPassword;
            localStorage.setItem(registeredUsersKey, JSON.stringify(customUsers));
          }
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to update password.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Permitted Profile Updates (strictly excludes role modification!)
  const updateProfile = async (updates: PermittedProfileUpdates) => {
    if (!user) throw new Error('Authentication required to update profile.');
    setIsLoading(true);
    setAuthError(null);

    // Sanitize updates: strictly whitelisted fields only
    const safeUpdates: Partial<UserProfile> = {};
    if (typeof updates.full_name === 'string') safeUpdates.full_name = updates.full_name.trim();
    if (typeof updates.phone === 'string') safeUpdates.phone = updates.phone.trim();
    if (typeof updates.avatar_url === 'string') safeUpdates.avatar_url = updates.avatar_url.trim();

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('profiles')
          .update(safeUpdates)
          .eq('id', user.id);

        if (error) throw error;

        // Also update Supabase auth metadata if full_name or phone changed
        await supabase.auth.updateUser({
          data: {
            full_name: safeUpdates.full_name || user.full_name,
            phone: safeUpdates.phone || user.phone
          }
        });
      }

      const updatedUser: UserProfile = {
        ...user,
        ...safeUpdates
      };

      setUser(updatedUser);
      dbStore.upsertCustomerProfile(updatedUser);

      if (!isSupabaseConfigured && typeof window !== 'undefined' && typeof fetch === 'function' && /^https?:/.test(window.location?.origin || '')) {
        void fetch('/api/pawelle-sync/auth/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            email: updatedUser.email,
            profile: updatedUser,
            initialCustomers: dbStore.getInitialCustomers()
          })
        }).catch(() => {});
      }

      if (!isSupabaseConfigured && typeof localStorage !== 'undefined') {
        localStorage.setItem('pawelle_sandbox_session', JSON.stringify(updatedUser));
        try {
          const regKey = 'pawelle_sandbox_registered_users';
          const raw = localStorage.getItem(regKey);
          if (raw) {
            const customUsers = JSON.parse(raw);
            if (customUsers[updatedUser.email]) {
              customUsers[updatedUser.email].profile = updatedUser;
              localStorage.setItem(regKey, JSON.stringify(customUsers));
            }
          }
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to update profile.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const role: UserRole = user ? user.role : 'guest';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: Boolean(user),
        isLoading,
        isLoggingOut,
        authError,
        clearError,
        login,
        register,
        logout,
        requestPasswordReset,
        completePasswordReset,
        updateProfile,
        isMockEnvironment: !isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
