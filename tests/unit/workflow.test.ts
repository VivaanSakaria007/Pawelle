import { describe, it, expect } from 'vitest';
import { dbStore } from '../../src/services/store';

describe('PAWELLE Workflow Integration Tests', () => {
  it('should allow clients to submit contact messages and admin to update status', () => {
    const initialCount = dbStore.getContactMessages().length;

    const newMsg = dbStore.createContactMessage({
      name: 'Arthur Pendelton',
      email: 'arthur.p@example.com',
      phone: '+44 7911 123456',
      subject: 'Specialized coat restoration inquiry',
      message: 'Does your Mayfair atelier accommodate mature Newfoundlands?'
    });

    expect(newMsg.id).toBeDefined();
    expect(newMsg.status).toBe('new');

    const updatedMessages = dbStore.getContactMessages();
    expect(updatedMessages.length).toBe(initialCount + 1);

    // Admin marks message as read
    dbStore.updateContactMessageStatus(newMsg.id, 'read');
    const readMsg = dbStore.getContactMessages().find(m => m.id === newMsg.id);
    expect(readMsg?.status).toBe('read');
  });

  it('should enforce review moderation before public approval', () => {
    const unapprovedReview = dbStore.createReview({
      customer_id: 'usr-client-99',
      customer_name: 'Lady Catherine',
      pet_name: 'Bartholomew',
      service_name: 'The Royal Botanical Bath',
      rating: 5,
      review_text: 'An exceptional experience from start to finish.'
    });

    expect(unapprovedReview.is_approved).toBe(false);

    // Should not appear in public approved reviews
    const publicReviewsBefore = dbStore.getReviews(true);
    expect(publicReviewsBefore.some(r => r.id === unapprovedReview.id)).toBe(false);

    // Admin approves review
    dbStore.setReviewApproved(unapprovedReview.id, true);

    const publicReviewsAfter = dbStore.getReviews(true);
    expect(publicReviewsAfter.some(r => r.id === unapprovedReview.id)).toBe(true);
  });

  it('should update and persist studio operating configuration', () => {
    const current = dbStore.getSettings();
    expect(current.business_name).toBe('PAWELLE');

    dbStore.updateSettings({ cancellation_window_hours: 48 });
    const updated = dbStore.getSettings();
    expect(updated.cancellation_window_hours).toBe(48);

    // Reset back to 24 for standard operation
    dbStore.updateSettings({ cancellation_window_hours: 24 });
    expect(dbStore.getSettings().cancellation_window_hours).toBe(24);
  });
});
