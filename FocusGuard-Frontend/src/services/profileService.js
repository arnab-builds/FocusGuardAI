import api from "../api/axios";

const CACHE_TTL = 5000;
let profileCache = null;
let profileRequest = null;

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
  const access = localStorage.getItem("access");

  if (
    access &&
    profileCache?.access === access &&
    profileCache.expiresAt > Date.now()
  ) {
    return profileCache.data;
  }

  if (access && profileRequest?.access === access) {
    return profileRequest.promise;
  }

  const promise = (async () => {
    try {
      const response = await api.get("/api/profile/");
      const data = normalizeProfile(response.data);

      if (access) {
        profileCache = {
          access,
          data,
          expiresAt: Date.now() + CACHE_TTL,
        };
      }

      return data;
    } catch (error) {
      console.error("Profile API Error:", error);
      throw error;
    }
  })();

  if (access) {
    profileRequest = { access, promise };
    promise.then(
      () => {
        if (profileRequest?.promise === promise) {
          profileRequest = null;
        }
      },
      () => {
        if (profileRequest?.promise === promise) {
          profileRequest = null;
        }
      }
    );
  }

  return promise;
};
