
const API_URL = import.meta.env.VITE_API_URL;

const registerUserSingUp = async (data) => {
  return await fetch(`${API_URL}v1/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const loginUser = async (data) => {
  return await fetch(`${API_URL}v1/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const loginWithGoogle = async (data) => {
  return await fetch(`${API_URL}v1/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export default {
  registerUserSingUp,
  loginUser,
  loginWithGoogle,
};
