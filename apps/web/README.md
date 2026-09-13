# Public Website — UrbanFleet Luxury Rentals

I built this public website using **Next.js 16**, **React 19**, and **Tailwind CSS**. It is the customer-facing frontend for **UrbanFleet**, a luxury vehicle and tempo traveller rental service. 

I designed it to be fast, clean, and fully optimized for search engines. Every piece of content, SEO meta tag, and structured data schema updates **instantly** whenever an admin makes a change in the dashboard.

---

## Project Architecture

I used Next.js **Server Components** and kept the folder structure clean and simple:

```
apps/web/
├── app/                  # Next.js App Router
│   ├── globals.css       # Tailwind CSS and global styles
│   ├── layout.tsx        # Root layout with dynamic SEO head and JSON-LD schemas
│   └── page.tsx          # Main homepage (Server Component fetching live data)
├── components/           # Reusable UI sections
│   ├── Header.tsx        # Clean navigation bar with hotline and booking button
│   ├── HeroSection.tsx   # Light theme banner with headline, CTA, and vehicle visual
│   ├── AboutSection.tsx  # About Us story with full-width panoramic banner
│   ├── VehiclesSection.tsx # Available fleet cards (with seating capacity and features)
│   ├── OccasionsSection.tsx # Travel packages (Weddings, Corporate, Outstation)
│   ├── TestimonialsSection.tsx # Verified customer reviews with 1–5 star ratings
│   ├── GallerySection.tsx # Fleet showcase photos with SEO alt text
│   ├── ContactSection.tsx # Phone, email, office address, and live Google Maps
│   ├── Footer.tsx        # Clean, light footer with links and copyright
│   ├── BookingModal.tsx  # Interactive pop-up for instant quotes and WhatsApp booking
│   └── ClientInteractiveWrapper.tsx # Client wrapper managing modal state smoothly
└── lib/
    └── api.ts            # Native fetch functions connecting to backend public API
```

---

## Architectural Decisions I Made

### 1. Zero Extra Dependencies (No Axios or TanStack Query)
- I decided **not** to use Axios or TanStack Query in `apps/web`.
- Because this is a public marketing website, using native Next.js Server Components with native `fetch()` saves over **50KB of JavaScript bundle size**.
- This makes the website load faster, improving the **Google Core Web Vitals** SEO ranking score.

### 2. Instant Updates with Server-Side Rendering (SSR)
- In `layout.tsx` and `page.tsx`, I set:
  ```ts
  export const dynamic = "force-dynamic";
  export const revalidate = 0;
  ```
- All data is fetched with `cache: "no-store"`.
- This means every time a user or Googlebot visits or refreshes the page, Next.js server-renders the HTML with the freshest database records. Admin updates appear **instantly with zero delay**.

### 3. Single Network Roundtrip (`/public/homepage`)
- Instead of making 8 separate HTTP calls to load each section, I designed the backend endpoint `GET /api/v1/public/homepage`.
- The website fetches the entire homepage (Hero, Vehicles, Occasions, Testimonials, Gallery, Contact, SEO, and Schemas) in **one single fast request**.

---

## Dynamic SEO & Schema Engine

I built the `<head>` section in `apps/web/app/layout.tsx` to handle all search engine requirements automatically:

### 1. Dynamic Meta Tags (`generateMetadata`)
- **Meta Title & Description:** Fetched from database and inserted into `<title>` and `<meta name="description">`.
- **Focus Keywords:** Mapped to `<meta name="keywords">`.
- **Canonical URL:** Injected into `<link rel="canonical">` to prevent duplicate content issues.
- **Robots Directives:** Automatically sets `index/noindex` and `follow/nofollow` based on admin settings.
- **Social Sharing (Open Graph & Twitter):** Sets `og:title`, `og:description`, `og:image`, and Twitter card tags so links look rich when shared on WhatsApp, Facebook, or Twitter.

### 2. Automatic JSON-LD Schema Injection
Inside `layout.tsx`, all active schemas created in the dashboard are injected directly as `<script type="application/ld+json">`:
- **Organization Schema:** Company logo, website URL, and customer support number.
- **Local Business Schema:** Physical office address, price range, and opening hours for local Google Maps ranking.
- **FAQ Schema:** Question and answer pairs eligible for rich expandable snippets in Google search results.
- **Breadcrumb Schema:** Website hierarchy displayed in search results.
- **Website Schema:** Enables Google Sitelinks Search Box.

---

## Pure Database-Driven UI (No Fake Mock Data)

I followed a strict rule: **Never show hardcoded fake data if the database is empty.**
- **Vehicles:** If no vehicles are added in the dashboard yet, the section is not displayed.
- **Occasions, Reviews, Gallery:** Only appear when real records exist in the database.
- **About Us & Contact:** Only render if content is provided. Google Maps embed only renders if a valid embed code is saved.
- **Image Fallbacks:** When an item exists in the database but the admin did not upload an image, I show a clean, soft grey placeholder box with an image icon so the card layout stays aligned.

---

## Sections I Built

1. **Header (`Header.tsx`):**
   - Brand logo (`UrbanFleet`), clean navigation links, direct phone link, and "Book Now" button.
   - Mobile responsive drawer menu for small screens.

2. **Hero Banner (`HeroSection.tsx`):**
   - Light theme background card with headline, subheading, and CTA button.
   - Proportional vehicle image container that fits naturally without taking over the screen.

3. **About Us Section (`AboutSection.tsx`):**
   - Positioned right below the banner.
   - Features a wide, full-width panoramic image banner with the company story above it.

4. **Available Fleet (`VehiclesSection.tsx`):**
   - Card grid displaying vehicle name, seating capacity badge, luxury features (`AC`, `Pushback Seats`), description, and a "Book This Vehicle" button.

5. **Travel Occasions (`OccasionsSection.tsx`):**
   - Cards for Weddings, Corporate Trips, Outstation Holidays, and Airport Transfers.

6. **Client Feedback (`TestimonialsSection.tsx`):**
   - Real reviews with 1–5 star rating stars, customer avatar, and verified booking badge.

7. **Fleet Gallery (`GallerySection.tsx`):**
   - Photo showcase grid with SEO-friendly alt text for Google Image Search.

8. **Contact & Location (`ContactSection.tsx`):**
   - Booking phone, email, office location, and a live interactive Google Maps embed.

9. **Interactive Booking Modal (`BookingModal.tsx`):**
   - Popup dialog where visitors can choose their fleet, enter travel dates, and connect directly with the booking team via phone or WhatsApp.

10. **Footer (`Footer.tsx`):**
    - Clean, light footer with brand summary, section links, and copyright.

---

## How to Run the Website

```bash
# Install dependencies (from project root)
bun install

# Start the public website development server (runs on port 3000)
cd apps/web
bun run dev

# Check TypeScript types
bun run check-types
```
