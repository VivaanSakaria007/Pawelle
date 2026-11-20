-- PAWELLE Database Security & Row Level Security (RLS) Policies
-- Conforms to FUNCTIONAL_SPEC.md Section 12 & TECHNICAL_ARCHITECTURE.md Section 5

-- Enable RLS on all tables
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

-- Helper function to check current user's role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles:
-- Public can read basic groomer info; users can read & update their own profile; admins can manage all
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.current_user_role() IN ('admin', 'staff'));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.current_user_role() = 'admin');

-- Pets:
-- Customers own their pets; staff/admin can view pets for appointment needs
CREATE POLICY "Customers manage own pets" ON public.pets
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Staff can view pets" ON public.pets
  FOR SELECT USING (public.current_user_role() IN ('staff', 'admin'));

-- Public Read for Services, Locations, Categories, Products, Blog Posts
CREATE POLICY "Public can view active services" ON public.services
  FOR SELECT USING (is_active = true OR public.current_user_role() = 'admin');

CREATE POLICY "Public can view active locations" ON public.locations
  FOR SELECT USING (is_active = true OR public.current_user_role() = 'admin');

CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT USING (is_active = true OR public.current_user_role() = 'admin');

CREATE POLICY "Public can view published blog posts" ON public.blog_posts
  FOR SELECT USING (status = 'published' OR public.current_user_role() = 'admin');

CREATE POLICY "Public can view approved reviews" ON public.reviews
  FOR SELECT USING (is_approved = true OR auth.uid() = customer_id OR public.current_user_role() = 'admin');

CREATE POLICY "Public can read service categories" ON public.service_categories FOR SELECT USING (true);
CREATE POLICY "Public can read product categories" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Public can read blog categories" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Public can read active staff" ON public.staff FOR SELECT USING (is_active = true OR public.current_user_role() = 'admin');
CREATE POLICY "Public can read availability" ON public.availability FOR SELECT USING (true);
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);

-- Contact Messages:
-- Anyone can submit, only admin can view/manage
CREATE POLICY "Anyone can submit contact message" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins manage contact messages" ON public.contact_messages
  FOR ALL USING (public.current_user_role() = 'admin');

-- Appointments:
-- Customer can read/insert own appointments; Staff can read/update assigned appointments; Admin full access
CREATE POLICY "Customers view own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Customers create own appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers cancel own appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "Staff and admin manage appointments" ON public.appointments
  FOR ALL USING (public.current_user_role() IN ('staff', 'admin'));

-- Grooming records:
-- Owner can view records for their pets; Staff/admin can insert/update
CREATE POLICY "Pet owners view grooming records" ON public.grooming_records
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.pets WHERE pets.id = grooming_records.pet_id AND pets.owner_id = auth.uid())
    OR public.current_user_role() IN ('staff', 'admin')
  );

CREATE POLICY "Staff manage grooming records" ON public.grooming_records
  FOR ALL USING (public.current_user_role() IN ('staff', 'admin'));

-- Orders & Order Items:
-- Customer views own orders; Admin views all
CREATE POLICY "Customers view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Customers insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Admins manage all orders" ON public.orders
  FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "Customers view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
    OR public.current_user_role() = 'admin'
  );

CREATE POLICY "Customers insert order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
  );

-- Admin Global Override for content & settings
CREATE POLICY "Admins manage services" ON public.services FOR ALL USING (public.current_user_role() = 'admin');
CREATE POLICY "Admins manage products" ON public.products FOR ALL USING (public.current_user_role() = 'admin');
CREATE POLICY "Admins manage blog" ON public.blog_posts FOR ALL USING (public.current_user_role() = 'admin');
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL USING (public.current_user_role() = 'admin');
