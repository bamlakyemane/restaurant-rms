import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  ChefHat,
  RefreshCw,
  UtensilsCrossed,
  Flame,
} from "lucide-react";
import {
  Card,
  CardHeader,
  Badge,
  PageHeader,
  Button,
  EmptyState,
} from "../components/ui";
import StatCard from "../components/features/StatCard";
import RevenueChart from "../components/features/RevenueChart";
import StatusDonut from "../components/features/StatusDonut";
import { useDashboard } from "../hooks/useDashboard";
import { formatCurrency, minutesAgo, orderTotal } from "../utils/formatters";

const RANGE_TABS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "all", label: "All time" },
];

const STATUS_COLOR = {
  pending: "gray",
  preparing: "yellow",
  ready: "blue",
  served: "green",
  paid: "purple",
  cancelled: "red",
};

export default function Dashboard() {
  const {
    loading,
    lastRefresh,
    range,
    setRange,
    kpis,
    revenue7d,
    statusBreakdown,
    topSellers,
    recent,
    reload,
    menuCount,
  } = useDashboard();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="h-80 bg-gray-100 rounded-xl animate-pulse lg:col-span-2" />
          <div className="h-80 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`Updated ${new Date(lastRefresh).toLocaleTimeString()}`}
        action={
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {RANGE_TABS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRange(r.key)}
                  className={`
                    px-3 py-1.5 rounded-md text-xs font-medium transition
                    ${
                      range === r.key
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }
                  `}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={reload}
            >
              Refresh
            </Button>
          </div>
        }
      />

      {/* KPI row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Orders"
          value={kpis.count}
          hint={
            range === "today"
              ? "Today"
              : range === "week"
                ? "Last 7 days"
                : "All time"
          }
          icon={ShoppingBag}
          color="brand"
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(kpis.revenue)}
          hint={
            range === "today"
              ? "Today"
              : range === "week"
                ? "Last 7 days"
                : "All time"
          }
          icon={DollarSign}
          color="green"
        />
        <StatCard
          label="Avg. ticket"
          value={formatCurrency(kpis.avg)}
          hint="Per order"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          label="Active tickets"
          value={kpis.active}
          hint={`${menuCount} menu items`}
          icon={ChefHat}
          color="yellow"
        />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue — last 7 days" subtitle="Total per day" />
          <RevenueChart data={revenue7d} />
        </Card>

        <Card>
          <CardHeader
            title="Order status"
            subtitle={`${statusBreakdown.reduce((s, d) => s + d.value, 0)} total`}
          />
          <StatusDonut data={statusBreakdown} />
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top sellers */}
        <Card>
          <CardHeader
            title="Top selling dishes"
            subtitle={
              range === "today"
                ? "Today"
                : range === "week"
                  ? "Last 7 days"
                  : "All time"
            }
            action={<Flame size={16} className="text-brand-500" />}
          />
          {topSellers.length === 0 ? (
            <EmptyState
              icon={UtensilsCrossed}
              title="No sales yet"
              description="Create some orders to see top sellers."
            />
          ) : (
            <div className="space-y-3">
              {topSellers.map((item, i) => {
                const maxQty = topSellers[0].qty;
                const pct = Math.round((item.qty / maxQty) * 100);
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-800 font-medium truncate">
                        <span className="text-gray-400 mr-2">#{i + 1}</span>
                        {item.name}
                      </span>
                      <span className="text-gray-500 shrink-0 ml-3">
                        {item.qty} sold
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader title="Recent activity" subtitle="Latest 6 orders" />
          {recent.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No orders yet"
              description="New orders will appear here."
            />
          ) : (
            <div className="space-y-2">
              {recent.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      Order #{o.id.slice(-4)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {minutesAgo(o.createdAt)}m ago •{" "}
                      {o.items.reduce((n, it) => n + it.qty, 0)} items
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge color={STATUS_COLOR[o.status] ?? "gray"}>
                      {o.status}
                    </Badge>
                    <span className="text-sm font-semibold text-gray-800">
                      {formatCurrency(orderTotal(o))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
