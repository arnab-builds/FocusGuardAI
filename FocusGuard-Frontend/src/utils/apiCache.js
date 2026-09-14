const memoryCache = new Map();
const activePromises = new Map();

export const getCache = (key) => memoryCache.get(key);

export const setCache = (key, data) => memoryCache.set(key, data);

export const clearCache = () => {
  memoryCache.clear();
  activePromises.clear();
};

export const invalidateCache = (key) => {
  if (typeof key === "string") {
    memoryCache.delete(key);
  } else if (key instanceof RegExp) {
    for (const k of memoryCache.keys()) {
      if (key.test(k)) memoryCache.delete(k);
    }
  }
};

export const fetchWithCache = async (key, fetcher) => {
  if (activePromises.has(key)) {
    return activePromises.get(key);
  }

  const promise = (async () => {
    try {
      const result = await fetcher();
      memoryCache.set(key, result);
      return result;
    } finally {
      activePromises.delete(key);
    }
  })();

  activePromises.set(key, promise);
  return promise;
};
