import { useMemo, useState } from "react";
import { Plus, Search, UtensilsCrossed } from "lucide-react";
import { Button, Card, EmptyState, PageHeader, Input } from "../components/ui";
import ConfirmModal from "../components/ui/ConfirmModal";
import MenuCard from "../components/features/MenuCard";
import MenuFormModal from "../components/features/MenuFormModal";
import { useMenu } from "../hooks/useMenu";

const CATEGORY_TABS = ["All", "Starters", "Mains", "Desserts", "Drinks"];

export default function Menu() {
  const {
    menu,
    loading,
    saving,
    createItem,
    updateItem,
    deleteItem,
    toggleAvailability,
  } = useMenu();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // ---------- Derived list ----------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return menu.filter((m) => {
      if (category !== "All" && m.category !== category) return false;
      if (availableOnly && !m.available) return false;
      if (q && !`${m.name} ${m.description}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [menu, search, category, availableOnly]);

  // Counts per tab
  const counts = useMemo(() => {
    const map = { All: menu.length };
    CATEGORY_TABS.slice(1).forEach((c) => {
      map[c] = menu.filter((m) => m.category === c).length;
    });
    return map;
  }, [menu]);

  // ---------- Handlers ----------
  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    if (editing) await updateItem(editing.id, payload);
    else await createItem(payload);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await deleteItem(deleting.id);
    setDeleting(null);
  };

  return (
    <>
      <PageHeader
        title="Menu"
        subtitle={`${menu.length} items • ${menu.filter((m) => m.available).length} available`}
        action={
          <Button icon={Plus} onClick={openCreate}>
            Add item
          </Button>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative md:w-80">
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

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setCategory(tab)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-2
                  ${
                    category === tab
                      ? "bg-brand-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                `}
              >
                {tab}
                <span
                  className={`
                    text-xs px-1.5 rounded-full
                    ${category === tab ? "bg-white/20" : "bg-white"}
                  `}
                >
                  {counts[tab] ?? 0}
                </span>
              </button>
            ))}
          </div>

          {/* Available toggle */}
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="w-4 h-4 accent-brand-500"
            />
            Available only
          </label>
        </div>
      </Card>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={UtensilsCrossed}
            title="No items match"
            description={
              menu.length === 0
                ? "Your menu is empty. Add your first dish to get started."
                : "Try adjusting your search or filters."
            }
            action={
              menu.length === 0 && (
                <Button icon={Plus} onClick={openCreate}>
                  Add item
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {filtered.length}
              </span>{" "}
              {filtered.length === 1 ? "item" : "items"}
            </p>
            {(search || category !== "All" || availableOnly) && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setAvailableOnly(false);
                }}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onEdit={openEdit}
                onDelete={setDeleting}
                onToggleAvailable={toggleAvailability}
              />
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <MenuFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        item={editing}
        saving={saving}
      />

      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title={`Delete "${deleting?.name}"?`}
        description="This menu item will be permanently removed."
        confirmLabel="Delete"
        loading={saving}
      />
    </>
  );
}
