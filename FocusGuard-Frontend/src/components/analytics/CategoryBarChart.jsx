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
import { useTheme } from "../../context/ThemeContext";

const parseTime = (time) => {
  if (!time) return 0;

  const [h, m, s] = time.split(":");
  return Number(h) * 3600 + Number(m) * 60 + parseFloat(s);
};

export default function CategoryBarChart({ analytics }) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const data = Object.entries(
    analytics.category_summary || {}
  ).map(([category, time]) => ({
    category,
    seconds: parseTime(time),
  }));

  const tickFill = theme === 'dark' ? '#94A3B8' : '#334155';
  const gridStroke = theme === 'dark' ? '#334155' : '#E2E8F0';
  const tooltipStyle = theme === 'dark' ? {
    backgroundColor: '#1E293B',
    borderRadius: "12px",
    border: "1px solid #334155",
    color: '#F8FAFC',
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  } : {
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-blue-100/50 dark:border-slate-700 bg-blue-50/30 dark:bg-slate-800 p-5 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 sm:text-2xl">
          {t("category_usage", "Category Usage")}
        </h2>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
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
              stroke={gridStroke}
              horizontal
              vertical={false}
            />

            <XAxis
              type="number"
              tick={{
                fontSize: 12,
                fill: tickFill,
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
                fill: tickFill,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip contentStyle={tooltipStyle} />

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