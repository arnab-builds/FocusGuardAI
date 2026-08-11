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
import { useTheme } from "../../context/ThemeContext";

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

export default function ProductivityChart({
  activities,
  selectedDate,
}) {
  const { currentLanguageCode, t } = useLanguage();
  const { theme } = useTheme();

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
          productive:
            Math.max(0, durationToSeconds(item.productive_time)) / 60,
          nonProductive:
            Math.max(0, durationToSeconds(item.non_productive_time)) /
            60,
          idle:
            Math.max(0, durationToSeconds(item.idle_time)) / 60,
          name: new Intl.DateTimeFormat(
            currentLanguageCode || undefined,
            {
              weekday: "short",
              day: "numeric",
            }
          ).format(date),
        };
      }),
    [activities, currentLanguageCode, selectedDate]
  );

  const hasTrendData = useMemo(
    () =>
      data.some(
        (item) =>
          item.productive > 0 ||
          item.nonProductive > 0 ||
          item.idle > 0
      ),
    [data]
  );

  const formatTooltip = useCallback(
    (value, name) => [
      `${numberFormatter.format(Number(value) || 0)} ${t(
        "minutes_short",
        "min"
      )}`,
      name === "productive"
        ? t("productive", "Productive")
        : name === "nonProductive"
        ? t("non_productive", "Non Productive")
        : t("idle", "Idle"),
    ],
    [numberFormatter, t]
  );

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
    <section className="overflow-hidden rounded-2xl border border-blue-100/50 dark:border-slate-700 bg-blue-50/30 dark:bg-slate-800 p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-[2px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {t("productivity_trend", "Productivity Trend")}
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-50 sm:text-2xl">
            {t("weekly_trend", "Weekly Trend")}
          </h2>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100/50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10 transition-colors duration-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/60">
          <FiBarChart2 className="h-6 w-6 text-slate-700 dark:text-indigo-400" />
        </div>
      </div>

      <div className="h-[300px] sm:h-[360px] lg:h-[420px]">
        {!hasTrendData ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-6 text-center text-sm text-slate-600 dark:text-slate-400">
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
                right: 15,
                left: -15,
                bottom: 5,
              }}
              barCategoryGap="18%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={gridStroke}
              />

              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                  fill: tickFill,
                }}
              />

              <Tooltip
                formatter={formatTooltip}
                contentStyle={tooltipStyle}
              />

              <Bar
                dataKey="productive"
                fill="#4F46E5"
                radius={[8, 8, 0, 0]}
                maxBarSize={32}
              />

              <Bar
                dataKey="nonProductive"
                fill="#EF4444"
                radius={[8, 8, 0, 0]}
                maxBarSize={32}
              />

              <Bar
                dataKey="idle"
                fill="#0EA5E9"
                radius={[8, 8, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}