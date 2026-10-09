import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) {
  // ESC to close + body scroll lock
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const SIZES = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`relative w-full ${SIZES[size]} bg-white rounded-xl shadow-xl max-h-[90vh] flex flex-col`}>
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="px-5 py-4 overflow-y-auto">{children}</div>

        {footer && (
          <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}