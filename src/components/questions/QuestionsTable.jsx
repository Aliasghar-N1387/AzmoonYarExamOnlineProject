import { MoreVertical, FileText, Pencil, Trash2, Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../custom/Toast";
import { useAlert } from "../custom/AlertContext";
import questionCrud from "../../api/questionCrud";

const QuestionTable = ({ questions = [], onDelete, loading = false }) => {
  const toast = useToast();
  const { alert } = useAlert();

  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const menuRef = useRef(null);

  const difficultyStyles = {
    green: {
      dot: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    orange: {
      dot: "bg-orange-500",
      text: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950/30",
    },
    red: {
      dot: "bg-red-500",
      text: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/30",
    },
  };

  const typeStyles = {
    "تستی + تشریحی":
      "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
    چهارگزینه‌ای:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    تستی: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300",
    تشریحی:
      "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
    "کوتاه پاسخ":
      "bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300",
    "جای خالی":
      "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300",
    "صحیح / غلط":
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
    "وصل کردنی":
      "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
  };

  const statusStyles = {
    تکمیل‌شده: {
      dot: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    "در حال تکمیل": {
      dot: "bg-orange-500",
      text: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950/30",
    },
    نامشخص: {
      dot: "bg-slate-400",
      text: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-100 dark:bg-slate-800",
    },
  };

  const typeNames = {
    1: "تشریحی",
    2: "جای خالی",
    3: "وصل کردنی",
    4: "تستی",
    5: "کوتاه پاسخ",
    6: "صحیح / غلط",
  };

  const getQuestionTitle = (question) =>
    question.title ?? question.questionText ?? "بدون عنوان";

  const getQuestionType = (question) =>
    question.typeName ??
    typeNames[question.questionType ?? question.type] ??
    "نامشخص";

  const getLessonName = (question) => {
    const lesson =
      typeof question.lesson === "object" && question.lesson !== null
        ? question.lesson.name
        : question.lesson;

    const book =
      typeof question.book === "object" && question.book !== null
        ? question.book.name
        : question.book;

    return (
      [book, lesson].filter(Boolean).join(" / ") ||
      (question.lessonId ? `${question.lessonId}` : "—")
    );
  };

  const getDifficulty = (question) => {
    const value = question.difficultyLevel ?? question.difficulty;

    if (value === 1 || value === "1") {
      return { name: "آسان", color: "green" };
    }

    if (value === 2 || value === "2") {
      return { name: "متوسط", color: "orange" };
    }

    if (value === 3 || value === "3") {
      return { name: "سخت", color: "red" };
    }

    const names = {
      easy: { name: "آسان", color: "green" },
      medium: { name: "متوسط", color: "orange" },
      hard: { name: "سخت", color: "red" },
      آسان: { name: "آسان", color: "green" },
      متوسط: { name: "متوسط", color: "orange" },
      سخت: { name: "سخت", color: "red" },
    };

    return names[value] ?? { name: "نامشخص", color: "orange" };
  };

  const getQuestionStatus = (question) => {
    const value = question.questionStatus ?? question.status;

    if (value === 1 || value === "1") return "تکمیل‌شده";
    if (value === 2 || value === "2") return "در حال تکمیل";

    return "نامشخص";
  };

  const formatQuestionDate = (question) => {
    const value = question.createdAt ?? question.date;

    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Tehran",
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
        setMenuPosition(null);
      }
    };

    const handleScroll = () => {
      setOpenMenu(null);
      setMenuPosition(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const handleMenuToggle = (event, questionId) => {
    if (openMenu === questionId) {
      setOpenMenu(null);
      setMenuPosition(null);
      return;
    }

    const buttonRect = event.currentTarget.getBoundingClientRect();

    setMenuPosition({
      top: buttonRect.bottom + 8,
      right: window.innerWidth - buttonRect.right - 120,
    });

    setOpenMenu(questionId);
  };

  const handleAction = (action, question) => {
    setOpenMenu(null);
    setMenuPosition(null);

    if (!question) return;

    if (action === "view") {
      console.log("مشاهده:", question);
      return;
    }

    if (action === "edit") {
      console.log("ویرایش:", question);
      return;
    }

    if (action === "delete") {
      alert({
        type: "confirm",
        title: "حذف سؤال",
        message: "آیا مطمئن هستید که می‌خواهید این سؤال را حذف کنید؟",
        confirmText: "بله، حذف کن",
        cancelText: "انصراف",
        showCancel: true,
        onConfirm: async () => {
          try {
            const response = await questionCrud.deleteQuestion(question.id);

            const result = await response.json().catch(() => null);

            if (!response.ok || result?.success === false) {
              throw new Error(
                result?.error?.message ||
                  result?.error?.detail ||
                  result?.error?.title ||
                  `خطا در حذف سؤال (${response.status})`,
              );
            }

            // اطلاع به کامپوننت والد برای حذف از لیست
            onDelete?.(question.id);

            toast.success("سؤال با موفقیت حذف شد", {
              title: "عملیات موفق",
            });
          } catch (error) {
            console.error("Error deleting question:", error);

            toast.error(error.message || "حذف سؤال با خطا مواجه شد", {
              title: "خطا در حذف سؤال",
              duration: 5000,
            });
          }
        },
      });
    }
  };

  return (
    <div
      dir="rtl"
      className="w-full h-90 overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20"
    >
      <div className="flex items-center justify-between border-b border-violet-100 bg-violet-50/60 px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            لیست سوالات
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            مدیریت، مشاهده و ویرایش سوالات
          </p>
        </div>

        <div className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-violet-600 shadow-sm ring-1 ring-violet-100 dark:bg-slate-800 dark:text-violet-400 dark:ring-slate-700">
          {questions.length.toLocaleString("fa-IR")} سوال
        </div>
      </div>

      <div className="w-full max-h-90 overflow-x-auto overflow-y-auto question-scroll">
        <table className="w-full min-w-200 border-collapse text-sm">
          <thead className="sticky top-0 z-20 bg-violet-50 backdrop-blur-md dark:bg-slate-800/95">
            <tr className="h-12 border-b border-violet-100 text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <th className="w-[32%] px-5 text-right text-xs font-bold">
                عنوان سوال
              </th>
              <th className="w-[12%] text-center text-xs font-bold">وضعیت</th>
              <th className="w-[15%] text-center text-xs font-bold">کد کتاب</th>
              <th className="w-[12%] text-center text-xs font-bold">سختی</th>
              <th className="w-[12%] text-center text-xs font-bold">
                تاریخ ایجاد
              </th>
              <th className="w-[8%] text-center text-xs font-bold">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr>
                <td colSpan={5} className="pt-25 py-22 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-950/40">
                      <FileText
                        size={28}
                        className="text-violet-600 dark:text-violet-400"
                      />
                    </div>

                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      سوالی وجود ندارد
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      هنوز سوالی ثبت نشده است. می‌توانید اولین سوال خود را ایجاد
                      کنید.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              questions.map((question, index) => {
                const questionId = question.id ?? index;
                const questionTitle = getQuestionTitle(question);
                const questionType = getQuestionType(question);
                const lessonName = getLessonName(question);
                const difficultyInfo = getDifficulty(question);
                const difficulty =
                  difficultyStyles[difficultyInfo.color] ??
                  difficultyStyles.orange;
                const questionStatus = getQuestionStatus(question);
                const questionDate = formatQuestionDate(question);

                const status =
                  statusStyles[questionStatus] ?? statusStyles["نامشخص"];
                return (
                  <tr
                    key={questionId}
                    className="group h-16 border-b border-slate-100 transition-all duration-200 hover:bg-violet-50/50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                  >
                    <td className="px-5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex w-20 shrink-0 items-center justify-center rounded-lg px-2 py-1.5 text-[10px] font-bold ${
                            typeStyles[questionType] ??
                            "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {questionType}
                        </span>

                        <div className="group/question relative min-w-0 max-w-100">
                          <span className="block truncate text-[12px] font-medium text-slate-600 dark:text-slate-300">
                            {questionTitle}
                          </span>

                          <div className="invisible pointer-events-none absolute right-0 top-full z-50 mt-3 w-92 translate-y-1 rounded-xl border border-violet-100 bg-white p-4 text-right opacity-0 shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-200 group-hover/question:visible group-hover/question:translate-y-0 group-hover/question:opacity-100 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/40">
                            <div className="mb-3 flex items-center gap-2">
                              <div className="flex size-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950/50">
                                <FileText
                                  size={15}
                                  className="text-violet-600 dark:text-violet-400"
                                />
                              </div>

                              <span className="text-xs font-bold text-violet-700 dark:text-violet-300">
                                متن کامل سوال
                              </span>
                            </div>

                            <p className="text-[12px] font-medium leading-6 text-slate-600 dark:text-slate-300">
                              {questionTitle}
                            </p>

                            <div className="absolute -top-1.5 right-6 h-3 w-3 rotate-45 border-l border-t border-violet-100 bg-white dark:border-slate-700 dark:bg-slate-800" />
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 text-center">
                      <div className="flex items-center justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] w-30 justify-center font-semibold ${status.bg} ${status.text}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                          />
                          {questionStatus}
                        </span>
                      </div>
                    </td>

                    <td className="text-center">
                      <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {lessonName}
                      </span>
                    </td>

                    <td className="px-4">
                      <div className="flex items-center justify-center">
                        <span
                          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${difficulty.bg} ${difficulty.text}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${difficulty.dot}`}
                          />
                          {difficultyInfo.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 text-center">
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {questionDate}
                      </span>
                    </td>

                    <td className="px-3">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          title="عملیات"
                          onClick={(event) =>
                            handleMenuToggle(event, questionId)
                          }
                          className="flex size-9 items-center justify-center rounded-xl border border-transparent text-slate-500 transition-all duration-200 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-violet-400"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {openMenu !== null && menuPosition && (
        <div
          ref={menuRef}
          style={{
            top: `${menuPosition.top}px`,
            right: `${menuPosition.right}px`,
          }}
          className="dropdown-menu fixed z-50 w-44 overflow-hidden rounded-xl border border-violet-100 bg-white p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.14)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40"
        >
          <button
            type="button"
            onClick={() => {
              const question = questions.find(
                (item, index) => (item.id ?? index) === openMenu,
              );

              handleAction("delete", question);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-right text-xs font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-400">
              <Eye size={15} />
            </span>
            مشاهده سوال
          </button>

          <button
            type="button"
            onClick={() => {
              const question = questions.find(
                (item, index) => (item.id ?? index) === openMenu,
              );
              handleAction("edit", question);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-right text-xs font-medium text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-600 dark:text-slate-300 dark:hover:bg-violet-950/30 dark:hover:text-violet-400"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
              <Pencil size={15} />
            </span>
            ویرایش سوال
          </button>

          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

          <button
            type="button"
            onClick={() => {
              const question = questions.find((item) => item.id === openMenu);

              handleAction("delete", question);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-right text-xs font-medium text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-950/70"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <Trash2 size={15} />
            </span>
            <span> حذف سوال </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionTable;
