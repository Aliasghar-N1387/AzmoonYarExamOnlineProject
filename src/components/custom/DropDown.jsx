import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

let activeDropdownId = null;
let nextDropdownId = 0;

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
  disabled = false,
  value,
  onChange,
  valueDrop,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);
  const dropdownIdRef = useRef(null);

  if (dropdownIdRef.current === null) {
    dropdownIdRef.current = ++nextDropdownId;
  }

  const dropdownId = dropdownIdRef.current;
  const selectedItemValue = value?.name || "";

  // بستن دراپ‌داون هنگام کلیک بیرون
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);

        if (activeDropdownId === dropdownId) {
          activeDropdownId = null;
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);

      if (activeDropdownId === dropdownId) {
        activeDropdownId = null;
      }
    };
  }, [dropdownId]);

  // باز کردن این دراپ‌داون و بستن دراپ‌داون قبلی
  const toggleDropdown = () => {
    if (disabled) return;

    if (isOpen) {
      setIsOpen(false);

      if (activeDropdownId === dropdownId) {
        activeDropdownId = null;
      }

      return;
    }

    // اگر دراپ‌داون دیگری باز است، آن را ببند
    activeDropdownId = dropdownId;

    // رویداد سفارشی برای بستن سایر دراپ‌داون‌ها
    window.dispatchEvent(
      new CustomEvent("dropdown-open", {
        detail: { id: dropdownId },
      }),
    );

    setIsOpen(true);
  };

  // شنیدن رویداد باز شدن دراپ‌داون دیگر
  useEffect(() => {
    const handleOtherDropdownOpen = (event) => {
      if (event.detail.id !== dropdownId) {
        setIsOpen(false);
      }
    };

    window.addEventListener("dropdown-open", handleOtherDropdownOpen);

    return () => {
      window.removeEventListener("dropdown-open", handleOtherDropdownOpen);
    };
  }, [dropdownId]);

  const selectItem = (item) => {
    onChange?.(item);
    valueDrop?.(item);
    setIsOpen(false);

    if (activeDropdownId === dropdownId) {
      activeDropdownId = null;
    }
  };

  const clearValue = (event) => {
    event.stopPropagation();

    onChange?.(null);
    valueDrop?.(null);
    setIsOpen(false);

    if (activeDropdownId === dropdownId) {
      activeDropdownId = null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-col gap-2 text-right"
      dir="rtl"
    >
      {labelOn && (
        <label className="text-xs font-bold text-gray-500 dark:text-white">
          {name}
          {important && <span className="ml-2 text-red-600">*</span>}
        </label>
      )}

      <div
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`group relative flex h-10 w-full items-center rounded-lg border px-3 text-right transition-all
          ${
            disabled
              ? "cursor-not-allowed bg-gray-100 opacity-50 dark:bg-slate-800"
              : "cursor-pointer bg-white hover:border-violet-500 dark:bg-slate-900"
          }
          ${
            isOpen
              ? "border-violet-400 ring-4 ring-violet-200"
              : "border-gray-200"
          }`}
      >
        {!selectedItemValue ? (
          <ChevronDown
            className={`absolute left-3 size-5 text-gray-400 transition-all duration-300 dark:text-white ${
              isOpen && "rotate-180 text-violet-500"
            }`}
          />
        ) : (
          <X
            onClick={clearValue}
            className="absolute left-3 size-5 cursor-pointer rounded-full text-gray-400 hover:text-violet-500 dark:text-white"
          />
        )}

        <div className="flex w-full items-center justify-between">
          <span
            className={`text-right text-xs ${
              selectedItemValue
                ? "font-medium text-gray-800 dark:text-white"
                : "text-gray-400"
            }`}
          >
            {selectedItemValue || placeholder}
          </span>

          {BackIcon && (
            <BackIcon className="h-5 w-5 text-gray-500 dark:text-violet-900" />
          )}
        </div>

        {isOpen && (
          <div className="absolute left-0 top-11 z-50 w-full rounded-lg border border-gray-100 bg-white p-2 shadow-2xl dark:bg-violet-950 dark:text-white">
            <ul role="listbox" className="max-h-60 space-y-1 overflow-y-auto">
              {items.map((item) => (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={value?.id === item.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    selectItem(item);
                  }}
                  className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-xs text-gray-700 transition-all hover:bg-gray-200 hover:text-gray-600 active:scale-95 dark:text-white dark:hover:bg-slate-900 dark:hover:text-white"
                >
                  <span>{item.name}</span>

                  {usernameTitle && <span>{item.username}</span>}

                  {itemsTag && (
                    <span className="rounded-full px-3 py-1 text-xs font-bold text-gray-700 dark:text-gray-700">
                      {item.tag}
                    </span>
                  )}
                </li>
              ))}

              {items.length === 0 && (
                <li className="flex justify-center rounded-lg text-sm text-gray-400 dark:text-white">
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
