import type { TestimonialItem } from "@/types/entity.types";
import { Star } from "lucide-react";

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-100"
    >
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Client Feedback
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Verified reviews from corporate teams, families, and wedding groups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${star <= t.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-200"
                      }`}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-600 italic leading-relaxed">
                &quot;{t.review}&quot;
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-3">
              {t.image ? (
                <img
                  src={t.image}
                  alt={t.customerName}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                  {t.customerName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {t.customerName}
                </h4>
                <p className="text-[10px] text-slate-400">Verified Booking</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
