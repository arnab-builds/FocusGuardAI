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
    <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-red-600">
        {t(
          "account_deactivation",
          "Account Deactivation"
        )}
      </h2>

      <p className="mb-5 text-gray-500">
        {t(
          "send_deactivation_request_description",
          "Send a deactivation request to your administrator."
        )}
      </p>

      <textarea
        rows="4"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder={t("reason", "Reason...")}
        className="mb-5 w-full rounded-lg border p-3"
      />

      <button
        disabled={loading || success}
        onClick={handleRequest}
        className="rounded-lg bg-red-600 px-5 py-3 text-white hover:bg-red-700 disabled:bg-gray-400"
      >
        {success
          ? t("request_sent", "Request Sent")
          : loading
          ? t("sending", "Sending...")
          : t("send_request", "Send Request")}
      </button>
    </div>
  );
}