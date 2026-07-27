import AdminLayout from "../../components/layout/AdminLayout";
import AnalyticsCharts from "../../components/analytics/AnalyticsCharts";

function Analytics() {
  return (
    <AdminLayout>
      <div className="space-y-6">

        <div>

          <h1 className="text-3xl font-bold">
            Analytics
          </h1>

          <p className="text-gray-500 mt-2">
            Platform analytics overview.
          </p>

        </div>

        <AnalyticsCharts />

      </div>
    </AdminLayout>
  );
}

export default Analytics;