import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getActiveLanguages,
  getTranslations,
} from "../services/authService";
import LanguageContext from "./languageContext";
import {
  getStoredLanguageCode,
  getTranslationCacheKey,
  persistPreferredLanguage,
  readJsonCache,
  writeJsonCache,
} from "./languageStorage";

const getResponseData = (response) => response?.data ?? response;
const translationRequests = new Map();

const fetchAndCacheTranslations = async (languageCode) => {
  if (translationRequests.has(languageCode)) {
    return translationRequests.get(languageCode);
  }

  const request = getTranslations(languageCode)
    .then((response) => {
      const translationData = getResponseData(response) || {};

      writeJsonCache(getTranslationCacheKey(languageCode), translationData);

      return translationData;
    })
    .finally(() => {
      translationRequests.delete(languageCode);
    });

  translationRequests.set(languageCode, request);

  return request;
};

export function LanguageProvider({ children }) {
  const [languages, setLanguages] = useState([]);
  const [currentLanguageCode, setCurrentLanguageCode] =
    useState(getStoredLanguageCode);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const activeLanguageCodeRef = useRef(currentLanguageCode);

  const getLanguageByCode = useCallback(
    (languageCode) =>
      languages.find(
        (language) => language.language_code === languageCode
      ),
    [languages]
  );

  const getLanguageById = useCallback(
    (languageId) =>
      languages.find(
        (language) => String(language.id) === String(languageId)
      ),
    [languages]
  );

  const applyTranslations = useCallback(
    (languageCode, translationData) => {
      if (activeLanguageCodeRef.current === languageCode) {
        setTranslations(translationData);
      }
    },
    []
  );

  const loadTranslations = useCallback(async (languageCode) => {
    if (!languageCode) {
      if (!activeLanguageCodeRef.current) {
        setTranslations({});
      }

      return {};
    }

    const cacheKey = getTranslationCacheKey(languageCode);
    const cachedTranslations = readJsonCache(cacheKey);

    // An earlier failed request may have cached `{}`. Treat that as a cache
    // miss; otherwise every translated label falls back to English forever.
    if (
      cachedTranslations &&
      Object.keys(cachedTranslations).length > 0
    ) {
      applyTranslations(languageCode, cachedTranslations);
      return cachedTranslations;
    }

    applyTranslations(languageCode, {});

    const translationData =
      await fetchAndCacheTranslations(languageCode);

    applyTranslations(languageCode, translationData);
    return translationData;
  }, [applyTranslations]);

  const setLanguageByCode = useCallback(
    async (languageCode) => {
      const nextLanguage = languages.length
        ? getLanguageByCode(languageCode) || languages[0]
        : null;
      const nextLanguageCode =
        nextLanguage?.language_code ||
        languageCode ||
        "";

      if (!nextLanguageCode) {
        activeLanguageCodeRef.current = "";
        setCurrentLanguageCode("");
        setTranslations({});

        return null;
      }

      persistPreferredLanguage(nextLanguageCode);
      activeLanguageCodeRef.current = nextLanguageCode;
      setCurrentLanguageCode(nextLanguageCode);

      try {
        await loadTranslations(nextLanguageCode);
      } catch (error) {
        console.error("Translations could not be loaded:", error);
      }

      return nextLanguage;
    },
    [getLanguageByCode, languages, loadTranslations]
  );

  const setLanguageById = useCallback(
    async (languageId) => {
      const language = getLanguageById(languageId);

      if (!language) {
        return null;
      }

      await setLanguageByCode(language.language_code);

      return language;
    },
    [getLanguageById, setLanguageByCode]
  );

  const setLanguageFromPreference = useCallback(
    async (preferredLanguage) => {
      if (!preferredLanguage) {
        return null;
      }

      if (preferredLanguage.language_code) {
        return setLanguageByCode(preferredLanguage.language_code);
      }

      if (preferredLanguage.id) {
        return setLanguageById(preferredLanguage.id);
      }

      return null;
    },
    [setLanguageByCode, setLanguageById]
  );

  useEffect(() => {
    let isMounted = true;

    const initializeLanguage = async () => {
      try {
        const response = await getActiveLanguages();
        const languageData = getResponseData(response) || [];

        if (!isMounted) {
          return;
        }

        setLanguages(languageData);

        const storedLanguageCode = getStoredLanguageCode();
        const selectedLanguage =
          languageData.find(
            (language) =>
              language.language_code === storedLanguageCode
          ) ||
          languageData[0];
        const nextLanguageCode = selectedLanguage?.language_code || "";

        if (!nextLanguageCode) {
          activeLanguageCodeRef.current = "";
          setCurrentLanguageCode("");
          setTranslations({});
          return;
        }

        persistPreferredLanguage(nextLanguageCode);
        activeLanguageCodeRef.current = nextLanguageCode;
        setCurrentLanguageCode(nextLanguageCode);
        await loadTranslations(nextLanguageCode);
      } catch (error) {
        console.error("Languages could not be loaded:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeLanguage();

    return () => {
      isMounted = false;
    };
  }, [loadTranslations]);

  const t = useCallback(
    (key, fallback = "") => translations[key] || fallback,
    [translations]
  );

  const value = useMemo(
    () => ({
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
      translations,
    }),
    [
      currentLanguageCode,
      getLanguageByCode,
      getLanguageById,
      languages,
      loading,
      setLanguageByCode,
      setLanguageById,
      setLanguageFromPreference,
      t,
      translations,
    ]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
