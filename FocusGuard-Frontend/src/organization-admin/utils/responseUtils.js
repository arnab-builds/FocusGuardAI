export const getApiErrorMessage = (
    error,
    fallback = "Something went wrong."
) => {
    const data = error?.response?.data;

    if (!data) {
        return fallback;
    }

    if (typeof data === "string") {
        return data;
    }

    if (data.error || data.message || data.detail) {
        return data.error || data.message || data.detail;
    }

    const firstKey = Object.keys(data)[0];
    const firstValue = data[firstKey];

    if (Array.isArray(firstValue)) {
        return firstValue.join(" ");
    }

    if (firstValue) {
        return String(firstValue);
    }

    return fallback;
};

export const normalizeListResponse = (
    response,
    keys = ["results", "data", "items"]
) => {
    if (Array.isArray(response)) {
        return response;
    }

    for (const key of keys) {
        if (Array.isArray(response?.[key])) {
            return response[key];
        }
    }

    return [];
};

export const normalizeStatus = (status) =>
    String(status || "").toUpperCase();

export const displayStatus = (status) => {
    const normalized = normalizeStatus(status);

    if (!normalized) {
        return "Unknown";
    }

    return normalized
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const getRoundedProductivity = (employee) => {
    const productivity = Number(
        employee?.productivity_percentage ??
            employee?.productive_percentage ??
            employee?.analytics?.productivity_percentage ??
            employee?.analytics?.productive_percentage ??
            employee?.productivity ??
            employee?.productive ??
            0
    );

    if (!Number.isFinite(productivity)) {
        return 0;
    }

    return Math.round(productivity * 10) / 10;
};
