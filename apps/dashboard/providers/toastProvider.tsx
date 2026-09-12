"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { ApiError } from "@/lib";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (message: string, title?: string) => void;
    error: (errorOrMessage: unknown, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    dismiss: (id: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Standalone event emitter / singleton for calling toast outside components if needed
type ToastListener = (toast: Omit<ToastItem, "id">) => void;
let globalToastListener: ToastListener | null = null;

export const showToast = {
  success: (message: string, title?: string) => {
    if (globalToastListener)
      globalToastListener({ type: "success", message, title });
  },
  error: (errorOrMessage: unknown, title?: string) => {
    const msg = extractErrorMessage(errorOrMessage);
    if (globalToastListener)
      globalToastListener({ type: "error", message: msg, title });
  },
  warning: (message: string, title?: string) => {
    if (globalToastListener)
      globalToastListener({ type: "warning", message, title });
  },
  info: (message: string, title?: string) => {
    if (globalToastListener)
      globalToastListener({ type: "info", message, title });
  },
};

function extractErrorMessage(errorOrMessage: unknown): string {
  if (errorOrMessage instanceof ApiError) {
    return errorOrMessage.getFirstError();
  }
  if (errorOrMessage instanceof Error) {
    return errorOrMessage.message;
  }
  if (typeof errorOrMessage === "string" && errorOrMessage.trim()) {
    return errorOrMessage;
  }
  return "An unexpected error occurred. Please try again.";
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toastData: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = {
      ...toastData,
      id,
      duration: toastData.duration ?? 4500,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, newToast.duration);
    }
  }, []);

  // Register global listener
  React.useEffect(() => {
    globalToastListener = addToast;
    return () => {
      globalToastListener = null;
    };
  }, [addToast]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (message: string, title?: string) =>
      addToast({ type: "success", message, title }),
    error: (errorOrMessage: unknown, title?: string) =>
      addToast({
        type: "error",
        message: extractErrorMessage(errorOrMessage),
        title,
      }),
    warning: (message: string, title?: string) =>
      addToast({ type: "warning", message, title }),
    info: (message: string, title?: string) =>
      addToast({ type: "info", message, title }),
    dismiss,
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Fixed Bottom-Right Toast Viewport */}
      <aside
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="alert"
            className="pointer-events-auto animate-toast-enter bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-100 flex items-start gap-3 transition-all duration-300 relative overflow-hidden"
            style={{
              boxShadow:
                "0 20px 30px -10px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Color Accent Pill / Icon */}
            <div className="shrink-0 mt-0.5">
              {item.type === "success" && (
                <div className="w-8 h-8 rounded-xl bg-linear-to-tl from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              {item.type === "error" && (
                <div className="w-8 h-8 rounded-xl bg-linear-to-tl from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
              {item.type === "warning" && (
                <div className="w-8 h-8 rounded-xl bg-linear-to-tl from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              )}
              {item.type === "info" && (
                <div className="w-8 h-8 rounded-xl bg-linear-to-tl from-blue-600 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                  <Info className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Message Body */}
            <div className="flex-1 min-w-0 pr-2">
              {item.title && (
                <h5 className="text-xs font-bold text-slate-800 leading-tight mb-0.5">
                  {item.title}
                </h5>
              )}
              <p className="text-xs font-medium text-slate-600 leading-relaxed wrap-break-word">
                {item.message}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => dismiss(item.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback to global showToast if called outside Provider
    return { toast: showToast };
  }
  return context;
}
