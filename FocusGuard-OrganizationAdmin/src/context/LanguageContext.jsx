import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    getActiveLanguages,
    getTranslations,
} from "../services/authService";

export const PREFERRED_LANGUAGE_KEY = "preferredLanguage";
export const LEGACY_PUBLIC_LANGUAGE_KEY = "focusguard_public_language";
export const TRANSLATION_CACHE_PREFIX = "translations_";

const DEFAULT_LANGUAGE_CODE = "en-IN";
const translationRequests = new Map();

const LanguageContext = createContext(null);

const getResponseData = (response) => response?.data ?? response;

const getTranslationCacheKey = (languageCode) =>
    `${TRANSLATION_CACHE_PREFIX}${languageCode}`;

const readJsonCache = (key) => {
    try {
        const value = localStorage.getItem(key);

        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error("Language cache could not be read:", error);
        return null;
    }
};

const writeJsonCache = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const fetchAndCacheTranslations = async (languageCode) => {
    if (translationRequests.has(languageCode)) {
        return translationRequests.get(languageCode);
    }

    const request = getTranslations(languageCode)
        .then((response) => {
            const translationData = getResponseData(response) || {};

            writeJsonCache(
                getTranslationCacheKey(languageCode),
                translationData
            );

            return translationData;
        })
        .finally(() => {
            translationRequests.delete(languageCode);
        });

    translationRequests.set(languageCode, request);

    return request;
};

const getStoredLanguageCode = () =>
    localStorage.getItem(PREFERRED_LANGUAGE_KEY) ||
    localStorage.getItem(LEGACY_PUBLIC_LANGUAGE_KEY) ||
    DEFAULT_LANGUAGE_CODE;

const persistPreferredLanguage = (languageCode) => {
    localStorage.setItem(PREFERRED_LANGUAGE_KEY, languageCode);
    localStorage.setItem(LEGACY_PUBLIC_LANGUAGE_KEY, languageCode);
};

export const clearStoragePreservingLanguageCache = () => {
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

        if (cachedTranslations) {
            applyTranslations(languageCode, cachedTranslations);
        } else {
            applyTranslations(languageCode, {});
        }

        const translationData =
            await fetchAndCacheTranslations(languageCode);
        applyTranslations(languageCode, translationData);

        return translationData;
    }, [applyTranslations]);

    const setLanguageByCode = useCallback(
        async (languageCode) => {
            const nextLanguage =
                getLanguageByCode(languageCode) ||
                languages.find(
                    (language) =>
                        language.language_code === DEFAULT_LANGUAGE_CODE
                ) ||
                languages[0];
            const nextLanguageCode =
                nextLanguage?.language_code ||
                languageCode ||
                DEFAULT_LANGUAGE_CODE;

            persistPreferredLanguage(nextLanguageCode);
            activeLanguageCodeRef.current = nextLanguageCode;
            setCurrentLanguageCode(nextLanguageCode);

            loadTranslations(nextLanguageCode).catch((error) => {
                console.error("Translations could not be loaded:", error);
            });

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
                    languageData.find(
                        (language) =>
                            language.language_code === DEFAULT_LANGUAGE_CODE
                    ) ||
                    languageData[0];
                const nextLanguageCode =
                    selectedLanguage?.language_code || DEFAULT_LANGUAGE_CODE;

                persistPreferredLanguage(nextLanguageCode);
                activeLanguageCodeRef.current = nextLanguageCode;
                setCurrentLanguageCode(nextLanguageCode);
                void loadTranslations(nextLanguageCode);
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

export const useLanguage = () => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider.");
    }

    return context;
};
