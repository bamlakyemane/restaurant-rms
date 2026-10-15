import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [o, t, m] = await Promise.all([
        api.getOrders(),
        api.getTables(),
        api.getMenu(),
      ]);
      setOrders(o);
      setTables(t);
      setMenu(m);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [o, t, m] = await Promise.all([
          api.getOrders(),
          api.getTables(),
          api.getMenu(),
        ]);
        if (cancelled) return;
        setOrders(o);
        setTables(t);
        setMenu(m);
      } catch {
        if (!cancelled) toast.error("Failed to load orders");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const createOrder = async ({ tableId, waiterId, items }) => {
    setSaving(true);
    try {
      const created = await api.createOrder({ tableId, waiterId, items });
      // Reload tables too, since the API marks the table occupied
      const [nextTables] = await Promise.all([api.getTables()]);
      setTables(nextTables);
      setOrders((prev) => [...prev, created]);
      toast.success("Order created");
      return created;
    } catch {
      toast.error("Failed to create order");
      throw new Error("create failed");
    } finally {
      setSaving(false);
    }
  };

  const updateItemStatus = async (orderId, itemId, status) => {
    try {
      const updated = await api.updateOrderItemStatus(orderId, itemId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      return updated;
    } catch {
      toast.error("Failed to update item");
      throw new Error("update failed");
    }
  };

  const sendToKitchen = async (orderId) => {
    setSaving(true);
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;
      // Flip all pending items to preparing
      let latest = order;
      for (const it of order.items) {
        if (it.status === "pending") {
          latest = await api.updateOrderItemStatus(orderId, it.id, "preparing");
        }
      }
      setOrders((prev) => prev.map((o) => (o.id === orderId ? latest : o)));
      toast.success("Sent to kitchen");
    } catch {
      toast.error("Failed to send to kitchen");
    } finally {
      setSaving(false);
    }
  };

  const cancelOrder = async (orderId) => {
    setSaving(true);
    try {
      const updated = await api.updateOrder(orderId, { status: "cancelled" });
      // Free the table
      const order = orders.find((o) => o.id === orderId);
      if (order)
        await api.updateTable(order.tableId, {
          status: "free",
          currentOrderId: null,
        });
      const nextTables = await api.getTables();
      setTables(nextTables);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      toast.success("Order cancelled");
    } catch {
      toast.error("Failed to cancel order");
    } finally {
      setSaving(false);
    }
  };

  const payOrder = async (orderId) => {
    setSaving(true);
    try {
      const paid = await api.payOrder(orderId);
      const nextTables = await api.getTables();
      setTables(nextTables);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? paid : o)));
      toast.success("Payment recorded");
    } catch {
      toast.error("Failed to record payment");
    } finally {
      setSaving(false);
    }
  };

  return {
    orders,
    tables,
    menu,
    loading,
    saving,
    reload: load,
    createOrder,
    updateItemStatus,
    sendToKitchen,
    cancelOrder,
    payOrder,
  };
}
