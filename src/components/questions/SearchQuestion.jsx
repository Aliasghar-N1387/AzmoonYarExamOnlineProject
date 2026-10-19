import { Search, X } from "lucide-react";

function SearchQuestion({ value, onChange }) {
  return (
    <div className="relative w-full max-w-sm">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="جستجو در سؤال‌ها..."
        aria-label="جستجو در سؤال‌ها"
        dir="rtl"
        className="h-10 w-full rounded-lg border border-gray-200
          bg-white pr-10 pl-10 text-right text-sm text-gray-700
          outline-none transition focus:border-violet-500
          focus:ring-2 focus:ring-violet-200
          dark:border-slate-700 dark:bg-slate-900
          dark:text-white"
      />

      <Search size={17} className="absolute right-3 top-3 text-gray-500" />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="پاک کردن جستجو"
          className="absolute left-3 top-3 text-gray-500
            hover:text-violet-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchQuestion;
