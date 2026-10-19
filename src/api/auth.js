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

// تمدید توکن
const postRefreshTokenForExpierd = async (token) => {
  return fetch(`${API_URL}v1/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify({
      refreshToken: token,
    }),
  });
};

// خروج از حساب
const postRefreshToken = async (token) => {
  return fetch(`${API_URL}v1/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify({
      refreshToken: token,
    }),
  });
};

export default {
  getTokenLogin,
  registerUserSingUp,
  postRefreshToken,
  postRefreshTokenForExpierd,
};
