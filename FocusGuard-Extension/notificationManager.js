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
    await chrome.storage.local.remove(["notifiedProductive", "notifiedNonProductive", "lastSettingsRefresh", "userThreshold", "notifiedIdle"]);
}

export async function checkNotifications(stats) {
    const data = await chrome.storage.local.get(["userThreshold", "isIdle", "lastActivityTime", "notifiedIdle", "notifiedProductive", "notifiedNonProductive"]);
    const userThreshold = data.userThreshold || DEFAULT_THRESHOLDS;

    let event = null;
    let updateStorage = {};

    if (data.isIdle && data.lastActivityTime) {
        // chrome.idle.setDetectionInterval is 60s, so lastActivityTime was recorded exactly 60s after the user actually went idle.
        const idleSeconds = Math.floor((Date.now() - data.lastActivityTime) / 1000) + 60;
        if (idleSeconds >= userThreshold.idle && !data.notifiedIdle) {
            event = "IDLE";
            updateStorage.notifiedIdle = true;
        }
    }

    if (!event) {
        if (
            stats.nonProductiveSeconds >= userThreshold.nonProductive &&
            !data.notifiedNonProductive
        ) {
            event = "NON_PRODUCTIVE";
            updateStorage.notifiedNonProductive = true;
        }
        else if (
            stats.productiveSeconds >= userThreshold.productive &&
            !data.notifiedProductive
        ) {
            event = "PRODUCTIVE_SESSION";
            updateStorage.notifiedProductive = true;
        }
    }

    if (!event) return;

    await chrome.storage.local.set(updateStorage);

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
