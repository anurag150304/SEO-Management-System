# Admin Dashboard — SEO & Content Management

I built this admin dashboard using **Next.js 16**, **React 19**, and **Tailwind CSS**. It gives administrators and editors a clean interface to manage website SEO settings, Google schema markups, and all homepage content without touching any source code.

---

## Project Structure & Architecture

I organized the dashboard codebase into clean, modular folders:

```
apps/dashboard/
├── app/                  # Next.js App Router pages
│   ├── (auth)/           # Sign In and Sign Up pages
│   ├── globals.css       # Soft UI colors, gradients, and toast animations
│   ├── layout.tsx        # Root layout with Plus Jakarta Sans and Providers
│   └── page.tsx          # Main dashboard with authentication protection
├── components/           # Reusable UI components
│   ├── Navbar.tsx        # Top header with profile modal and sign out button
│   ├── Sidebar.tsx       # Floating sidebar navigation
│   └── tabs/             # Management panels for each section
│       ├── OverviewTab.tsx     # Stats cards and system overview
│       ├── SeoTab.tsx          # Meta tags, robots directives, and Google preview
│       ├── SchemasTab.tsx      # JSON-LD schema builder with live code output
│       ├── HomepageTab.tsx     # Hero banner and About Us editor
│       ├── VehiclesTab.tsx     # Fleet CRUD with drag-and-drop reordering
│       ├── OccasionsTab.tsx    # Event categories with drag-and-drop
│       ├── TestimonialsTab.tsx # Customer reviews with 1–5 star rating picker
│       ├── GalleryTab.tsx      # Fleet photo gallery with required SEO alt tags
│       └── ContactTab.tsx      # Phone, email, address, and live Google Maps
├── hooks/                # TanStack React Query hooks for fetching and mutations
├── lib/                  # Axios instance, API client functions, and cn utility
├── providers/            # React QueryProvider and ToastProvider
└── types/                # TypeScript response and data types
```

---

## Design & UI Theme

I designed the interface inspired by the **Soft UI Dashboard** theme:

- **Colors:** Clean white cards (`bg-white rounded-2xl shadow-sm`) on a soft background (`#f8f9fa`).
- **Gradients:** Vibrant blue-to-cyan, emerald, and purple accent gradients for icon boxes and active buttons.
- **Font:** I configured **Plus Jakarta Sans** as the global font for modern, clean readability.
- **Responsive Layout:** The sidebar turns into a slide-in drawer on mobile with an overlay backdrop, and modals adjust to fit small screens without cutting off buttons.

---

## How I Handled API Calls & Data

1. **Custom Axios Client (`lib/api/client.ts`):**
   - I set up `withCredentials: true` so authentication cookies are sent automatically.
   - I added a request interceptor that automatically deletes `Content-Type: application/json` when sending `FormData`, so browser file uploads set the correct boundary header.
   - I created an `ApiError` class that converts backend Zod validation errors, 404s, and Multer file upload errors into user-friendly messages.

2. **TanStack React Query (`hooks/`):**
   - I used TanStack Query for all API requests.
   - Every mutation (`POST`, `PUT`, `DELETE`, `reorder`) automatically refreshes the cached data (`invalidateQueries`) so the UI updates instantly without reloading the page.

3. **Bottom-Right Toast Notifications (`providers/toastProvider.tsx`):**
   - I created an animated toast notification system that pops up from the bottom-right.
   - Whenever an API request succeeds or fails, it shows a clear success or error message.

---

## Role-Based Access Control (Admin vs. Editor)

I implemented two distinct roles to keep data safe:

| Feature                                   |       Admin       |       Editor       | Why I Did This                                                            |
| :---------------------------------------- | :---------------: | :----------------: | :------------------------------------------------------------------------ |
| **Top Title**                             | `"Admin Console"` | `"Editor Console"` | Shows the user their current access level                                 |
| **Overview Tab**                          |    Full Access    |       Hidden       | Editors land directly on content editing                                  |
| **Schema Markup Tab**                     |    Full Access    |       Hidden       | Raw JSON-LD editing is reserved for Admin                                 |
| **Delete Items**                          |      Allowed      |       Hidden       | Red delete buttons are hidden for Editors to prevent accidental data loss |
| **Robots & Canonical URL**                |     Editable      |       Locked       | Prevents editors from accidentally de-indexing the site on Google         |
| **Contact Information**                   |     Editable      |     View Only      | Contact phone, email, and map are locked for Editors                      |
| **Vehicles, Occasions, Reviews, Gallery** |    Full Access    | Add, Edit, Reorder | Editors can manage daily fleet listings freely                            |

---

## Features I Built

1. **Dashboard Authentication:**
   - Sign In and Sign Up pages.
   - The dashboard checks if the user is logged in. If not, it redirects them to `/signin`.
   - The first user to register becomes the **ADMIN**. All subsequent accounts are automatically assigned **EDITOR**.

2. **SEO Settings Manager:**
   - Form fields for Meta Title (with character counter up to 60) and Meta Description (up to 160).
   - Focus keywords tag input, Canonical URL, and Robots Index/Follow directives.
   - Open Graph and Twitter Card social preview images.
   - **Live Google Search Preview:** Shows how the page will look in real Google search results.

3. **JSON-LD Schema Builder:**
   - Dedicated editors for all 5 supported schema types: **Organization**, **Local Business**, **FAQ**, **Breadcrumb**, and **Website**.
   - Validates JSON format and displays a **Live `<script type="application/ld+json">` output box** with a one-click copy button.

4. **Drag-and-Drop Reordering:**
   - I added `@dnd-kit` to **Vehicles**, **Occasions**, **Testimonials**, and **Gallery**.
   - Users can drag cards or table rows using a grip handle to change their order on the live website.
   - Dropping an item triggers an atomic backend transaction to update `displayOrder` with no duplicate numbers or gaps.

5. **Homepage Content & Contact Info:**
   - Edit Hero headline, sub-headline, CTA buttons, and banner image.
   - Edit About Us text and full-width image.
   - Update office address, phone, email, and Google Maps embed code with a live map preview.
