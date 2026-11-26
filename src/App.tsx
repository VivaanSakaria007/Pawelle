import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './features/authentication/AuthContext';
import { CartProvider } from './features/cart/CartContext';
import { ThemeProvider } from './components/common/ThemeContext';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Layouts (eagerly loaded for shell structure)
import { PublicLayout } from './layouts/PublicLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { StaffLayout } from './layouts/StaffLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages (Code-split with React.lazy)
const Homepage1 = lazy(() => import('./pages/public/Homepage1').then(m => ({ default: m.Homepage1 })));
const Homepage2 = lazy(() => import('./pages/public/Homepage2').then(m => ({ default: m.Homepage2 })));
const AboutPage = lazy(() => import('./pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import('./pages/services/ServicesPage').then(m => ({ default: m.ServicesPage })));
const ServiceDetailPage = lazy(() => import('./pages/services/ServiceDetailPage').then(m => ({ default: m.ServiceDetailPage })));
const PricingPage = lazy(() => import('./pages/public/PricingPage').then(m => ({ default: m.PricingPage })));
const BlogPage = lazy(() => import('./pages/blog/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('./pages/blog/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const ContactPage = lazy(() => import('./pages/public/ContactPage').then(m => ({ default: m.ContactPage })));
const ShopPage = lazy(() => import('./pages/shop/ShopPage').then(m => ({ default: m.ShopPage })));
const ProductDetailPage = lazy(() => import('./pages/shop/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('./pages/shop/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/shop/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderConfirmationPage = lazy(() => import('./pages/shop/OrderConfirmationPage').then(m => ({ default: m.OrderConfirmationPage })));
const BookingPage = lazy(() => import('./pages/booking/BookingPage').then(m => ({ default: m.BookingPage })));
const ComingSoonPage = lazy(() => import('./pages/public/ComingSoonPage').then(m => ({ default: m.ComingSoonPage })));
const MaintenancePage = lazy(() => import('./pages/public/MaintenancePage').then(m => ({ default: m.MaintenancePage })));
const LegalPage = lazy(() => import('./pages/public/LegalPage').then(m => ({ default: m.LegalPage })));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Auth Pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));

// Customer Pages
const CustomerDashboardPage = lazy(() => import('./pages/customer/CustomerDashboardPage').then(m => ({ default: m.CustomerDashboardPage })));
const CustomerPetsPage = lazy(() => import('./pages/customer/CustomerPetsPage').then(m => ({ default: m.CustomerPetsPage })));
const CustomerAppointmentsPage = lazy(() => import('./pages/customer/CustomerAppointmentsPage').then(m => ({ default: m.CustomerAppointmentsPage })));
const CustomerGroomingRecordsPage = lazy(() => import('./pages/customer/CustomerGroomingRecordsPage').then(m => ({ default: m.CustomerGroomingRecordsPage })));
const CustomerOrdersPage = lazy(() => import('./pages/customer/CustomerOrdersPage').then(m => ({ default: m.CustomerOrdersPage })));
const CustomerWishlistPage = lazy(() => import('./pages/customer/CustomerWishlistPage').then(m => ({ default: m.CustomerWishlistPage })));
const CustomerSettingsPage = lazy(() => import('./pages/customer/CustomerSettingsPage').then(m => ({ default: m.CustomerSettingsPage })));

// Staff Pages
const StaffDashboardPage = lazy(() => import('./pages/staff/StaffDashboardPage').then(m => ({ default: m.StaffDashboardPage })));
const StaffSchedulePage = lazy(() => import('./pages/staff/StaffSchedulePage').then(m => ({ default: m.StaffSchedulePage })));
const StaffGroomingRecordCreatorPage = lazy(() => import('./pages/staff/StaffGroomingRecordCreatorPage').then(m => ({ default: m.StaffGroomingRecordCreatorPage })));
const StaffPetDirectoryPage = lazy(() => import('./pages/staff/StaffPetDirectoryPage').then(m => ({ default: m.StaffPetDirectoryPage })));

// Admin Pages
const AdminOverviewPage = lazy(() => import('./pages/admin/AdminOverviewPage').then(m => ({ default: m.AdminOverviewPage })));
const AdminAppointmentsPage = lazy(() => import('./pages/admin/AdminAppointmentsPage').then(m => ({ default: m.AdminAppointmentsPage })));
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage').then(m => ({ default: m.AdminCustomersPage })));
const AdminPetsPage = lazy(() => import('./pages/admin/AdminPetsPage').then(m => ({ default: m.AdminPetsPage })));
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage').then(m => ({ default: m.AdminServicesPage })));
const AdminStaffPage = lazy(() => import('./pages/admin/AdminStaffPage').then(m => ({ default: m.AdminStaffPage })));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage').then(m => ({ default: m.AdminProductsPage })));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage').then(m => ({ default: m.AdminOrdersPage })));
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage').then(m => ({ default: m.AdminMessagesPage })));
const AdminReviewsPage = lazy(() => import('./pages/admin/AdminReviewsPage').then(m => ({ default: m.AdminReviewsPage })));
const AdminBlogPage = lazy(() => import('./pages/admin/AdminBlogPage').then(m => ({ default: m.AdminBlogPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));

// Seamless query-preserving redirect for legacy /booking path
const BookingRedirect: React.FC = () => {
  const location = useLocation();
  return <Navigate to={`/customer/booking${location.search}`} replace />;
};

// Branded loading fallback
const PageLoadingFallback: React.FC = () => (
  <div
    style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '40px'
    }}
    aria-live="polite"
    aria-busy="true"
  >
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '3px solid var(--color-border)',
        borderTopColor: 'var(--color-forest)',
        borderRadius: '50%',
        animation: 'pawelle-page-spin 0.9s linear infinite'
      }}
    />
    <span
      style={{
        fontSize: '0.875rem',
        color: 'var(--color-text-secondary)',
        fontFamily: 'var(--font-body)',
        letterSpacing: '0.04em'
      }}
    >
      Loading Sanctuary Experience...
    </span>
    <style>{`
      @keyframes pawelle-page-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              {/* Global Route Scroll Restoration */}
              <ScrollToTop />
              
              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                  {/* Public Website Routes */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<Homepage1 />} />
                    <Route path="/niche-spa" element={<Homepage2 />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/services/:slug" element={<ServiceDetailPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/shop/:slug" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/order-confirmation/:id"
                      element={
                        <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                          <OrderConfirmationPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/booking" element={<BookingRedirect />} />
                    <Route path="/coming-soon" element={<ComingSoonPage />} />
                    <Route path="/maintenance" element={<MaintenancePage />} />
                    <Route path="/privacy" element={<LegalPage docType="privacy" />} />
                    <Route path="/terms" element={<LegalPage docType="terms" />} />
                    <Route path="/cancellation-policy" element={<LegalPage docType="cancellation" />} />

                  {/* Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>

                {/* Customer Portal Routes (Protected: customer strictly) */}
                <Route
                  path="/customer"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<CustomerDashboardPage />} />
                  <Route path="booking" element={<BookingPage />} />
                  <Route path="pets" element={<CustomerPetsPage />} />
                  <Route path="appointments" element={<CustomerAppointmentsPage />} />
                  <Route path="grooming-records" element={<CustomerGroomingRecordsPage />} />
                  <Route path="orders" element={<CustomerOrdersPage />} />
                  <Route path="wishlist" element={<CustomerWishlistPage />} />
                  <Route path="settings" element={<CustomerSettingsPage />} />
                </Route>

                {/* Staff Portal Routes (Protected: staff strictly) */}
                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute allowedRoles={['staff']}>
                      <StaffLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<StaffDashboardPage />} />
                  <Route path="appointments" element={<StaffSchedulePage />} />
                  <Route path="grooming-records" element={<StaffGroomingRecordCreatorPage />} />
                  <Route path="pet-directory" element={<StaffPetDirectoryPage />} />
                </Route>

                {/* Admin Portal Routes (Protected: admin strictly) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminOverviewPage />} />
                  <Route path="appointments" element={<AdminAppointmentsPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                  <Route path="pets" element={<AdminPetsPage />} />
                  <Route path="services" element={<AdminServicesPage />} />
                  <Route path="staff" element={<AdminStaffPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="messages" element={<AdminMessagesPage />} />
                  <Route path="reviews" element={<AdminReviewsPage />} />
                  <Route path="blog" element={<AdminBlogPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>

                {/* 404 Route */}
                <Route element={<PublicLayout />}>
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
