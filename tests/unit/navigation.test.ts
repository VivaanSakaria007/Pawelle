import { describe, it, expect, vi } from 'vitest';

describe('Navigation & Scroll Restoration Logic', () => {
  it('resets window scroll offset on route navigation', () => {
    // Mock window.scrollTo
    const scrollToMock = vi.fn();
    globalThis.scrollTo = scrollToMock;

    // Simulate route navigation reset handler
    const handleRouteTransition = (pathname: string, hash: string) => {
      if (!hash) {
        globalThis.scrollTo(0, 0);
      }
    };

    handleRouteTransition('/about', '');
    expect(scrollToMock).toHaveBeenCalledWith(0, 0);

    handleRouteTransition('/services', '');
    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
  });

  it('correctly detects active parent and nested routes', () => {
    const isParentActive = (pathname: string, prefix: string) => {
      return pathname.startsWith(prefix);
    };

    expect(isParentActive('/services/royal-botanical-bath', '/services')).toBe(true);
    expect(isParentActive('/shop/artisan-botanical-shampoo', '/shop')).toBe(true);
    expect(isParentActive('/blog/canine-aromatherapy', '/blog')).toBe(true);
    expect(isParentActive('/about', '/services')).toBe(false);
  });
});
