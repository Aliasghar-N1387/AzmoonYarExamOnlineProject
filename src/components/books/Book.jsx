import {
  BookOpen,
  FileText,
  Heart,
  Plus,
  Trash2,
  ArrowUpLeft,
  Pen,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { useAlert } from "../custom/AlertContext";

function Book({
  title,
  grade,
  field,
  level,
  lessons,
  questions,
  image,
  onDetails,
  onOpenModal,
  onDelete,
  onEdit,
  bookSource,
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showLinear] = useState(localStorage.getItem("darkMode") === "true");

  const handleFavorite = () => {
    setIsFavorite((prev) => !prev);
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 2500);
  };

  return (
    <div
      dir="rtl"
      className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Gradient background */}
      {showLinear && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-br from-violet-100 via-indigo-50 to-transparent dark:from-violet-950/50 dark:via-indigo-950/30" />
      )}
      {/* Favorite message */}
      <div
        className={`absolute left-4 top-4 z-30 rounded-xl bg-slate-900/95 px-4 py-2.5 text-xs font-medium text-white shadow-xl backdrop-blur-md transition-all duration-300 dark:bg-violet-950 ${
          showMessage
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-3 scale-95 pointer-events-none opacity-0"
        }`}
      >
        {isFavorite
          ? "❤️ کتاب به علاقه‌مندی‌ها اضافه شد"
          : "کتاب از علاقه‌مندی‌ها حذف شد"}
      </div>

      {/* Header actions */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <button
          type="button"
          onClick={handleFavorite}
          title={
            isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
          }
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${
            isFavorite
              ? "border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-900 dark:bg-rose-950/40"
              : "border-slate-200 bg-white/80 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 dark:border-slate-700 dark:bg-slate-800/80"
          }`}
        >
          <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        <button
          type="button"
          onClick={onOpenModal}
          title="افزودن"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white shadow-md shadow-violet-200 transition-all duration-200 hover:scale-105 hover:bg-violet-700 active:scale-95 dark:shadow-none"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Book cover */}
      <div className="relative flex justify-center px-6 pb-5 pt-1">
        <div className="relative h-40 w-28 overflow-hidden rounded-xl bg-linear-to-br from-violet-100 to-indigo-100 shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-all duration-500 group-hover:-rotate-1 group-hover:scale-105 dark:from-violet-950 dark:to-indigo-950">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BookOpen
                size={46}
                strokeWidth={1.5}
                className="text-violet-400"
              />
            </div>
          )}

          {/* Cover shine */}
          <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-white/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      </div>

      {/* Content */}
      <div className="relative px-5 pb-5">
        {/* Level */}
        {level && (
          <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
            {level}
          </span>
        )}

        {/* Title */}
        <h3 className="mt-3 min-h-12 line-clamp-2 text-[15px] font-extrabold leading-6 text-slate-800 dark:text-white">
          {title}
        </h3>

        {/* Meta */}
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <span>{grade}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span>{field}</span>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          {/* Lessons / Edit */}
          <div className="relative h-9 min-w-18">
            <div
              className={`absolute inset-0 flex items-center justify-end gap-2 transition-all duration-300,
              ${bookSource == 2 ? "group-hover:translate-y-2 group-hover:opacity-0" : ""}`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
                <BookOpen size={15} />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">درس</span>
                <span className="text-xs font-bold text-slate-700 dark:text-white">
                  {lessons}
                </span>
              </div>
            </div>

            {/* Edit */}
            {bookSource == 2 && (
              <button
                type="button"
                onClick={() => onEdit?.()}
                className="absolute inset-0 flex translate-y-2 items-center justify-center gap-2 rounded-lg bg-violet-50 text-violet-600 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-violet-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-950/70"
                title="ویرایش درس‌ها"
              >
                <Pencil size={15} className="rotate-280" />
                <span className="text-xs font-semibold">ویرایش</span>
              </button>
            )}
          </div>

          {/* Questions / Delete */}
          <div className="relative h-9 min-w-20">
            <div
              className={`absolute inset-0 flex items-center justify-end gap-2 transition-all duration-300,
              ${bookSource == 2 ? "group-hover:translate-y-2 group-hover:opacity-0" : ""}`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <FileText size={15} />
              </div>

              <div>
                <span className="block text-[10px] text-slate-400">سوال</span>
                <span className="text-xs font-bold text-slate-700 dark:text-white">
                  {questions}
                </span>
              </div>
            </div>
            {bookSource == 2 && (
              <button
                type="button"
                onClick={() => onDelete?.()}
                className="absolute inset-0 flex translate-y-2 items-center justify-center gap-2 rounded-lg bg-rose-50 text-rose-500 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70"
                title="حذف کتاب"
              >
                <Trash2 size={15} />
                <span className="text-xs font-semibold">حذف</span>
              </button>
            )}
          </div>
        </div>

        {/* Details button */}
        {onDetails && (
          <button
            type="button"
            onClick={onDetails}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-violet-600 dark:bg-slate-800 dark:hover:bg-violet-600"
          >
            مشاهده جزئیات
            <ArrowUpLeft size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Book;
