import React, { useEffect, useState } from "react";
import SearchHeader from "../../components/header/SearchHeader";
import { Bell, MessageCircleMore, Moon, Sun } from "lucide-react";
import UserProfileHeader from "../../components/header/UserProfileHeader";

function HeaderContent() {
  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true",
  );

  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newValue = !prev;

      localStorage.setItem("darkMode", String(newValue));

      if (newValue) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // رفرش صفحه
      window.location.reload();

      return newValue;
    });
  };
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

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

  return (
    <div className="border-b border-gray-300 dark:border-slate-800 bg-violet-50/50 dark:bg-slate-950 py-4 px-8 flex items-center justify-end transition-colors duration-300">
      <div className="mr-20">
        <UserProfileHeader />
      </div>

      <div className="flex items-center gap-6">
        {visitMoreWebIcon.map((visit) => {
          const Icon = visit.icon;

          return (
            <button
              key={visit.id}
              type="button"
              onClick={visit.onClick}
              className="rounded-full transition-all duration-200 hover:bg-violet-100 dark:hover:bg-slate-800"
            >
              <Icon
                size={32}
                className="p-2 cursor-pointer text-gray-700 dark:text-gray-200"
              />
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

        <p className="text-gray-400  pt-1 dark:text-gray-400">
          خوش آمدی به پنل کاربری آزمون یار
        </p>
      </div>
    </div>
  );
}

export default HeaderContent;
