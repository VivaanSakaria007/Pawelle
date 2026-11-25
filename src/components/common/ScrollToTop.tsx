import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useAuth } from '../../features/authentication/AuthContext';

/**
 * Centralized Route Scroll Restoration Component
 * 
 * Ensures that on new route navigations, pages start at the very top (0, 0)
 * rather than preserving the previous scroll offset.
 * 
 * Handles:
 * - Direct path navigation (instant jump to top)
 * - Hash fragment links (e.g., /#contact, #features)
 * - Popstate (browser back/forward preserves intentional history offset)
 * - User identity change (resets scroll to top immediately upon sign-in/out)
 * - Smooth scroll conflict avoidance
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const { user } = useAuth();
  const prevUserIdRef = useRef<string | undefined>(user?.id);

  // Reset scroll to top whenever user identity switches
  useEffect(() => {
    if (prevUserIdRef.current !== user?.id) {
      prevUserIdRef.current = user?.id;
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }, [user?.id]);

  useEffect(() => {
    // If a hash fragment exists, attempt to scroll to the target element
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      } else {
        // Fallback with a slight delay for dynamic content
        const timer = setTimeout(() => {
          const delayedElement = document.getElementById(targetId);
          if (delayedElement) {
            delayedElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    }

    // For new route navigations (PUSH or REPLACE), jump instantly to top
    // to prevent sluggish animated scrolling or retained scroll positions
    if (navigationType !== 'POP') {
      // Temporarily ensure smooth scroll doesn't interfere
      const html = document.documentElement;
      const prevScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';

      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      html.style.scrollBehavior = prevScrollBehavior;
    }
  }, [pathname, hash, navigationType]);

  return null;
};

export default ScrollToTop;
