import { describe, it, expect, beforeEach } from 'vitest';
import { dbStore } from '../../src/services/store';

describe('PAWELLE Store & Availability Logic', () => {
  it('should retrieve active services with valid pricing and durations', () => {
    const services = dbStore.getServices(true);
    expect(services.length).toBeGreaterThanOrEqual(6);
    services.forEach(s => {
      expect(s.base_price).toBeGreaterThan(0);
      expect(s.duration_minutes).toBeGreaterThanOrEqual(15);
      expect(s.eligible_pet_types.length).toBeGreaterThan(0);
    });
  });

  it('should create and retrieve customer pets', () => {
    const testOwnerId = `usr-test-${Date.now()}`;
    const newPet = dbStore.createPet({
      owner_id: testOwnerId,
      name: 'Barnaby',
      species: 'dog',
      breed: 'Cavalier King Charles',
      age_years: 2,
      weight: 8.5,
      coat_type: 'Silky Long',
      grooming_preferences: 'Gentle on paws',
      care_notes: 'None'
    });

    expect(newPet.id).toBeDefined();
    expect(newPet.name).toBe('Barnaby');

    const retrieved = dbStore.getPets(testOwnerId);
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].name).toBe('Barnaby');
  });

  it('should detect appointment conflicts and prevent double bookings at the same location', () => {
    const locations = dbStore.getLocations();
    const locId = locations[0].id;
    const testDate = '2027-06-15';
    const startsAt = `${testDate}T10:00:00Z`;
    const endsAt = `${testDate}T11:00:00Z`;

    // 1. Check initially free
    const isFreeInitially = dbStore.checkSlotAvailable(locId, startsAt, endsAt);
    expect(isFreeInitially).toBe(true);

    // 2. Book appointment
    const appt = dbStore.createAppointment({
      customer_id: 'usr-test-1',
      pet_id: 'pet-1',
      service_id: 'srv-1',
      location_id: locId,
      starts_at: startsAt,
      ends_at: endsAt,
      price_snapshot: 85,
      status: 'confirmed',
      payment_status: 'paid'
    });

    expect(appt.id).toBeDefined();

    // 3. Exact collision check should return false
    const isFreeAfter = dbStore.checkSlotAvailable(locId, startsAt, endsAt);
    expect(isFreeAfter).toBe(false);

    // 4. Overlapping collision check (starts midway at 10:30)
    const isOverlapping = dbStore.checkSlotAvailable(locId, `${testDate}T10:30:00Z`, `${testDate}T11:30:00Z`);
    expect(isOverlapping).toBe(false);

    // 5. Subsequent free slot (11:00 to 12:00) should be available
    const isSubsequentFree = dbStore.checkSlotAvailable(locId, `${testDate}T11:00:00Z`, `${testDate}T12:00:00Z`);
    expect(isSubsequentFree).toBe(true);
  });

  it('should safely update inventory when an order is created', () => {
    const products = dbStore.getProducts();
    const product = products[0];
    const initialStock = product.stock_quantity;
    expect(initialStock).toBeGreaterThan(2);

    const order = dbStore.createOrder({
      customer_id: 'usr-test-order',
      subtotal: product.price * 2,
      shipping_amount: 0,
      tax_amount: product.price * 2 * 0.05,
      total_amount: product.price * 2 * 1.05,
      currency: 'GBP',
      order_status: 'processing',
      payment_status: 'paid',
      shipping_address: {
        full_name: 'Test Customer',
        address_line1: '10 Downing St',
        city: 'London',
        postal_code: 'SW1A 2AA',
        country: 'UK',
        phone: '+44 20 7946 0000'
      },
      items: [
        {
          id: `oi-${Date.now()}`,
          order_id: '',
          product_id: product.id,
          product_name_snapshot: product.name,
          unit_price_snapshot: product.price,
          quantity: 2,
          line_total: product.price * 2
        }
      ]
    });

    expect(order.order_number).toMatch(/^PWL-\d{6}$/);
    const updatedProduct = dbStore.getProducts().find(p => p.id === product.id);
    expect(updatedProduct?.stock_quantity).toBe(initialStock - 2);
  });
});
