import { FiBarChart2 } from "react-icons/fi";
import { useCallback, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useLanguage } from "../../context/useLanguage";

const getWeekDates = (selectedDate) => {
  const endDate = new Date(`${selectedDate}T12:00:00`);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - 6 + index);
    return date;
  });
};

const durationToSeconds = (duration) => {
  if (!duration) return 0;

  const [hours = 0, minutes = 0, seconds = 0] = duration
    .split(".")[0]
    .split(":")
    .map(Number);

  return hours * 3600 + minutes * 60 + seconds;
};

export default function ProductivityChart({ activities, selectedDate }) {
  const { currentLanguageCode, t } = useLanguage();

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(currentLanguageCode || undefined),
    [currentLanguageCode]
  );

  const data = useMemo(
    () =>
      getWeekDates(selectedDate).map((date) => {
        const dateKey = date.toISOString().slice(0, 10);
        const item = Array.isArray(activities)
          ? activities.find((activity) => activity.date === dateKey) || {}
          : {};

        return {
          productive: Math.max(0, durationToSeconds(item.productive_time)) / 60,
          nonProductive:
            Math.max(0, durationToSeconds(item.non_productive_time)) / 60,
          idle: Math.max(0, durationToSeconds(item.idle_time)) / 60,
          name: new Intl.DateTimeFormat(currentLanguageCode || undefined, {
            weekday: "short",
            day: "numeric",
          }).format(date),
        };
      }),
    [activities, currentLanguageCode, selectedDate]
  );

  const hasTrendData = useMemo(
    () =>
      data.some(
        (item) =>
          item.productive > 0 || item.nonProductive > 0 || item.idle > 0
      ),
    [data]
  );

  const formatTooltip = useCallback(
    (value, name) => [
      `${numberFormatter.format(Number(value) || 0)} ${t("minutes_short", "min")}`,
      name === "productive"
        ? t("productive", "Productive")
        : name === "nonProductive"
          ? t("non_productive", "Non Productive")
          : t("idle", "Idle"),
    ],
    [numberFormatter, t]
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t("productivity_trend", "Productivity Trend")}
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {t("weekly_trend", "Weekly Trend")}
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
            {t(
              "no_productivity_data_for_period",
              "No productivity data available for this period."
            )}
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
                formatter={formatTooltip}
              />

              <Bar
                dataKey="productive"
                fill="#4F46E5"
                radius={[8, 8, 0, 0]}
                barSize={26}
              />

              <Bar
                dataKey="nonProductive"
                fill="#EF4444"
                radius={[8, 8, 0, 0]}
                barSize={26}
              />

              <Bar
                dataKey="idle"
                fill="#0EA5E9"
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
