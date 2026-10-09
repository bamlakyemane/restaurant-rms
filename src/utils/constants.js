import {
  LayoutDashboard, UtensilsCrossed, Armchair, ClipboardList,
  ChefHat, Receipt, CalendarClock, Users,
} from 'lucide-react'

export const ROLES = {
  ADMIN: 'admin',
  WAITER: 'waiter',
  CHEF: 'chef',
}

// `roles` = who can see this nav item (empty = everyone)
export const NAV_ITEMS = [
  { label: 'Dashboard',    path: '/',            icon: LayoutDashboard },
  { label: 'Menu',         path: '/menu',        icon: UtensilsCrossed },
  { label: 'Tables',       path: '/tables',      icon: Armchair },
  { label: 'Orders',       path: '/orders',      icon: ClipboardList },
  { label: 'Kitchen',      path: '/kitchen',     icon: ChefHat, roles: [ROLES.ADMIN, ROLES.CHEF] },
  { label: 'Billing',      path: '/billing',     icon: Receipt, roles: [ROLES.ADMIN, ROLES.WAITER] },
  { label: 'Reservations', path: '/reservations',icon: CalendarClock, roles: [ROLES.ADMIN, ROLES.WAITER] },
  { label: 'Staff',        path: '/staff',       icon: Users, roles: [ROLES.ADMIN] },
]

export const APP_NAME = 'Restaurant RMS'