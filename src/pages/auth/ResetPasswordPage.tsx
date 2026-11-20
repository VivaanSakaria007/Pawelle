import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleReset = (e: React.FormEvent) => {
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

    setSuccess(true);
  };

  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container-narrow" style={{ maxWidth: '480px' }}>
        <div className="card-surface" style={{ padding: 'clamp(28px, 5vw, 44px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
              <img src="/assets/logos/pawelle-logo.svg" alt="PAWELLE" style={{ height: '40px', width: 'auto' }} />
            </Link>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Create New Password</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Choose a strong password for your PAWELLE account.
            </p>
          </div>

          {errorMsg && (
            <div style={{ padding: '12px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '20px' }}>
              {errorMsg}
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
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    minLength={8}
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
                <label className="form-label">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="form-input"
                    style={{ paddingInlineStart: '38px' }}
                  />
                  <Lock size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '12px', color: 'var(--color-text-secondary)' }} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
