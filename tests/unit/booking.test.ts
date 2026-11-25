import { describe, it, expect } from 'vitest';
import { dbStore } from '../../src/services/store';

describe('Booking Engine & Availability Collision Prevention', () => {
  it('detects booking slot collisions on overlapping appointment intervals', () => {
    const locationId = 'loc-1';
    const startsAt = '2026-12-15T10:00:00Z';
    const endsAt = '2026-12-15T11:30:00Z';

    // Verify slot is initially free or check conflict logic
    const initialCheck = dbStore.checkSlotAvailable(locationId, startsAt, endsAt);
    
    // Create an appointment at this exact slot
    const appointment = dbStore.createAppointment({
      customer_id: 'usr-test-client',
      customer_name: 'Test Client',
      customer_phone: '+44 7946 0991',
      pet_id: 'pet-1',
      pet_name: 'Winston',
      pet_breed: 'Golden Retriever',
      service_id: 'srv-1',
      service_name: 'The Royal Botanical Bath & Blow-dry',
      location_id: locationId,
      location_name: 'PAWELLE Mayfair Flagship',
      starts_at: startsAt,
      ends_at: endsAt,
      price_snapshot: 85,
      status: 'confirmed',
      payment_status: 'pending'
    });

    expect(appointment.id).toBeDefined();

    // Now, attempting to check or book the overlapping time slot must fail
    const collisionCheck = dbStore.checkSlotAvailable(locationId, '2026-12-15T10:30:00Z', '2026-12-15T12:00:00Z');
    expect(collisionCheck).toBe(false);

    // Attempting to create an appointment overlapping should throw an error
    expect(() => {
      dbStore.createAppointment({
        customer_id: 'usr-second-client',
        customer_name: 'Second Client',
        customer_phone: '+44 7946 0992',
        pet_id: 'pet-2',
        pet_name: 'Bella',
        pet_breed: 'Cavapoo',
        service_id: 'srv-1',
        service_name: 'The Royal Botanical Bath & Blow-dry',
        location_id: locationId,
        location_name: 'PAWELLE Mayfair Flagship',
        starts_at: '2026-12-15T10:30:00Z',
        ends_at: '2026-12-15T12:00:00Z',
        price_snapshot: 85,
        status: 'confirmed',
        payment_status: 'pending'
      });
    }).toThrow('This time slot is no longer available. Please select another slot.');
  });

  it('allows booking non-overlapping adjacent slots at the same location', () => {
    const locationId = 'loc-1';
    // Adjacent slot right after the previous one finishes
    const adjacentStarts = '2026-12-15T11:30:00Z';
    const adjacentEnds = '2026-12-15T12:30:00Z';

    const isAvailable = dbStore.checkSlotAvailable(locationId, adjacentStarts, adjacentEnds);
    expect(isAvailable).toBe(true);
  });
});
