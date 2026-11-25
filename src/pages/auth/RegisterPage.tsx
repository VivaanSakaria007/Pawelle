import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useAuth,
  AUTH_LOGOUT_MARKER_KEY,
  clearTransientAuthNavigationState
} from '../../features/authentication/AuthContext';
import { Lock, Mail, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { PawelleLogo } from '../../components/common/PawelleLogo';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim();
    const cleanName = fullName.trim();

    if (!cleanName || !cleanEmail || !password) {
      setErrorMsg('Please complete all mandatory fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    try {
      clearTransientAuthNavigationState();
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem(AUTH_LOGOUT_MARKER_KEY);
        }
      } catch {
        // ignore
      }
      const result = await register(cleanEmail, password, cleanName, phone.trim() || undefined);
      if (result.needsEmailConfirmation) {
        setNeedsConfirmation(true);
      } else {
        navigate('/customer', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check information.');
    }
  };

  if (needsConfirmation) {
    return (
      <div className="section" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container-narrow" style={{ maxWidth: '520px' }}>
          <div className="card-surface" style={{ padding: 'clamp(28px, 5vw, 44px)', textAlign: 'center' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h1 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Verification Email Dispatched</h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              We have sent a secure confirmation link to <strong>{email}</strong>. Please check your inbox and verify your email address to activate your PAWELLE sanctuary profile.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Proceed to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container-narrow" style={{ maxWidth: '520px' }}>
        <div className="card-surface" style={{ padding: 'clamp(28px, 5vw, 44px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
              <PawelleLogo height="40px" />
            </Link>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Create Your Sanctuary Profile</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Join the PAWELLE family to manage multiple pet profiles and track grooming histories.
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
              <label htmlFor="reg-fullname" className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jessica Vance"
                  className="form-input"
                  style={{ paddingInlineStart: '38px' }}
                />
                <User size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '12px', color: 'var(--color-text-secondary)' }} />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="reg-email" className="form-label">Email Address *</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-email"
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
              <label htmlFor="reg-phone" className="form-label">Phone Number (Optional)</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7946 0991"
                  className="form-input"
                  style={{ paddingInlineStart: '38px' }}
                />
                <Phone size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '12px', color: 'var(--color-text-secondary)' }} />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="reg-password" className="form-label">Password * (Minimum 8 characters)</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingInlineStart: '38px' }}
                />
                <Lock size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '12px', color: 'var(--color-text-secondary)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
            >
              {isLoading ? 'Creating Profile...' : 'Complete Registration'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Already registered?{' '}
              <Link to="/login" style={{ color: 'var(--color-forest)', fontWeight: 600 }}>
                Sign In Instead
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
