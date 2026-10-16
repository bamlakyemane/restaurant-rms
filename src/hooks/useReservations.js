import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

export function useReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.getReservations();
      setReservations(list);
    } catch {
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const list = await api.getReservations();
        if (cancelled) return;
        setReservations(list);
      } catch {
        if (!cancelled) toast.error("Failed to load reservations");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const create = async (payload) => {
    setSaving(true);
    try {
      const created = await api.createReservation(payload);
      setReservations((prev) => [...prev, created]);
      toast.success(`Reservation for ${created.customerName} confirmed`);
      return created;
    } catch {
      toast.error("Failed to create reservation");
      throw new Error("create failed");
    } finally {
      setSaving(false);
    }
  };

  const update = async (id, patch) => {
    setSaving(true);
    try {
      const updated = await api.updateReservation(id, patch);
      setReservations((prev) => prev.map((r) => (r.id === id ? updated : r)));
      return updated;
    } catch {
      toast.error("Failed to update reservation");
      throw new Error("update failed");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      const updated = await api.updateReservation(id, { status });
      setReservations((prev) => prev.map((r) => (r.id === id ? updated : r)));
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const remove = async (id) => {
    setSaving(true);
    try {
      await api.deleteReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
      toast.success("Reservation removed");
    } catch {
      toast.error("Failed to remove reservation");
    } finally {
      setSaving(false);
    }
  };

  return {
    reservations,
    loading,
    saving,
    reload: load,
    create,
    update,
    changeStatus,
    remove,
  };
}
