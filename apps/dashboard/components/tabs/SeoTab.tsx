"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Globe,
  Share2,
  Loader2,
  Lock,
} from "lucide-react";
import { useSeo, useCreateSeo, useUpdateSeo, useProfile } from "@/hooks";
import { useToast } from "@/providers/toastProvider";

export function SeoTab() {
  const { data: profile } = useProfile();
  const isAdmin = profile?.role === "ADMIN";
  const { data: seoData, isLoading } = useSeo();
  const createSeo = useCreateSeo();
  const updateSeo = useUpdateSeo();
  const { toast } = useToast();

  const seo = seoData?.seo;

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeywords, setFocusKeywords] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);

  // Open Graph
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);

  // Twitter Cards
  const [twitterTitle, setTwitterTitle] = useState("");
  const [twitterDescription, setTwitterDescription] = useState("");
  const [twitterImageUrl, setTwitterImageUrl] = useState("");
  const [twitterImageFile, setTwitterImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (seo) {
      setMetaTitle(seo.metaTitle || "");
      setMetaDescription(seo.metaDescription || "");
      setFocusKeywords(
        Array.isArray(seo.focusKeywords)
          ? seo.focusKeywords.join(", ")
          : typeof seo.focusKeywords === "string"
            ? seo.focusKeywords
            : "",
      );
      setCanonicalUrl(seo.canonicalUrl || "");
      setRobotsIndex(seo.robotsIndex !== false);
      setRobotsFollow(seo.robotsFollow !== false);
      setOgTitle(seo.ogTitle || "");
      setOgDescription(seo.ogDescription || "");
      setOgImageUrl(seo.ogImage || "");
      setTwitterTitle(seo.twitterTitle || "");
      setTwitterDescription(seo.twitterDescription || "");
      setTwitterImageUrl(seo.twitterImage || "");
    }
  }, [seo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (metaTitle) formData.append("metaTitle", metaTitle);
    if (metaDescription) formData.append("metaDescription", metaDescription);

    const keywordsArray = focusKeywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    if (keywordsArray.length > 0) {
      formData.append("focusKeywords", JSON.stringify(keywordsArray));
    }

    if (canonicalUrl) formData.append("canonicalUrl", canonicalUrl);
    formData.append("robotsIndex", String(robotsIndex));
    formData.append("robotsFollow", String(robotsFollow));

    if (ogTitle) formData.append("ogTitle", ogTitle);
    if (ogDescription) formData.append("ogDescription", ogDescription);
    if (ogImageFile) {
      formData.append("ogImage", ogImageFile);
    } else if (ogImageUrl) {
      formData.append("ogImage", ogImageUrl);
    }

    if (twitterTitle) formData.append("twitterTitle", twitterTitle);
    if (twitterDescription)
      formData.append("twitterDescription", twitterDescription);
    if (twitterImageFile) {
      formData.append("twitterImage", twitterImageFile);
    } else if (twitterImageUrl) {
      formData.append("twitterImage", twitterImageUrl);
    }

    try {
      if (seo?.id) {
        formData.append("seoId", String(seo.id));
        await updateSeo.mutateAsync(formData);
        toast.success("SEO metadata updated successfully!", "SEO Updated");
      } else {
        await createSeo.mutateAsync(formData);
        toast.success("SEO metadata created and applied!", "SEO Created");
      }
    } catch (err) {
      toast.error(err, "SEO Error");
    }
  };

  const isSaving = createSeo.isPending || updateSeo.isPending;

  if (isLoading) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Metadata Form */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Search Engine Metadata
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Configures standard title, description, keywords, and robot
                  tags
                </p>
              </div>
            </div>

            {/* Meta Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Meta Title
                </label>
                <span
                  className={`text-[10px] font-bold ${metaTitle.length > 60 ? "text-amber-500" : "text-slate-400"
                    }`}
                >
                  {metaTitle.length}/60 chars
                </span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="e.g. Luxury Tempo Traveller & Force Urbania Rentals"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Meta Description
                </label>
                <span
                  className={`text-[10px] font-bold ${metaDescription.length > 160
                      ? "text-amber-500"
                      : "text-slate-400"
                    }`}
                >
                  {metaDescription.length}/160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Provide a compelling snippet for Google search results..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              />
            </div>

            {/* Focus Keywords */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Focus Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={focusKeywords}
                onChange={(e) => setFocusKeywords(e.target.value)}
                placeholder="tempo traveller, luxury bus hire, force urbania"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Canonical URL */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Canonical URL
                </label>
                {!isAdmin && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    <Lock className="w-2.5 h-2.5" />
                    Admin Only
                  </span>
                )}
              </div>
              <input
                type="url"
                disabled={!isAdmin}
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://www.yourdomain.com"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Robots Configuration */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">
                  Robots Meta Directives
                </label>
                {!isAdmin && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    <Lock className="w-2.5 h-2.5" />
                    Admin Only Directive
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 ${!isAdmin
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer"
                    }`}
                >
                  <input
                    type="checkbox"
                    disabled={!isAdmin}
                    checked={robotsIndex}
                    onChange={(e) => setRobotsIndex(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Index Page
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Allow search engines to index
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 ${!isAdmin
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer"
                    }`}
                >
                  <input
                    type="checkbox"
                    disabled={!isAdmin}
                    checked={robotsFollow}
                    onChange={(e) => setRobotsFollow(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Follow Links
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Follow links on this page
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Google Live Preview & Open Graph */}
          <div className="lg:col-span-5 space-y-6">
            {/* Google SERP Live Preview */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Google Search Snippet Preview
                </h4>
              </div>
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 font-sans">
                <div className="text-[11px] text-slate-500 truncate mb-0.5">
                  {canonicalUrl || "https://www.yourdomain.com"}
                </div>
                <h5 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">
                  {metaTitle || "Meta Title Preview Will Appear Here"}
                </h5>
                <p className="text-xs text-[#4d5156] mt-1 line-clamp-2 leading-relaxed">
                  {metaDescription ||
                    "Enter a meta description to see how your website will be rendered on Google search engine result pages."}
                </p>
              </div>
            </div>

            {/* Social Sharing (Open Graph / Twitter) */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Share2 className="w-4 h-4 text-cyan-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Social Sharing (OG & Twitter)
                </h4>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  OG Title
                </label>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  placeholder="Title for Facebook / WhatsApp share"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  OG Description
                </label>
                <textarea
                  rows={2}
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder="Description for social cards"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Social Share Image (OG Image)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setOgImageFile(e.target.files?.[0] || null)
                    }
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
                {ogImageUrl && !ogImageFile && (
                  <p className="text-[10px] text-slate-400 mt-1 truncate">
                    Current: {ogImageUrl}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Action Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">
            Changes reflect instantly on live website &lt;head&gt; section.
          </span>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-linear-to-tl from-blue-600 to-cyan-400 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{seo?.id ? "Update SEO Settings" : "Save SEO Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
