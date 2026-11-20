import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/authentication/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      await login(email, password);
      if (email.includes('admin') || email.includes('director')) {
        navigate('/admin');
      } else if (email.includes('staff') || email.includes('clara')) {
        navigate('/staff');
      } else {
        navigate('/customer');
      }
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
              <img src="/assets/logos/pawelle-logo.svg" alt="PAWELLE" style={{ height: '40px', width: 'auto' }} />
            </Link>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Sign in to PAWELLE</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Access your pet profiles, grooming records, and upcoming rituals.
            </p>
          </div>

          {errorMsg && (
            <div style={{ padding: '12px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '20px' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
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
                <label className="form-label">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--color-terracotta)' }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
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
              {isLoading ? 'Signing in...' : 'Sign In to Account'}
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--color-border)', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            Do not have an account?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-forest)' }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
