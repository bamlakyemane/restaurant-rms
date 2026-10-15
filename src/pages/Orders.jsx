import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ClipboardList, Plus } from "lucide-react";
import { Button, Card, EmptyState, PageHeader, Select } from "../components/ui";
import ConfirmModal from "../components/ui/ConfirmModal";
import OrderCard from "../components/features/OrderCard";
import OrderDetailDrawer from "../components/features/OrderDetailDrawer";
import NewOrderModal from "../components/features/NewOrderModal";
import { useOrders } from "../hooks/useOrders";
import { useAuth } from "../context/AuthContext";

const TABS = [
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "served", label: "Served" },
  { key: "paid", label: "Paid" },
];

export default function Orders() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();

  const {
    orders,
    tables,
    menu,
    loading,
    saving,
    createOrder,
    updateItemStatus,
    sendToKitchen,
    cancelOrder,
  } = useOrders();

  const [tab, setTab] = useState("active");
  const [tableFilter, setTableFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOpen, setNewOpen] = useState(false);
  const [canceling, setCanceling] = useState(null);
  const preselectedTableId = params.get("tableId") || "";

  // Modal is open if the user clicked "New order" OR they came from a table deep-link
  const isNewOrderOpen = newOpen || !!preselectedTableId;
  /*
  // Auto-open New Order modal if coming from Tables page
  useEffect(() => {
    if (preselectedTableId) setNewOpen(true);
  }, [preselectedTableId]);
*/

  useEffect(() => {
    console.log("selectedOrder:", selectedOrder);
    console.log("selectedFresh:", selectedFresh);
    console.log("drawer open:", !!selectedFresh);
  }, [selectedOrder, selectedFresh]);

  const tableById = useMemo(
    () => Object.fromEntries(tables.map((t) => [t.id, t])),
    [tables],
  );

  // Filter logic
  const visibleOrders = useMemo(() => {
    return orders
      .filter((o) => {
        if (tab === "active") {
          return !["paid", "cancelled", "served"].includes(o.status);
        }
        return o.status === tab;
      })
      .filter((o) => tableFilter === "all" || o.tableId === tableFilter)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, tab, tableFilter]);

  const tabCounts = useMemo(() => {
    const c = {
      active: 0,
      pending: 0,
      preparing: 0,
      ready: 0,
      served: 0,
      paid: 0,
    };
    orders.forEach((o) => {
      if (!["paid", "cancelled", "served"].includes(o.status)) c.active++;
      if (c[o.status] !== undefined) c[o.status]++;
    });
    return c;
  }, [orders]);

  // Keep the drawer's selected order fresh
  const selectedFresh = selectedOrder
    ? orders.find((o) => o.id === selectedOrder.id)
    : null;

  // Handlers
  const handleCreate = async ({ tableId, items }) => {
    await createOrder({ tableId, waiterId: user?.id, items });
    // clear ?tableId query param
    params.delete("tableId");
    setParams(params, { replace: true });
  };

  const handleSendToKitchen = async () => {
    if (selectedFresh) await sendToKitchen(selectedFresh.id);
  };

  const handleCancel = async () => {
    if (!canceling) return;
    await cancelOrder(canceling.id);
    setCanceling(null);
    setSelectedOrder(null);
  };

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle={`${tabCounts.active} active order${tabCounts.active !== 1 ? "s" : ""}`}
        action={
          <Button icon={Plus} onClick={() => setNewOpen(true)}>
            New order
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

      {/* Table filter */}
      <Card className="mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Filter by table:</span>
          <Select
            value={tableFilter}
            onChange={(e) => setTableFilter(e.target.value)}
            className="max-w-xs"
          >
            <option value="all">All tables</option>
            {tables.map((t) => (
              <option key={t.id} value={t.id}>
                Table #{t.number} ({t.zone})
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Orders list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : visibleOrders.length === 0 ? (
        <Card>
          <EmptyState
            icon={ClipboardList}
            title={`No ${tab === "active" ? "active" : tab} orders`}
            description={
              tab === "active"
                ? "Create an order to get started."
                : `Orders marked "${tab}" will appear here.`
            }
            action={
              tab === "active" && (
                <Button icon={Plus} onClick={() => setNewOpen(true)}>
                  New order
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {visibleOrders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              table={tableById[o.tableId]}
              onClick={setSelectedOrder}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <NewOrderModal
        key={isNewOrderOpen ? preselectedTableId || "new" : "closed"}
        open={isNewOrderOpen}
        onClose={() => {
          setNewOpen(false);
          if (preselectedTableId) {
            params.delete("tableId");
            setParams(params, { replace: true });
          }
        }}
        tables={tables}
        menu={menu}
        preselectedTableId={preselectedTableId}
        onSubmit={handleCreate}
        saving={saving}
      />

      <OrderDetailDrawer
        open={!!selectedFresh}
        onClose={() => setSelectedOrder(null)}
        order={selectedFresh}
        table={selectedFresh ? tableById[selectedFresh.tableId] : null}
        saving={saving}
        onUpdateItemStatus={updateItemStatus}
        onSendToKitchen={handleSendToKitchen}
        onCancel={() => setCanceling(selectedFresh)}
      />

      <ConfirmModal
        open={!!canceling}
        onClose={() => setCanceling(null)}
        onConfirm={handleCancel}
        title={`Cancel order #${canceling?.id.slice(-4)}?`}
        description="The order will be marked cancelled and the table freed."
        confirmLabel="Cancel order"
        cancelLabel="Keep it"
        loading={saving}
      />
    </>
  );
}
