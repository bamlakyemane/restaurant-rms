import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

const POLL_MS = 15000;

export function useKitchen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(() => Date.now());
  const timerRef = useRef(null);

  const fetchOrders = useCallback(async () => {
    try {
      const list = await api.getOrders();
      setOrders(list);
      setLastRefresh(Date.now());
    } catch {
      // silent on poll failures — avoid toast spam
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + polling
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const list = await api.getOrders();
        if (cancelled) return;
        setOrders(list);
        setLastRefresh(Date.now());
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    timerRef.current = setInterval(() => {
      if (!cancelled) fetchOrders();
    }, POLL_MS);

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchOrders]);

  // Update a single item's status
  const updateItem = async (orderId, itemId, status) => {
    setSaving(true);
    try {
      const updated = await api.updateOrderItemStatus(orderId, itemId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch {
      toast.error("Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  // Bulk action: mark all items in an order to a status
  const bulkUpdate = async (orderId, status) => {
    setSaving(true);
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;
      let latest = order;
      for (const it of order.items) {
        if (it.status !== "served" && it.status !== status) {
          latest = await api.updateOrderItemStatus(orderId, it.id, status);
        }
      }
      setOrders((prev) => prev.map((o) => (o.id === orderId ? latest : o)));
    } catch {
      toast.error("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  // Group orders into kitchen columns
  const columns = useCallback(() => {
    const active = orders.filter(
      (o) => !["paid", "cancelled", "served"].includes(o.status),
    );

    const byOldest = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);

    const newCol = [];
    const preparingCol = [];
    const readyCol = [];

    active.forEach((o) => {
      const statuses = o.items.map((it) => it.status);
      if (statuses.includes("pending")) newCol.push(o);
      if (statuses.includes("preparing")) preparingCol.push(o);
      if (statuses.includes("ready")) readyCol.push(o);
    });

    return {
      new: newCol.sort(byOldest),
      preparing: preparingCol.sort(byOldest),
      ready: readyCol.sort(byOldest),
    };
  }, [orders]);

  return {
    orders,
    loading,
    saving,
    lastRefresh,
    updateItem,
    bulkUpdate,
    columns,
    refresh: fetchOrders,
  };
}
