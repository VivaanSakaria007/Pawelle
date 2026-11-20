# PAWELLE — MASTER BUILD PROMPT

## PRIMARY DIRECTIVE: BUILD THE COMPLETE APPLICATION

You are the lead full-stack developer responsible for implementing the complete PAWELLE website and application.

Your task is to build the entire project using the four specification documents supplied in the project folder.

**You are not being asked to create a prototype, homepage demo, visual mockup, or partial application. You are being asked to implement the complete project.**

---

# 1. READ BEFORE BUILDING

Before writing code, read these four files completely:

1. `PROJECT_MASTER.md`
2. `DESIGN_SPEC.md`
3. `FUNCTIONAL_SPEC.md`
4. `TECHNICAL_ARCHITECTURE.md`

Treat these documents as the project's source of truth.

Resolve implementation details consistently with all four documents. If two requirements conflict, follow the more specific requirement and document the conflict.

Do not discard, simplify or silently omit requested features.

# 2. MOST IMPORTANT: DO NOT STOP BETWEEN PHASES

You must execute the entire implementation in one continuous autonomous workflow.

**Mandatory instructions:**

- Do not stop after creating the project foundation.
- Do not stop after building the homepage.
- Do not stop after completing the frontend.
- Do not stop after creating database tables.
- Do not stop after implementing authentication.
- Do not stop after implementing the booking system.
- Do not stop after building the customer dashboard.
- Do not stop after building the admin dashboard.
- Do not stop after completing individual checkpoints.
- Do not ask whether you should continue.
- Do not wait for intermediate approval for routine implementation decisions.
- Do not deliver only instructions explaining what remains to be built.

Complete every development checkpoint in sequence without voluntarily pausing.

If you encounter execution, context or tool limits, save all work, update the progress documentation, record the exact remaining tasks and resume from the last completed task when execution becomes available again.

Do not restart completed work unnecessarily.

**Your final objective is a complete, tested and working application.**

# 3. CREATIVE AND DESIGN RESTRICTIONS

The visual design must follow `DESIGN_SPEC.md`.

The Pinterest references and other websites are inspiration only. Do not copy their layouts or reproduce their designs.

The user has explicitly prohibited AI-generated creative assets.

Never use:
- AI-generated photographs.
- AI-generated logos.
- AI-generated illustrations.
- AI-generated decorative artwork.
- AI-generated mockups as final website assets.

Use genuine photography from legitimate sources with appropriate usage rights.

Use genuine, properly licensed icons and fonts. The logo must be human-designed or sourced from an appropriately licensed genuine asset.

Maintain an asset register containing the asset name, source, licence, attribution requirements and usage location.

Do not use Pinterest images without verified usage rights.

Do not invent customer testimonials, reviews, team members, awards, business history or business claims.

Do not make the design look like a generic AI-generated website.

Avoid repetitive card grids. Use editorial layouts, meaningful whitespace, varied section compositions and deliberate typography.

# 4. COMPLETE FEATURE REQUIREMENTS

Implement every requested feature from the specifications.

### Public website
- Main homepage.
- Alternate homepage.
- About.
- Team and mission sections.
- Services listing.
- Individual service details.
- Pricing and packages.
- Blog listing.
- Blog details.
- Contact.
- Shop.
- Product details.
- Login and registration.
- Coming soon and maintenance pages.
- Custom 404 page.

### Customer application
- Customer dashboard.
- Profile management.
- Multiple pet profiles.
- Pet details.
- Appointment booking.
- Appointment history.
- Appointment cancellation and rescheduling.
- Grooming history.
- Product shopping.
- Cart.
- Checkout.
- Order history.
- Wishlist.
- Account settings.

### Staff application
- Staff dashboard.
- Assigned appointments.
- Schedule.
- Pet information access.
- Appointment progress.
- Grooming notes and records.

### Administration
- Admin dashboard.
- Analytics.
- Customers.
- Pets.
- Staff.
- Services.
- Packages.
- Appointments.
- Products.
- Categories.
- Orders.
- Messages.
- Reviews.
- Blog content.
- Site settings.

### Global functionality
- Responsive layouts.
- Dark and light mode.
- RTL support.
- SEO.
- Accessibility.
- Loading states.
- Error states.
- Empty states.
- Form validation.
- Functional navigation.
- Real data integration.

# 5. TECHNICAL IMPLEMENTATION

Follow `TECHNICAL_ARCHITECTURE.md`.

Use the approved stack:
- React.
- Vite.
- TypeScript.
- Custom CSS.
- Bootstrap 5.3 utilities where useful.
- Lucide icons.
- React Router.
- Supabase.
- PostgreSQL.
- Supabase Auth.
- Supabase Storage.
- Row Level Security.

Keep the project modular and maintainable.

Use reusable components, feature-based modules, typed data structures and proper validation.

Do not place the entire application in a single component or file.

Do not add unnecessary dependencies.

# 6. BACKEND AND DATABASE

Implement the database structure and relationships described in `FUNCTIONAL_SPEC.md`.

Requirements:
- Version-controlled SQL migrations.
- Correct primary and foreign keys.
- Proper indexes.
- Database constraints.
- Secure access policies.
- Row Level Security.
- Server-side validation.
- Correct ownership checks.
- Consistent timestamps and timezone handling.
- Safe inventory updates.
- Reliable appointment availability checks.
- Audit logs for sensitive operations.

Do not create frontend-only simulations of backend features and present them as real.

If Supabase credentials are not available, implement the integration structure and migrations, use clearly labelled development configuration, and record the exact external setup required. Never invent credentials or claim a live backend is connected.

# 7. BOOKING SYSTEM

Implement the complete booking workflow.

The booking system must:
- Select a customer pet.
- Select an eligible service.
- Retrieve available dates and times.
- Validate availability on the server.
- Prevent overlapping appointments.
- Prevent double booking.
- Calculate the correct price.
- Save appointment details.
- Support authorised status updates.
- Support cancellation and rescheduling policies.
- Display real appointment information in customer and staff dashboards.

Do not use hardcoded time slots as live availability.

# 8. SHOP AND PAYMENT SYSTEM

Implement:
- Product catalogue.
- Product detail pages.
- Cart.
- Quantity management.
- Stock validation.
- Checkout.
- Delivery details.
- Order creation.
- Payment integration structure.
- Payment verification.
- Order status tracking.
- Inventory updates.

Never expose secret payment credentials in frontend code.

Never treat a payment redirect as proof of successful payment.

If payment-provider credentials are unavailable, implement the integration boundary and clearly document the configuration needed. Do not simulate a successful real payment.

# 9. BUSINESS CONFIGURATION

Business-specific details that have not yet been supplied must be configurable.

Do not invent:
- Business address.
- Contact number.
- Email.
- Operating hours.
- Staff identities.
- Real service prices.
- Real customer records.
- Testimonials.
- Delivery policies.
- Payment credentials.

Use clearly identified development seed data only where needed for testing.

Make business settings manageable through configuration or the authorised admin interface.

# 10. IMPLEMENTATION ORDER

Execute all checkpoints automatically.

**Checkpoint 1 — Project foundation**
- Initialise project.
- Install necessary dependencies.
- Configure TypeScript.
- Set up routing.
- Establish folder structure.
- Confirm successful development build.

**Checkpoint 2 — Design system**
- Typography.
- Colour tokens.
- Spacing.
- Buttons.
- Navigation.
- Footer.
- Forms.
- Shared components.
- Responsive foundations.

**Checkpoint 3 — Public website**
- All public pages.
- Both homepages.
- Service pages.
- Pricing.
- Blog.
- Contact.
- Shop catalogue.
- Error pages.

**Checkpoint 4 — Backend foundation**
- Supabase integration.
- Database migrations.
- Authentication.
- Row Level Security.
- Storage configuration.

**Checkpoint 5 — Pets and booking**
- Pet management.
- Service management.
- Availability.
- Booking.
- Appointment management.

**Checkpoint 6 — Customer and staff applications**
- Customer dashboard.
- Staff dashboard.
- Grooming records.
- Account settings.

**Checkpoint 7 — Ecommerce**
- Products.
- Cart.
- Checkout.
- Payment integration.
- Orders.
- Inventory.

**Checkpoint 8 — Administration**
- Admin dashboard.
- All management sections.
- Analytics.
- Content management.
- Site settings.

**Checkpoint 9 — Refinement**
- Dark mode.
- RTL.
- SEO.
- Accessibility.
- Responsive refinements.
- Performance optimisation.

**Checkpoint 10 — Complete quality assurance**
- Build tests.
- Functional tests.
- Database tests.
- Permission tests.
- Booking tests.
- Ecommerce tests.
- Mobile tests.
- Desktop tests.
- Regression tests.

Do not voluntarily pause between these checkpoints.

# 11. TESTING AND ERROR CORRECTION

After implementation, run the available automated checks.

At minimum:
- TypeScript checks.
- Production build.
- Linting, if configured.
- Unit tests.
- Integration tests.
- Browser-based end-to-end tests where available.

Inspect every major route.

Test every important button, form, navigation link and workflow.

Test both successful and unsuccessful operations.

Fix errors before marking a feature complete.

Do not hide errors with empty catch blocks or misleading success messages.

Do not remove features simply to make tests pass.

Do not claim that a feature works unless it has actually been tested to the extent possible in the available environment.

# 12. PROGRESS DOCUMENTATION

Create and maintain:

- `PROJECT_PROGRESS.md`
- `IMPLEMENTATION_LOG.md`
- `BUGS_AND_FIXES.md`
- `ASSET_REGISTER.md`
- `SETUP_AND_DEPLOYMENT.md`

Update these throughout implementation.

Record:
- Completed features.
- Pending features.
- Files created or changed.
- Database migrations.
- Tests executed.
- Test results.
- Known bugs.
- External configuration required.
- Deployment requirements.

If interrupted, these files must make it possible to resume without repeating completed work.

# 13. FINAL ACCEPTANCE CRITERIA

Do not declare the project complete until:

- All requested pages are implemented.
- All requested dashboards are implemented.
- Core application workflows work.
- Database migrations are present.
- Security policies are implemented.
- Customer permissions are tested.
- Staff permissions are tested.
- Admin permissions are tested.
- Booking logic is tested.
- Shop and order logic are tested.
- Payment integration limitations are documented.
- Responsive layouts are checked.
- No important controls are inert.
- The production build succeeds.
- Remaining external setup is clearly documented.

If an external service requires credentials or a real business decision, implement everything that can safely be implemented without those credentials. List the exact remaining configuration rather than pretending it is complete.

# 14. FINAL REPORT

At the end, provide a factual report containing:

1. What has been implemented.
2. Which pages are complete.
3. Which application workflows are functional.
4. Database and backend status.
5. Security implementation status.
6. Testing performed and results.
7. Known bugs or limitations.
8. External credentials or setup still required.
9. How to run the project locally.
10. How to deploy it.

Separate fully tested functionality from functionality that is implemented but awaiting external configuration.

---

# FINAL INSTRUCTION

**Do not stop at a plan. Do not stop at a prototype. Do not stop after the first successful page. Do not ask for permission to proceed between routine development phases.**

Work through the complete specification, implement the entire PAWELLE application, test it, fix issues, document it and deliver the finished project.

Your job is to finish the application—not merely begin it.