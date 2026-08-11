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
async function apiFetch(url, options = {}, accessToken = null) {

    let access = accessToken || await getAccessToken();

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
export async function stopActivity(accessToken = null) {

    try {

        const response = await apiFetch(
            `${CONFIG.BASE_URL}/activity/stop/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            },
            accessToken
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

function normalizeDomain(domain) {
    return String(domain || "")
        .trim()
        .toLowerCase()
        .replace(/^www\./i, "");
}

function getCategoryCacheKey(domain) {
    return `category_${domain}`;
}

async function readCategoryCache(cacheKey) {
    try {
        const cachedResult = await chrome.storage.local.get(cacheKey);
        return cachedResult?.[cacheKey] ?? null;
    } catch (error) {
        console.error("Category Cache Read Error:", error);
        return null;
    }
}

async function writeCategoryCache(cacheKey, data) {
    try {
        await chrome.storage.local.set({ [cacheKey]: data });
        console.log("💾 Category Cached", cacheKey);
    } catch (error) {
        console.error("Category Cache Write Error:", error);
    }
}

export async function getWebsiteCategory(domain) {
    const normalizedDomain = normalizeDomain(domain);

    if (!normalizedDomain) {
        console.error("❌ Category Fetch Failed - Invalid domain", domain);
        return null;
    }

    const cacheKey = getCategoryCacheKey(normalizedDomain);

    const cachedCategory = await readCategoryCache(cacheKey);

    if (cachedCategory) {
        console.log("✅ Category Loaded From Local Cache", normalizedDomain);
        return cachedCategory;
    }

    console.log("🤖 Fetching Category From Backend", normalizedDomain);

    try {
        const response = await apiFetch(
            `${CONFIG.BASE_URL}/website-categories/check/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ domain: normalizedDomain }),
            }
        );

        if (!response) {
            console.error("❌ Category Fetch Failed", normalizedDomain);
            return null;
        }

        if (!response.ok) {
            console.error("❌ Category Fetch Failed", normalizedDomain, response.status);
            return null;
        }

        const data = await response.json();

        if (!data?.data) {
            console.error("❌ Category Fetch Failed - Invalid response", normalizedDomain, data);
            return null;
        }

        await writeCategoryCache(cacheKey, data.data);

        return data.data;
    } catch (error) {
        console.error("❌ Category Fetch Failed", normalizedDomain, error);
        return null;
    }
}

/**
 * Stop Inactivity
 */
export async function stopInactivity(accessToken = null) {

    try {

        const response = await apiFetch(
            `${CONFIG.BASE_URL}/inactivity/stop/`,
            {
                method: "POST",
            },
            accessToken
        );

        if (!response) return;

        const data = await response.json();

        console.log("Inactivity Stopped:", data);

    } catch (error) {

        console.error("Stop Inactivity Error:", error);

    }
}

export async function generateNotification(notification_type) {
    try {
        const response = await apiFetch(
            `${CONFIG.BASE_URL}/notifications/generate/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                 event: notification_type,
                })
            }
        );

        if (!response) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Notification API Error:", error);
        return null;
    }
}
/**
 * Get User Notification Settings
 */
export async function getUserSettings() {

    try {

        const response = await apiFetch(
            `${CONFIG.BASE_URL}/settings/`,
            {
                method: "GET",
            }
        );

        if (!response) {
            return null;
        }

        if (!response.ok) {
            console.error("Failed to fetch settings.");
            return null;
        }

        return await response.json();

    } catch (error) {

        console.error("Settings API Error:", error);
        return null;

    }

}
export async function updateUserSettings(settings) {

    try {

        const response = await apiFetch(
            `${CONFIG.BASE_URL}/settings/`,
            {
                method: "PATCH",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(settings),
            }
        );

        if (!response) {
        return null;
      }

      if (!response.ok) {
      console.error("Failed to update settings.");
      return null;
        }

return await response.json();

    } catch(error){

        console.error(error);
        return null;

    }

}
