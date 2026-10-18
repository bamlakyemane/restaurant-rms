import { useMemo, useState } from "react";
import {
  Users,
  Plus,
  Search,
  Shield,
  ChefHat,
  HandPlatter,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  EmptyState,
  PageHeader,
  Input,
  Badge,
} from "../components/ui";
import ConfirmModal from "../components/ui/ConfirmModal";
import StaffCard from "../components/features/StaffCard";
import StaffFormModal from "../components/features/StaffFormModal";
import { useStaff } from "../hooks/useStaff";
import { useAuth } from "../context/AuthContext";

const TABS = [
  { key: "all", label: "All" },
  { key: "admin", label: "Admins" },
  { key: "waiter", label: "Waiters" },
  { key: "chef", label: "Chefs" },
];

const ROLE_INFO = [
  {
    key: "admin",
    label: "Admin",
    icon: Shield,
    color: "purple",
    perms:
      "Full access — all pages, staff management, menu editing, kitchen, orders, reservations.",
  },
  {
    key: "waiter",
    label: "Waiter",
    icon: HandPlatter,
    color: "blue",
    perms:
      "Menu (view), Orders (full), Reservations (full). No kitchen, no staff.",
  },
  {
    key: "chef",
    label: "Chef",
    icon: ChefHat,
    color: "yellow",
    perms:
      "Kitchen (full), Orders (view/update). No menu editing, no reservations, no staff.",
  },
];

export default function Staff() {
  const { user: currentUser } = useAuth();
  const { users, loading, saving, create, update, remove } = useStaff();

  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (tab !== "all" && u.role !== tab) return false;
      if (q && !`${u.name} ${u.email}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [users, tab, search]);

  const counts = useMemo(() => {
    const c = { all: users.length, admin: 0, waiter: 0, chef: 0 };
    users.forEach((u) => {
      c[u.role] = (c[u.role] || 0) + 1;
    });
    return c;
  }, [users]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    if (editing) await update(editing.id, payload);
    else await create(payload);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    if (deleting.id === currentUser?.id) {
      setDeleting(null);
      return;
    }
    await remove(deleting.id);
    setDeleting(null);
  };

  return (
    <>
      <PageHeader
        title="Staff"
        subtitle={`${users.length} team member${users.length !== 1 ? "s" : ""}`}
        action={
          <Button icon={Plus} onClick={openCreate}>
            Add staff
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-2
              ${
                tab === t.key
                  ? "bg-brand-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            {t.label}
            <span
              className={`text-xs px-1.5 rounded-full ${tab === t.key ? "bg-white/20" : "bg-white"}`}
            >
              {counts[t.key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <Card className="mb-6">
        <div className="relative md:w-96">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Role permissions preview */}
      <Card className="mb-6">
        <CardHeader
          title="Role permissions"
          subtitle="What each role can access"
        />
        <div className="grid md:grid-cols-3 gap-3">
          {ROLE_INFO.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.key}
                className="rounded-lg border border-gray-200 p-4 bg-gray-50/50 dark:bg-white/5 dark:border-gray-700"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${r.color}-50`}
                  >
                    <Icon
                      size={16}
                      className="text-gray-700 dark:text-gray-300"
                    />
                  </div>
                  <Badge color={r.color}>{r.label}</Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {r.perms}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users}
            title="No staff match"
            description={
              users.length === 0
                ? "Add your first team member to get started."
                : "Try a different filter or search term."
            }
            action={
              users.length === 0 && (
                <Button icon={Plus} onClick={openCreate}>
                  Add staff
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => (
            <StaffCard
              key={u.id}
              user={u}
              isSelf={u.id === currentUser?.id}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <StaffFormModal
        key={formOpen ? (editing?.id ?? "new") : "closed"}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        user={editing}
        saving={saving}
        isSelf={editing?.id === currentUser?.id}
      />

      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title={`Remove ${deleting?.name}?`}
        description="This staff member will lose access immediately."
        confirmLabel="Remove"
        loading={saving}
      />
    </>
  );
}
