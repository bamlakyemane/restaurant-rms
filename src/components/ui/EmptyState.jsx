export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-12 px-4">
      {Icon && (
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <Icon size={22} className="text-gray-400" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {description && <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}