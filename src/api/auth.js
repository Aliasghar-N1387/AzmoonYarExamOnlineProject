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

export default { getTokenLogin , registerUserSingUp };
