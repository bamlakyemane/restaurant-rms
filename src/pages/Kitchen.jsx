import { useEffect, useState } from "react";
import { ChefHat, Maximize2, Minimize2, RefreshCw } from "lucide-react";
import { Badge, Button, EmptyState, Card } from "../components/ui";
import KitchenTicket from "../components/features/KitchenTicket";
import { useKitchen } from "../hooks/useKitchen";

export default function Kitchen() {
  const {
    loading,
    saving,
    lastRefresh,
    updateItem,
    bulkUpdate,
    columns,
    refresh,
  } = useKitchen();

  const [fullscreen, setFullscreen] = useState(false);
  const [tick, setTick] = useState(0); // force re-render every 30s for time badges

  // Refresh elapsed-time badges every 30s
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  // Fullscreen API
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setFullscreen(true);
      } else {
        await document.exitFullscreen();
        setFullscreen(false);
      }
    } catch {
      /* user may have denied */
    }
  };

  // React to ESC exiting fullscreen
  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-72 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const cols = columns();
  const totalActive =
    cols.new.length + cols.preparing.length + cols.ready.length;

  return (
    <div
      className={
        fullscreen ? "bg-gray-50 -m-4 md:-m-6 p-4 md:p-6 min-h-screen" : ""
      }
    >
      <div key={tick} className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-500 text-white flex items-center justify-center">
            <ChefHat size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Kitchen Display</h1>
            <p className="text-xs text-gray-500">
              {totalActive} active ticket{totalActive !== 1 ? "s" : ""} • last
              update {new Date(lastRefresh).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={refresh}
          >
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={fullscreen ? Minimize2 : Maximize2}
            onClick={toggleFullscreen}
          >
            {fullscreen ? "Exit" : "Full screen"}
          </Button>
        </div>
      </div>

      {/* Columns */}
      {totalActive === 0 ? (
        <Card>
          <EmptyState
            icon={ChefHat}
            title="All caught up!"
            description="No active tickets. New orders will appear here automatically."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* NEW */}
          <Column
            title="New"
            color="sky"
            count={cols.new.length}
            tickets={cols.new}
            variant="new"
            onItemStart={updateItem}
            onItemReady={updateItem}
            onItemServe={updateItem}
            onBulkStart={(id) => bulkUpdate(id, "preparing")}
            onBulkReady={(id) => bulkUpdate(id, "ready")}
            saving={saving}
          />

          {/* PREPARING */}
          <Column
            title="Preparing"
            color="amber"
            count={cols.preparing.length}
            tickets={cols.preparing}
            variant="preparing"
            onItemStart={updateItem}
            onItemReady={updateItem}
            onItemServe={updateItem}
            onBulkStart={(id) => bulkUpdate(id, "preparing")}
            onBulkReady={(id) => bulkUpdate(id, "ready")}
            saving={saving}
          />

          {/* READY */}
          <Column
            title="Ready"
            color="emerald"
            count={cols.ready.length}
            tickets={cols.ready}
            variant="ready"
            onItemStart={updateItem}
            onItemReady={updateItem}
            onItemServe={updateItem}
            onBulkStart={(id) => bulkUpdate(id, "preparing")}
            onBulkReady={(id) => bulkUpdate(id, "ready")}
            saving={saving}
          />
        </div>
      )}
    </div>
  );
}

// ---------- Column subcomponent ----------
function Column({
  title,
  color,
  count,
  tickets,
  variant,
  onItemStart,
  onItemReady,
  onItemServe,
  onBulkStart,
  onBulkReady,
  saving,
}) {
  const DOT = {
    sky: "bg-sky-500",
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
  };

  return (
    <div className="flex flex-col">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2.5 h-2.5 rounded-full ${DOT[color]}`} />
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {title}
        </h2>
        <Badge color="gray">{count}</Badge>
      </div>

      {/* Tickets */}
      <div className="space-y-3">
        {tickets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
            <p className="text-xs text-gray-400">Empty</p>
          </div>
        ) : (
          tickets.map((o) => (
            <KitchenTicket
              key={o.id}
              order={o}
              variant={variant}
              onItemStart={onItemStart}
              onItemReady={onItemReady}
              onItemServe={onItemServe}
              onBulkStart={onBulkStart}
              onBulkReady={onBulkReady}
              saving={saving}
            />
          ))
        )}
      </div>
    </div>
  );
}
