# PAWELLE — Functional & Database Specification v1

**Project:** Luxury Pet Grooming & Spa  
**Document:** Functional requirements, user journeys, database and permissions  
**Status:** Initial implementation specification

---

# 1. Application roles

The application must support separate permission levels.

### Guest
- Browse public pages.
- View services and pricing.
- Read blog articles.
- Browse products.
- Submit contact enquiries.
- Begin a booking journey.

### Customer
- Manage personal account.
- Add and manage pets.
- Book appointments.
- View and manage appointments.
- View grooming history.
- Shop and purchase products.
- View orders and payment status.
- Manage preferences.

### Groomer / Staff
- Access assigned appointments.
- View necessary pet information.
- Update appointment progress.
- Add grooming notes and service records.
- View their own schedule.

### Administrator
- Manage customers and staff.
- Manage pets and grooming records.
- Manage appointments and availability.
- Manage services, packages and prices.
- Manage products and orders.
- Manage messages, reviews and blog content.
- View business analytics.
- Configure business settings.

Permissions must be enforced by the backend, not just by hiding frontend buttons.

# 2. Public website functionality

### Navigation
- All menu links must navigate to valid pages.
- Active page must be indicated.
- Logo returns to the selected homepage.
- Booking buttons open the booking process.
- Account links open login or the customer dashboard.
- Shopping icon opens the cart.

### Homepage
- Service links open their respective service pages.
- Package links open pricing or booking.
- Gallery images can open a larger image view.
- Testimonials display genuine approved reviews.
- Contact links use configured business contact details.

### Service pages
Each service must have:
- Name.
- Description.
- Category.
- Suitable pet types.
- Duration.
- Price.
- Inclusions.
- Optional exclusions.
- Active/inactive status.
- Featured image.
- Booking action.

### Blog
- Search published articles.
- Filter by category.
- Open article details.
- Navigate to related articles.
- Only published articles are visible publicly.

### Contact
- Validate required fields.
- Validate email and phone formats.
- Submit enquiry.
- Store the enquiry in the database.
- Display confirmation only after successful submission.
- Prevent accidental duplicate submissions.

# 3. Customer authentication

Required operations:
- Register.
- Verify email where configured.
- Login.
- Logout.
- Recover password.
- Reset password.
- Update profile.
- Change password.

Security requirements:
- Use Supabase Authentication.
- Never store plain-text passwords.
- Never expose private service-role keys in frontend code.
- Protect private routes.
- Verify ownership of customer records.
- Apply Row Level Security policies.

# 4. Pet management

Customers can create and manage multiple pet profiles.

Pet information:
- Pet ID.
- Owner ID.
- Name.
- Species.
- Breed.
- Date of birth or approximate age.
- Weight, where relevant.
- Profile photograph.
- Coat type.
- Grooming preferences.
- Care notes.
- Created date.
- Updated date.

Operations:
- Add pet.
- Edit pet.
- View pet.
- Delete or archive pet.
- View pet-specific appointment history.
- View grooming history.

Privacy:
- Only the pet owner and specifically authorised staff may access private pet records.
- Sensitive care information must not be exposed publicly.
- Access to care notes must be restricted to the people who need them.

# 5. Appointment booking

The booking process must be a real availability-based workflow.

### Booking steps

1. Customer selects a pet.
2. Customer selects a service.
3. System checks service eligibility.
4. Customer selects location, if multiple locations exist.
5. System displays available dates.
6. Customer selects an available time.
7. System calculates the price.
8. Customer reviews booking details.
9. Customer confirms.
10. System creates the appointment.
11. Customer receives a confirmed result only after the backend succeeds.

### Appointment fields
- Appointment ID.
- Customer ID.
- Pet ID.
- Service ID.
- Staff ID, if assigned.
- Location ID, if applicable.
- Start time.
- End time.
- Price snapshot.
- Appointment status.
- Customer notes.
- Internal staff notes.
- Payment status.
- Created timestamp.

### Appointment statuses
- Pending.
- Confirmed.
- Checked in.
- In progress.
- Completed.
- Cancelled.
- No show.

### Booking rules
- Prevent overlapping bookings.
- Prevent double booking of staff and resources.
- Validate availability on the server.
- Use consistent business timezone handling.
- Do not trust a time slot merely because it appeared available earlier.
- Recheck availability when confirming.
- Apply configured cancellation and rescheduling policies.
- Record status changes.

### Customer appointment actions
- View upcoming appointments.
- View previous appointments.
- Cancel according to policy.
- Request or perform rescheduling according to policy.
- View appointment details.
- View grooming record after completion.

# 6. Grooming records

When a grooming appointment is completed, authorised staff can create a grooming record.

Fields:
- Pet ID.
- Appointment ID.
- Services performed.
- Groomer ID.
- Date.
- Coat condition notes.
- Grooming notes.
- Products used, where relevant.
- Recommended next visit.
- Before/after photographs, with appropriate consent.

Records must be associated with the correct pet and customer.

# 7. Shop and ecommerce

### Product catalogue
Each product must support:
- Product name.
- Slug.
- Description.
- Category.
- Price.
- Sale price, if applicable.
- Stock quantity.
- SKU.
- Product images.
- Active/inactive status.
- SEO metadata.

### Shopping cart
- Add product.
- Remove product.
- Change quantity.
- Recalculate totals.
- Check current stock.
- Preserve cart for authenticated customers.
- Handle unavailable products.

### Checkout
1. Review cart.
2. Enter delivery information.
3. Calculate applicable shipping and taxes.
4. Review total.
5. Select payment method.
6. Initiate payment.
7. Verify payment securely on the backend.
8. Create or confirm the order.
9. Update inventory safely.
10. Display the actual order result.

### Order statuses
- Pending payment.
- Paid.
- Processing.
- Shipped.
- Delivered.
- Cancelled.
- Refunded.

Payment status and order fulfilment status must be separate fields.

Never mark an order paid based solely on a browser redirect.

# 8. Customer dashboard

The dashboard must display real database information.

### Overview
- Welcome message.
- Upcoming appointment.
- Registered pets.
- Recent orders.
- Recent activity.

### My pets
- Pet list.
- Add pet.
- Edit pet.
- Pet details.
- Grooming history.

### Appointments
- Upcoming.
- Previous.
- Cancelled.
- Appointment details.
- Rescheduling and cancellation actions.

### Orders
- Order history.
- Order details.
- Payment status.
- Delivery status.

### Account settings
- Personal information.
- Contact details.
- Password management.
- Notification preferences.

# 9. Staff dashboard

Staff members can:
- View assigned appointments.
- View their schedule.
- Access necessary pet details.
- Mark check-in.
- Start grooming.
- Complete grooming.
- Add grooming records.
- Add internal notes.

Staff must not receive unrestricted administrator access.

# 10. Admin dashboard

### Overview
Display:
- Total appointments.
- Upcoming appointments.
- Completed appointments.
- Customer count.
- Product count.
- Order count.
- Revenue based on verified payments.
- Recent activity.

### Appointment management
- View appointments.
- Search and filter.
- Assign staff.
- Change status.
- View pet details.
- Reschedule.
- Cancel.
- Add internal notes.

### Customer management
- View customers.
- Search customers.
- View their pets.
- View appointment history.
- View order history.
- Update authorised account information.

### Service management
- Create services.
- Edit services.
- Archive services.
- Configure duration.
- Configure prices.
- Configure eligible pet types.
- Configure availability rules.

### Product management
- Create products.
- Edit products.
- Update stock.
- Manage categories.
- Manage images.
- Archive products.

### Order management
- View orders.
- Update fulfilment status.
- View payment status.
- Process permitted cancellations and refunds through the payment provider.

### Message management
- View contact enquiries.
- Mark as read.
- Assign.
- Reply using configured communication tools.
- Archive.

### Content management
- Create and edit blog posts.
- Manage categories.
- Publish and unpublish.
- Manage approved reviews.

# 11. Database design

Recommended relational database using PostgreSQL.

### Core tables

**profiles**
- id
- full_name
- email
- phone
- avatar_url
- role
- created_at
- updated_at

**pets**
- id
- owner_id
- name
- species
- breed
- birth_date
- weight
- photo_url
- coat_type
- grooming_preferences
- care_notes
- created_at
- updated_at

**services**
- id
- name
- slug
- description
- category_id
- duration_minutes
- base_price
- eligible_pet_types
- image_url
- is_active
- created_at
- updated_at

**service_categories**
- id
- name
- slug
- description

**locations**
- id
- name
- address
- timezone
- is_active

**staff**
- id
- profile_id
- location_id
- is_active

**availability**
- id
- staff_id
- location_id
- weekday
- start_time
- end_time
- effective_from
- effective_until

**appointments**
- id
- customer_id
- pet_id
- service_id
- staff_id
- location_id
- starts_at
- ends_at
- price_snapshot
- status
- payment_status
- customer_notes
- internal_notes
- created_at
- updated_at

**grooming_records**
- id
- pet_id
- appointment_id
- groomer_id
- services_performed
- coat_notes
- grooming_notes
- next_visit_date
- created_at

**products**
- id
- name
- slug
- description
- sku
- price
- sale_price
- stock_quantity
- category_id
- is_active
- created_at
- updated_at

**product_categories**
- id
- name
- slug

**orders**
- id
- customer_id
- order_number
- subtotal
- shipping_amount
- tax_amount
- total_amount
- currency
- order_status
- payment_status
- shipping_address
- created_at
- updated_at

**order_items**
- id
- order_id
- product_id
- product_name_snapshot
- unit_price_snapshot
- quantity
- line_total

**payments**
- id
- order_id
- appointment_id
- provider
- provider_reference
- amount
- currency
- status
- verified_at
- created_at

**reviews**
- id
- customer_id
- appointment_id
- rating
- review_text
- is_approved
- created_at

**contact_messages**
- id
- name
- email
- phone
- subject
- message
- status
- created_at

**blog_posts**
- id
- title
- slug
- excerpt
- body
- cover_image_url
- author_id
- category_id
- status
- published_at
- created_at
- updated_at

**blog_categories**
- id
- name
- slug

**site_settings**
- id
- setting_key
- setting_value
- updated_at

Additional tables may be introduced for carts, notifications, staff assignments, audit logs, refunds and multi-location operations where needed.

Use foreign keys, indexes, constraints and transactions appropriately.

# 12. Data security and access control

Apply Supabase Row Level Security.

### Customer
- Can read and update their own permitted profile.
- Can manage only their own pets.
- Can view their own appointments and orders.
- Cannot change prices or payment statuses.
- Cannot access another customer's private records.

### Staff
- Can view assigned appointments.
- Can access only necessary customer and pet information.
- Can update permitted appointment fields.
- Can create authorised grooming records.
- Cannot manage administrator accounts.

### Administrator
- Has authorised administrative access.
- Administrative actions must be checked server-side.
- Sensitive operations should be recorded in audit logs.

Never trust role information supplied by an untrusted browser request.

# 13. Notifications

Support configurable notifications for:
- Booking request received.
- Appointment confirmed.
- Appointment rescheduled.
- Appointment cancelled.
- Upcoming appointment reminder.
- Order placed.
- Payment result.
- Order status change.

Use an appropriate email provider and optional WhatsApp integration.

Do not claim a notification was delivered unless delivery is confirmed by the provider.

# 14. Theme and language functionality

### Light and dark mode
- Persist customer preference.
- Respect system preference by default.
- Ensure all pages and form states are readable.

### RTL
- Use logical CSS properties.
- Support right-to-left language direction.
- Test navigation, forms, tables, icons and dashboards.

### Accessibility
- Keyboard navigation.
- Visible focus.
- Proper form labels.
- Accessible error messages.
- Meaningful image alternative text.
- Appropriate colour contrast.

# 15. Error handling

Every asynchronous operation must support:
- Loading state.
- Success state.
- Validation errors.
- Network failure.
- Permission failure.
- Empty state.
- Retry where appropriate.

Never display fake success messages.

# 16. Required testing scenarios

### Authentication
- Successful registration.
- Duplicate email.
- Incorrect password.
- Password reset.
- Logged-out access to protected pages.

### Pets
- Create pet.
- Edit pet.
- Delete or archive pet.
- Verify customer ownership restrictions.

### Booking
- Available time slot.
- Unavailable time slot.
- Simultaneous booking attempts.
- Cancelled booking.
- Rescheduled booking.
- Completed appointment and grooming record.

### Shopping
- Add to cart.
- Change quantity.
- Out-of-stock product.
- Successful payment.
- Failed payment.
- Duplicate payment callback.
- Order creation and inventory update.

### Administration
- Role restrictions.
- Appointment status changes.
- Product and service management.
- Customer access restrictions.
- Audit logging.

### Responsive
- Mobile navigation.
- Booking on mobile.
- Checkout on mobile.
- Dashboard tables on mobile.
- Form validation on all screen sizes.

# 17. Definition of functional completion

A feature is complete only when:

1. Its interface exists.
2. Its actions are connected to real application logic.
3. Data is correctly saved or retrieved.
4. Permissions are enforced.
5. Errors are handled.
6. It has been tested.
7. It works on supported screen sizes.

**Core rule: PAWELLE must be a working business application, not a static design pretending to be one.**