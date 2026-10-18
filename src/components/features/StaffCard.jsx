import { Mail, Pencil, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";

const ROLE_COLOR = {
  admin: "purple",
  waiter: "blue",
  chef: "yellow",
};

export default function StaffCard({ user, isSelf, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center text-3xl shrink-0">
        {user.avatar || "👤"}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <p className="font-semibold text-gray-800 truncate">{user.name}</p>
          <Badge color={ROLE_COLOR[user.role] ?? "gray"}>{user.role}</Badge>
          {isSelf && <Badge color="brand">You</Badge>}
        </div>
        <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
          <Mail size={12} /> {user.email}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(user)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
          aria-label="Edit"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onDelete(user)}
          disabled={isSelf}
          title={isSelf ? "You can't delete yourself" : "Delete"}
          className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
          aria-label="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
