import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getDisplayUserName } from '../../src/components/navigation/Header';
import { resolvePostLoginDestination } from '../../src/pages/auth/LoginPage';
import { getCartStorageKey, getWishlistStorageKey } from '../../src/features/cart/CartContext';
import { getSettingsPrefsKey } from '../../src/pages/customer/CustomerSettingsPage';
import { dbStore, syncInitialProductImages, sanitizeProductImageUrl } from '../../src/services/store';

function collectSourceFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectSourceFiles(full));
    } else if (entry.isFile() && /\.(ts|tsx|css)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

describe('PAWELLE UI Consistency, Header Redesign, Staff Navigation & Account Isolation Tests', () => {
  describe('1. Original Pill & Circular Rounded Design System Preservation', () => {
    it('preserves original radii in tokens.css and uses --radius-pill across buttons and scoped controls in global.css', () => {
      const tokensCss = fs.readFileSync(path.resolve(__dirname, '../../src/styles/tokens.css'), 'utf-8');
      const globalCss = fs.readFileSync(path.resolve(__dirname, '../../src/styles/global.css'), 'utf-8');

      expect(tokensCss).toContain('--radius-pill: 9999px;');
      expect(tokensCss).not.toContain('--radius-control:');
      expect(tokensCss).not.toContain('--radius-input:');

      expect(globalCss).toMatch(/\.btn\s*\{[^}]*border-radius:\s*var\(--radius-pill\);/s);
      expect(globalCss).toMatch(/\.filter-chip\s*\{[^}]*border-radius:\s*var\(--radius-pill\);/s);
      expect(globalCss).toMatch(/\.search-control\s*\{[^}]*border-radius:\s*var\(--radius-pill\);/s);
      expect(globalCss).toMatch(/\.sort-select\s*\{[^}]*border-radius:\s*var\(--radius-pill\);/s);
      expect(globalCss).toMatch(/\.header-control-btn\s*\{[^}]*border-radius:\s*var\(--radius-pill\);/s);
    });

    it('contains zero broken --radius-full or rectangular --radius-control/--radius-input overrides across src/', () => {
      const srcRoot = path.resolve(__dirname, '../../src');
      const sourceFiles = collectSourceFiles(srcRoot);
      expect(sourceFiles.length).toBeGreaterThan(20);

      for (const file of sourceFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        expect(content, `${path.relative(srcRoot, file)} referenced --radius-full`).not.toContain('--radius-full');
        expect(content, `${path.relative(srcRoot, file)} still uses --radius-control`).not.toContain('--radius-control');
        expect(content, `${path.relative(srcRoot, file)} still uses --radius-input`).not.toContain('--radius-input');
      }
    });

    it('uses pill and circular controls consistently across Apothecary, Journal, Product Detail, Cart, and Footer', () => {
      const shopPage = fs.readFileSync(path.resolve(__dirname, '../../src/pages/shop/ShopPage.tsx'), 'utf-8');
      const productDetail = fs.readFileSync(path.resolve(__dirname, '../../src/pages/shop/ProductDetailPage.tsx'), 'utf-8');
      const blogPage = fs.readFileSync(path.resolve(__dirname, '../../src/pages/blog/BlogPage.tsx'), 'utf-8');
      const cartPage = fs.readFileSync(path.resolve(__dirname, '../../src/pages/shop/CartPage.tsx'), 'utf-8');
      const footer = fs.readFileSync(path.resolve(__dirname, '../../src/components/navigation/Footer.tsx'), 'utf-8');

      expect(shopPage).toContain('filter-chip');
      expect(shopPage).toContain('search-control');
      expect(shopPage).toContain('sort-select');
      expect(shopPage).toContain('Add to Cart');
      expect(shopPage).toContain("borderRadius: '50%'");
      expect(shopPage).toContain('repeat(auto-fill, minmax(310px, 1fr))');
      expect(shopPage).not.toContain('repeat(auto-fit, minmax(310px, 1fr))');
      expect(shopPage).not.toContain('atelier-sticky-bar');

      expect(productDetail).toContain("borderRadius: 'var(--radius-pill)'");
      expect(productDetail).toContain("borderRadius: '50%'");
      expect(productDetail).toContain('Add to Cart');

      expect(blogPage).toContain('filter-chip');
      expect(blogPage).toContain('search-control');
      expect(blogPage).toContain('sort-select');
      expect(blogPage).toContain("borderRadius: 'var(--radius-pill)'");

      expect(cartPage).toContain("borderRadius: 'var(--radius-pill)'");
      expect(footer).toContain("borderRadius: 'var(--radius-pill)'");
      expect(footer).toContain("borderRadius: '50%'");
    });

    it('syncs updated INITIAL_PRODUCTS image_url over stale cached products and normalizes local asset paths', () => {
      expect(sanitizeProductImageUrl('  assets/products/botanical-shampoo.jpg  ')).toBe('/assets/products/botanical-shampoo.jpg');
      expect(sanitizeProductImageUrl('./assets/products/beechwood-brush.jpg')).toBe('/assets/products/beechwood-brush.jpg');

      const prd1 = dbStore.getProductById('prd-1')!;
      const staleCached = [
        { ...prd1, image_url: 'https://stale-old-url.example/old.jpg' }
      ];
      const synced = syncInitialProductImages(staleCached);
      expect(synced[0].image_url).toBe(prd1.image_url);
    });
  });

  describe('2. Boutique Header Redesign, Admin Header Integrity & Theme Toggle', () => {
    it('renders complete full name without first-word slicing or character truncation', () => {
      expect(getDisplayUserName({ full_name: 'Alexander Hawthorne', email: 'director@pawelle.com' })).toBe('Alexander Hawthorne');
      expect(getDisplayUserName({ full_name: 'Clara Vance', email: 'clara.vance@pawelle.com' })).toBe('Clara Vance');
      expect(getDisplayUserName({ full_name: 'Vivaan Sakaria', email: 'vivaan@example.com' })).toBe('Vivaan Sakaria');
    });

    it('uses clean fallback when full_name is missing without exposing full email', () => {
      expect(getDisplayUserName({ full_name: '', email: 'vivaan.sakaria@example.com' })).toBe('vivaan.sakaria');
      expect(getDisplayUserName({ full_name: '   ', email: '' })).toBe('My Account');
      expect(getDisplayUserName(null)).toBe('');
    });

    it('includes two-tier non-overlapping header structure, theme toggle, avatar fallback, and full name markup', () => {
      const headerSrc = fs.readFileSync(path.resolve(__dirname, '../../src/components/navigation/Header.tsx'), 'utf-8');
      expect(headerSrc).toContain('data-testid="theme-toggle-btn"');
      expect(headerSrc).toContain('data-testid="mobile-theme-toggle-btn"');
      expect(headerSrc).toContain('data-testid="header-user-fullname"');
      expect(headerSrc).toContain('desktop-nav-bar');
      expect(headerSrc).toContain('avatarError');
      expect(headerSrc).not.toContain('.split(\' \')[0]');
      expect(headerSrc).not.toContain('maxWidth: \'100px\'');
    });
  });

  describe('3. Distinct Staff Portal (/staff) & Studio Schedule (/staff/appointments) Destinations', () => {
    it('registers StaffDashboardPage on /staff and dedicated StaffSchedulePage on /staff/appointments', () => {
      const appSrc = fs.readFileSync(path.resolve(__dirname, '../../src/App.tsx'), 'utf-8');
      const staffLayoutSrc = fs.readFileSync(path.resolve(__dirname, '../../src/layouts/StaffLayout.tsx'), 'utf-8');
      const staffSchedulePath = path.resolve(__dirname, '../../src/pages/staff/StaffSchedulePage.tsx');

      expect(fs.existsSync(staffSchedulePath)).toBe(true);
      expect(appSrc).toContain('StaffSchedulePage');
      expect(appSrc).toContain('<Route index element={<StaffDashboardPage />} />');
      expect(appSrc).toContain('<Route path="appointments" element={<StaffSchedulePage />} />');

      expect(staffLayoutSrc).toContain("to: '/staff', label: 'Staff Portal'");
      expect(staffLayoutSrc).toContain("to: '/staff/appointments', label: 'Studio Schedule'");
      expect(staffLayoutSrc).not.toContain("Today's Schedule & Appointments");
    });
  });

  describe('4. Post-Logout & Post-Login Account Center Route Isolation', () => {
    it('always redirects to user default Account Center dashboard instead of a previous user Account subsection', () => {
      const privateSubroutes = [
        '/customer/wishlist',
        '/customer/appointments',
        '/customer/pets',
        '/customer/orders',
        '/customer/grooming-records',
        '/customer/settings',
        '/staff/appointments',
        '/staff/grooming-records',
        '/admin/orders',
        '/admin/staff'
      ];

      for (const route of privateSubroutes) {
        expect(resolvePostLoginDestination('customer', route, route)).toBe('/customer');
        expect(resolvePostLoginDestination('staff', route, route)).toBe('/staff');
        expect(resolvePostLoginDestination('admin', route, route)).toBe('/admin');
      }
    });

    it('blocks unsafe external redirect schemes and preserves explicit guest storefront/booking intent cleanly', () => {
      expect(resolvePostLoginDestination('customer', 'https://malicious.example', 'https://malicious.example')).toBe('/customer');
      expect(resolvePostLoginDestination('customer', '//malicious.example', '//malicious.example')).toBe('/customer');
      expect(resolvePostLoginDestination('customer', null, null)).toBe('/customer');
      expect(resolvePostLoginDestination('customer', '/shop', '/shop')).toBe('/shop');
      expect(resolvePostLoginDestination('customer', '/customer/booking?service=srv-1', '/customer/booking?service=srv-1')).toBe('/customer/booking?service=srv-1');
    });

    it('scopes cart, wishlist, and notification preference storage keys per user ID', () => {
      expect(getCartStorageKey('usr-a')).not.toBe(getCartStorageKey('usr-b'));
      expect(getCartStorageKey('usr-a')).not.toBe(getCartStorageKey(null));
      expect(getWishlistStorageKey('usr-a')).not.toBe(getWishlistStorageKey('usr-b'));
      expect(getWishlistStorageKey('usr-a')).not.toBe(getWishlistStorageKey(null));
      expect(getSettingsPrefsKey('usr-a')).not.toBe(getSettingsPrefsKey('usr-b'));
    });

    it('returns empty pet, appointment, order, and grooming record datasets for a newly registered customer', () => {
      const freshCustomerId = `usr-isolated-${Date.now()}`;
      const pets = dbStore.getPets(freshCustomerId);
      const ownedPetIds = new Set(pets.map(p => p.id));
      const appointments = dbStore.getAppointments({ customerId: freshCustomerId });
      const orders = dbStore.getOrders(freshCustomerId);
      const groomingRecords = dbStore.getGroomingRecords().filter(r => ownedPetIds.has(r.pet_id));

      expect(pets).toEqual([]);
      expect(appointments).toEqual([]);
      expect(orders).toEqual([]);
      expect(groomingRecords).toEqual([]);
    });

    it('dynamically updates Customer Directory when new customers register/sign in and after pet/appointment completion', () => {
      const uniqueId = `usr-dir-${Date.now()}`;
      const newCustomer = dbStore.upsertCustomerProfile({
        id: uniqueId,
        email: `client.${uniqueId}@example.com`,
        full_name: 'Olivia Bennett',
        phone: '+44 7700 900777',
        role: 'customer'
      });
      expect(newCustomer).not.toBeNull();

      // Staff/Admin profiles must NOT appear in Customer Directory
      expect(
        dbStore.upsertCustomerProfile({
          id: `staff-${Date.now()}`,
          email: 'staff.test@pawelle.com',
          full_name: 'Staff Test',
          role: 'staff'
        })
      ).toBeNull();

      const directoryMatch = dbStore.getCustomers('Olivia Bennett');
      expect(directoryMatch.some(c => c.id === uniqueId && c.phone === '+44 7700 900777')).toBe(true);

      const pet = dbStore.createPet({
        owner_id: uniqueId,
        name: 'Barnaby',
        species: 'dog',
        breed: 'Cavalier Spaniel'
      });
      const appt = dbStore.createAppointment({
        customer_id: uniqueId,
        customer_name: 'Olivia Bennett',
        customer_phone: '+44 7700 900777',
        pet_id: pet.id,
        pet_name: pet.name,
        pet_breed: pet.breed,
        service_id: 'srv-1',
        service_name: 'The Royal Botanical Bath & Blow-dry',
        location_id: 'loc-1',
        location_name: 'PAWELLE Flagship Studio — Mayfair',
        starts_at: '2026-12-15T10:00:00Z',
        ends_at: '2026-12-15T11:00:00Z',
        price_snapshot: 85,
        status: 'confirmed',
        payment_status: 'pending'
      });

      expect(dbStore.getPets(uniqueId)).toHaveLength(1);
      expect(dbStore.getAppointments({ customerId: uniqueId })).toHaveLength(1);

      dbStore.updateAppointmentStatus(appt.id, 'completed');
      const updatedAppts = dbStore.getAppointments({ customerId: uniqueId });
      expect(updatedAppts[0].status).toBe('completed');
    });

    it('never assigns random stock photos on pet creation and wires optional photo upload & live sync', () => {
      const customerPets = fs.readFileSync(path.resolve(__dirname, '../../src/pages/customer/CustomerPetsPage.tsx'), 'utf-8');
      const bookingPage = fs.readFileSync(path.resolve(__dirname, '../../src/pages/booking/BookingPage.tsx'), 'utf-8');
      const adminMessages = fs.readFileSync(path.resolve(__dirname, '../../src/pages/admin/AdminMessagesPage.tsx'), 'utf-8');

      expect(customerPets).not.toContain('photo-1583511655857-d19b40a7a54e');
      expect(customerPets).not.toContain('photo-1514888286974-6c03e2ca1dba');
      expect(customerPets).toContain('Companion Photo (Optional)');
      expect(customerPets).toContain('type="file"');

      expect(bookingPage).not.toContain("photo_url: newPetSpecies === 'dog'");
      expect(bookingPage).toContain('Companion Photo (Optional)');
      expect(bookingPage).toContain('type="file"');
      expect(bookingPage).toContain('useStoreSync');

      expect(adminMessages).toContain('useStoreSync');
    });

    it('keys Outlet by user ID across portals and removes hardcoded fallback customer IDs from customer pages', () => {
      const layouts = [
        '../../src/layouts/CustomerLayout.tsx',
        '../../src/layouts/StaffLayout.tsx',
        '../../src/layouts/AdminLayout.tsx'
      ];
      for (const relPath of layouts) {
        const content = fs.readFileSync(path.resolve(__dirname, relPath), 'utf-8');
        expect(content).toContain('<Outlet key={user?.id || \'guest\'} />');
      }

      const customerDir = path.resolve(__dirname, '../../src/pages/customer');
      const customerFiles = collectSourceFiles(customerDir);
      for (const file of customerFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        expect(content).not.toContain('usr-demo-customer');
        expect(content).not.toContain('usr-cust-1');
      }
    });

    it('supports full staff CRUD and client inquiry replies in dbStore', () => {
      const created = dbStore.createStaff({
        name: 'Camille Laurent',
        role: 'Master Cat Stylist',
        bio: 'Specialises in quiet Persian coat sculpting.',
        location_id: 'loc-1',
        specialties: ['Persian Coats', 'Low-Stress Bathing']
      });
      expect(created.id).toMatch(/^stf-/);
      expect(dbStore.getStaff().some(s => s.id === created.id && s.name === 'Camille Laurent')).toBe(true);

      const updated = dbStore.updateStaff(created.id, { role: 'Senior Botanical Stylist' });
      expect(updated.role).toBe('Senior Botanical Stylist');

      dbStore.deleteStaff(created.id);
      expect(dbStore.getStaff().some(s => s.id === created.id)).toBe(false);

      const msg = dbStore.createContactMessage({
        name: 'Eleanor Wright',
        email: 'eleanor@example.com',
        subject: 'Puppy Introduction',
        message: 'Do you accept 14-week Cavapoos?'
      });
      const replied = dbStore.replyToContactMessage(msg.id, 'Yes, our Mayfair puppy intro covers gentle sound acclimation.', 'Concierge Lead');
      expect(replied.status).toBe('replied');
      expect(replied.reply_text).toBe('Yes, our Mayfair puppy intro covers gentle sound acclimation.');
      expect(replied.replied_at).toBeTruthy();
      expect(replied.replied_by).toBe('Concierge Lead');
    });

    it('fixes homepage caption text, booking responsive/email classes, and themed stock arrow controls', () => {
      const homepage1 = fs.readFileSync(path.resolve(__dirname, '../../src/pages/public/Homepage1.tsx'), 'utf-8');
      const bookingPage = fs.readFileSync(path.resolve(__dirname, '../../src/pages/booking/BookingPage.tsx'), 'utf-8');
      const adminProducts = fs.readFileSync(path.resolve(__dirname, '../../src/pages/admin/AdminProductsPage.tsx'), 'utf-8');
      const adminMessages = fs.readFileSync(path.resolve(__dirname, '../../src/pages/admin/AdminMessagesPage.tsx'), 'utf-8');
      const adminStaff = fs.readFileSync(path.resolve(__dirname, '../../src/pages/admin/AdminStaffPage.tsx'), 'utf-8');

      expect(homepage1).not.toContain('Click to inspect plate');

      expect(bookingPage).toContain('booking-ritual-card');
      expect(bookingPage).toContain('booking-summary-row');
      expect(bookingPage).toContain("overflowWrap: 'anywhere'");
      expect(bookingPage).not.toContain('+44 7946 0991');

      expect(adminProducts).toContain('ChevronLeft');
      expect(adminProducts).toContain('ChevronRight');
      expect(adminProducts).not.toContain('-5');
      expect(adminProducts).not.toContain('+5');

      expect(adminMessages).toContain('replyToContactMessage');
      expect(adminStaff).toContain('add-staff-btn');
    });
  });
});
