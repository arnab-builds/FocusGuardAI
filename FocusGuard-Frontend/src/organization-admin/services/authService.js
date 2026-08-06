import api from "../api/api";

export const login = async (credentials) => {

    const response = await api.post(
        "login/",
        credentials
    );

    localStorage.setItem(
        "access",
        response.data.access
    );

    localStorage.setItem(
        "refresh",
        response.data.refresh
    );

    localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
    );

    localStorage.setItem(
        "username",
        response.data.user.username
    );

    localStorage.setItem(
        "email",
        response.data.user.email
    );

    localStorage.setItem(
        "organization",
        response.data.user.organization
    );

    return response.data;
};

export const registerOrganizationAdmin = async (data) => {

    const response = await api.post(
        "organization-register/",
        data
    );

    return response.data;

};

export const getInvitationEmail = async (inviteCode) => {
    const response = await api.get("invitation/lookup/", {
        params: { invite_code: inviteCode },
    });
    return response.data.email;
};

export const getActiveLanguages = async () => {

    const response = await api.get(
        "languages/"
    );

    return response.data;

};

export const getTranslations = async (languageCode) => {

    const response = await api.get(
        "translations/",
        {
            params: {
                language: languageCode,
            },
        }
    );

    return response.data;

};

export const logout = async () => {

    try {

        const refresh =
            localStorage.getItem("refresh");

        if (refresh) {

            await api.post("logout/", {
                refresh,
            });

        }

    }

    finally {

        localStorage.clear();

    }

};

export const getProfile = async () => {

    const response =
        await api.get("profile/");

    return response.data;

};
