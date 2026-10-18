export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  color = "brand",
}) {
  const BG = {
    brand: "bg-brand-50 text-brand-600",
    green: "bg-emerald-50 text-emerald-600",
    blue: "bg-sky-50 text-sky-600",
    purple: "bg-violet-50 text-violet-600",
    yellow: "bg-amber-50 text-amber-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500">{label}</p>
        {Icon && (
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${BG[color]}`}
          >
            <Icon size={18} />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
