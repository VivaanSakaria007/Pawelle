import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/authentication/AuthContext';
import { CartProvider } from './features/cart/CartContext';
import { ThemeProvider } from './components/common/ThemeContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { StaffLayout } from './layouts/StaffLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Homepage1 } from './pages/public/Homepage1';
import { Homepage2 } from './pages/public/Homepage2';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/services/ServicesPage';
import { ServiceDetailPage } from './pages/services/ServiceDetailPage';
import { PricingPage } from './pages/public/PricingPage';
import { BlogPage } from './pages/blog/BlogPage';
import { BlogPostPage } from './pages/blog/BlogPostPage';
import { ContactPage } from './pages/public/ContactPage';
import { ShopPage } from './pages/shop/ShopPage';
import { ProductDetailPage } from './pages/shop/ProductDetailPage';
import { CartPage } from './pages/shop/CartPage';
import { CheckoutPage } from './pages/shop/CheckoutPage';
import { OrderConfirmationPage } from './pages/shop/OrderConfirmationPage';
import { BookingPage } from './pages/booking/BookingPage';
import { ComingSoonPage } from './pages/public/ComingSoonPage';
import { MaintenancePage } from './pages/public/MaintenancePage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Customer Pages
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import { CustomerPetsPage } from './pages/customer/CustomerPetsPage';
import { CustomerAppointmentsPage } from './pages/customer/CustomerAppointmentsPage';
import { CustomerGroomingRecordsPage } from './pages/customer/CustomerGroomingRecordsPage';
import { CustomerOrdersPage } from './pages/customer/CustomerOrdersPage';
import { CustomerWishlistPage } from './pages/customer/CustomerWishlistPage';
import { CustomerSettingsPage } from './pages/customer/CustomerSettingsPage';

// Staff Pages
import { StaffDashboardPage } from './pages/staff/StaffDashboardPage';
import { StaffGroomingRecordCreatorPage } from './pages/staff/StaffGroomingRecordCreatorPage';
import { StaffPetDirectoryPage } from './pages/staff/StaffPetDirectoryPage';

// Admin Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminPetsPage } from './pages/admin/AdminPetsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminStaffPage } from './pages/admin/AdminStaffPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminBlogPage } from './pages/admin/AdminBlogPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
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
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/coming-soon" element={<ComingSoonPage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Route>

              {/* Customer Portal Routes */}
              <Route path="/customer" element={<CustomerLayout />}>
                <Route index element={<CustomerDashboardPage />} />
                <Route path="pets" element={<CustomerPetsPage />} />
                <Route path="appointments" element={<CustomerAppointmentsPage />} />
                <Route path="grooming-records" element={<CustomerGroomingRecordsPage />} />
                <Route path="orders" element={<CustomerOrdersPage />} />
                <Route path="wishlist" element={<CustomerWishlistPage />} />
                <Route path="settings" element={<CustomerSettingsPage />} />
              </Route>

              {/* Staff Portal Routes */}
              <Route path="/staff" element={<StaffLayout />}>
                <Route index element={<StaffDashboardPage />} />
                <Route path="grooming-records" element={<StaffGroomingRecordCreatorPage />} />
                <Route path="pet-directory" element={<StaffPetDirectoryPage />} />
              </Route>

              {/* Admin Portal Routes */}
              <Route path="/admin" element={<AdminLayout />}>
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
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
