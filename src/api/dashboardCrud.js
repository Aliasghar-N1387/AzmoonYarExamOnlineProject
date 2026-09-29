const API_URL = import.meta.env.VITE_API_URL;
const accessToken = localStorage.getItem("accessToken");

const getData = async ({ search = "", activityType = "" } = {}) => {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  if (activityType) {
    params.append("activityType", activityType);
  }

  return await fetch(`${API_URL}v1/Dashboard/Summary?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export default {
  getData,
};
