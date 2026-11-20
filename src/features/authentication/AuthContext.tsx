import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, fullName: string, phone?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const DEMO_USERS: Record<Exclude<UserRole, 'guest'>, UserProfile> = {
  customer: {
    id: 'usr-demo-customer',
    email: 'jessica.vance@example.com',
    full_name: 'Jessica Vance',
    phone: '+44 7946 0991',
    role: 'customer',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    created_at: '2026-09-01T10:00:00Z'
  },
  staff: {
    id: 'usr-staff-1',
    email: 'clara.vance@pawelle.com',
    full_name: 'Clara Vance',
    phone: '+44 20 7946 0812',
    role: 'staff',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    created_at: '2026-08-15T09:00:00Z'
  },
  admin: {
    id: 'usr-admin-1',
    email: 'director@pawelle.com',
    full_name: 'Alexander Hawthorne',
    phone: '+44 20 7946 0800',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    created_at: '2026-01-01T08:00:00Z'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('pawelle_auth_user');
      return stored ? JSON.parse(stored) : DEMO_USERS.customer;
    } catch {
      return DEMO_USERS.customer;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pawelle_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pawelle_auth_user');
    }
  }, [user]);

  // Handle Supabase Auth sync if configured
  useEffect(() => {
    const client = supabase;
    if (isSupabaseConfigured && client) {
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          // fetch profile
          client
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) setUser(data as UserProfile);
            });
        }
      });

      const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (email: string, _password?: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase && _password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password: _password });
        if (error) throw error;
      } else {
        // Find matching role demo or create session
        if (email.includes('admin') || email.includes('director')) {
          setUser(DEMO_USERS.admin);
        } else if (email.includes('staff') || email.includes('clara')) {
          setUser(DEMO_USERS.staff);
        } else {
          setUser({
            ...DEMO_USERS.customer,
            email,
            full_name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase())
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, fullName: string, phone?: string, _password?: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase && _password) {
        const { error } = await supabase.auth.signUp({
          email,
          password: _password,
          options: { data: { full_name: fullName, phone } }
        });
        if (error) throw error;
      } else {
        const newUser: UserProfile = {
          id: `usr-${Date.now()}`,
          email,
          full_name: fullName,
          phone,
          role: 'customer',
          created_at: new Date().toISOString()
        };
        setUser(newUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'guest') {
      setUser(null);
    } else {
      setUser(DEMO_USERS[newRole]);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const role: UserRole = user ? user.role : 'guest';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        switchRole,
        updateProfile
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
