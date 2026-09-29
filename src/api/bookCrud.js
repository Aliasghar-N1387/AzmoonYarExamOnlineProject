const API_URL = import.meta.env.VITE_API_URL;
const accessToken = localStorage.getItem("accessToken");

const getBooks = async (pageNumber = 1, pageSize = 8) => {
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
  });

  return await fetch(`${API_URL}v1/book?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const createBook = async (data) => {
  return await fetch(`${API_URL}v1/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
};

export default {
  getBooks,
  createBook,
};
