import { useState } from "react";
import { requestDeactivation } from "../../services/deactivationService";

export default function DeactivationCard() {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRequest = async () => {
    if (!reason.trim()) {
      alert("Please enter a reason.");
      return;
    }

    const confirmRequest = window.confirm(
      "Send deactivation request to administrator?"
    );

    if (!confirmRequest) return;

    try {
      setLoading(true);

      await requestDeactivation(reason);

      setSuccess(true);

    } catch (err) {
      console.error(err);
      alert("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-red-200">

      <h2 className="text-xl font-semibold text-red-600 mb-4">
        Account Deactivation
      </h2>

      <p className="text-gray-500 mb-5">
        Send a deactivation request to your administrator.
      </p>

      <textarea
        rows="4"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason..."
        className="w-full border rounded-lg p-3 mb-5"
      />

      <button
        disabled={loading || success}
        onClick={handleRequest}
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg disabled:bg-gray-400"
      >
        {success
          ? "Request Sent"
          : loading
          ? "Sending..."
          : "Send Request"}
      </button>

    </div>
  );
}