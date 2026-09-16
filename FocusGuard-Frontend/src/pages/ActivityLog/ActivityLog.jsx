import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
} from "react-icons/fi";

import { getActivityHistory } from "../../services/activityService";
import { useLanguage } from "../../context/useLanguage";
import WebsiteIcon from "../../components/common/WebsiteIcon";
import { fetchWithCache, getCache } from "../../utils/apiCache";

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
  const { t, currentLanguageCode } = useLanguage();

  const [page, setPage] = useState(1);
  
  const cacheKey = `emp-activities-${selectedDate}-page-${page}`;
  
  const [activities, setActivities] = useState(() => getCache(cacheKey)?.results || []);
  const [pagination, setPagination] = useState(() => getCache(cacheKey) || {});
  const [loading, setLoading] = useState(() => !getCache(cacheKey));
  const [search, setSearch] = useState("");

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(currentLanguageCode),
    [currentLanguageCode]
  );

  useEffect(() => {
    let isMounted = true;
    
    const fetchActivities = async (currentPage, showLoading = true, force = false) => {
      try {
        if (showLoading && !getCache(cacheKey)) {
          setLoading(true);
        }

        const data = await fetchWithCache(
          cacheKey,
          () => getActivityHistory(currentPage, selectedDate),
          { force }
        );

        if (isMounted) {
          setActivities(data.results || []);
          setPagination(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchActivities(page);

    const refreshInterval = window.setInterval(() => {
      if (!document.hidden) {
        fetchActivities(page, false, true);
      }
    }, 30_000);

    const onRealtime = ({ detail }) => {
      if (detail?.event === "ACTIVITY_STATUS_CHANGED") {
        void fetchActivities(page, false, true);
      }
    };
    window.addEventListener("focusguard:realtime", onRealtime);

    return () => {
      isMounted = false;
      window.clearInterval(refreshInterval);
      window.removeEventListener("focusguard:realtime", onRealtime);
    };
  }, [page, selectedDate, cacheKey]);

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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
            {t("activity_history", "Activity History")}
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {t(
              "browse_website_activity",
              "Browse your website activity."
            )}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

          <input
            type="text"
            placeholder={t("search_website", "Search website...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 pl-12 pr-4 text-slate-900 dark:text-slate-200 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Activity List */}
        <section className="overflow-hidden rounded-2xl border border-cyan-100/50 dark:border-slate-700/50 bg-gradient-to-br from-cyan-50/30 to-white dark:from-slate-900/50 dark:to-slate-800/50 shadow-sm">

          {/* Desktop Header */}
          <div className="hidden border-b border-cyan-100/50 dark:border-slate-700/50 bg-cyan-50/50 dark:bg-slate-800 px-6 py-4 text-sm font-semibold text-cyan-800 dark:text-cyan-400 lg:grid lg:grid-cols-5">
            <div>{t("website", "Website")}</div>
            <div>{t("category", "Category")}</div>
            <div>{t("duration", "Duration")}</div>
            <div>{t("status", "Status")}</div>
            <div>{t("started", "Started")}</div>
          </div>

          {loading && filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              {t("loading", "Loading...")}
            </div>
          ) : (
            filtered.map((activity) => {
              let rowHover = "hover:bg-slate-50 dark:hover:bg-slate-800/80";
              if (activity.productivity_type === "PRODUCTIVE") rowHover = "hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20";
              else if (activity.productivity_type === "NON_PRODUCTIVE") rowHover = "hover:bg-rose-50/50 dark:hover:bg-rose-950/20";
              else if (activity.productivity_type === "NEUTRAL") rowHover = "hover:bg-cyan-50/30 dark:hover:bg-cyan-950/20";

              return (
              <div
                key={activity.id}
                className={`border-b border-slate-100 dark:border-slate-700/50 p-5 transition-all duration-200 ${rowHover}`}
              >
                <div className="grid gap-4 lg:grid-cols-5 lg:items-center">

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-semibold">
                      <WebsiteIcon faviconUrl={activity.favicon_url} websiteUrl={activity.website_url} websiteName={activity.website_name} className="h-8 w-8" />

                      <a
                        href={activity.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {activity.website_name}
                      </a>
                    </div>

                    <p className="mt-1 truncate text-xs text-slate-600 dark:text-slate-400">
                      {activity.tab_title}
                    </p>
                  </div>

                  <div className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-medium lg:hidden">
                      {t("category", "Category")}:{" "}
                    </span>
                    {activity.category}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <FiClock />

                    {formatDuration(
                      activity.duration,
                      t,
                      currentLanguageCode
                    )}
                  </div>

                  <div>
                    {activity.productivity_type === "PRODUCTIVE" ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 dark:bg-green-900/40 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400">
                        <FiCheckCircle />
                        {t("productive", "Productive")}
                      </span>
                    ) : activity.productivity_type === "NEUTRAL" ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800/80 px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <FiClock />
                        {t("neutral", "Neutral")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-red-100 dark:bg-red-900/40 px-3 py-1 text-sm font-medium text-red-700 dark:text-red-400">
                        <FiXCircle />
                        {t("non_productive", "Non Productive")}
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
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
            className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700/50 dark:disabled:text-slate-500 sm:w-auto"
          >
            {t("previous", "Previous")}
          </button>

          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {t("page", "Page")} {numberFormatter.format(page)}
          </span>

          <button
            disabled={!pagination.next}
            onClick={() => setPage((p) => p + 1)}
            className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700/50 dark:disabled:text-slate-500 sm:w-auto"
          >
            {t("next", "Next")}
          </button>

        </div>

      </div>
    </div>
  );
}
