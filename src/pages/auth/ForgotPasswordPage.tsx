import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/authentication/AuthContext';
import { Mail, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';
import { PawelleLogo } from '../../components/common/PawelleLogo';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { requestPasswordReset, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    try {
      await requestPasswordReset(cleanEmail);
      setSent(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch password recovery email.');
    }
  };

  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container-narrow" style={{ maxWidth: '480px' }}>
        <div className="card-surface" style={{ padding: 'clamp(28px, 5vw, 44px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
              <PawelleLogo height="40px" />
            </Link>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Password Recovery</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Enter your registered email address to receive password reset instructions.
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

          {sent ? (
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'var(--color-success-bg)', borderRadius: 'var(--radius-md)', color: 'var(--color-success)' }}>
              <CheckCircle2 size={36} style={{ marginInline: 'auto', marginBottom: '12px' }} />
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>Reset Link Dispatched</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', margin: 0 }}>
                If an account exists for <strong>{email}</strong>, you will receive an email shortly with a secure password reset link.
              </p>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="recovery-email" className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="recovery-email"
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

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {isLoading ? 'Sending Request...' : 'Send Recovery Instructions'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
