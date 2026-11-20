import React from 'react';
import { useAuth } from '../../features/authentication/AuthContext';
import { UserRole } from '../../types';
import { Shield, User, Scissors, Eye, LucideIcon } from 'lucide-react';

export const RoleSwitcherBanner: React.FC = () => {
  const { role, switchRole, user } = useAuth();

  const roles: { id: UserRole; label: string; icon: LucideIcon }[] = [
    { id: 'guest', label: 'Guest Explorer', icon: Eye },
    { id: 'customer', label: 'Customer', icon: User },
    { id: 'staff', label: 'Staff / Groomer', icon: Scissors },
    { id: 'admin', label: 'Administrator', icon: Shield },
  ];

  return (
    <aside aria-label="Environment Role Switcher" style={{
      backgroundColor: 'var(--color-forest)',
      color: 'var(--color-sand-light)',
      fontSize: '0.825rem',
      paddingBlock: '6px',
      borderBottom: '1px solid rgba(214, 199, 173, 0.2)',
      position: 'relative',
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(214, 199, 173, 0.15)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            fontSize: '0.725rem'
          }}>
            <Shield size={12} /> Active Role
          </span>
          <span style={{ color: 'var(--color-text-inverse)' }}>
            Viewing as <strong>{role.toUpperCase()}</strong> {user ? `(${user.full_name})` : '(Not signed in)'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ opacity: 0.8, fontSize: '0.775rem' }}>Switch perspective:</span>
          <div style={{ display: 'inline-flex', gap: '4px' }}>
            {roles.map(r => {
              const Icon = r.icon;
              const isActive = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => switchRole(r.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 600 : 400,
                    border: isActive ? '1px solid var(--color-sand)' : '1px solid transparent',
                    backgroundColor: isActive ? 'rgba(214, 199, 173, 0.25)' : 'transparent',
                    color: isActive ? 'var(--color-text-inverse)' : 'var(--color-sand)',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                  title={`Switch active viewing role to ${r.label}`}
                >
                  <Icon size={12} />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
