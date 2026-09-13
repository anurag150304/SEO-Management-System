"use client";

import type { OccasionItem } from "@/types/entity.types";
import { ArrowRight, Image as ImageIcon } from "lucide-react";

interface OccasionsSectionProps {
  occasions: OccasionItem[];
  onBookOccasion?: (title: string) => void;
}

export function OccasionsSection({
  occasions,
  onBookOccasion,
}: OccasionsSectionProps) {
  if (!occasions || occasions.length === 0) {
    return null;
  }

  return (
    <section
      id="occasions"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-100"
    >
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Travel Occasions
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Specialized transport packages tailored for events, tours, and
          transfers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {occasions.map((occ) => (
          <div
            key={occ.id}
            className="rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-100">
                {occ.image ? (
                  <img
                    src={occ.image}
                    alt={occ.title}
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

              <div className="p-5 space-y-2">
                <h3 className="font-bold text-base text-slate-900">
                  {occ.title}
                </h3>
                {occ.description && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {occ.description}
                  </p>
                )}
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() =>
                  onBookOccasion ? onBookOccasion(occ.title) : undefined
                }
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Plan This Occasion</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
