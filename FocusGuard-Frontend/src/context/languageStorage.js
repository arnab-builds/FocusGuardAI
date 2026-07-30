export const PREFERRED_LANGUAGE_KEY = "preferredLanguage";
export const LEGACY_PUBLIC_LANGUAGE_KEY = "focusguard_public_language";
export const TRANSLATION_CACHE_PREFIX = "translations_";
// Bump this when the translation catalog or its loading behavior changes so
// clients do not retain an earlier, incomplete catalog indefinitely.
export const TRANSLATION_CACHE_VERSION = "v2";

export const getTranslationCacheKey = (languageCode) =>
  `${TRANSLATION_CACHE_PREFIX}${TRANSLATION_CACHE_VERSION}_${languageCode}`;

const canUseLocalStorage = () =>
  typeof window !== "undefined" && Boolean(window.localStorage);

export const readJsonCache = (key) => {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const value = localStorage.getItem(key);

    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Language cache could not be read:", error);
    return null;
  }
};

export const writeJsonCache = (key, value) => {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Language cache could not be written:", error);
  }
};

export const getStoredLanguageCode = () =>
  canUseLocalStorage()
    ? localStorage.getItem(PREFERRED_LANGUAGE_KEY) ||
      localStorage.getItem(LEGACY_PUBLIC_LANGUAGE_KEY) ||
      ""
    : "";

export const persistPreferredLanguage = (languageCode) => {
  if (!canUseLocalStorage()) {
    return;
  }

  localStorage.setItem(PREFERRED_LANGUAGE_KEY, languageCode);
  localStorage.setItem(LEGACY_PUBLIC_LANGUAGE_KEY, languageCode);
};

export const clearStoragePreservingLanguageCache = () => {
  if (!canUseLocalStorage()) {
    return;
  }

  const cachedLanguageEntries = [];

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);

    if (
      key === PREFERRED_LANGUAGE_KEY ||
      key === LEGACY_PUBLIC_LANGUAGE_KEY ||
      key?.startsWith(TRANSLATION_CACHE_PREFIX)
    ) {
      cachedLanguageEntries.push([
        key,
        localStorage.getItem(key),
      ]);
    }
  }

  localStorage.clear();

  cachedLanguageEntries.forEach(([key, value]) => {
    if (value !== null) {
      localStorage.setItem(key, value);
    }
  });
};
