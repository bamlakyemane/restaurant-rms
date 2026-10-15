import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

export function useMenu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const items = await api.getMenu();
      setMenu(items);
    } catch {
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createItem = async (payload) => {
    setSaving(true);
    try {
      const created = await api.createMenuItem(payload);
      setMenu((prev) => [...prev, created]);
      toast.success(`"${created.name}" added to the menu`);
      return created;
    } catch {
      toast.error("Failed to add item");
      throw new Error("create failed");
    } finally {
      setSaving(false);
    }
  };

  const updateItem = async (id, patch) => {
    setSaving(true);
    try {
      const updated = await api.updateMenuItem(id, patch);
      setMenu((prev) => prev.map((m) => (m.id === id ? updated : m)));
      toast.success("Item updated");
      return updated;
    } catch {
      toast.error("Failed to update item");
      throw new Error("update failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id) => {
    setSaving(true);
    try {
      await api.deleteMenuItem(id);
      setMenu((prev) => prev.filter((m) => m.id !== id));
      toast.success("Item deleted");
      return true;
    } catch {
      toast.error("Failed to delete item");
      throw new Error("delete failed");
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (item) => {
    // Optimistic update
    setMenu((prev) =>
      prev.map((m) =>
        m.id === item.id ? { ...m, available: !m.available } : m,
      ),
    );
    try {
      await api.updateMenuItem(item.id, { available: !item.available });
    } catch {
      // Roll back on failure
      setMenu((prev) =>
        prev.map((m) =>
          m.id === item.id ? { ...m, available: item.available } : m,
        ),
      );
      toast.error("Failed to toggle availability");
    }
  };

  return {
    menu,
    loading,
    saving,
    reload: load,
    createItem,
    updateItem,
    deleteItem,
    toggleAvailability,
  };
}
