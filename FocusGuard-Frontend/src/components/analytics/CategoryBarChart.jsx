import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const parseTime = (time) => {
  if (!time) return 0;

  const [h, m, s] = time.split(":");
  return Number(h) * 3600 + Number(m) * 60 + parseFloat(s);
};

export default function CategoryBarChart({ analytics }) {
  const data = Object.entries(
    analytics.category_summary
  ).map(([category, time]) => ({
    category,
    seconds: parseTime(time),
  }));

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Category Usage
      </h2>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis type="number" />

            <YAxis
              dataKey="category"
              type="category"
              width={120}
            />

            <Tooltip />

            <Bar
  dataKey="seconds"
  fill="#10B981"
  barSize={16}
  radius={[0, 8, 8, 0]}
/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}