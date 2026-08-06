import { useLanguage } from "../../context/useLanguage";
import { translateCategory } from "../../utils/categoryTranslations";

const parseDurationToSeconds = (value) => {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    if (typeof value === "number") {
        return value;
    }

    const parts = String(value).split(":");

    if (parts.length !== 3) {
        return null;
    }

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    const seconds = Number(parts[2]);

    if (!Number.isFinite(hours + minutes + seconds)) {
        return null;
    }

    return hours * 3600 + minutes * 60 + seconds;
};

const formatTimeSpent = (site, t) => {
    const seconds =
        parseDurationToSeconds(site.duration_seconds) ??
        parseDurationToSeconds(site.time_spent_seconds) ??
        parseDurationToSeconds(site.duration) ??
        parseDurationToSeconds(site.time);

    if (seconds === null) {
        return site.duration || site.time || "-";
    }

    const totalMinutes = Math.round(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
        return `${hours} ${
            hours === 1
                ? t("hour_short", "hr")
                : t("hours_short_text", "hrs")
        } ${minutes} ${t("minutes_short", "mins")}`;
    }

    if (hours > 0) {
        return `${hours} ${
            hours === 1
                ? t("hour_short", "hr")
                : t("hours_short_text", "hrs")
        }`;
    }

    return `${Math.max(totalMinutes, 1)} ${t(
        "minutes_short",
        "mins"
    )}`;
};

function TopWebsites({ websites = [] }) {
    const { currentLanguageCode, t } = useLanguage();

    const topWebsites = [...websites]
        .sort((a, b) => {
            const aSeconds =
                parseDurationToSeconds(a.duration_seconds) ??
                parseDurationToSeconds(a.duration) ??
                0;

            const bSeconds =
                parseDurationToSeconds(b.duration_seconds) ??
                parseDurationToSeconds(b.duration) ??
                0;

            return bSeconds - aSeconds;
        })
        .slice(0, 5);

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-6 sm:p-7 border-b border-slate-100">
                <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none mt-0.5">
                        🌐
                    </span>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {t(
                                "top_websites",
                                "Top Websites"
                            )}
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            {t(
                                "most_visited_websites_description",
                                "Most visited websites across your organization"
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {topWebsites.length > 0 ? (
                <>
                    {/* Desktop / tablet table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm uppercase tracking-wide font-bold text-slate-700">
                                        {t(
                                            "website",
                                            "Website"
                                        )}
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm uppercase tracking-wide font-bold text-slate-700">
                                        {t(
                                            "category",
                                            "Category"
                                        )}
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm uppercase tracking-wide font-bold text-slate-700">
                                        {t(
                                            "time",
                                            "Time"
                                        )}
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {topWebsites.map(
                                    (site, index) => (
                                        <tr
                                            key={
                                                site.id ||
                                                index
                                            }
                                            className="border-t border-slate-100 hover:bg-indigo-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-lg leading-none">
                                                        🌐
                                                    </span>

                                                    <span className="text-base font-semibold text-slate-900">
                                                        {site.website_name ||
                                                            site.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                {site.category ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                                        {translateCategory(
                                                            site.category,
                                                            t,
                                                            currentLanguageCode
                                                        )}
                                                    </span>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="inline-flex items-center gap-1.5 text-lg font-bold text-indigo-600">
                                                    <span className="text-base leading-none">
                                                        ⏱
                                                    </span>
                                                    {formatTimeSpent(
                                                        site,
                                                        t
                                                    )}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden flex flex-col gap-3 p-4">
                        {topWebsites.map((site, index) => (
                            <div
                                key={site.id || index}
                                className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col gap-3"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="text-lg leading-none shrink-0">
                                        🌐
                                    </span>

                                    <span className="text-base font-semibold text-slate-900 truncate">
                                        {site.website_name ||
                                            site.name}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                    {site.category ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                            {translateCategory(
                                                site.category,
                                                t,
                                                currentLanguageCode
                                            )}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-slate-400">
                                            -
                                        </span>
                                    )}

                                    <span className="inline-flex items-center gap-1.5 text-lg font-bold text-indigo-600">
                                        <span className="text-base leading-none">
                                            ⏱
                                        </span>
                                        {formatTimeSpent(
                                            site,
                                            t
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="py-14 px-6 flex flex-col items-center justify-center gap-3 text-center">
                    <span className="text-5xl leading-none">
                        🌐
                    </span>

                    <h3 className="text-lg font-bold text-slate-800">
                        {t(
                            "no_website_activity",
                            "No Website Activity"
                        )}
                    </h3>

                    <p className="text-sm text-slate-500 max-w-xs">
                        {t(
                            "no_website_activity_available",
                            "Website usage data will appear once employee activity is available."
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}

export default TopWebsites;