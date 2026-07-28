import { FiBarChart2 } from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function ProductivityChart({ activities }) {
  const data = Array.isArray(activities) ? activities : [];
  const hasTrendData = data.some(
    (item) =>
      Number(item.productive || 0) > 0 ||
      Number(item.unproductive || 0) > 0
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Productivity Trend
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Weekly Trend
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          <FiBarChart2
            size={18}
            className="text-slate-700"
          />
        </div>
      </div>

      <div className="h-52">
        {!hasTrendData ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
            No productivity data available for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                formatter={(value, name) => [
                  `${value} hr`,
                  name === "productive"
                    ? "Productive"
                    : "Unproductive",
                ]}
              />

              <Bar
                dataKey="productive"
                fill="#4F46E5"
                radius={[8, 8, 0, 0]}
                barSize={26}
              />

              <Bar
                dataKey="unproductive"
                fill="#EF4444"
                radius={[8, 8, 0, 0]}
                barSize={26}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
