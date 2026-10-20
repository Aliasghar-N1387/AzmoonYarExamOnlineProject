import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  FileText,
  GraduationCap,
  Link2,
  ListChecks,
  MessageSquareText,
  Plus,
  Save,
  X,
} from "lucide-react";

import Modal from "../custom/Modal";
import DropDown from "../../components/custom/DropDown";
import questionCrud from "../../api/questionCrud";
import { useToast } from "../custom/Toast";
import { useAlert } from "../custom/AlertContext";

const questionTypes = [
  {
    id: 1,
    name: "تشریحی",
    color: "#34D399",
    icon: FileText,
    description: "پاسخ کامل و توضیحی",
  },
  {
    id: 2,
    name: "جای خالی",
    color: "#EC4899",
    icon: MessageSquareText,
    description: "تکمیل قسمت‌های خالی",
  },
  {
    id: 3,
    name: "وصل کردنی",
    color: "#38BDF8",
    icon: Link2,
    description: "اتصال موارد مرتبط",
  },
  {
    id: 4,
    name: "تستی",
    color: "#6D28D9",
    icon: ListChecks,
    description: "انتخاب پاسخ صحیح",
  },
  {
    id: 5,
    name: "کوتاه پاسخ",
    color: "#F59E0B",
    icon: MessageSquareText,
    description: "پاسخ کوتاه و مستقیم",
  },
  {
    id: 6,
    name: "صحیح/غلط",
    color: "#FBBF24",
    icon: CheckCircle2,
    description: "تشخیص درستی عبارت",
  },
];

const initialOptions = [
  { id: 1, text: "" },
  { id: 2, text: "" },
  { id: 3, text: "" },
  { id: 4, text: "" },
];

const initialPairs = [
  { id: 1, left: "", right: "" },
  { id: 2, left: "", right: "" },
  { id: 3, left: "", right: "" },
];

const statusQuestion = [
  { id: 1, name: "آسان" },
  { id: 2, name: "متوسط" },
  { id: 3, name: "سخت" },
];

const gradeItems = [
  { id: 1, name: "اول ابتدایی" },
  { id: 2, name: "دوم ابتدایی" },
  { id: 3, name: "سوم ابتدایی" },
  { id: 4, name: "چهارم ابتدایی" },
  { id: 5, name: "پنجم ابتدایی" },
  { id: 6, name: "ششم ابتدایی" },
  { id: 7, name: "هفتم" },
  { id: 8, name: "هشتم" },
  { id: 9, name: "نهم" },
  { id: 10, name: "دهم" },
  { id: 11, name: "یازدهم" },
  { id: 12, name: "دوازدهم" },
];

const inputClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white";

const textareaClass =
  "w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300";

function CreateQuestionModal({ onClose, onSave }) {
  const toast = useToast();
  const { alert } = useAlert();

  const [activeType, setActiveType] = useState(4);

  const [book, setBook] = useState("");
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);

  const [lesson, setLesson] = useState("");
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  const [grade, setGrade] = useState("");
  const [difficulty, setDifficulty] = useState({
    id: 2,
    name: "متوسط",
  });
  const [score, setScore] = useState("1");
  const createBlankQuestion = (id) => ({
    id,
    questionText: "",
    blanks: [{ id: 1, answers: [""] }],
  });

  const [blankQuestions, setBlankQuestions] = useState([
    createBlankQuestion(1),
  ]);

  const [activeBlankQuestionId, setActiveBlankQuestionId] = useState(1);

  const activeBlankQuestion = blankQuestions.find(
    (question) => question.id === activeBlankQuestionId,
  );

  const questionText = activeBlankQuestion?.questionText ?? "";
  const blankAnswers = activeBlankQuestion?.blanks ?? [];

  const [options, setOptions] = useState(initialOptions);
  const [correctOption, setCorrectOption] = useState(1);

  const [modelAnswer, setModelAnswer] = useState("");
  const [shortAnswer, setShortAnswer] = useState("");

  const [pairs, setPairs] = useState(initialPairs);
  const [trueFalseAnswer, setTrueFalseAnswer] = useState("true");

  const [error, setError] = useState("");

  const questionTextRef = useRef(null);
  const pendingCaretRef = useRef(null);

  const BLANK_MARKER = (id) => `⟦جای خالی ${id}⟧`;

  const addBlankInsideQuestion = () => {
    const nextId = Math.max(0, ...blankAnswers.map((blank) => blank.id)) + 1;
    const textarea = questionTextRef.current;
    const start = textarea?.selectionStart ?? questionText.length;
    const end = textarea?.selectionEnd ?? start;
    const marker = BLANK_MARKER(nextId);

    setBlankAnswers((prev) => [...prev, { id: nextId, answers: [""] }]);

    setQuestionText(
      questionText.slice(0, start) + marker + questionText.slice(end),
    );

    pendingCaretRef.current = start + marker.length;
    setError("");
  };

  const setQuestionText = (value) => {
    console.log("✏️ متن واردشده:", value);
    console.log("🆔 شناسه سؤال فعال:", activeBlankQuestionId);

    setBlankQuestions((prev) =>
      prev.map((question) =>
        question.id === activeBlankQuestionId
          ? { ...question, questionText: value }
          : question,
      ),
    );
  };

  const setBlankAnswers = (updater) => {
    setBlankQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== activeBlankQuestionId) return question;

        const nextBlanks =
          typeof updater === "function" ? updater(question.blanks) : updater;

        return { ...question, blanks: nextBlanks };
      }),
    );
  };
  // افزودن یک جای خالی جدید به سؤال
  const addBlankQuestion = () => {
    const nextId =
      Math.max(0, ...blankQuestions.map((question) => question.id)) + 1;

    setBlankQuestions((prev) => [...prev, createBlankQuestion(nextId)]);

    setActiveBlankQuestionId(nextId);
    setError("");
  };

  const updateBlank = (blankId, answerIndex, value) => {
    setBlankAnswers((prev) =>
      prev.map((blank) =>
        blank.id === blankId
          ? {
              ...blank,
              answers: blank.answers.map((answer, index) =>
                index === answerIndex ? value : answer,
              ),
            }
          : blank,
      ),
    );
  };

  const addBlankAnswer = (blankId) => {
    setBlankAnswers((prev) =>
      prev.map((blank) =>
        blank.id === blankId
          ? { ...blank, answers: [...blank.answers, ""] }
          : blank,
      ),
    );
  };

  const removeBlankAnswer = (blankId, answerIndex) => {
    setBlankAnswers((prev) =>
      prev.map((blank) =>
        blank.id === blankId
          ? {
              ...blank,
              answers: blank.answers.filter(
                (_, index) => index !== answerIndex,
              ),
            }
          : blank,
      ),
    );
  };

  const selectedType = questionTypes.find((type) => type.id === activeType);

  const updateOption = (id, text) => {
    setOptions((prev) =>
      prev.map((option) => (option.id === id ? { ...option, text } : option)),
    );
  };

  const updatePair = (id, field, value) => {
    setPairs((prev) =>
      prev.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair)),
    );
  };

  const handleSave = () => {
    if (!questionText.trim()) {
      setError("لطفاً متن سؤال را وارد کنید.");
      return;
    }

    if (activeType === 4) {
      if (options.some((option) => !option.text.trim())) {
        setError("لطفاً تمام گزینه‌های سؤال تستی را تکمیل کنید.");
        return;
      }
    }

    if (activeType === 2) {
      const hasInvalidQuestion = blankQuestions.some(
        (question) =>
          !question.questionText.trim() ||
          question.blanks.some(
            (blank) =>
              !question.questionText.includes(BLANK_MARKER(blank.id)) ||
              blank.answers.length === 0 ||
              blank.answers.some((answer) => !answer.trim()),
          ),
      );

      if (hasInvalidQuestion) {
        setError(
          "متن تمام سؤال‌ها، جای خالی‌ها و پاسخ‌های معتبر را تکمیل کنید.",
        );
        return;
      }
    }

    if (activeType === 3) {
      if (pairs.some((pair) => !pair.left.trim() || !pair.right.trim())) {
        setError("لطفاً تمام جفت‌های مرتبط را تکمیل کنید.");
        return;
      }
    }

    const question = {
      type: activeType,
      typeName: selectedType.name,
      book,
      lesson,
      grade,
      difficulty,
      score: Number(score),
      questionText: questionText.trim(),
      ...(activeType === 1 && { modelAnswer }),
      ...(activeType === 2 && { blankAnswers }),
      ...(activeType === 3 && { pairs }),
      ...(activeType === 4 && {
        options,
        correctOption,
      }),
      ...(activeType === 5 && { shortAnswer }),
      ...(activeType === 6 && { correctAnswer: trueFalseAnswer }),
    };

    onSave?.(question);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchBooks = async () => {
      try {
        setBooksLoading(true);

        const response = await questionCrud.getBooks(1, 100);

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();
        const bookData = result?.data;

        let allBooks = bookData?.items || [];

        const totalPages = bookData?.totalPages || 1;
        const actualPageSize = bookData?.pageSize || 100;

        if (totalPages > 1) {
          const requests = [];

          for (let page = 2; page <= totalPages; page++) {
            requests.push(questionCrud.getBooks(page, actualPageSize));
          }

          const responses = await Promise.all(requests);

          const results = await Promise.all(
            responses.map(async (res) => {
              if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status}`);
              }

              return res.json();
            }),
          );

          allBooks = [
            ...allBooks,
            ...results.flatMap((item) => item?.data?.items || []),
          ];
        }

        if (isMounted) {
          setBooks(
            allBooks.map((item) => ({
              id: item.id,
              name: item.bookName,
              lessons: item.lessons || [],
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching books:", error);

        if (isMounted) {
          setBooks([]);

          toast.error("دریافت کتاب‌ها با خطا مواجه شد", {
            title: "خطا در دریافت اطلاعات",
            duration: 5000,
          });
        }
      } finally {
        if (isMounted) {
          setBooksLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  const insertedBlankCount = blankAnswers.filter((blank) =>
    questionText.includes(BLANK_MARKER(blank.id)),
  ).length;

  const insertBlank = () => {
    const textarea = questionTextRef.current;
    if (!textarea || !activeBlankQuestion) return;

    const existingIds = blankAnswers
      .filter((blank) => questionText.includes(BLANK_MARKER(blank.id)))
      .map((blank) => blank.id);

    const nextBlank = blankAnswers.find(
      (blank) => !existingIds.includes(blank.id),
    );

    if (!nextBlank) {
      addBlankInsideQuestion();
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const marker = BLANK_MARKER(nextBlank.id);

    const nextText =
      questionText.slice(0, start) + marker + questionText.slice(end);

    pendingCaretRef.current = start + marker.length;
    setQuestionText(nextText);
    setError("");
  };

  useEffect(() => {}, [
    blankQuestions,
    activeBlankQuestionId,
    activeBlankQuestion,
  ]);

  useEffect(() => {
    if (pendingCaretRef.current === null) return;

    const textarea = questionTextRef.current;

    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(
        pendingCaretRef.current,
        pendingCaretRef.current,
      );
    }

    pendingCaretRef.current = null;
  }, [questionText]);

  const handleBookChange = (selectedBook) => {
    setBook(selectedBook);
    setLesson(null);

    if (!selectedBook) {
      setLessons([]);
      return;
    }

    const selectedBookData = books.find((item) => item.id === selectedBook.id);

    const bookLessons = selectedBookData?.lessons || [];

    setLessons(
      bookLessons.map((item) => ({
        id: item.id,
        name: item.lessonName,
      })),
    );
  };

  const handleCreateEssayQuestion = async () => {
    if (!questionText.trim()) {
      setError("لطفاً متن سؤال را وارد کنید.");
      return;
    }

    if (!lesson?.id) {
      setError("لطفاً ابتدا درس را انتخاب کنید.");
      return;
    }

    try {
      setError("");

      const payload = {
        lessonId: Number(lesson.id),
        questionText: questionText.trim(),
        difficultyLevel: Number(difficulty?.id ?? difficulty),
        questionType: 1,
      };

      const response = await questionCrud.createQuestion(payload);
      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === false) {
        const validationErrors = result?.error?.errors;

        const message = validationErrors
          ? Object.values(validationErrors).flat().join(" ")
          : result?.error?.title || `خطا در ثبت سؤال (${response.status})`;

        throw new Error(message);
      }

      toast.success("سؤال تشریحی با موفقیت ثبت شد");

      onSave?.(payload);
      onClose?.();
    } catch (err) {
      console.error("Error creating essay question:", err);
      setError(err.message || "ثبت سؤال با خطا مواجه شد.");
    }
  };

  const handleCreateTestQuestion = async () => {
    if (!questionText.trim()) {
      setError("لطفاً متن سؤال را وارد کنید.");
      return;
    }

    if (!lesson?.id) {
      setError("لطفاً ابتدا درس را انتخاب کنید.");
      return;
    }

    if (options.some((option) => !option.text.trim())) {
      setError("لطفاً تمام گزینه‌های سؤال تستی را تکمیل کنید.");
      return;
    }

    try {
      setError("");

      // درخواست اول: ایجاد سؤال
      const questionPayload = {
        lessonId: Number(lesson.id),
        questionText: questionText.trim(),
        difficultyLevel: Number(difficulty?.id ?? difficulty),
        questionType: 4,
      };

      const questionResponse =
        await questionCrud.createQuestion(questionPayload);

      const questionResult = await questionResponse.json();

      if (!questionResponse.ok || questionResult?.success === false) {
        throw new Error(
          questionResult?.error?.title || "ایجاد سؤال ناموفق بود.",
        );
      }

      // شناسه سؤال ایجادشده
      const questionId = questionResult?.data?.id;

      if (!questionId) {
        throw new Error("شناسه سؤال در پاسخ سرور پیدا نشد.");
      }

      // درخواست دوم: ثبت گزینه‌های سؤال
      const optionalItemPayload = {
        option1: options[0].text.trim(),
        option2: options[1].text.trim(),
        option3: options[2].text.trim(),
        option4: options[3].text.trim(),
        correctOption: Number(correctOption),
      };

      const optionalItemResponse = await questionCrud.createOptionalItem(
        questionId,
        optionalItemPayload,
      );

      const optionalItemResult = await optionalItemResponse
        .json()
        .catch(() => null);

      if (!optionalItemResponse.ok || optionalItemResult?.success === false) {
        throw new Error(
          optionalItemResult?.error?.title || "ثبت گزینه‌های سؤال ناموفق بود.",
        );
      }

      toast.success("سؤال تستی و گزینه‌های آن با موفقیت ثبت شدند");

      onSave?.({
        ...questionPayload,
        id: questionId,
        ...optionalItemPayload,
      });

      onClose?.();
    } catch (err) {
      console.error("Error creating test question:", err);
      setError(err.message || "ثبت سؤال با خطا مواجه شد.");
    }
  };

  const handleCreateShortAnswerQuestion = async () => {
    if (!questionText.trim()) {
      setError("لطفاً متن سؤال را وارد کنید.");
      return;
    }

    if (!lesson?.id) {
      setError("لطفاً ابتدا درس را انتخاب کنید.");
      return;
    }

    try {
      setError("");

      const payload = {
        lessonId: Number(lesson.id),
        questionText: questionText.trim(),
        difficultyLevel: Number(difficulty?.id ?? difficulty),
        questionType: 5,
      };

      const response = await questionCrud.createQuestion(payload);
      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.error?.title || `خطا در ثبت سؤال (${response.status})`,
        );
      }

      toast.success("سؤال کوتاه‌پاسخ با موفقیت ثبت شد");

      onSave?.({
        ...payload,
        id: result?.data?.id,
        shortAnswer: shortAnswer.trim(),
      });

      onClose?.();
    } catch (err) {
      console.error("Error creating short-answer question:", err);
      setError(err.message || "ثبت سؤال کوتاه‌پاسخ با خطا مواجه شد.");
    }
  };

  const handleCreateTrueFalseQuestion = async () => {
    if (!questionText.trim()) {
      setError("لطفاً متن سؤال را وارد کنید.");
      return;
    }

    if (!lesson?.id) {
      setError("لطفاً ابتدا درس را انتخاب کنید.");
      return;
    }

    try {
      setError("");
      // مرحله اول: ایجاد سؤال اصلی
      const questionPayload = {
        lessonId: Number(lesson.id),
        questionText: questionText.trim(),
        difficultyLevel: Number(difficulty?.id ?? difficulty),
        questionType: 6,
      };

      const questionResponse =
        await questionCrud.createQuestion(questionPayload);

      const questionResult = await questionResponse.json().catch(() => null);

      if (!questionResponse.ok || questionResult?.success === false) {
        throw new Error(
          questionResult?.error?.title || "ایجاد سؤال صحیح/غلط ناموفق بود.",
        );
      }

      const questionId = questionResult?.data?.id;

      if (!questionId) {
        throw new Error("شناسه سؤال در پاسخ سرور پیدا نشد.");
      }

      // مرحله دوم: ثبت پاسخ صحیح/غلط با شناسه سؤال
      const answerPayload = [
        {
          itemText: questionText.trim(),
          isCorrect: trueFalseAnswer === "true",
        },
      ];

      const answerResponse = await questionCrud.createTrueFalseItem(
        questionId,
        answerPayload,
      );

      const answerResult = await answerResponse.json().catch(() => null);

      if (!answerResponse.ok || answerResult?.success === false) {
        throw new Error(
          answerResult?.error?.title || "ثبت پاسخ صحیح/غلط ناموفق بود.",
        );
      }

      toast.success("سؤال صحیح/غلط با موفقیت ثبت شد");

      onSave?.({
        ...questionPayload,
        id: questionId,
      });

      onClose?.();
    } catch (err) {
      console.error("Error creating true/false question:", err);
      setError(err.message || "ثبت سؤال صحیح/غلط با خطا مواجه شد.");
    }
  };

  const handleCreateFillInBlankQuestion = async () => {
    try {
      setError("");

      if (!lesson?.id) {
        throw new Error("لطفاً ابتدا درس را انتخاب کنید.");
      }

      if (!blankQuestions.length) {
        throw new Error("حداقل یک سؤال جای‌خالی اضافه کنید.");
      }

      // اعتبارسنجی سؤال‌ها و پاسخ‌ها
      for (let i = 0; i < blankQuestions.length; i++) {
        const question = blankQuestions[i];

        if (!question.questionText?.trim()) {
          throw new Error(`متن سؤال شماره ${i + 1} را وارد کنید.`);
        }

        const markers = (question.blanks || []).filter((blank) =>
          question.questionText.includes(BLANK_MARKER(blank.id)),
        );

        if (markers.length === 0) {
          throw new Error(
            `در متن سؤال شماره ${i + 1} حداقل یک جای خالی درج کنید.`,
          );
        }

        for (const blank of markers) {
          const validAnswers = (blank.answers || []).filter((answer) =>
            answer?.trim(),
          );

          if (!validAnswers.length) {
            throw new Error(
              `برای جای خالی ${blank.id} در سؤال شماره ${i + 1} پاسخ وارد کنید.`,
            );
          }
        }
      }

      // مرحله اول: ایجاد سؤال اصلی
      const questionPayload = {
        lessonId: Number(lesson.id),
        questionText: "جاخالی‌های زیر را پر کنید",
        difficultyLevel: Number(difficulty?.id ?? difficulty),
        questionType: 2,
      };

      const questionResponse =
        await questionCrud.createQuestion(questionPayload);

      const questionResult = await questionResponse.json().catch(() => null);

      if (!questionResponse.ok || questionResult?.success === false) {
        const errors = questionResult?.error?.errors;

        throw new Error(
          errors
            ? Object.values(errors).flat().join(" ")
            : questionResult?.error?.title || "ایجاد سؤال اصلی ناموفق بود.",
        );
      }

      const questionId =
        questionResult?.data?.id ??
        questionResult?.data?.questionId ??
        questionResult?.id ??
        questionResult?.questionId;

      if (!questionId) {
        console.error("پاسخ ایجاد سؤال اصلی:", questionResult);
        throw new Error("شناسه سؤال اصلی از سرور دریافت نشد.");
      }

      // مرحله دوم: ایجاد آیتم‌های سؤال
      const itemsPayload = blankQuestions.map((question) => ({
        itemText: question.questionText.trim(),
      }));

      const itemsResponse = await questionCrud.createFillInBlankItems(
        questionId,
        itemsPayload,
      );

      const itemsResult = await itemsResponse.json().catch(() => null);
      console.log("Items API:", itemsResult);
      if (!itemsResponse.ok || itemsResult?.success === false) {
        console.error("پاسخ ایجاد آیتم‌های جای‌خالی:", itemsResult);

        throw new Error(
          itemsResult?.error?.title ||
            itemsResult?.message ||
            "ایجاد آیتم‌های جای‌خالی ناموفق بود.",
        );
      }

      const createdItems =
        itemsResult?.data?.items ??
        itemsResult?.data?.data?.items ??
        itemsResult?.data?.data ??
        itemsResult?.data;

      if (
        !Array.isArray(createdItems) ||
        createdItems.length !== blankQuestions.length
      ) {
        console.error("پاسخ API آیتم‌های جای‌خالی:", itemsResult);

        throw new Error(
          "ساختار یا تعداد آیتم‌های برگشتی از سرور با درخواست مطابقت ندارد.",
        );
      }

      // مرحله سوم: ثبت پاسخ‌های هر آیتم
      for (let i = 0; i < createdItems.length; i++) {
        const item = createdItems[i];
        const itemId = item?.id ?? item?.itemId;

        console.log("Created item:", item);
        console.log("Extracted itemId:", itemId);

        if (itemId == null || itemId === 0) {
          throw new Error(
            `شناسه معتبر برای آیتم شماره ${i + 1} دریافت نشد. مقدار دریافتی: ${itemId}`,
          );
        }
        const answers = [
          ...new Set(
            (blankQuestions[i].blanks || [])
              .filter((blank) =>
                blankQuestions[i].questionText.includes(BLANK_MARKER(blank.id)),
              )
              .flatMap((blank) => blank.answers || [])
              .map((answer) => answer?.trim())
              .filter(Boolean),
          ),
        ];

        if (!answers.length) {
          throw new Error(`پاسخی برای آیتم شماره ${i + 1} وجود ندارد.`);
        }

        const answersPayload = answers.map((answer) => ({ answer }));

        const answersResponse = await questionCrud.createFillInBlankAnswers(
          itemId,
          answersPayload,
        );

        const answersResult = await answersResponse.json().catch(() => null);

        if (!answersResponse.ok || answersResult?.success === false) {
          console.error(`پاسخ API ثبت جواب‌های آیتم ${i + 1}:`, answersResult);

          throw new Error(
            answersResult?.error?.title ||
              answersResult?.message ||
              `ثبت پاسخ‌های آیتم شماره ${i + 1} ناموفق بود.`,
          );
        }
      }

      toast.success("سؤال‌های جای‌خالی و پاسخ‌هایشان ثبت شدند.");

      onSave?.({
        ...questionPayload,
        id: questionId,
      });

      onClose?.();
    } catch (err) {
      console.error("Create fill-in-blank question error:", err);
      setError(err?.message || "هنگام ثبت سؤال خطایی رخ داد.");
      alert(err?.message || "هنگام ثبت سؤال خطایی رخ داد.");
    }
  };

  const handleCreateMatchingQuestion = async () => {
    if (!questionText.trim()) {
      setError("لطفاً متن سؤال را وارد کنید.");
      return;
    }

    if (!lesson?.id) {
      setError("لطفاً ابتدا درس را انتخاب کنید.");
      return;
    }

    if (
      pairs.length < 2 ||
      pairs.some((pair) => !pair.left.trim() || !pair.right.trim())
    ) {
      setError("لطفاً حداقل دو جفت مرتبط را کامل کنید.");
      return;
    }

    try {
      setError("");

      // درخواست اول: ایجاد سؤال اصلی
      const questionPayload = {
        lessonId: Number(lesson.id),
        questionText: questionText.trim(),
        difficultyLevel: Number(difficulty?.id ?? difficulty),
        questionType: 3,
      };

      const questionResponse =
        await questionCrud.createQuestion(questionPayload);

      const questionResult = await questionResponse.json().catch(() => null);

      if (!questionResponse.ok || questionResult?.success === false) {
        throw new Error(
          questionResult?.error?.title || "ایجاد سؤال وصل‌کردنی ناموفق بود.",
        );
      }

      const questionId =
        questionResult?.data?.id ??
        questionResult?.data?.questionId ??
        questionResult?.id ??
        questionResult?.questionId;

      if (!questionId) {
        throw new Error("شناسه سؤال از پاسخ سرور دریافت نشد.");
      }

      const matchingItemsPayload = pairs.map((pair) => ({
        leftItemText: pair.left.trim(),
        rightItemText: pair.right.trim(),
      }));

      const itemsResponse = await questionCrud.createMatchingItems(
        questionId,
        matchingItemsPayload,
      );

      const itemsResult = await itemsResponse.json().catch(() => null);

      if (!itemsResponse.ok || itemsResult?.success === false) {
        throw new Error(
          itemsResult?.error?.title ||
            itemsResult?.message ||
            "ثبت آیتم‌های وصل‌کردنی ناموفق بود.",
        );
      }

      toast.success("سؤال وصل‌کردنی با موفقیت ثبت شدند");

      onSave?.({
        ...questionPayload,
        id: questionId,
        pairs,
      });

      onClose?.();
    } catch (err) {
      console.error("Create matching question error:", err);

      setError(err.message || "ثبت سؤال وصل‌کردنی با خطا مواجه شد.");
    }
  };

  const handleRemovePair = (index) => {
    setPairs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal
      onClose={onClose}
      header={
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400">
            <Plus size={25} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              ساخت سؤال جدید
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              نوع سؤال را انتخاب و اطلاعات آن را تکمیل کنید.
            </p>
          </div>
        </div>
      }
      content={
        <div dir="rtl" className="space-y-7 p-5 sm:p-7">
          {/* تب‌های نوع سؤال */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white">
                نوع سؤال
              </h3>

              <span className="text-xs text-slate-400">
                {questionTypes.length} نوع سؤال
              </span>
            </div>

            <div
              role="tablist"
              aria-label="انتخاب نوع سؤال"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            >
              {questionTypes.map((type) => {
                const Icon = type.icon;
                const isActive = activeType === type.id;
                return (
                  <button
                    key={type.id}
                    id={`question-tab-${type.id}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="question-tab-panel"
                    onClick={() => {
                      setActiveType(type.id);
                      setError("");
                    }}
                    className={`group relative flex min-h-28 flex-col items-start overflow-hidden rounded-2xl border p-4 text-right transition-all duration-200 hover:-translate-y-0.5 ${
                      isActive
                        ? "border bg-violet-50/70 shadow-sm dark:bg-slate-800"
                        : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                    }`}
                    style={{
                      borderColor: isActive ? type.color : undefined,
                    }}
                  >
                    <span
                      className="mb-3 flex size-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${type.color}20`,
                        color: type.color,
                      }}
                    >
                      <Icon size={21} />
                    </span>

                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                      {type.name}
                    </span>

                    <span className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {type.description}
                    </span>

                    {isActive && (
                      <span
                        className="absolute left-3 top-3 flex size-5 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: type.color }}
                      >
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* اطلاعات  */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen
                size={19}
                className="text-violet-600 dark:text-violet-400"
              />
              <h3 className="font-bold text-slate-800 dark:text-white">
                اطلاعات آموزشی
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* انتخاب کتاب */}
              <div>
                <label className={labelClass} htmlFor="question-book">
                  کتاب
                </label>

                <DropDown
                  id="question-book"
                  value={book}
                  items={books}
                  placeholder={
                    booksLoading
                      ? "در حال دریافت کتاب‌ها..."
                      : "کتاب را انتخاب کنید"
                  }
                  onChange={handleBookChange}
                  disabled={booksLoading}
                />
              </div>

              {/* انتخاب درس */}
              <div>
                <label className={labelClass} htmlFor="question-lesson">
                  درس
                </label>

                <DropDown
                  id="question-lesson"
                  value={lesson}
                  items={lessons}
                  placeholder={
                    !book
                      ? "ابتدا کتاب را انتخاب کنید"
                      : lessons.length === 0
                        ? "درسی برای این کتاب وجود ندارد"
                        : "درس را انتخاب کنید"
                  }
                  onChange={(selectedLesson) => setLesson(selectedLesson)}
                  disabled={!book || lessonsLoading || lessons.length === 0}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="question-grade">
                  پایه تحصیلی
                </label>

                <DropDown
                  id="question-grade"
                  value={grade}
                  items={gradeItems}
                  placeholder="پایه تحصیلی را انتخاب کنید"
                  onChange={(selectedGrade) => setGrade(selectedGrade)}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="question-difficulty">
                  وضعیت
                </label>

                <DropDown
                  id="question-difficulty"
                  value={difficulty}
                  items={statusQuestion}
                  placeholder="سطح سؤال را انتخاب کنید"
                  onChange={(selectedDifficulty) =>
                    setDifficulty(selectedDifficulty)
                  }
                />
              </div>
            </div>
          </section>

          <section
            key={activeType}
            id="question-tab-panel"
            role="tabpanel"
            aria-labelledby={`question-tab-${activeType}`}
            className="space-y-5 border-t border-slate-100 pt-6 dark:border-slate-800"
          >
            <div className="flex items-center gap-3">
              <span
                className="flex size-10 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${selectedType.color}20`,
                  color: selectedType.color,
                }}
              >
                {(() => {
                  const Icon = selectedType.icon;
                  return <Icon size={21} />;
                })()}
              </span>

              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">
                  سؤال {selectedType.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  اطلاعات اختصاصی این نوع سؤال را وارد کنید.
                </p>
              </div>
            </div>
            {/* کادر متن سؤال برای تمام انواع به‌جز جای خالی */}
            {activeType !== 2 && (
              <div className="space-y-2">
                <label htmlFor="regular-question-text" className={labelClass}>
                  متن سؤال
                </label>

                <textarea
                  id="regular-question-text"
                  value={questionText}
                  onChange={(e) => {
                    setQuestionText(e.target.value);
                    setError("");
                  }}
                  placeholder={`متن سؤال ${selectedType.name} را وارد کنید...`}
                  rows={4}
                  className={textareaClass}
                />
              </div>
            )}

            {activeType === 2 && (
              <div>
                <div className="space-y-3">
                  <label className={labelClass}>
                    متن سؤال جای خالی{" "}
                    {blankQuestions.findIndex(
                      (question) => question.id === activeBlankQuestionId,
                    ) + 1}
                  </label>

                  <textarea
                    ref={questionTextRef}
                    value={questionText}
                    onChange={(e) => {
                      setQuestionText(e.target.value);
                      setError("");
                    }}
                    placeholder="متن سؤال را وارد کنید..."
                    rows={5}
                    className={textareaClass}
                  />

                  <button
                    type="button"
                    onClick={insertBlank}
                    className="flex items-center gap-2 rounded-xl border border-dashed border-pink-300 px-4 py-3 text-sm font-bold text-pink-700 hover:bg-pink-50"
                  >
                    <Plus size={17} />
                    درج جای خالی در متن سؤال
                  </button>

                  <button
                    type="button"
                    onClick={addBlankQuestion}
                    className="flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-3 text-sm font-bold text-white hover:bg-pink-700"
                  >
                    <Plus size={17} />
                    افزودن سؤال جای خالی جدید
                  </button>
                </div>
              </div>
            )}
            {/* جای خالی */}
            {activeType === 2 && (
              <div
                className="space-y-4 rounded-2xl border
    border-pink-100 bg-white p-4 sm:p-5
    dark:border-pink-500/20 dark:bg-slate-900"
              >
                <div
                  className="flex flex-wrap items-center
      justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-11 items-center
          justify-center rounded-xl bg-pink-100
          text-pink-600 dark:bg-pink-500/15
          dark:text-pink-300"
                    >
                      <MessageSquareText size={21} />
                    </div>

                    <div>
                      <h4
                        className="font-bold text-slate-800
            dark:text-white"
                      >
                        پاسخ‌های قابل قبول
                      </h4>

                      <p
                        className="mt-1 text-xs text-slate-500
            dark:text-slate-400"
                      >
                        برای یک جای خالی چند پاسخ تعریف کنید.
                      </p>
                    </div>
                  </div>

                  <span
                    className="rounded-full bg-pink-100
        px-3 py-1.5 text-xs font-bold text-pink-700
        dark:bg-pink-500/15 dark:text-pink-300"
                  >
                    {blankAnswers.length} پاسخ
                  </span>
                </div>

                {activeType === 2 && insertedBlankCount === 0 && (
                  <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-800">
                    ابتدا در متن سؤال روی دکمه «درج جای خالی» بزنید.
                  </div>
                )}

                <div className="space-y-5">
                  {blankAnswers.map((blank) => {
                    const marker = BLANK_MARKER(blank.id);
                    const inserted = questionText.includes(marker);

                    return (
                      <div
                        key={blank.id}
                        className="space-y-4 rounded-2xl border
          border-pink-200 bg-white p-4 dark:bg-slate-900"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-white">
                              جای خالی {blank.id}
                            </h4>
                            <p className="mt-1 text-xs text-slate-500">
                              نشانه متن: {marker}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              inserted
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {inserted ? "درج شده" : "در انتظار درج"}
                          </span>
                        </div>

                        {blank.answers.map((answer, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span
                              className="flex size-9 shrink-0 items-center
              justify-center rounded-lg bg-pink-100
              text-sm font-bold text-pink-700"
                            >
                              {index + 1}
                            </span>

                            <input
                              value={answer}
                              onChange={(e) =>
                                updateBlank(blank.id, index, e.target.value)
                              }
                              placeholder={
                                index === 0 ? "پاسخ اصلی" : "پاسخ جایگزین"
                              }
                              className={inputClass}
                            />

                            {blank.answers.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeBlankAnswer(blank.id, index)
                                }
                                aria-label="حذف پاسخ"
                                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                              >
                                <X size={17} />
                              </button>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addBlankAnswer(blank.id)}
                          className="flex w-full items-center justify-center
            gap-2 rounded-xl border border-dashed
            border-pink-300 px-4 py-3 text-sm font-bold
            text-pink-700 hover:bg-pink-50"
                        >
                          <Plus size={17} />
                          افزودن پاسخ جایگزین برای جای خالی {blank.id}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <p
                  className="text-xs leading-6 text-slate-500
      dark:text-slate-400"
                >
                  همه پاسخ‌ها مربوط به همان یک جای خالی هستند. فعلاً امکان درج
                  جای خالی دوم وجود ندارد.
                </p>
              </div>
            )}
            {/* وصل کردنی */}
            {activeType === 3 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>ستون اول</span>
                  <span>ستون دوم (پاسخ مرتبط)</span>
                </div>

                {pairs.map((pair, index) => (
                  <div key={index} className="flex items-center gap-3 mb-4">
                    <input
                      value={pair.left}
                      onChange={(e) =>
                        handlePairChange(index, "left", e.target.value)
                      }
                      placeholder="متن ستون چپ"
                      className="border rounded p-2 flex-1"
                    />

                    <input
                      value={pair.right}
                      onChange={(e) =>
                        handlePairChange(index, "right", e.target.value)
                      }
                      placeholder="متن ستون راست"
                      className="border rounded p-2 flex-1"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemovePair(index)}
                      disabled={pairs.length <= 2}
                      className="bg-red-500 text-white px-3 py-2 rounded disabled:opacity-40"
                    >
                      حذف
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setPairs((prev) => [
                      ...prev,
                      {
                        id: Math.max(0, ...prev.map((p) => p.id)) + 1,
                        left: "",
                        right: "",
                      },
                    ])
                  }
                  className="flex items-center gap-2 rounded-xl border border-dashed border-sky-300 px-4 py-3 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 dark:border-sky-500/30 dark:hover:bg-sky-500/10"
                >
                  <Plus size={16} />
                  افزودن جفت جدید
                </button>
              </div>
            )}
            {/* تستی */}
            {activeType === 4 && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className={labelClass}>گزینه‌های پاسخ</label>

                  <span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                    یک پاسخ صحیح انتخاب کنید
                  </span>
                </div>

                <div className="space-y-3">
                  {options.map((option, index) => {
                    const isCorrect = correctOption === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setCorrectOption(option.id)}
                        aria-pressed={isCorrect}
                        className={`group flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-right transition-all duration-200 sm:p-4 ${
                          isCorrect
                            ? "border-emerald-500 bg-emerald-50/80 shadow-sm dark:border-emerald-400 dark:bg-emerald-500/10"
                            : "border-red-300 bg-red-50/80 dark:border-red-500/50 dark:bg-red-500/10"
                        }`}
                      >
                        {/* نشانگر گزینه */}
                        <span
                          className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition ${
                            isCorrect
                              ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-900"
                              : "border-red-500 bg-red-500 text-white dark:border-red-400 dark:bg-red-500"
                          }`}
                        >
                          {isCorrect ? (
                            <Check size={18} strokeWidth={3} />
                          ) : (
                            <X size={18} strokeWidth={3} />
                          )}
                        </span>

                        {/* متن گزینه */}
                        <span className="min-w-0 flex-1">
                          <span
                            className={`mb-1 block text-xs font-semibold ${
                              isCorrect
                                ? "text-emerald-700 dark:text-emerald-300"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            گزینه {index + 1}
                          </span>

                          <input
                            value={option.text}
                            onChange={(e) =>
                              updateOption(option.id, e.target.value)
                            }
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            placeholder={`متن گزینه ${index + 1} را وارد کنید`}
                            aria-label={`متن گزینه ${index + 1}`}
                            className={`w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400 ${
                              isCorrect
                                ? "text-emerald-900 dark:text-emerald-100"
                                : "text-red-800 dark:text-red-200"
                            }`}
                          />
                        </span>

                        {/* وضعیت پاسخ */}
                        <span
                          className={`flex shrink-0 items-center gap-1 rounded-lg px-2 py-2 text-xs font-bold sm:px-3 ${
                            isCorrect
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                              : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 size={16} />
                              <span className="hidden sm:inline">
                                پاسخ صحیح
                              </span>
                              <span className="sm:hidden">صحیح</span>
                            </>
                          ) : (
                            <>
                              <X size={16} />
                              <span className="hidden sm:inline">
                                پاسخ اشتباه
                              </span>
                              <span className="sm:hidden">اشتباه</span>
                            </>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-start gap-2 rounded-xl border border-sky-100 bg-sky-50 p-3 text-xs leading-6 text-sky-800 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200">
                  <CheckCircle2 size={17} className="mt-1 shrink-0" />
                  <p>
                    روی هر گزینه کلیک کنید تا پاسخ صحیح شود. در هر سؤال فقط یک
                    گزینه می‌تواند پاسخ صحیح باشد.
                  </p>
                </div>
              </div>
            )}
            {/* صحیح / غلط */}
            {activeType === 6 && (
              <div>
                <label className={labelClass}>پاسخ صحیح عبارت</label>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: "true",
                      title: "صحیح",
                      color: "#059669",
                    },
                    {
                      value: "false",
                      title: "غلط",
                      color: "#DC2626",
                    },
                  ].map((answer) => {
                    const active = trueFalseAnswer === answer.value;

                    return (
                      <button
                        key={answer.value}
                        type="button"
                        onClick={() => setTrueFalseAnswer(answer.value)}
                        className={`flex h-14 items-center justify-center gap-2 rounded-xl border text-sm font-bold transition ${
                          active
                            ? "border-current bg-slate-50 dark:bg-slate-800"
                            : "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400"
                        }`}
                        style={{
                          color: active ? answer.color : undefined,
                          borderColor: active ? answer.color : undefined,
                        }}
                      >
                        {active && <Check size={17} />}
                        {answer.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* امتیاز */}
          <section className="flex flex-col gap-3 rounded-2xl border border-violet-100 bg-violet-50/60 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-violet-500/20 dark:bg-violet-500/5">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                امتیاز سؤال
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                نمره در نظر گرفته‌شده برای این سؤال
              </p>
            </div>

            <input
              aria-label="امتیاز سؤال"
              type="number"
              min="0"
              max="100"
              step="0.25"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className={`${inputClass} sm:w-32`}
            />
          </section>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
            >
              {error}
            </p>
          )}
        </div>
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="hidden text-xs text-slate-400 sm:block">
            نوع انتخاب‌شده: {selectedType.name}
          </p>

          <div className="mr-auto flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              انصراف
            </button>

            <button
              type="button"
              onClick={() => {
                if (activeType === 1) {
                  handleCreateEssayQuestion();
                } else if (activeType === 2) {
                  handleCreateFillInBlankQuestion();
                } else if (activeType === 3) {
                  handleCreateMatchingQuestion();
                } else if (activeType === 4) {
                  handleCreateTestQuestion();
                } else if (activeType === 5) {
                  handleCreateShortAnswerQuestion();
                } else if (activeType === 6) {
                  handleCreateTrueFalseQuestion();
                } else {
                  handleSave();
                }
              }}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-800 px-6 text-sm font-bold text-white"
            >
              <Save size={17} />
              ثبت سؤال
            </button>
          </div>
        </div>
      }
    />
  );
}

export default CreateQuestionModal;
