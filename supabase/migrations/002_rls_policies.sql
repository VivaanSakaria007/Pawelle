-- PAWELLE Database Security & Row Level Security (RLS) Policies
-- Conforms to FUNCTIONAL_SPEC.md Section 12 & TECHNICAL_ARCHITECTURE.md Section 5
-- Phase 4 Hardened Security Migration

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grooming_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 2. Helper function to check current user's role securely
-- Explicitly uses fixed search_path to prevent search_path hijacking
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.current_user_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated, anon;

-- 3. Automatic Profile Provisioning on Auth Sign-Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Sanctuary Client'),
    NEW.raw_user_meta_data->>'phone',
    'customer' -- Strictly enforce customer role for all self-service signups
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Safe creation of signup trigger on auth.users if available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'auth' AND tablename = 'users') THEN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- 4. Prohibit Self-Promotion: Trigger to block non-admin role modification
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF public.current_user_role() <> 'admin' THEN
      RAISE EXCEPTION 'Security Policy Violation: Account roles can only be granted by an administrator.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_role();

-- 5. Appointments Integrity Trigger: Prevent customer tampering with price, payment_status, or staff notes
CREATE OR REPLACE FUNCTION public.validate_appointment_mutation()
RETURNS TRIGGER AS $$
BEGIN
  IF public.current_user_role() NOT IN ('admin', 'staff') THEN
    IF TG_OP = 'UPDATE' THEN
      IF NEW.price_snapshot IS DISTINCT FROM OLD.price_snapshot THEN
        RAISE EXCEPTION 'Security Policy Violation: Appointment price snapshot cannot be modified.';
      END IF;
      IF NEW.payment_status IS DISTINCT FROM OLD.payment_status AND NEW.payment_status = 'paid' AND OLD.payment_status <> 'paid' THEN
        RAISE EXCEPTION 'Security Policy Violation: Payment status cannot be self-certified as paid.';
      END IF;
      IF NEW.internal_notes IS DISTINCT FROM OLD.internal_notes THEN
        RAISE EXCEPTION 'Security Policy Violation: Internal grooming notes are restricted to studio staff.';
      END IF;
    ELSIF TG_OP = 'INSERT' THEN
      -- Newly inserted customer appointments default payment_status to pending
      IF NEW.payment_status NOT IN ('pending', 'unpaid') THEN
        NEW.payment_status := 'pending';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_validate_appointment_mutation ON public.appointments;
CREATE TRIGGER trg_validate_appointment_mutation
  BEFORE INSERT OR UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_appointment_mutation();

-- -------------------------------------------------------------
-- ROW LEVEL SECURITY POLICIES
-- -------------------------------------------------------------

-- Drop existing policies for clean idempotency
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;

-- PROFILES:
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.current_user_role() IN ('admin', 'staff'));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.current_user_role() = 'admin')
  WITH CHECK (auth.uid() = id OR public.current_user_role() = 'admin');

CREATE POLICY "Admins manage profiles" ON public.profiles
  FOR ALL USING (public.current_user_role() = 'admin');

-- PETS:
DROP POLICY IF EXISTS "Customers manage own pets" ON public.pets;
DROP POLICY IF EXISTS "Staff can view pets" ON public.pets;
DROP POLICY IF EXISTS "Admins manage all pets" ON public.pets;

CREATE POLICY "Customers manage own pets" ON public.pets
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Staff can view pets" ON public.pets
  FOR SELECT USING (public.current_user_role() IN ('staff', 'admin'));

CREATE POLICY "Admins manage all pets" ON public.pets
  FOR ALL USING (public.current_user_role() = 'admin');

-- SERVICES & CATEGORIES:
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
DROP POLICY IF EXISTS "Admins manage services" ON public.services;
DROP POLICY IF EXISTS "Public can read service categories" ON public.service_categories;
DROP POLICY IF EXISTS "Admins manage service categories" ON public.service_categories;

CREATE POLICY "Public can view active services" ON public.services
  FOR SELECT USING (is_active = true OR public.current_user_role() IN ('admin', 'staff'));

CREATE POLICY "Admins manage services" ON public.services
  FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "Public can read service categories" ON public.service_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins manage service categories" ON public.service_categories
  FOR ALL USING (public.current_user_role() = 'admin');

-- LOCATIONS & AVAILABILITY & STAFF:
DROP POLICY IF EXISTS "Public can view active locations" ON public.locations;
DROP POLICY IF EXISTS "Admins manage locations" ON public.locations;
DROP POLICY IF EXISTS "Public can read active staff" ON public.staff;
DROP POLICY IF EXISTS "Admins manage staff" ON public.staff;
DROP POLICY IF EXISTS "Public can read availability" ON public.availability;
DROP POLICY IF EXISTS "Admins manage availability" ON public.availability;

CREATE POLICY "Public can view active locations" ON public.locations
  FOR SELECT USING (is_active = true OR public.current_user_role() = 'admin');

CREATE POLICY "Admins manage locations" ON public.locations
  FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "Public can read active staff" ON public.staff
  FOR SELECT USING (is_active = true OR public.current_user_role() = 'admin');

CREATE POLICY "Admins manage staff" ON public.staff
  FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "Public can read availability" ON public.availability
  FOR SELECT USING (true);

CREATE POLICY "Admins manage availability" ON public.availability
  FOR ALL USING (public.current_user_role() = 'admin');

-- APPOINTMENTS:
DROP POLICY IF EXISTS "Customers view own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Customers create own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Customers cancel own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Staff and admin manage appointments" ON public.appointments;

CREATE POLICY "Customers view own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = customer_id OR public.current_user_role() IN ('admin', 'staff'));

CREATE POLICY "Customers create own appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers cancel own appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = customer_id)
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Staff and admin manage appointments" ON public.appointments
  FOR ALL USING (public.current_user_role() IN ('staff', 'admin'));

-- GROOMING RECORDS:
DROP POLICY IF EXISTS "Pet owners view grooming records" ON public.grooming_records;
DROP POLICY IF EXISTS "Staff manage grooming records" ON public.grooming_records;

CREATE POLICY "Pet owners view grooming records" ON public.grooming_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.pets
      WHERE pets.id = grooming_records.pet_id AND pets.owner_id = auth.uid()
    )
    OR public.current_user_role() IN ('staff', 'admin')
  );

CREATE POLICY "Staff manage grooming records" ON public.grooming_records
  FOR ALL USING (public.current_user_role() IN ('staff', 'admin'));

-- PRODUCTS & CATEGORIES:
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins manage products" ON public.products;
DROP POLICY IF EXISTS "Public can read product categories" ON public.product_categories;
DROP POLICY IF EXISTS "Admins manage product categories" ON public.product_categories;

CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT USING (is_active = true OR public.current_user_role() = 'admin');

CREATE POLICY "Admins manage products" ON public.products
  FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "Public can read product categories" ON public.product_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins manage product categories" ON public.product_categories
  FOR ALL USING (public.current_user_role() = 'admin');

-- ORDERS & ORDER ITEMS:
DROP POLICY IF EXISTS "Customers view own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Customers view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Customers insert order items" ON public.order_items;

CREATE POLICY "Customers view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id OR public.current_user_role() = 'admin');

CREATE POLICY "Customers insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Admins manage all orders" ON public.orders
  FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "Customers view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id AND (orders.customer_id = auth.uid() OR public.current_user_role() = 'admin')
    )
  );

CREATE POLICY "Customers insert order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid()
    )
    OR public.current_user_role() = 'admin'
  );

-- PAYMENTS:
DROP POLICY IF EXISTS "Customers view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins manage payments" ON public.payments;

CREATE POLICY "Customers view own payments" ON public.payments
  FOR SELECT USING (
    (order_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.customer_id = auth.uid()
    ))
    OR
    (appointment_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.appointments WHERE appointments.id = payments.appointment_id AND appointments.customer_id = auth.uid()
    ))
    OR public.current_user_role() = 'admin'
  );

CREATE POLICY "Admins manage payments" ON public.payments
  FOR ALL USING (public.current_user_role() = 'admin');

-- REVIEWS:
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Customers create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins manage reviews" ON public.reviews;

CREATE POLICY "Public can view approved reviews" ON public.reviews
  FOR SELECT USING (is_approved = true OR auth.uid() = customer_id OR public.current_user_role() = 'admin');

CREATE POLICY "Customers create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Admins manage reviews" ON public.reviews
  FOR ALL USING (public.current_user_role() = 'admin');

-- CONTACT MESSAGES:
DROP POLICY IF EXISTS "Anyone can submit contact message" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins manage contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can submit contact message" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins manage contact messages" ON public.contact_messages
  FOR ALL USING (public.current_user_role() = 'admin');

-- BLOG POSTS & CATEGORIES:
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins manage blog" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can read blog categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Admins manage blog categories" ON public.blog_categories;

CREATE POLICY "Public can view published blog posts" ON public.blog_posts
  FOR SELECT USING (status = 'published' OR public.current_user_role() = 'admin');

CREATE POLICY "Admins manage blog" ON public.blog_posts
  FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "Public can read blog categories" ON public.blog_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins manage blog categories" ON public.blog_categories
  FOR ALL USING (public.current_user_role() = 'admin');

-- SITE SETTINGS:
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins manage settings" ON public.site_settings;

CREATE POLICY "Public can read site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins manage settings" ON public.site_settings
  FOR ALL USING (public.current_user_role() = 'admin');
