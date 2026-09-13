# SEO Management System

I built **UrbanFleet** as an end-to-end full-stack platform for a vehicle and tempo traveller rental business. It solves a common real-world problem: **giving non-technical administrators complete control over website search engine optimization (SEO), Google schema markups, and all homepage content without touching source code.**

Every change saved in the admin panel instantly reflects on the public website and inside Google search crawler head tags.

---

## What I Built

The project is structured as a TypeScript monorepo powered by **Turborepo** and **Bun**, split into three specialized applications:

1. **Backend REST API (`apps/server`):** Built with Express.js 5 and Drizzle ORM. Handles JWT authentication, single-admin role enforcement, atomic transaction-based reordering, Cloudinary image uploads, and an aggregated public endpoint.
2. **Admin Dashboard (`apps/dashboard`):** Built with Next.js 16, React 19, and Tailwind CSS. Features a Soft UI design, TanStack Query data synchronization, `@dnd-kit` drag-and-drop reordering, and animated bottom-right toast notifications.
3. **Public Consumer Website (`apps/web`):** Built with Next.js Server Components. Delivers instant dynamic Server-Side Rendering (SSR) with zero extra client bundle overhead, automated `<head>` metadata injection, and pre-formatted JSON-LD schema scripts.

---

## Core System Capabilities

- **Automated Head & SEO Engine:** Dynamically injects Meta Title, Meta Description, Focus Keywords, Canonical URL, and Robots directives (`index/noindex`, `follow/nofollow`).
- **Google JSON-LD Schema Generator:** Automatically generates and injects valid schema.org structured data for all 5 required schemas: **Organization**, **Local Business**, **FAQ**, **Breadcrumb**, and **Website**.
- **Social Media Previews:** Real-time generation of Open Graph (`og:*`) and Twitter Card (`twitter:*`) tags with social share banner uploads.
- **Pure Database-Driven Public Site:** The consumer website renders only real records saved in the database. Empty sections are omitted cleanly without displaying fake mock data.
- **Hardware-Accelerated Drag & Drop:** Administrators can drag cards and table rows using `@dnd-kit` to reorder fleet vehicles, travel occasions, testimonials, and gallery images.
- **Atomic Transaction Reordering:** When an item is moved or deleted, the backend runs a database transaction that shifts intermediate rows to guarantee consecutive `displayOrder` values with zero gaps or duplicates.
- **Role-Based Access Control (RBAC):** The first registered user is granted the `ADMIN` role; all subsequent accounts are auto-assigned `EDITOR`. Critical settings (schemas, delete operations, and robots directives) are protected and visible only to Admins.

---

## Technologies I Used

### Backend & Database

- **Runtime & Language:** Node.js, Bun, TypeScript
- **Framework:** Express.js 5
- **ORM & Database:** Drizzle ORM, PostgreSQL (`node-postgres`)
- **Authentication & Security:** JSON Web Tokens (JWT), HTTP-only cookies, bcrypt password hashing, token blacklisting table
- **Validation:** Zod v4 (shared across monorepo packages)
- **Media Storage:** Multer, Cloudinary SDK

### Frontend (Admin Dashboard)

- **Framework:** Next.js 16 (App Router), React 19
- **State & Data Fetching:** TanStack React Query v5 (automatic cache invalidation & optimistic updates)
- **HTTP Client:** Axios with custom `ApiError` mapping and automatic `FormData` header boundary resolution
- **Drag and Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/modifiers`, `@dnd-kit/utilities`
- **Design System:** Tailwind CSS v4, Plus Jakarta Sans typography, Soft UI aesthetic inspired by Creative Tim
- **Icons & UI:** Lucide React, animated bottom-right Toast notification system

### Frontend (Public Website)

- **Framework:** Next.js 16 (Server Components), React 19
- **Rendering Strategy:** Dynamic Server-Side Rendering (`cache: "no-store"`, `dynamic = "force-dynamic"`) for instant admin updates
- **Client Bundle Footprint:** Minimal — zero dependencies on Axios or TanStack Query, saving 50KB+ of JavaScript for faster Google Core Web Vitals
- **Design:** Tailwind CSS v4, light theme hero banner, responsive card grids, live Google Maps embed, interactive booking modal

### Monorepo & Tooling

- **Monorepo Engine:** Turborepo
- **Package Manager:** Bun (v1.4+)
- **Shared Packages:**
  - `@repo/zod-validations`: Single source of truth for all input schemas and TypeScript types
  - `@repo/db-config`: Shared Drizzle schema models, relations, and database client
  - `@repo/env-config`: Type-safe environment variable validation
  - `@repo/typescript-config`: Shared compiler configurations
  - `@repo/eslint-config`: Shared linting rules

---

## Monorepo Architecture

```
SEO Dashboard/
├── apps/
│   ├── server/           # Express 5 REST API (Port 8000)
│   ├── dashboard/        # Next.js Admin Dashboard (Port 3001)
│   └── web/              # Next.js Public Website (Port 3000)
├── packages/
│   ├── db-config/        # Drizzle ORM schema & database connection
│   ├── env-config/       # Zod-validated environment configurations
│   ├── zod-validations/  # Shared validation schemas & inferred types
│   ├── typescript-config/# Shared tsconfig bases
│   └── eslint-config/    # Shared linting configs
└── README.md             # Project overview
```

---

## Role-Based Permissions Summary

| Feature                                               |     ADMIN     |       EDITOR        |
| :---------------------------------------------------- | :-----------: | :-----------------: |
| **Console Branding**                                  | Admin Console |   Editor Console    |
| **Dashboard Overview Tab**                            |  Full Access  |       Hidden        |
| **JSON-LD Schema Markup Tab**                         |  Full Access  |       Hidden        |
| **Delete Items (Fleet, Occasions, Reviews, Gallery)** |    Allowed    |       Hidden        |
| **Robots Directives & Canonical URL**                 |   Editable    | Locked (Admin Only) |
| **Contact Information & Map Embed**                   |   Editable    |      View Only      |
| **Fleet & Content Management**                        |   Full CRUD   | Add, Edit, Reorder  |

---

## Getting Started

### 1. Prerequisites

- **Bun** (v1.4 or higher installed globally)
- **PostgreSQL Database** (local instance or cloud database such as Neon / Supabase)

### 2. Environment Configuration

Ensure your `.env` files are configured:

```env
# Root / Server (.env)
PORT=8000
NODE_ENV=development
BASE_PATH=/api/v1
BASE_URL=http://localhost:8000
DATABASE_URL=postgresql://user:password@localhost:5432/seo_dashboard
JWT_SECRET=your_secure_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# apps/dashboard/.env
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BASE_PATH=/api/v1/dashboard
NEXT_PUBLIC_WEB_URL=http://localhost:3000

# apps/web/.env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3. Install & Run

```bash
# Install all dependencies across the monorepo
bun install

# Run database migrations or push schema
cd packages/db-config
bun run drizzle-kit push

# Start all three applications concurrently (Server, Dashboard, Web)
cd ../..
bun run dev
```

### 4. Application Ports

- **Public Website:** `http://localhost:3000`
- **Admin Dashboard:** `http://localhost:3001`
- **Backend API:** `http://localhost:8000`
