"use client";

import { useState } from "react";
import { X, Phone, CheckCircle2, MessageCircle } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVehicle?: string;
  phoneNumber?: string;
}

export function BookingModal({
  isOpen,
  onClose,
  selectedVehicle,
  phoneNumber = "+91 98765 43210",
}: BookingModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState(
    selectedVehicle || "12 Seater Luxury Tempo",
  );
  const [date, setDate] = useState("");
  const [destination, setDestination] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden relative">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Request Fleet Quote
            </h3>
            <p className="text-[11px] text-slate-400">
              Instant price estimation with chauffeur details
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Inquiry Received!
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Thank you, {name || "customer"}! Our reservation officer will
                call you at{" "}
                <span className="font-bold text-slate-800">{phone}</span> within
                10 minutes with discounted quotes.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-5 space-y-3.5 text-xs overflow-y-auto flex-1"
          >
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Mobile / WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Preferred Fleet
                </label>
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                >
                  <option value="9 Seater Tempo">9 Seater Tempo</option>
                  <option value="12 Seater Luxury Tempo">
                    12 Seater Luxury
                  </option>
                  <option value="16 Seater Force Urbania">
                    16 Seater Urbania
                  </option>
                  <option value="20 Seater Coach">20 Seater Coach</option>
                  <option value="45 Seater Volvo Bus">45 Seater Bus</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Travel Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Pickup & Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Delhi to Manali (3 Days Return)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/25 transition-all mt-3 cursor-pointer"
            >
              Get Instant Price Quote
            </button>

            <div className="pt-2 text-center border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] text-slate-400">
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <Phone className="w-3 h-3 text-blue-600" />
                <span>Call Directly</span>
              </a>
              <span>•</span>
              <a
                href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-emerald-600"
              >
                <MessageCircle className="w-3 h-3 text-emerald-600" />
                <span>WhatsApp Quote</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
