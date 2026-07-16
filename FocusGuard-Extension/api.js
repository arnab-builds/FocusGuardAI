import { CONFIG } from "./config.js";

export async function startActivity(activityData) {

    try {

        const response = await fetch(
            `${CONFIG.BASE_URL}/activity/start/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${CONFIG.ACCESS_TOKEN}`
                },

                body: JSON.stringify(activityData)
            }
        );

        const data = await response.json();

        console.log("Activity API Response:");
        console.log(data);

    } catch (error) {

        console.error("Activity API Error:", error);

    }

}
export async function startInactivity(activity) {

    const response = await fetch(
        `${CONFIG.BASE_URL}/inactivity/start/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CONFIG.ACCESS_TOKEN}`
            },
            body: JSON.stringify(activity)
        }
    );

    const data = await response.json();

    console.log("Inactivity Started:", data);

}

export async function stopInactivity() {

    const response = await fetch(
        `${CONFIG.BASE_URL}/inactivity/stop/`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${CONFIG.ACCESS_TOKEN}`
            }
        }
    );

    const data = await response.json();

    console.log("Inactivity Stopped:", data);

}