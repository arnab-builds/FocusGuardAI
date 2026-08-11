import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { I18nextProvider } from "react-i18next";

import { getActiveLanguages, getTranslations } from "../services/authService";
import i18n, {
  FALLBACK_LANGUAGE,
  TRANSLATION_NAMESPACE,
} from "../i18n/i18n";
import LanguageContext from "./languageContext";
import {
  getStoredLanguageCode,
  getTranslationCacheKey,
  persistPreferredLanguage,
  readJsonCache,
  writeJsonCache,
} from "./languageStorage";

const REMOTE_TRANSLATION_TIMEOUT_MS = 2_000;
const getResponseData = (response) => response?.data ?? response;
const translationRequests = new Map();
const attemptedRemoteLanguages = new Set();

const isTranslationMap = (value) =>
  value && typeof value === "object" && !Array.isArray(value);

const addResourceBundle = (languageCode, translations) => {
  if (!languageCode || !isTranslationMap(translations)) return;

  i18n.addResourceBundle(
    languageCode,
    TRANSLATION_NAMESPACE,
    translations,
    true,
    // Bundled JSON is the authoritative UI catalog. Cached/provider values
    // may fill new keys, but must never replace a known local translation
    // with an older English value.
    false
  );
};

const getCachedTranslations = (languageCode) => {
  const translations = readJsonCache(getTranslationCacheKey(languageCode));
  return isTranslationMap(translations) ? translations : null;
};

// This endpoint is the server-side translation gateway. Keeping the provider
// call there prevents exposing the Sarvam key in the browser.
const fetchAndCacheTranslations = (languageCode) => {
  if (translationRequests.has(languageCode)) {
    return translationRequests.get(languageCode);
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    REMOTE_TRANSLATION_TIMEOUT_MS
  );

  const request = getTranslations(languageCode, {
    signal: controller.signal,
    timeout: REMOTE_TRANSLATION_TIMEOUT_MS,
  })
    .then((response) => {
      const translations = getResponseData(response);

      if (!isTranslationMap(translations) || !Object.keys(translations).length) {
        return null;
      }

      writeJsonCache(getTranslationCacheKey(languageCode), translations);
      addResourceBundle(languageCode, translations);
      return translations;
    })
    .catch((error) => {
      // Timeouts and provider failures deliberately leave the local fallback
      // visible. They are expected transient failures, not render errors.
      if (error?.code !== "ERR_CANCELED") {
        console.warn("Dynamic translations are unavailable:", error);
      }
      return null;
    })
    .finally(() => {
      window.clearTimeout(timeoutId);
      translationRequests.delete(languageCode);
    });

  translationRequests.set(languageCode, request);
  return request;
};

export function LanguageProvider({ children }) {
  const [languages, setLanguages] = useState([]);
  const [currentLanguageCode, setCurrentLanguageCode] = useState(getStoredLanguageCode);
  const [translationRevision, setTranslationRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const activeLanguageCodeRef = useRef(currentLanguageCode);

  const getLanguageByCode = useCallback(
    (languageCode) => languages.find((language) => language.language_code === languageCode),
    [languages]
  );

  const getLanguageById = useCallback(
    (languageId) => languages.find((language) => String(language.id) === String(languageId)),
    [languages]
  );

  const hydrateCachedTranslations = useCallback((languageCode) => {
    const cachedTranslations = getCachedTranslations(languageCode);
    if (cachedTranslations && Object.keys(cachedTranslations).length) {
      addResourceBundle(languageCode, cachedTranslations);
      return cachedTranslations;
    }
    return {};
  }, []);

  const requestMissingTranslations = useCallback((languageCode) => {
    if (!languageCode || languageCode === FALLBACK_LANGUAGE || attemptedRemoteLanguages.has(languageCode)) {
      return;
    }

    attemptedRemoteLanguages.add(languageCode);
    // Do not await this request. The caller has already rendered the local
    // i18next fallback, and a successful response simply refreshes the text.
    void fetchAndCacheTranslations(languageCode).then((translations) => {
      if (translations && activeLanguageCodeRef.current === languageCode) {
        setTranslationRevision((revision) => revision + 1);
      }
    });
  }, []);

  const setLanguageByCode = useCallback((languageCode) => {
    const nextLanguage = languages.length
      ? getLanguageByCode(languageCode) || languages[0]
      : null;
    const nextLanguageCode = nextLanguage?.language_code || languageCode || "";

    if (!nextLanguageCode) {
      activeLanguageCodeRef.current = FALLBACK_LANGUAGE;
      setCurrentLanguageCode("");
      void i18n.changeLanguage(FALLBACK_LANGUAGE);
      return Promise.resolve(null);
    }

    persistPreferredLanguage(nextLanguageCode);
    activeLanguageCodeRef.current = nextLanguageCode;
    hydrateCachedTranslations(nextLanguageCode);
    setCurrentLanguageCode(nextLanguageCode);
    void i18n.changeLanguage(nextLanguageCode).then(() => {
      setTranslationRevision((revision) => revision + 1);
    });

    // Resolve immediately: navigation and UI state must never wait on Sarvam.
    return Promise.resolve(nextLanguage);
  }, [getLanguageByCode, hydrateCachedTranslations, languages]);

  const setLanguageById = useCallback((languageId) => {
    const language = getLanguageById(languageId);
    return language
      ? setLanguageByCode(language.language_code).then(() => language)
      : Promise.resolve(null);
  }, [getLanguageById, setLanguageByCode]);

  const setLanguageFromPreference = useCallback((preferredLanguage) => {
    if (preferredLanguage?.language_code) return setLanguageByCode(preferredLanguage.language_code);
    if (preferredLanguage?.id) return setLanguageById(preferredLanguage.id);
    return Promise.resolve(null);
  }, [setLanguageByCode, setLanguageById]);

  useEffect(() => {
    let isMounted = true;
    getActiveLanguages()
      .then((response) => {
        if (!isMounted) return;
        const languageData = getResponseData(response) || [];
        setLanguages(languageData);
        const storedLanguageCode = getStoredLanguageCode();
        const selectedLanguage = languageData.find((language) => language.language_code === storedLanguageCode) || languageData[0];
        const nextLanguageCode = selectedLanguage?.language_code || FALLBACK_LANGUAGE;
        persistPreferredLanguage(nextLanguageCode);
        activeLanguageCodeRef.current = nextLanguageCode;
        hydrateCachedTranslations(nextLanguageCode);
        setCurrentLanguageCode(nextLanguageCode);
        void i18n.changeLanguage(nextLanguageCode).then(() => {
          if (isMounted) setTranslationRevision((revision) => revision + 1);
        });
      })
      .catch((error) => console.error("Languages could not be loaded:", error))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [hydrateCachedTranslations]);

  const t = useCallback((key, fallback = "") => {
    const languageCode = activeLanguageCodeRef.current || FALLBACK_LANGUAGE;
    const hasLocalTranslation = i18n.exists(key, {
      lng: languageCode,
      ns: TRANSLATION_NAMESPACE,
      fallbackLng: false,
    });

    if (!hasLocalTranslation) requestMissingTranslations(languageCode);

    return i18n.t(key, {
      lng: languageCode,
      ns: TRANSLATION_NAMESPACE,
      defaultValue: fallback || key,
    });
  }, [requestMissingTranslations]);

  const value = useMemo(() => ({
    currentLanguageCode,
    currentLanguage: getLanguageByCode(currentLanguageCode),
    getLanguageByCode,
    getLanguageById,
    languages,
    loading,
    setLanguageByCode,
    setLanguageById,
    setLanguageFromPreference,
    t,
    translationVersion: translationRevision,
    translations: i18n.getResourceBundle(currentLanguageCode, TRANSLATION_NAMESPACE) || {},
  }), [currentLanguageCode, getLanguageByCode, getLanguageById, languages, loading, setLanguageByCode, setLanguageById, setLanguageFromPreference, t, translationRevision]);

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
    </I18nextProvider>
  );
}
