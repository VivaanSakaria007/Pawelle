import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/authentication/AuthContext';
import { Header } from '../components/navigation/Header';
import {
  LayoutDashboard,
  Heart,
  Calendar,
  ShoppingBag,
  Sparkles,
  Settings,
  Scissors,
  Bookmark,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close mobile sidebar and reset layout state on user identity switch
  useEffect(() => {
    setSidebarOpen(false);
  }, [user?.id]);

  const handleLogout = async () => {
    setSidebarOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const navLinks = [
    { to: '/customer', label: 'Dashboard Overview', icon: LayoutDashboard, end: true },
    { to: '/customer/pets', label: 'My Pet Profiles', icon: Heart },
    { to: '/customer/booking', label: 'Book Grooming Session', icon: Calendar },
    { to: '/customer/appointments', label: 'My Appointments', icon: Scissors },
    { to: '/customer/grooming-records', label: 'Grooming Records', icon: Sparkles },
    { to: '/customer/orders', label: 'Order History', icon: ShoppingBag },
    { to: '/customer/wishlist', label: 'Saved Wishlist', icon: Bookmark },
    { to: '/customer/settings', label: 'Account & Care Preferences', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
      <Header />

      <div className="container" style={{ flex: 1, paddingBlock: '32px' }}>
        {/* Mobile Sidebar Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }} className="mobile-dash-nav-toggle">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            <span>Customer Navigation Menu</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', alignItems: 'start' }} className="customer-dash-grid">
          {/* Dashboard Sidebar */}
          <aside
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)'
            }}
            className={`customer-sidebar ${sidebarOpen ? 'open' : ''}`}
          >
            {/* User Mini Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid var(--color-border)', marginBottom: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-forest-soft)',
                color: 'var(--color-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '1.1rem'
              }}>
                {user?.full_name ? user.full_name[0] : 'C'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.full_name || 'Valued Customer'}
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email || 'customer@pawelle.com'}
                </div>
              </div>
            </div>

            {/* Navigation Links */}
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
                      backgroundColor: isActive ? 'var(--color-forest-soft)' : 'transparent',
                      transition: 'all var(--transition-fast)'
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

          {/* Main Content Area — keyed by user identity so no previous user's state ever persists */}
          <main style={{ minWidth: 0 }}>
            <Outlet key={user?.id || 'guest'} />
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .customer-dash-grid {
            grid-template-columns: 1fr !important;
          }
          .customer-sidebar {
            display: none;
          }
          .customer-sidebar.open {
            display: block !important;
            margin-bottom: 24px;
          }
        }
        @media (min-width: 901px) {
          .mobile-dash-nav-toggle {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
