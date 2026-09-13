"use client";

import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Map, Save, Loader2, Lock } from "lucide-react";
import {
  useContact,
  useCreateContact,
  useUpdateContact,
  useProfile,
} from "@/hooks";
import { useToast } from "@/providers/toastProvider";

export function ContactTab() {
  const { data: profile } = useProfile();
  const isAdmin = profile?.role === "ADMIN";
  const { data: contactData, isLoading } = useContact();
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const { toast } = useToast();

  const contact = contactData?.contactSettings;

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [mapEmbed, setMapEmbed] = useState("");

  useEffect(() => {
    if (contact) {
      setPhone(contact.phone || "");
      setEmail(contact.email || "");
      setAddress(contact.address || "");
      setMapEmbed(contact.mapEmbed || "");
    }
  }, [contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      phone: phone || null,
      email: email || null,
      address: address || null,
      mapEmbed: mapEmbed || null,
    };

    try {
      if (contact?.id) {
        await updateContact.mutateAsync({
          id: contact.id,
          ...payload,
        });
        toast.success(
          "Contact settings updated successfully!",
          "Contact Saved",
        );
      } else {
        await createContact.mutateAsync(payload);
        toast.success(
          "Contact settings saved successfully!",
          "Contact Created",
        );
      }
    } catch (err) {
      toast.error(err, "Contact Error");
    }
  };

  const isSaving = createContact.isPending || updateContact.isPending;

  // Extract src from iframe if admin or editor pasted raw <iframe ... src="...">
  const getMapEmbedSrc = (raw: string) => {
    if (!raw) return "";
    const match = raw.match(/src=["']([^"']+)["']/);
    return match ? match[1] : raw.startsWith("http") ? raw : "";
  };

  const mapSrc = getMapEmbedSrc(mapEmbed);

  if (isLoading) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isAdmin && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2.5">
          <Lock className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            Contact settings are view-only for Editors. Contact details and
            office address can only be changed by an Administrator.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Contact Information Inputs */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Business Contact Details
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Direct customer contact lines, email dispatch, and Google Maps
                  embed
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Booking / Support Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Official Business Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  disabled={!isAdmin}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="booking@luxurytransports.com"
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Office Physical Address
              </label>
              <textarea
                rows={3}
                disabled={!isAdmin}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot 45, Ground Floor, Sector 18 Commercial Hub, New Delhi - 110001"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Google Maps Embed Code / URL
              </label>
              <textarea
                rows={3}
                disabled={!isAdmin}
                value={mapEmbed}
                onChange={(e) => setMapEmbed(e.target.value)}
                placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Paste the full &lt;iframe&gt; code or map URL from Google Maps
                share dialog.
              </p>
            </div>
          </div>

          {/* Right: Live Map Preview */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                <Map className="w-4 h-4 text-sky-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Live Google Map Preview
                </h4>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-64 flex items-center justify-center">
                {mapSrc ? (
                  <iframe
                    src={mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-semibold">
                      Map preview will appear here
                    </p>
                    <p className="text-[11px] mt-0.5">
                      Enter a Google Maps embed iframe to test
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[11px] text-slate-400 font-medium">
                Rendered directly in the public website contact & footer
                sections.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">
            Contact information is synchronized across all web landing pages.
          </span>
          {isAdmin && (
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-linear-to-tl from-sky-500 to-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              <span>Save Contact Information</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
