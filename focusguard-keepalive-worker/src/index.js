const HEALTH_URL = "https://focusguard-backend-xn94.onrender.com/health/";

export async function pingHealth(fetchImpl = fetch) {
  try {
    const response = await fetchImpl(HEALTH_URL);

    if (!response.ok) {
      console.error(`FocusGuard health check failed with HTTP ${response.status}`);
      return;
    }

    console.log("FocusGuard health check succeeded");
  } catch (error) {
    console.error(
      "FocusGuard health check failed:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

export default {
  async scheduled() {
    await pingHealth();
  },

  fetch() {
    return new Response("FocusGuard keep-alive worker is active.");
  },
};
