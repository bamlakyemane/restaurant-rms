import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { NAV_ITEMS, APP_NAME } from "../../utils/constants";
import toast from "react-hot-toast";
import { api } from "../../services/api";
import { RotateCcw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ open, onClose }) {
  const handleReset = async () => {
    if (!confirm("Reset all demo data? This clears your local changes."))
      return;
    await api.resetDemoData();
    toast.success("Demo data reset. Reloading…");
    setTimeout(() => window.location.reload(), 600);
  };
  const { user } = useAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-white border-r border-gray-200
          flex flex-col
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="font-semibold text-gray-800">{APP_NAME}</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-gray-800"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {visibleItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                 ${
                   isActive
                     ? "bg-brand-50 text-brand-700"
                     : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                 }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
          >
            <RotateCcw size={14} />
            Reset demo data
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-2">
            v0.1.0 — dev build
          </p>
        </div>
      </aside>
    </>
  );
}
