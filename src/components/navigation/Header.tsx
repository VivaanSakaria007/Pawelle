import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/authentication/AuthContext';
import { useCart } from '../../features/cart/CartContext';
import { useTheme } from '../common/ThemeContext';
import { PawelleLogo } from '../common/PawelleLogo';
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
  ChevronDown,
  Shield,
  Scissors,
  Sparkles
} from 'lucide-react';

export function getDisplayUserName(user: { full_name?: string; email?: string } | null | undefined): string {
  if (!user) return '';
  const trimmedName = user.full_name?.trim();
  if (trimmedName) return trimmedName;
  if (user.email) {
    const emailPrefix = user.email.split('@')[0]?.trim();
    if (emailPrefix) return emailPrefix;
  }
  return 'My Account';
}

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const homeDropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user, role, logout } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme, direction, toggleDirection } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const fullUserName = getDisplayUserName(user);
  const userInitial = fullUserName ? fullUserName.charAt(0).toUpperCase() : 'U';

  // Reset image fallback state when avatar URL changes
  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatar_url]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setHomeDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setHomeDropdownOpen(false);
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setHomeDropdownOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isHomeActive = location.pathname === '/' || location.pathname === '/niche-spa';
  const isAboutActive = location.pathname === '/about';
  const isServicesActive = location.pathname.startsWith('/services');
  const isPricingActive = location.pathname === '/pricing';
  const isShopActive =
    location.pathname.startsWith('/shop') || location.pathname === '/cart' || location.pathname === '/checkout';
  const isBlogActive = location.pathname.startsWith('/blog');
  const isContactActive = location.pathname === '/contact';

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'staff') return '/staff';
    return '/customer';
  };

  const handleHeaderLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const nextThemeLabel = theme === 'light' ? 'Dark' : 'Light';

  const renderUserAvatar = (size: number = 24) => {
    if (user?.avatar_url && !avatarError) {
      return (
        <img
          src={user.avatar_url}
          alt=""
          onError={() => setAvatarError(true)}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0
          }}
        />
      );
    }

    const avatarBg =
      role === 'staff'
        ? 'var(--color-terracotta-soft)'
        : 'var(--color-forest-soft)';
    const avatarFg =
      role === 'staff'
        ? 'var(--color-terracotta)'
        : 'var(--color-forest)';

    return (
      <span
        aria-hidden="true"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: avatarBg,
          color: avatarFg,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${Math.round(size * 0.5)}px`,
          fontWeight: 700,
          flexShrink: 0,
          fontFamily: 'var(--font-heading)'
        }}
      >
        {userInitial}
      </span>
    );
  };

  return (
    <header
      ref={headerRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        backgroundColor: isScrolled ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)',
        borderBottom: `1px solid ${isScrolled ? 'var(--color-border)' : 'var(--color-border-subtle)'}`,
        boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
        transition:
          'background-color var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal)'
      }}
    >
      {/* Tier 1: Boutique Mayfair Coordinates & Locale Strip */}
      <div className="header-top-ticker">
        <div
          className="container header-ticker-row"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            fontSize: '0.72rem',
            letterSpacing: '0.095em',
            textTransform: 'uppercase',
            color: 'var(--color-text-secondary)',
            paddingBlock: '2px',
            rowGap: '4px',
            columnGap: '16px'
          }}
        >
          <div
            style={{
              display: 'flex',
              columnGap: '12px',
              rowGap: '4px',
              alignItems: 'center',
              flexWrap: 'wrap',
              minWidth: 0
            }}
          >
            <span className="hide-tablet-address" style={{ whiteSpace: 'nowrap' }}>
              Mayfair Flagship &bull; 42 South Audley St, London W1K
            </span>
            <span className="show-compact-address" style={{ display: 'none', whiteSpace: 'nowrap' }}>
              Mayfair W1K
            </span>
            <span style={{ opacity: 0.35 }} className="hide-mobile">
              |
            </span>
            <span
              className="hide-mobile"
              style={{ color: 'var(--color-terracotta)', fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              By Appointment Only &bull; Fear-Free Certified
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', flexShrink: 0, maxWidth: '100%' }}>
            <a
              href="tel:+442079460812"
              style={{ color: 'inherit', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              <span className="hide-mobile">Concierge: </span>+44 20 7946 0812
            </a>
            <button
              type="button"
              onClick={toggleDirection}
              aria-label={`Toggle text direction (Current: ${direction.toUpperCase()})`}
              title={`Toggle text direction (Current: ${direction.toUpperCase()})`}
              data-rtl-toggle="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-strong)',
                borderRadius: 'var(--radius-pill)',
                padding: '2px 10px',
                fontSize: '0.675rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                letterSpacing: '0.06em'
              }}
            >
              <Globe size={11} style={{ flexShrink: 0 }} />
              <span>{direction.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2: Maison Crest & Pill Utility Actions (Clean Flex Row with Generous Breathing Room) */}
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          minHeight: '64px',
          paddingBlock: '8px'
        }}
      >
        {/* Left: Brand Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'var(--color-forest)',
              flexShrink: 0
            }}
            aria-label="PAWELLE Luxury Pet Grooming Home"
          >
            <PawelleLogo height="40px" />
          </Link>

          <span
            className="desktop-nav"
            aria-hidden="true"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '14px',
              paddingInlineStart: '16px',
              borderInlineStart: '1px solid var(--color-border-strong)',
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap'
            }}
          >
            London Grooming Sanctuary
          </span>
        </div>

        {/* Right: Cohesive Utility Pills, Account Menu & Booking CTA */}
        <div
          className="header-actions-cluster"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0
          }}
        >
          {/* Prominent Light / Dark Theme Toggle Pill */}
          <button
            type="button"
            onClick={toggleTheme}
            data-testid="theme-toggle-btn"
            aria-label={`Switch to ${nextThemeLabel} mode (currently ${theme} mode)`}
            aria-pressed={theme === 'dark'}
            title={`Switch to ${nextThemeLabel} mode`}
            className="header-control-btn header-theme-pill"
          >
            {theme === 'light' ? (
              <Moon size={15} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
            ) : (
              <Sun size={15} style={{ color: 'var(--color-sand)', flexShrink: 0 }} />
            )}
            <span className="theme-toggle-text" style={{ fontWeight: 600 }}>
              {nextThemeLabel}
            </span>
          </button>

          {/* Circular Shopping Bag Button */}
          <Link
            to="/cart"
            aria-label={`Shopping Cart with ${totalItems} items`}
            title="View Shopping Bag"
            className="header-control-btn"
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              paddingInline: 0,
              borderRadius: '50%',
              color: 'var(--color-forest)'
            }}
          >
            <ShoppingBag size={17} />
            {totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  insetInlineEnd: '-4px',
                  backgroundColor: 'var(--color-terracotta)',
                  color: '#FFFEFB',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  minWidth: '18px',
                  height: '18px',
                  paddingInline: '4px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--color-bg-surface)'
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          {/* Authenticated Account Menu Pill or Guest Sign In */}
          {user ? (
            <div style={{ position: 'relative', flexShrink: 0 }} className="header-user-wrapper">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={userDropdownOpen}
                aria-label={`Account menu for ${fullUserName}`}
                data-testid="header-user-button"
                className="header-control-btn"
                style={{
                  paddingInline: '8px 14px',
                  gap: '8px',
                  backgroundColor: userDropdownOpen ? 'var(--color-forest-soft)' : 'var(--color-bg-surface)',
                  borderColor: userDropdownOpen ? 'var(--color-forest)' : 'var(--color-border-strong)'
                }}
              >
                {renderUserAvatar(24)}
                <span
                  data-testid="header-user-fullname"
                  style={{
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    color: 'var(--color-text-primary)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {fullUserName}
                </span>
                <ChevronDown size={14} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
              </button>

              {userDropdownOpen && (
                <div
                  role="menu"
                  aria-label="Account navigation"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    insetInlineEnd: 0,
                    minWidth: '245px',
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    zIndex: 110
                  }}
                >
                  <div
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid var(--color-border)',
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                        {fullUserName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', wordBreak: 'break-word' }}>
                        {user.email}
                      </div>
                    </div>
                    <span className="badge badge-sand" style={{ fontSize: '0.65rem', flexShrink: 0 }}>
                      {role}
                    </span>
                  </div>

                  {role === 'customer' && (
                    <>
                      <Link
                        to="/customer"
                        role="menuitem"
                        onClick={() => setUserDropdownOpen(false)}
                        className="header-menu-item"
                      >
                        <User size={15} /> Client Portal
                      </Link>
                      <Link
                        to="/customer/appointments"
                        role="menuitem"
                        onClick={() => setUserDropdownOpen(false)}
                        className="header-menu-item"
                      >
                        <Calendar size={15} /> My Appointments
                      </Link>
                      <Link
                        to="/customer/booking"
                        role="menuitem"
                        onClick={() => setUserDropdownOpen(false)}
                        className="header-menu-item"
                      >
                        <Sparkles size={15} /> Book Service
                      </Link>
                    </>
                  )}

                  {role === 'staff' && (
                    <>
                      <Link
                        to="/staff"
                        role="menuitem"
                        onClick={() => setUserDropdownOpen(false)}
                        className="header-menu-item"
                      >
                        <User size={15} /> Staff Portal
                      </Link>
                      <Link
                        to="/staff/appointments"
                        role="menuitem"
                        onClick={() => setUserDropdownOpen(false)}
                        className="header-menu-item"
                      >
                        <Calendar size={15} /> Studio Schedule
                      </Link>
                      <Link
                        to="/staff/grooming-records"
                        role="menuitem"
                        onClick={() => setUserDropdownOpen(false)}
                        className="header-menu-item"
                      >
                        <Scissors size={15} /> Grooming Records
                      </Link>
                    </>
                  )}

                  {role === 'admin' && (
                    <>
                      <Link
                        to="/admin"
                        role="menuitem"
                        onClick={() => setUserDropdownOpen(false)}
                        className="header-menu-item"
                      >
                        <Shield size={15} /> Admin Overview
                      </Link>
                      <Link
                        to="/admin/appointments"
                        role="menuitem"
                        onClick={() => setUserDropdownOpen(false)}
                        className="header-menu-item"
                      >
                        <Calendar size={15} /> Appointments Manager
                      </Link>
                      <Link
                        to="/admin/staff"
                        role="menuitem"
                        onClick={() => setUserDropdownOpen(false)}
                        className="header-menu-item"
                      >
                        <User size={15} /> Staff &amp; Rosters
                      </Link>
                    </>
                  )}

                  <div style={{ height: '1px', backgroundColor: 'var(--color-border)', marginBlock: '4px' }} />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleHeaderLogout}
                    className="header-menu-item"
                    style={{
                      width: '100%',
                      color: 'var(--color-danger)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'start',
                      fontWeight: 500
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
              className="header-control-btn"
              style={{ display: 'none', paddingInline: '16px', fontWeight: 600 }}
              data-auth-login="true"
            >
              Sign In
            </Link>
          )}

          {/* Primary Pill CTA: Book Service */}
          <Link
            to="/customer/booking"
            className="btn btn-primary"
            style={{
              display: 'none',
              height: '38px',
              padding: '0 18px',
              fontSize: '0.84rem'
            }}
            data-cta-book="true"
          >
            <Calendar size={15} />
            <span>Book Service</span>
          </Link>

          {/* Circular Mobile/Tablet Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="header-control-btn mobile-menu-btn"
            style={{
              width: '38px',
              height: '38px',
              paddingInline: 0,
              borderRadius: '50%'
            }}
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Tier 3: Centered Editorial Navigation Ribbon (Desktop & Laptop >= 960px) */}
      <div
        className="desktop-nav-bar"
        style={{
          display: 'none',
          borderTop: '1px solid var(--color-border-subtle)',
          backgroundColor: isScrolled ? 'var(--color-bg-surface)' : 'var(--color-bg-primary)',
          transition: 'background-color var(--transition-normal)'
        }}
      >
        <nav
          aria-label="Primary Navigation"
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(18px, 2.6vw, 40px)',
            paddingBlock: '7px'
          }}
        >
          {/* Sanctuary Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => {
              if (homeDropdownTimeout.current) {
                clearTimeout(homeDropdownTimeout.current);
                homeDropdownTimeout.current = null;
              }
              setHomeDropdownOpen(true);
            }}
            onMouseLeave={() => {
              homeDropdownTimeout.current = setTimeout(() => {
                setHomeDropdownOpen(false);
                homeDropdownTimeout.current = null;
              }, 200);
            }}
          >
            <button
              id="desktop-home-menu"
              aria-haspopup="true"
              aria-expanded={homeDropdownOpen}
              onClick={() => setHomeDropdownOpen(!homeDropdownOpen)}
              className={`nav-link-editorial ${isHomeActive ? 'active' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Sanctuary <ChevronDown size={13} />
            </button>
            {homeDropdownOpen && (
              <div
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="desktop-home-menu"
                style={{
                  position: 'absolute',
                  top: '100%',
                  paddingTop: '6px',
                  insetInlineStart: 0,
                  minWidth: '264px',
                  zIndex: 110
                }}
              >
              <div style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <Link
                  to="/"
                  role="menuitem"
                  onClick={() => setHomeDropdownOpen(false)}
                  className={`sanctuary-dropdown-item ${location.pathname === '/' ? 'is-active' : ''}`}
                >
                  <span style={{ fontWeight: 600 }}>Mayfair Flagship Atelier</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Bespoke One-on-One Canine &amp; Feline Care
                  </span>
                </Link>
                <Link
                  to="/niche-spa"
                  role="menuitem"
                  onClick={() => setHomeDropdownOpen(false)}
                  className={`sanctuary-dropdown-item ${location.pathname === '/niche-spa' ? 'is-active' : ''}`}
                >
                  <span style={{ fontWeight: 600 }}>Feline &amp; Canine Spa Retreat</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Scent-Isolated Suites &amp; Hydrotherapy
                  </span>
                </Link>
              </div>
              </div>
            )}
          </div>

          <NavLink
            to="/services"
            className={({ isActive }) => `nav-link-editorial ${isActive || isServicesActive ? 'active' : ''}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            Services
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link-editorial ${isActive || isAboutActive ? 'active' : ''}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            Heritage
          </NavLink>

          <NavLink
            to="/pricing"
            className={({ isActive }) => `nav-link-editorial ${isActive || isPricingActive ? 'active' : ''}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            Investment
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }) => `nav-link-editorial ${isActive || isShopActive ? 'active' : ''}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            Apothecary
          </NavLink>

          <NavLink
            to="/blog"
            className={({ isActive }) => `nav-link-editorial ${isActive || isBlogActive ? 'active' : ''}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            Journal
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) => `nav-link-editorial ${isActive || isContactActive ? 'active' : ''}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            Concierge
          </NavLink>
        </nav>
      </div>

      {/* Mobile & Tablet Drawer (< 960px) */}
      {mobileMenuOpen && (
        <nav
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            borderTop: '1px solid var(--color-border)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: 'var(--shadow-lg)',
            maxHeight: 'calc(100vh - 96px)',
            overflowY: 'auto'
          }}
        >
          {/* Authenticated Greeting Card on Mobile */}
          {user && (
            <div
              style={{
                padding: '14px 16px',
                backgroundColor: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                {renderUserAvatar(34)}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                    {fullUserName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    Signed in &bull; {role.toUpperCase()}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleHeaderLogout}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--color-danger)', paddingInline: '12px' }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}

          {/* Role-Specific Shortcuts on Mobile/Tablet */}
          {user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--color-terracotta)',
                  fontWeight: 600
                }}
              >
                Account Shortcuts
              </div>
              {role === 'staff' && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Link
                    to="/staff"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Staff Portal
                  </Link>
                  <Link
                    to="/staff/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Studio Schedule
                  </Link>
                </div>
              )}
              {role === 'admin' && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Admin Overview
                  </Link>
                  <Link
                    to="/admin/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Appointments
                  </Link>
                </div>
              )}
              {role === 'customer' && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Link
                    to="/customer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Client Portal
                  </Link>
                  <Link
                    to="/customer/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    My Appointments
                  </Link>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--color-terracotta)',
                fontWeight: 600
              }}
            >
              Sanctuary Portals
            </div>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`sanctuary-dropdown-item sanctuary-mobile-item ${location.pathname === '/' ? 'is-active' : ''}`}
              style={{
                fontSize: '1.05rem',
                fontWeight: 500,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>Mayfair Flagship Atelier</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>01</span>
            </Link>
            <Link
              to="/niche-spa"
              onClick={() => setMobileMenuOpen(false)}
              className={`sanctuary-dropdown-item sanctuary-mobile-item ${location.pathname === '/niche-spa' ? 'is-active' : ''}`}
              style={{
                fontSize: '1.05rem',
                fontWeight: 500,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>Wellness &amp; Feline Retreat</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>02</span>
            </Link>

            <div style={{ height: '1px', backgroundColor: 'var(--color-border)', marginBlock: '4px' }} />

            <div
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--color-terracotta)',
                fontWeight: 600
              }}
            >
              Atelier Directory
            </div>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.05rem', color: isServicesActive ? 'var(--color-forest)' : 'var(--color-text-primary)' }}
            >
              Services
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.05rem', color: isAboutActive ? 'var(--color-forest)' : 'var(--color-text-primary)' }}
            >
              Atelier Heritage
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.05rem', color: isPricingActive ? 'var(--color-forest)' : 'var(--color-text-primary)' }}
            >
              Investment &amp; Club
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.05rem', color: isShopActive ? 'var(--color-forest)' : 'var(--color-text-primary)' }}
            >
              Apothecary Shop
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.05rem', color: isBlogActive ? 'var(--color-forest)' : 'var(--color-text-primary)' }}
            >
              The Pet Care Journal
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.05rem', color: isContactActive ? 'var(--color-forest)' : 'var(--color-text-primary)' }}
            >
              Concierge &amp; Locations
            </Link>
          </div>

          {/* Mobile Appearance & Direction Controls */}
          <div
            style={{
              paddingBlock: '14px',
              borderTop: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}
          >
            <button
              type="button"
              onClick={toggleTheme}
              data-testid="mobile-theme-toggle-btn"
              className="header-control-btn"
              style={{ flex: 1, minWidth: '150px', height: '42px', justifyContent: 'center' }}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</span>
            </button>
            <button
              type="button"
              onClick={toggleDirection}
              className="header-control-btn"
              style={{ height: '42px', paddingInline: '16px' }}
            >
              <Globe size={15} />
              <span>{direction.toUpperCase()}</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link
              to="/customer/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Calendar size={18} /> Reserve a Session
            </Link>
            {user ? (
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <User size={18} /> Open Account Center
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Client Sign In
              </Link>
            )}
          </div>

          <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', textAlign: 'center', paddingTop: '4px' }}>
            42 South Audley St, Mayfair &bull; Tel: +44 20 7946 0812
          </div>
        </nav>
      )}

      {/* Responsive Header Media Rules & Scoped Menu Interactions */}
      <style>{`
        .header-menu-item {
          padding: 9px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--color-text-primary);
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }
        .header-menu-item:hover {
          background-color: var(--color-forest-soft);
          color: var(--color-forest);
        }
        .sanctuary-dropdown-item {
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          color: var(--color-text-primary);
          font-weight: 400;
          background-color: transparent;
          border: none;
          display: flex;
          flex-direction: column;
          gap: 2px;
          cursor: pointer;
          transition: background-color var(--transition-fast), color var(--transition-fast), transform 120ms ease;
        }
        .sanctuary-dropdown-item.is-active {
          color: var(--color-forest);
          font-weight: 600;
          background-color: var(--color-bg-subtle);
        }
        .sanctuary-dropdown-item:hover,
        .sanctuary-dropdown-item:focus-visible {
          background-color: var(--btn-secondary-hover-bg);
          color: var(--btn-secondary-hover-text);
          outline: none;
        }
        .sanctuary-dropdown-item:active {
          transform: scale(0.985);
        }
        @media (min-width: 960px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-nav-bar {
            display: block !important;
          }
          [data-cta-book="true"] {
            display: inline-flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (min-width: 640px) {
          [data-auth-login="true"] {
            display: inline-flex !important;
          }
        }
        @media (max-width: 620px) {
          .header-user-wrapper {
            display: none !important;
          }
        }
        @media (max-width: 520px) {
          .theme-toggle-text {
            display: none !important;
          }
          .header-theme-pill {
            width: 38px !important;
            padding-inline: 0 !important;
          }
        }
        @media (max-width: 1080px) {
          .hide-tablet-address {
            display: none !important;
          }
          .show-compact-address {
            display: inline !important;
          }
        }
        @media (max-width: 640px) {
          .hide-mobile {
            display: none !important;
          }
          .show-mobile-inline {
            display: inline !important;
          }
        }
      `}</style>
    </header>
  );
};
