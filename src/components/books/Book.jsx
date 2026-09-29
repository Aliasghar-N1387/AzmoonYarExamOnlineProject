import { BookOpen, FileText, Heart, Plus } from "lucide-react";
import { useState } from "react";

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
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleFavorite = () => {
    setIsFavorite((prev) => !prev);
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 2500);
  };

  return (
    <div className="relative bg-white dark:bg-slate-900 cursor-default rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-lg transition-all duration-300 text-right">
      {/* پیام علاقه‌مندی */}
      <div
        className={`absolute top-15 left-3 z-20 bg-gray-800 dark:bg-violet-950 dark:text-white text-white text-xs px-4 py-2 rounded-lg shadow-lg
          transition-all duration-250 ease-out
          ${
            showMessage
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-3 scale-95 pointer-events-none"
          }
        `}
      >
        {isFavorite
          ? "❤️ این کتاب به علاقه‌مندی‌های شما اضافه شد"
          : "این کتاب از علاقه‌مندی‌ها حذف شد"}
      </div>

      {/* top actions */}
      <div className="flex justify-between items-center mb-3">
        {/* قلب */}
        <button
          type="button"
          onClick={handleFavorite}
          className={`transition-all duration-300 cursor-pointer ${
            isFavorite
              ? "text-rose-500 scale-110"
              : "text-gray-400 hover:text-rose-500"
          }`}
          title={
            isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
          }
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {/* افزودن */}
        <button
          type="button"
          className="text-gray-400 hover:text-violet-600 transition cursor-pointer"
          title="افزودن"
          onClick={onOpenModal}
        >
          <Plus size={17} />
        </button>
      </div>

      {/* image */}
      <div className="flex justify-center mb-4">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-32 w-24 object-cover rounded-md shadow-sm"
          />
        ) : (
          <div className="h-32 w-24 flex items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900 border border-violet-100">
            <BookOpen className="size-12 text-violet-400" />
          </div>
        )}
      </div>

      {/* title */}
      <h3 className="font-bold text-base text-gray-800 dark:text-white">{title}</h3>

      {/* info */}
      <p className="text-xs text-gray-400 mt-2">
        {grade} - {field}
      </p>

      {/* level */}
      {level && (
        <span className="inline-flex mt-3 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-medium">
          {level}
        </span>
      )}

      {/* footer */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <BookOpen size={15} className="text-violet-600" />
          <span className="font-bold dark:text-white">{lessons}</span>
        </div>

        <div className="flex items-center gap-1">
          <FileText size={15} className="text-violet-600" />
          <span className="font-bold dark:text-white">{questions}</span>
        </div>
      </div>
    </div>
  );
}

export default Book;
