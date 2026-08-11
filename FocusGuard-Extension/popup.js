import { CONFIG } from "./config.js";

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const dashboardBtn = document.getElementById("dashboardBtn");

const message = document.getElementById("message");

const loginContainer = document.getElementById("loginContainer");
const dashboardContainer = document.getElementById("dashboardContainer");

checkLoginStatus();

loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);
dashboardBtn.addEventListener("click", openDashboard);

async function checkLoginStatus() {

    const result = await chrome.storage.local.get("access");

    if (result.access) {

        loginContainer.style.display = "none";
        dashboardContainer.style.display = "block";

    } else {

        loginContainer.style.display = "block";
        dashboardContainer.style.display = "none";

    }

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

        await chrome.runtime.sendMessage({
            type: "FOCUSGUARD_LOGIN_SUCCESS",
        });

        loginContainer.style.display = "none";
        dashboardContainer.style.display = "block";

        console.log("Logged In", data);

    } catch (error) {

        console.error(error);

        message.innerText = "Server Error.";

    }

}

async function logout() {

    try {

        await chrome.runtime.sendMessage({
            type: "FOCUSGUARD_LOGOUT",
        });

    } catch (error) {

        console.log("Background logout cleanup failed.", error);

    }

    await chrome.storage.local.remove([
        "access",
        "refresh",
        "user"
    ]);

    usernameInput.value = "";
    passwordInput.value = "";
    message.innerText = "";

    dashboardContainer.style.display = "none";
    loginContainer.style.display = "block";

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
