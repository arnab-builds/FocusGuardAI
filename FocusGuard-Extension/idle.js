import {
    startInactivity,
    stopInactivity
} from "./api.js";

let currentWebsite = null;

export function updateCurrentWebsite(activity) {

    currentWebsite = activity ? { ...activity } : null;

}

chrome.idle.setDetectionInterval(60);

chrome.idle.onStateChanged.addListener(

    async (state) => {

        console.log("Idle State:", state);

        if (state === "idle" || state === "locked") {

            if (currentWebsite) {

                await startInactivity(currentWebsite);

            }

        }

        if (state === "active") {

            if (currentWebsite) {
           await stopInactivity();
}
        }

    }

);
