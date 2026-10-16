import { useEffect, useState } from "react";
import { api } from "../services/api";
import { formatCurrency, orderTotal, minutesAgo } from "../utils/formatters";
import { Card, CardHeader, Badge, PageHeader } from "../components/ui";

export default function Dashboard() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [m, o] = await Promise.all([api.getMenu(), api.getOrders()]);
        if (cancelled) return;
        setMenu(m);
        setOrders(o);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter(
    (o) => !["paid", "cancelled"].includes(o.status),
  );
  const todayRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + orderTotal(o), 0);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of today's activity" />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-500">Menu items</p>
          <p className="text-3xl font-bold text-gray-800">{menu.length}</p>
          <p className="text-xs text-gray-400 mt-1">
            {menu.filter((m) => m.available).length} available
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Active orders</p>
          <p className="text-3xl font-bold text-gray-800">
            {activeOrders.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {orders.filter((o) => o.status === "pending").length} pending
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Total revenue (all orders)</p>
          <p className="text-3xl font-bold text-gray-800">
            {formatCurrency(todayRevenue)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            across {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent orders" subtitle="Latest activity" />
        {orders.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No orders yet. Create one from the Orders page.
          </p>
        ) : (
          <div className="space-y-3">
            {[...orders]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between border border-gray-200 rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      Order #{o.id.slice(-4)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {minutesAgo(o.createdAt)} min ago •{" "}
                      {o.items.reduce((n, it) => n + it.qty, 0)} items
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      color={
                        o.status === "paid"
                          ? "purple"
                          : o.status === "served"
                            ? "green"
                            : o.status === "preparing"
                              ? "yellow"
                              : o.status === "ready"
                                ? "blue"
                                : o.status === "cancelled"
                                  ? "red"
                                  : "gray"
                      }
                    >
                      {o.status}
                    </Badge>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(orderTotal(o))}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </Card>
    </>
  );
}
