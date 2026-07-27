import API from "./api";

export const superAdminLogin = (data) =>
    API.post("super-admin/login/", data);