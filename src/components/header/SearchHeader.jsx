import { Search } from "lucide-react";
import React from "react";

function SearchHeader() {
  return (
    <div className="relative w-full h-full">
      <input
        type="text"
        placeholder="جستجو در كتاب ها، درس ها، سوالات، آزمون ها"
        className="w-130 dark:text-white text-right pr-10 h-12 rounded-xl border border-gray-300 text-gray-500 font-bold text-sm focus: outline-none"
      />
      <Search size={16} className="absolute right-3 text-gray-500 top-3" />
    </div>
  );
}

export default SearchHeader;
