import type { GalleryItem } from "@/types/entity.types";
import { Image as ImageIcon } from "lucide-react";

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export function GallerySection({ gallery }: GallerySectionProps) {
  if (!gallery || gallery.length === 0) {
    return null;
  }

  return (
    <section
      id="gallery"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-100"
    >
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Fleet Gallery
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Real fleet exterior and interior showcase photos.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
          >
            <div className="relative h-44 bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-100">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-1 p-4">
                  <ImageIcon className="w-8 h-8 opacity-40 text-slate-400" />
                  <span className="text-[10px] font-medium text-slate-400">
                    No Image
                  </span>
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-[11px] font-medium text-slate-600 line-clamp-1">
                {item.altText}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
