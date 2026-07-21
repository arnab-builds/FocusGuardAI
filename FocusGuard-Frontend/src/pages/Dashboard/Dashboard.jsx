import { useEffect, useState } from "react";
import { getProfile } from "../../services/profileService";
import { getAnalytics } from "../../services/analyticsService";
import { getActivityHistory } from "../../services/activityService";
import { formatDuration } from "../../utils/timeFormatter";
import {
  getAIRecommendations,
  analyzeRecommendation,
} from "../../services/aiRecommendationService";
function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedRange, setSelectedRange] = useState("today");
  const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const handleAnalyze = async () => {
    if (selectedRange === "custom") {
      if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
      }

      if (new Date(startDate) > new Date(endDate)) {
        alert("Start date cannot be after end date.");
        return;
      }
    }
  try {
    setLoadingRecommendation(true);

    const payload = {
      range: selectedRange,
    };

    if (selectedRange === "custom") {
      payload.start_date = startDate;
      payload.end_date = endDate;
    }

    await analyzeRecommendation(payload);

const updatedRecommendations = await getAIRecommendations();

setRecommendations(
  Array.isArray(updatedRecommendations)
    ? updatedRecommendations
    : []
);

  } catch (error) {
    console.error(error);
    alert("Failed to generate recommendation");
  } finally {
    setLoadingRecommendation(false);
  }
};

useEffect(() => {
  const fetchData = async () => {
    try {
      // Load Profile & Analytics first
      const profileData = await getProfile();
      const analyticsData = await getAnalytics();

      setProfile(profileData);
      setAnalytics(analyticsData);

      // AI Recommendations
      try {
        const recommendationData = await getAIRecommendations();

        setRecommendations(
          Array.isArray(recommendationData)
            ? recommendationData
            : []
        );
      } catch (err) {
        console.error("AI Recommendation Error:", err);
        setRecommendations([]);
      }

      // Activity History
      try {
        const activityData = await getActivityHistory();

        setActivities(
          activityData?.results ||
          activityData ||
          []
        );
      } catch (err) {
        console.error("Activity API Error:", err);
        setActivities([]);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  fetchData();
}, []);

  if (!profile || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const latestRecommendation = recommendations[0];

  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-4xl font-bold">
        Welcome, {profile.username} 👋
      </h1>

      {/* Profile */}
      <div className="mt-8 bg-white rounded-xl shadow p-6 max-w-xl">
        <p>
          <strong>Email:</strong> {profile.email}
        </p>

        <p className="mt-3">
          <strong>Organization:</strong>{" "}
          {profile.organization || "Not Assigned"}
        </p>
      </div>

      {/* Analytics Cards */}
<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">

  <div className="bg-white rounded-xl shadow p-5">
    <h2 className="text-gray-500">🟢 Productive</h2>
    <p className="text-xl font-bold">
      {formatDuration(analytics.productive_time)}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-5">
    <h2 className="text-gray-500">🔴 Non Productive</h2>
    <p className="text-xl font-bold">
      {formatDuration(analytics.non_productive_time)}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-5">
    <h2 className="text-gray-500">💤 Idle Time</h2>
    <p className="text-xl font-bold">
      {formatDuration(analytics.idle_time)}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-5">
    <h2 className="text-gray-500">🌐 Websites</h2>
    <p className="text-xl font-bold">
      {analytics.total_websites_visited}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-5">
    <h2 className="text-gray-500">🔄 Tab Switches</h2>
    <p className="text-xl font-bold">
      {analytics.total_tab_switches}
    </p>
  </div>

</div>

      {/* Website Summary */}
      <div className="mt-10 bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-5">
          🌐 Website Summary
        </h2>

        {Object.keys(analytics.website_summary || {}).length === 0 ? (
          <p className="text-gray-500">
            No website activity available.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Website</th>
                <th className="text-left py-2">Time Spent</th>
                <th className="text-left py-2">Visits</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(analytics.website_summary || {}).map(
                ([website, data]) => (
                  <tr key={website} className="border-b hover:bg-slate-50">
                    <td className="py-3 font-medium">{website}</td>
                    <td>{formatDuration(data.time_spent)}</td>
                    <td>{data.visits}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Category Summary */}
      <div className="mt-10 bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-5">
          📂 Category Summary
        </h2>

        {Object.keys(analytics.category_summary || {}).length === 0 ? (
          <p className="text-gray-500">
            No category data available.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Category</th>
                <th className="text-left py-2">Time Spent</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(analytics.category_summary || {}).map(
                ([category, time]) => (
                  <tr key={category} className="border-b hover:bg-slate-50">
                    <td className="py-3 font-medium">{category}</td>
                    <td>{formatDuration(time)}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* AI Recommendation */}
<div className="mt-10 bg-white rounded-xl shadow p-6">

  <div className="flex items-center justify-between mb-6">

    <h2 className="text-2xl font-bold">
      🤖 AI Productivity Coach
    </h2>

    <div className="flex flex-wrap gap-3 items-center">

      <select
        value={selectedRange}
        onChange={(e) => {
            const value = e.target.value;
            setSelectedRange(value);

            if (value !== "custom") {
                setStartDate("");
                setEndDate("");
            }
        }}
        className="border rounded-lg px-3 py-2"
      >
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="last_week">Last Week</option>
        <option value="last_month">Last Month</option>
        <option value="custom">Custom Range</option>
      </select>

      {selectedRange === "custom" && (
        <>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loadingRecommendation}
        className={`px-5 py-2 rounded-lg text-white ${
            loadingRecommendation
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loadingRecommendation
          ? "Analyzing..."
          : "Analyze"}
      </button>

    </div>

  </div>

  {latestRecommendation ? (

    <>

      <h3 className="text-xl font-semibold text-green-600">
        {latestRecommendation.title}
      </h3>

      <p className="mt-4 text-gray-700 whitespace-pre-line">
        {latestRecommendation.message}
      </p>

      <div className="mt-6">

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">

          {latestRecommendation.recommendation_type}

        </span>

      </div>

    </>

  ) : (

    <div className="text-center py-10">

      <p className="text-gray-500">

        Click <strong>Analyze</strong> to generate an AI recommendation.

      </p>

    </div>

  )}

</div>
    </div>
  );
}

export default Dashboard;
