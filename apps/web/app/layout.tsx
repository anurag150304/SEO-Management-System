import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getPublicSeo } from "@/lib/api";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

// Forcing dynamic SSR so that dashboard changes reflect immediately.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getPublicSeo();
  const seo = seoData?.seo;

  const defaultTitle =
    "Luxury Tempo Traveller & Vehicle Rentals | Best Outstation & Wedding Fleet";
  const defaultDesc =
    "Premium chauffeur-driven 9 to 26 seater Tempo Travellers, Force Urbania, and luxury Volvo buses. Ideal for corporate trips, outstation tours, and wedding transportation.";

  const title = seo?.metaTitle || defaultTitle;
  const description = seo?.metaDescription || defaultDesc;
  const canonical = seo?.canonicalUrl || undefined;

  let keywords: string[] | undefined;
  if (Array.isArray(seo?.focusKeywords)) {
    keywords = seo.focusKeywords;
  } else if (typeof seo?.focusKeywords === "string") {
    keywords = (seo.focusKeywords as string)
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
  }

  const robotsIndex = seo?.robotsIndex !== false;
  const robotsFollow = seo?.robotsFollow !== false;

  return {
    title,
    description,
    keywords,
    alternates: canonical ? { canonical } : undefined,
    robots: {
      index: robotsIndex,
      follow: robotsFollow,
      googleBot: {
        index: robotsIndex,
        follow: robotsFollow,
      },
    },
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url: canonical,
      siteName: "UrbanFleet",
      images: seo?.ogImage
        ? [
          {
            url: seo.ogImage,
            width: 1200,
            height: 630,
            alt: seo.ogTitle || title,
          },
        ]
        : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitterTitle || title,
      description: seo?.twitterDescription || description,
      images: seo?.twitterImage ? [seo.twitterImage] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seoData = await getPublicSeo();
  const jsonLd = seoData?.jsonLd || [];

  return (
    <html lang="en" className={`${jakarta.variable} scroll-smooth antialiased`}>
      <head>
        {/* Injecting JSON-LD Schema into head */}
        {jsonLd.map((schema, index) => (
          <script
            key={`schema-${index}-${schema["@type"] || index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema),
            }}
          />
        ))}
      </head>
      <body className="font-sans min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}
