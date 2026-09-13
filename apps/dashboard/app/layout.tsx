import { Plus_Jakarta_Sans } from "next/font/google";
import QueryProvider from "@/providers/queryProvider";
import { ToastProvider } from "@/providers/toastProvider";
import type { Metadata } from "next";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SEO Management Dashboard",
  description: "Website SEO Settings and Dynamic Homepage Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
