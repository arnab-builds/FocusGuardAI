import api from "../api/axios";

const CACHE_TTL = 5000;
const analyticsCache = new Map();
const analyticsRequests = new Map();

export const getAnalytics = async (date = null) => {
  const access = localStorage.getItem("access");
  const cacheKey = access ? `${access}:${date || ""}` : null;

  if (cacheKey) {
    const cached = analyticsCache.get(cacheKey);

    if (cached?.expiresAt > Date.now()) {
      return cached.data;
    }

    const pending = analyticsRequests.get(cacheKey);

    if (pending) {
      return pending;
    }
  }

  const request = api
    .get("/api/analytics/", {
      params: date ? { date } : {},
    })
    .then((response) => {
      if (cacheKey) {
        analyticsCache.set(cacheKey, {
          data: response.data,
          expiresAt: Date.now() + CACHE_TTL,
        });
      }

      return response.data;
    });

  if (cacheKey) {
    analyticsRequests.set(cacheKey, request);
    request.then(
      () => {
        if (analyticsRequests.get(cacheKey) === request) {
          analyticsRequests.delete(cacheKey);
        }
      },
      () => {
        if (analyticsRequests.get(cacheKey) === request) {
          analyticsRequests.delete(cacheKey);
        }
      }
    );
  }

  return request;
};