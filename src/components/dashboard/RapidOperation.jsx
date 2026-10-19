import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  ArrowUpLeft,
  Plus,
  CircleQuestionMark,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

function RapidOperation() {
  const navigate = useNavigate();

  const cards = [
    {
      id: 1,
      title: "افزودن کتاب",
      icon: BookOpen,
      onClick: () => {
        navigate("/dashboard/books", {
          state: { openCreateBookModal: true },
        });
      },
    },
    {
      id: 2,
      title: "آزمون آنلاین",
      icon: GraduationCap,
    },
    {
      id: 2,
      title: "افزودن سؤال",
      icon: CircleQuestionMark,
      onClick: () => {
        navigate("/dashboard/questions", {
          state: { openCreateQuestionModal: true },
        });
      },
    },
    {
      id: 4,
      title: "ساخت آزمون",
      icon: ClipboardList,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 px-1">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <button
            key={card.id}
            type="button"
            onClick={card.onClick}
            className="group relative overflow-hidden min-h-32 rounded-2xl border border-violet-100 bg-linear-to-br from-white via-violet-50/70 to-violet-100/50 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-violet-950/30 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/5 transition-all duration-500 group-hover:scale-150 group-hover:bg-violet-500/10" />

            <div className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-600 opacity-0 -translate-x-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              <ArrowUpLeft size={14} />
            </div>

            <div className="relative flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white">
                <Icon size={27} strokeWidth={1.8} />

                <span className="absolute right-10 -bottom-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-violet-600 text-sm font-bold text-white">
                  <Plus className="size-3 stroke-3" />
                </span>
              </div>
            </div>

            <p className="relative mt-4 text-center text-sm font-bold text-slate-700 group-hover:text-violet-700 dark:text-slate-100">
              {card.title}
            </p>

            <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-violet-500 transition-all duration-300 group-hover:w-1/2" />
          </button>
        );
      })}
    </div>
  );
}

export default RapidOperation;
