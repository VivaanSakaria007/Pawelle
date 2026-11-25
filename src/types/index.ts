/**
 * PAWELLE — Core Type Definitions
 * Based on FUNCTIONAL_SPEC.md & TECHNICAL_ARCHITECTURE.md
 */

export type UserRole = 'guest' | 'customer' | 'staff' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  birth_date?: string;
  age_years?: number;
  weight?: number; // in kg
  photo_url?: string;
  coat_type?: string;
  grooming_preferences?: string;
  care_notes?: string; // allergies, sensitive zones, behavioral cues
  created_at: string;
  updated_at?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category_name?: string;
  description: string;
  short_description?: string;
  duration_minutes: number;
  base_price: number;
  eligible_pet_types: ('dog' | 'cat')[];
  image_url: string;
  inclusions: string[];
  exclusions?: string[];
  is_active: boolean;
  featured?: boolean;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  hours: string;
  timezone: string;
  is_active: boolean;
}

export interface StaffMember {
  id: string;
  profile_id: string;
  name: string;
  role_title: string;
  bio?: string;
  avatar_url?: string;
  location_id: string;
  specialties: string[];
  is_active: boolean;
}

export interface AvailabilitySlot {
  id: string;
  staff_id?: string;
  location_id: string;
  weekday: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string; // "09:00"
  end_time: string; // "18:00"
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Appointment {
  id: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  pet_id: string;
  pet_name?: string;
  pet_breed?: string;
  service_id: string;
  service_name?: string;
  staff_id?: string;
  staff_name?: string;
  location_id: string;
  location_name?: string;
  starts_at: string; // ISO string
  ends_at: string; // ISO string
  price_snapshot: number;
  status: AppointmentStatus;
  payment_status: PaymentStatus;
  customer_notes?: string;
  internal_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface GroomingRecord {
  id: string;
  pet_id: string;
  appointment_id: string;
  groomer_id: string;
  groomer_name?: string;
  date: string;
  services_performed: string[];
  coat_notes: string;
  grooming_notes: string;
  products_used?: string[];
  next_visit_recommendation?: string;
  before_photo_url?: string;
  after_photo_url?: string;
  created_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category_name?: string;
  description: string;
  sku: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  image_url: string;
  additional_images?: string[];
  ingredients?: string[];
  benefits?: string[];
  is_active: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  line_total: number;
  image_url?: string;
}

export interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  order_number: string;
  subtotal: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  customer_id: string;
  customer_name: string;
  avatar_url?: string;
  pet_name?: string;
  service_name?: string;
  rating: number; // 1-5
  review_text: string;
  is_approved: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  reply_text?: string;
  replied_at?: string;
  replied_by?: string;
  created_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image_url: string;
  author_name: string;
  author_role?: string;
  category_id: string;
  category_name?: string;
  read_time_minutes: number;
  status: 'draft' | 'published';
  published_at: string;
  created_at: string;
}

export interface SiteSettings {
  business_name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  opening_hours: string;
  currency_symbol: string;
  cancellation_window_hours: number;
  booking_deposit_required: boolean;
  deposit_percentage: number;
  maintenance_mode: boolean;
  whatsapp_number?: string;
}
