import { Phone, Users, Calendar, Clock, Pencil, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { formatDate } from "../../utils/formatters";

const STATUS_COLOR = {
  confirmed: "green",
  seated: "blue",
  cancelled: "red",
  completed: "purple",
};

export default function ReservationCard({
  reservation,
  onEdit,
  onDelete,
  onStatusChange,
  saving,
}) {
  const { customerName, phone, guests, date, time, notes, status } =
    reservation;

  // Determine if this is upcoming, past, or today
  const today = new Date().toISOString().slice(0, 10);
  const isToday = date === today;
  const isPast = date < today;

  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-200 shadow-sm p-4
        ${status === "cancelled" ? "opacity-60" : ""}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Left: date block */}
        <div
          className={`
            w-16 shrink-0 rounded-lg text-center py-2
            ${isToday ? "bg-brand-500 text-white" : isPast ? "bg-gray-100 text-gray-500" : "bg-brand-50 text-brand-700"}
          `}
        >
          <p className="text-xs font-medium uppercase tracking-wide">
            {new Date(date).toLocaleDateString(undefined, { month: "short" })}
          </p>
          <p className="text-2xl font-bold leading-tight">
            {new Date(date).getDate()}
          </p>
        </div>

        {/* Middle: details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="font-semibold text-gray-800">{customerName}</p>
            <Badge color={STATUS_COLOR[status] ?? "gray"}>{status}</Badge>
            {isToday && <Badge color="brand">Today</Badge>}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {time}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} /> {guests} guest{guests !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <Phone size={12} /> {phone}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {formatDate(date)}
            </span>
          </div>

          {notes && (
            <p className="text-xs text-gray-500 italic mt-2">"{notes}"</p>
          )}
        </div>

        {/* Right: actions */}
        <div className="shrink-0 flex items-center gap-1">
          <button
            onClick={() => onEdit(reservation)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
            aria-label="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(reservation)}
            className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
            aria-label="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Status actions */}
      {status !== "cancelled" && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
          {status !== "confirmed" && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onStatusChange(reservation.id, "confirmed")}
              disabled={saving}
            >
              Confirm
            </Button>
          )}
          {status !== "seated" && !isPast && (
            <Button
              size="sm"
              onClick={() => onStatusChange(reservation.id, "seated")}
              disabled={saving}
            >
              Seat now
            </Button>
          )}
          <Button
            size="sm"
            variant="danger"
            onClick={() => onStatusChange(reservation.id, "cancelled")}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
