import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = {
  pending: "#9ca3af",
  preparing: "#f59e0b",
  ready: "#0ea5e9",
  served: "#10b981",
  paid: "#8b5cf6",
  cancelled: "#ef4444",
};

export default function StatusDonut({ data }) {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-gray-400">
        No order data yet.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={COLORS[d.name] ?? "#9ca3af"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              fontSize: 12,
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
