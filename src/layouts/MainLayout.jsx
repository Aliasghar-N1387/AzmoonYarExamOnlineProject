import React, { useEffect, useState } from "react";
import SideBarContent from "../views/sidebar/SideBarContent";
import HeaderContent from "../views/header/HeaderContent";
import { Outlet } from "react-router";

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true",
  );

  const sidebarClasses = collapsed ? "w-[70px]" : "w-[240px]";
  const contentClasses = collapsed ? "mr-[70px]" : "mr-[240px]";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <aside
        className={`fixed top-0 right-0 h-screen z-50 border-l border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm transition-all duration-300 ${sidebarClasses}`}
      >
        <SideBarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          darkMode={darkMode}
        />
      </aside>

      <div className={`transition-all duration-300 ${contentClasses}`}>
        <header
          className={`fixed w-full top-0 right-0 h-16 z-40 bg-white dark:bg-slate-950 transition-all duration-300 ${contentClasses}`}
        >
          <HeaderContent darkMode={darkMode} setDarkMode={setDarkMode} />
        </header>

        <section className="pt-20 pb-6 min-h-screen overflow-y-auto bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
          <Outlet  />
        </section>
      </div>
    </div>
  );
}

export default MainLayout;
