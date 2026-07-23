import { FiBarChart2 } from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const parseDurationToSeconds = (time) => {
  if (!time) return 0;

  const cleanTime = time.split(".")[0];
  const [hours, minutes, seconds] = cleanTime.split(":").map(Number);

  return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
};

const getTrendData = (activities = [], selectedDate) => {
  const endDate = selectedDate ? new Date(selectedDate) : new Date();

  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(endDate);

    date.setDate(endDate.getDate() - (6 - index));

    return {
      date: date.toISOString().slice(0, 10),
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      seconds: 0,
    };
  });

  activities.forEach((activity) => {
    const dateKey = new Date(activity.start_time)
      .toISOString()
      .slice(0, 10);

    const day = last7Days.find((d) => d.date === dateKey);

    if (day) {
      day.seconds += parseDurationToSeconds(
        activity.duration || "00:00:00"
      );
    }
  });

  return last7Days.map((item) => ({
    ...item,
    minutes: Math.round(item.seconds / 60),
  }));
};

export default function ProductivityChart({
  activities,
  selectedDate,
}) {
  const data = getTrendData(activities, selectedDate);

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
              dataKey="day"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={(value) => [`${value} min`, "Usage"]}
            />

            <Bar
              dataKey="minutes"
              fill="#4F46E5"
              radius={[8, 8, 0, 0]}
              barSize={26}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}