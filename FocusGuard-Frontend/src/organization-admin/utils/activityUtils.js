const isMissingValue = (value) =>
    value === null ||
    value === undefined ||
    value === "" ||
    value === "undefined" ||
    value === "[object Object]";

export const getOrganizationName = (profile) => {
    if (!profile) {
        return "";
    }

    if (profile.organization?.name) {
        return profile.organization.name;
    }

    if (profile.organization_name) {
        return profile.organization_name;
    }

    if (
        typeof profile.organization === "string" &&
        !isMissingValue(profile.organization)
    ) {
        return profile.organization;
    }

    return "";
};

export const getStoredOrganizationName = () => {
    const stored = localStorage.getItem("organization");

    if (isMissingValue(stored)) {
        return "Organization";
    }

    try {
        const parsed = JSON.parse(stored);
        const parsedName = getOrganizationName({
            organization: parsed,
        });

        return parsedName || "Organization";
    } catch {
        return stored;
    }
};

export const getProductivityScore = (employee) =>
    Number(
        employee?.productivity_percentage ??
            employee?.productive_percentage ??
            employee?.productivity ??
            0
    );

export const hasAnalyticsData = (employee) => {
    if (getProductivityScore(employee) > 0) {
        return true;
    }

    return [
        employee?.productive_time,
        employee?.non_productive_time,
        employee?.neutral_time,
        employee?.total_time,
    ].some(
        (value) =>
            value &&
            value !== "0:00:00" &&
            value !== "00:00:00" &&
            value !== "0"
    );
};

export const getEmployeeOnlineStatus = (entity) => {
    const rawStatus =
        entity?.is_online ??
        entity?.online ??
        entity?.employee_status ??
        entity?.presence;

    if (typeof rawStatus === "boolean") {
        return rawStatus ? "Online" : "Offline";
    }

    if (typeof rawStatus === "string") {
        const normalized = rawStatus.toLowerCase();

        if (normalized === "online") {
            return "Online";
        }

        if (normalized === "offline") {
            return "Offline";
        }
    }

    return null;
};

export const formatDateTime = (value) => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

export const formatDuration = (value) => {
    if (!value) {
        return "0m";
    }

    if (typeof value === "number") {
        const minutes = Math.round(value / 60);
        return minutes >= 60
            ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
            : `${minutes}m`;
    }

    const parts = String(value).split(":");

    if (parts.length < 3) {
        return String(value);
    }

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    const seconds = Math.round(Number(parts[2]));

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }

    return `${seconds}s`;
};

const normalizeFlatActivity = (activity, user = {}) => ({
    id: activity.id,
    employee:
        activity.username ||
        activity.employee_name ||
        activity.user?.username ||
        user.username ||
        user.email ||
        "Unknown employee",
    website:
        activity.website ||
        activity.website_name ||
        activity.name ||
        "Unknown website",
    website_url: activity.website_url || activity.url || "",
    favicon_url: activity.favicon_url || "",
    category: activity.category || "Uncategorized",
    duration: activity.duration,
    start_time:
        activity.start_time ||
        activity.created_at ||
        activity.timestamp ||
        activity.date,
    is_online: activity.is_online ?? user.is_online,
    online: activity.online ?? user.online,
    employee_status:
        activity.employee_status ??
        activity.presence ??
        user.employee_status ??
        user.presence,
});

export const normalizeOrganizationActivities = (payload) => {
    const activities = [];

    if (Array.isArray(payload)) {
        return payload.map((activity) =>
            normalizeFlatActivity(activity)
        );
    }

    const users = payload?.users || [];

    users.forEach((item) => {
        if (Array.isArray(item.activities)) {
            item.activities.forEach((activity) => {
                activities.push(
                    normalizeFlatActivity(activity, item)
                );
            });
            return;
        }

        activities.push(normalizeFlatActivity(item));
    });

    if (activities.length === 0 && Array.isArray(payload?.activities)) {
        payload.activities.forEach((activity) => {
            activities.push(normalizeFlatActivity(activity));
        });
    }

    return activities.sort((a, b) => {
        const aDate = new Date(a.start_time || 0).getTime();
        const bDate = new Date(b.start_time || 0).getTime();

        return bDate - aDate;
    });
};
