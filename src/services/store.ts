import {
  UserProfile,
  Pet,
  Service,
  ServiceCategory,
  Location,
  StaffMember,
  AvailabilitySlot,
  Appointment,
  AppointmentStatus,
  GroomingRecord,
  Product,
  ProductCategory,
  Order,
  Review,
  ContactMessage,
  BlogPost,
  BlogCategory,
  SiteSettings
} from '../types';

// Default initial state matching seed data and specs
const INITIAL_SETTINGS: SiteSettings = {
  business_name: 'PAWELLE',
  tagline: 'Luxury Pet Grooming & Spa',
  email: 'concierge@pawelle.com',
  phone: '+44 20 7946 0812',
  address: '42 South Audley Street, Mayfair, London W1K 2PS',
  opening_hours: 'Monday – Saturday: 08:30 – 18:30, Sunday: 10:00 – 16:00',
  currency_symbol: '£',
  cancellation_window_hours: 24,
  booking_deposit_required: false,
  deposit_percentage: 0,
  maintenance_mode: false,
  whatsapp_number: '+447946081200'
};

const INITIAL_SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'cat-1', name: 'Signature Styling', slug: 'signature-styling', description: 'Precision scissor cuts and custom breed shaping.' },
  { id: 'cat-2', name: 'Hydrotherapy & Spa Baths', slug: 'spa-baths', description: 'Botanical soaks, ozone hydro-massage, and restorative conditioning.' },
  { id: 'cat-3', name: 'Essential Wellness Care', slug: 'essential-wellness', description: 'Hygiene care: paw balms, gentle nail trims, and ear care.' },
  { id: 'cat-4', name: 'Puppy & Senior Gentle Care', slug: 'puppy-senior-care', description: 'Stress-free, gentle pacing tailored for delicate pets.' }
];

const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'The Royal Botanical Bath & Blow-dry',
    slug: 'royal-botanical-bath',
    category_id: 'cat-2',
    category_name: 'Hydrotherapy & Spa Baths',
    description: 'An opulent deep cleansing soak infused with wild chamomile and colloidal oatmeal. Includes warm ozone hydro-rinse, hand fluff dry, and dead-hair deshedding.',
    short_description: 'Hydrotherapy bath with organic calming botanicals and hand blow-dry.',
    duration_minutes: 60,
    base_price: 85,
    eligible_pet_types: ['dog', 'cat'],
    image_url: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Organic chamomile bath',
      'Warm fluff blow-dry',
      'Full brush out',
      'Ear cleansing',
      'Paw pad moisture treatment'
    ],
    exclusions: ['Full scissor haircut'],
    is_active: true,
    featured: true
  },
  {
    id: 'srv-2',
    name: 'Artisanal Scissor Haircut & Full Styling',
    slug: 'artisanal-scissor-styling',
    category_id: 'cat-1',
    category_name: 'Signature Styling',
    description: 'Bespoke hand-scissor silhouette sculpturing by our Master Stylists. Tailored to pet breed standards, body ergonomics, and pet-parent stylistic preferences.',
    short_description: 'Precision handcrafted scissor sculpting and complete styling.',
    duration_minutes: 90,
    base_price: 130,
    eligible_pet_types: ['dog'],
    image_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Custom scissor cut',
      'Sanitary trim',
      'Face & ear styling',
      'Paw pad round trim',
      'Full botanical bath & blow-dry'
    ],
    exclusions: ['Matted coat de-felting over 30 mins'],
    is_active: true,
    featured: true
  },
  {
    id: 'srv-3',
    name: 'Feline Serenity Spa Ritual',
    slug: 'feline-serenity-spa',
    category_id: 'cat-2',
    category_name: 'Hydrotherapy & Spa Baths',
    description: 'Exclusively quiet, cat-certified sanctuary room. Includes gentle dry foam or warm hydro-cleanse, thorough comb-out, sanitary trim, and organic ear hygiene.',
    short_description: 'Calm, dog-free sanctuary treatment crafted specially for cats.',
    duration_minutes: 60,
    base_price: 115,
    eligible_pet_types: ['cat'],
    image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Isolated tranquil room',
      'Cat-safe cleansing lather',
      'De-shedding comb-out',
      'Gentle claw trim',
      'Facial wipe & ear care'
    ],
    exclusions: ['Sedation'],
    is_active: true,
    featured: true
  },
  {
    id: 'srv-4',
    name: 'Puppy First Confidence Journey',
    slug: 'puppy-first-confidence',
    category_id: 'cat-4',
    category_name: 'Puppy & Senior Gentle Care',
    description: 'Designed for puppies under 6 months. Gentle vibration desensitisation, warm gentle water introduction, scissor sound play, and plenty of positive affection.',
    short_description: 'Positive sensory introduction to grooming tools for puppies.',
    duration_minutes: 45,
    base_price: 60,
    eligible_pet_types: ['dog'],
    image_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Slow sound conditioning',
      'Micro-bath & gentle towel dry',
      'Paw massage & nail file',
      'Gentle eye trim',
      'Playtime & treats'
    ],
    exclusions: ['Full adult haircut'],
    is_active: true,
    featured: false
  },
  {
    id: 'srv-5',
    name: 'Nail Spa & Botanical Paw Therapy',
    slug: 'nail-spa-paw-therapy',
    category_id: 'cat-3',
    category_name: 'Essential Wellness Care',
    description: 'Precision claw clipping and electric filing to velvety smoothness, followed by warm shea butter & calendula paw pad balm application.',
    short_description: 'Smooth claw filing and deep herbal balm treatment for paw pads.',
    duration_minutes: 30,
    base_price: 40,
    eligible_pet_types: ['dog', 'cat'],
    image_url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Precision clip & smooth electric file',
      'Paw fur trim',
      'Calendula & shea butter massage'
    ],
    is_active: true,
    featured: false
  },
  {
    id: 'srv-6',
    name: 'Dead-Sea Mineral Mud Detox Treatment',
    slug: 'dead-sea-mud-detox',
    category_id: 'cat-2',
    category_name: 'Hydrotherapy & Spa Baths',
    description: 'Rich restorative mud wrap infused with 26 natural minerals. Alleviates hot spots, hydrates dry skin, purges allergens, and leaves coat with mirror-like shine.',
    short_description: 'Therapeutic mineral mud wrap for skin health and silky shine.',
    duration_minutes: 75,
    base_price: 110,
    eligible_pet_types: ['dog'],
    image_url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Warm mud pack application',
      '10-minute coat wrap',
      'Hydro-massage rinse',
      'Silk protein conditioner'
    ],
    is_active: true,
    featured: false
  }
];

const INITIAL_LOCATIONS: Location[] = [
  {
    id: 'loc-1',
    name: 'PAWELLE Flagship Studio — Mayfair',
    address: '42 South Audley Street, Mayfair',
    city: 'London',
    phone: '+44 20 7946 0812',
    email: 'mayfair@pawelle.com',
    hours: 'Mon–Sat: 08:30 – 18:30, Sun: 10:00 – 16:00',
    timezone: 'Europe/London',
    is_active: true
  },
  {
    id: 'loc-2',
    name: 'PAWELLE Chelsea Garden Retreat',
    address: '18 King\'s Road, Chelsea',
    city: 'London',
    phone: '+44 20 7946 0884',
    email: 'chelsea@pawelle.com',
    hours: 'Tue–Sun: 09:00 – 18:00, Mon: Closed',
    timezone: 'Europe/London',
    is_active: true
  }
];

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'stf-1',
    profile_id: 'usr-staff-1',
    name: 'Clara Vance',
    role_title: 'Master Canine Stylist & Head of Salon',
    bio: 'Over 12 years of precision scissor styling experience with breed-show certifications and fear-free grooming honors.',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    location_id: 'loc-1',
    specialties: ['Asian Fusion Styling', 'Doodle Scissoring', 'Fear-Free Handling'],
    is_active: true
  },
  {
    id: 'stf-2',
    profile_id: 'usr-staff-2',
    name: 'Julian Thorne',
    role_title: 'Hydrotherapy & Feline Specialist',
    bio: 'Certified feline master groomer dedicated to ultra-quiet, low-stress hydrotherapy rituals and skin microbiome restoration.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    location_id: 'loc-1',
    specialties: ['Cat Grooming Sanctuary', 'Mineral Mud Therapy', 'Dermatology Care'],
    is_active: true
  }
];

const INITIAL_PRODUCT_CATEGORIES: ProductCategory[] = [
  { id: 'pcat-1', name: 'Coat & Bath Botanicals', slug: 'coat-bath-botanicals', description: 'Natural, chemical-free washes and organic rinses.' },
  { id: 'pcat-2', name: 'Paw & Skin Salves', slug: 'paw-skin-salves', description: 'Intensive organic balms and protective barrier ointments.' },
  { id: 'pcat-3', name: 'Grooming Tools & Brushes', slug: 'grooming-tools-brushes', description: 'Hand-finished beechwood slicker brushes and steel combs.' }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prd-1',
    name: 'Colloidal Oatmeal & Wild Chamomile Shampoo',
    slug: 'colloidal-oatmeal-shampoo',
    category_id: 'pcat-1',
    category_name: 'Coat & Bath Botanicals',
    description: 'Specially formulated pH-balanced wash crafted in England. Gently cleanses sensitive dermis without stripping natural lipid barriers. Free of parabens, sulfates, and synthetic perfumes.',
    sku: 'PWL-SHP-001',
    price: 34,
    stock_quantity: 48,
    image_url: 'https://images.unsplash.com/photo-1608248597359-00965e64805e?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Organic Colloidal Oat Flour', 'Roman Chamomile Extract', 'Aloe Leaf Juice', 'Coconut Glucoside'],
    benefits: ['Soothes irritated or allergic skin', 'Restores fur moisture balance', 'Safe for puppies and cats'],
    is_active: true,
    featured: true
  },
  {
    id: 'prd-2',
    name: 'Botanical Paw & Snout Protective Salve',
    slug: 'botanical-paw-snout-salve',
    category_id: 'pcat-2',
    category_name: 'Paw & Skin Salves',
    description: 'An intensive nourishing salve created with organic raw shea butter, sea buckthorn oil, and organic calendula. Fast-absorbing, moisture-locking and 100% lick-safe.',
    sku: 'PWL-BLM-002',
    price: 26,
    sale_price: 22,
    stock_quantity: 75,
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Fairtrade Raw Shea Butter', 'Cold-pressed Sea Buckthorn Oil', 'Calendula Blossom Infusion', 'Organic Beeswax'],
    benefits: ['Heals dry cracked paw pads', 'Forms weather-shield against hot pavement & winter salt', '100% lick-safe'],
    is_active: true,
    featured: true
  },
  {
    id: 'prd-3',
    name: 'Artisanal Beechwood Pin & Bristle Brush',
    slug: 'artisan-beechwood-brush',
    category_id: 'pcat-3',
    category_name: 'Grooming Tools & Brushes',
    description: 'Handcrafted in Germany using sustainable European beechwood. Double-sided featuring rounded stainless steel detangling pins and natural boar bristles for luminous coat shine.',
    sku: 'PWL-BRS-003',
    price: 48,
    stock_quantity: 26,
    image_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    ingredients: ['FSC Certified Beechwood', 'Natural Wild Boar Bristle', 'Polished Stainless Steel Pins'],
    benefits: ['Distributes natural sebum oils along fur', 'Gentle on sensitive scalps', 'Ergonomic hand-carved handle'],
    is_active: true,
    featured: true
  }
];

const INITIAL_BLOG_CATEGORIES: BlogCategory[] = [
  { id: 'bcat-1', name: 'Coat Health', slug: 'coat-health' },
  { id: 'bcat-2', name: 'Seasonal Care', slug: 'seasonal-care' },
  { id: 'bcat-3', name: 'Styling & Breed Guides', slug: 'styling-guides' }
];

const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Understanding the Science of the Canine Double Coat',
    slug: 'understanding-canine-double-coat',
    excerpt: 'Why shaving a double-coated dog can disrupt their natural thermoregulation and what restorative deshedding achieves instead.',
    body: `Double coats serve as sophisticated natural insulation. The dense, woolly undercoat traps air to insulate against both cold winters and hot summers, while the harsher guard hairs shed moisture, UV radiation, and outdoor dirt.

When pet parents ask to shave a double-coated breed like a Golden Retriever, Samoyed, or Pomeranian during heatwaves, they rarely realize it can permanently impair hair growth (post-clipping alopecia) and actually elevate heat stroke risk.

At PAWELLE, we practice specialized hydro-deshedding. Our process gently lifts dead undercoat using warm ozone hydro-jets and botanical conditioning masks, allowing natural ventilation without sacrificing the coat's defensive architecture.`,
    cover_image_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Clara Vance',
    author_role: 'Master Canine Stylist',
    category_id: 'bcat-1',
    category_name: 'Coat Health',
    read_time_minutes: 5,
    status: 'published',
    published_at: '2026-11-15T10:00:00Z',
    created_at: '2026-11-15T10:00:00Z'
  },
  {
    id: 'post-2',
    title: 'The Calming Grooming Ritual: Creating Low-Stress Experiences',
    slug: 'calming-grooming-ritual-low-stress',
    excerpt: 'Our deliberate approach to sensory accommodation, acoustic dampening, and rhythmic tactile care for nervous pets.',
    body: `Many pets experience elevated cortisol levels during conventional grooming environments due to cage dryers, high-decibel blasters, and chaotic multi-dog salons.

PAWELLE operates strictly on a one-on-one session model. Every grooming suite is acoustic-paneled to reduce mechanical frequencies. We infuse the air with organic French lavender and valerian hydrosols that soothe nervous pet temperaments.

Most crucially, we read pet micro-expressions. If a dog shows early stress signals (lip-licking, whale eye, stiffness), we take an unhurried affection pause. True luxury pet care is fundamentally rooted in compassion.`,
    cover_image_url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Julian Thorne',
    author_role: 'Director of Holistic Wellness',
    category_id: 'bcat-2',
    category_name: 'Seasonal Care',
    read_time_minutes: 4,
    status: 'published',
    published_at: '2026-11-10T14:30:00Z',
    created_at: '2026-11-10T14:30:00Z'
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customer_id: 'usr-customer-1',
    customer_name: 'Eleanor Sterling',
    pet_name: 'Milo (Cavapoo)',
    service_name: 'Artisanal Scissor Haircut',
    rating: 5,
    review_text: 'PAWELLE is unmatched. Milo used to shake whenever we pulled up to other groomers. Here, he practically bounds through the doorway. Clara’s scissor styling is impeccable—he looks like an aristocratic teddy bear.',
    is_approved: true,
    created_at: '2026-11-12T16:20:00Z'
  },
  {
    id: 'rev-2',
    customer_id: 'usr-customer-2',
    customer_name: 'Harrison Blake',
    pet_name: 'Cleo (British Shorthair)',
    service_name: 'Feline Serenity Spa Ritual',
    rating: 5,
    review_text: 'Finding a groomer who truly understands felines is extraordinarily rare. Julian was patient, calm, and treated Cleo with utmost delicacy. Her coat has never felt so silky and the private cat room gave us total peace of mind.',
    is_approved: true,
    created_at: '2026-11-08T11:45:00Z'
  }
];

// Helper to get/set localStorage with safety
function loadState<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const raw = localStorage.getItem(`pawelle_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveState<T>(key: string, data: T): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(`pawelle_${key}`, JSON.stringify(data));
  } catch {
    // Ignore storage issues in test/SSR
  }
}

// Memory / LocalStorage Persistent Store Engine
class PawelleStore {
  private settings: SiteSettings = loadState('settings', INITIAL_SETTINGS);
  private services: Service[] = loadState('services', INITIAL_SERVICES);
  private serviceCategories: ServiceCategory[] = loadState('service_categories', INITIAL_SERVICE_CATEGORIES);
  private locations: Location[] = loadState('locations', INITIAL_LOCATIONS);
  private staff: StaffMember[] = loadState('staff', INITIAL_STAFF);
  private products: Product[] = loadState('products', INITIAL_PRODUCTS);
  private productCategories: ProductCategory[] = loadState('product_categories', INITIAL_PRODUCT_CATEGORIES);
  private blogPosts: BlogPost[] = loadState('blog_posts', INITIAL_BLOG_POSTS);
  private blogCategories: BlogCategory[] = loadState('blog_categories', INITIAL_BLOG_CATEGORIES);
  private reviews: Review[] = loadState('reviews', INITIAL_REVIEWS);
  private pets: Pet[] = loadState('pets', [
    {
      id: 'pet-1',
      owner_id: 'usr-demo-customer',
      name: 'Oliver',
      species: 'dog',
      breed: 'Golden Retriever',
      age_years: 3,
      weight: 29.5,
      coat_type: 'Dense Double Coat',
      grooming_preferences: 'Prefers gentle tail brushing, sensitive about back paws.',
      care_notes: 'Allergic to synthetic fragrance. Use organic oatmeal wash only.',
      photo_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
      created_at: '2026-10-01T08:00:00Z'
    },
    {
      id: 'pet-2',
      owner_id: 'usr-demo-customer',
      name: 'Luna',
      species: 'cat',
      breed: 'Ragdoll',
      age_years: 2,
      weight: 4.8,
      coat_type: 'Long Silky Coat',
      grooming_preferences: 'Prefers quiet environment, enjoys chin scratches.',
      care_notes: 'Prone to hairballs. Gentle sanitary trim required.',
      photo_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
      created_at: '2026-10-15T09:30:00Z'
    }
  ]);
  private appointments: Appointment[] = loadState('appointments', [
    {
      id: 'apt-1',
      customer_id: 'usr-demo-customer',
      customer_name: 'Jessica Vance',
      customer_phone: '+44 7946 0991',
      pet_id: 'pet-1',
      pet_name: 'Oliver',
      pet_breed: 'Golden Retriever',
      service_id: 'srv-1',
      service_name: 'The Royal Botanical Bath & Blow-dry',
      staff_id: 'stf-1',
      staff_name: 'Clara Vance',
      location_id: 'loc-1',
      location_name: 'PAWELLE Flagship Studio — Mayfair',
      starts_at: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0] + 'T10:00:00Z',
      ends_at: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0] + 'T11:00:00Z',
      price_snapshot: 85,
      status: 'confirmed',
      payment_status: 'paid',
      customer_notes: 'Please pay extra attention to back hip joints.',
      created_at: '2026-11-18T10:00:00Z'
    }
  ]);
  private groomingRecords: GroomingRecord[] = loadState('grooming_records', [
    {
      id: 'gr-1',
      pet_id: 'pet-1',
      appointment_id: 'apt-prev-1',
      groomer_id: 'stf-1',
      groomer_name: 'Clara Vance',
      date: '2026-10-24',
      services_performed: ['Oatmeal Hydrotherapy Bath', 'Blow-Dry & Deshed', 'Nail Trimming', 'Paw Butter'],
      coat_notes: 'Coat in healthy condition. Mild undercoat knotting around flank brushed out smoothly.',
      grooming_notes: 'Oliver was exceptionally well-behaved throughout the bath. Responded wonderfully to positive encouragement.',
      products_used: ['Colloidal Oatmeal Shampoo', 'Botanical Paw Salve'],
      next_visit_recommendation: '4–6 weeks for seasonal coat maintenance.',
      before_photo_url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
      after_photo_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
      created_at: '2026-10-24T12:00:00Z'
    }
  ]);
  private orders: Order[] = loadState('orders', []);
  private contactMessages: ContactMessage[] = loadState('contact_messages', [
    {
      id: 'msg-1',
      name: 'Victoria Wentworth',
      email: 'victoria.w@example.com',
      phone: '+44 7700 900123',
      subject: 'Specialized grooming for nervous rescue greyhound',
      message: 'Hello, our rescue greyhound has severe noise sensitivity. Do you offer completely private time slots without dryers running?',
      status: 'new',
      created_at: '2026-11-19T14:15:00Z'
    }
  ]);

  // Site Settings
  getSettings(): SiteSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<SiteSettings>): SiteSettings {
    this.settings = { ...this.settings, ...newSettings };
    saveState('settings', this.settings);
    return this.settings;
  }

  // Services
  getServices(activeOnly: boolean = false): Service[] {
    return activeOnly ? this.services.filter(s => s.is_active) : [...this.services];
  }

  getServiceBySlug(slug: string): Service | undefined {
    return this.services.find(s => s.slug === slug);
  }

  createService(data: Omit<Service, 'id'>): Service {
    const newService: Service = { ...data, id: `srv-${Date.now()}` };
    this.services.unshift(newService);
    saveState('services', this.services);
    return newService;
  }

  updateService(id: string, updates: Partial<Service>): Service {
    this.services = this.services.map(s => s.id === id ? { ...s, ...updates } : s);
    saveState('services', this.services);
    const updated = this.services.find(s => s.id === id);
    if (!updated) throw new Error(`Service ${id} not found`);
    return updated;
  }

  deleteService(id: string): void {
    this.services = this.services.filter(s => s.id !== id);
    saveState('services', this.services);
  }

  // Locations & Staff
  getLocations(): Location[] {
    return [...this.locations];
  }

  getStaff(): StaffMember[] {
    return [...this.staff];
  }

  // Pets
  getPets(ownerId?: string): Pet[] {
    return ownerId ? this.pets.filter(p => p.owner_id === ownerId) : [...this.pets];
  }

  getPetById(id: string): Pet | undefined {
    return this.pets.find(p => p.id === id);
  }

  createPet(data: Omit<Pet, 'id' | 'created_at'>): Pet {
    const newPet: Pet = {
      ...data,
      id: `pet-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.pets.push(newPet);
    saveState('pets', this.pets);
    return newPet;
  }

  updatePet(id: string, updates: Partial<Pet>): Pet {
    this.pets = this.pets.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p);
    saveState('pets', this.pets);
    const updated = this.pets.find(p => p.id === id);
    if (!updated) throw new Error(`Pet ${id} not found`);
    return updated;
  }

  deletePet(id: string): void {
    this.pets = this.pets.filter(p => p.id !== id);
    saveState('pets', this.pets);
  }

  // Availability & Appointment Logic
  getAppointments(filter?: { customerId?: string; staffId?: string; status?: string }): Appointment[] {
    let result = [...this.appointments];
    if (filter?.customerId) {
      result = result.filter(a => a.customer_id === filter.customerId);
    }
    if (filter?.staffId) {
      result = result.filter(a => a.staff_id === filter.staffId);
    }
    if (filter?.status) {
      result = result.filter(a => a.status === filter.status);
    }
    return result.sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime());
  }

  getAppointmentById(id: string): Appointment | undefined {
    return this.appointments.find(a => a.id === id);
  }

  /**
   * Check if a specific time slot at a location has any booking collision.
   * Conforms to Section 5: "Prevent overlapping bookings / Prevent double booking"
   */
  checkSlotAvailable(locationId: string, startsAtISO: string, endsAtISO: string, excludeId?: string): boolean {
    const targetStart = new Date(startsAtISO).getTime();
    const targetEnd = new Date(endsAtISO).getTime();

    // Check active appointments at this location
    const conflicts = this.appointments.filter(a => {
      if (a.id === excludeId) return false;
      if (a.location_id !== locationId) return false;
      if (a.status === 'cancelled' || a.status === 'no_show') return false;

      const apptStart = new Date(a.starts_at).getTime();
      const apptEnd = new Date(a.ends_at).getTime();

      // Overlap condition: start < apptEnd && end > apptStart
      return targetStart < apptEnd && targetEnd > apptStart;
    });

    return conflicts.length === 0;
  }

  createAppointment(data: Omit<Appointment, 'id' | 'created_at'>): Appointment {
    // Validate availability
    const isFree = this.checkSlotAvailable(data.location_id, data.starts_at, data.ends_at);
    if (!isFree) {
      throw new Error('This time slot is no longer available. Please select another slot.');
    }

    const newAppt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.appointments.unshift(newAppt);
    saveState('appointments', this.appointments);
    return newAppt;
  }

  updateAppointmentStatus(id: string, status: AppointmentStatus, internalNotes?: string): Appointment {
    this.appointments = this.appointments.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status,
          ...(internalNotes !== undefined ? { internal_notes: internalNotes } : {}),
          updated_at: new Date().toISOString()
        };
      }
      return a;
    });
    saveState('appointments', this.appointments);
    const updated = this.appointments.find(a => a.id === id);
    if (!updated) throw new Error(`Appointment ${id} not found`);
    return updated;
  }

  rescheduleAppointment(id: string, newStartsAt: string, newEndsAt: string): Appointment {
    const appt = this.appointments.find(a => a.id === id);
    if (!appt) throw new Error(`Appointment ${id} not found`);

    const isFree = this.checkSlotAvailable(appt.location_id, newStartsAt, newEndsAt, id);
    if (!isFree) {
      throw new Error('The selected rescheduling time slot is already booked.');
    }

    appt.starts_at = newStartsAt;
    appt.ends_at = newEndsAt;
    appt.updated_at = new Date().toISOString();
    saveState('appointments', this.appointments);
    return { ...appt };
  }

  // Grooming Records
  getGroomingRecords(petId?: string): GroomingRecord[] {
    return petId ? this.groomingRecords.filter(r => r.pet_id === petId) : [...this.groomingRecords];
  }

  createGroomingRecord(data: Omit<GroomingRecord, 'id' | 'created_at'>): GroomingRecord {
    const record: GroomingRecord = {
      ...data,
      id: `gr-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.groomingRecords.unshift(record);
    saveState('grooming_records', this.groomingRecords);
    return record;
  }

  // Products & Ecommerce
  getProducts(categorySlug?: string, search?: string): Product[] {
    let result = [...this.products];
    if (categorySlug) {
      const cat = this.productCategories.find(c => c.slug === categorySlug);
      if (cat) result = result.filter(p => p.category_id === cat.id);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return result;
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.products.find(p => p.slug === slug);
  }

  createProduct(data: Omit<Product, 'id'>): Product {
    const newProduct: Product = { ...data, id: `prd-${Date.now()}` };
    this.products.unshift(newProduct);
    saveState('products', this.products);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product {
    this.products = this.products.map(p => p.id === id ? { ...p, ...updates } : p);
    saveState('products', this.products);
    const updated = this.products.find(p => p.id === id);
    if (!updated) throw new Error(`Product ${id} not found`);
    return updated;
  }

  deleteProduct(id: string): void {
    this.products = this.products.filter(p => p.id !== id);
    saveState('products', this.products);
  }

  // Orders
  getOrders(customerId?: string): Order[] {
    return customerId ? this.orders.filter(o => o.customer_id === customerId) : [...this.orders];
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  createOrder(data: Omit<Order, 'id' | 'created_at' | 'order_number'>): Order {
    // Inventory check & deduction
    for (const item of data.items) {
      const product = this.products.find(p => p.id === item.product_id);
      if (!product) throw new Error(`Product not found: ${item.product_name_snapshot}`);
      if (product.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock_quantity}`);
      }
    }

    // Deduct stock safely
    for (const item of data.items) {
      const product = this.products.find(p => p.id === item.product_id);
      if (product) {
        this.updateProduct(item.product_id, {
          stock_quantity: Math.max(0, product.stock_quantity - item.quantity)
        });
      }
    }

    const orderNumber = `PWL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...data,
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      created_at: new Date().toISOString()
    };
    this.orders.unshift(newOrder);
    saveState('orders', this.orders);
    return newOrder;
  }

  updateOrderStatus(id: string, order_status: Order['order_status'], payment_status?: Order['payment_status']): Order {
    this.orders = this.orders.map(o => {
      if (o.id === id) {
        return {
          ...o,
          order_status,
          ...(payment_status ? { payment_status } : {}),
          updated_at: new Date().toISOString()
        };
      }
      return o;
    });
    saveState('orders', this.orders);
    const updated = this.orders.find(o => o.id === id);
    if (!updated) throw new Error(`Order ${id} not found`);
    return updated;
  }

  // Reviews
  getReviews(approvedOnly: boolean = true): Review[] {
    return approvedOnly ? this.reviews.filter(r => r.is_approved) : [...this.reviews];
  }

  createReview(data: Omit<Review, 'id' | 'created_at' | 'is_approved'>): Review {
    const review: Review = {
      ...data,
      id: `rev-${Date.now()}`,
      is_approved: false, // requires admin approval per specs
      created_at: new Date().toISOString()
    };
    this.reviews.unshift(review);
    saveState('reviews', this.reviews);
    return review;
  }

  setReviewApproved(id: string, is_approved: boolean): void {
    this.reviews = this.reviews.map(r => r.id === id ? { ...r, is_approved } : r);
    saveState('reviews', this.reviews);
  }

  deleteReview(id: string): void {
    this.reviews = this.reviews.filter(r => r.id !== id);
    saveState('reviews', this.reviews);
  }

  // Contact Messages
  getContactMessages(): ContactMessage[] {
    return [...this.contactMessages];
  }

  createContactMessage(data: Omit<ContactMessage, 'id' | 'created_at' | 'status'>): ContactMessage {
    const message: ContactMessage = {
      ...data,
      id: `msg-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString()
    };
    this.contactMessages.unshift(message);
    saveState('contact_messages', this.contactMessages);
    return message;
  }

  updateContactMessageStatus(id: string, status: ContactMessage['status']): void {
    this.contactMessages = this.contactMessages.map(m => m.id === id ? { ...m, status } : m);
    saveState('contact_messages', this.contactMessages);
  }

  // Blog
  getBlogPosts(publishedOnly: boolean = true): BlogPost[] {
    return publishedOnly ? this.blogPosts.filter(b => b.status === 'published') : [...this.blogPosts];
  }

  getBlogPostBySlug(slug: string): BlogPost | undefined {
    return this.blogPosts.find(b => b.slug === slug);
  }

  createBlogPost(data: Omit<BlogPost, 'id' | 'created_at'>): BlogPost {
    const post: BlogPost = {
      ...data,
      id: `post-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.blogPosts.unshift(post);
    saveState('blog_posts', this.blogPosts);
    return post;
  }

  updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost {
    this.blogPosts = this.blogPosts.map(b => b.id === id ? { ...b, ...updates } : b);
    saveState('blog_posts', this.blogPosts);
    const updated = this.blogPosts.find(b => b.id === id);
    if (!updated) throw new Error(`Blog post ${id} not found`);
    return updated;
  }

  deleteBlogPost(id: string): void {
    this.blogPosts = this.blogPosts.filter(b => b.id !== id);
    saveState('blog_posts', this.blogPosts);
  }
}

export const dbStore = new PawelleStore();
