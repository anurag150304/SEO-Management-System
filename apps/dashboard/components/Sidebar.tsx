"use client";

import {
  LayoutDashboard,
  Search,
  Code2,
  Home,
  Truck,
  PartyPopper,
  Star,
  Image as ImageIcon,
  MapPin,
  Globe2,
  X,
} from "lucide-react";
import { cn } from "@/lib";
import { useProfile } from "@/hooks";

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  gradient: string;
}

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { data: profile } = useProfile();
  const isAdmin = profile?.role === "ADMIN";
  const consoleTitle =
    profile?.role === "EDITOR" ? "Editor Console" : "Admin Console";

  const allMainNavItems: NavItem[] = [
    {
      id: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
      gradient: "from-blue-600 to-cyan-400",
    },
    {
      id: "seo",
      label: "SEO Settings",
      icon: Search,
      gradient: "from-blue-600 to-cyan-400",
    },
    {
      id: "schemas",
      label: "Schema Markup",
      icon: Code2,
      gradient: "from-blue-600 to-cyan-400",
    },
    {
      id: "homepage",
      label: "Hero & About",
      icon: Home,
      gradient: "from-blue-600 to-cyan-400",
    },
  ];

  const mainNavItems = allMainNavItems.filter((item) => {
    if ((item.id === "overview" || item.id === "schemas") && !isAdmin)
      return false;
    return true;
  });

  const managementNavItems: NavItem[] = [
    {
      id: "vehicles",
      label: "Vehicles Fleet",
      icon: Truck,
      gradient: "from-emerald-500 to-teal-400",
    },
    {
      id: "occasions",
      label: "Occasions",
      icon: PartyPopper,
      gradient: "from-purple-600 to-indigo-400",
    },
    {
      id: "testimonials",
      label: "Testimonials",
      icon: Star,
      gradient: "from-amber-500 to-orange-400",
    },
    {
      id: "gallery",
      label: "Media Gallery",
      icon: ImageIcon,
      gradient: "from-rose-500 to-pink-400",
    },
    {
      id: "contact",
      label: "Contact Info",
      icon: MapPin,
      gradient: "from-sky-500 to-blue-600",
    },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "fixed top-4 left-4 bottom-4 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 z-50 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto pr-1">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tl from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                <Globe2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-800 tracking-tight">
                  SEO Management
                </h1>
                <p className="text-[11px] font-semibold text-slate-400">
                  {consoleTitle}
                </p>
              </div>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 lg:hidden cursor-pointer"
              title="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6 flex-1">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Main Pages
              </p>
              <div className="space-y-1">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left",
                        isActive
                          ? "bg-white shadow-md text-slate-800"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm",
                          isActive
                            ? `bg-linear-to-tl ${item.gradient} text-white shadow-blue-500/30`
                            : "bg-white text-slate-600 group-hover:text-slate-800",
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Fleet & Content
              </p>
              <div className="space-y-1">
                {managementNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left",
                        isActive
                          ? "bg-white shadow-md text-slate-800"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm",
                          isActive
                            ? `bg-linear-to-tl ${item.gradient} text-white shadow-md`
                            : "bg-white text-slate-600",
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
