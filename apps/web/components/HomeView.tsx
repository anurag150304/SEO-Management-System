"use client";

import { useState } from "react";
import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { VehiclesSection } from "./VehiclesSection";
import { OccasionsSection } from "./OccasionsSection";
import { AboutSection } from "./AboutSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { GallerySection } from "./GallerySection";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";
import { BookingModal } from "./BookingModal";
import type { PublicHomepageData } from "@/types/homepage.types";

interface HomeViewProps {
  data: PublicHomepageData | null;
}

export function HomeView({
  data,
}: HomeViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>(
    undefined,
  );

  const handleOpenBooking = (vehicleTitle?: string) => {
    setSelectedVehicle(vehicleTitle);
    setIsModalOpen(true);
  };

  const contact = data?.contact || null;
  const homepage = data?.homepage || null;
  const vehicles = data?.vehicles || [];
  const occasions = data?.occasions || [];
  const testimonials = data?.testimonials || [];
  const gallery = data?.gallery || [];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
      <Header contact={contact} onOpenBooking={() => handleOpenBooking()} />

      <main className="flex-1">
        <HeroSection
          homepage={homepage}
          onOpenBooking={() => handleOpenBooking()}
        />

        <AboutSection homepage={homepage} />

        <VehiclesSection
          vehicles={vehicles}
          onBookVehicle={(title) => handleOpenBooking(title)}
        />

        <OccasionsSection
          occasions={occasions}
          onBookOccasion={(title) => handleOpenBooking(title)}
        />

        <TestimonialsSection testimonials={testimonials} />

        <GallerySection gallery={gallery} />

        <ContactSection contact={contact} />
      </main>

      <Footer contact={contact} />

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedVehicle={selectedVehicle}
        phoneNumber={contact?.phone || ""}
      />
    </div>
  );
}
