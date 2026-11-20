# PAWELLE — Technical Architecture v1

**Project:** Luxury Pet Grooming & Spa  
**Purpose:** Technical implementation blueprint

## 1. Technology stack

| Area | Technology |
|---|---|
| Frontend | React |
| Build tool | Vite |
| Language | TypeScript |
| Styling | Custom CSS + Bootstrap 5.3 utilities where useful |
| Icons | Lucide |
| Routing | React Router |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| File storage | Supabase Storage |
| Database security | Row Level Security |
| Hosting | Vercel or equivalent |
| Version control | Git |

Use custom components and styling. Bootstrap must not dictate the visual design.

## 2. Project structure

```text
pawelle/
│
├── public/
│   ├── assets/
│   │   ├── images/
│   │   ├── logos/
│   │   └── fonts/
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── navigation/
│   │   ├── forms/
│   │   ├── booking/
│   │   └── dashboard/
│   │
│   ├── layouts/
│   │   ├── PublicLayout.tsx
│   │   ├── CustomerLayout.tsx
│   │   ├── StaffLayout.tsx
│   │   └── AdminLayout.tsx
│   │
│   ├── pages/
│   │   ├── public/
│   │   ├── services/
│   │   ├── booking/
│   │   ├── shop/
│   │   ├── blog/
│   │   ├── auth/
│   │   ├── customer/
│   │   ├── staff/
│   │   └── admin/
│   │
│   ├── features/
│   │   ├── authentication/
│   │   ├── pets/
│   │   ├── appointments/
│   │   ├── grooming/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── notifications/
│   │
│   ├── hooks/
│   ├── services/
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── validation.ts
│   │
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── global.css
│   │   ├── components.css
│   │   ├── layouts.css
│   │   └── themes.css
│   │
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── config.toml
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── PROJECT_MASTER.md
├── DESIGN_SPEC.md
├── FUNCTIONAL_SPEC.md
└── TECHNICAL_ARCHITECTURE.md
```

## 3. Application architecture

Use a feature-based architecture.

Each feature should keep its own:
- Components.
- Data access functions.
- Validation.
- Types.
- Business logic.
- Tests.

Avoid putting the entire application into one large component or one JavaScript file.

Keep presentation, business logic and database operations separate.

## 4. Database architecture

Supabase PostgreSQL is the primary source of truth.

- Use relational tables and foreign keys.
- Use UUID primary keys.
- Add indexes for frequently searched fields.
- Use database constraints for important rules.
- Use transactions for operations that must succeed together.
- Store timestamps consistently.
- Configure the business timezone.
- Keep historical price snapshots on appointments and orders.

Database changes must be created as version-controlled migrations.

## 5. Backend and security architecture

- Supabase Auth handles user authentication.
- Row Level Security protects customer data.
- Staff permissions are limited to assigned work.
- Admin operations require verified administrator permissions.
- Sensitive operations use trusted server-side functions.
- Never expose the Supabase service-role key in frontend code.
- Validate all important input on the server.
- Protect payment verification and inventory updates.
- Keep an audit trail for sensitive administrative actions.

## 6. Image and asset architecture

All creative assets must come from genuine, appropriately licensed sources or human-created work.

Requirements:
- No AI-generated images.
- No AI-generated logos.
- No AI-generated illustrations.
- No AI-generated decorative artwork.
- No unlicensed Pinterest downloads.

Maintain an asset register containing:
- Asset filename.
- Source.
- Creator or provider.
- Licence.
- Attribution requirements.
- Usage location.

Use optimised image formats and responsive image sizes.

## 7. Design system architecture

Create shared design tokens for:
- Colours.
- Typography.
- Spacing.
- Border radii.
- Shadows.
- Layout widths.
- Breakpoints.
- Animation durations.

Shared components must include:
- Buttons.
- Form controls.
- Navigation.
- Footer.
- Breadcrumbs.
- Dialogs.
- Alerts.
- Loading states.
- Empty states.
- Pagination.
- Tables.

Customer and admin dashboards must use consistent underlying design tokens while retaining appropriate layouts.

## 8. Route architecture

Create separate route groups:

**Public**
- Home.
- Alternate homepage.
- About.
- Services.
- Service details.
- Pricing.
- Blog.
- Blog details.
- Contact.
- Shop.
- Product details.
- 404.

**Authentication**
- Login.
- Register.
- Forgot password.
- Reset password.

**Customer**
- Dashboard.
- Profile.
- Pets.
- Pet details.
- Appointments.
- Appointment details.
- Grooming history.
- Orders.
- Order details.
- Wishlist.
- Settings.

**Staff**
- Staff dashboard.
- Schedule.
- Assigned appointments.
- Pet details.
- Grooming records.

**Admin**
- Admin dashboard.
- Customers.
- Pets.
- Services.
- Packages.
- Appointments.
- Staff.
- Products.
- Categories.
- Orders.
- Messages.
- Reviews.
- Blog.
- Settings.

Protected routes must also be protected by backend permissions.

## 9. Environment configuration

Create `.env.example` with variable names only.

Example:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Never commit real credentials.

Payment-provider secrets and other private keys must remain server-side.

## 10. Development checkpoints

### Checkpoint 1 — Foundation
- Create project.
- Configure dependencies.
- Set up routing.
- Establish folder structure.
- Verify the project runs.

### Checkpoint 2 — Design system
- Configure fonts and tokens.
- Build navigation and footer.
- Build reusable components.
- Verify responsive foundations.

### Checkpoint 3 — Public pages
- Both homepages.
- About.
- Services.
- Pricing.
- Blog.
- Contact.
- 404.

### Checkpoint 4 — Booking and pets
- Authentication.
- Pet management.
- Service selection.
- Availability.
- Booking and appointment management.

### Checkpoint 5 — Customer and staff
- Customer dashboard.
- Staff dashboard.
- Grooming records.
- History and account settings.

### Checkpoint 6 — Shop
- Product catalogue.
- Product details.
- Cart.
- Checkout.
- Payments.
- Orders and stock.

### Checkpoint 7 — Administration
- Admin dashboard.
- Customers.
- Appointments.
- Services.
- Staff.
- Products.
- Orders.
- Messages and content.

### Checkpoint 8 — Final integration
- Dark mode.
- RTL.
- SEO.
- Accessibility.
- Responsive refinement.
- Security checks.
- Performance optimisation.

### Checkpoint 9 — Quality assurance
- Test every route.
- Test every button and form.
- Test permissions.
- Test booking conflicts.
- Test payment failures.
- Test mobile and desktop.
- Fix regressions.

## 11. Implementation rules

1. Read all project specification documents before implementation.
2. Do not remove requested features without approval.
3. Do not invent customer records, testimonials or business claims.
4. Do not use fake data as if it were live business data.
5. Use clearly identified development seed data only when necessary.
6. Never create buttons that do nothing.
7. Never report an operation as successful before it succeeds.
8. Do not redesign approved visual decisions without approval.
9. Complete and verify one checkpoint before proceeding.
10. Update project documentation after each checkpoint.
11. Record unresolved issues rather than hiding them.
12. Keep the code maintainable and avoid unnecessary dependencies.

## 12. Completion standard

PAWELLE is ready for release only when:

- All requested pages exist.
- Responsive layouts work.
- Authentication works.
- Customer and staff permissions work.
- Booking availability is reliable.
- Pet records work.
- Shop and order operations work.
- Payments are securely verified.
- Admin operations work.
- All assets have documented usage rights.
- No important controls are inert.
- Critical errors and security issues are resolved.

**Final principle: Build a coherent, secure and maintainable application—not merely a collection of attractive pages.**