// "use client";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
// import { Toaster } from "@/components/ui/toaster";
import { Toaster } from "sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Basic dashboard with Next.js and Shadcn",
};

// const isMobile = window.innerWidth <= 768;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">{children}</main>
        <Toaster
          richColors
          // position={isMobile ? "top-center" : "bottom-right"}
        />
      </div>
    </>
  );
}
