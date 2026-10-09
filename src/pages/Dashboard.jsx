import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { formatCurrency, orderTotal, minutesAgo } from '../utils/formatters'
import { Card, CardHeader, Badge, PageHeader, Button } from '../components/ui'

export default function Dashboard() {
  const [menu, setMenu] = useState([])
  const [tables, setTables] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getMenu(), api.getTables(), api.getOrders()]).then(
      ([m, t, o]) => {
        setMenu(m); setTables(t); setOrders(o); setLoading(false)
      }
    )
  }, [])

  if (loading) return <p className="text-gray-500">Loading…</p>

  return (
    <>
      <PageHeader title="Dashboard" subtitle="API layer sanity check" />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-500">Menu items</p>
          <p className="text-3xl font-bold text-gray-800">{menu.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Tables</p>
          <p className="text-3xl font-bold text-gray-800">{tables.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Active orders</p>
          <p className="text-3xl font-bold text-gray-800">
            {orders.filter((o) => o.status !== 'paid').length}
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent orders" subtitle="Pulled from the fake API" />
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between border border-gray-200 rounded-lg p-3"
            >
              <div>
                <p className="font-medium text-gray-800">Order #{o.id.slice(-4)}</p>
                <p className="text-xs text-gray-500">
                  Table {tables.find((t) => t.id === o.tableId)?.number ?? '—'} •{' '}
                  {minutesAgo(o.createdAt)} min ago
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge color={o.status === 'preparing' ? 'yellow' : 'gray'}>
                  {o.status}
                </Badge>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(orderTotal(o))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}