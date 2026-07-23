import api from "../api/axios";

export const requestDeactivation = async (reason) => {
  const response = await api.post(
    "/api/employee/deactivation-request/",
    {
      reason,
    }
  );

  return response.data;
};