import API from "./api";

export const superAdminLogin = (data) =>
    API.post("super-admin/login/", data);

export const getActiveLanguages = () =>
    API.get("languages/");

export const getTranslations = (languageCode) =>
    API.get(
        "translations/",
        {
            params: {
                language: languageCode,
            },
        }
    );
