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
};

export const translateCategory = (category, t, languageCode) => {
    if (!category) {
        return t("unknown", "Unknown");
    }

    const key = CATEGORY_KEYS[category];
    const catalogValue = key ? t(key, "") : "";

    if (catalogValue) {
        return catalogValue;
    }

    if (languageCode === "mr-IN") {
        return MARATHI_CATEGORIES[category] || category;
    }

    return category;
};
