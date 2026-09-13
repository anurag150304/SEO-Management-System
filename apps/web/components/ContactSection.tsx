import type { ContactSettings } from "@/types/entity.types";
import { MapPin, Phone, Mail } from "lucide-react";

interface ContactSectionProps {
  contact: ContactSettings | null;
}

export function ContactSection({ contact }: ContactSectionProps) {
  if (
    !contact ||
    (!contact.phone && !contact.email && !contact.address && !contact.mapEmbed)
  ) {
    return null;
  }

  const phone = contact.phone;
  const email = contact.email;
  const address = contact.address;
  const mapEmbed = contact.mapEmbed;

  const getMapEmbedSrc = (raw?: string | null) => {
    if (!raw) return "";
    const match = raw.match(/src=["']([^"']+)["']/);
    return match ? match[1] : raw.startsWith("http") ? raw : "";
  };

  const mapSrc = getMapEmbedSrc(mapEmbed);

  return (
    <section
      id="contact"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-100"
    >
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Contact & Location
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Get in touch with our reservation dispatch team.
        </p>
      </div>

      <div
        className={`grid grid-cols-1 ${mapSrc ? "lg:grid-cols-12" : "max-w-2xl mx-auto"} gap-8 items-start`}
      >
        <div className={mapSrc ? "lg:col-span-5 space-y-4" : "space-y-4"}>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Phone
                </p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  {phone}
                </p>
              </div>
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Email
                </p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  {email}
                </p>
              </div>
            </a>
          )}

          {address && (
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Office Location
                </p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5 leading-relaxed">
                  {address}
                </p>
              </div>
            </div>
          )}
        </div>

        {mapSrc && (
          <div className="lg:col-span-7">
            <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs h-80 bg-slate-100">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location Map"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
