import { CONFIG } from "./config.js";

/**
 * Get Access Token
 */
async function getAccessToken() {
    const result = await chrome.storage.local.get("access");
    return result.access;
}

/**
 * Get Refresh Token
 */
async function getRefreshToken() {
    const result = await chrome.storage.local.get("refresh");
    return result.refresh;
}

/**
 * Save New Access Token
 */
async function saveAccessToken(access) {
    await chrome.storage.local.set({ access });
}

/**
 * Logout Helper
 */
async function clearTokens() {
    await chrome.storage.local.remove([
        "access",
        "refresh",
        "user",
    ]);
}

/**
 * Refresh Access Token
 */
async function refreshAccessToken() {

    const refresh = await getRefreshToken();

    if (!refresh) {
        console.log("No refresh token found.");
        await clearTokens();
        return null;
    }

    try {

        const response = await fetch(
            `${CONFIG.BASE_URL}/token/refresh/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refresh,
                }),
            }
        );

        if (!response.ok) {
            console.log("Refresh token expired.");
            await clearTokens();
            return null;
        }

        const data = await response.json();

        await saveAccessToken(data.access);

        console.log("Access token refreshed.");

        return data.access;

    } catch (error) {

        console.error("Refresh Error:", error);
        return null;

    }
}

/**
 * Fetch Wrapper
 */
async function apiFetch(url, options = {}) {

    let access = await getAccessToken();

    if (!access) {
        console.log("No access token.");
        return null;
    }

    options.headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${access}`,
    };

    let response = await fetch(url, options);

    if (response.status !== 401) {
        return response;
    }

    console.log("Access token expired. Refreshing...");

    access = await refreshAccessToken();

    if (!access) {
        return null;
    }

    options.headers.Authorization = `Bearer ${access}`;

    response = await fetch(url, options);

    return response;
}

/**
 * Start Website Activity
 */
export async function startActivity(activityData) {

    try {

        const response = await apiFetch(
            `${CONFIG.BASE_URL}/activity/start/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(activityData),
            }
        );

        if (!response) return;

        const data = await response.json();

        console.log("Activity Started:", data);

    } catch (error) {

        console.error("Activity API Error:", error);

    }

}

/**
 * Stop Activity
 */
export async function stopActivity() {

    try {

        const response = await apiFetch(
            `${CONFIG.BASE_URL}/activity/stop/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response) return;

        const data = await response.json();

        console.log("Activity Stopped:", data);

    } catch (error) {

        console.error("Stop Activity Error:", error);

    }

}

/**
 * Start Inactivity
 */
export async function startInactivity(activity) {

    try {

        const response = await apiFetch(
            `${CONFIG.BASE_URL}/inactivity/start/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(activity),
            }
        );

        if (!response) return;

        const data = await response.json();

        console.log("Inactivity Started:", data);

    } catch (error) {

        console.error("Start Inactivity Error:", error);

    }

}

/**
 * Stop Inactivity
 */
export async function stopInactivity() {

    try {

        const response = await apiFetch(
            `${CONFIG.BASE_URL}/inactivity/stop/`,
            {
                method: "POST",
            }
        );

        if (!response) return;

        const data = await response.json();

        console.log("Inactivity Stopped:", data);

    } catch (error) {

        console.error("Stop Inactivity Error:", error);

    }

}
