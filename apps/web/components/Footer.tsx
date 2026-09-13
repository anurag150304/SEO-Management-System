import type { ContactSettings } from "@/types/entity.types";
import Link from "next/link";

interface FooterProps {
  contact: ContactSettings | null;
}

export function Footer({ contact }: FooterProps) {
  const phone = contact?.phone;

  return (
    <footer className="bg-white text-slate-600 py-12 border-t border-slate-200 text-xs mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              U
            </div>
            <span className="font-bold text-base text-slate-900">UrbanFleet</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Premium luxury tempo travellers, Force Urbania vans, and coaches.
          </p>
        </div>

        <div className="flex items-center gap-6 text-[11px] font-semibold text-slate-600">
          <a href="#about" className="hover:text-blue-600 transition-colors">
            About
          </a>
          <a href="#vehicles" className="hover:text-blue-600 transition-colors">
            Vehicles
          </a>
          <a href="#occasions" className="hover:text-blue-600 transition-colors">
            Occasions
          </a>
          <a href="#testimonials" className="hover:text-blue-600 transition-colors">
            Reviews
          </a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">
            Contact
          </a>
          {phone && (
            <a href={`tel:${phone}`} className="text-blue-600 font-bold hover:underline">
              {phone}
            </a>
          )}
        </div>

        <p className="text-[11px] text-slate-400">
          &copy; {new Date().getFullYear()} UrbanFleet. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
