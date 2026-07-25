import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiDownload } from "react-icons/fi";

import ReportCards from "../../components/reports/ReportCards";
import ReportStats from "../../components/reports/ReportStats";
import ReportPreview from "../../components/reports/ReportPreview";

import {
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  downloadPDFReport,
  downloadCSVReport,
} from "../../services/reportService";

export default function Reports() {
  const { selectedDate } = useOutletContext();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("");

  const generateReport = async (type) => {
    setLoading(true);

    try {
      let data;

      if (type === "daily") {
        data = await getDailyReport(selectedDate);
      } else if (type === "weekly") {
        data = await getWeeklyReport(selectedDate);
      } else {
        data = await getMonthlyReport(selectedDate);
      }

      setReport(data);
      setReportType(type);
    } catch (error) {
      console.error(error);
      alert("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  const handlePDFDownload = async () => {
    try {
      await downloadPDFReport(
        reportType,
        selectedDate
      );
    } catch (error) {
      console.error(error);
      alert("Unable to download PDF report.");
    }
  };

  const handleCSVDownload = async () => {
    try {
      await downloadCSVReport(
        reportType,
        selectedDate
      );
    } catch (error) {
      console.error(error);
      alert("Unable to download CSV report.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Reports
        </h1>

        <p className="mt-2 text-gray-500">
          Generate and review your productivity reports.
        </p>
      </div>

      <ReportCards onGenerate={generateReport} />

      {loading && (
        <div className="mt-8 rounded-xl bg-white p-6 text-center shadow-sm">
          Generating report...
        </div>
      )}

      {report && (
        <div className="mt-8">
          <ReportStats report={report} />
        </div>
      )}

      <div className="mt-8">
        <ReportPreview report={report} />
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-xl font-semibold">
          Export Report
        </h2>

        <div className="flex flex-wrap gap-4">

          <button
            onClick={handlePDFDownload}
            disabled={!report}
            className={`flex items-center gap-2 rounded-lg px-5 py-3 text-white transition ${
              report
                ? "bg-red-600 hover:bg-red-700"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            <FiDownload />
            Download PDF
          </button>

          <button
            onClick={handleCSVDownload}
            disabled={!report}
            className={`flex items-center gap-2 rounded-lg px-5 py-3 text-white transition ${
              report
                ? "bg-green-600 hover:bg-green-700"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            <FiDownload />
            Download CSV
          </button>

        </div>

        {report && (
          <p className="mt-4 text-sm capitalize text-gray-500">
            Current Report:{" "}
            <strong>{reportType}</strong>
          </p>
        )}

      </div>
    </div>
  );
}