"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Globe2, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { OverviewTab } from "@/components/tabs/OverviewTab";
import { SeoTab } from "@/components/tabs/SeoTab";
import { SchemasTab } from "@/components/tabs/SchemasTab";
import { HomepageTab } from "@/components/tabs/HomepageTab";
import { VehiclesTab } from "@/components/tabs/VehiclesTab";
import { OccasionsTab } from "@/components/tabs/OccasionsTab";
import { TestimonialsTab } from "@/components/tabs/TestimonialsTab";
import { GalleryTab } from "@/components/tabs/GalleryTab";
import { ContactTab } from "@/components/tabs/ContactTab";

export default function DashboardPage() {
  const router = useRouter();
  const { data: profile, isLoading, isError } = useProfile();

  const [currentTab, setCurrentTab] = useState("overview");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (isError || !profile)) {
      router.replace("/signin");
    }
  }, [isLoading, isError, profile, router]);

  const isAdmin = profile?.role === "ADMIN";
  useEffect(() => {
    if (
      profile &&
      !isAdmin &&
      (currentTab === "overview" || currentTab === "schemas")
    ) {
      setCurrentTab("seo");
    }
  }, [profile, isAdmin, currentTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tl from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Globe2 className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
            <span>Verifying Admin Session...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-700 flex flex-col justify-between">

      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="lg:pl-72 p-3 sm:p-4 md:p-6 min-h-screen flex flex-col justify-between max-w-full overflow-x-hidden">
        <div>
          <Navbar
            currentTab={currentTab}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />

          <main className="pb-8">
            {currentTab === "overview" &&
              (isAdmin ? (
                <OverviewTab onNavigate={setCurrentTab} />
              ) : (
                <SeoTab />
              ))}
            {currentTab === "seo" && <SeoTab />}
            {currentTab === "schemas" &&
              (isAdmin ? <SchemasTab /> : <SeoTab />)}
            {currentTab === "homepage" && <HomepageTab />}
            {currentTab === "vehicles" && <VehiclesTab />}
            {currentTab === "occasions" && <OccasionsTab />}
            {currentTab === "testimonials" && <TestimonialsTab />}
            {currentTab === "gallery" && <GalleryTab />}
            {currentTab === "contact" && <ContactTab />}
          </main>
        </div>
      </div>
    </div>
  );
}
