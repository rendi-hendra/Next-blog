'use client';
import { DashboardNav } from '@/components/dashboard-nav';
import { Sheet, SheetContent, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { navItems } from '@/constants/data';
import { api } from '@/lib/api';
import { MenuIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import Cookies from "js-cookie";

// import { Playlist } from "../data/playlists";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
}

type DataUser = {
  name: string;
  email: string;
  role: string;
};

export function MobileSidebar({ className }: SidebarProps) {

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

  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Overview
              </h2>
              <div className="space-y-1">
                <DashboardNav
                  items={
                    data?.role === "Super Admin"
                      ? [...commonItems, ...adminItems]
                      : commonItems
                  }
                  isMobileNav={true}
                  setOpen={setOpen}
                />
              </div>
            </div>
          </div>
          <SheetDescription></SheetDescription>
        </SheetContent>
      </Sheet>
    </>
  );
}
