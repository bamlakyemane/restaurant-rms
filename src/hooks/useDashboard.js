import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { orderTotal } from "../utils/formatters";

const DAY_MS = 24 * 60 * 60 * 1000;

export function useDashboard() {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("today"); // 'today' | 'week' | 'all'
  const [lastRefresh, setLastRefresh] = useState(() => Date.now());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [o, m] = await Promise.all([api.getOrders(), api.getMenu()]);
      setOrders(o);
      setMenu(m);
      setLastRefresh(Date.now());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const [o, m] = await Promise.all([api.getOrders(), api.getMenu()]);
        if (cancelled) return;
        setOrders(o);
        setMenu(m);
        setLastRefresh(Date.now());
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    const id = setInterval(() => {
      if (!cancelled) load();
    }, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [load]);

  // Filter orders by range
  const scopedOrders = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();
    const weekAgo = now.getTime() - 7 * DAY_MS;

    return orders.filter((o) => {
      if (o.status === "cancelled") return false;
      const t = new Date(o.createdAt).getTime();
      if (range === "today") return t >= startOfDay;
      if (range === "week") return t >= weekAgo;
      return true;
    });
  }, [orders, range]);

  // KPIs
  const kpis = useMemo(() => {
    const count = scopedOrders.length;
    const revenue = scopedOrders.reduce((s, o) => s + orderTotal(o), 0);
    const avg = count ? revenue / count : 0;
    const active = orders.filter(
      (o) => !["paid", "cancelled", "served"].includes(o.status),
    ).length;

    return { count, revenue, avg, active };
  }, [scopedOrders, orders]);

  // Revenue last 7 days (bar chart)
  const revenue7d = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now.getTime() - (6 - i) * DAY_MS);
      d.setHours(0, 0, 0, 0);
      return {
        key: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString(undefined, { weekday: "short" }),
        total: 0,
      };
    });

    const byDay = Object.fromEntries(days.map((d) => [d.key, d]));
    orders.forEach((o) => {
      if (o.status === "cancelled") return;
      const key = new Date(o.createdAt).toISOString().slice(0, 10);
      if (byDay[key]) byDay[key].total += orderTotal(o);
    });

    return days;
  }, [orders]);

  // Status breakdown (donut)
  const statusBreakdown = useMemo(() => {
    const buckets = {
      pending: 0,
      preparing: 0,
      ready: 0,
      served: 0,
      paid: 0,
      cancelled: 0,
    };
    orders.forEach((o) => {
      buckets[o.status] = (buckets[o.status] || 0) + 1;
    });
    return Object.entries(buckets)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => ({ name: k, value: v }));
  }, [orders]);

  // Top sellers
  const topSellers = useMemo(() => {
    const counts = {};
    scopedOrders.forEach((o) => {
      o.items.forEach((it) => {
        const key = it.menuItemId || it.name;
        if (!counts[key]) counts[key] = { name: it.name, qty: 0, revenue: 0 };
        counts[key].qty += it.qty;
        counts[key].revenue += it.price * it.qty;
      });
    });
    return Object.values(counts)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [scopedOrders]);

  // Recent activity (latest 6)
  const recent = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
  }, [orders]);

  return {
    loading,
    lastRefresh,
    range,
    setRange,
    kpis,
    revenue7d,
    statusBreakdown,
    topSellers,
    recent,
    reload: load,
    menuCount: menu.length,
  };
}
