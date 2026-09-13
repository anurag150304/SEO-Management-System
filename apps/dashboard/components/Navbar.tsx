"use client";

import { useState } from "react";
import {
  Menu,
  Search,
  LogOut,
  Shield,
  Loader2,
  X,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { useProfile, useSignout } from "@/hooks";

interface NavbarProps {
  currentTab: string;
  onOpenMobileSidebar?: () => void;
}

const TAB_TITLES: Record<string, { page: string; title: string }> = {
  overview: { page: "Dashboard", title: "Dashboard Overview" },
  seo: { page: "SEO", title: "Search Engine Optimization" },
  schemas: { page: "Schemas", title: "JSON-LD Schema Builder" },
  homepage: { page: "Homepage", title: "Hero & About Management" },
  vehicles: { page: "Fleet", title: "Vehicles Management" },
  occasions: { page: "Travel", title: "Occasions Management" },
  testimonials: { page: "Reviews", title: "Customer Testimonials" },
  gallery: { page: "Media", title: "Gallery & Alt Tags" },
  contact: { page: "Contact", title: "Contact Information" },
};

export function Navbar({ currentTab, onOpenMobileSidebar }: NavbarProps) {
  const { data: profile, isLoading } = useProfile();
  const signout = useSignout();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const currentMeta = TAB_TITLES[currentTab] || {
    page: "Dashboard",
    title: "Dashboard",
  };

  const consoleTitle =
    profile?.role === "EDITOR" ? "Editor Console" : "Admin Console";

  const handleSignout = async () => {
    try {
      await signout.mutateAsync();
      window.location.href = "/signin";
    } catch {
      window.location.href = "/signin";
    }
  };

  return (
    <>
      <header className="sticky top-4 z-30 mb-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 p-3.5 sm:p-4 flex items-center justify-between gap-3">
        {/* Left: Breadcrumbs & Page Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="p-1.5 sm:p-2 -ml-1 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 font-medium truncate">
              <span className="text-slate-500 font-semibold">
                {consoleTitle}
              </span>
              <span>/</span>
              <span className="text-slate-600 font-bold capitalize truncate">
                {currentMeta.page}
              </span>
            </nav>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight mt-0.5 truncate">
              {currentMeta.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Type here..."
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-44 lg:w-52"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              <span className="text-xs text-slate-400">Loading profile...</span>
            </div>
          ) : profile ? (
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 rounded-xl px-3 py-1.5 transition-all cursor-pointer text-left"
              title="View Admin Profile"
            >
              <div className="w-7 h-7 rounded-lg bg-linear-to-tl from-blue-600 to-cyan-400 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {profile.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Shield className="w-2.5 h-2.5 text-blue-500" />
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider leading-none">
                    {profile.role}
                  </span>
                </div>
              </div>
            </button>
          ) : null}

          <button
            onClick={handleSignout}
            disabled={signout.isPending}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100/80 text-rose-600 border border-rose-200/60 font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Sign Out of Admin Console"
          >
            {signout.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {isProfileModalOpen && profile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-linear-to-tl from-blue-600 to-cyan-400 p-6 text-white relative">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg bg-black/10 hover:bg-black/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-white text-blue-600 flex items-center justify-center font-bold text-xl shadow-md mb-2">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
              </div>
              <h3 className="text-base font-bold text-white">{profile.name}</h3>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/20 text-white text-[11px] font-bold mt-1">
                <Shield className="w-3 h-3" />
                <span>{profile.role} Access</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Email Address
                  </p>
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Permissions Level
                  </p>
                  <p className="text-xs font-semibold text-slate-800">
                    Full {profile.role} Permissions
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSignout}
                  disabled={signout.isPending}
                  className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
