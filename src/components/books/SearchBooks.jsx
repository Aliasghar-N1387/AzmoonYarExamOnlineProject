import { Search } from "lucide-react";
import React from "react";

function SearchBooks({ value, onChange }) {
  return (
    <div className="relative w-full max-w-sm mr-12 ml-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="جستجو در کتاب‌ها"
        className="h-10 w-full rounded-lg border border-gray-200
          bg-white pr-10 pl-10 text-right text-sm text-gray-700
          outline-none transition focus:border-violet-500
          focus:ring-2 focus:ring-violet-200
          dark:border-slate-700 dark:bg-slate-900
          dark:text-white"
      />

      <Search size={16} className="absolute right-3 top-3 text-gray-500" />
    </div>
  );
}

export default SearchBooks;
