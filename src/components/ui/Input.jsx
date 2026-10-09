const BASE =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 ' +
  'placeholder:text-gray-400 transition ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 ' +
  'disabled:bg-gray-50 disabled:text-gray-500'

export function Label({ children, htmlFor, required }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

export function FormField({ label, htmlFor, required, error, hint, children }) {
  return (
    <div>
      {label && <Label htmlFor={htmlFor} required={required}>{label}</Label>}
      {children}
      {error ? (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      ) : hint ? (
        <p className="text-xs text-gray-400 mt-1">{hint}</p>
      ) : null}
    </div>
  )
}

export function Input({ className = '', ...rest }) {
  return <input className={`${BASE} ${className}`} {...rest} />
}

export function Textarea({ className = '', rows = 3, ...rest }) {
  return <textarea rows={rows} className={`${BASE} resize-none ${className}`} {...rest} />
}

export function Select({ className = '', children, ...rest }) {
  return (
    <select className={`${BASE} pr-8 ${className}`} {...rest}>
      {children}
    </select>
  )
}