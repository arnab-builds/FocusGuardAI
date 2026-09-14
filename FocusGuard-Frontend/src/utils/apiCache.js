const CACHE_VERSION = "v1";
const STORAGE_KEY = `focusguard_api_cache_${CACHE_VERSION}`;

const loadPersistedCache = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? new Map(JSON.parse(stored)) : new Map();
  } catch (e) {
    return new Map();
  }
};

const memoryCache = loadPersistedCache();
const activePromises = new Map();

const syncCache = () => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(memoryCache.entries())));
  } catch (e) {
    console.warn("Failed to persist cache", e);
  }
};

export const getCache = (key) => memoryCache.get(key);

export const setCache = (key, data) => {
  memoryCache.set(key, data);
  syncCache();
};

export const clearCache = () => {
  memoryCache.clear();
  activePromises.clear();
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
};

export const invalidateCache = (key) => {
  if (typeof key === "string") {
    memoryCache.delete(key);
  } else if (key instanceof RegExp) {
    for (const k of memoryCache.keys()) {
      if (key.test(k)) memoryCache.delete(k);
    }
  }
  syncCache();
};

export const fetchWithCache = async (key, fetcher) => {
  if (activePromises.has(key)) {
    return activePromises.get(key);
  }

  const promise = (async () => {
    try {
      const result = await fetcher();
      setCache(key, result);
      return result;
    } finally {
      activePromises.delete(key);
    }
  })();

  activePromises.set(key, promise);
  return promise;
};
