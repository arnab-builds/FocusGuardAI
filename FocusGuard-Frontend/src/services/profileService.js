import api from "../api/axios";

const normalizeProfile = (profile) => {
  const organization =
    typeof profile?.organization === "string"
      ? profile.organization
      : profile?.organization?.name;

  return {
    ...profile,
    organization: organization || null,
  };
};

export const getProfile = async () => {
  try {
    const response = await api.get("/api/profile/");
    return normalizeProfile(response.data);
  } catch (error) {
    console.error("Profile API Error:", error);
    throw error;
  }
};
