const API_URL = import.meta.env.VITE_API_URL;

const getAccessToken = () => localStorage.getItem("accessToken");

const getBooks = async (pageNumber = 1, pageSize = 8, searchPhase = "") => {
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
  });

  if (searchPhase.trim()) {
    params.append("SearchPhase", searchPhase.trim());
  }

  return await fetch(`${API_URL}v1/book?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
};

const createBook = async (data) => {
  return await fetch(`${API_URL}v1/book`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: data,
  });
};

const getDetail = async (id) => {
  return await fetch(`${API_URL}v1/book/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
};

const deleteBook = async (id) => {
  return await fetch(`${API_URL}v1/book/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
};

const updateBook = async (id, data) => {
  return await fetch(`${API_URL}v1/book/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: data,
  });
};

export default {
  getBooks,
  createBook,
  getDetail,
  deleteBook,
  updateBook,
};
