import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { NAV_ITEMS } from '../../utils/constants'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Derive page title from nav config
  const current = NAV_ITEMS.find((item) =>
    item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
  )
  const title = current?.label ?? 'Not Found'

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}