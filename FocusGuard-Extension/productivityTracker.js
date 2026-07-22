import { checkNotifications } from "./notificationManager.js";
let productiveSeconds = 0;
let nonProductiveSeconds = 0;
let neutralSeconds = 0;

let currentActivity = null;
let timer = null;

export function setCurrentActivity(activity) {
    currentActivity = activity;
}

export function startTracking() {

    if (timer) {
        clearInterval(timer);
    }

    timer = setInterval(() => {

        if (!currentActivity) {
            return;
        }

        switch (currentActivity.productivity_type) {

            case "PRODUCTIVE":
                productiveSeconds++;
                break;

            case "NON_PRODUCTIVE":
                nonProductiveSeconds++;
                break;

            default:
                neutralSeconds++;
                break;
        }
        checkNotifications(getTrackingStats());

        console.log({
            productiveSeconds,
            nonProductiveSeconds,
            neutralSeconds,
        });

    }, 1000);

}

export function stopTracking() {

    if (timer) {
        clearInterval(timer);
        timer = null;
    }

}

export function resetTracking() {

    stopTracking();

    productiveSeconds = 0;
    nonProductiveSeconds = 0;
    neutralSeconds = 0;
    currentActivity = null;

}

export function getTrackingStats() {

    return {
        productiveSeconds,
        nonProductiveSeconds,
        neutralSeconds,
    };

}
