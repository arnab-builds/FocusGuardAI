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

const formatDuration = (duration) => {
  if (!duration) return "-";

  const [h, m, s] = duration.split(":");

  if (Number(h) > 0) return `${h}h ${m}m`;

  return `${m}m ${Math.floor(Number(s))}s`;
};

const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

export default function ActivityLog() {
  const { selectedDate } = useOutletContext();

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Activity History
        </h1>

        <p className="mt-2 text-gray-500">
          Browse your website activity.
        </p>
      </div>

      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-3.5 text-gray-400" />

        <input
          type="text"
          placeholder="Search website..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border bg-white py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="grid grid-cols-5 bg-gray-100 px-6 py-4 font-semibold">
          <div>Website</div>
          <div>Category</div>
          <div>Duration</div>
          <div>Status</div>
          <div>Started</div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            Loading...
          </div>
        ) : (
          filtered.map((activity) => (
            <div
              key={activity.id}
              className="grid grid-cols-5 items-center border-b px-6 py-5 hover:bg-gray-50"
            >
              <div>
                <div className="flex items-center gap-2 font-semibold">
                  <FiMonitor />

                  <a
                    href={activity.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    {activity.website_name}
                  </a>
                </div>

                <p className="mt-1 truncate text-xs text-gray-500">
                  {activity.tab_title}
                </p>
              </div>

              <div>{activity.category}</div>

              <div className="flex items-center gap-2">
                <FiClock />
                {formatDuration(activity.duration)}
              </div>

              <div>
                {activity.productivity_type ===
                "PRODUCTIVE" ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    <FiCheckCircle />
                    Productive
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                    <FiXCircle />
                    Non Productive
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-500">
                {formatDate(activity.start_time)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          disabled={!pagination.previous}
          onClick={() => setPage((p) => p - 1)}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-white disabled:bg-gray-300"
        >
          Previous
        </button>

        <span className="font-medium">
          Page {page}
        </span>

        <button
          disabled={!pagination.next}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-white disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}