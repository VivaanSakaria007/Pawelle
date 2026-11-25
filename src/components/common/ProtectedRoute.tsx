import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import {
  useAuth,
  AUTH_LOGOUT_MARKER_KEY
} from '../../features/authentication/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
  redirectTo?: string;
}

/**
 * Enterprise-grade Route Authorization Guard
 * 
 * Enforces role-based access control (RBAC):
 * - Loading State: Waits for Supabase Auth session restoration to complete
 * - Unauthenticated: Redirects to /login preserving intended destination
 * - Role Mismatch: Fails closed and blocks unauthorized role escalation
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
  redirectTo = '/login'
}) => {
  const { user, role, isAuthenticated, isLoading, isLoggingOut } = useAuth();
  const location = useLocation();

  // 1. Session Restoration / Verification Loading State
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '16px',
          padding: '40px'
        }}
        aria-live="polite"
        aria-busy="true"
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            border: '3px solid var(--color-border)',
            borderTopColor: 'var(--color-forest)',
            borderRadius: '50%',
            animation: 'pawelle-spin 1s linear infinite'
          }}
        />
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Verifying security credentials...
        </p>
        <style>{`
          @keyframes pawelle-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 2. Unauthenticated check (Fail Closed)
  if (!isAuthenticated || !user) {
    let wasExplicitLogout = isLoggingOut;
    try {
      if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(AUTH_LOGOUT_MARKER_KEY) === '1') {
        wasExplicitLogout = true;
      }
    } catch {
      // ignore
    }

    // Never preserve User A's Account Center path across logout
    if (wasExplicitLogout) {
      return <Navigate to={redirectTo} replace />;
    }

    // Only allow post-login redirect back to intentional booking action (not arbitrary portal subsections)
    const fullTarget = location.pathname + location.search;
    if (location.pathname === '/customer/booking' || location.pathname === '/checkout') {
      const returnUrl = encodeURIComponent(fullTarget);
      return <Navigate to={`${redirectTo}?redirect=${returnUrl}`} replace />;
    }

    return <Navigate to={redirectTo} replace />;
  }

  // 3. Role Authorization check
  const hasPermission = allowedRoles.includes(role);

  if (!hasPermission) {
    return (
      <div
        className="container section"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          maxWidth: '560px',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}
        >
          <ShieldAlert size={32} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', marginBottom: '12px' }}>
          Access Restricted
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
          Your current account role (<strong>{role}</strong>) does not have authorization to view this protected zone.
          This administrative boundary is secured and monitored.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-secondary">
            <ArrowLeft size={16} /> Return to Homepage
          </Link>
          {role === 'customer' && (
            <Link to="/customer" className="btn btn-primary">
              Client Portal
            </Link>
          )}
          {role === 'staff' && (
            <Link to="/staff" className="btn btn-primary">
              Staff Portal
            </Link>
          )}
          {role === 'admin' && (
            <Link to="/admin" className="btn btn-primary">
              Admin Portal
            </Link>
          )}
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
