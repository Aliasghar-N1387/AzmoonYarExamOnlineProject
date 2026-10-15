import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

function SelectBox({
  items = [],
  name = "",
  labelOn = false,
  important = false,
  placeholder = "",
  title = false,
  itemsTag = false,
  usernameTitle = false,
  backIcon: BackIcon,
  value,
  onChange,
  valueDrop,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedItemValue = value?.name || "";

  const selectItem = (item) => {
    onChange(item);

    if (valueDrop) {
      valueDrop(item);
    }

    setIsOpen(false);
  };

  const clearValue = (e) => {
    e.stopPropagation();

    onChange(null);

    if (valueDrop) {
      valueDrop(null);
    }

    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 w-full relative text-right" dir="rtl">
      {labelOn && (
        <label className="text-xs font-bold text-gray-500 dark:text-white">
          {name}
          {important && <span className="text-red-600 ml-2">*</span>}
        </label>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative text-right flex items-center h-10 w-full px-3 rounded-lg border bg-white dark:bg-slate-900  cursor-pointer transition-all duration-200 ${isOpen ? "border-violet-400 ring-4 ring-violet-200" : "border-gray-200"} hover:border-violet-500 hover:shadow-md
    `}
      >
        {!selectedItemValue ? (
          <ChevronDown
            className={`absolute left-3 size-5 text-gray-400 dark:text-white transition-all duration-300 ${isOpen && "rotate-180 text-violet-500"}`}
          />
        ) : (
          <X
            onClick={clearValue}
            className="absolute left-3 size-5 cursor-pointer dark:text-white text-gray-400 hover:text-violet-500 rounded-full"
          />
        )}

        <div className="flex items-center justify-between w-full">
          <span
            className={`
      text-xs text-right dark:text-white
      ${selectedItemValue ? "text-gray-800 dark:text-white font-medium" : "text-gray-400"}F`}
          >
            {selectedItemValue || placeholder}
          </span>

          {BackIcon && <BackIcon className="w-5 h-5 text-gray-500 dark:text-violet-900" />}
        </div>

        {isOpen && (
          <div
            className="absolute top-11 left-0 z-50 w-full rounded-lg border border-gray-100 bg-white dark:bg-violet-950 dark:text-white p-2 shadow-2xl transition-all duration-200"
          >
            <ul
              className="max-h-60 space-y-1 overflow-y-auto"
            >
              {items.map((item) => (
                <li
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectItem(item);
                  }}
                  className="flex dark:text-white items-center justify-between rounded-lg px-3 py-2.5 text-xs text-gray-700 cursor-pointer transition-all hover:bg-gray-200 hover:text-gray-600  dark:hover:bg-slate-900 dark:hover:text-white active:scale-95
                  "
                >
                  <span>{item.name}</span>

                  {usernameTitle && <span>{item.username}</span>}

                  {itemsTag && (
                    <span className=" rounded-full px-3 py-1 text-xs font-bold text-gray-700 dark:text-gray-700">
                      {item.tag}
                    </span>
                  )}
                </li>
              ))}

              {items.length === 0 && (
                <li className="flex justify-center rounded-lg  text-sm text-gray-400 dark:text-white">
                  آیتمی وجود ندارد
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {title && (
        <p className="text-sm text-gray-400">Only invited members can access</p>
      )}
    </div>
  );
}

export default SelectBox;
