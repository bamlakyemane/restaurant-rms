import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [o, m] = await Promise.all([api.getOrders(), api.getMenu()]);
      setOrders(o);
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
        const [o, m] = await Promise.all([api.getOrders(), api.getMenu()]);
        if (cancelled) return;
        setOrders(o);
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

  const createOrder = async (payload) => {
    setSaving(true);
    try {
      const created = await api.createOrder(payload);
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
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      toast.success("Order cancelled");
    } catch {
      toast.error("Failed to cancel order");
    } finally {
      setSaving(false);
    }
  };

  return {
    orders,
    menu,
    loading,
    saving,
    reload: load,
    createOrder,
    updateItemStatus,
    sendToKitchen,
    cancelOrder,
  };
}
