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

const formatTimeSpent = (site) => {
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
        return `${hours} ${hours === 1 ? "hr" : "hrs"} ${minutes} mins`;
    }

    if (hours > 0) {
        return `${hours} ${hours === 1 ? "hr" : "hrs"}`;
    }

    return `${Math.max(totalMinutes, 1)} mins`;
};

function TopWebsites({ websites = [] }) {
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

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="p-6 border-b">

                <h2 className="text-lg font-semibold">

                    Top Websites

                </h2>

            </div>

            {

                topWebsites.length > 0 ? (

                    <table className="w-full">

                        <thead className="bg-slate-50">

                            <tr>

                                <th className="text-left px-6 py-4">

                                    Website

                                </th>

                                <th className="text-left px-6 py-4">

                                    Category

                                </th>

                                <th className="text-left px-6 py-4">

                                    Time

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                topWebsites.map((site, index) => (

                                    <tr
                                        key={site.id || index}
                                        className="border-t hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-4 font-medium">

                                            {site.website_name || site.name}

                                        </td>

                                        <td className="px-6 py-4">

                                            {site.category || "-"}

                                        </td>

                                        <td className="px-6 py-4 font-semibold text-indigo-600">

                                            {formatTimeSpent(site)}

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                ) : (

                    <div className="py-12 text-center text-slate-500">

                        No website activity available.

                    </div>

                )

            }

        </div>

    );

}

export default TopWebsites;
