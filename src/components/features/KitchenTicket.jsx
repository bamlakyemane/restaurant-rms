import { Clock, Flame, Check, Play } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { minutesAgo } from "../../utils/formatters";

export default function KitchenTicket({
  order,
  variant = "new", // 'new' | 'preparing' | 'ready'
  onItemStart,
  onItemReady,
  onItemServe,
  onBulkStart,
  onBulkReady,
  saving,
}) {
  const minutes = minutesAgo(order.createdAt);
  const isUrgent = minutes >= 15;
  const isWarm = minutes >= 8 && minutes < 15;

  // Time badge colors
  const timeColor = isUrgent ? "red" : isWarm ? "yellow" : "gray";

  // Column accent colors
  const ACCENT = {
    new: "border-t-sky-500",
    preparing: "border-t-amber-500",
    ready: "border-t-emerald-500",
  };

  // Filter items relevant to the column
  const visibleItems = order.items.filter((it) => {
    if (variant === "new") return it.status === "pending";
    if (variant === "preparing") return it.status === "preparing";
    if (variant === "ready") return it.status === "ready";
    return true;
  });

  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-200 border-t-4 ${ACCENT[variant]}
        shadow-sm flex flex-col
        ${isUrgent ? "ring-1 ring-red-300 animate-pulse-soft" : ""}
      `}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div>
          <p className="text-lg font-bold text-gray-900 leading-tight">
            #{order.id.slice(-4)}
          </p>
          <p className="text-xs text-gray-500">
            {order.items.reduce((n, it) => n + it.qty, 0)} items
          </p>
        </div>

        <Badge color={timeColor}>
          <Clock size={12} />
          {minutes}m
        </Badge>
      </div>

      {/* Items */}
      <div className="flex-1 px-4 py-3 space-y-3">
        {visibleItems.map((it) => (
          <div
            key={it.id}
            className="border-b border-dashed border-gray-100 last:border-0 pb-3 last:pb-0"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800">
                  <span className="text-brand-600">{it.qty}×</span> {it.name}
                </p>
                {it.notes && (
                  <p className="text-sm text-red-600 italic mt-0.5 flex items-start gap-1">
                    <Flame size={12} className="mt-0.5 shrink-0" />
                    {it.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Item action */}
            <div className="mt-2">
              {variant === "new" && (
                <Button
                  size="sm"
                  icon={Play}
                  className="w-full"
                  onClick={() => onItemStart(order.id, it.id, "preparing")}
                  disabled={saving}
                >
                  Start
                </Button>
              )}
              {variant === "preparing" && (
                <Button
                  size="sm"
                  variant="success"
                  icon={Check}
                  className="w-full"
                  onClick={() => onItemReady(order.id, it.id, "ready")}
                  disabled={saving}
                >
                  Ready
                </Button>
              )}
              {variant === "ready" && (
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Check}
                  className="w-full"
                  onClick={() => onItemServe(order.id, it.id, "served")}
                  disabled={saving}
                >
                  Served
                </Button>
              )}
            </div>
          </div>
        ))}

        {visibleItems.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            No items in this stage.
          </p>
        )}
      </div>

      {/* Footer — bulk actions */}
      {variant !== "ready" && visibleItems.length > 1 && (
        <div className="px-4 py-3 border-t border-gray-100">
          <Button
            size="sm"
            variant="ghost"
            className="w-full"
            onClick={() =>
              variant === "new" ? onBulkStart(order.id) : onBulkReady(order.id)
            }
            disabled={saving}
          >
            {variant === "new"
              ? `Start all ${visibleItems.length} items`
              : `Mark all ${visibleItems.length} items ready`}
          </Button>
        </div>
      )}
    </div>
  );
}
