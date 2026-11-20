import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/authentication/AuthContext';
import { useCart } from '../../features/cart/CartContext';
import { useTheme } from '../common/ThemeContext';
import {
  ShoppingBag,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  User,
  Calendar,
  LogOut,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, role, logout } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme, direction, toggleDirection } = useTheme();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setHomeDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'staff') return '/staff';
    return '/customer';
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        backgroundColor: isScrolled ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)',
        borderBottom: `1px solid ${isScrolled ? 'var(--color-border)' : 'transparent'}`,
        boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'all var(--transition-normal)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '80px'
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'var(--color-forest)'
          }}
          aria-label="PAWELLE Luxury Pet Grooming Home"
        >
          <img
            src="/assets/logos/pawelle-logo.svg"
            alt="PAWELLE"
            style={{ height: '44px', width: 'auto' }}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '28px'
          }}
          className="desktop-nav"
        >
          {/* Home Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setHomeDropdownOpen(true)}
            onMouseLeave={() => setHomeDropdownOpen(false)}
          >
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.975rem',
                fontWeight: location.pathname === '/' || location.pathname === '/niche-spa' ? 600 : 500,
                color: location.pathname === '/' || location.pathname === '/niche-spa' ? 'var(--color-forest)' : 'var(--color-text-primary)',
                cursor: 'pointer',
                paddingBlock: '8px'
              }}
            >
              Home <ChevronDown size={14} />
            </button>
            {homeDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  insetInlineStart: 0,
                  minWidth: '220px',
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <Link
                  to="/"
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                    color: location.pathname === '/' ? 'var(--color-forest)' : 'var(--color-text-primary)',
                    fontWeight: location.pathname === '/' ? 600 : 400,
                    backgroundColor: location.pathname === '/' ? 'var(--color-forest-soft)' : 'transparent'
                  }}
                >
                  Homepage 1 — Flagship Studio
                </Link>
                <Link
                  to="/niche-spa"
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                    color: location.pathname === '/niche-spa' ? 'var(--color-forest)' : 'var(--color-text-primary)',
                    fontWeight: location.pathname === '/niche-spa' ? 600 : 400,
                    backgroundColor: location.pathname === '/niche-spa' ? 'var(--color-forest-soft)' : 'transparent'
                  }}
                >
                  Homepage 2 — Wellness &amp; Spa Retreat
                </Link>
              </div>
            )}
          </div>

          <NavLink
            to="/about"
            style={({ isActive }) => ({
              fontSize: '0.975rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--color-forest)' : 'var(--color-text-primary)'
            })}
          >
            About
          </NavLink>

          <NavLink
            to="/services"
            style={({ isActive }) => ({
              fontSize: '0.975rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--color-forest)' : 'var(--color-text-primary)'
            })}
          >
            Services
          </NavLink>

          <NavLink
            to="/pricing"
            style={({ isActive }) => ({
              fontSize: '0.975rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--color-forest)' : 'var(--color-text-primary)'
            })}
          >
            Pricing
          </NavLink>

          <NavLink
            to="/shop"
            style={({ isActive }) => ({
              fontSize: '0.975rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--color-forest)' : 'var(--color-text-primary)'
            })}
          >
            Shop
          </NavLink>

          <NavLink
            to="/blog"
            style={({ isActive }) => ({
              fontSize: '0.975rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--color-forest)' : 'var(--color-text-primary)'
            })}
          >
            Journal
          </NavLink>

          <NavLink
            to="/contact"
            style={({ isActive }) => ({
              fontSize: '0.975rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--color-forest)' : 'var(--color-text-primary)'
            })}
          >
            Contact
          </NavLink>
        </nav>

        {/* Right Action Icons & Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: 'var(--radius-pill)',
              transition: 'background var(--transition-fast)'
            }}
          >
            {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
          </button>

          {/* RTL Toggle Button */}
          <button
            onClick={toggleDirection}
            aria-label={`Toggle text direction (Current: ${direction.toUpperCase()})`}
            title={`Toggle text direction (Current: ${direction.toUpperCase()})`}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-pill)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border)'
            }}
          >
            <Globe size={15} />
            <span>{direction.toUpperCase()}</span>
          </button>

          {/* Shopping Bag Icon with live item count badge */}
          <Link
            to="/cart"
            aria-label={`Shopping Cart with ${totalItems} items`}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              color: 'var(--color-forest)'
            }}
          >
            <ShoppingBag size={21} />
            {totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  insetInlineEnd: '2px',
                  backgroundColor: 'var(--color-terracotta)',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Account / Dashboard Dropdown */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: '1px solid var(--color-border)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-pill)',
                  cursor: 'pointer',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.875rem'
                }}
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <User size={16} />
                )}
                <span style={{ fontWeight: 500, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.full_name.split(' ')[0]}
                </span>
                <ChevronDown size={14} />
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    insetInlineEnd: 0,
                    minWidth: '200px',
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-md)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    zIndex: 100
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.full_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{user.email}</div>
                  </div>

                  <Link
                    to={getDashboardPath()}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    <User size={15} /> Dashboard
                  </Link>

                  <Link
                    to="/customer/appointments"
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    <Calendar size={15} /> My Appointments
                  </Link>

                  <button
                    onClick={() => logout()}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--color-danger)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'start'
                    }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-ghost btn-sm"
              style={{ display: 'none' }}
              data-auth-login="true"
            >
              Sign In
            </Link>
          )}

          {/* Primary CTA: Book Appointment */}
          <Link
            to="/booking"
            className="btn btn-primary"
            style={{ display: 'none' }}
            data-cta-book="true"
          >
            <Calendar size={16} />
            <span>Book Ritual</span>
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="mobile-menu-btn"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation Drawer"
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            borderTop: '1px solid var(--color-border)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-forest)' }}>
              Homepage 1 — Flagship Studio
            </Link>
            <Link to="/niche-spa" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-forest)' }}>
              Homepage 2 — Wellness &amp; Spa Retreat
            </Link>
            <Link to="/about" style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
              About PAWELLE
            </Link>
            <Link to="/services" style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
              Grooming &amp; Spa Services
            </Link>
            <Link to="/pricing" style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
              Pricing &amp; Memberships
            </Link>
            <Link to="/shop" style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
              Boutique Apothecary Shop
            </Link>
            <Link to="/blog" style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
              The Pet Care Journal
            </Link>
            <Link to="/contact" style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
              Contact &amp; Studio Locations
            </Link>
          </div>

          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/booking" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Calendar size={18} /> Book Appointment
            </Link>
            {user ? (
              <Link to={getDashboardPath()} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                <User size={18} /> Open {role.toUpperCase()} Dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Customer Sign In
              </Link>
            )}
          </div>
        </nav>
      )}

      {/* Responsive Inline CSS for media queries */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
          [data-cta-book="true"] {
            display: inline-flex !important;
          }
          [data-auth-login="true"] {
            display: inline-flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
