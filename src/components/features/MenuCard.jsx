import { Clock, Pencil, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import { formatCurrency } from "../../utils/formatters";

export default function MenuCard({
  item,
  onEdit,
  onDelete,
  onToggleAvailable,
}) {
  const { name, description, price, category, available, prepTime, image } =
    item;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      {/* "Image" area — emoji on a soft bg */}
      <div className="h-28 bg-gradient-to-br from-brand-50 to-amber-50 flex items-center justify-center text-5xl relative">
        <span>{image || "🍽️"}</span>
        <button
          onClick={() => onToggleAvailable(item)}
          className="absolute top-2 right-2"
          title={
            available ? "Click to mark unavailable" : "Click to mark available"
          }
        >
          <Badge color={available ? "green" : "red"}>
            {available ? "Available" : "Out of stock"}
          </Badge>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-800 leading-tight">{name}</h3>
          <span className="text-brand-600 font-semibold shrink-0">
            {formatCurrency(price)}
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
          {description || "No description"}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Badge color="gray">{category}</Badge>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {prepTime}m
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(item)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
              aria-label="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
