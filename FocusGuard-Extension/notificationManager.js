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
        const idleSeconds = Math.floor((Date.now() - data.lastActivityTime) / 1000);
        console.log("Idle notification check:", {
            idleSeconds,
            idleThreshold: userThreshold.idle,
            notifiedIdle: Boolean(data.notifiedIdle),
        });
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

    // Persist before the request so overlapping alarm deliveries cannot create
    // duplicate notifications.  If the request fails, clear it again so this
    // same idle period can be retried on the next maintenance alarm.
    await chrome.storage.local.set(updateStorage);

    try {
        console.log("Generating notification:", event);
        const notification = await generateNotification(event);
        if (!notification) {
            await chrome.storage.local.remove(Object.keys(updateStorage));
            return;
        }

        await chrome.notifications.create({
            type: "basic",
            iconUrl: chrome.runtime.getURL("icons/icon128.png"),
            title: notification.title,
            message: notification.message,
        });
    } catch (error) {
        await chrome.storage.local.remove(Object.keys(updateStorage));
        console.error("Notification Error:", error);
    }
}
