# PAWELLE — Setup, Configuration and Deployment Guide

## 1. Prerequisites
- Node.js (v18+ recommended; tested with v26.13.1)
- npm (v9+ recommended; tested with v11.20.0)
- Modern web browser (Chrome, Edge, Safari, Firefox)

## 2. Local Installation and Development

```bash
# In the project root
npm.cmd install

# Start the development server
npm.cmd run dev
```

The application will run on `http://localhost:5173`.

## 3. Environment Variables

Create a `.env` file in the root based on `.env.example`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_APP_NAME=PAWELLE
VITE_APP_URL=http://localhost:5173
```

### Development Resilience & Zero-Config Mode
When `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are not provided, PAWELLE automatically activates its built-in local persistent state store. This allows:
- Full offline testing and preview
- Customer registration and login
- Staff & Administrator access switching
- Multi-pet profile creation
- Real booking availability checks & appointment scheduling
- Full ecommerce cart, checkout, order generation, and inventory tracking
- Zero fake mock banners or broken mock buttons

## 4. Production Build

```bash
npm.cmd run build
npm.cmd run preview
```

## 5. Supabase Database Deployment

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Go to SQL Editor in the Supabase dashboard.
3. Run the migrations in `supabase/migrations/001_initial_schema.sql` and `supabase/migrations/002_rls_policies.sql`.
4. Run `supabase/seed.sql` to populate sample categories, services, products, and default settings.
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your production deployment settings (e.g. Vercel / Netlify).
