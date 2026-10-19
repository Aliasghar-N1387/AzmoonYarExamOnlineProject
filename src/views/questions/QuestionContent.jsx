import {
  CirclePlus,
  CircleQuestionMark,
  Folder,
  BookOpen,
  GraduationCap,
  Layers,
  ListChecks,
  FileText,
  CheckCircle2,
  X,
} from "lucide-react";

import BtnContents from "../../components/custom/BtnContents";
import FilterQuestion from "../../components/questions/FilterQuestion";
import SearchQuestion from "../../components/questions/SearchQuestion";
import CardinfoQuestions from "../../components/questions/CardinfoQuestions";
import QuestionTable from "../../components/questions/QuestionsTable";
import { useEffect, useState } from "react";
import Modal from "../../components/custom/Modal";
import CreateQuestionModal from "../../components/questions/CreateQuestionModal";
import questionCrud from "../../api/questionCrud";
import { useToast } from "../../components/custom/Toast";
import { useAlert } from "../../components/custom/AlertContext";

function QuestionContent() {
  const toast = useToast();
  const { alert } = useAlert();

  const [isModalOpen, setIsCreateModalOpen] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [questionsCount, setCountQuestion] = useState({
    questionTypeCounts: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const BtnHeader = [
    {
      id: 1,
      name: "سوال جدید",
      icon: <CirclePlus size={16} />,
      styleButton:
        "bg-violet-900 text-white hover:bg-violet-800 hover:shadow-violet-500/30 active:bg-violet-950 dark:bg-violet-900 dark:hover:bg-violet-800",
      onClick: () => setIsCreateModalOpen(true),
    },
    {
      id: 2,
      name: "دسته بندی ها",
      icon: <Folder size={16} />,
      styleButton:
        "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md active:bg-gray-100 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-slate-600",
    },
  ];

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true",
  );

  const getQuestions = async (page = 1) => {
    try {
      setLoadingQuestions(true);

      const response = await questionCrud.getQuestions(page, pageSize);
      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(result?.error?.title || "دریافت سؤال‌ها ناموفق بود.");
      }

      const data = result?.data;

      setQuestions(data?.items ?? []);
      setCurrentPage(data?.pageNumber ?? page);
      setTotalPages(data?.totalPages ?? 1);
      setTotalCount(data?.totalCount ?? 0);
    } catch (error) {
      console.error("Error fetching questions:", error);

      toast.error(error.message || "دریافت سؤال‌ها با خطا مواجه شد", {
        title: "خطا در دریافت سؤال‌ها",
        duration: 5000,
      });
    } finally {
      setLoadingQuestions(false);
    }
  };

  const getDashboardData = async () => {
    try {
      const response = await questionCrud.getCountQuestionsData();

      if (!response.ok) {
        throw new Error("دریافت آمار سؤال‌ها ناموفق بود.");
      }

      const result = await response.json();

      setCountQuestion(
        result?.data ?? {
          questionTypeCounts: [],
        },
      );
    } catch (error) {
      console.error("Error fetching question counts:", error);

      toast.error("دریافت آمار سؤال‌ها ناموفق بود", {
        title: "خطا در دریافت اطلاعات",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  useEffect(() => {
    getQuestions(1);
  }, []);

  return (
    <div className="p-6 h-full pb-0 bg-violet-50/50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="flex pl-10s justify-between text-right">
        {/* Header Buttons */}
        <div className="flex justify-center items-center gap-4">
          {BtnHeader.map((btn) => {
            return (
              <div key={btn.id}>
                <BtnContents
                  name={btn.name}
                  icon={btn.icon}
                  styleButton={btn.styleButton}
                  onClick={btn.onClick}
                />
              </div>
            );
          })}
        </div>

        {/* Header Title */}
        <div className="flex gap-6 mr-10">
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              سوال ها
            </p>

            <p className="text-md text-slate-600 dark:text-slate-400 mt-1">
              مدیریت و سازماندهی سوالات بر اساس کتاب، درس و نوع سوال
            </p>
          </div>

          <div className="flex justify-center items-center">
            <div className="flex items-center justify-center size-12 rounded-xl bg-violet-100 dark:bg-violet-950/40">
              <CircleQuestionMark className="size-8 text-violet-700 dark:text-violet-400" />
            </div>
          </div>
        </div>
      </div>
      {/* Filter & Search */}
      <div className="my-10 flex justify-center items-end gap-14">
        <FilterQuestion />
        <SearchQuestion />
      </div>
      {/* Questions Info */}
      <div>
        <CardinfoQuestions
          questionsCount={questionsCount}
          darkMode={darkMode}
        />
      </div>
      {/* Questions Table */}
      <div className="mt-7 flex justify-center">
        <QuestionTable
          questions={questions}
          loading={loadingQuestions}
          onDelete={async (deletedId) => {
            const remainingQuestions = questions.filter(
              (question) => question.id !== deletedId,
            );

            const targetPage =
              remainingQuestions.length === 0 && currentPage > 1
                ? currentPage - 1
                : currentPage;

            await Promise.all([getQuestions(targetPage), getDashboardData()]);
          }}
        />
      </div>

      <div
        dir="rtl"
        className="mt-6 flex flex-col items-center justify-between gap-4 px-2 sm:flex-row"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => getQuestions(currentPage - 1)}
            disabled={currentPage <= 1 || loadingQuestions}
            className="rounded-lg border bg-white px-3 py-2 text-sm
        text-gray-700 disabled:cursor-not-allowed disabled:opacity-50
        dark:border-slate-700 dark:bg-violet-900 dark:text-white"
          >
            قبلی
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                type="button"
                key={page}
                onClick={() => getQuestions(page)}
                disabled={loadingQuestions || currentPage === page}
                aria-current={currentPage === page ? "page" : undefined}
                className={`h-9 min-w-9 rounded-lg px-3 text-sm ${
                  currentPage === page
                    ? "bg-violet-700 text-white dark:bg-violet-900 dark:ring-1 dark:ring-white"
                    : "border bg-white text-gray-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                } disabled:cursor-not-allowed`}
              >
                {page.toLocaleString("fa-IR")}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => getQuestions(currentPage + 1)}
            disabled={currentPage >= totalPages || loadingQuestions}
            className="rounded-lg border bg-white px-3 py-2 text-sm
        text-gray-700 disabled:cursor-not-allowed disabled:opacity-50
        dark:border-slate-700 dark:bg-violet-900 dark:text-white"
          >
            بعدی
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-white">
          تعداد کل سؤال‌ها :
          <span className="font-bold text-violet-700"> {totalCount}</span>
        </p>
      </div>

      {isModalOpen && (
        <CreateQuestionModal
          onClose={() => setIsCreateModalOpen(false)}
          onSave={async (question) => {
            console.log("سؤال جدید:", question);

            await Promise.all([getQuestions(currentPage), getDashboardData()]);

            setIsCreateModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default QuestionContent;
