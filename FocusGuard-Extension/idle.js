import {
    startInactivity,
    stopInactivity
} from "./api.js";
import { setIdleState } from "./productivityTracker.js";

export function updateCurrentWebsite(activity) {
    // We update local storage to persist across service worker suspension
    if (activity) {
        chrome.storage.local.set({ idleCurrentWebsite: { ...activity } });
    } else {
        chrome.storage.local.remove("idleCurrentWebsite");
    }
}

chrome.idle.setDetectionInterval(60);

chrome.idle.onStateChanged.addListener(async (state) => {
    console.log("Idle State:", state);

    const { access, idleCurrentWebsite } = await chrome.storage.local.get(["access", "idleCurrentWebsite"]);

    if (!access) {
        return;
    }

    if (state === "idle" || state === "locked") {
        await setIdleState(true);
        if (idleCurrentWebsite) {
            await startInactivity(idleCurrentWebsite);
        }
    }

    if (state === "active") {
        await setIdleState(false);
        if (idleCurrentWebsite) {
            await stopInactivity();
        }
    }
});
