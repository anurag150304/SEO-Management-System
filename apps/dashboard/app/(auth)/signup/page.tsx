"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Globe2,
  UserPlus,
  Lock,
  Mail,
  User,
  Shield,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useSignup, useHasAdmin } from "@/hooks";
import { useToast } from "@/providers/toastProvider";
import { ApiError } from "@/lib";

export default function SignUpPage() {
  const router = useRouter();
  const signup = useSignup();
  const { data: adminCheck, isLoading: isCheckingAdmin } = useHasAdmin();
  const { toast } = useToast();

  const hasAdmin = adminCheck?.hasAdmin ?? false;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "EDITOR">("ADMIN");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (hasAdmin) {
      setRole("EDITOR");
    } else {
      setRole("ADMIN");
    }
  }, [hasAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const assignedRole = hasAdmin ? "EDITOR" : role;

    try {
      await signup.mutateAsync({
        name,
        email,
        password,
        role: assignedRole,
      });
      toast.success(
        "Account created successfully. Redirecting...",
        "Registration Complete",
      );
      router.push("/");
    } catch (err) {
      toast.error(err, "Sign Up Failed");
      if (err instanceof ApiError) {
        setErrorMsg(err.getFirstError());
      } else {
        setErrorMsg("Failed to register. Please check the entered fields.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-linear-to-tl from-blue-600 to-cyan-400 items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-3">
            <Globe2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            SEO Management Register
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Register to manage SEO metadata and website sections
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anurag Mishra"
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@travels.com"
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Role Display / Picker */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Access Role
                </label>
                {hasAdmin && (
                  <span className="text-[10px] font-bold text-slate-400">
                    Auto-Assigned
                  </span>
                )}
              </div>

              {hasAdmin ? (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Editor Access
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Admin account already exists. New registrations are
                        Editors.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px]">
                    EDITOR
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("ADMIN")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${role === "ADMIN"
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("EDITOR")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${role === "EDITOR"
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Editor</span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={signup.isPending || isCheckingAdmin}
              className="w-full py-2.5 bg-linear-to-tl from-blue-600 to-cyan-400 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {signup.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span>Create Account</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Already have an admin account?{" "}
              <Link
                href="/signin"
                className="text-blue-600 font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
