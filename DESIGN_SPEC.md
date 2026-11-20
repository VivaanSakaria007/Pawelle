# PAWELLE — Visual Design Specification v1

**Project:** Luxury Pet Grooming & Spa  
**Design approach:** Original boutique pet-care identity  
**Reference approach:** Take inspiration from the supplied Pinterest designs and researched grooming websites. Never reproduce another website exactly.

## 1. Overall visual identity

PAWELLE should feel like a carefully designed boutique grooming studio.

The visual experience should be:
- Warm, welcoming and sophisticated.
- Simple to navigate.
- Photography-led.
- Editorial rather than dashboard-like.
- Distinctive without unnecessary decoration.
- Consistent across all pages.

Avoid:
- Generic AI-generated website aesthetics.
- Repetitive three-column card grids.
- Excessive rounded containers.
- Purple or blue gradients.
- Glassmorphism.
- Random floating shapes.
- Excessive animations.
- Generic stock-template layouts.
- Emojis used as professional icons.

## 2. Colour system

Initial palette:

| Token | Hex | Usage |
|---|---|---|
| Primary background | #F4F0E7 | Main page background |
| Brand forest | #283B32 | Primary brand colour |
| Sand | #D6C7AD | Secondary sections |
| Terracotta | #A65B46 | Small accent details |
| Warm white | #FFFEFB | Content backgrounds |
| Charcoal | #292C29 | Primary text |
| Muted text | #77766E | Supporting text |
| Borders | #E5DED2 | Dividers and outlines |

Rules:
- Use ivory as the dominant light background.
- Use forest green for important sections and actions.
- Use terracotta sparingly.
- Preserve sufficient text contrast.
- Avoid applying every brand colour to every section.

## 3. Typography

Initial candidates:

**Headings:** Fraunces  
**Body:** DM Sans  
**Alternative heading:** Cormorant Garamond

Typography rules:
- Distinctive large headings.
- Comfortable paragraph widths.
- Clear hierarchy between headings and supporting text.
- Consistent line heights.
- Avoid excessive uppercase text.
- Use responsive font sizes with fluid scaling.
- Never use more than two primary font families without a clear reason.

All fonts must be obtained from legitimate sources with documented licences.

## 4. Layout and spacing

Use a consistent spacing system based on 4px increments.

Suggested spacing:
- 4px: tiny inline gaps.
- 8px: compact spacing.
- 16px: normal component spacing.
- 24px: content separation.
- 32px: section sub-spacing.
- 48px: medium section spacing.
- 64px: large section spacing.
- 96px: major desktop section spacing.

Layout rules:
- Use a consistent maximum content width.
- Give editorial sections generous whitespace.
- Allow selected images and backgrounds to extend beyond the normal content container.
- Use asymmetrical layouts where appropriate.
- Keep paragraphs readable.
- Avoid excessive empty space on mobile.

## 5. Header and navigation

Desktop:
- Brand logo on the left.
- Main navigation in the centre or right.
- Booking action clearly visible.
- Account and shopping links where appropriate.
- Sticky header only if it improves usability.

Mobile:
- Compact logo.
- Accessible menu button.
- Slide-out or dropdown navigation.
- Clearly visible booking action.
- No desktop navigation squeezed onto small screens.

Header behaviour:
- Subtle background and shadow changes on scroll.
- Clear active-page indication.
- Keyboard-accessible navigation.
- No unnecessary animated menu effects.

## 6. Homepage 1

Purpose: Introduce PAWELLE and convert visitors into customers.

Section sequence:

1. Header and navigation.
2. Large photographic hero with headline and booking action.
3. Short brand introduction.
4. Editorial grooming service presentation.
5. Why choose PAWELLE.
6. Grooming process.
7. Real photography gallery.
8. Featured packages and pricing.
9. Genuine customer testimonials.
10. Booking invitation.
11. Complete footer.

The hero must have a strong visual focal point. Avoid placing every element inside a small floating card.

## 7. Homepage 2

Purpose: Offer a distinct niche-focused experience.

Possible focus:
- Dog grooming.
- Cat grooming.
- Puppy grooming.
- Spa and wellness treatments.

Use a different page composition from Homepage 1. Do not simply change its colours and photographs.

## 8. Inner pages

### About
Use a story-led layout, team photography, mission, values and genuine customer feedback.

### Services
Use varied image-and-text sections or an editorial service index. Avoid making every service an identical card.

### Service details
Show service description, inclusions, duration, price, pet suitability, FAQs and booking action.

### Pricing
Use a clear comparison layout with readable prices and transparent inclusions.

### Blog
Editorial article listings, readable typography, search and category navigation.

### Blog details
Strong article heading, real cover image, comfortable reading width and related articles.

### Contact
Contact details, map, business hours, accessible form and contact actions.

### Shop
Product photography, clear pricing, filters and practical shopping controls.

### Product details
Product imagery, description, availability, quantity and cart action.

## 9. Customer dashboard

The dashboard should feel like a continuation of the PAWELLE brand.

Include:
- Welcome section.
- Upcoming appointment.
- Pet profiles.
- Grooming history.
- Orders.
- Account settings.

Avoid turning the dashboard into an oversized collection of statistic cards. Use a clear navigation sidebar on desktop and a practical mobile navigation pattern.

## 10. Admin dashboard

Admin functionality may use denser layouts than the public website.

Include:
- Overview and analytics.
- Appointments.
- Customers.
- Pets.
- Services.
- Products.
- Orders.
- Messages.
- Reviews.
- Staff.
- Settings.

Use tables where they are more useful than cards. Provide search, filters, pagination, clear status labels and confirmation for destructive actions.

## 11. Buttons and interactions

Primary buttons:
- Forest-green background.
- Clear contrasting text.
- Consistent sizing.
- Simple hover and focus states.

Secondary buttons:
- Transparent or light background.
- Subtle border.
- Clear visual distinction.

Interaction rules:
- Short, purposeful transitions.
- Gentle image zoom where appropriate.
- Clear focus indicators.
- Proper loading states.
- Success and error feedback.
- No buttons that look functional but do nothing.

Respect reduced-motion settings.

## 12. Photography and creative assets

Strictly prohibited:
- AI-generated photos.
- AI-generated logos.
- AI-generated illustrations.
- AI-generated visual mockups used as final assets.

Allowed sources:
- Original business photography.
- Licensed photography libraries.
- Photographer portfolios with permission.
- Properly licensed design resources.

Possible photography libraries to investigate:
- Unsplash.
- Pexels.
- Adobe Stock.
- Shutterstock.
- iStock.

Do not assume every image on these services is free or unrestricted.

Maintain an asset register containing source, creator, licence, attribution requirements and local filename.

The logo must be a human-designed identity. Use a legitimate designer or conventional graphic-design tools.

## 13. Icons

Use an established icon library such as Lucide.

Rules:
- Consistent icon style.
- Consistent stroke weight.
- No random mixing of icon libraries.
- No emojis in place of functional interface icons.
- Icons must have accessible labels when necessary.

## 14. Responsive design

Test at:

320, 360, 390, 430, 768, 1024, 1366, 1440 and 1920 pixels.

Requirements:
- No horizontal overflow.
- Responsive navigation.
- Appropriate image crops.
- Readable text.
- Touch-friendly controls.
- Responsive forms and tables.
- Proper spacing at every breakpoint.
- No hover-only functionality.

## 15. Dark mode

Dark mode must be deliberately designed, not produced by automatically inverting colours.

Define:
- Dark background.
- Elevated surfaces.
- Text contrast.
- Border colours.
- Button states.
- Form states.
- Image treatment.

Preserve PAWELLE's brand identity in both themes.

## 16. RTL support

Support right-to-left layouts for languages that require them.

Test:
- Navigation.
- Text alignment.
- Forms.
- Icons and directional controls.
- Dashboards.
- Tables.
- Spacing and layout direction.

Do not simply right-align all content and call it RTL support.

## 17. Quality expectations

Before approval:
- Inspect every page.
- Check typography and alignment.
- Check image quality and cropping.
- Check section consistency.
- Test mobile and desktop.
- Test dark and light modes.
- Test RTL.
- Test keyboard accessibility.
- Check browser console.
- Verify all assets and licences.

**Final design principle: PAWELLE must feel like a real boutique pet-care brand with an original visual identity, thoughtful human design decisions and practical functionality.**