const API_URL = import.meta.env.VITE_API_URL;

const getTokenLogin = async (data) => {
  return fetch(`${API_URL}v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const registerUserSingUp = async (data) => {
  return fetch(`${API_URL}v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const getAccessToken = () => localStorage.getItem("accessToken");

const postRefreshToken = async (token) => {
  return fetch(`${API_URL}v1/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: token,
    }),
  });
};


export default { getTokenLogin , registerUserSingUp , postRefreshToken };
