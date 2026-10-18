import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  ChefHat,
  CalendarClock,
  Users,
} from "lucide-react";

export const ROLES = {
  ADMIN: "admin",
  WAITER: "waiter",
  CHEF: "chef",
};

// `roles` = who can see this nav item (empty = everyone)
export const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    roles: [ROLES.ADMIN],
  },
  { label: "Menu", path: "/menu", icon: UtensilsCrossed },
  { label: "Orders", path: "/orders", icon: ClipboardList },
  {
    label: "Kitchen",
    path: "/kitchen",
    icon: ChefHat,
    roles: [ROLES.ADMIN, ROLES.CHEF],
  },
  {
    label: "Reservations",
    path: "/reservations",
    icon: CalendarClock,
    roles: [ROLES.ADMIN, ROLES.WAITER],
  },
  { label: "Staff", path: "/staff", icon: Users, roles: [ROLES.ADMIN] },
];

export const APP_NAME = "Restaurant RMS";
