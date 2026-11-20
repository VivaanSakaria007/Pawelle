import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/authentication/AuthContext';
import { RoleSwitcherBanner } from '../components/navigation/RoleSwitcherBanner';
import { Header } from '../components/navigation/Header';
import {
  BarChart3,
  Calendar,
  Users,
  Heart,
  Scissors,
  UserCheck,
  Package,
  ShoppingBag,
  MessageSquare,
  Star,
  FileText,
  Settings,
  LogOut,
  Shield,
  Menu,
  X
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin', label: 'Analytics & Overview', icon: BarChart3, end: true },
    { to: '/admin/appointments', label: 'Appointments Manager', icon: Calendar },
    { to: '/admin/customers', label: 'Customer Directory', icon: Users },
    { to: '/admin/pets', label: 'Registered Pets', icon: Heart },
    { to: '/admin/services', label: 'Services & Pricing', icon: Scissors },
    { to: '/admin/staff', label: 'Staff & Rosters', icon: UserCheck },
    { to: '/admin/products', label: 'Products & Stock', icon: Package },
    { to: '/admin/orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
    { to: '/admin/messages', label: 'Client Inquiries', icon: MessageSquare },
    { to: '/admin/reviews', label: 'Reviews Moderation', icon: Star },
    { to: '/admin/blog', label: 'Journal Articles', icon: FileText },
    { to: '/admin/settings', label: 'Studio Settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
      <RoleSwitcherBanner />
      <Header />

      <div className="container" style={{ flex: 1, paddingBlock: '32px' }}>
        {/* Mobile Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }} className="mobile-admin-toggle">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-secondary btn-sm"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            <span>Admin Navigation Menu</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '32px', alignItems: 'start' }} className="admin-dash-grid">
          {/* Sidebar */}
          <aside
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)'
            }}
            className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid var(--color-border)', marginBottom: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(40, 59, 50, 0.12)',
                color: 'var(--color-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '1.1rem'
              }}>
                <Shield size={20} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                  {user?.full_name || 'Administrator'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-forest)', fontWeight: 600 }}>
                  DIRECTORATE ACCESS
                </div>
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--color-forest)' : 'var(--color-text-secondary)',
                      backgroundColor: isActive ? 'var(--color-forest-soft)' : 'transparent'
                    })}
                  >
                    <Icon size={16} />
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
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    color: 'var(--color-danger)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'start'
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Area */}
          <main style={{ minWidth: 0 }}>
            <Outlet />
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .admin-dash-grid {
            grid-template-columns: 1fr !important;
          }
          .admin-sidebar {
            display: none;
          }
          .admin-sidebar.open {
            display: block !important;
            margin-bottom: 24px;
          }
        }
        @media (min-width: 961px) {
          .mobile-admin-toggle {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
