import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  useAuth,
  AUTH_GUEST_INTENT_KEY,
  AUTH_LOGOUT_MARKER_KEY,
  clearTransientAuthNavigationState
} from '../../features/authentication/AuthContext';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { PawelleLogo } from '../../components/common/PawelleLogo';

export function resolvePostLoginDestination(role: string, rawRedirect: string | null, guestIntent: string | null): string {
  const defaultDashboard = role === 'admin' ? '/admin' : role === 'staff' ? '/staff' : '/customer';

  if (!rawRedirect || !rawRedirect.startsWith('/') || rawRedirect.startsWith('//')) {
    return defaultDashboard;
  }

  const pathname = rawRedirect.split('?')[0];

  // Never restore non-default Account Center subsections (pets, appointments, wishlist, orders, settings, staff, admin)
  const isPublicStorefrontRoute =
    pathname.startsWith('/shop') ||
    pathname === '/cart' ||
    pathname === '/checkout' ||
    pathname.startsWith('/services');

  const isBookingActionForCustomer =
    role === 'customer' && pathname === '/customer/booking';

  if (isPublicStorefrontRoute && guestIntent === rawRedirect) {
    return rawRedirect;
  }

  if (isBookingActionForCustomer && (!guestIntent || guestIntent === rawRedirect)) {
    return rawRedirect;
  }

  // Always land on the user's own Account Center home dashboard
  return defaultDashboard;
}

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, isLoading, isMockEnvironment } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(AUTH_LOGOUT_MARKER_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      const authenticatedUser = await login(cleanEmail, password);

      const params = new URLSearchParams(location.search);
      const redirectUrl = params.get('redirect');
      let guestIntent: string | null = null;
      try {
        if (typeof sessionStorage !== 'undefined') {
          guestIntent = sessionStorage.getItem(AUTH_GUEST_INTENT_KEY);
        }
      } catch {
        // ignore
      }

      clearTransientAuthNavigationState();

      const destination = resolvePostLoginDestination(authenticatedUser.role, redirectUrl, guestIntent);
      navigate(destination, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container-narrow" style={{ maxWidth: '480px' }}>
        <div className="card-surface" style={{ padding: 'clamp(28px, 5vw, 44px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
              <PawelleLogo height="40px" />
            </Link>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Sign in to PAWELLE</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Access your pet profiles, grooming records, and upcoming rituals.
            </p>
          </div>

          {errorMsg && (
            <div
              role="alert"
              style={{
                padding: '12px',
                backgroundColor: 'var(--color-danger-bg)',
                color: 'var(--color-danger)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="login-email" className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jessica.vance@example.com"
                  className="form-input"
                  style={{ paddingInlineStart: '38px' }}
                />
                <Mail size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '12px', color: 'var(--color-text-secondary)' }} />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label htmlFor="login-password" className="form-label">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--color-terracotta)' }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingInlineStart: '38px' }}
                />
                <Lock size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '12px', color: 'var(--color-text-secondary)' }} />
              </div>
              <label
                htmlFor="show-login-password"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '10px',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <input
                  id="show-login-password"
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: 'var(--color-forest)',
                    cursor: 'pointer',
                    margin: 0
                  }}
                />
                <span>Show password</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
            >
              {isLoading ? 'Signing in...' : 'Sign In to Account'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Don't have an account yet?{' '}
              <Link to="/register" style={{ color: 'var(--color-forest)', fontWeight: 600 }}>
                Create Sanctuary Profile
              </Link>
            </div>
          </form>

          {isMockEnvironment && (
            <div
              style={{
                marginTop: '24px',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-bg-subtle)',
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                Sandbox Test Credentials:
              </div>
              <div>• Customer: <code>jessica.vance@example.com</code> / <code>PawelleClient2026!</code></div>
              <div>• Staff: <code>clara.vance@pawelle.com</code> / <code>PawelleStaff2026!</code></div>
              <div>• Admin: <code>director@pawelle.com</code> / <code>PawelleAdmin2026!</code></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
