import { ChefHat, CheckCircle2, XCircle, Clock } from "lucide-react";
import Drawer from "../ui/Drawer";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { formatCurrency, minutesAgo, orderTotal } from "../../utils/formatters";

const ITEM_BADGE = {
  pending: "gray",
  preparing: "yellow",
  ready: "blue",
  served: "green",
};

export default function OrderDetailDrawer({
  open,
  onClose,
  order,
  saving,
  onUpdateItemStatus,
  onSendToKitchen,
  onCancel,
}) {
  if (!order) return null;

  const isActive = !["paid", "cancelled"].includes(order.status);
  const hasPending = order.items.some((it) => it.status === "pending");
  const allServed = order.items.every((it) => it.status === "served");

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Order #${order.id.slice(-4)}`}
      width="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>

          {isActive && hasPending && (
            <Button icon={ChefHat} onClick={onSendToKitchen} loading={saving}>
              Send to kitchen
            </Button>
          )}

          {isActive && (
            <Button
              variant="danger"
              icon={XCircle}
              onClick={onCancel}
              loading={saving}
            >
              Cancel order
            </Button>
          )}
        </>
      }
    >
      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <Badge
          color={
            order.status === "paid"
              ? "purple"
              : order.status === "cancelled"
                ? "red"
                : order.status === "served"
                  ? "green"
                  : order.status === "preparing"
                    ? "yellow"
                    : "gray"
          }
        >
          {order.status}
        </Badge>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock size={12} /> {minutesAgo(order.createdAt)} min ago
        </span>
      </div>

      {/* Items */}
      <div className="rounded-lg border border-gray-200 divide-y divide-gray-100 mb-5">
        {order.items.map((it) => (
          <div
            key={it.id}
            className="px-3 py-3 flex items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800">
                {it.qty}× {it.name}
              </p>
              {it.notes && (
                <p className="text-xs text-gray-400 italic mt-0.5">
                  "{it.notes}"
                </p>
              )}
              <div className="mt-1.5">
                <Badge color={ITEM_BADGE[it.status] ?? "gray"}>
                  {it.status}
                </Badge>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-gray-800">
                {formatCurrency(it.price * it.qty)}
              </p>

              {isActive && it.status !== "served" && (
                <div className="mt-2 flex flex-col gap-1 items-end">
                  {it.status === "pending" && (
                    <button
                      onClick={() =>
                        onUpdateItemStatus(order.id, it.id, "preparing")
                      }
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Mark preparing
                    </button>
                  )}
                  {it.status === "preparing" && (
                    <button
                      onClick={() =>
                        onUpdateItemStatus(order.id, it.id, "ready")
                      }
                      className="text-xs text-sky-600 hover:text-sky-700 font-medium"
                    >
                      Mark ready
                    </button>
                  )}
                  {it.status === "ready" && (
                    <button
                      onClick={() =>
                        onUpdateItemStatus(order.id, it.id, "served")
                      }
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                    >
                      <CheckCircle2 size={12} /> Mark served
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="px-3 py-3 flex items-center justify-between bg-gray-50">
          <span className="text-sm font-medium text-gray-700">Total</span>
          <span className="text-base font-bold text-gray-900">
            {formatCurrency(orderTotal(order))}
          </span>
        </div>
      </div>

      {isActive && !allServed && (
        <p className="text-xs text-gray-500 text-center">
          Mark all items <span className="font-medium">served</span> to complete
          the order.
        </p>
      )}
    </Drawer>
  );
}
