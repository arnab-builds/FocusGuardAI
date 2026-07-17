import { startActivity } from "./api.js";
import { getWebsiteName } from "./utils.js";
import { updateCurrentWebsite } from "./idle.js";

console.log("FocusGuard Background Service Started");

// Current tracked activity
let currentActivity = null;

async function isAuthenticated() {
    const result = await chrome.storage.local.get("access");
    return Boolean(result.access);
}

function isValidTab(tab) {

    if (!tab.url) {
        return false;
    }

    const hostname = new URL(tab.url).hostname;

    const ignoredHosts = [
        "127.0.0.1",
        "localhost"
    ];

    return (
        !tab.url.startsWith("chrome://") &&
        !tab.url.startsWith("chrome-extension://") &&
        !tab.url.startsWith("edge://") &&
        !tab.url.startsWith("about:") &&
        !tab.url.startsWith("devtools://") &&
        !tab.url.startsWith("view-source:") &&
        !ignoredHosts.includes(hostname)
    );
}
async function processTab(tab) {

    if (!(await isAuthenticated())) {
        currentActivity = null;
        return;
    }

    if (!isValidTab(tab)) {
        return;
    }

    const activity = {

        tabId: tab.id,

        website_name: getWebsiteName(tab.url),

        website_url: tab.url,

        tab_title: tab.title

    };

    // First activity
    if (!currentActivity) {

        currentActivity = activity;
        updateCurrentWebsite(activity);
        console.log("First Activity", activity);
        await startActivity(activity);

        return;

    }

    // Same URL
    if (currentActivity.website_url === activity.website_url) {

        console.log("Same URL - Ignored");

        // Update title only
        currentActivity.tab_title = activity.tab_title;

        return;

    }

    // URL changed

    currentActivity = activity;
    updateCurrentWebsite(activity);
    console.log("New Activity", activity);

    await startActivity(activity);

}

// -----------------------------

chrome.tabs.onActivated.addListener(async ({ tabId }) => {

    try {

        const tab = await chrome.tabs.get(tabId);

        await processTab(tab);

    }

    catch (error) {

        console.error(error);

    }

});

// -----------------------------

chrome.tabs.onUpdated.addListener(

    async (tabId, changeInfo, tab) => {

        if (changeInfo.status !== "complete") {

            return;

        }

        await processTab(tab);

    }

);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type !== "FOCUSGUARD_AUTH_CHANGED") {
        return false;
    }

    chrome.tabs.query(
        {
            active: true,
            currentWindow: true,
        },
        async ([tab]) => {
            try {
                if (tab) {
                    currentActivity = null;
                    await processTab(tab);
                }

                sendResponse({ ok: true });
            } catch (error) {
                console.error(error);
                sendResponse({
                    ok: false,
                    error: error.message,
                });
            }
        }
    );

    return true;
});
