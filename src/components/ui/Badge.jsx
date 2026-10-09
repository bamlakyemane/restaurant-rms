const COLORS = {
  gray:    'bg-gray-100 text-gray-700',
  brand:   'bg-brand-50 text-brand-700',
  green:   'bg-emerald-50 text-emerald-700',
  yellow:  'bg-amber-50 text-amber-700',
  red:     'bg-red-50 text-red-700',
  blue:    'bg-sky-50 text-sky-700',
  purple:  'bg-violet-50 text-violet-700',
}

export default function Badge({ children, color = 'gray', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${COLORS[color]} ${className}`}>
      {children}
    </span>
  )
}