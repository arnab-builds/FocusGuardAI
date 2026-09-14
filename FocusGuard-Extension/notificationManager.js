import {
    generateNotification,
    getUserSettings,
} from "./api.js";

const DEFAULT_THRESHOLDS = {
    productive: 60 * 60,
    nonProductive: 10 * 60,
    idle: 5 * 60,
};

export async function loadUserSettings() {
    try {
        const settings = await getUserSettings();

        if (!settings) {
            console.log("Using default notification thresholds.");
            return;
        }

        const userThreshold = {
            productive: settings.productive_threshold * 60,
            nonProductive: settings.non_productive_threshold * 60,
            idle: settings.idle_threshold * 60,
        };

        await chrome.storage.local.set({ userThreshold, lastSettingsRefresh: Date.now() });
        console.log("User Settings Loaded:", userThreshold);
    } catch (error) {
        console.error("Failed to load user settings:", error);
    }
}

export async function resetNotificationState() {
    await chrome.storage.local.remove(["lastNotification", "lastSettingsRefresh", "userThreshold"]);
}

export async function checkNotifications(stats) {
    const data = await chrome.storage.local.get(["userThreshold", "lastNotification"]);
    const userThreshold = data.userThreshold || DEFAULT_THRESHOLDS;
    const lastNotification = data.lastNotification;

    let event = null;

    if (
        stats.nonProductiveSeconds >= userThreshold.nonProductive &&
        lastNotification !== "NON_PRODUCTIVE"
    ) {
        event = "NON_PRODUCTIVE";
    }
    else if (
        stats.productiveSeconds >= userThreshold.productive &&
        lastNotification !== "PRODUCTIVE_SESSION"
    ) {
        event = "PRODUCTIVE_SESSION";
    }

    if (!event) return;

    await chrome.storage.local.set({ lastNotification: event });

    try {
        const notification = await generateNotification(event);
        if (!notification) return;

        chrome.notifications.create({
            type: "basic",
            iconUrl: chrome.runtime.getURL("icons/icon128.png"),
            title: notification.title,
            message: notification.message,
        });
    } catch (error) {
        console.error("Notification Error:", error);
    }
}
