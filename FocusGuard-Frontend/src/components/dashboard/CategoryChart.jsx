import { FiLayers } from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

const parseDurationToSeconds = (time) => {
  if (!time) return 0;
  const cleanTime = time.split(".")[0];
  const [hours, minutes, seconds] = cleanTime.split(":").map(Number);
  return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
};

const palette = ["#6366f1", "#14b8a6", "#f43f5e", "#f59e0b", "#8b5cf6"];

export default function CategoryChart({ categorySummary }) {
  const { t } = useLanguage();
  const categories = Object.entries(categorySummary || {}).map(([label, time]) => ({
    label,
    seconds: parseDurationToSeconds(time),
  }));
  const sorted = categories.sort((a, b) => b.seconds - a.seconds).slice(0, 5);
  const totalSeconds = sorted.reduce((sum, item) => sum + item.seconds, 0) || 1;

  return (
    <section className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
            {t("top_categories")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">{t("category_distribution")}</h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
          <FiLayers size={20} />
        </div>
      </div>

      <div className="mt-6 flex flex-1 items-center justify-center">
        <div
          className="relative h-48 w-48 rounded-full bg-slate-100"
          style={{
            background: `conic-gradient(${sorted
              .map((item, index) => `${palette[index % palette.length]} ${Math.round((item.seconds / totalSeconds) * 360)}deg`)
              .join(", ")})`,
          }}
        >
          <div className="absolute inset-8 m-auto h-28 w-28 rounded-full bg-white" />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {sorted.map((item, index) => {
          const percentage = Math.round((item.seconds / totalSeconds) * 100);
          return (
            <div key={item.label} className="flex items-center justify-between gap-3 text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-3 w-3 rounded-full" style={{ background: palette[index % palette.length] }} />
                <span className="font-medium text-slate-900">{item.label}</span>
              </div>
              <span className="text-slate-500">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
