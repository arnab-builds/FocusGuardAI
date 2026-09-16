import {
    generateNotification,
    getUserSettings,
} from "./api.js";

function toSeconds(value) {
    const minutes = Number(value);
    return Number.isFinite(minutes) && minutes > 0 ? minutes * 60 : null;
}

function normalizeThresholds(settings) {
    if (!settings || typeof settings !== "object") return null;

    const userThreshold = {
        productive: toSeconds(settings.productive_threshold),
        nonProductive: toSeconds(settings.non_productive_threshold),
        idle: toSeconds(settings.idle_threshold),
    };

    return Object.values(userThreshold).every(Boolean) ? userThreshold : null;
}

function hasValidCachedThresholds(thresholds) {
    return thresholds && Object.values(thresholds).every(
        (value) => Number.isFinite(value) && value > 0
    );
}

export async function loadUserSettings() {
    try {
        const settings = await getUserSettings();

        const userThreshold = normalizeThresholds(settings);
        if (!userThreshold) {
            console.error("Settings response did not contain valid notification thresholds.");
            return false;
        }

        await chrome.storage.local.set({
            userThreshold,
            browserNotifications: settings.browser_notifications !== false,
            lastSettingsRefresh: Date.now(),
        });
        console.log("User Settings Loaded:", userThreshold);
        return true;
    } catch (error) {
        console.error("Failed to load user settings:", error);
        return false;
    }
}

export async function resetNotificationState() {
    await chrome.storage.local.remove(["notifiedProductive", "notifiedNonProductive", "lastSettingsRefresh", "userThreshold", "browserNotifications", "notifiedIdle"]);
}

export async function checkNotifications(stats) {
    const data = await chrome.storage.local.get(["userThreshold", "isIdle", "lastActivityTime", "notifiedIdle", "notifiedProductive", "notifiedNonProductive", "browserNotifications"]);
    const userThreshold = data.userThreshold;

    // The backend provides the application defaults. Never substitute a
    // different client-side threshold when a cache read or settings request
    // is temporarily unavailable.
    if (!hasValidCachedThresholds(userThreshold) || data.browserNotifications === false) return;

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
