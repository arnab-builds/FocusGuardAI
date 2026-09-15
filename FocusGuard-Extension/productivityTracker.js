import { checkNotifications } from "./notificationManager.js";

export async function setCurrentActivity(activity) {
    await updateAccumulatedTime();

    await chrome.storage.local.set({
        currentActivity: activity,
        lastActivityTime: Date.now()
    });
}

export async function startTracking() {
    const { trackingStats } = await chrome.storage.local.get("trackingStats");
    if (!trackingStats) {
        await resetTracking();
    } else {
        await updateAccumulatedTime();
        await chrome.storage.local.set({ isIdle: false, lastActivityTime: Date.now() });
    }
}

export async function stopTracking() {
    await updateAccumulatedTime();
    await chrome.storage.local.remove("currentActivity");
}

export async function setIdleState(isIdle) {
    if (isIdle) {
        await updateAccumulatedTime();
        await chrome.storage.local.set({ isIdle: true });
    } else {
        await chrome.storage.local.remove("notifiedIdle");
        await chrome.storage.local.set({ isIdle: false, lastActivityTime: Date.now() });
    }
}

export async function resetTracking() {
    await chrome.storage.local.set({
        trackingStats: {
            productiveSeconds: 0,
            nonProductiveSeconds: 0,
            neutralSeconds: 0,
        },
        currentActivity: null,
        lastActivityTime: Date.now(),
        isIdle: false
    });
}

export async function getTrackingStats() {
    await updateAccumulatedTime();
    const { trackingStats } = await chrome.storage.local.get("trackingStats");
    return trackingStats || {
        productiveSeconds: 0,
        nonProductiveSeconds: 0,
        neutralSeconds: 0,
    };
}

export async function checkPeriodicThresholds() {
    const stats = await getTrackingStats();
    await checkNotifications(stats);
    console.log("Stats tick:", stats);
}

export async function updateAccumulatedTime() {
    const { currentActivity, lastActivityTime, isIdle, trackingStats = {
        productiveSeconds: 0,
        nonProductiveSeconds: 0,
        neutralSeconds: 0,
    } } = await chrome.storage.local.get(["currentActivity", "lastActivityTime", "isIdle", "trackingStats"]);

    if (!currentActivity || !lastActivityTime || isIdle) return;

    const now = Date.now();
    const elapsedSeconds = Math.floor((now - lastActivityTime) / 1000);

    if (elapsedSeconds > 0) {
        switch (currentActivity.productivity_type) {
            case "PRODUCTIVE":
                trackingStats.productiveSeconds += elapsedSeconds;
                break;
            case "NON_PRODUCTIVE":
                trackingStats.nonProductiveSeconds += elapsedSeconds;
                break;
            default:
                trackingStats.neutralSeconds += elapsedSeconds;
                break;
        }

        await chrome.storage.local.set({
            trackingStats,
            lastActivityTime: now
        });
    }
}
