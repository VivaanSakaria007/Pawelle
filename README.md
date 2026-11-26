# PAWELLE — Luxury Pet Grooming & Spa

A modern, premium pet grooming and spa management platform built to deliver a seamless experience for pet owners, grooming professionals, and administrators.

PAWELLE brings pet care services, appointment scheduling, pet profiles, product shopping, customer management, and business administration together in one application.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Available Commands](#available-commands)
- [Database Configuration](#database-configuration)
- [Application Architecture](#application-architecture)
- [Production Build](#production-build)
- [Deployment](#deployment)
- [Important Notes](#important-notes)

---

## Project Overview

**Project Name:** PAWELLE  
**Version:** 1.0.0  
**Application Type:** Full-stack pet grooming and e-commerce application  
**Frontend:** React + TypeScript  
**Build Tool:** Vite  
**Database Integration:** Supabase (optional configuration)

PAWELLE is designed as a premium digital platform for pet grooming and wellness businesses.

The application combines customer-facing shopping and booking experiences with administrative functionality for managing business operations.

---

## Features

### Customer Experience

- Customer registration and login.
- Customer account management.
- Pet profile creation and management.
- Grooming service discovery.
- Appointment scheduling.
- Booking availability checks.
- Shopping cart functionality.
- Product browsing and shopping.
- Checkout and order generation.
- Order management.

### Pet Management

- Multiple pet profiles.
- Pet information management.
- Pet-related appointment records.
- Grooming history and records.

### Grooming Services

- Service and category management.
- Grooming appointment scheduling.
- Service availability management.
- Appointment records and tracking.

### E-commerce

- Product catalogue.
- Shopping cart.
- Checkout workflow.
- Order generation.
- Inventory tracking.

### Administration

- Administrator access.
- Staff access.
- Customer management.
- Product and service management.
- Appointment management.
- Order management.
- Business settings.

*Feature availability and production readiness depend on the corresponding application implementation and backend configuration.*

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React 18 | User interface |
| TypeScript | Type safety |
| Vite 6 | Development and build tooling |
| React Router | Application routing |
| Lucide React | Icons |
| Supabase JS | Optional cloud database and authentication integration |
| Node.js | Runtime for the deployment startup process |
| Vitest | Testing |
| CSS | Application styling |

---

## Project Structure

```text
Pawelle/
│
├── public/
│   └── Static assets and public resources
│
├── src/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   └── Application source files
│
├── server/
│   ├── pawelleSyncPlugin.ts
│   └── start.mjs
│
├── supabase/
│   ├── migrations/
│   └── Database configuration and seed files
│
├── tests/
│
├── dist/
│   └── Production build output
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── render.yaml
├── netlify.toml
├── vercel.json
├── tsconfig.json
├── vite.config.ts
│
└── README.md
```

Some directories may contain additional files and subdirectories.

---

## Getting Started

### Prerequisites

Install the following:

- Node.js 18 or later.
- npm 9 or later.
- Git.
- A modern web browser.

### 1. Clone the Repository

```bash
git clone https://github.com/VivaanSakaria007/Pawelle.git
```

### 2. Open the Project

```bash
cd Pawelle
```

### 3. Install Dependencies

On Windows PowerShell:

```powershell
npm.cmd install
```

### 4. Start the Development Server

```powershell
npm.cmd run dev
```

Vite will display a local development URL, normally:

```text
http://localhost:5173/
```

Open that address in your browser.

Keep the terminal running while developing.

---

## Environment Configuration

Create a `.env` file in the project root.

Use `.env.example` as the reference.

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

VITE_APP_NAME=PAWELLE
VITE_APP_URL=http://localhost:5173
```

### Environment Variables

| Variable | Description |
|---|---|
| VITE_SUPABASE_URL | Supabase project URL |
| VITE_SUPABASE_ANON_KEY | Supabase publishable/anonymous client key |
| VITE_APP_NAME | Application name |
| VITE_APP_URL | Application URL |

Do not commit real environment secrets to GitHub.

Only public client-side Supabase keys intended for browser use should use the `VITE_` prefix. Never expose a Supabase service-role key or other privileged credentials in frontend environment variables.

---

## Available Commands

Run these commands from the project root.

| Command | Description |
|---|---|
| `npm.cmd install` | Install dependencies |
| `npm.cmd run dev` | Start development server |
| `npm.cmd run build` | Type-check and build application |
| `npm.cmd run preview` | Preview production build locally |
| `npm.cmd start` | Start configured production preview process |
| `npm.cmd run typecheck` | Run TypeScript checks |
| `npm.cmd test` | Run Vitest tests |

---

## Database Configuration

PAWELLE includes two database-related approaches.

### Local Persistent Store

The application includes a local state store that uses browser `localStorage`.

This supports local development and testing without requiring a configured Supabase project.

The local store is browser-specific. It should not be treated as a shared production database for multiple customers or devices.

### Supabase Cloud Database

Supabase can be configured for cloud database integration.

To configure it:

1. Create a project at [Supabase](https://supabase.com/).
2. Open the Supabase project dashboard.
3. Navigate to the SQL Editor.
4. Execute the database migrations in the following order:

```text
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_rls_policies.sql
```

5. Run the seed file if sample data is required:

```text
supabase/seed.sql
```

6. Copy the project's URL and appropriate public client key.
7. Add the values to your deployment environment variables.

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-client-key
```

**Important:** Installing the Supabase JavaScript package does not automatically create a Supabase project or migrate the application's existing local data. The application code, authentication flow, database schema, and security policies must all be configured and verified.

---

## Application Architecture

PAWELLE uses a React-based frontend and includes a Vite-based server synchronization plugin.

### Frontend

The frontend handles:

- User interface rendering.
- Navigation.
- Customer interactions.
- Shopping and booking workflows.
- Application state.

### Local State

The local store provides browser-based persistence for development and local operation.

### Synchronization

The application contains synchronization requests using the following API paths:

```text
/api/pawelle-sync/state
/api/pawelle-sync/action
```

It also includes an EventSource-based synchronization mechanism.

The actual production availability of these endpoints depends on how the Vite synchronization plugin is integrated into the production server.

### Production Data

For a multi-customer production environment, persistent shared storage and server-side data access are required.

Production authentication, authorization, database access, and customer data security must be verified before launch.

---

## Production Build

Create a production build:

```powershell
npm.cmd run build
```

Vite generates the production output inside:

```text
dist/
```

To preview the generated build locally:

```powershell
npm.cmd run preview
```

---

## Deployment

PAWELLE includes deployment configuration files for several hosting platforms.

### Render

The repository includes:

```text
render.yaml
```

The current configuration defines a Node.js web service with:

```yaml
buildCommand: npm install --include=dev && npm run build
startCommand: npm start
```

The startup script is:

```text
server/start.mjs
```

It launches Vite's production preview server.

Before production deployment, verify that the synchronization API endpoints are available in the production environment and that application data is stored persistently.

### Netlify

The repository includes:

```text
netlify.toml
```

### Vercel

The repository includes:

```text
vercel.json
```

Hosting configuration files do not by themselves guarantee that backend functionality, database persistence, or authentication is correctly configured.

---

## Important Notes

- Never commit `.env` files containing secrets.
- Do not expose privileged database credentials in frontend code.
- Browser `localStorage` is not a replacement for a shared cloud database.
- Verify database permissions and Row Level Security policies before production use.
- Test registration, login, bookings, checkout, orders, and administration after deployment.
- Verify that customer data remains available across browsers and devices.
- Keep dependencies updated and run tests before releasing changes.
- Back up production data regularly.

---

## Development Workflow

Recommended workflow for making and publishing changes:

```powershell
git status
git add .
git commit -m "Describe your changes"
git push origin main
```

Build the application before pushing important changes:

```powershell
npm.cmd run build
```

---

## Repository

**GitHub:**  
https://github.com/VivaanSakaria007/Pawelle

**Project:** PAWELLE  
**Version:** 1.0.0

---

*PAWELLE — Premium Care. Thoughtfully Delivered.*
