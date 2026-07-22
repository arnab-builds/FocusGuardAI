import {
    startActivity,
    stopActivity,
    stopInactivity,
    getWebsiteCategory,
} from "./api.js";
import { getWebsiteName } from "./utils.js";
import { updateCurrentWebsite } from "./idle.js";
import {
    setCurrentActivity,
    startTracking,
    resetTracking,
} from "./productivityTracker.js";

import {
    loadUserSettings,
    resetNotificationState,
} from "./notificationManager.js";

console.log("FocusGuard Background Service Started");
// Current tracked activity
let currentActivity = null;

(async () => {

    if (await isAuthenticated()) {
        await startFocusGuardSession();
    } else {
        await stopFocusGuardSession({
            notifyBackend: false,
        });
    }

})();

async function isAuthenticated() {
    const result = await chrome.storage.local.get("access");
    return Boolean(result.access);
}

function getActiveTab() {
    return new Promise((resolve) => {
        chrome.tabs.query(
            {
                active: true,
                lastFocusedWindow: true,
            },
            ([tab]) => {
                resolve(tab || null);
            }
        );
    });
}

async function startFocusGuardSession() {
    if (!(await isAuthenticated())) {
        return;
    }

    await loadUserSettings();
    startTracking();

    const tab = await getActiveTab();

    currentActivity = null;
    setCurrentActivity(null);
    updateCurrentWebsite(null);

    if (tab) {
        await processTab(tab);
    }
}

async function stopFocusGuardSession({ notifyBackend = true } = {}) {
    if (notifyBackend) {
        try {
            await stopActivity();
        } catch (error) {
            console.log("No active activity to stop.", error);
        }

        try {
            await stopInactivity();
        } catch (error) {
            console.log("No active inactivity to stop.", error);
        }
    }

    currentActivity = null;
    updateCurrentWebsite(null);
    resetNotificationState();
    resetTracking();
}

function isValidTab(tab) {

    if (!tab.url) {
        return false;
    }

    const hostname = new URL(tab.url).hostname;

    const ignoredHosts = [
        "127.0.0.1",
        "localhost"
    ];

    return (
        !tab.url.startsWith("chrome://") &&
        !tab.url.startsWith("chrome-extension://") &&
        !tab.url.startsWith("edge://") &&
        !tab.url.startsWith("about:") &&
        !tab.url.startsWith("devtools://") &&
        !tab.url.startsWith("view-source:") &&
        !ignoredHosts.includes(hostname)
    );
}

function extractDomain(url) {
    try {
        return new URL(url).hostname.replace(/^www\./i, "").toLowerCase();
    } catch (error) {
        console.error("❌ Category Fetch Failed - Invalid URL", error);
        return null;
    }
}

const DEFAULT_CATEGORY = Object.freeze({
    category: "Other",
    productivity_type: "NEUTRAL",
});

async function processTab(tab) {

    if (!(await isAuthenticated())) {

    await stopFocusGuardSession({
        notifyBackend: false,
    });

    return;
}

    if (!isValidTab(tab)) {
        return;
    }

    const domain = extractDomain(tab.url);
    let category = DEFAULT_CATEGORY.category;
    let productivity_type = DEFAULT_CATEGORY.productivity_type;

    if (domain) {
        try {
            const categoryData = await getWebsiteCategory(domain);

            if (categoryData?.category) {
                category = categoryData.category;
            }

            if (categoryData?.productivity_type) {
                productivity_type = categoryData.productivity_type;
            }
        } catch (error) {
            console.error("❌ Category Fetch Failed", error);
        }
    }

    const activity = {

        tabId: tab.id,

        website_name: getWebsiteName(tab.url),

        website_url: tab.url,

        tab_title: tab.title,

        domain,

        category,

        productivity_type

    };

    // First activity
    if (!currentActivity) {

        currentActivity = activity;
        updateCurrentWebsite(activity);
        console.log("First Activity", activity);
        await startActivity(activity);

        setCurrentActivity(activity);

        return;

    }

    // Same URL
    if (currentActivity.website_url === activity.website_url) {

        console.log("Same URL - Ignored");

        // Update title only
        currentActivity.tab_title = activity.tab_title;

        return;

    }

    // URL changed

    currentActivity = activity;
    updateCurrentWebsite(activity);
    console.log("New Activity", activity);

    await startActivity(activity);

    setCurrentActivity(activity);

}

// -----------------------------

chrome.tabs.onActivated.addListener(async ({ tabId }) => {

    try {

        const tab = await chrome.tabs.get(tabId);

        await processTab(tab);

    }

    catch (error) {

        console.error(error);

    }

});

// -----------------------------

chrome.tabs.onUpdated.addListener(

    async (tabId, changeInfo, tab) => {

        if (changeInfo.status !== "complete") {

            return;

        }

        await processTab(tab);

    }

);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (
        message?.type !== "FOCUSGUARD_LOGIN_SUCCESS" &&
        message?.type !== "FOCUSGUARD_LOGOUT"
    ) {
        return false;
    }

    (async () => {
        try {
            if (message.type === "FOCUSGUARD_LOGIN_SUCCESS") {
                await startFocusGuardSession();
                console.log("FocusGuard tracking started after login");
            }

            if (message.type === "FOCUSGUARD_LOGOUT") {
                await stopFocusGuardSession();
                console.log("FocusGuard tracking stopped after logout");
            }

            sendResponse({ ok: true });
        } catch (error) {
            console.error(error);

            sendResponse({
                ok: false,
                error: error.message,
            });
        }
    })();

    return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message?.type !== "FOCUSGUARD_AUTH_CHANGED") {
        return false;
    }

    chrome.tabs.query(
        {
            active: true,
            currentWindow: true,
        },
        async ([tab]) => {

            try {

                // ⭐⭐⭐ ADD THIS
                await loadUserSettings();

                console.log("✅ Settings loaded after login");

                if (tab) {
                    currentActivity = null;
                    await processTab(tab);
                }

                sendResponse({ ok: true });

            } catch (error) {

                console.error(error);

                sendResponse({
                    ok: false,
                    error: error.message,
                });

            }

        }
    );

    return true;
});
