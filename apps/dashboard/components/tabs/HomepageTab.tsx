"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";
import { useHomepage, useCreateHomepage, useUpdateHomepage } from "@/hooks";
import { useToast } from "@/providers/toastProvider";
import { ApiError } from "@/lib";

export function HomepageTab() {
  const { data: homepageData, isLoading } = useHomepage();
  const createHomepage = useCreateHomepage();
  const updateHomepage = useUpdateHomepage();
  const { toast } = useToast();

  const homepage = homepageData?.homepage;

  // Hero Section State
  const [heroHeading, setHeroHeading] = useState("");
  const [heroSubheading, setHeroSubheading] = useState("");
  const [heroCtaText, setHeroCtaText] = useState("");
  const [heroCtaUrl, setHeroCtaUrl] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

  // About Section State
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [aboutImageUrl, setAboutImageUrl] = useState("");
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (homepage) {
      setHeroHeading(homepage.heroHeading || "");
      setHeroSubheading(homepage.heroSubheading || "");
      setHeroCtaText(homepage.heroCtaText || "");
      setHeroCtaUrl(homepage.heroCtaUrl || "");
      setHeroImageUrl(homepage.heroImage || "");

      setAboutTitle(homepage.aboutTitle || "");
      setAboutDescription(homepage.aboutDescription || "");
      setAboutImageUrl(homepage.aboutImage || "");
    }
  }, [homepage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const formData = new FormData();
    if (heroHeading) formData.append("heroHeading", heroHeading);
    if (heroSubheading) formData.append("heroSubheading", heroSubheading);
    if (heroCtaText) formData.append("heroCtaText", heroCtaText);
    if (heroCtaUrl) formData.append("heroCtaUrl", heroCtaUrl);
    if (heroImageFile) {
      formData.append("heroImage", heroImageFile);
    } else if (heroImageUrl) {
      formData.append("heroImage", heroImageUrl);
    }

    if (aboutTitle) formData.append("aboutTitle", aboutTitle);
    if (aboutDescription) formData.append("aboutDescription", aboutDescription);
    if (aboutImageFile) {
      formData.append("aboutImage", aboutImageFile);
    } else if (aboutImageUrl) {
      formData.append("aboutImage", aboutImageUrl);
    }

    try {
      if (homepage?.id) {
        formData.append("id", String(homepage.id));
        await updateHomepage.mutateAsync(formData);
        toast.success(
          "Homepage content updated successfully!",
          "Homepage Updated",
        );
        setFeedback({
          type: "success",
          message: "Homepage sections updated successfully!",
        });
      } else {
        await createHomepage.mutateAsync(formData);
        toast.success("Homepage content created and saved!", "Homepage Saved");
        setFeedback({
          type: "success",
          message: "Homepage sections created successfully!",
        });
      }
    } catch (err) {
      toast.error(err, "Homepage Error");
      const msg =
        err instanceof ApiError
          ? err.getFirstError()
          : "Failed to save homepage content.";
      setFeedback({ type: "error", message: msg });
    }
  };

  const isSaving = createHomepage.isPending || updateHomepage.isPending;

  if (isLoading) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Hero Section Management Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Hero Banner Section
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Main landing headline, call to action button, and banner
                background
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Main Heading
              </label>
              <input
                type="text"
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                placeholder="e.g. Luxury Tempo Traveller & Force Urbania Rentals"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Sub Heading
              </label>
              <input
                type="text"
                value={heroSubheading}
                onChange={(e) => setHeroSubheading(e.target.value)}
                placeholder="e.g. Premium chauffeur-driven fleet for outstations & weddings"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={heroCtaText}
                onChange={(e) => setHeroCtaText(e.target.value)}
                placeholder="e.g. Book Your Ride Now"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                CTA Button URL
              </label>
              <input
                type="url"
                value={heroCtaUrl}
                onChange={(e) => setHeroCtaUrl(e.target.value)}
                placeholder="https://www.yourdomain.com/contact"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Banner Image
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
                className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {heroImageUrl && !heroImageFile && (
                <span className="text-[11px] text-slate-400 truncate max-w-xs">
                  Current: {heroImageUrl}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. About Us Section Management Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                About Us Section
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Story, mission statement, and featured brand visual
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={aboutTitle}
              onChange={(e) => setAboutTitle(e.target.value)}
              placeholder="e.g. Leading Luxury Fleet Provider Since 2010"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              About Description
            </label>
            <textarea
              rows={4}
              value={aboutDescription}
              onChange={(e) => setAboutDescription(e.target.value)}
              placeholder="Detailed company background and service assurances..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-y"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Featured About Image
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAboutImageFile(e.target.files?.[0] || null)}
                className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />
              {aboutImageUrl && !aboutImageFile && (
                <span className="text-[11px] text-slate-400 truncate max-w-xs">
                  Current: {aboutImageUrl}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">
            Homepage changes are reflected on the public website dynamically.
          </span>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-linear-to-tl from-blue-600 to-cyan-400 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            <span>Save Homepage Sections</span>
          </button>
        </div>
      </form>
    </div>
  );
}
