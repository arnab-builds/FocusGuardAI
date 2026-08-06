import { useEffect, useRef } from "react";
import { useLanguage } from "../context/useLanguage";

export default function PublicLanguageDefault({ children }) {
  const { currentLanguageCode, languages, setLanguageByCode } = useLanguage();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !languages.length) {
      return;
    }

    const english = languages.find((language) =>
      language.language_code.toLowerCase().startsWith("en")
    );

    if (english && currentLanguageCode !== english.language_code) {
      setLanguageByCode(english.language_code);
    }

    initialized.current = true;
  }, [currentLanguageCode, languages, setLanguageByCode]);

  return children;
}
