import {
    generateNotification,
    getUserSettings,
} from "./api.js";

let lastNotification = null;
let lastSettingsRefresh = 0;

let userThreshold = {
    productive: 60 * 60,      // 60 minutes
    nonProductive: 10 * 60,   // 10 minutes
    idle: 5 * 60,             // 5 minutes
};

/**
 * Fetch user notification settings from backend
 */
export async function loadUserSettings() {
    try {
        const settings = await getUserSettings();

        if (!settings) {
            console.log("Using default notification thresholds.");
            return;
        }

        userThreshold = {
            productive: settings.productive_threshold * 60,
            nonProductive: settings.non_productive_threshold * 60,
            idle: settings.idle_threshold * 60,
        };

        console.log("✅ User Settings Loaded:", userThreshold);

    } catch (error) {
        console.error("❌ Failed to load user settings:", error);
    }
}

export function resetNotificationState() {
    lastNotification = null;
    lastSettingsRefresh = 0;
}

/**
 * Refresh settings every 5 seconds
 */
async function refreshSettingsIfNeeded() {

    const now = Date.now();

    if (now - lastSettingsRefresh >= 2000) {

        await loadUserSettings();

        lastSettingsRefresh = now;

    }

}

/**
 * Check whether notifications should be shown
 */
export async function checkNotifications(stats) {

    // Refresh thresholds every 5 seconds
    await refreshSettingsIfNeeded();

    let event = null;

    // Non-Productive Notification
    if (
        stats.nonProductiveSeconds >= userThreshold.nonProductive &&
        lastNotification !== "NON_PRODUCTIVE"
    ) {
        event = "NON_PRODUCTIVE";
    }

    // Productive Session Notification
    else if (
        stats.productiveSeconds >= userThreshold.productive &&
        lastNotification !== "PRODUCTIVE_SESSION"
    ) {
        event = "PRODUCTIVE_SESSION";
    }

    if (!event) {
        return;
    }

    lastNotification = event;

    try {

        const notification = await generateNotification(event);

        if (!notification) {
            return;
        }

        chrome.notifications.create({
            type: "basic",
            iconUrl: chrome.runtime.getURL("icons/icon128.png"),
            title: notification.title,
            message: notification.message,
        });

    } catch (error) {

        console.error("❌ Notification Error:", error);

    }

}
