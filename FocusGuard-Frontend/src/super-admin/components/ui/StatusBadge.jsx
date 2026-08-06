import { useLanguage } from "../../context/useLanguage";

function StatusBadge({ status }) {
    const { t } = useLanguage();

    const normalizedStatus = String(status || "").toUpperCase();
    const styles = {
        Active: "bg-green-100 text-green-700",
        Pending: "bg-yellow-100 text-yellow-700",
        Inactive: "bg-red-100 text-red-700",
        Accepted: "bg-green-100 text-green-700",
        Approved: "bg-green-100 text-green-700",
        Rejected: "bg-red-100 text-red-700",
        Expired: "bg-red-100 text-red-700",
    };

    const statusTranslations = {
        ACTIVE: t("active", "Active"),
        PENDING: t("pending", "Pending"),
        INACTIVE: t("inactive", "Inactive"),
        ACCEPTED: t("accepted", "Accepted"),
        APPROVED: t("approved", "Approved"),
        REJECTED: t("rejected", "Rejected"),
        EXPIRED: t("expired", "Expired"),
    };
    const translatedStatus = statusTranslations[normalizedStatus] || status;

    return (
        <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
                styles[
                    `${status || ""}`.charAt(0).toUpperCase() +
                    `${status || ""}`.slice(1).toLowerCase()
                ] ||
                "bg-gray-100 text-gray-700"
            }`}
        >
            {translatedStatus}
        </span>
    );
}

export default StatusBadge;
