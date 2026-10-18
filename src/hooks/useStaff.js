import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

export function useStaff() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.getUsers();
      setUsers(list);
    } catch {
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const list = await api.getUsers();
        if (cancelled) return;
        setUsers(list);
      } catch {
        if (!cancelled) toast.error("Failed to load staff");
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
      const created = await api.createUser(payload);
      setUsers((prev) => [...prev, created]);
      toast.success(`${created.name} added to the team`);
      return created;
    } catch (err) {
      toast.error(err.message || "Failed to add staff");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id, patch) => {
    setSaving(true);
    try {
      const updated = await api.updateUser(id, patch);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      toast.success("Staff member updated");
      return updated;
    } catch (err) {
      toast.error(err.message || "Failed to update staff");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    setSaving(true);
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Staff member removed");
    } catch {
      toast.error("Failed to remove staff");
    } finally {
      setSaving(false);
    }
  };

  return {
    users,
    loading,
    saving,
    reload: load,
    create,
    update,
    remove,
  };
}
