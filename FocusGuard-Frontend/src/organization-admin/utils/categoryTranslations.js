const CATEGORY_KEYS = {
    "AI Chat": "category_ai_chat",
    "AI Tools": "category_ai_tools",
    "Coding Practice": "category_coding_practice",
    Education: "category_education",
    Gaming: "category_gaming",
    Other: "category_other",
    Uncategorized: "category_uncategorized",
    "Remote Access": "category_remote_access",
    "Search Engine": "category_search_engine",
    "Video Streaming": "category_video_streaming",
    "Game Store": "category_game_store",
};

// Older activity records (and some API translation responses) contain the
// i18n identifier rather than the category's display value.  Accept both
// representations so an identifier is never shown to an administrator.
const CATEGORY_NAMES_BY_KEY = Object.fromEntries(
    Object.entries(CATEGORY_KEYS).map(([name, key]) => [key, name])
);

const getCategoryDisplayName = (category) => {
    const value = String(category || "").trim();

    if (!value) return "";

    if (CATEGORY_NAMES_BY_KEY[value]) {
        return CATEGORY_NAMES_BY_KEY[value];
    }

    // Keep unfamiliar legacy identifiers readable as well, for example
    // `category_business_news` becomes `Business News`.
    if (value.startsWith("category_")) {
        return value
            .slice("category_".length)
            .split("_")
            .filter(Boolean)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    return value;
};

// Analytics categories are stored as fixed English values. These local
// fallbacks keep existing historical data localized even if the provider is
// temporarily unavailable; catalog values take precedence when present.
const MARATHI_CATEGORIES = {
    "AI Chat": "एआय चॅट",
    "AI Tools": "एआय साधने",
    "Coding Practice": "कोडिंग सराव",
    Education: "शिक्षण",
    Gaming: "गेमिंग",
    Other: "इतर",
    Uncategorized: "अवर्गीकृत",
    "Remote Access": "दूरस्थ प्रवेश",
    "Search Engine": "शोध इंजिन",
    "Video Streaming": "व्हिडिओ प्रवाह",
    "Game Store": "गेम स्टोअर",
};

const BENGALI_CATEGORIES = {
    "AI Chat": "এআই চ্যাট",
    "AI Tools": "এআই টুলস",
    "Coding Practice": "কোডিং অনুশীলন",
    Education: "শিক্ষা",
    Gaming: "গেমিং",
    Other: "অন্যান্য",
    Uncategorized: "শ্রেণীবিহীন",
    "Remote Access": "দূরবর্তী প্রবেশাধিকার",
    "Search Engine": "অনুসন্ধান ইঞ্জিন",
    "Video Streaming": "ভিডিও স্ট্রিমিং",
    "Game Store": "গেম স্টোর",
};

const CATEGORY_FALLBACKS = {
    "bn-IN": BENGALI_CATEGORIES,
    "gu-IN": {
        "AI Chat": "એઆઈ ચેટ", "AI Tools": "એઆઈ સાધનો", "Coding Practice": "કોડિંગ અભ્યાસ", Education: "શિક્ષણ", Gaming: "ગેમિંગ", Other: "અન્ય", Uncategorized: "વર્ગીકૃત નથી", "Remote Access": "દૂરસ્થ ઍક્સેસ", "Search Engine": "શોધ એન્જિન", "Video Streaming": "વિડિયો સ્ટ્રીમિંગ", "Game Store": "ગેમ સ્ટોર",
    },
    "hi-IN": {
        "AI Chat": "एआई चैट", "AI Tools": "एआई टूल्स", "Coding Practice": "कोडिंग अभ्यास", Education: "शिक्षा", Gaming: "गेमिंग", Other: "अन्य", Uncategorized: "अवर्गीकृत", "Remote Access": "रिमोट एक्सेस", "Search Engine": "खोज इंजन", "Video Streaming": "वीडियो स्ट्रीमिंग", "Game Store": "गेम स्टोर",
    },
    "kn-IN": {
        "AI Chat": "ಎಐ ಚಾಟ್", "AI Tools": "ಎಐ ಉಪಕರಣಗಳು", "Coding Practice": "ಕೋಡಿಂಗ್ ಅಭ್ಯಾಸ", Education: "ಶಿಕ್ಷಣ", Gaming: "ಗೇಮಿಂಗ್", Other: "ಇತರೆ", Uncategorized: "ವರ್ಗೀಕರಿಸದ", "Remote Access": "ದೂರಸ್ಥ ಪ್ರವೇಶ", "Search Engine": "ಹುಡುಕಾಟ ಎಂಜಿನ್", "Video Streaming": "ವೀಡಿಯೊ ಸ್ಟ್ರೀಮಿಂಗ್", "Game Store": "ಗೇಮ್ ಸ್ಟೋರ್",
    },
    "ml-IN": {
        "AI Chat": "എഐ ചാറ്റ്", "AI Tools": "എഐ ഉപകരണങ്ങൾ", "Coding Practice": "കോഡിംഗ് പരിശീലനം", Education: "വിദ്യാഭ്യാസം", Gaming: "ഗെയിമിംഗ്", Other: "മറ്റുള്ളവ", Uncategorized: "വർഗ്ഗീകരിക്കാത്തത്", "Remote Access": "റിമോട്ട് ആക്സസ്", "Search Engine": "തിരയൽ എഞ്ചിൻ", "Video Streaming": "വീഡിയോ സ്ട്രീമിംഗ്", "Game Store": "ഗെയിം സ്റ്റോർ",
    },
    "mr-IN": MARATHI_CATEGORIES,
    "od-IN": {
        "AI Chat": "ଏଆଇ ଚାଟ", "AI Tools": "ଏଆଇ ସାଧନ", "Coding Practice": "କୋଡିଂ ଅଭ୍ୟାସ", Education: "ଶିକ୍ଷା", Gaming: "ଗେମିଂ", Other: "ଅନ୍ୟାନ୍ୟ", Uncategorized: "ଶ୍ରେଣୀବିହୀନ", "Remote Access": "ରିମୋଟ୍ ଆକ୍ସେସ୍", "Search Engine": "ସନ୍ଧାନ ଇଞ୍ଜିନ", "Video Streaming": "ଭିଡିଓ ଷ୍ଟ୍ରିମିଂ", "Game Store": "ଗେମ୍ ଷ୍ଟୋର",
    },
    "pa-IN": {
        "AI Chat": "ਏਆਈ ਚੈਟ", "AI Tools": "ਏਆਈ ਸਾਧਨ", "Coding Practice": "ਕੋਡਿੰਗ ਅਭਿਆਸ", Education: "ਸਿੱਖਿਆ", Gaming: "ਗੇਮਿੰਗ", Other: "ਹੋਰ", Uncategorized: "ਵਰਗੀਕ੍ਰਿਤ ਨਹੀਂ", "Remote Access": "ਰਿਮੋਟ ਐਕਸੈਸ", "Search Engine": "ਖੋਜ ਇੰਜਣ", "Video Streaming": "ਵੀਡੀਓ ਸਟ੍ਰੀਮਿੰਗ", "Game Store": "ਗੇਮ ਸਟੋਰ",
    },
    "ta-IN": {
        "AI Chat": "ஏஐ அரட்டை", "AI Tools": "ஏஐ கருவிகள்", "Coding Practice": "குறியிடல் பயிற்சி", Education: "கல்வி", Gaming: "கேமிங்", Other: "மற்றவை", Uncategorized: "வகைப்படுத்தப்படாதது", "Remote Access": "தொலைநிலை அணுகல்", "Search Engine": "தேடுபொறி", "Video Streaming": "வீடியோ ஸ்ட்ரீமிங்", "Game Store": "கேம் ஸ்டோர்",
    },
    "te-IN": {
        "AI Chat": "ఏఐ చాట్", "AI Tools": "ఏఐ సాధనాలు", "Coding Practice": "కోడింగ్ అభ్యాసం", Education: "విద్య", Gaming: "గేమింగ్", Other: "ఇతరాలు", Uncategorized: "వర్గీకరించనిది", "Remote Access": "రిమోట్ యాక్సెస్", "Search Engine": "శోధన యంత్రం", "Video Streaming": "వీడియో స్ట్రీమింగ్", "Game Store": "గేమ్ స్టోర్",
    },
};

export const translateCategory = (category, t, languageCode) => {
    if (!category) {
        return t("unknown", "Unknown");
    }

    const displayName = getCategoryDisplayName(category);
    const key = CATEGORY_KEYS[displayName];
    const catalogValue = key ? t(key, "") : "";

    // `t` returns the key itself if that key is absent from the catalog. In
    // that case, use the clean display name instead of exposing `category_*`.
    if (catalogValue && catalogValue !== key) {
        return catalogValue;
    }

    const languageFallbacks = CATEGORY_FALLBACKS[languageCode];

    if (languageFallbacks) {
        return languageFallbacks[displayName] || displayName;
    }

    return displayName;
};
