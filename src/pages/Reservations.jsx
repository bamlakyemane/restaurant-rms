import { useMemo, useState } from "react";
import { CalendarClock, Plus, Search } from "lucide-react";
import {
  Button,
  Card,
  EmptyState,
  PageHeader,
  Input,
  Select,
} from "../components/ui";
import ConfirmModal from "../components/ui/ConfirmModal";
import ReservationCard from "../components/features/ReservationCard";
import ReservationFormModal from "../components/features/ReservationFormModal";
import { useReservations } from "../hooks/useReservations";

const TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "cancelled", label: "Cancelled" },
];

const DATE_FILTERS = [
  { key: "all", label: "All dates" },
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
];

export default function Reservations() {
  const {
    reservations,
    loading,
    saving,
    create,
    update,
    changeStatus,
    remove,
  } = useReservations();

  const [tab, setTab] = useState("upcoming");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { today, weekEnd } = useMemo(() => {
    const now = new Date();
    const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      today: now.toISOString().slice(0, 10),
      weekEnd: end.toISOString().slice(0, 10),
    };
  }, []);

  // Derived list
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();

    return reservations
      .filter((r) => {
        // Tab filter
        if (tab === "cancelled" && r.status !== "cancelled") return false;
        if (tab !== "cancelled" && r.status === "cancelled") return false;
        if (tab === "upcoming" && r.date < today) return false;
        if (tab === "past" && r.date >= today) return false;

        // Date filter
        if (dateFilter === "today" && r.date !== today) return false;
        if (dateFilter === "week" && (r.date < today || r.date > weekEnd))
          return false;

        // Search
        if (q) {
          const haystack = `${r.customerName} ${r.phone}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aKey = `${a.date}T${a.time}`;
        const bKey = `${b.date}T${b.time}`;
        // Past tab = newest first, others = soonest first
        return tab === "past"
          ? bKey.localeCompare(aKey)
          : aKey.localeCompare(bKey);
      });
  }, [reservations, tab, search, dateFilter, today, weekEnd]);

  const tabCounts = useMemo(() => {
    const c = { upcoming: 0, past: 0, cancelled: 0 };
    reservations.forEach((r) => {
      if (r.status === "cancelled") c.cancelled++;
      else if (r.date < today) c.past++;
      else c.upcoming++;
    });
    return c;
  }, [reservations, today]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    if (editing) await update(editing.id, payload);
    else await create(payload);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await remove(deleting.id);
    setDeleting(null);
  };

  return (
    <>
      <PageHeader
        title="Reservations"
        subtitle={`${tabCounts.upcoming} upcoming • ${tabCounts.past} past`}
        action={
          <Button icon={Plus} onClick={openCreate}>
            New reservation
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
              {tabCounts[t.key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative md:w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search name or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="md:w-48"
          >
            {DATE_FILTERS.map((d) => (
              <option key={d.key} value={d.key}>
                {d.label}
              </option>
            ))}
          </Select>

          {(search || dateFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setDateFilter("all");
              }}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <Card>
          <EmptyState
            icon={CalendarClock}
            title={`No ${tab} reservations`}
            description={
              tab === "upcoming"
                ? "Create a reservation to get started."
                : `Reservations marked "${tab}" will appear here.`
            }
            action={
              tab === "upcoming" && (
                <Button icon={Plus} onClick={openCreate}>
                  New reservation
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {visible.map((r) => (
            <ReservationCard
              key={r.id}
              reservation={r}
              onEdit={openEdit}
              onDelete={setDeleting}
              onStatusChange={changeStatus}
              saving={saving}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ReservationFormModal
        key={formOpen ? (editing?.id ?? "new") : "closed"}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        reservation={editing}
        saving={saving}
      />

      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title={`Delete reservation for ${deleting?.customerName}?`}
        description="This reservation will be permanently removed."
        confirmLabel="Delete"
        loading={saving}
      />
    </>
  );
}
