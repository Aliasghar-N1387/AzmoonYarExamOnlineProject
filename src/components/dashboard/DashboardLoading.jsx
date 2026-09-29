import React from "react";
import LogoApp from "../../assets/img/LogoApp.png";

function DashboardLoading() {
  return (
    <div
      dir="rtl"
      className="min-h-190 flex items-center justify-center bg-violet-50/50 dark:bg-slate-950"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo Loading */}
        <div className="relative flex items-center justify-center">
          {/* Glow پشت لوگو */}
          <div className="absolute w-32 h-32 rounded-full bg-violet-400/20 blur-2xl animate-pulse" />

          {/* حلقه‌ی بیرونی */}
          <div className="absolute w-28 h-28 rounded-full border-2 border-violet-200/70" />

          {/* حلقه‌ی متحرک */}
          <div className="w-28 h-28 rounded-full border-4 border-transparent border-t-violet-700 border-l-violet-500 animate-spin" />

          {/* لوگوی سایت */}
          <div className="absolute w-20 h-20 rounded-full bg-linear-to-b from-violet-500 via-violet-700 to-violet-950 flex items-center justify-center shadow-xl shadow-violet-300/40 animate-pulse p-3">
            <img
              src={LogoApp}
              alt="LogoApp"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* متن */}
        <div className="text-center">
          <p className="text-violet-900 font-bold text-lg">در حال آماده‌سازی</p>

          <p className="text-gray-400 text-sm mt-2">لطفاً چند لحظه صبر کنید</p>
        </div>

        {/* سه نقطه‌ی متحرک */}
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" />

          <span
            className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />

          <span
            className="w-2 h-2 rounded-full bg-violet-600 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardLoading;
