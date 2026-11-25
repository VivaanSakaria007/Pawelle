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

const INITIAL_CUSTOMERS: UserProfile[] = [
  {
    id: 'usr-demo-customer',
    email: 'jessica.vance@example.com',
    full_name: 'Jessica Vance',
    phone: '+44 7946 0991',
    role: 'customer',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    created_at: '2026-09-01T10:00:00Z'
  },
  {
    id: 'usr-customer-2',
    email: 'harrison.b@example.com',
    full_name: 'Harrison Blake',
    phone: '+44 7820 119933',
    role: 'customer',
    created_at: '2026-09-10T10:00:00Z'
  }
];

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'stf-1',
    profile_id: 'usr-staff-1',
    name: 'Clara Vance',
    role_title: 'Master Canine Stylist & Head of Salon',
    bio: 'Over 12 years of precision scissor styling experience with breed-show certifications and fear-free grooming honors.',
    avatar_url: 'https://plus.unsplash.com/premium_photo-1688572454849-4348982edf7d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
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
    avatar_url: 'https://plus.unsplash.com/premium_photo-1689551671541-31a345ce6ae0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
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
    image_url: 'https://plus.unsplash.com/premium_photo-1661597156656-75ba116e9e1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
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
    image_url: 'https://plus.unsplash.com/premium_photo-1675431443027-ad1f46c93c8d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
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
    image_url: 'https://plus.unsplash.com/premium_photo-1661597156656-75ba116e9e1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
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
    cover_image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80',
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
    cover_image_url: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Julian Thorne',
    author_role: 'Director of Holistic Wellness',
    category_id: 'bcat-2',
    category_name: 'Seasonal Care',
    read_time_minutes: 4,
    status: 'published',
    published_at: '2026-11-10T14:30:00Z',
    created_at: '2026-11-10T14:30:00Z'
  },
  {
    id: 'post-3',
    title: 'Botanical Hydrosols & Organic Aromatics: The Mayfair Scent Philosophy',
    slug: 'botanical-hydrosols-mayfair-scent-philosophy',
    excerpt: 'How natural plant terpenes, cold-pressed Roman chamomile, and wild lavender soothe nervous canine and feline respiratory systems.',
    body: `The olfactory sensitivity of companion animals is between 10,000 and 100,000 times that of humans. Conventional grooming formulations frequently rely on synthetic perfumes, benzyl alcohol, and artificial fixatives that trigger sensory distress, sneezing, and anxiety.

At our Mayfair atelier, our scent philosophy begins with what we deliberately omit. We strictly prohibit artificial fragrances, parabens, and aggressive sulfates. Instead, we formulate our hydro-baths with therapeutic plant hydrosols—the pure aromatic waters gently co-distilled alongside botanical essential oils.

Roman chamomile hydrosol provides gentle anti-inflammatory relief to compromised skin barriers, while wild organic lavender from Provence demonstrably calms autonomic stress in anxious companions. Applied at micro-dilutions through our low-pressure hydrotherapy system, botanical aromatics turn routine hygiene into an unhurried restorative retreat.`,
    cover_image_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Clara Vance',
    author_role: 'Master Canine Stylist',
    category_id: 'bcat-1',
    category_name: 'Coat Health',
    read_time_minutes: 6,
    status: 'published',
    published_at: '2026-11-04T09:15:00Z',
    created_at: '2026-11-04T09:15:00Z'
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

export function sanitizeProductImageUrl(url: string): string {
  const trimmed = (url || '').trim();
  if (trimmed.startsWith('./assets/')) return trimmed.slice(1);
  if (trimmed.startsWith('assets/')) return `/${trimmed}`;
  return trimmed;
}

// Sync code-level INITIAL_PRODUCTS image_url edits into cached localStorage products
export function syncInitialProductImages(products: Product[]): Product[] {
  const legacyAssetMap: Record<string, string> = {
    '/assets/products/botanical-shampoo.svg': '/assets/products/botanical-shampoo.jpg',
    '/assets/products/beechwood-brush.svg': '/assets/products/beechwood-brush.jpg'
  };
  const currentSeedImages: Record<string, string> = {};
  for (const seed of INITIAL_PRODUCTS) {
    currentSeedImages[seed.id] = sanitizeProductImageUrl(seed.image_url);
  }
  const prevSeedImages = loadState<Record<string, string> | null>('products_seed_images', null);

  let changed = false;
  const synced = products.map(p => {
    const normalizedUrl = legacyAssetMap[p.image_url] || sanitizeProductImageUrl(p.image_url);
    const seedUrl = currentSeedImages[p.id];
    const seedChangedInCode = seedUrl !== undefined && (!prevSeedImages || prevSeedImages[p.id] !== seedUrl);
    const nextUrl = seedChangedInCode ? seedUrl : normalizedUrl;
    if (nextUrl !== p.image_url) {
      changed = true;
    }
    return { ...p, image_url: nextUrl };
  });

  const snapshotChanged =
    !prevSeedImages ||
    Object.keys(currentSeedImages).some(id => prevSeedImages[id] !== currentSeedImages[id]);
  if (snapshotChanged) {
    saveState('products_seed_images', currentSeedImages);
  }
  if (changed) {
    saveState('products', synced);
  }
  return synced;
}

// Merge seeded clients, cached customers, and any sandbox registered customer accounts
function loadAndMergeCustomers(appointments: Appointment[]): UserProfile[] {
  const cached = loadState<UserProfile[]>('customers', []);
  const byId = new Map<string, UserProfile>();

  for (const seed of INITIAL_CUSTOMERS) {
    byId.set(seed.id, { ...seed });
  }
  for (const client of cached) {
    if (!client?.id || (client.role && client.role !== 'customer')) continue;
    byId.set(client.id, { ...byId.get(client.id), ...client, role: 'customer' });
  }

  try {
    if (typeof localStorage !== 'undefined') {
      const regRaw = localStorage.getItem('pawelle_sandbox_registered_users');
      if (regRaw) {
        const regMap = JSON.parse(regRaw) as Record<string, { profile?: UserProfile }>;
        for (const entry of Object.values(regMap)) {
          const prof = entry?.profile;
          if (prof && prof.id && prof.email && (!prof.role || prof.role === 'customer')) {
            byId.set(prof.id, { ...byId.get(prof.id), ...prof, role: 'customer' });
          }
        }
      }
    }
  } catch {
    // ignore storage errors
  }

  for (const appt of appointments) {
    if (appt.customer_id && !byId.has(appt.customer_id)) {
      byId.set(appt.customer_id, {
        id: appt.customer_id,
        email: `${appt.customer_id}@client.pawelle`,
        full_name: appt.customer_name || 'Valued Client',
        phone: appt.customer_phone,
        role: 'customer',
        created_at: appt.created_at || new Date().toISOString()
      });
    }
  }

  return Array.from(byId.values());
}

// Memory / LocalStorage Persistent Store Engine
class PawelleStore {
  private listeners: Set<() => void> = new Set();
  private settings: SiteSettings = loadState('settings', INITIAL_SETTINGS);
  private services: Service[] = loadState('services', INITIAL_SERVICES);
  private serviceCategories: ServiceCategory[] = loadState('service_categories', INITIAL_SERVICE_CATEGORIES);
  private locations: Location[] = loadState('locations', INITIAL_LOCATIONS);
  private staff: StaffMember[] = loadState('staff', INITIAL_STAFF);
  private products: Product[] = syncInitialProductImages(loadState('products', INITIAL_PRODUCTS));
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
      photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
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
  private customers: UserProfile[] = loadAndMergeCustomers(this.appointments);
  private syncRevision: number = 0;
  private broadcastChannel: BroadcastChannel | null = null;
  private eventSource: EventSource | null = null;
  private pullInFlight: Promise<void> | null = null;

  constructor() {
    this.initializeRealtimeSync();
  }

  getInitialCustomers(): UserProfile[] {
    return INITIAL_CUSTOMERS.map(c => ({ ...c }));
  }

  private canUseBrowserSync(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof fetch === 'function' &&
      /^https?:/.test(window.location?.origin || '')
    );
  }

  private initializeRealtimeSync(): void {
    if (!this.canUseBrowserSync()) return;

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel('pawelle_sync_channel');
        this.broadcastChannel.onmessage = () => {
          this.refreshCustomersFromStorage();
        };
      } catch {
        this.broadcastChannel = null;
      }
    }

    window.addEventListener('storage', (e: StorageEvent) => {
      if (!e.key || e.key.startsWith('pawelle_')) {
        this.refreshCustomersFromStorage();
      }
    });

    if (typeof EventSource !== 'undefined') {
      try {
        this.eventSource = new EventSource('/api/pawelle-sync/stream');
        this.eventSource.addEventListener('connected', (ev: MessageEvent) => {
          try {
            const data = JSON.parse(ev.data);
            if (typeof data?.revision === 'number' && data.revision > this.syncRevision) {
              void this.pullFromSyncServer();
            }
          } catch {
            // ignore
          }
        });
        this.eventSource.addEventListener('state-update', (ev: MessageEvent) => {
          try {
            const data = JSON.parse(ev.data);
            if (typeof data?.revision !== 'number' || data.revision > this.syncRevision) {
              void this.pullFromSyncServer();
            }
          } catch {
            void this.pullFromSyncServer();
          }
        });
      } catch {
        this.eventSource = null;
      }
    }

    // Pull initial authoritative server state across Chrome profiles / phones
    void this.pullFromSyncServer();
  }

  async pullFromSyncServer(): Promise<void> {
    if (!this.canUseBrowserSync()) return;
    if (this.pullInFlight) return this.pullInFlight;

    this.pullInFlight = (async () => {
      try {
        const res = await fetch('/api/pawelle-sync/state', { cache: 'no-store' });
        if (!res.ok) return;
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) return;
        const payload = await res.json();
        if (!payload || typeof payload !== 'object') return;

        if (typeof payload.revision === 'number') {
          this.syncRevision = Math.max(this.syncRevision, payload.revision);
        }

        const collections = (payload.collections || {}) as Record<string, unknown>;
        if (collections.settings && typeof collections.settings === 'object') {
          this.settings = collections.settings as SiteSettings;
          saveState('settings', this.settings);
        }
        if (Array.isArray(collections.services)) {
          this.services = collections.services as Service[];
          saveState('services', this.services);
        }
        if (Array.isArray(collections.staff)) {
          this.staff = collections.staff as StaffMember[];
          saveState('staff', this.staff);
        }
        if (Array.isArray(collections.products)) {
          this.products = syncInitialProductImages(collections.products as Product[]);
          saveState('products', this.products);
        }
        if (Array.isArray(collections.pets)) {
          this.pets = collections.pets as Pet[];
          saveState('pets', this.pets);
        }
        if (Array.isArray(collections.appointments)) {
          this.appointments = collections.appointments as Appointment[];
          saveState('appointments', this.appointments);
        }
        if (Array.isArray(collections.grooming_records)) {
          this.groomingRecords = collections.grooming_records as GroomingRecord[];
          saveState('grooming_records', this.groomingRecords);
        }
        if (Array.isArray(collections.orders)) {
          this.orders = collections.orders as Order[];
          saveState('orders', this.orders);
        }
        if (Array.isArray(collections.reviews)) {
          this.reviews = collections.reviews as Review[];
          saveState('reviews', this.reviews);
        }
        if (Array.isArray(collections.contact_messages)) {
          this.contactMessages = collections.contact_messages as ContactMessage[];
          saveState('contact_messages', this.contactMessages);
        }
        if (Array.isArray(collections.blog_posts)) {
          this.blogPosts = collections.blog_posts as BlogPost[];
          saveState('blog_posts', this.blogPosts);
        }
        if (Array.isArray(collections.customers)) {
          this.customers = loadAndMergeCustomers(this.appointments);
          const mergedById = new Map<string, UserProfile>();
          for (const c of collections.customers as UserProfile[]) {
            if (c?.id && (!c.role || c.role === 'customer')) mergedById.set(c.id, { ...c, role: 'customer' });
          }
          for (const seed of INITIAL_CUSTOMERS) {
            if (!mergedById.has(seed.id)) mergedById.set(seed.id, { ...seed });
          }
          this.customers = Array.from(mergedById.values());
          saveState('customers', this.customers);
        }

        if (Array.isArray(payload.registeredCustomerProfiles)) {
          for (const regCustomer of payload.registeredCustomerProfiles as UserProfile[]) {
            if (regCustomer?.id && regCustomer.email) {
              this.upsertCustomerProfile(regCustomer, false);
            }
          }
        }

        this.notifyChange();
      } catch {
        // Offline or static preview without sync server: stay on local cache
      } finally {
        this.pullInFlight = null;
      }
    })();

    return this.pullInFlight;
  }

  private pushSyncAction(
    op: 'upsert' | 'delete' | 'replace',
    key: string,
    options: { item?: unknown; id?: string; data?: unknown; initialItems?: unknown[]; prepend?: boolean }
  ): void {
    try {
      this.broadcastChannel?.postMessage({ key, op, at: Date.now() });
    } catch {
      // ignore broadcast channel errors
    }

    if (!this.canUseBrowserSync()) return;

    void fetch('/api/pawelle-sync/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ op, key, ...options })
    })
      .then(async res => {
        if (!res.ok) return;
        const body = await res.json().catch(() => null);
        if (body && typeof body.revision === 'number') {
          this.syncRevision = Math.max(this.syncRevision, body.revision);
        }
      })
      .catch(() => {
        // Offline/static fallback
      });
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyChange(): void {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch {
        // ignore listener failure
      }
    });
  }

  // Reload live collections when another tab updates localStorage
  refreshCustomersFromStorage(): void {
    this.settings = loadState('settings', this.settings);
    this.services = loadState('services', this.services);
    this.staff = loadState('staff', this.staff);
    this.products = syncInitialProductImages(loadState('products', this.products));
    this.pets = loadState('pets', this.pets);
    this.appointments = loadState('appointments', this.appointments);
    this.groomingRecords = loadState('grooming_records', this.groomingRecords);
    this.orders = loadState('orders', this.orders);
    this.reviews = loadState('reviews', this.reviews);
    this.contactMessages = loadState('contact_messages', this.contactMessages);
    this.blogPosts = loadState('blog_posts', this.blogPosts);
    this.customers = loadAndMergeCustomers(this.appointments);
    this.notifyChange();
  }

  // Customers Directory
  getCustomers(search?: string): UserProfile[] {
    const merged = loadAndMergeCustomers(this.appointments);
    for (const current of this.customers) {
      if (!merged.some(c => c.id === current.id)) {
        merged.push(current);
      }
    }
    this.customers = merged;

    const q = search?.trim().toLowerCase();
    const filtered = q
      ? this.customers.filter(c =>
          c.full_name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          Boolean(c.phone?.toLowerCase().includes(q))
        )
      : [...this.customers];

    return filtered;
  }

  getCustomerById(id: string): UserProfile | undefined {
    return this.customers.find(c => c.id === id);
  }

  upsertCustomerProfile(
    profile: Pick<UserProfile, 'id' | 'email' | 'full_name'> &
      Partial<Pick<UserProfile, 'phone' | 'avatar_url' | 'role' | 'created_at'>>,
    syncToServer: boolean = true
  ): UserProfile | null {
    const targetRole = profile.role || 'customer';
    if (targetRole !== 'customer') return null;

    const normalizedEmail = profile.email.trim().toLowerCase();
    const existing = this.customers.find(
      c => c.id === profile.id || c.email.trim().toLowerCase() === normalizedEmail
    );

    const trimmedName = profile.full_name.trim() || existing?.full_name || 'Valued Client';
    const trimmedPhone = profile.phone?.trim();

    const updatedRecord: UserProfile = {
      id: profile.id,
      email: normalizedEmail || existing?.email || '',
      full_name: trimmedName,
      phone: trimmedPhone !== undefined && trimmedPhone !== '' ? trimmedPhone : existing?.phone,
      avatar_url: profile.avatar_url || existing?.avatar_url,
      role: 'customer',
      created_at: existing?.created_at || profile.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const previousCustomers = [...this.customers];
    if (existing) {
      this.customers = this.customers.map(c =>
        c.id === existing.id || c.email.trim().toLowerCase() === normalizedEmail ? updatedRecord : c
      );
    } else {
      // Surface newly registered/signed-in clients directly in Customer Directory
      this.customers = [updatedRecord, ...this.customers];
    }

    saveState('customers', this.customers);
    if (syncToServer) {
      this.pushSyncAction('upsert', 'customers', {
        item: updatedRecord,
        initialItems: previousCustomers,
        prepend: true
      });
    }
    this.notifyChange();
    return { ...updatedRecord };
  }

  // Site Settings
  getSettings(): SiteSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<SiteSettings>): SiteSettings {
    this.settings = { ...this.settings, ...newSettings };
    saveState('settings', this.settings);
    this.pushSyncAction('replace', 'settings', { data: this.settings });
    this.notifyChange();
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
    const prev = [...this.services];
    const newService: Service = { ...data, id: `srv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
    this.services.unshift(newService);
    saveState('services', this.services);
    this.pushSyncAction('upsert', 'services', { item: newService, initialItems: prev, prepend: true });
    this.notifyChange();
    return newService;
  }

  updateService(id: string, updates: Partial<Service>): Service {
    const prev = [...this.services];
    this.services = this.services.map(s => s.id === id ? { ...s, ...updates } : s);
    saveState('services', this.services);
    const updated = this.services.find(s => s.id === id);
    if (!updated) throw new Error(`Service ${id} not found`);
    this.pushSyncAction('upsert', 'services', { item: updated, initialItems: prev });
    this.notifyChange();
    return updated;
  }

  deleteService(id: string): void {
    const prev = [...this.services];
    this.services = this.services.filter(s => s.id !== id);
    saveState('services', this.services);
    this.pushSyncAction('delete', 'services', { id, initialItems: prev });
    this.notifyChange();
  }

  // Locations & Staff
  getLocations(): Location[] {
    return [...this.locations];
  }

  getStaff(): StaffMember[] {
    return [...this.staff];
  }

  createStaff(data: Omit<StaffMember, 'id' | 'profile_id'> & { profile_id?: string }): StaffMember {
    const prev = [...this.staff];
    const id = `stf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const member: StaffMember = {
      ...data,
      id,
      profile_id: data.profile_id || `usr-${id}`
    };
    this.staff.push(member);
    saveState('staff', this.staff);
    this.pushSyncAction('upsert', 'staff', { item: member, initialItems: prev, prepend: false });
    this.notifyChange();
    return member;
  }

  updateStaff(id: string, updates: Partial<StaffMember>): StaffMember {
    const prev = [...this.staff];
    this.staff = this.staff.map(s => (s.id === id ? { ...s, ...updates } : s));
    saveState('staff', this.staff);
    const updated = this.staff.find(s => s.id === id);
    if (!updated) throw new Error(`Staff member ${id} not found`);
    this.pushSyncAction('upsert', 'staff', { item: updated, initialItems: prev });
    this.notifyChange();
    return updated;
  }

  deleteStaff(id: string): void {
    const prev = [...this.staff];
    this.staff = this.staff.filter(s => s.id !== id);
    saveState('staff', this.staff);
    this.pushSyncAction('delete', 'staff', { id, initialItems: prev });
    this.notifyChange();
  }

  // Pets
  getPets(ownerId?: string): Pet[] {
    return ownerId ? this.pets.filter(p => p.owner_id === ownerId) : [...this.pets];
  }

  getPetById(id: string): Pet | undefined {
    return this.pets.find(p => p.id === id);
  }

  createPet(data: Omit<Pet, 'id' | 'created_at'>): Pet {
    const prev = [...this.pets];
    const newPet: Pet = {
      ...data,
      id: `pet-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      created_at: new Date().toISOString()
    };
    this.pets.push(newPet);
    saveState('pets', this.pets);
    this.pushSyncAction('upsert', 'pets', { item: newPet, initialItems: prev, prepend: false });
    this.notifyChange();
    return newPet;
  }

  updatePet(id: string, updates: Partial<Pet>): Pet {
    const prev = [...this.pets];
    this.pets = this.pets.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p);
    saveState('pets', this.pets);
    const updated = this.pets.find(p => p.id === id);
    if (!updated) throw new Error(`Pet ${id} not found`);
    this.pushSyncAction('upsert', 'pets', { item: updated, initialItems: prev });
    this.notifyChange();
    return updated;
  }

  deletePet(id: string): void {
    const prev = [...this.pets];
    this.pets = this.pets.filter(p => p.id !== id);
    saveState('pets', this.pets);
    this.pushSyncAction('delete', 'pets', { id, initialItems: prev });
    this.notifyChange();
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

    const prev = [...this.appointments];
    const newAppt: Appointment = {
      ...data,
      id: `apt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      created_at: new Date().toISOString()
    };
    this.appointments.unshift(newAppt);
    saveState('appointments', this.appointments);
    this.pushSyncAction('upsert', 'appointments', { item: newAppt, initialItems: prev, prepend: true });
    if (data.customer_id && !this.getCustomerById(data.customer_id)) {
      this.upsertCustomerProfile({
        id: data.customer_id,
        email: `${data.customer_id}@client.pawelle`,
        full_name: data.customer_name || 'Valued Client',
        phone: data.customer_phone,
        role: 'customer'
      });
    } else {
      this.notifyChange();
    }
    return newAppt;
  }

  updateAppointmentStatus(id: string, status: AppointmentStatus, internalNotes?: string): Appointment {
    const prev = [...this.appointments];
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
    this.pushSyncAction('upsert', 'appointments', { item: updated, initialItems: prev });
    this.notifyChange();
    return updated;
  }

  rescheduleAppointment(id: string, newStartsAt: string, newEndsAt: string): Appointment {
    const prev = [...this.appointments];
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
    this.pushSyncAction('upsert', 'appointments', { item: { ...appt }, initialItems: prev });
    this.notifyChange();
    return { ...appt };
  }

  // Grooming Records
  getGroomingRecords(petId?: string): GroomingRecord[] {
    return petId ? this.groomingRecords.filter(r => r.pet_id === petId) : [...this.groomingRecords];
  }

  createGroomingRecord(data: Omit<GroomingRecord, 'id' | 'created_at'>): GroomingRecord {
    const prev = [...this.groomingRecords];
    const record: GroomingRecord = {
      ...data,
      id: `gr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      created_at: new Date().toISOString()
    };
    this.groomingRecords.unshift(record);
    saveState('grooming_records', this.groomingRecords);
    this.pushSyncAction('upsert', 'grooming_records', { item: record, initialItems: prev, prepend: true });
    this.notifyChange();
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

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  createProduct(data: Omit<Product, 'id'>): Product {
    const prev = [...this.products];
    const newProduct: Product = {
      ...data,
      image_url: sanitizeProductImageUrl(data.image_url),
      id: `prd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    };
    this.products.unshift(newProduct);
    saveState('products', this.products);
    this.pushSyncAction('upsert', 'products', { item: newProduct, initialItems: prev, prepend: true });
    this.notifyChange();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product {
    const prev = [...this.products];
    const sanitizedUpdates: Partial<Product> =
      updates.image_url !== undefined
        ? { ...updates, image_url: sanitizeProductImageUrl(updates.image_url) }
        : updates;
    this.products = this.products.map(p => p.id === id ? { ...p, ...sanitizedUpdates } : p);
    saveState('products', this.products);
    const updated = this.products.find(p => p.id === id);
    if (!updated) throw new Error(`Product ${id} not found`);
    this.pushSyncAction('upsert', 'products', { item: updated, initialItems: prev });
    this.notifyChange();
    return updated;
  }

  deleteProduct(id: string): void {
    const prev = [...this.products];
    this.products = this.products.filter(p => p.id !== id);
    saveState('products', this.products);
    this.pushSyncAction('delete', 'products', { id, initialItems: prev });
    this.notifyChange();
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

    const prev = [...this.orders];
    const orderNumber = `PWL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...data,
      id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      order_number: orderNumber,
      created_at: new Date().toISOString()
    };
    this.orders.unshift(newOrder);
    saveState('orders', this.orders);
    this.pushSyncAction('upsert', 'orders', { item: newOrder, initialItems: prev, prepend: true });
    this.notifyChange();
    return newOrder;
  }

  updateOrderStatus(id: string, order_status: Order['order_status'], payment_status?: Order['payment_status']): Order {
    const prev = [...this.orders];
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
    this.pushSyncAction('upsert', 'orders', { item: updated, initialItems: prev });
    this.notifyChange();
    return updated;
  }

  // Reviews
  getReviews(approvedOnly: boolean = true): Review[] {
    return approvedOnly ? this.reviews.filter(r => r.is_approved) : [...this.reviews];
  }

  createReview(data: Omit<Review, 'id' | 'created_at' | 'is_approved'>): Review {
    const prev = [...this.reviews];
    const review: Review = {
      ...data,
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      is_approved: false, // requires admin approval per specs
      created_at: new Date().toISOString()
    };
    this.reviews.unshift(review);
    saveState('reviews', this.reviews);
    this.pushSyncAction('upsert', 'reviews', { item: review, initialItems: prev, prepend: true });
    this.notifyChange();
    return review;
  }

  setReviewApproved(id: string, is_approved: boolean): void {
    const prev = [...this.reviews];
    this.reviews = this.reviews.map(r => r.id === id ? { ...r, is_approved } : r);
    saveState('reviews', this.reviews);
    const updated = this.reviews.find(r => r.id === id);
    if (updated) {
      this.pushSyncAction('upsert', 'reviews', { item: updated, initialItems: prev });
    }
    this.notifyChange();
  }

  deleteReview(id: string): void {
    const prev = [...this.reviews];
    this.reviews = this.reviews.filter(r => r.id !== id);
    saveState('reviews', this.reviews);
    this.pushSyncAction('delete', 'reviews', { id, initialItems: prev });
    this.notifyChange();
  }

  // Contact Messages
  getContactMessages(): ContactMessage[] {
    return [...this.contactMessages];
  }

  createContactMessage(data: Omit<ContactMessage, 'id' | 'created_at' | 'status'>): ContactMessage {
    const prev = [...this.contactMessages];
    const message: ContactMessage = {
      ...data,
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: 'new',
      created_at: new Date().toISOString()
    };
    this.contactMessages.unshift(message);
    saveState('contact_messages', this.contactMessages);
    this.pushSyncAction('upsert', 'contact_messages', { item: message, initialItems: prev, prepend: true });
    this.notifyChange();
    return message;
  }

  updateContactMessageStatus(id: string, status: ContactMessage['status']): void {
    const prev = [...this.contactMessages];
    this.contactMessages = this.contactMessages.map(m => m.id === id ? { ...m, status } : m);
    saveState('contact_messages', this.contactMessages);
    const updated = this.contactMessages.find(m => m.id === id);
    if (updated) {
      this.pushSyncAction('upsert', 'contact_messages', { item: updated, initialItems: prev });
    }
    this.notifyChange();
  }

  replyToContactMessage(id: string, replyText: string, repliedBy: string = 'PAWELLE Concierge'): ContactMessage {
    const prev = [...this.contactMessages];
    const cleanReply = replyText.trim();
    if (!cleanReply) throw new Error('Reply message cannot be empty.');
    const repliedAt = new Date().toISOString();
    this.contactMessages = this.contactMessages.map(m =>
      m.id === id
        ? { ...m, status: 'replied', reply_text: cleanReply, replied_at: repliedAt, replied_by: repliedBy }
        : m
    );
    saveState('contact_messages', this.contactMessages);
    const updated = this.contactMessages.find(m => m.id === id);
    if (!updated) throw new Error(`Inquiry ${id} not found`);
    this.pushSyncAction('upsert', 'contact_messages', { item: updated, initialItems: prev });
    this.notifyChange();
    return { ...updated };
  }

  // Blog
  getBlogPosts(publishedOnly: boolean = true): BlogPost[] {
    return publishedOnly ? this.blogPosts.filter(b => b.status === 'published') : [...this.blogPosts];
  }

  getBlogPostBySlug(slug: string): BlogPost | undefined {
    return this.blogPosts.find(b => b.slug === slug);
  }

  createBlogPost(data: Omit<BlogPost, 'id' | 'created_at'>): BlogPost {
    const prev = [...this.blogPosts];
    const post: BlogPost = {
      ...data,
      id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      created_at: new Date().toISOString()
    };
    this.blogPosts.unshift(post);
    saveState('blog_posts', this.blogPosts);
    this.pushSyncAction('upsert', 'blog_posts', { item: post, initialItems: prev, prepend: true });
    this.notifyChange();
    return post;
  }

  updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost {
    const prev = [...this.blogPosts];
    this.blogPosts = this.blogPosts.map(b => b.id === id ? { ...b, ...updates } : b);
    saveState('blog_posts', this.blogPosts);
    const updated = this.blogPosts.find(b => b.id === id);
    if (!updated) throw new Error(`Blog post ${id} not found`);
    this.pushSyncAction('upsert', 'blog_posts', { item: updated, initialItems: prev });
    this.notifyChange();
    return updated;
  }

  deleteBlogPost(id: string): void {
    const prev = [...this.blogPosts];
    this.blogPosts = this.blogPosts.filter(b => b.id !== id);
    saveState('blog_posts', this.blogPosts);
    this.pushSyncAction('delete', 'blog_posts', { id, initialItems: prev });
    this.notifyChange();
  }
}

export const dbStore = new PawelleStore();
