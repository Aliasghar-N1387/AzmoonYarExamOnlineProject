import { CirclePlus, CircleQuestionMark, Folder } from "lucide-react";

import BtnContents from "../../components/custom/BtnContents";
import FilterQuestion from "../../components/questions/FilterQuestion";
import SearchQuestion from "../../components/questions/SearchQuestion";
import CardinfoQuestions from "../../components/questions/CardinfoQuestions";
import QuestionTable from "../../components/questions/QuestionsTable";
import { useState } from "react";

function QuestionContent() {
  const BtnHeader = [
    {
      id: 1,
      name: "سوال جدید",
      icon: <CirclePlus size={16} />,
      styleButton:
        "bg-violet-900 text-white hover:bg-violet-800 hover:shadow-violet-500/30 active:bg-violet-950 dark:bg-violet-900 dark:hover:bg-violet-800",
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

  return (
    <div className="p-6 h-full pb-0 bg-violet-50/50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="flex pl-10 justify-between text-right">
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
        <CardinfoQuestions darkMode={darkMode} />
      </div>

      {/* Questions Table */}
      <div className="mt-7 flex justify-center">
        <QuestionTable />
      </div>
    </div>
  );
}

export default QuestionContent;
