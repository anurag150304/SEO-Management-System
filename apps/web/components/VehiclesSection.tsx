"use client";

import type { VehicleItem } from "@/types/entity.types";
import { Users, ArrowRight, Image as ImageIcon } from "lucide-react";

interface VehiclesSectionProps {
  vehicles: VehicleItem[];
  onBookVehicle?: (vehicleTitle: string) => void;
}

export function VehiclesSection({
  vehicles,
  onBookVehicle,
}: VehiclesSectionProps) {
  if (!vehicles || vehicles.length === 0) {
    return null;
  }

  return (
    <section
      id="vehicles"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-100"
    >
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Available Fleet
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Sanitized, chauffeur-driven vehicles equipped with pushback seating
          and dual AC.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="relative h-48 bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-100">
                {vehicle.image ? (
                  <img
                    src={vehicle.image}
                    alt={vehicle.title}
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
                {vehicle.seatingCapacity && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs">
                    <Users className="w-3 h-3 text-cyan-400" />
                    <span>{vehicle.seatingCapacity} Seater</span>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-bold text-base text-slate-900">
                  {vehicle.title}
                </h3>

                {vehicle.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {vehicle.description}
                  </p>
                )}

                {Array.isArray(vehicle.features) &&
                  vehicle.features.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {vehicle.features.map((feature, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                        >
                          {String(feature)}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() =>
                  onBookVehicle ? onBookVehicle(vehicle.title) : undefined
                }
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Book This Vehicle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
