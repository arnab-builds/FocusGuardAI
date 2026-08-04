import api from "../api/axios";
import { getProfile } from "./profileService";

export const requestDeactivation = async (reason) => {
  const profile = await getProfile();
  const endpoint =
    profile.role === "NORMAL_USER"
      ? "/api/normal-user/deactivation-request/"
      : "/api/employee/deactivation-request/";
  const response = await api.post(
    endpoint,
    {
      reason,
    }
  );

  return response.data;
};
