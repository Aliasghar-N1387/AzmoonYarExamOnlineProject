import React from "react";
import logo from "../../assets/img/LogoApp.png";
import {
  CircleQuestionMark,
  ClipboardList,
  ClipboardPlus,
  Home,
  LibraryBig,
  ChevronRight,
  LogOut,
  WavesArrowDown,
  Crown,
  Settings,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import bgsidebar from "../../assets/img/sidebar-img.png";
import bgsidbarDark from "../../assets/img/sidbar-dark.png";
import { useAlert } from "../../components/custom/AlertContext";
import auth from "../../api/auth";

function SideBarContent({ collapsed, setCollapsed, darkMode }) {
  const menuItemSidebar = [
    {
      id: 1,
      name: "داشبورد",
      iconMenu: <Home size={16} />,
      router: "/dashboard",
    },
    {
      id: 2,
      name: "کتاب ها",
      iconMenu: <LibraryBig size={16} />,
      router: "books",
    },
    {
      id: 3,
      name: "سوالات",
      iconMenu: <CircleQuestionMark size={16} />,
      router: "questions",
    },
    {
      id: 4,
      name: "آزمون ها",
      iconMenu: <ClipboardList size={16} />,
      router: "exams",
    },
    {
      id: 5,
      name: "ایجاد آزمون",
      iconMenu: <ClipboardPlus size={16} />,
      router: "create-exam",
    },
    {
      id: 6,
      name: "دانلود ها",
      iconMenu: <WavesArrowDown size={16} />,
      router: "create-exam",
    },
    {
      id: 7,
      name: "اشتراک",
      iconMenu: <Crown size={16} />,
      router: "create-exam",
    },
    {
      id: 8,
      name: "تنظیمات",
      iconMenu: <Settings size={16} />,
      router: "create-exam",
    },
    {
      id: 9,
      name: "راهنما",
      iconMenu: <CircleQuestionMark size={16} />,
      router: "create-exam",
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const refreshToken = localStorage.getItem("refreshToken");

  const { alert } = useAlert();

  const handleLogout = () => {
    alert({
      type: "confirm",
      title: "خروج از حساب",
      message: "آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟",
      confirmText: "خروج",
      cancelText: "انصراف",
      showCancel: true,

      onConfirm: async () => {
        try {
          const response = await auth.postRefreshToken(refreshToken);

          if (!response.ok) {
            throw new Error("Logout failed");
          }

          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("accessTokenExpireTime");
          localStorage.removeItem("refreshTokenExpireTime");
          localStorage.removeItem("user");

          navigate("/login", { replace: true });
        } catch (error) {
          console.error("Logout Error:", error);

          alert({
            type: "error",
            title: "خطا در خروج",
            message: "عملیات خروج انجام نشد. لطفاً دوباره تلاش کنید.",
            confirmText: "باشه",
          });
        }
      },
    });
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className="relative isolate flex h-full flex-col overflow-hidden
    bg-violet-50 dark:bg-slate-950
    px-3 py-4 transition-colors duration-300"
      dir="rtl"
    >
      {/* عکس پس‌زمینه حالت روشن */}
      <div
        className="pointer-events-none absolute inset-0 -z-10
      bg-cover bg-center bg-no-repeat dark:hidden"
        style={{
          backgroundImage: `url(${bgsidebar})`,
        }}
      />

      {/* عکس پس‌زمینه حالت تاریک */}
      <div
        className="pointer-events-none absolute inset-0 -z-10
      hidden bg-cover bg-center bg-no-repeat dark:block"
        style={{
          backgroundImage: `url(${bgsidbarDark})`,
        }}
      />
      <div className="flex justify-center py-2 mb-4 text-right">
        {!collapsed && (
          <div className="mt-4">
            <h1 className="font-[Vazir] text-violet-900 dark:text-white text-xl font-extrabold transition-colors duration-300">
              آزمون یار
            </h1>
            <p className="font-[Vazir] text-violet-700 dark:text-gray-300 text-sm font-bold transition-colors duration-300">
              AzmoonYar
            </p>
          </div>
        )}

        <div
          className="w-20 h-18 bg-violet-900 dark:bg-white transition-colors duration-300"
          style={{
            WebkitMaskImage: `url(${logo})`,
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            WebkitMaskSize: "contain",
            maskImage: `url(${logo})`,
            maskRepeat: "no-repeat",
            maskPosition: "center",
            maskSize: "contain",
          }}
        ></div>
      </div>

      <div>
        <ul>
          {menuItemSidebar.map((menu) => {
            const isActive =
              menu.id === 1
                ? location.pathname === "/dashboard"
                : location.pathname === `/dashboard/${menu.router}`;

            return (
              <li
                key={menu.id}
                onClick={() => navigate(menu.router)}
                className={`flex transition-all duration-300 cursor-pointer group items-center rounded-lg py-1.5 px-1 mt-4 ${
                  isActive
                    ? "bg-violet-900 dark:bg-linear-to-br dark:from-violet-950/50 dark:to-violet-900 shadow-md shadow-violet-900/20 dark:shadow-violet-950/40"
                    : "hover:bg-linear-to-br hover:from-transparent hover:to-violet-200 dark:hover:from-transparent dark:hover:to-slate-700"
                } ${collapsed ? "justify-center" : "gap-3"}`}
              >
                <span
                  className={`p-1 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-gray-100 text-violet-900 dark:bg-slate-800 dark:text-white shadow-sm shadow-gray-300/30 dark:shadow-slate-950/50"
                      : "text-violet-900 dark:text-white group-hover:bg-gray-100 dark:group-hover:bg-slate-900 group-hover:shadow-sm group-hover:shadow-violet-200 dark:group-hover:shadow-slate-950/50"
                  }`}
                >
                  <span className="block transition-transform duration-300 group-hover:scale-110">
                    {menu.iconMenu}
                  </span>
                </span>

                {!collapsed && (
                  <span
                    className={`font-bold text-sm transition-colors duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-violet-900 dark:text-slate-300"
                    }`}
                  >
                    {menu.name}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto">
        <button
          type="button"
          onClick={handleLogout}
          className={`flex w-full py-2.5 pt-3 px-2 cursor-pointer rounded-lg transition-all duration-300 hover:bg-rose-500/20 ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <LogOut
            size={18}
            className="transition-transform text-rose-700 dark:text-rose-400 duration-300"
          />

          {!collapsed && (
            <span className="mr-2 font-bold text-sm text-rose-700 dark:text-rose-400">
              خروج
            </span>
          )}
        </button>

        <button
          onClick={toggleCollapse}
          className={`flex w-full py-2.5 pt-3 px-2 border-t border-gray-300 dark:border-slate-800 cursor-pointer transition-all duration-300 ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <span
            className={`${
              collapsed ? "rotate-180" : ""
            } transition-all duration-500`}
          >
            <ChevronRight
              size={18}
              strokeWidth={3}
              className="text-violet-900 dark:text-violet-400 transition-colors duration-300"
            />
          </span>

          {!collapsed && (
            <span className="mr-2 font-bold text-sm text-violet-900 dark:text-slate-300 transition-colors duration-300">
              بستن
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default SideBarContent;
