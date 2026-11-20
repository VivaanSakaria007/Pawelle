# PAWELLE — Website Master Blueprint v1

**Project:** Luxury Pet Grooming & Spa  
**Design direction:** Original boutique pet-care design inspired by the supplied Pinterest references and real grooming websites.

## 1. Project objective

Build a complete, premium, responsive pet grooming website with:

- Two distinct homepage designs.
- Public business and service pages.
- Customer registration and login.
- Pet profiles and grooming history.
- Appointment booking and management.
- Online shop and checkout.
- Customer dashboard.
- Admin dashboard.
- Blog and contact system.
- Dark/light theme and RTL support.
- SEO, accessibility and performance optimisation.

The result must look like a professionally designed business website, not an AI-generated template.

## 2. Design principles

- Use original page compositions inspired by researched websites.
- Use real, appropriately licensed photography.
- No AI-generated images, logos, illustrations or other creative assets.
- Use established professional fonts.
- Use varied editorial layouts and asymmetric image arrangements.
- Avoid repetitive card grids, excessive rounded containers, gradients and glassmorphism.
- Use whitespace deliberately.
- Keep navigation simple.
- Use subtle, purposeful animations.
- Respect reduced-motion preferences.
- Design mobile layouts deliberately rather than merely shrinking desktop layouts.

## 3. Public website pages

### Homepage 1 — Main business homepage
- Main navigation and booking button.
- Large photographic hero.
- Brand introduction.
- Grooming service presentation.
- Why choose PAWELLE.
- Grooming gallery.
- Featured packages.
- Customer testimonials.
- Booking invitation.
- Footer.

### Homepage 2 — Alternative niche homepage
- Different hero composition.
- Dog and cat grooming categories.
- Featured spa experiences.
- Grooming process.
- Featured professionals.
- Customer stories.
- Package comparison.
- Booking invitation.

The second homepage must have a distinct layout, not simply a recoloured copy of the first.

### About
- Brand story.
- Mission and values.
- Team profiles.
- Grooming philosophy.
- Facilities and hygiene.
- Genuine testimonials.

### Services
- Dog grooming.
- Cat grooming.
- Bath and blow-dry.
- Haircut and styling.
- Nail care.
- Ear cleaning.
- Spa treatments.
- Puppy grooming.

### Service details
- Service description.
- Included treatments.
- Suitable pet types.
- Duration.
- Pricing.
- FAQs.
- Booking action.

### Pricing
- Individual service prices.
- Packages.
- Membership options, if offered.
- Clear inclusions and exclusions.

### Blog
- Blog listing.
- Search.
- Categories.
- Individual articles.
- Related articles.

### Contact
- Contact information.
- Location and map.
- Business hours.
- Contact form.
- WhatsApp link, where configured.

## 4. Customer functionality

### Authentication
- Registration.
- Login.
- Logout.
- Password recovery.
- Account verification.

### Customer dashboard
- Upcoming appointments.
- Recent activity.
- Pet overview.
- Order overview.
- Account information.

### Pet management
- Add pets.
- Edit pet information.
- Delete pets.
- Name, species, breed, age and weight.
- Photograph.
- Grooming preferences.
- Allergies or care notes, with appropriate privacy protection.
- Previous grooming services.

### Booking system
- Select pet.
- Select service.
- Choose location, if applicable.
- Select available date.
- Select available time.
- Review pricing.
- Confirm appointment.
- View booking status.
- Reschedule or cancel according to configured policies.

### Shopping
- Product listing.
- Product details.
- Search and filtering.
- Shopping cart.
- Wishlist.
- Checkout.
- Payment.
- Order history.
- Order details.

## 5. Admin dashboard

### Overview
- Appointment statistics.
- Revenue.
- Customer count.
- Orders.
- Recent activity.

### Management
- Customers.
- Pets.
- Appointments.
- Services.
- Pricing.
- Products.
- Categories.
- Orders.
- Contact messages.
- Reviews.
- Blog articles.
- Staff.
- Business settings.

### Administration requirements
- Create, read, update and delete records where appropriate.
- Search and filtering.
- Pagination.
- Status management.
- Role-based access.
- Confirmation before destructive actions.
- Proper error and success messages.

## 6. Technical architecture

Recommended foundation:

**Frontend**
- HTML5.
- CSS3.
- Bootstrap 5.3.
- JavaScript ES modules.
- Vite.

**Backend**
- Supabase Authentication.
- PostgreSQL database.
- Supabase Storage.
- Row Level Security.

**Payments**
- A payment gateway suitable for the business's operating market.
- Server-side payment verification.
- No storage of raw payment-card information.

**Deployment**
- Production-ready hosting.
- Custom domain.
- HTTPS.
- Environment variables.
- Database backups.

The frontend template and functioning application must be structured so their responsibilities remain clear.

## 7. Core database entities

- Users.
- Customer profiles.
- Staff profiles.
- Pets.
- Services.
- Service categories.
- Appointments.
- Availability slots.
- Grooming records.
- Products.
- Product categories.
- Cart items.
- Orders.
- Order items.
- Payments.
- Reviews.
- Contact messages.
- Blog posts.
- Site settings.

Database relationships and access permissions must be designed before implementation.

## 8. Asset requirements

Maintain an asset register containing:

- Asset name.
- Source website.
- Original creator, where available.
- Licence or permission.
- Usage restrictions.
- Final local filename.
- Intended page.

No random Pinterest downloads, unlicensed photographs or AI-generated assets.

## 9. Responsive testing

Test at:

- 320px.
- 360px.
- 390px.
- 430px.
- 768px.
- 1024px.
- 1366px.
- 1440px.
- 1920px.

Check:
- No horizontal overflow.
- Readable typography.
- Correct image cropping.
- Usable mobile navigation.
- Functional forms.
- Accessible buttons.
- Responsive tables and dashboards.

## 10. Quality standards

No feature may be marked complete simply because it looks correct.

Every feature must be tested.

- No dead buttons.
- No fake booking confirmations.
- No fabricated customer records presented as real.
- No insecure admin access.
- No exposed API secrets.
- No broken navigation.
- No console errors left unresolved.
- No unexpected changes to approved design decisions.

## 11. Development workflow

1. Finalise the visual design system.
2. Create the project architecture.
3. Build shared components.
4. Implement both homepages.
5. Implement all public pages.
6. Implement customer authentication and profiles.
7. Implement appointment management.
8. Implement the shop and orders.
9. Implement the admin dashboard.
10. Implement dark/light mode and RTL.
11. Test responsiveness and functionality.
12. Perform final visual and security reviews.

Claude is responsible for implementation. Antigravity is used to run, inspect and test the project. Changes must remain within the approved specification.

## 12. Completion criteria

PAWELLE is complete only when:

- All specified pages exist.
- All required features work.
- Database operations persist correctly.
- Authentication and permissions are secure.
- Booking and payment flows are verified.
- Responsive layouts work.
- Asset licences are documented.
- SEO and accessibility checks are completed.
- No critical bugs remain.
- Production deployment is verified.

**Project principle: A beautiful website is not enough. It must be a genuinely usable, maintainable business application.**