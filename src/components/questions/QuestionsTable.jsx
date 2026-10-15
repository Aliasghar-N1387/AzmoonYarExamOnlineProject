import { MoreVertical, FileText, Pencil, Trash2, Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const QuestionTable = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const menuRef = useRef(null);

  const questions = [
    {
      id: 1,
      title: "قانون دوم نیوتن را توضیح دهید و یک مثال عددی حل کنید.",
      type: "تشریحی",
      lesson: "فیزیک ۳ - فصل ۲",
      difficulty: "متوسط",
      difficultyColor: "orange",
      time: "۷ دقیقه",
      date: "۱۴۰۳/۰۶/۱۴",
    },
    {
      id: 2,
      title:
        "در شکل زیر اگر نیروی خالص وارد بر جسم صفر باشد، شتاب جسم چقدر است؟",
      type: "تستی",
      lesson: "فیزیک ۳ - فصل ۲",
      difficulty: "آسان",
      difficultyColor: "green",
      time: "۱ دقیقه",
      date: "۱۴۰۳/۰۶/۱۳",
    },
    {
      id: 3,
      title:
        "جای خالی را در جمله زیر کامل کنید: نیروی ... باعث تغییر سرعت جسم می‌شود.",
      type: "جای خالی",
      lesson: "فیزیک ۳ - فصل ۱",
      difficulty: "آسان",
      difficultyColor: "green",
      time: "۱ دقیقه",
      date: "۱۴۰۳/۰۶/۱۳",
    },
    {
      id: 4,
      title: "کدام گزینه در مورد قانون پایستگی انرژی صحیح است؟",
      type: "تستی",
      lesson: "فیزیک ۳ - فصل ۳",
      difficulty: "سخت",
      difficultyColor: "red",
      time: "۲ دقیقه",
      date: "۱۴۰۳/۰۶/۱۲",
    },
    {
      id: 5,
      title: "تعریف تکانه را بنویسید و یک مثال کاربردی بیان کنید.",
      type: "کوتاه پاسخ",
      lesson: "فیزیک ۳ - فصل ۲",
      difficulty: "متوسط",
      difficultyColor: "orange",
      time: "۳ دقیقه",
      date: "۱۴۰۳/۰۶/۱۲",
    },
    {
      id: 6,
      title: "درستی یا نادرستی عبارت زیر را مشخص کنید.",
      type: "صحیح / غلط",
      lesson: "فیزیک ۳ - فصل ۱",
      difficulty: "آسان",
      difficultyColor: "green",
      time: "۱ دقیقه",
      date: "۱۴۰۳/۰۶/۱۱",
    },
    {
      id: 7,
      title: "اجزای نمودار مکان - زمان در حرکت یکنواخت را نام ببرید.",
      type: "وصل کردنی",
      lesson: "فیزیک ۳ - فصل ۱",
      difficulty: "متوسط",
      difficultyColor: "orange",
      time: "۲ دقیقه",
      date: "۱۴۰۳/۰۶/۱۰",
    },
    {
      id: 8,
      title: "رابطه سرعت و شتاب را در حرکت شتابدار توضیح دهید.",
      type: "تشریحی",
      lesson: "فیزیک ۳ - فصل ۲",
      difficulty: "متوسط",
      difficultyColor: "orange",
      time: "۴ دقیقه",
      date: "۱۴۰۳/۰۶/۰۹",
    },
    {
      id: 9,
      title: "واحد اندازه‌گیری نیرو در دستگاه SI چیست؟",
      type: "تستی",
      lesson: "فیزیک ۳ - فصل ۱",
      difficulty: "آسان",
      difficultyColor: "green",
      time: "۱ دقیقه",
      date: "۱۴۰۳/۰۶/۰۸",
    },
  ];

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
    تشریحی:
      "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
    تستی: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300",
    "کوتاه پاسخ":
      "bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300",
    "جای خالی":
      "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300",
    "صحیح / غلط":
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
    "وصل کردنی":
      "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
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

    if (action === "view") {
      console.log("مشاهده:", question);
    }

    if (action === "edit") {
      console.log("ویرایش:", question);
    }

    if (action === "delete") {
      console.log("حذف:", question);
    }
  };

  return (
    <div
      dir="rtl"
      className="w-full overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20"
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
        <table className="w-full min-w-150 border-collapse text-sm">
          <thead className="sticky top-0 z-20 bg-violet-50 backdrop-blur-md dark:bg-slate-800/95">
            <tr className="h-12 border-b border-violet-100 text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <th className="w-[32%] px-5 text-right text-xs font-bold">
                عنوان سوال
              </th>
              <th className="w-[15%] text-center text-xs font-bold">
                کتاب / درس
              </th>
              <th className="w-[12%] text-center text-xs font-bold">سختی</th>
              <th className="w-[12%] text-center text-xs font-bold">
                تاریخ ایجاد
              </th>
              <th className="w-[8%] text-center text-xs font-bold">عملیات</th>
            </tr>
          </thead>

          <tbody>
            {questions.map((question) => {
              const difficulty = difficultyStyles[question.difficultyColor];

              return (
                <tr
                  key={question.id}
                  className="group h-16 border-b border-slate-100 transition-all duration-200 hover:bg-violet-50/50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                >
                  <td className="px-5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex w-20 shrink-0 items-center justify-center rounded-lg px-2 py-1.5 text-[10px] font-bold ${typeStyles[question.type] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
                      >
                        {question.type}
                      </span>

                      <div className="group/question relative min-w-0 max-w-100">
                        <span className="block truncate text-[12px] font-medium text-slate-600 dark:text-slate-300">
                          {question.title}
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
                            {question.title}
                          </p>

                          <div className="absolute -top-1.5 right-6 h-3 w-3 rotate-45 border-l border-t border-violet-100 bg-white dark:border-slate-700 dark:bg-slate-800" />
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="text-center">
                    <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {question.lesson}
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
                        {question.difficulty}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 text-center">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {question.date}
                    </span>
                  </td>

                  <td className="px-3">
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        title="عملیات"
                        onClick={(event) =>
                          handleMenuToggle(event, question.id)
                        }
                        className="flex size-9 items-center justify-center rounded-xl border border-transparent text-slate-500 transition-all duration-200 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-violet-400"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
              const question = questions.find((item) => item.id === openMenu);
              handleAction("view", question);
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
              const question = questions.find((item) => item.id === openMenu);
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
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-right text-xs font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:bg-rose-950/40 dark:hover:bg-rose-950/70"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400">
              <Trash2 size={15} />
            </span>
            حذف سوال
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionTable;
