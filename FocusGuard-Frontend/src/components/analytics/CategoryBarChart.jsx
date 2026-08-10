import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useLanguage } from "../../context/useLanguage";

const parseTime = (time) => {
  if (!time) return 0;

  const [h, m, s] = time.split(":");
  return Number(h) * 3600 + Number(m) * 60 + parseFloat(s);
};

export default function CategoryBarChart({ analytics }) {
  const { t } = useLanguage();

  const data = Object.entries(
    analytics.category_summary || {}
  ).map(([category, time]) => ({
    category,
    seconds: parseTime(time),
  }));

  return (
    <section className="overflow-hidden rounded-2xl border border-blue-100/50 bg-blue-50/30 p-5 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {t("category_usage", "Category Usage")}
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          {t(
            "time_spent_per_category",
            "Time spent across different website categories."
          )}
        </p>
      </div>

      <div className="h-[320px] sm:h-[380px] lg:h-[430px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 10,
              right: 20,
              left: 15,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
              horizontal
              vertical={false}
            />

            <XAxis
              type="number"
              tick={{
                fontSize: 12,
                fill: "#334155",
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              dataKey="category"
              type="category"
              width={120}
              tick={{
                fontSize: 12,
                fill: "#334155",
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.08)",
              }}
            />

            <Bar
              dataKey="seconds"
              fill="#10B981"
              radius={[0, 8, 8, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}