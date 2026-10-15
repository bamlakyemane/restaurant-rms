import { Clock, Users, Receipt } from "lucide-react";
import { minutesAgo } from "../../utils/formatters";

const STATUS_STYLE = {
  free: {
    ring: "ring-1 ring-gray-200",
    bg: "bg-white hover:bg-gray-50",
    dot: "bg-emerald-500",
    text: "text-gray-800",
    label: "Free",
    labelColor: "text-emerald-600",
  },
  occupied: {
    ring: "ring-1 ring-brand-200",
    bg: "bg-brand-50 hover:bg-brand-100/70",
    dot: "bg-brand-500",
    text: "text-brand-900",
    label: "Occupied",
    labelColor: "text-brand-700",
  },
  reserved: {
    ring: "ring-1 ring-violet-200",
    bg: "bg-violet-50 hover:bg-violet-100/70",
    dot: "bg-violet-500",
    text: "text-violet-900",
    label: "Reserved",
    labelColor: "text-violet-700",
  },
};

export default function TableCard({ table, order, onClick }) {
  const s = STATUS_STYLE[table.status] ?? STATUS_STYLE.free;
  const total = order
    ? order.items.reduce((sum, it) => sum + it.price * it.qty, 0)
    : 0;

  return (
    <button
      onClick={() => onClick(table)}
      className={`
        relative w-full text-left rounded-xl p-4 transition
        ${s.bg} ${s.ring}
        focus:outline-none focus:ring-2 focus:ring-brand-500/40
      `}
    >
      {/* Top row: number + status */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className={`text-2xl font-bold ${s.text}`}>#{table.number}</p>
          <p className="text-xs text-gray-500 mt-0.5">{table.zone}</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium">
          <span className={`w-2 h-2 rounded-full ${s.dot}`} />
          <span className={s.labelColor}>{s.label}</span>
        </span>
      </div>

      {/* Bottom row: seats + order info */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <Users size={12} /> {table.seats} seats
        </span>

        {order ? (
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {minutesAgo(order.createdAt)}m
            </span>
            <span className="flex items-center gap-1 font-semibold text-gray-800">
              <Receipt size={12} /> ${total.toFixed(2)}
            </span>
          </span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </div>
    </button>
  );
}
