import { useNavigate } from "react-router-dom";
import {
  Clock,
  Users,
  Receipt,
  CalendarPlus,
  Unlock,
  ChefHat,
} from "lucide-react";
import Drawer from "../ui/Drawer";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { formatCurrency, minutesAgo, orderTotal } from "../../utils/formatters";

const STATUS_BADGE = {
  free: "green",
  occupied: "brand",
  reserved: "purple",
};

export default function TableDrawer({
  open,
  onClose,
  table,
  order,
  onChangeStatus,
  saving,
}) {
  const navigate = useNavigate();
  if (!table) return null;

  const isFree = table.status === "free";
  const isOccupied = table.status === "occupied";
  const isReserved = table.status === "reserved";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Table #${table.number}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>

          {isFree && (
            <Button
              icon={ChefHat}
              onClick={() => navigate(`/orders?tableId=${table.id}`)}
            >
              New order
            </Button>
          )}

          {isOccupied && order && (
            <Button
              icon={Receipt}
              onClick={() => navigate(`/billing?orderId=${order.id}`)}
            >
              Go to billing
            </Button>
          )}
        </>
      }
    >
      {/* Status + meta */}
      <div className="flex items-center justify-between mb-6">
        <Badge color={STATUS_BADGE[table.status]}>{table.status}</Badge>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Users size={12} /> {table.seats} seats • {table.zone}
        </span>
      </div>

      {/* Occupied: current order */}
      {isOccupied && order && (
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Current order
          </h3>
          <div className="rounded-lg border border-gray-200 divide-y divide-gray-100">
            {order.items.map((it) => (
              <div
                key={it.id}
                className="px-3 py-2.5 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-gray-800">
                    {it.qty}× {it.name}
                  </p>
                  {it.notes && (
                    <p className="text-xs text-gray-400 italic mt-0.5">
                      "{it.notes}"
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {formatCurrency(it.price * it.qty)}
                  </p>
                  <Badge
                    color={
                      it.status === "served"
                        ? "green"
                        : it.status === "ready"
                          ? "blue"
                          : it.status === "preparing"
                            ? "yellow"
                            : "gray"
                    }
                    className="mt-1"
                  >
                    {it.status}
                  </Badge>
                </div>
              </div>
            ))}
            <div className="px-3 py-2.5 flex items-center justify-between bg-gray-50">
              <span className="text-sm font-medium text-gray-700">Total</span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(orderTotal(order))}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Clock size={12} /> Started {minutesAgo(order.createdAt)} min ago
          </p>
        </section>
      )}

      {/* Reserved: info placeholder */}
      {isReserved && (
        <section className="mb-6 rounded-lg bg-violet-50 border border-violet-200 p-4">
          <p className="text-sm font-medium text-violet-800">
            Reserved for a guest
          </p>
          <p className="text-xs text-violet-600 mt-1">
            Reservation details will appear here in Step 11.
          </p>
        </section>
      )}

      {/* Free: hint */}
      {isFree && (
        <section className="mb-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
          <p className="text-sm font-medium text-emerald-800">Table is free</p>
          <p className="text-xs text-emerald-600 mt-1">
            Start a new order or reserve it for a future guest.
          </p>
        </section>
      )}

      {/* Status actions */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Change status
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={isFree ? "primary" : "secondary"}
            size="sm"
            disabled={isFree || saving}
            onClick={() => onChangeStatus(table.id, "free", null)}
          >
            Free
          </Button>
          <Button
            variant={isReserved ? "primary" : "secondary"}
            size="sm"
            icon={CalendarPlus}
            disabled={isReserved || saving}
            onClick={() => onChangeStatus(table.id, "reserved", null)}
          >
            Reserved
          </Button>
          <Button
            variant={isOccupied ? "primary" : "secondary"}
            size="sm"
            disabled={isOccupied || saving}
            onClick={() =>
              onChangeStatus(table.id, "occupied", table.currentOrderId)
            }
          >
            Occupied
          </Button>
        </div>

        {isOccupied && (
          <Button
            variant="ghost"
            size="sm"
            icon={Unlock}
            className="mt-3 w-full"
            disabled={saving}
            onClick={() => onChangeStatus(table.id, "free", null)}
          >
            Free table (keeps order)
          </Button>
        )}
      </section>

      {/* Debug: currentOrderId */}
      {table.currentOrderId && (
        <p className="text-[11px] text-gray-400 mt-6 text-center">
          Linked order: {table.currentOrderId}
        </p>
      )}
    </Drawer>
  );
}
