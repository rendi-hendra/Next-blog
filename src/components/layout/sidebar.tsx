"use client";
import React, { useEffect, useState } from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { navItems } from "@/constants/data"; // Assume navItems includes common items and admin items
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import { api } from "@/lib/api";
import Cookies from "js-cookie";

type SidebarProps = {
  className?: string;
};

type DataUser = {
  name: string;
  email: string;
  role: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);
  const cookie = Cookies.get("token");
  const [data, setData] = useState<DataUser | null>(null);

  useEffect(() => {
    api
      .get("/users/current", {
        headers: { Authorization: cookie },
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error.response.data.errors);
      });
  }, [cookie]);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  // Common items for all users
  const commonItems = navItems.filter((item) =>
    ["Dashboard", "Post", "Profile"].includes(item.title)
  );

  // Admin specific items
  const adminItems = navItems.filter(
    (item) =>
      item.role === "Super Admin" || item.role === "Admin" &&
      !["Dashboard", "Post", "Profile"].includes(item.title)
  );

  return (
    <nav
      className={cn(
        `relative hidden h-screen flex-none border-r-2 border-black z-10 pt-20 md:block`,
        status && "duration-500",
        !isMinimized ? "w-72" : "w-[72px]",
        className
      )}
    >
      <ChevronLeft
        className={cn(
          "absolute -right-3 top-20 cursor-pointer rounded-full border-2 bg-background text-3xl text-foreground",
          isMinimized && "rotate-180"
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav
              items={
                data?.role === "Super Admin"
                  ? [...commonItems, ...adminItems]
                  : commonItems
              }
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
