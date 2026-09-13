"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Calendar, Menu, X } from "lucide-react";
import type { ContactSettings } from "@/types/entity.types";

interface HeaderProps {
  contact: ContactSettings | null;
  onOpenBooking?: () => void;
}

export function Header({ contact, onOpenBooking }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Vehicles", href: "#vehicles" },
    { label: "Occasions", href: "#occasions" },
    { label: "About Us", href: "#about" },
    { label: "Reviews", href: "#testimonials" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-xs">
            U
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">
            UrbanFleet
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="hover:text-blue-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {contact?.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>{contact.phone}</span>
            </a>
          )}

          <button
            onClick={onOpenBooking}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Now</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-2">
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {link.label}
            </a>
          ))}
          {contact?.phone && (
            <div className="pt-2 border-t border-slate-100">
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {contact.phone}</span>
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
