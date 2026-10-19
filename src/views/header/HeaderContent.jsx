import React, { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import SearchHeader from "../../components/header/SearchHeader";
import { Bell, MessageCircleMore, Moon, Sun } from "lucide-react";
import UserProfileHeader from "../../components/header/UserProfileHeader";
import { useNavigate } from "react-router";

function HeaderContent() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true",
  );

  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = (event) => {
    const newValue = !darkMode;
    const root = document.documentElement;

    // شروع افکت از مرکز دکمه
    const rect = event.currentTarget.getBoundingClientRect();

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    root.style.setProperty("--theme-x", `${x}px`);
    root.style.setProperty("--theme-y", `${y}px`);

    localStorage.setItem("darkMode", String(newValue));

    const updateTheme = () => {
      flushSync(() => {
        root.classList.toggle("dark", newValue);
        setDarkMode(newValue);
      });
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!reduceMotion && typeof document.startViewTransition === "function") {
      document.startViewTransition(updateTheme);
    } else {
      updateTheme();
    }
  };

  const visitMoreWebIcon = [
    {
      id: 1,
      icon: Bell,
    },
    {
      id: 2,
      icon: MessageCircleMore,
    },
    {
      id: 3,
      icon: darkMode ? Sun : Moon,
      onClick: toggleDarkMode,
    },
  ];

  const headerActions = [
    {
      id: "notifications",
      icon: Bell,
      label: "اعلان‌های خوانده‌نشده",
      count: 3,
      onClick: undefined,
    },
    {
      id: "messages",
      icon: MessageCircleMore,
      label: "پیام‌های خوانده‌نشده",
      count: 2,
      onClick: () => navigate("/dashboard/messages"),
    },
    {
      id: "theme",
      icon: darkMode ? Sun : Moon,
      label: darkMode ? "فعال کردن حالت روشن" : "فعال کردن حالت تاریک",
      onClick: toggleDarkMode,
    },
  ];

  return (
    <div className="border-b border-gray-300 dark:border-slate-800 bg-violet-50/50 dark:bg-slate-950 py-4 px-8 flex items-center justify-end transition-colors duration-300">
      <div className="mr-12">
        <UserProfileHeader />
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {headerActions.map((action) => {
          const Icon = action.icon;
          const hasUnread = action.count > 0;

          return (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              aria-label={
                hasUnread
                  ? `${action.label}، ${action.count} مورد`
                  : action.label
              }
              title={action.label}
              className="group relative flex size-11 items-center justify-center
        rounded-2xl border border-slate-200/80 bg-white
        text-slate-600 shadow-sm transition-all duration-300
        hover:-translate-y-0.5 hover:border-violet-200
        hover:bg-violet-50 hover:text-violet-600 hover:shadow-md
        dark:border-slate-700 dark:bg-slate-900
        dark:text-slate-300 dark:hover:border-violet-500/40
        dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
            >
              <Icon
                size={20}
                strokeWidth={1.8}
                className={`transition-transform duration-300 ${
                  action.id === "theme"
                    ? "group-hover:rotate-12"
                    : "group-hover:scale-110"
                }`}
              />

              {hasUnread && (
                <span
                  className="absolute -right-1 -top-1 flex min-w-6 h-6
            items-center justify-center rounded-full border-2
            border-white bg-rose-500 px-1 text-[10px]
            font-extrabold leading-none text-white
            shadow-sm dark:border-slate-950"
                >
                  {action.count > 9 ? "9+" : action.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="px-40">
        <SearchHeader />
      </div>

      <div className="text-right">
        <p className="font-bold text-xl text-gray-800 dark:text-white">
          👋 سلام {firstName} {lastName}
        </p>

        <p className="text-gray-400 pt-1 dark:text-gray-400">
          خوش آمدی به پنل کاربری آزمون یار
        </p>
      </div>
    </div>
  );
}

export default HeaderContent;
