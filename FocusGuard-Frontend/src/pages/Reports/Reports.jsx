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

import { useLanguage } from "../../context/useLanguage";

export default function Reports() {
  const { selectedDate } = useOutletContext();
  const { t } = useLanguage();

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

      alert(
        t(
          "failed_to_generate_report",
          "Failed to generate report."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePDFDownload = async () => {
    try {
      await downloadPDFReport(reportType, selectedDate);
    } catch (error) {
      console.error(error);

      alert(
        t(
          "unable_to_download_pdf_report",
          "Unable to download PDF report."
        )
      );
    }
  };

  const handleCSVDownload = async () => {
    try {
      await downloadCSVReport(reportType, selectedDate);
    } catch (error) {
      console.error(error);

      alert(
        t(
          "unable_to_download_csv_report",
          "Unable to download CSV report."
        )
      );
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
            {t("reports", "Reports")}
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            {t(
              "generate_review_reports",
              "Generate and review your productivity reports."
            )}
          </p>
        </div>

        {/* Report Type Cards */}
        <ReportCards onGenerate={generateReport} />

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
              {t(
                "generating_report",
                "Generating report..."
              )}
            </p>
          </div>
        )}

        {/* Report Statistics */}
        {report && (
          <section>
            <ReportStats report={report} />
          </section>
        )}

        {/* Report Preview */}
        <section>
          <ReportPreview report={report} />
        </section>

        {/* Export */}
        <section className="rounded-2xl border border-indigo-100/50 dark:border-slate-700/50 bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/30 dark:to-[#111827] p-5 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 sm:text-2xl">
              {t("export_report", "Export Report")}
            </h2>

            <p className="mt-1 text-sm text-indigo-600/80 dark:text-indigo-400">
              {t(
                "download_report_formats",
                "Download the generated report in your preferred format."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <button
              onClick={handlePDFDownload}
              disabled={!report}
              className={`flex w-full items-center justify-center gap-3 rounded-xl px-5 py-3 font-semibold text-white transition-all duration-200 ${
                report
                  ? "bg-red-600 hover:bg-red-700 active:scale-[0.98]"
                  : "cursor-not-allowed bg-slate-400"
              }`}
            >
              <FiDownload className="h-5 w-5" />
              {t("download_pdf", "Download PDF")}
            </button>

            <button
              onClick={handleCSVDownload}
              disabled={!report}
              className={`flex w-full items-center justify-center gap-3 rounded-xl px-5 py-3 font-semibold text-white transition-all duration-200 ${
                report
                  ? "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]"
                  : "cursor-not-allowed bg-slate-400"
              }`}
            >
              <FiDownload className="h-5 w-5" />
              {t("download_csv", "Download CSV")}
            </button>

          </div>

          {report && (
            <div className="mt-5 rounded-xl bg-slate-50 dark:bg-slate-800 px-4 py-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t("current_report", "Current Report")}:
                <span className="ml-2 font-semibold capitalize text-slate-900 dark:text-slate-50">
                  {reportType}
                </span>
              </p>
            </div>
          )}

        </section>

      </div>
    </div>
  );
}