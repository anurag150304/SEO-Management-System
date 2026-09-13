"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Code2,
  Building,
  Store,
  HelpCircle,
  Navigation,
  Globe,
  Trash2,
  Save,
  CheckCircle2,
  Copy,
  Loader2,
} from "lucide-react";
import {
  useSchemas,
  useCreateSchema,
  useUpdateSchema,
  useDeleteSchema,
} from "@/hooks";
import { useToast } from "@/providers/toastProvider";
import type { SupportedSchemaType } from "@repo/zod-validations";

interface SchemaConfig {
  type: SupportedSchemaType;
  title: string;
  icon: any;
  description: string;
  defaultData: Record<string, any>;
}

const SCHEMA_CONFIGS: SchemaConfig[] = [
  {
    type: "ORGANISATION",
    title: "Organization Schema",
    icon: Building,
    description:
      "Corporate identity, official logo, and customer service contact points.",
    defaultData: {
      name: "Luxury Transport Pvt Ltd",
      url: "https://www.luxurytransports.com",
      logo: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
      description: "Leading luxury tempo traveller and bus rental agency.",
      telephone: "+91-9876543210",
    },
  },
  {
    type: "LOCAL_BUSINESS",
    title: "Local Business Schema",
    icon: Store,
    description:
      "Physical branch location, pricing tier, and operational hours for local Google Maps ranking.",
    defaultData: {
      name: "Luxury Tempo Traveller Rentals",
      telephone: "+91-9876543210",
      priceRange: "₹₹",
      streetAddress: "Plot 45, Sector 18, Commercial Belt",
      addressLocality: "New Delhi",
      postalCode: "110001",
      openingHours: "Mo-Su 00:00-23:59",
    },
  },
  {
    type: "FAQ",
    title: "FAQ Schema",
    icon: HelpCircle,
    description:
      "Eligible for rich expandable FAQ search snippets on Google result pages.",
    defaultData: {
      faqs: [
        {
          question:
            "What seating capacities are available for Tempo Travellers?",
          answer:
            "We offer 9, 12, 16, 20, and 26-seater Tempo Travellers as well as Force Urbania.",
        },
        {
          question: "Are all rental vehicles air-conditioned?",
          answer:
            "Yes, 100% of our fleet features dual air conditioning and pushback luxury seats.",
        },
      ],
    },
  },
  {
    type: "BREADCRUMB",
    title: "Breadcrumb Schema",
    icon: Navigation,
    description:
      "Hierarchical website navigation structure displayed in Google SERPs.",
    defaultData: {
      itemListElement: [
        { position: 1, name: "Home", item: "https://www.luxurytransports.com" },
        {
          position: 2,
          name: "Fleet",
          item: "https://www.luxurytransports.com/vehicles",
        },
        {
          position: 3,
          name: "Tempo Travellers",
          item: "https://www.luxurytransports.com/vehicles/tempo-traveller",
        },
      ],
    },
  },
  {
    type: "WEBSITE",
    title: "Website Schema",
    icon: Globe,
    description:
      "Defines website name and internal site search action for Google Sitelinks Search Box.",
    defaultData: {
      name: "Luxury Transport Fleet Portal",
      url: "https://www.luxurytransports.com",
      searchUrl:
        "https://www.luxurytransports.com/search?q={search_term_string}",
    },
  },
];

const SCHEMA_TYPE_MAP: Record<SupportedSchemaType, string> = {
  ORGANISATION: "Organization",
  FAQ: "FAQPage",
  BREADCRUMB: "BreadcrumbList",
  WEBSITE: "WebSite",
  LOCAL_BUSINESS: "LocalBusiness",
};

export function SchemasTab() {
  const { data: schemasData } = useSchemas();
  const createSchema = useCreateSchema();
  const updateSchema = useUpdateSchema();
  const deleteSchema = useDeleteSchema();
  const { toast } = useToast();

  const [activeSchemaType, setActiveSchemaType] =
    useState<SupportedSchemaType>("ORGANISATION");
  const [jsonText, setJsonText] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const schemas = schemasData?.schemas || [];
  const currentDbSchema = schemas.find(
    (s) => s.schemaType.toUpperCase() === activeSchemaType.toUpperCase(),
  );

  const currentConfig =
    SCHEMA_CONFIGS.find((c) => c.type === activeSchemaType) ||
    SCHEMA_CONFIGS[0]!;

  useEffect(() => {
    const existing = schemas.find(
      (s) => s.schemaType.toUpperCase() === activeSchemaType.toUpperCase(),
    );
    const data = existing ? existing.schemaData : currentConfig.defaultData;
    setJsonText(JSON.stringify(data, null, 2));
  }, [activeSchemaType, schemasData]);

  const previewPayload = useMemo(() => {
    let parsedBody = currentConfig.defaultData;
    try {
      if (jsonText.trim()) parsedBody = JSON.parse(jsonText);
    } catch {
      parsedBody = currentConfig.defaultData;
    }

    return {
      "@context": "https://schema.org",
      "@type": SCHEMA_TYPE_MAP[activeSchemaType] || activeSchemaType,
      ...parsedBody,
    };
  }, [jsonText, activeSchemaType, currentConfig.defaultData]);

  const handleSave = async () => {
    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      toast.error(
        "Invalid JSON syntax. Please check for missing quotes or commas.",
        "Syntax Error",
      );
      return;
    }

    try {
      if (currentDbSchema) {
        await updateSchema.mutateAsync({
          schemaType: activeSchemaType,
          schemaData: parsed,
        });
        toast.success(
          `${currentConfig.title} updated successfully!`,
          "Schema Saved",
        );
      } else {
        await createSchema.mutateAsync({
          schemaType: activeSchemaType,
          schemaData: parsed,
        });
        toast.success(
          `${currentConfig.title} created and activated!`,
          "Schema Created",
        );
      }
    } catch (err) {
      toast.error(err, "Schema Error");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove ${currentConfig.title}?`))
      return;
    try {
      await deleteSchema.mutateAsync(activeSchemaType);
      toast.success(
        `${currentConfig.title} deleted from database.`,
        "Schema Deleted",
      );
      setJsonText(JSON.stringify(currentConfig.defaultData, null, 2));
    } catch (err) {
      toast.error(err, "Delete Failed");
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(
      `<script type="application/ld+json">\n${JSON.stringify(
        previewPayload,
        null,
        2,
      )}\n</script>`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSaving = createSchema.isPending || updateSchema.isPending;

  return (
    <div className="space-y-6">
      <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-2">
        {SCHEMA_CONFIGS.map((cfg) => {
          const Icon = cfg.icon;
          const isSelected = activeSchemaType === cfg.type;
          const isConfigured = schemas.some(
            (s) => s.schemaType.toUpperCase() === cfg.type.toUpperCase(),
          );

          return (
            <button
              key={cfg.type}
              onClick={() => setActiveSchemaType(cfg.type)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isSelected
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cfg.title}</span>
              {isConfigured && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-emerald-400" : "bg-emerald-500"
                    }`}
                  title="Configured"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {currentConfig.title} Payload
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  {currentConfig.description}
                </p>
              </div>
            </div>
            {currentDbSchema && (
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] tracking-wide uppercase">
                Active in &lt;head&gt;
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Schema Data (Editable JSON)
              </label>
              <span className="text-[10px] font-semibold text-slate-400">
                Valid JSON syntax required
              </span>
            </div>
            <textarea
              rows={14}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full p-4 font-mono text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-slate-800 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y leading-relaxed shadow-xs transition-colors"
              placeholder="Paste or edit schema JSON data..."
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {currentDbSchema ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteSchema.isPending}
                className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Schema</span>
              </button>
            ) : (
              <span className="text-xs text-slate-400">Not configured yet</span>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-linear-to-tl from-blue-600 to-cyan-400 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-2 cursor-pointer ml-auto"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              <span>
                {currentDbSchema ? "Update Schema" : "Save & Activate"}
              </span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Live JSON-LD Script Output
                </h4>
                <p className="text-[11px] text-slate-400">
                  Rendered in website &lt;head&gt;
                </p>
              </div>
              <button
                onClick={handleCopyJson}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Tag</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 font-mono text-[11px] text-slate-700 overflow-x-auto max-h-85">
              <span className="text-blue-600">&lt;script</span>{" "}
              <span className="text-purple-600">type=</span>
              <span className="text-emerald-600">
                &quot;application/ld+json&quot;
              </span>
              <span className="text-blue-600">&gt;</span>
              <pre className="mt-1 text-slate-800">
                {JSON.stringify(previewPayload, null, 2)}
              </pre>
              <span className="text-blue-600">&lt;/script&gt;</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              Google rich snippets will automatically parse this JSON-LD tag
              upon next crawl.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
