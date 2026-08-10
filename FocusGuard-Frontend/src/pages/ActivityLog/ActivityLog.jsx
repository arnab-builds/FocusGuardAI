import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiMonitor,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
} from "react-icons/fi";

import { getActivityHistory } from "../../services/activityService";
import { useLanguage } from "../../context/useLanguage";

const formatDuration = (duration, t, locale) => {
  if (!duration) return "-";

  const [h, m, s] = duration.split(":");
  const numberFormatter = new Intl.NumberFormat(locale || undefined);

  if (Number(h) > 0) {
    return `${numberFormatter.format(Number(h))}${t(
      "hours_short",
      "h"
    )} ${numberFormatter.format(Number(m))}${t(
      "minutes_short",
      "m"
    )}`;
  }

  return `${numberFormatter.format(Number(m))}${t(
    "minutes_short",
    "m"
  )} ${numberFormatter.format(Math.floor(Number(s)))}${t(
    "seconds_short",
    "s"
  )}`;
};

const formatDate = (date, locale) => {
  return new Date(date).toLocaleString(locale || undefined);
};

export default function ActivityLog() {
  const { selectedDate } = useOutletContext();
  const { currentLanguageCode, t } = useLanguage();

  const numberFormatter = new Intl.NumberFormat(
    currentLanguageCode || undefined
  );

  const [activities, setActivities] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchActivities(page);
  }, [page, selectedDate]);

  const fetchActivities = async (currentPage) => {
    try {
      setLoading(true);

      const data = await getActivityHistory(
        currentPage,
        selectedDate
      );

      setActivities(data.results || []);
      setPagination(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = activities.filter((activity) =>
    activity.website_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            {t("activity_history", "Activity History")}
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            {t(
              "browse_website_activity",
              "Browse your website activity."
            )}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder={t("search_website", "Search website...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Activity List */}
        <section className="overflow-hidden rounded-2xl border border-cyan-100/50 bg-gradient-to-br from-cyan-50/30 to-white shadow-sm">

          {/* Desktop Header */}
          <div className="hidden border-b border-cyan-100/50 bg-cyan-50/50 px-6 py-4 text-sm font-semibold text-cyan-800 lg:grid lg:grid-cols-5">
            <div>{t("website", "Website")}</div>
            <div>{t("category", "Category")}</div>
            <div>{t("duration", "Duration")}</div>
            <div>{t("status", "Status")}</div>
            <div>{t("started", "Started")}</div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              {t("loading", "Loading...")}
            </div>
          ) : (
            filtered.map((activity) => {
              let rowHover = "hover:bg-slate-50";
              if (activity.productivity_type === "PRODUCTIVE") rowHover = "hover:bg-emerald-50/50";
              else if (activity.productivity_type === "NON_PRODUCTIVE") rowHover = "hover:bg-rose-50/50";
              else if (activity.productivity_type === "NEUTRAL") rowHover = "hover:bg-cyan-50/30";

              return (
              <div
                key={activity.id}
                className={`border-b border-slate-100 p-5 transition-all duration-200 ${rowHover}`}
              >
                <div className="grid gap-4 lg:grid-cols-5 lg:items-center">

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-semibold">
                      <FiMonitor className="shrink-0" />

                      <a
                        href={activity.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-indigo-600 hover:underline"
                      >
                        {activity.website_name}
                      </a>
                    </div>

                    <p className="mt-1 truncate text-xs text-slate-600">
                      {activity.tab_title}
                    </p>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium lg:hidden">
                      {t("category", "Category")}:{" "}
                    </span>
                    {activity.category}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FiClock />

                    {formatDuration(
                      activity.duration,
                      t,
                      currentLanguageCode
                    )}
                  </div>

                  <div>
                    {activity.productivity_type === "PRODUCTIVE" ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                        <FiCheckCircle />
                        {t("productive", "Productive")}
                      </span>
                    ) : activity.productivity_type === "NEUTRAL" ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        <FiClock />
                        {t("neutral", "Neutral")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                        <FiXCircle />
                        {t("non_productive", "Non Productive")}
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-slate-600 font-medium">
                    {formatDate(
                      activity.start_time,
                      currentLanguageCode
                    )}
                  </div>

                </div>
              </div>
            );
            })
          )}
        </section>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

          <button
            disabled={!pagination.previous}
            onClick={() => setPage((p) => p - 1)}
            className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:bg-slate-300 sm:w-auto"
          >
            {t("previous", "Previous")}
          </button>

          <span className="font-semibold text-slate-700">
            {t("page", "Page")} {numberFormatter.format(page)}
          </span>

          <button
            disabled={!pagination.next}
            onClick={() => setPage((p) => p + 1)}
            className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:bg-slate-300 sm:w-auto"
          >
            {t("next", "Next")}
          </button>

        </div>

      </div>
    </div>
  );
}