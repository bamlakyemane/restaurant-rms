import { useMemo, useState } from "react";
import { Armchair } from "lucide-react";
import { Card, EmptyState, PageHeader, Badge } from "../components/ui";
import TableCard from "../components/features/TableCard";
import TableDrawer from "../components/features/TableDrawer";
import { useTables } from "../hooks/useTables";

const ZONE_ORDER = ["Window", "Main", "Patio", "Private"];

export default function Tables() {
  const { tables, orders, loading, saving, setStatus } = useTables();
  const [selected, setSelected] = useState(null);

  // Map orderId -> order
  const orderById = useMemo(
    () => Object.fromEntries(orders.map((o) => [o.id, o])),
    [orders],
  );

  // Group tables by zone
  const grouped = useMemo(() => {
    const map = {};
    tables.forEach((t) => {
      if (!map[t.zone]) map[t.zone] = [];
      map[t.zone].push(t);
    });
    // Sort tables inside each zone by number
    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => a.number - b.number),
    );
    return map;
  }, [tables]);

  const counts = useMemo(() => {
    const c = { free: 0, occupied: 0, reserved: 0 };
    tables.forEach((t) => c[t.status]++);
    return c;
  }, [tables]);

  // Keep `selected` in sync with freshest table data
  const selectedFresh = selected
    ? tables.find((t) => t.id === selected.id)
    : null;
  const selectedOrder = selectedFresh?.currentOrderId
    ? orderById[selectedFresh.currentOrderId]
    : null;

  return (
    <>
      <PageHeader
        title="Tables"
        subtitle={`${tables.length} tables across ${Object.keys(grouped).length} zones`}
        action={
          <div className="flex items-center gap-2">
            <Badge color="green">Free: {counts.free}</Badge>
            <Badge color="brand">Occupied: {counts.occupied}</Badge>
            <Badge color="purple">Reserved: {counts.reserved}</Badge>
          </div>
        }
      />

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : tables.length === 0 ? (
        <Card>
          <EmptyState icon={Armchair} title="No tables configured" />
        </Card>
      ) : (
        <div className="space-y-8">
          {ZONE_ORDER.filter((z) => grouped[z]?.length).map((zone) => (
            <section key={zone}>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {zone}
                </h2>
                <span className="text-xs text-gray-400">
                  {grouped[zone].length} table
                  {grouped[zone].length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {grouped[zone].map((t) => (
                  <TableCard
                    key={t.id}
                    table={t}
                    order={
                      t.currentOrderId ? orderById[t.currentOrderId] : null
                    }
                    onClick={setSelected}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <TableDrawer
        open={!!selectedFresh}
        onClose={() => setSelected(null)}
        table={selectedFresh}
        order={selectedOrder}
        onChangeStatus={setStatus}
        saving={saving}
      />
    </>
  );
}
