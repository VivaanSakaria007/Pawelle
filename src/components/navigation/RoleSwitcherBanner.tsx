import React from 'react';
import { useAuth } from '../../features/authentication/AuthContext';
import { ShieldCheck, Info } from 'lucide-react';

/**
 * Environment Status Banner
 * 
 * In compliance with security requirements:
 * - Completely removes any public Guest / Customer / Staff / Admin role switcher.
 * - Displays ONLY in development mode when Supabase credentials are not configured.
 * - Informs developers/testers of simulated sandbox persistence without granting unauthorized privileges.
 */
export const RoleSwitcherBanner: React.FC = () => {
  const { isMockEnvironment, user, role } = useAuth();

  // In production or when real Supabase is configured, do not render any banner
  if (!isMockEnvironment || !import.meta.env.DEV) {
    return null;
  }

  return (
    <aside
      aria-label="Development Environment Status"
      style={{
        backgroundColor: '#283B32',
        color: '#E7DDCA',
        fontSize: '0.75rem',
        paddingBlock: '4px',
        paddingInline: '16px',
        borderBottom: '1px solid rgba(214, 199, 173, 0.2)',
        position: 'relative',
        zIndex: 99
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Info size={13} style={{ color: '#D6C7AD' }} />
          <span>
            <strong>PAWELLE Sandbox Preview:</strong> Offline data simulation active (Configure VITE_SUPABASE_URL for production cloud backend).
          </span>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ opacity: 0.85 }}>
            Identity: {user ? `${user.full_name} [${role.toUpperCase()}]` : 'Guest Visitor'}
          </span>
          <span
            style={{
              fontSize: '0.675rem',
              padding: '1px 6px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(214, 199, 173, 0.15)',
              border: '1px solid rgba(214, 199, 173, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Fail-Closed
          </span>
        </div>
      </div>
    </aside>
  );
};

export default RoleSwitcherBanner;
