const API_URL = import.meta.env.VITE_API_URL;
const getAccessToken = () => localStorage.getItem("accessToken");

const getData = async () => {
  return await fetch(`${API_URL}v1/Dashboard/Summary`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
};

export default { getData };
