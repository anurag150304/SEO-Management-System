import type { HomepageContent } from "@/types/homepage.types";
import { Image as ImageIcon } from "lucide-react";

interface AboutSectionProps {
  homepage: HomepageContent | null;
}

export function AboutSection({ homepage }: AboutSectionProps) {
  if (
    !homepage?.aboutTitle &&
    !homepage?.aboutDescription &&
    !homepage?.aboutImage
  ) {
    return null;
  }

  const title = homepage?.aboutTitle;
  const description = homepage?.aboutDescription;
  const image = homepage?.aboutImage;

  return (
    <section
      id="about"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8"
    >
      <div className="max-w-3xl space-y-3">
        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full inline-block">
          About Our Company
        </span>

        {title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {title}
          </h2>
        )}

        {description && (
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        )}
      </div>

      <div className="w-full h-56 sm:h-72 md:h-80 lg:h-96 rounded-3xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-100 relative flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={title || "About Us"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-6">
            <ImageIcon className="w-12 h-12 opacity-40 text-slate-400" />
            <span className="text-xs font-medium text-slate-400">
              Featured Image
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
