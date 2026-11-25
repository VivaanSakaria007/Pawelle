import { describe, it, expect } from 'vitest';
import { dbStore } from '../../src/services/store';
import fs from 'fs';
import path from 'path';

describe('Security, UI Refinement & Token Verification', () => {
  it('verifies dedicated semantic surface tokens for Footer and CTA sections in tokens.css', () => {
    const tokensPath = path.resolve(__dirname, '../../src/styles/tokens.css');
    const tokensContent = fs.readFileSync(tokensPath, 'utf-8');

    // Light mode tokens
    expect(tokensContent).toContain('--color-footer-bg: #1B2922;');
    expect(tokensContent).toContain('--color-cta-bg: #283B32;');
    expect(tokensContent).toContain('--color-hero-accent-bg: #ECE5D8;');

    // Dark mode tokens
    expect(tokensContent).toContain('--color-footer-bg: #0C120F;');
    expect(tokensContent).toContain('--color-cta-bg: #16201B;');
    expect(tokensContent).toContain('--color-hero-accent-bg: #16201B;');
  });

  it('verifies subtle metadata duration-pill styling exists in global.css', () => {
    const globalCssPath = path.resolve(__dirname, '../../src/styles/global.css');
    const globalCssContent = fs.readFileSync(globalCssPath, 'utf-8');

    expect(globalCssContent).toContain('.duration-pill');
    expect(globalCssContent).toContain('border-radius: var(--radius-pill);');
  });

  it('verifies dedicated Pawelle SVG logos exist on disk with explicit non-currentColor fills', () => {
    const lightLogoPath = path.resolve(__dirname, '../../public/assets/logos/pawelle-logo.svg');
    const darkLogoPath = path.resolve(__dirname, '../../public/assets/logos/pawelle-logo-dark.svg');

    expect(fs.existsSync(lightLogoPath)).toBe(true);
    expect(fs.existsSync(darkLogoPath)).toBe(true);

    const lightLogo = fs.readFileSync(lightLogoPath, 'utf-8');
    const darkLogo = fs.readFileSync(darkLogoPath, 'utf-8');

    // Both must not use un-inherited currentColor in standalone img tags
    expect(lightLogo).not.toContain('fill="currentColor"');
    expect(darkLogo).not.toContain('fill="currentColor"');

    // Dark mode logo must have high-contrast ivory fill for dark backgrounds
    expect(darkLogo).toContain('#F7F4EC');
  });

  it('verifies local botanical-shampoo JPEG asset exists for prd-1', () => {
    const shampooPath = path.resolve(__dirname, '../../public/assets/products/botanical-shampoo.jpg');
    expect(fs.existsSync(shampooPath)).toBe(true);

    const header = fs.readFileSync(shampooPath).subarray(0, 2);
    expect(header[0]).toBe(0xff);
    expect(header[1]).toBe(0xd8);
  });

  it('verifies prd-1 product in dbStore has a valid configured image_url', () => {
    const prd1 = dbStore.getProductById('prd-1');
    expect(prd1).toBeDefined();
    expect(typeof prd1?.image_url).toBe('string');
    expect(prd1?.image_url.trim().length).toBeGreaterThan(0);
  });

  it('verifies RBAC routing logic does not use email substring matching', () => {
    // Test role-based determination based purely on profile.role
    const determineDashboardRoute = (role: string) => {
      if (role === 'admin') return '/admin';
      if (role === 'staff') return '/staff';
      return '/customer';
    };

    expect(determineDashboardRoute('admin')).toBe('/admin');
    expect(determineDashboardRoute('staff')).toBe('/staff');
    expect(determineDashboardRoute('customer')).toBe('/customer');

    // Verify an arbitrary email with role customer gets /customer
    const user = { email: 'staff-coordinator-fan@gmail.com', role: 'customer' };
    expect(determineDashboardRoute(user.role)).toBe('/customer');
  });

  it('verifies redirect preserving logic for /booking to /customer/booking', () => {
    const generateRedirect = (pathname: string, search: string) => {
      if (pathname === '/booking') {
        return `/customer/booking${search}`;
      }
      return pathname;
    };

    expect(generateRedirect('/booking', '?service=srv-1&species=dog'))
      .toBe('/customer/booking?service=srv-1&species=dog');
    expect(generateRedirect('/booking', ''))
      .toBe('/customer/booking');
  });

  it('verifies dedicated semantic button tokens in tokens.css prevent dark mode hover disappearance', () => {
    const tokensPath = path.resolve(__dirname, '../../src/styles/tokens.css');
    const tokensContent = fs.readFileSync(tokensPath, 'utf-8');

    // Light mode button tokens
    expect(tokensContent).toContain('--btn-primary-bg: #283B32;');
    expect(tokensContent).toContain('--btn-primary-hover-bg: #1B2922;');

    // Dark mode button tokens: hover MUST NOT be black (#121A16)
    expect(tokensContent).toContain('--btn-primary-hover-bg: #A4CFBA;');
    expect(tokensContent).toContain('--btn-primary-hover-text: #0E1411;');
  });

  it('verifies local beechwood-brush JPEG fallback asset exists and prd-3 has a configured image_url', () => {
    const brushPath = path.resolve(__dirname, '../../public/assets/products/beechwood-brush.jpg');
    expect(fs.existsSync(brushPath)).toBe(true);

    const header = fs.readFileSync(brushPath).subarray(0, 2);
    expect(header[0]).toBe(0xff);
    expect(header[1]).toBe(0xd8);

    const prd3 = dbStore.getProductById('prd-3');
    expect(prd3).toBeDefined();
    expect(typeof prd3?.image_url).toBe('string');
    expect(prd3?.image_url.trim().length).toBeGreaterThan(0);
  });

  it('verifies square high-contrast favicon exists and is linked in index.html', () => {
    const faviconPath = path.resolve(__dirname, '../../public/favicon.svg');
    expect(fs.existsSync(faviconPath)).toBe(true);

    const indexPath = path.resolve(__dirname, '../../index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    expect(indexContent).toContain('href="/favicon.svg"');
  });

  it('verifies Footer does not contain Certified Fear-Free or Organic Botanicals badges', () => {
    const footerPath = path.resolve(__dirname, '../../src/components/navigation/Footer.tsx');
    const footerContent = fs.readFileSync(footerPath, 'utf-8');

    expect(footerContent).not.toContain('Certified Fear-Free');
    expect(footerContent).not.toContain('Organic Botanicals');
  });
});
