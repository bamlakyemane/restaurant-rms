import { Clock, Users, ChevronRight, Receipt } from "lucide-react";
import Badge from "../ui/Badge";
import { formatCurrency, minutesAgo, orderTotal } from "../../utils/formatters";

const STATUS_COLOR = {
  pending: "gray",
  preparing: "yellow",
  ready: "blue",
  served: "green",
  paid: "purple",
  cancelled: "red",
};

export default function OrderCard({ order, table, onClick }) {
  const total = orderTotal(order);
  const itemCount = order.items.reduce((n, it) => n + it.qty, 0);
  const pendingCount = order.items.filter(
    (it) => it.status === "pending",
  ).length;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-sm transition p-4 flex items-center gap-4"
    >
      {/* Left: order number + table */}
      <div className="w-16 shrink-0 text-center">
        <p className="text-xs text-gray-400">Order</p>
        <p className="text-lg font-bold text-gray-800">#{order.id.slice(-4)}</p>
      </div>

      <div className="w-px h-12 bg-gray-100" />

      {/* Middle: meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-800 truncate">
            {table ? `Table #${table.number}` : "Takeaway"}
          </span>
          <Badge color={STATUS_COLOR[order.status] ?? "gray"}>
            {order.status}
          </Badge>
          {pendingCount > 0 && <Badge color="red">{pendingCount} new</Badge>}
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {minutesAgo(order.createdAt)}m ago
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} /> {itemCount} item{itemCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Right: total + chevron */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <p className="text-xs text-gray-400">Total</p>
          <p className="font-semibold text-gray-800 flex items-center gap-1">
            <Receipt size={14} className="text-gray-400" />
            {formatCurrency(total)}
          </p>
        </div>
        <ChevronRight size={18} className="text-gray-400" />
      </div>
    </button>
  );
}
