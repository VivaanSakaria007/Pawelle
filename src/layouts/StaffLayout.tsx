import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/authentication/AuthContext';
import { Header } from '../components/navigation/Header';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Heart,
  LogOut,
  Scissors,
  Menu,
  X
} from 'lucide-react';

export const StaffLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [user?.id]);

  const handleLogout = async () => {
    setSidebarOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const navLinks = [
    { to: '/staff', label: 'Staff Portal', icon: LayoutDashboard, end: true },
    { to: '/staff/appointments', label: 'Studio Schedule', icon: Calendar },
    { to: '/staff/grooming-records', label: 'Create Grooming Record', icon: Sparkles },
    { to: '/staff/pet-directory', label: 'Pet Care & Allergy Notes', icon: Heart },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
      <Header />

      <div className="container" style={{ flex: 1, paddingBlock: '32px' }}>
        {/* Mobile Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }} className="mobile-staff-toggle">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-secondary btn-sm"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            <span>Staff Menu</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', alignItems: 'start' }} className="staff-dash-grid">
          {/* Sidebar */}
          <aside
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)'
            }}
            className={`staff-sidebar ${sidebarOpen ? 'open' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid var(--color-border)', marginBottom: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(166, 91, 70, 0.15)',
                color: 'var(--color-terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '1.1rem'
              }}>
                <Scissors size={20} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                  {user?.full_name || 'Staff Member'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-terracotta)', fontWeight: 600 }}>
                  STAFF / GROOMER PORTAL
                </div>
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {navLinks.map(link => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={() => setSidebarOpen(false)}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--color-forest)' : 'var(--color-text-secondary)',
                      backgroundColor: isActive ? 'var(--color-forest-soft)' : 'transparent'
                    })}
                  >
                    <Icon size={18} />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    color: 'var(--color-danger)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'start'
                  }}
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Area — keyed by user identity */}
          <main style={{ minWidth: 0 }}>
            <Outlet key={user?.id || 'guest'} />
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .staff-dash-grid {
            grid-template-columns: 1fr !important;
          }
          .staff-sidebar {
            display: none;
          }
          .staff-sidebar.open {
            display: block !important;
            margin-bottom: 24px;
          }
        }
        @media (min-width: 901px) {
          .mobile-staff-toggle {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
