# Server API — SEO & Fleet Management Backend

I designed and built this backend service as a robust, production-ready REST API powering both the **Admin Dashboard** and the **Public Website**. It handles dynamic SEO metadata injection, JSON-LD structured data generation, role-based access control, and full homepage content management without requiring code changes.

---

## Architecture & Design Decisions

I structured the server using a clean **Controller–Service** Model View Controller (MVC) architecture:

```
apps/server/src/
├── controllers/          # HTTP request parsing, Zod safeParsing, and response formatting
├── services/             # Core business logic and Drizzle ORM database operations
├── routes/               # Express route definitions (split into /dashboard and /public)
├── middlewares/          # JWT authentication, role guards (ADMIN/EDITOR), and Multer upload
├── utils/                # Transaction-based displayOrder reordering and token blacklist utilities
├── app.ts                # Express app setup, CORS, error handling, and route mounting
└── server.ts             # HTTP server entrypoint
```

### Key Decisions I Made:

1. **Services as the Single Source of Truth:** I decided to consolidate database queries directly inside the service layer using Drizzle ORM, eliminating redundant repository boilerplate while keeping controllers lean.
2. **Dedicated Validations Package:** I moved all Zod validation schemas into `@repo/zod-validations` so that backend controllers and frontend forms share the exact same types.
3. **Partitioned Routes (`/dashboard` vs `/public`):**
   - `${basePath}/dashboard/*`: Authenticated, role-protected endpoints for the admin panel.
   - `${basePath}/public/*`: Open, high-speed endpoints optimized for Next.js Server-Side Rendering (SSR).

---

## Core Features I Implemented

### 1. Authentication & Role-Based Access Control (RBAC)

- **JWT & Token Blacklisting:** I implemented stateless authentication using JWT stored in HTTP-only cookies and Bearer headers. On logout, tokens are persisted to a `blacklisted_tokens` table.
- **Single Admin Rule:** I enforced logic where the first registered user receives the `ADMIN` role. Once an admin exists, all subsequent registrations are automatically assigned `EDITOR`.
- **Role Middleware (`requireRole`):** I added middleware to restrict critical actions (such as deletion and directive editing) strictly to `ADMIN`.
- **Security Hardening:** I ensured hashed passwords are never exposed in JWT payloads, and compared passwords using `await bcrypt.compare()` to prevent auth bypass vulnerabilities.

### 2. Transactional Display Order Management (`DisplayOrderUtil`)

To ensure smooth reordering of fleet vehicles, travel occasions, testimonials, and gallery images without duplicate positions or gaps, I built an atomic transaction algorithm using Drizzle ORM:

- **Moving Down (`newOrder > currentOrder`):** Shifts intermediate rows `(currentOrder, newOrder]` up by `-1`, then sets the target to `newOrder`.
- **Moving Up (`newOrder < currentOrder`):** Shifts intermediate rows `[newOrder, currentOrder)` down by `+1`, then sets the target to `newOrder`.
- **Automatic Assignment on Create:** When a new item is created, the backend automatically calculates `maxDisplayOrder + 1` and appends it to the end.
- **Gap Compaction on Delete:** When an item is deleted, subsequent rows are shifted up by `-1` within the transaction to prevent index gaps.

### 3. SEO Metadata & Dynamic Head Section

- I implemented full CRU management for Meta Title, Meta Description, Focus Keywords, Canonical URL, and Robots Directives (`index/noindex`, `follow/nofollow`).
- Open Graph (`og:*`) and Twitter Card (`twitter:*`) titles, descriptions, and banner images are managed dynamically.

### 4. Dynamic Schema Management (JSON-LD)

- I built support for all 5 required schema types: **Organization**, **Local Business**, **FAQ**, **Breadcrumb**, and **Website**.
- Implemented `SchemaService.formatToJsonLd()` to automatically format raw database JSON into valid schema.org markup ready for `<head>` injection.
- Endpoints use `schemaType` as their natural key (`GET/PUT/DELETE /schemas/:schemaType`).

### 5. Media Upload Management

- Integrated `multer` memory storage with Cloudinary (`uploadToCloudinary()`).
- Endpoints accept both multipart file uploads and raw image URLs seamlessly.

### 6. Public Aggregated Endpoint (`/public/homepage`)

- To avoid network waterfalls on the public website, I built `GET /api/v1/public/homepage`. In **one single database query**, it gathers SEO metadata, pre-formatted JSON-LD scripts, hero banner, vehicles, occasions, testimonials, gallery, and contact information.
- I wrapped queries in safe fetch handlers so unconfigured sections gracefully return `null` without crashing the public site.

---

## API Endpoints

### Public Endpoints (`/api/v1/public`)

| Method | Route                  | Description                                         |
| :----- | :--------------------- | :-------------------------------------------------- |
| `GET`  | `/public/homepage`     | Aggregated payload for public Next.js homepage      |
| `GET`  | `/public/seo`          | SEO tags + JSON-LD for Next.js `generateMetadata()` |
| `GET`  | `/public/vehicles`     | List all active vehicles                            |
| `GET`  | `/public/occasions`    | List all travel occasions                           |
| `GET`  | `/public/testimonials` | List all verified reviews                           |
| `GET`  | `/public/gallery`      | List all gallery photos with SEO alt text           |
| `GET`  | `/public/contact`      | Office details & Google Maps embed code             |

### Dashboard Endpoints (`/api/v1/dashboard`)

| Module        | Methods                        | Routes                                                                         | Access                |
| :------------ | :----------------------------- | :----------------------------------------------------------------------------- | :-------------------- |
| **Auth**      | `POST`, `GET`                  | `/auth/signup`, `/auth/signin`, `/auth/me`, `/auth/signout`, `/auth/has-admin` | Public / Auth         |
| **SEO**       | `GET`, `POST`, `PUT`           | `/seo`, `/seo/create`, `/seo/update`, `/seo/:id`                               | Auth                  |
| **Schemas**   | `GET`, `POST`, `PUT`, `DELETE` | `/schemas`, `/schemas/:schemaType`                                             | Auth (`DELETE` Admin) |
| **Homepage**  | `GET`, `POST`, `PUT`           | `/homepage`, `/homepage/:id`                                                   | Auth                  |
| **Vehicles**  | `GET`, `POST`, `PUT`, `DELETE` | `/vehicles`, `/vehicles/:id`, `/vehicles/:id/reorder`, `/vehicles/reorder`     | Auth (`DELETE` Admin) |
| **Occasions** | `GET`, `POST`, `PUT`, `DELETE` | `/occasions`, `/occasions/:id`, `/occasions/:id/reorder`, `/occasions/reorder` | Auth (`DELETE` Admin) |
| **Reviews**   | `GET`, `POST`, `PUT`, `DELETE` | `/testimonials`, `/testimonials/:id`, `/testimonials/reorder`                  | Auth (`DELETE` Admin) |
| **Gallery**   | `GET`, `POST`, `PUT`, `DELETE` | `/gallery`, `/gallery/:id`, `/gallery/reorder`                                 | Auth (`DELETE` Admin) |
| **Contact**   | `GET`, `POST`, `PUT`           | `/contact`, `/contact/:id`                                                     | Auth (Admin update)   |

---

## Docker Deployment (for Render)

Created a `Dockerfile` specifically for optimized deploying to **Render** using Docker.

### Why I Used `turbo prune --docker` (The Reasons):

1. **Workspace Dependency Isolation:** In this monorepo, the `server` needs shared internal packages (`@repo/db-config`, `@repo/zod-validations`, `@repo/env-config`), but it does **not** need the frontend applications (`apps/dashboard` or `apps/web`). `turbo prune server --docker` extracts only the server and its exact required dependencies, avoiding copying unnecessary frontend code into the container.
2. **Fast Docker Layer Caching:** `turbo prune` splits the monorepo into:
   - `out/json/`: Package manifests and lockfile only.
   - `out/full/`: Full application and package source code.
     By running `bun install` on `out/json/` before copying the source code, Docker caches the installed dependencies. Subsequent builds and code changes on Render skip the install step, cutting deployment time from minutes to seconds.
3. **Minimal Production Footprint:** I used `oven/bun:1-alpine` as the base image. It produces a lightweight production container (~100MB) with fast cold-start times and low memory consumption on Render.
