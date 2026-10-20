const API_URL = import.meta.env.VITE_API_URL;

const getAccessToken = () => localStorage.getItem("accessToken");

const getQuestions = async (pageNumber = 1, pageSize = 8, filters = {}) => {
  const params = new URLSearchParams();

  params.set("PageNumber", String(pageNumber));
  params.set("PageSize", String(pageSize));

  const filterMap = {
    search: "SearchPhase",
    difficultyLevel: "DifficultyLevel",
    grade: "Grade",
    questionType: "QuestionType",
    questionStatus: "QuestionStatus",
  };

  Object.entries(filterMap).forEach(([key, paramName]) => {
    let value = filters[key];

    // پشتیبانی از مقادیر دریافتی از Dropdown
    if (value && typeof value === "object") {
      value = value.id;
    }

    // مقادیر خالی یا انتخاب‌نشده را ارسال نکن
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return;
    }

    params.set(paramName, String(value).trim());
  });

  return fetch(`${API_URL}v1/question?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
};

const getBooks = async (pageNumber = 1, pageSize = 8) => {
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
  });

  return await fetch(`${API_URL}v1/book?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
};

const getCountQuestionsData = async () => {
  return await fetch(`${API_URL}v1/Dashboard/Summary`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
};

const deleteQuestion = async (id) => {
  return await fetch(`${API_URL}v1/question/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
};
const createQuestion = async (data) => {
  const payload = {
    lessonId: Number(data.lessonId),
    questionText: data.questionText,
    picture: data.picture ?? null,
    difficultyLevel: Number(data.difficultyLevel?.id ?? data.difficultyLevel),
    questionType: Number(data.questionType),
  };

  return fetch(`${API_URL}v1/question`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(payload),
  });
};

const createOptionalItem = (id, data) => {
  return fetch(`${API_URL}v1/question/${id}/optional-item`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const createTrueFalseItem = async (id, data) => {
  return fetch(`${API_URL}v1/question/${id}/true-false-items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const createFillInBlankItems = (questionId, data) => {
  return fetch(`${API_URL}v1/question/${questionId}/fill-in-blank-items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const createFillInBlankAnswers = (itemId, data) => {
  return fetch(
    `${API_URL}v1/fill-in-blank-items/${itemId}/fill-in-blank-answers`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
};

const createMatchingItems = async (questionId, data) => {
  return fetch(`${API_URL}v1/question/${questionId}/matching-items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export default {
  getQuestions,
  getBooks,
  createQuestion,
  createOptionalItem,
  deleteQuestion,
  getCountQuestionsData,
  createTrueFalseItem,
  createFillInBlankItems,
  createFillInBlankAnswers,
  createMatchingItems
};
