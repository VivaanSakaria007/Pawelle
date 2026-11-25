import { useNavigate, useLocation } from 'react-router-dom';
import {
  useAuth,
  AUTH_GUEST_INTENT_KEY,
  AUTH_LOGOUT_MARKER_KEY
} from './AuthContext';

/**
 * Hook for enforcing authentication on interactive actions
 * (e.g. Add to Cart, Save to Wishlist, Book Appointment, Reserve Suite)
 */
export const useRequireAuth = () => {
  const { isAuthenticated, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = (action?: () => void, customRedirect?: string): boolean => {
    if (isAuthenticated && user) {
      if (action) action();
      return true;
    }

    const destination = customRedirect || `${location.pathname}${location.search}`;
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(AUTH_LOGOUT_MARKER_KEY);
        sessionStorage.setItem(AUTH_GUEST_INTENT_KEY, destination);
      }
    } catch {
      // ignore
    }
    navigate(`/login?redirect=${encodeURIComponent(destination)}`);
    return false;
  };

  return {
    isAuthenticated,
    user,
    role,
    requireAuth
  };
};

export default useRequireAuth;
