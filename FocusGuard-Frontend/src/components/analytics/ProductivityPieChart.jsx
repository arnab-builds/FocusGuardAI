import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useLanguage } from "../../context/useLanguage";
import { useTheme } from "../../context/ThemeContext";

const parseTime = (time) => {
  if (!time) return 0;

  const [h, m, s] = time.split(":");
  return Number(h) * 3600 + Number(m) * 60 + parseFloat(s);
};

const COLORS = [
  "#22c55e",
  "#ef4444",
  "#f59e0b",
  "#3b82f6",
];

export default function ProductivityPieChart({ analytics }) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const data = [
    {
      name: t("productive", "Productive"),
      value: parseTime(analytics.productive_time),
    },
    {
      name: t("non_productive", "Non Productive"),
      value: parseTime(analytics.non_productive_time),
    },
    {
      name: t("idle", "Idle"),
      value: parseTime(analytics.idle_time),
    },
    {
      name: t("neutral", "Neutral"),
      value: parseTime(analytics.neutral_time),
    },
  ];

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
          {t("productivity_breakdown", "Productivity Breakdown")}
        </h2>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t(
            "visual_distribution_of_productivity",
            "Visual distribution of your productivity."
          )}
        </p>
      </div>

      <div className="h-[320px] sm:h-[380px] lg:h-[430px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius="70%"
              paddingAngle={3}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip contentStyle={tooltipStyle} />

            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{
                paddingTop: 20,
                fontSize: 13,
                color: theme === 'dark' ? '#F8FAFC' : '#334155',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}