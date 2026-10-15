import { useMemo, useState } from "react";
import { Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Input, Select } from "../ui/Input";
import { formatCurrency } from "../../utils/formatters";

export default function NewOrderModal({
  open,
  onClose,
  tables,
  menu,
  preselectedTableId,
  onSubmit,
  saving,
}) {
  const [tableId, setTableId] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]); // [{ menuItemId, name, price, qty, notes }]

  /*
  // Reset when modal opens
  useEffect(() => {
    if (!open) return;
    setTableId(preselectedTableId || "");
    setSearch("");
    setCategory("All");
    setCart([]);
  }, [open, preselectedTableId]);
*/
  // Available tables (free only, unless the preselected one is already chosen)
  const freeTables = useMemo(
    () =>
      tables.filter((t) => t.status === "free" || t.id === preselectedTableId),
    [tables, preselectedTableId],
  );

  const categories = useMemo(() => {
    const set = new Set(menu.map((m) => m.category));
    return ["All", ...set];
  }, [menu]);

  const filteredMenu = useMemo(() => {
    const q = search.trim().toLowerCase();
    return menu.filter((m) => {
      if (!m.available) return false;
      if (category !== "All" && m.category !== category) return false;
      if (q && !m.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [menu, search, category]);

  // Cart helpers
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === item.id ? { ...c, qty: c.qty + 1 } : c,
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          qty: 1,
          notes: "",
        },
      ];
    });
  };

  const changeQty = (menuItemId, delta) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.menuItemId === menuItemId ? { ...c, qty: c.qty + delta } : c,
        )
        .filter((c) => c.qty > 0),
    );
  };

  const setNotes = (menuItemId, notes) => {
    setCart((prev) =>
      prev.map((c) => (c.menuItemId === menuItemId ? { ...c, notes } : c)),
    );
  };

  const removeFromCart = (menuItemId) => {
    setCart((prev) => prev.filter((c) => c.menuItemId !== menuItemId));
  };

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const canSubmit = tableId && cart.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      await onSubmit({ tableId, items: cart });
      onClose();
    } catch {
      /* toast shown by hook */
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title="New order"
      footer={
        <>
          <div className="mr-auto text-sm text-gray-600">
            {cart.length > 0 ? (
              <>
                {cart.reduce((n, c) => n + c.qty, 0)} items •{" "}
                <span className="font-semibold text-gray-800">
                  {formatCurrency(total)}
                </span>
              </>
            ) : (
              "Cart is empty"
            )}
          </div>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={saving}
            disabled={!canSubmit}
            icon={ShoppingCart}
          >
            Create order
          </Button>
        </>
      }
    >
      <div className="grid lg:grid-cols-5 gap-5">
        {/* LEFT: Menu browser */}
        <div className="lg:col-span-3">
          <div className="space-y-3 mb-4">
            <Select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
            >
              <option value="">Select a table…</option>
              {freeTables.map((t) => (
                <option key={t.id} value={t.id}>
                  Table #{t.number} — {t.seats} seats ({t.zone})
                </option>
              ))}
            </Select>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  placeholder="Search dishes…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-36"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto pr-1 space-y-2">
            {filteredMenu.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-10">
                No dishes match.
              </p>
            ) : (
              filteredMenu.map((m) => (
                <button
                  key={m.id}
                  onClick={() => addToCart(m)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50/40 transition text-left"
                >
                  <span className="text-2xl">{m.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {m.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {m.category} • {m.prepTime}m
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-brand-600">
                    {formatCurrency(m.price)}
                  </span>
                  <Plus size={16} className="text-gray-400" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: Cart */}
        <div className="lg:col-span-2">
          <div className="sticky top-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ShoppingCart size={16} /> Cart
              </h3>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Clear
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                <p className="text-sm text-gray-400">Click a dish to add it.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {cart.map((c) => (
                  <div
                    key={c.menuItemId}
                    className="rounded-lg border border-gray-200 p-3"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {c.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(c.price)} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(c.menuItemId)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => changeQty(c.menuItemId, -1)}
                          className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {c.qty}
                        </span>
                        <button
                          onClick={() => changeQty(c.menuItemId, 1)}
                          className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        {formatCurrency(c.price * c.qty)}
                      </span>
                    </div>

                    <Input
                      placeholder="Notes (e.g. no onions)"
                      value={c.notes}
                      onChange={(e) => setNotes(c.menuItemId, e.target.value)}
                      className="mt-2 text-xs py-1.5"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
