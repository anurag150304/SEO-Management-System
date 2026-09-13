"use client";

import type { HomepageContent } from "@/types/homepage.types";
import { ArrowRight, Sparkles, Image as ImageIcon } from "lucide-react";

interface HeroSectionProps {
  homepage: HomepageContent | null;
  onOpenBooking?: () => void;
}

export function HeroSection({ homepage, onOpenBooking }: HeroSectionProps) {
  const heading =
    homepage?.heroHeading || "Luxury Fleet & Vehicle Rentals";
  const subheading =
    homepage?.heroSubheading ||
    "Chauffeur-driven luxury tempo travellers, Force Urbania vans, and coaches for outstation trips and events.";
  const ctaText = homepage?.heroCtaText || "Explore Fleet";
  const ctaUrl = homepage?.heroCtaUrl || "#vehicles";
  const heroImage = homepage?.heroImage;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">

      <div className="rounded-3xl bg-linear-to-br from-blue-50/70 via-white to-sky-50/50 p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-sm border border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">

          <div className="lg:col-span-7 space-y-3.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold border border-blue-200/80">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Chauffeur-Driven Luxury Fleet</span>
            </div>

            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {heading}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
              {subheading}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {ctaUrl.startsWith("#") ? (
                <a
                  href={ctaUrl}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all hover:gap-3"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  onClick={onOpenBooking}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <a
                href="#vehicles"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 text-xs font-bold shadow-xs transition-colors"
              >
                View Lineup
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200/80 h-44 sm:h-52 md:h-56 lg:h-56 w-full bg-slate-100 flex items-center justify-center relative">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={heading}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4">
                  <ImageIcon className="w-10 h-10 opacity-40 text-slate-400" />
                  <span className="text-[11px] font-medium text-slate-400">
                    No Image Provided
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-64 h-64 rounded-full bg-cyan-400/10 blur-2xl pointer-events-none" />
      </div>
    </section>
  );
}
