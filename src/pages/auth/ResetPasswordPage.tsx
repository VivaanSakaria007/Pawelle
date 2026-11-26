import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../features/authentication/AuthContext';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { PawelleLogo } from '../../components/common/PawelleLogo';

export const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const { completePasswordReset, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const recoveryToken = searchParams.get('token') || undefined;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      await completePasswordReset(newPassword, recoveryToken);
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update password.');
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
            <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Create New Password</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Choose a strong password for your PAWELLE account.
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

          {success ? (
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'var(--color-success-bg)', borderRadius: 'var(--radius-md)', color: 'var(--color-success)' }}>
              <CheckCircle2 size={36} style={{ marginInline: 'auto', marginBottom: '12px' }} />
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>Password Successfully Updated</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', margin: 0 }}>
                Your account password has been updated. You can now log in with your new credentials.
              </p>
              <Link to="/login" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>
                Sign In Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="reset-new-password" className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reset-new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="form-input"
                    style={{ paddingInlineStart: '38px' }}
                  />
                  <Lock size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '12px', color: 'var(--color-text-secondary)' }} />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="reset-confirm-password" className="form-label">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reset-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="form-input"
                    style={{ paddingInlineStart: '38px' }}
                  />
                  <Lock size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '12px', color: 'var(--color-text-secondary)' }} />
                </div>
                <label
                  htmlFor="show-reset-password"
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
                    id="show-reset-password"
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
                {isLoading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
