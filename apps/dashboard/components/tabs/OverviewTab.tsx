"use client";

import {
  Truck,
  Code2,
  Star,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  Globe,
  Sliders,
  ExternalLink,
} from "lucide-react";
import {
  useVehicles,
  useSchemas,
  useTestimonials,
  useGallery,
  useSeo,
  useHomepage,
} from "@/hooks";

interface OverviewTabProps {
  onNavigate: (tab: string) => void;
}

export function OverviewTab({ onNavigate }: OverviewTabProps) {
  const publicWebUrl =
    process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";

  const { data: vehiclesData } = useVehicles();
  const { data: schemasData } = useSchemas();
  const { data: testimonialsData } = useTestimonials();
  const { data: galleryData } = useGallery();
  const { data: seoData } = useSeo();
  const { data: homepageData } = useHomepage();

  const vehicles = vehiclesData?.vehicles || [];
  const schemas = schemasData?.schemas || [];
  const testimonials = testimonialsData?.testimonials || [];
  const gallery = galleryData?.gallery || [];
  const seo = seoData?.seo;
  const homepage = homepageData?.homepage;

  const statCards = [
    {
      title: "Fleet Vehicles",
      value: vehicles.length.toString(),
      trend: "+100% active",
      trendType: "positive",
      icon: Truck,
      gradient: "from-blue-600 to-cyan-400",
      tab: "vehicles",
    },
    {
      title: "Active Schemas",
      value: `${schemas.length} / 5`,
      trend: "JSON-LD Valid",
      trendType: "positive",
      icon: Code2,
      gradient: "from-emerald-500 to-teal-400",
      tab: "schemas",
    },
    {
      title: "Client Reviews",
      value: testimonials.length.toString(),
      trend: "5.0 Avg Rating",
      trendType: "positive",
      icon: Star,
      gradient: "from-amber-500 to-orange-400",
      tab: "testimonials",
    },
    {
      title: "Media Gallery",
      value: gallery.length.toString(),
      trend: "SEO Alt-Tagged",
      trendType: "positive",
      icon: ImageIcon,
      gradient: "from-sky-500 to-blue-600",
      tab: "gallery",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(stat.tab)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
            >
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-xl font-bold text-slate-800">
                    {stat.value}
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-500">
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-xl bg-linear-to-tl ${stat.gradient} flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden">
          <div className="z-10 max-w-lg">
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg uppercase tracking-wider inline-block">
              Control Hub
            </span>
            <h2 className="text-xl font-bold text-slate-800 mt-2 mb-2">
              Centralized SEO & Content Management
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Dynamically manage search engine metadata, structured JSON-LD
              schemas, and all live homepage sections in real time without
              modifying source code.
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-[11px] font-semibold text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Instant Head Tag Injection</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-[11px] font-semibold text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                <span>JSON-LD Schemas</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-[11px] font-semibold text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
                <span>Live Content Sync</span>
              </span>
            </div>
          </div>

          <div className="absolute right-4 bottom-4 w-44 h-44 opacity-20 pointer-events-none hidden sm:block">
            <div className="w-full h-full rounded-full bg-linear-to-tr from-cyan-400 to-blue-600 blur-2xl" />
          </div>
        </div>

        <div className="lg:col-span-5 relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-3">
              <Globe className="w-3 h-3" />
              <span>Live Public Web</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {homepage?.heroHeading || "Luxury Fleet Homepage"}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
              {homepage?.heroSubheading ||
                "Fully dynamic sections rendering live from admin configuration."}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 z-10">
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>SEO Tags Injected</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate("homepage")}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Edit
              </button>
              <a
                href={publicWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-linear-to-tl from-blue-600 to-cyan-400 text-white text-xs font-bold shadow-sm shadow-blue-500/20 hover:opacity-95 transition-opacity cursor-pointer"
              >
                <span>View Web</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-linear-to-tl from-cyan-400/10 to-blue-600/10 blur-xl pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Fleet Vehicles
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {vehicles.length} listings registered and ordered
              </p>
            </div>
            <button
              onClick={() => onNavigate("vehicles")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                  <th className="pb-3 px-2">Order</th>
                  <th className="pb-3 px-2">Vehicle</th>
                  <th className="pb-3 px-2">Capacity</th>
                  <th className="pb-3 px-2">Features</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No vehicles added yet. Click &quot;View All&quot; to add
                      your first fleet item.
                    </td>
                  </tr>
                ) : (
                  vehicles.slice(0, 5).map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3 px-2 font-bold text-slate-700">
                        #{vehicle.displayOrder}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2.5">
                          {vehicle.image ? (
                            <img
                              src={vehicle.image}
                              alt={vehicle.title}
                              className="w-8 h-8 rounded-lg object-cover shadow-xs"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                              <Truck className="w-4 h-4" />
                            </div>
                          )}
                          <span className="font-bold text-slate-800">
                            {vehicle.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-slate-600 font-medium">
                        {vehicle.seatingCapacity
                          ? `${vehicle.seatingCapacity} Seats`
                          : "Custom"}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(vehicle.features) ? (
                            vehicle.features.slice(0, 2).map((f, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold"
                              >
                                {String(f)}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[11px]">
                              Standard
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  SEO Health
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Search & Metadata Status
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Meta Title</span>
                <span className="font-bold text-slate-800 truncate max-w-35">
                  {seo?.metaTitle || "Not Configured"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Robots Tag</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                  {seo?.robotsIndex !== false ? "Index" : "Noindex"},{" "}
                  {seo?.robotsFollow !== false ? "Follow" : "Nofollow"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Keywords</span>
                <span className="font-bold text-slate-800">
                  {seo?.focusKeywords?.length || 0} Defined
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  Active Schemas
                </span>
                <span className="font-bold text-blue-600">
                  {schemas.length} Loaded
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6">
            <button
              onClick={() => onNavigate("seo")}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Configure SEO Parameters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
