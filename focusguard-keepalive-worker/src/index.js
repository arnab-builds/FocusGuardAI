const RENDER_HEALTH_URL = "https://focusguard-backend-xn94.onrender.com/health/";
const DB_HEALTH_URL = "https://focusguard-backend-xn94.onrender.com/health/db/";

export async function pingRenderHealth(fetchImpl = fetch) {
  try {
    const response = await fetchImpl(RENDER_HEALTH_URL);

    if (!response.ok) {
      console.error(
        `FocusGuard Render health check failed with HTTP ${response.status}`
      );
      return false;
    }

    console.log("FocusGuard Render health check succeeded");
    return true;
  } catch (error) {
    console.error(
      "FocusGuard Render health check failed:",
      error instanceof Error ? error.message : String(error)
    );
    return false;
  }
}

export async function pingDbHealth(secret, fetchImpl = fetch) {
  if (!secret) {
    console.error(
      "FocusGuard DB health check skipped: CLOUDFLARE_DB_HEALTH_SECRET is not configured"
    );
    return false;
  }

  try {
    const response = await fetchImpl(DB_HEALTH_URL, {
      method: "GET",
      headers: {
        "X-Health-Secret": secret,
      },
    });

    if (!response.ok) {
      console.error(
        `FocusGuard DB health check failed with HTTP ${response.status}`
      );
      return false;
    }

    console.log("FocusGuard DB health check succeeded");
    return true;
  } catch (error) {
    console.error(
      "FocusGuard DB health check failed:",
      error instanceof Error ? error.message : String(error)
    );
    return false;
  }
}

// Preserve backwards compatibility for existing imports
export const pingHealth = pingRenderHealth;

export default {
  async scheduled(event, env) {
    const cron = event?.cron;
    const dbSecret = env?.CLOUDFLARE_DB_HEALTH_SECRET;

    if (cron === "0 */6 * * *") {
      console.log("Triggered 6-hour DB keepalive schedule");
      await pingDbHealth(dbSecret);
    } else {
      console.log("Triggered 10-minute Render keepalive schedule");
      await pingRenderHealth();
    }
  },

  fetch() {
    return new Response("FocusGuard keep-alive worker is active.");
  },
};

