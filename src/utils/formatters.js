export const formatCurrency = (n) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number(n) || 0)

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  })

export const minutesAgo = (iso) =>
  Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))

export const orderTotal = (order) =>
  order.items.reduce((sum, it) => sum + it.price * it.qty, 0)

export const TAX_RATE = 0.08