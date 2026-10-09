import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary:   'bg-brand-500 hover:bg-brand-600 text-white shadow-sm',
  secondary: 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300',
  ghost:     'bg-transparent hover:bg-gray-100 text-gray-700',
  danger:    'bg-red-500 hover:bg-red-600 text-white shadow-sm',
  success:   'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...rest
}) {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg font-medium transition
        focus:outline-none focus:ring-2 focus:ring-brand-500/40
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}
      `}
      {...rest}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </button>
  )
}