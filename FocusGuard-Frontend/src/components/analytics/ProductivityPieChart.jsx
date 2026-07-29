import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useLanguage } from "../../context/useLanguage";

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

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        {t("productivity_breakdown", "Productivity Breakdown")}
      </h2>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={130}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}