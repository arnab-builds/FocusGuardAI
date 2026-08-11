import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const TRANSLATION_NAMESPACE = "translation";
export const FALLBACK_LANGUAGE = "en";

// Vite bundles these JSON files with the app, so every seeded UI label is
// available before the first network request. Keys use the same short ISO
// language codes returned by the API (for example, `hi` and `ta`).
const localCatalogModules = import.meta.glob("./locales/*.json", {
  eager: true,
  import: "default",
});

const resources = Object.entries(localCatalogModules).reduce(
  (catalogs, [path, translations]) => {
    const languageCode = path.match(/\/([^/]+)\.json$/)?.[1];

    if (languageCode) {
      catalogs[languageCode] = {
        [TRANSLATION_NAMESPACE]: translations,
      };
    }

    return catalogs;
  },
  {}
);

i18n.use(initReactI18next).init({
  resources,
  lng: FALLBACK_LANGUAGE,
  fallbackLng: FALLBACK_LANGUAGE,
  // Accept both API forms (`hi`) and browser/provider forms (`hi-IN`) while
  // resolving them to the bundled short-code catalog.
  load: "languageOnly",
  defaultNS: TRANSLATION_NAMESPACE,
  ns: [TRANSLATION_NAMESPACE],
  interpolation: { escapeValue: false },
  // Resources are bundled or inserted from the local cache. React must never
  // suspend while a remote translation request is in flight.
  react: { useSuspense: false },
  returnNull: false,
});

export default i18n;
