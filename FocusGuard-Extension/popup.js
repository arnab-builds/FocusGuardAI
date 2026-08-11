import { CONFIG } from "./config.js";

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const dashboardBtn = document.getElementById("dashboardBtn");

const message = document.getElementById("message");

const loginContainer = document.getElementById("loginContainer");
const dashboardContainer = document.getElementById("dashboardContainer");
let currentAccess = null;
let sessionStateVersion = 0;

// Render the last known state synchronously so opening the popup never waits
// for Chrome storage or the background service worker to wake up.
renderSession(localStorage.getItem("focusguard_session_state") === "active");
checkLoginStatus();

loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);
dashboardBtn.addEventListener("click", openDashboard);

async function checkLoginStatus() {
    const requestVersion = sessionStateVersion;

    if (localStorage.getItem("focusguard_session_state") === "logged_out") {
        renderSession(false);
        return;
    }

    const result = await chrome.storage.local.get("access");

    // Do not let a slow startup read overwrite a newer login or logout click.
    if (requestVersion !== sessionStateVersion) {
        return;
    }

    currentAccess = result.access || null;

    renderSession(Boolean(result.access));

}

function renderSession(isAuthenticated) {

    loginContainer.style.display = isAuthenticated ? "none" : "block";
    dashboardContainer.style.display = isAuthenticated ? "block" : "none";
    dashboardContainer.setAttribute("aria-hidden", String(!isAuthenticated));

}

async function login() {

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {

        message.innerText = "Please enter username and password.";
        return;

    }

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/login/",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    username,
                    password,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {

            message.innerText =
                data.detail ||
                data.error ||
                "Login failed.";

            return;

        }

        await chrome.storage.local.set({
            access: data.access,
            refresh: data.refresh,
            user: data.user,
        });

        currentAccess = data.access;
        sessionStateVersion++;
        localStorage.setItem("focusguard_session_state", "active");
        renderSession(true);

        // Starting tracking can involve network work in the service worker.
        // Do not keep the popup waiting for it to finish rendering.
        chrome.runtime.sendMessage({
            type: "FOCUSGUARD_LOGIN_SUCCESS",
        }).catch((error) => {
            console.log("Background login startup failed.", error);
        });

        console.log("Logged In", data);

    } catch (error) {

        console.error(error);

        message.innerText = "Server Error.";

    }

}

async function logout() {

    // Give immediate feedback. The service worker can finish ending the
    // current activity after the popup has already shown the signed-out view.
    sessionStateVersion++;
    localStorage.setItem("focusguard_session_state", "logged_out");
    usernameInput.value = "";
    passwordInput.value = "";
    message.innerText = "";
    renderSession(false);

    const logoutAccess = currentAccess;
    currentAccess = null;

    // Remove the session before background cleanup finishes. The token is
    // included in the message so the worker can still close the active
    // backend activity without leaving this browser signed in.
    await chrome.storage.local.remove([
        "access",
        "refresh",
        "user"
    ]);

    chrome.runtime.sendMessage({
            type: "FOCUSGUARD_LOGOUT",
            access: logoutAccess,
    }).catch((error) => {
        console.log("Background logout cleanup failed.", error);
    });

    console.log("Logged Out");

}

async function openDashboard() {
    const { access, refresh, user } = await chrome.storage.local.get([
        "access",
        "refresh",
        "user",
    ]);

    if (!access || !user) {
        message.innerText = "Your session has expired. Please sign in again.";
        await checkLoginStatus();
        return;
    }

    // The fragment is deliberately used so JWTs are never sent to the web
    // server or included in its request logs. The dashboard consumes this
    // existing session once and immediately removes the fragment from history.
    const session = encodeURIComponent(JSON.stringify({ access, refresh, user }));
    await chrome.tabs.create({
        url: `${CONFIG.DASHBOARD_URL}#extension-session=${session}`,
    });
}
