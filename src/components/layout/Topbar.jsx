import { Menu, Bell, UserCircle } from 'lucide-react'

export default function Topbar({ onMenuClick, title }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-600 hover:text-gray-900"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-800 relative" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <UserCircle size={26} className="text-gray-500" />
          <span className="hidden sm:block text-sm text-gray-700">Guest</span>
        </div>
      </div>
    </header>
  )
}