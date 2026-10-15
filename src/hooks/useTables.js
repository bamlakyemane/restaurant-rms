import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

export function useTables() {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, o] = await Promise.all([api.getTables(), api.getOrders()]);
      setTables(t);
      setOrders(o);
    } catch {
      toast.error("Failed to load tables");
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect: run load() once on mount, but guard against setState-after-unmount
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [t, o] = await Promise.all([api.getTables(), api.getOrders()]);
        if (cancelled) return;
        setTables(t);
        setOrders(o);
      } catch {
        if (!cancelled) toast.error("Failed to load tables");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []); // ⬅ note: empty dep array, no `load` dependency

  const setStatus = async (tableId, status, currentOrderId = null) => {
    setSaving(true);
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId ? { ...t, status, currentOrderId } : t,
      ),
    );
    try {
      await api.updateTable(tableId, { status, currentOrderId });
    } catch {
      toast.error("Failed to update table");
      await load();
    } finally {
      setSaving(false);
    }
  };

  return { tables, orders, loading, saving, reload: load, setStatus };
}
