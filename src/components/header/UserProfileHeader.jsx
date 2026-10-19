import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
  ShieldCheck,
  Check,
} from "lucide-react";

import { useNavigate } from "react-router";
import auth from "../../api/auth";
import profile from "../../assets/img/profile.png";

function UserProfileHeader() {
  const [user] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  const firstName = user?.firstName || "کاربر";
  const lastName = user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowLogoutConfirm(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setShowLogoutConfirm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleProfile = () => {
    setIsOpen(false);
  };

  const handleSettings = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        const response = await auth.postRefreshToken(refreshToken);

        if (!response.ok) {
          throw new Error("Logout failed");
        }
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessTokenExpireTime");
      localStorage.removeItem("refreshTokenExpireTime");
      localStorage.removeItem("user");

      setIsOpen(false);
      setShowLogoutConfirm(false);

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div ref={dropdownRef} dir="rtl" className="relative z-50 w-64">
      {/* Profile Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`group flex w-full items-center gap-3 rounded-2xl border p-2  text-right
          transition-all duration-300
          ${
            isOpen
              ? "border-violet-200 bg-violet-50/80 shadow-lg shadow-violet-100/50 dark:border-violet-500/30 dark:bg-slate-800"
              : "border-slate-200/80 bg-white shadow-sm hover:border-violet-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
          }`}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="size-11 overflow-hidden rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 p-0.5 shadow-md shadow-violet-200/60 dark:shadow-none">
            <div className="h-full w-full overflow-hidden rounded-[10px] bg-white dark:bg-slate-800">
              <img
                src={profile}
                alt="پروفایل کاربر"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <span className="absolute -bottom-1 -left-1 flex size-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900">
            <Check size={8} className="text-white" strokeWidth={3} />
          </span>
        </div>

        {/* User Information */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
            {fullName}
          </p>

          <div className="mt-1 flex items-center gap-1.5">
            <ShieldCheck
              size={13}
              className="shrink-0 text-violet-500 dark:text-violet-400"
            />
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              مدیر سیستم
            </span>
          </div>
        </div>

        {/* Dropdown Icon */}
        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
            isOpen
              ? "rotate-180 bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
              : "text-slate-400 group-hover:bg-slate-100 group-hover:text-violet-600 dark:group-hover:bg-slate-800"
          }`}
        >
          <ChevronDown size={18} />
        </div>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 top-full mt-3 w-full origin-top rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl shadow-slate-200/50 transition-all duration-200 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20 ${
          isOpen
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-2 scale-[0.98] opacity-0 pointer-events-none"
        }`}
      >
        {/* Menu Header */}
        <div className="mb-2 rounded-xl bg-linear-to-l from-violet-50 to-indigo-50/70 px-3 py-3 dark:from-violet-950/30 dark:to-indigo-950/20">
          <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
            {fullName}
          </p>
          <p className="mt-1 truncate text-[11px] text-slate-500 dark:text-slate-400">
            {user?.email || "خوش آمدید"}
          </p>
        </div>

        <p className="px-3 pb-2 pt-1 text-[10px] font-bold text-slate-400">
          حساب کاربری
        </p>

        {/* Profile */}
        <button
          type="button"
          role="menuitem"
          onClick={handleProfile}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-violet-950/30 dark:hover:text-violet-300"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
            <UserRound size={17} />
          </span>

          <span className="flex-1 text-right font-medium">پروفایل من</span>
        </button>

        {/* Settings */}
        <button
          type="button"
          role="menuitem"
          onClick={handleSettings}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-violet-950/30 dark:hover:text-violet-300"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Settings size={17} />
          </span>

          <span className="flex-1 text-right font-medium">تنظیمات</span>
        </button>

        <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

        {/* Logout Confirmation */}
        {!showLogoutConfirm ? (
          <button
            type="button"
            role="menuitem"
            onClick={() => setShowLogoutConfirm(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-950/30">
              <LogOut size={17} />
            </span>

            <span className="flex-1 text-right font-medium">خروج از حساب</span>
          </button>
        ) : (
          <div className="rounded-xl bg-rose-50 p-3 dark:bg-rose-950/20">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
              از حساب کاربری خارج می‌شوید؟
            </p>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-lg bg-rose-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-rose-600"
              >
                بله، خروج
              </button>

              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                انصراف
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-2 border-t border-slate-100 px-3 pt-3 dark:border-slate-800">
          <p className="text-center text-[10px] text-slate-400">
            پنل مدیریت · نسخه ۱.۰
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserProfileHeader;
