import { Search } from "lucide-react";
import React from "react";

function SearchBooks() {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="جستجو در كتاب ها"
        className="w-83 text-right pr-10 h-10 rounded-lg border border-gray-200 dark:bg-slate-900 dark:text-white text-gray-500 font-bold text-sm focus: outline-none"
      />
      <Search size={16} className="absolute right-3 text-gray-500 top-2" />
    </div>
  );
}

export default SearchBooks;
