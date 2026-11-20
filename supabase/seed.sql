-- PAWELLE Database Seed Script
-- Realistic boutique pet grooming & spa initial data

-- 1. Service Categories
INSERT INTO public.service_categories (id, name, slug, description) VALUES
('11111111-1111-1111-1111-111111111101', 'Signature Styling', 'signature-styling', 'Full precision scissor cuts, breed-standard shaping, and custom aesthetic transformations.'),
('11111111-1111-1111-1111-111111111102', 'Hydrotherapy & Spa Baths', 'spa-baths', 'Therapeutic herbal soaks, ozone hydro-massage, and restorative conditioning.'),
('11111111-1111-1111-1111-111111111103', 'Essential Wellness Care', 'essential-wellness', 'Crucial hygiene rituals: paw pad balms, gentle nail trims, and ear hygiene.'),
('11111111-1111-1111-1111-111111111104', 'Puppy & Senior Gentle Care', 'puppy-senior-care', 'Low-stress, gentle pacing tailored for youthful introduction or elderly joints.')
ON CONFLICT (id) DO NOTHING;

-- 2. Locations
INSERT INTO public.locations (id, name, address, city, phone, email, hours, timezone, is_active) VALUES
('22222222-2222-2222-2222-222222222201', 'PAWELLE Flagship Studio — Mayfair', '42 South Audley Street, Mayfair', 'London', '+44 20 7946 0812', 'mayfair@pawelle.com', 'Mon–Sat: 08:30 – 18:30, Sun: 10:00 – 16:00', 'Europe/London', true),
('22222222-2222-2222-2222-222222222202', 'PAWELLE Chelsea Garden Retreat', '18 King''s Road, Chelsea', 'London', '+44 20 7946 0884', 'chelsea@pawelle.com', 'Tue–Sun: 09:00 – 18:00, Mon: Closed', 'Europe/London', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Services
INSERT INTO public.services (id, name, slug, category_id, description, short_description, duration_minutes, base_price, eligible_pet_types, image_url, inclusions, exclusions, is_active, featured) VALUES
('33333333-3333-3333-3333-333333333301', 'The Royal Botanical Bath & Blow-dry', 'royal-botanical-bath', '11111111-1111-1111-1111-111111111102', 'An opulent deep cleansing soak infused with wild chamomile and colloidal oatmeal. Includes warm ozone hydro-rinse, hand fluff dry, and dead-hair deshedding.', 'Hydrotherapy bath with organic calming botanicals and hand blow-dry.', 60, 85.00, '{"dog","cat"}', 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=1200&q=80', '{"Organic chamomile bath","Warm fluff blow-dry","Full brush out","Ear cleansing","Paw pad moisture treatment"}', '{"Full scissor haircut"}', true, true),
('33333333-3333-3333-3333-333333333302', 'Artisanal Scissor Haircut & Full Styling', 'artisanal-scissor-styling', '11111111-1111-1111-1111-111111111101', 'Bespoke hand-scissor silhouette sculpturing by our Master Stylists. Tailored to pet breed standards, body ergonomics, and pet-parent stylistic preferences.', 'Precision handcrafted scissor sculpting and complete styling.', 90, 130.00, '{"dog"}', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80', '{"Custom scissor cut","Sanitary trim","Face & ear styling","Paw pad round trim","Full botanical bath & blow-dry"}', '{"Matted coat de-felting over 30 mins"}', true, true),
('33333333-3333-3333-3333-333333333303', 'Feline Serenity Spa Ritual', 'feline-serenity-spa', '11111111-1111-1111-1111-111111111102', 'Exclusively quiet, cat-certified sanctuary room. Includes gentle dry foam or warm hydro-cleanse, thorough comb-out, sanitary trim, and organic ear hygiene.', 'Calm, dog-free sanctuary treatment crafted specially for cats.', 60, 115.00, '{"cat"}', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80', '{"Isolated tranquil room","Cat-safe cleansing lather","De-shedding comb-out","Gentle claw trim","Facial wipe & ear care"}', '{"Sedation"}', true, true),
('33333333-3333-3333-3333-333333333304', 'Puppy First Confidence Journey', 'puppy-first-confidence', '11111111-1111-1111-1111-111111111104', 'Designed for puppies under 6 months. Gentle vibration desensitisation, warm gentle water introduction, scissor sound play, and plenty of positive affection.', 'Positive sensory introduction to grooming tools for puppies.', 45, 60.00, '{"dog"}', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80', '{"Slow sound conditioning","Micro-bath & gentle towel dry","Paw massage & nail file","Gentle eye trim","Playtime & treats"}', '{"Full adult haircut"}', true, false),
('33333333-3333-3333-3333-333333333305', 'Nail Spa & Botanical Paw Therapy', 'nail-spa-paw-therapy', '11111111-1111-1111-1111-111111111103', 'Precision claw clipping and electric filing to velvety smoothness, followed by warm shea butter & calendula paw pad balm application.', 'Smooth claw filing and deep herbal balm treatment for paw pads.', 30, 40.00, '{"dog","cat"}', 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80', '{"Precision clip & smooth electric file","Paw fur trim","Calendula & shea butter massage","Nail polish upon request"}', '{}', true, false),
('33333333-3333-3333-3333-333333333306', 'Dead-Sea Mineral Mud Detox Treatment', 'dead-sea-mud-detox', '11111111-1111-1111-1111-111111111102', 'Rich restorative mud wrap infused with 26 minerals. Alleviates hot spots, hydrates dry skin, purges allergens, and leaves coat with mirror-like shine.', 'Therapeutic mineral mud wrap for skin health and silky shine.', 75, 110.00, '{"dog"}', 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80', '{"Warm mud pack application","10-minute coat wrap","Hydro-massage rinse","Silk protein conditioner"}', '{}', true, false)
ON CONFLICT (id) DO NOTHING;

-- 4. Product Categories
INSERT INTO public.product_categories (id, name, slug, description) VALUES
('44444444-4444-4444-4444-444444444401', 'Coat & Bath Botanicals', 'coat-bath-botanicals', 'Natural, chemical-free washes, silken rinses, and therapeutic soaks.'),
('44444444-4444-4444-4444-444444444402', 'Paw & Skin Salves', 'paw-skin-salves', 'Intensive organic balms, nose butters, and protective barriers.'),
('44444444-4444-4444-4444-444444444403', 'Grooming Tools & Brushes', 'grooming-tools-brushes', 'Hand-finished beechwood slicker brushes, wide-tooth pins, and combs.')
ON CONFLICT (id) DO NOTHING;

-- 5. Products
INSERT INTO public.products (id, name, slug, category_id, description, sku, price, sale_price, stock_quantity, image_url, ingredients, benefits, is_active, featured) VALUES
('55555555-5555-5555-5555-555555555501', 'Colloidal Oatmeal & Wild Chamomile Shampoo', 'colloidal-oatmeal-shampoo', '44444444-4444-4444-4444-444444444401', 'Specially formulated pH-balanced wash crafted in England. Gently cleanses sensitive dermis without stripping natural lipid barriers.', 'PWL-SHP-001', 34.00, NULL, 48, 'https://images.unsplash.com/photo-1608248597359-00965e64805e?auto=format&fit=crop&w=800&q=80', '{"Organic Colloidal Oat Flour","Roman Chamomile Extract","Aloe Leaf Juice","Coconut Glucoside"}', '{"Soothes irritated skin","Hydrates fur follicles","Hypoallergenic formula"}', true, true),
('55555555-5555-5555-5555-555555555502', 'Botanical Paw & Snout Protective Salve', 'botanical-paw-snout-salve', '44444444-4444-4444-4444-444444444402', 'An intensive nourishing salve created with organic raw shea butter, sea buckthorn oil, and organic calendula. Fast-absorbing and 100% lick-safe.', 'PWL-BLM-002', 26.00, 22.00, 75, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', '{"Fairtrade Raw Shea Butter","Cold-pressed Sea Buckthorn","Calendula Blossom Infusion","Beeswax"}', '{"Heals rough cracked pads","Forms weatherproof shield","Lick-safe organic ingredients"}', true, true),
('55555555-5555-5555-5555-555555555503', 'Artisanal Beechwood Pin & Bristle Brush', 'artisan-beechwood-brush', '44444444-4444-4444-4444-444444444403', 'Handcrafted in Germany using sustainable European beechwood. Double-sided featuring rounded steel detangling pins and natural boar bristles.', 'PWL-BRS-003', 48.00, NULL, 30, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80', '{"FSC Certified Beechwood","Natural Wild Boar Bristle","Polished Stainless Steel"}', '{"Distributes natural sebum oils","Gentle on sensitive scalps","Ergonomic contoured grip"}', true, true)
ON CONFLICT (id) DO NOTHING;

-- 6. Blog Categories & Posts
INSERT INTO public.blog_categories (id, name, slug) VALUES
('66666666-6666-6666-6666-666666666601', 'Coat Health', 'coat-health'),
('66666666-6666-6666-6666-666666666602', 'Seasonal Care', 'seasonal-care'),
('66666666-6666-6666-6666-666666666603', 'Styling & Breed Guides', 'styling-guides')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.blog_posts (id, title, slug, excerpt, body, cover_image_url, author_name, author_role, category_id, read_time_minutes, status, published_at) VALUES
('77777777-7777-7777-7777-777777777701', 'Understanding the Science of the Canine Double Coat', 'understanding-canine-double-coat', 'Why shaving a double-coated dog can disrupt their natural thermoregulation and what restorative grooming achieves instead.', 'Double coats serve as sophisticated natural insulation. The dense undercoat traps air to keep pets warm in winter and cool in summer, while the stiff guard hairs repel moisture, UV radiation, and environmental debris. Shaving a double-coated breed like a Golden Retriever or Husky disrupts this micro-climate. At PAWELLE, we practice specialized hydro-deshedding that frees trapped undercoat while preserving the outer barrier.', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80', 'Clara Vance', 'Master Canine Dermatologist & Stylist', '66666666-6666-6666-6666-666666666601', 5, 'published', now() - interval '3 days'),
('77777777-7777-7777-7777-777777777702', 'The Calming Grooming Ritual: Creating Low-Stress Experiences', 'calming-grooming-ritual-low-stress', 'Our deliberate approach to sensory accommodation, acoustic dampening, and rhythmic tactile care for nervous pets.', 'Many pets experience elevated cortisol levels during conventional grooming environments due to high-velocity dryer noise, caged holding areas, and rapid handling. PAWELLE operates on an unhurried, one-on-one session model. We utilise botanical aromatherapy, acoustic dampening panels, and gentle desensitisation intervals.', 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80', 'Julian Thorne', 'Director of Holistic Pet Wellness', '66666666-6666-6666-6666-666666666602', 6, 'published', now() - interval '8 days')
ON CONFLICT (id) DO NOTHING;

-- 7. Site Settings
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
('general', '{"business_name": "PAWELLE", "tagline": "Luxury Pet Grooming & Spa", "email": "concierge@pawelle.com", "phone": "+44 20 7946 0812", "address": "42 South Audley Street, Mayfair, London W1K 2PS", "opening_hours": "Monday – Saturday: 08:30 – 18:30", "currency_symbol": "£", "cancellation_window_hours": 24, "booking_deposit_required": false, "deposit_percentage": 0, "maintenance_mode": false, "whatsapp_number": "+447946081200"}'::jsonb)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;
