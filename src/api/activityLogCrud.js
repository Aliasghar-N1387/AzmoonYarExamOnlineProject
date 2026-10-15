const API_URL = import.meta.env.VITE_API_URL;
const getAccessToken = () => localStorage.getItem("accessToken");

const getActivityLogs = async ({ search = "", activityType = "" } = {}) => {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.append("SearchPhase", search.trim());
  }

  if (activityType) {
    params.append("EntityType", activityType);
  }

  const token = getAccessToken();

  console.log("========== ACTIVITY LOG ==========");
  console.log("Token:", token);
  console.log("Token exists:", !!token);
  console.log("Token length:", token?.length);
  console.log("Authorization:", token ? `Bearer ${token}` : "NO TOKEN");

  const url = `${API_URL}v1/activity-log?${params.toString()}`;

  console.log("URL:", url);

  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export default {
  getActivityLogs,
};
