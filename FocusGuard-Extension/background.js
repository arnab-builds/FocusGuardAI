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
    checkPeriodicThresholds
} from "./productivityTracker.js";
import {
    loadUserSettings,
    resetNotificationState,
} from "./notificationManager.js";

// We check storage directly for auth state instead of relying on a slow global init
async function isAuthenticated() {
    const result = await chrome.storage.local.get("access");
    return Boolean(result.access);
}

// Ensure alarm is created for MV3 tracking
chrome.alarms.create("focusGuardMaintenance", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "focusGuardMaintenance" && await isAuthenticated()) {
        console.log("FocusGuard maintenance alarm fired");
        // Reuse the existing maintenance alarm so Self Settings changes reach
        // the extension without a Chrome restart or an additional poller.
        await loadUserSettings();
        await checkPeriodicThresholds();
    }
});

// Setup initial state from storage (runs quickly when SW boots)
(async () => {
    if (await isAuthenticated()) {
        await startTracking();
    } else {
        await stopFocusGuardSession({ notifyBackend: false });
    }
})();

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.access && !changes.access.newValue) {
        void stopFocusGuardSession({ notifyBackend: false });
    }
});

function getActiveTab() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
            resolve(tab || null);
        });
    });
}

async function startFocusGuardSession() {
    if (!(await isAuthenticated())) return;

    await loadUserSettings();
    await startTracking();

    const tab = await getActiveTab();
    await setCurrentActivity(null);
    updateCurrentWebsite(null);

    if (tab) {
        await debouncedProcessTab(tab);
    }
}

async function stopFocusGuardSession({ notifyBackend = true, accessToken = null } = {}) {
    updateCurrentWebsite(null);
    await resetNotificationState();
    await resetTracking();

    if (notifyBackend) {
        try { await stopActivity(accessToken); } catch (e) { console.log(e); }
        try { await stopInactivity(accessToken); } catch (e) { console.log(e); }
    }
}

function isValidTab(tab) {
    if (!tab.url) return false;
    const hostname = new URL(tab.url).hostname;
    const ignoredHosts = [
        "127.0.0.1",
        "localhost",
        "focusguard-platform.vercel.app",
        "focusguard-backend-xn94.onrender.com"
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
        return null;
    }
}

const DEFAULT_CATEGORY = Object.freeze({
    category: "Other",
    productivity_type: "NEUTRAL",
});

let processTabTimeout = null;
let latestTabToProcess = null;

async function debouncedProcessTab(tab) {
    latestTabToProcess = tab;
    if (processTabTimeout) clearTimeout(processTabTimeout);

    processTabTimeout = setTimeout(async () => {
        const tabToProcess = latestTabToProcess;
        if (tabToProcess) await processTab(tabToProcess);
    }, 500);
}

async function processTab(tab) {
    if (!(await isAuthenticated())) {
        await stopFocusGuardSession({ notifyBackend: false });
        return;
    }

    if (!isValidTab(tab)) {
        await setCurrentActivity(null);
        updateCurrentWebsite(null);
        try { await stopActivity(); } catch (e) { console.error("Error stopping activity for ignored tab", e); }
        return;
    }

    const domain = extractDomain(tab.url);
    let category = DEFAULT_CATEGORY.category;
    let productivity_type = DEFAULT_CATEGORY.productivity_type;

    if (domain) {
        try {
            const categoryData = await getWebsiteCategory(domain);
            if (categoryData?.category) category = categoryData.category;
            if (categoryData?.productivity_type) productivity_type = categoryData.productivity_type;
        } catch (error) {
            console.error("Category Fetch Failed", error);
        }
    }

    // Re-check after async fetch
    if (!(await isAuthenticated())) return;

    // Category lookups are asynchronous. Do not let a response for a tab that
    // is no longer active overwrite the activity being tracked for the active
    // tab.
    const activeTab = await getActiveTab();
    if (!activeTab || activeTab.id !== tab.id) return;

    const activity = {
        tabId: tab.id,
        website_name: getWebsiteName(tab.url),
        website_url: tab.url,
        favicon_url: tab.favIconUrl || "",
        tab_title: tab.title,
        domain,
        category,
        productivity_type
    };

    // Recover currentActivity from storage if SW was suspended
    const { currentActivity } = await chrome.storage.local.get("currentActivity");

    if (!currentActivity) {
        updateCurrentWebsite(activity);
        await startActivity(activity);
        await setCurrentActivity(activity);
        return;
    }

    if (currentActivity.website_url === activity.website_url) {
        currentActivity.tab_title = activity.tab_title;
        if (activity.favicon_url && activity.favicon_url !== currentActivity.favicon_url) {
            currentActivity.favicon_url = activity.favicon_url;
            await startActivity(currentActivity);
            await setCurrentActivity(currentActivity);
        }
        return;
    }

    updateCurrentWebsite(activity);
    await startActivity(activity);
    await setCurrentActivity(activity);
}

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
    try {
        const tab = await chrome.tabs.get(tabId);
        await debouncedProcessTab(tab);
    } catch (error) {
        console.error(error);
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status !== "complete" || !tab.active) return;
    await debouncedProcessTab(tab);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!["FOCUSGUARD_LOGIN_SUCCESS", "FOCUSGUARD_LOGOUT", "FOCUSGUARD_AUTH_CHANGED"].includes(message?.type)) {
        return false;
    }

    (async () => {
        try {
            if (message.type === "FOCUSGUARD_LOGIN_SUCCESS") {
                await startFocusGuardSession();
                console.log("FocusGuard tracking started after login");
            } else if (message.type === "FOCUSGUARD_LOGOUT") {
                await stopFocusGuardSession({ accessToken: message.access });
                console.log("FocusGuard tracking stopped after logout");
            } else if (message.type === "FOCUSGUARD_AUTH_CHANGED") {
                await loadUserSettings();
                const tab = await getActiveTab();
                if (tab) {
                    await setCurrentActivity(null);
                    await debouncedProcessTab(tab);
                }
            }
            sendResponse({ ok: true });
        } catch (error) {
            console.error(error);
            sendResponse({ ok: false, error: error.message });
        }
    })();

    return true;
});
