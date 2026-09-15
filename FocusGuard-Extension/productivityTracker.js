import { checkNotifications } from "./notificationManager.js";

export async function setCurrentActivity(activity) {
    await updateAccumulatedTime();

    await chrome.storage.local.set({
        currentActivity: activity,
        lastActivityTime: Date.now()
    });
}

export async function startTracking() {
    const { trackingStats, isIdle } = await chrome.storage.local.get(["trackingStats", "isIdle"]);
    if (!trackingStats) {
        await resetTracking();
    } else {
        await updateAccumulatedTime();
        if (!isIdle) {
            await chrome.storage.local.set({ lastActivityTime: Date.now() });
        }
    }
}

export async function stopTracking() {
    await updateAccumulatedTime();
    await chrome.storage.local.remove("currentActivity");
}

export async function setIdleState(isIdle) {
    if (isIdle) {
        const { isIdle: wasIdle } = await chrome.storage.local.get("isIdle");
        if (wasIdle) return;

        await updateAccumulatedTime();
        // From this point on lastActivityTime represents the beginning of the
        // current idle period.  It must not be changed by service-worker
        // startup or maintenance work while isIdle remains true.
        await chrome.storage.local.set({
            isIdle: true,
            lastActivityTime: Date.now()
        });
    } else {
        await chrome.storage.local.remove("notifiedIdle");
        await chrome.storage.local.set({ isIdle: false, lastActivityTime: Date.now() });
    }
}

export async function resetTracking() {
    await chrome.storage.local.remove(["notifiedIdle", "notifiedProductive", "notifiedNonProductive"]);
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
