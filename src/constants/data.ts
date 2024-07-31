import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
    role: "User",
  },
  {
    title: "Post",
    href: "/dashboard/post",
    icon: "post",
    label: "post",
    role: "User",
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: "profile",
    label: "profile",
    role: "User",
  },
  {
    title: "Admin",
    href: "/dashboard/admin",
    icon: "user",
    label: "profile",
    role: "Super Admin",
  },
];
