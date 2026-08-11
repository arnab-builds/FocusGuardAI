import {
  FiAlertTriangle,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";
import { useState } from "react";
import { requestDeactivation } from "../../services/deactivationService";
import { useLanguage } from "../../context/useLanguage";

export default function DeactivationCard() {
  const { t } = useLanguage();

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRequest = async () => {
    if (!reason.trim()) {
      alert(
        t(
          "please_enter_reason",
          "Please enter a reason."
        )
      );
      return;
    }

    const confirmRequest = window.confirm(
      t(
        "confirm_deactivation_request",
        "Send deactivation request to administrator?"
      )
    );

    if (!confirmRequest) return;

    try {
      setLoading(true);

      await requestDeactivation(reason);

      setSuccess(true);
    } catch (err) {
      console.error(err);

      alert(
        t(
          "failed_to_submit_request",
          "Failed to submit request."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-rose-100/50 dark:border-slate-700/50 bg-gradient-to-br from-rose-50/70 to-white dark:from-rose-950/30 dark:to-[#111827] p-6 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md">

      {/* Header */}

      <div className="mb-6 flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100/50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 shadow-sm shadow-rose-500/10">

          <FiAlertTriangle size={28} />

        </div>

        <div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {t(
              "account_deactivation",
              "Account Deactivation"
            )}
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t(
              "send_deactivation_request_description",
              "Send a deactivation request for administrator review."
            )}
          </p>

        </div>

      </div>

      {/* Warning */}

      <div className="mb-6 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 p-4">

        <p className="text-sm leading-6 text-amber-700 dark:text-amber-400">
          {t(
            "deactivation_warning",
            "Your account will not be deactivated immediately. An administrator will review your request before taking any action."
          )}
        </p>

      </div>

      {/* Reason */}

      <div>

        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {t("reason", "Reason")}
        </label>

        <textarea
          rows={5}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t(
            "reason_placeholder",
            "Please explain why you want to deactivate your account..."
          )}
          className="w-full resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 py-3 text-slate-900 dark:text-slate-200 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"
        />

      </div>

      {/* Success */}

      {success && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 p-4 text-emerald-700 dark:text-emerald-400">

          <FiCheckCircle size={22} />

          <span className="font-medium">
            {t(
              "request_sent_successfully",
              "Your deactivation request has been sent successfully."
            )}
          </span>

        </div>
      )}

      {/* Button */}

      <button
        disabled={loading || success}
        onClick={handleRequest}
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition-all duration-300 ${
          success
            ? "cursor-not-allowed bg-emerald-600"
            : loading
            ? "cursor-not-allowed bg-slate-400 dark:bg-slate-700"
            : "bg-red-600 hover:bg-red-700 active:scale-[0.99]"
        }`}
      >
        {success ? (
          <>
            <FiCheckCircle />
            {t("request_sent", "Request Sent")}
          </>
        ) : (
          <>
            <FiSend />
            {loading
              ? t("sending", "Sending...")
              : t("send_request", "Send Request")}
          </>
        )}
      </button>

    </section>
  );
}