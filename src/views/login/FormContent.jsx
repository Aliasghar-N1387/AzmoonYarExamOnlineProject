import { useEffect, useState } from "react";
import logo from "../../assets/img/LogoApp.png";
import pictureSystem from "../../assets/img/img-system.png";
import FormSingIn from "../../components/login/FormSingIn";
import FormSingUp from "../../components/login/FormSingUp";
import picSingUp from "../../assets/img/img-SingUp.png";

import {
  ClipboardCheck,
  BookOpen,
  ChartNoAxesCombined,
  ShieldCheck,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

function FormContent() {
  const [activeForm, setActiveForm] = useState("singin");
  const [alert, setAlert] = useState(false);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    AOS.refresh();
  }, [activeForm]);

  return (
    <div>
      <div className="flex h-screen">
        <div className="relative overflow-hidden bg-linear-to-br from-purple-900 via-violet-800 to-purple-900 flex flex-col justify-center items-center pr-150">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-violet-950/30 rounded-full blur-3xl animate-pulse" />

          <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" />

          <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />

          <div
            className="relative z-10 flex flex-col items-center"
            data-aos="zoom-in"
          >
            <div className="flex">
              <img src={logo} alt="Logo" className="w-35 h-30 object-contain" />

              <div className="py-4">
                <h1 className="font-[Vazir] text-white text-5xl font-extrabold">
                  آزمون یار
                </h1>

                <p className="font-[Vazir] p-5 text-gray-300 text-2xl font-bold">
                  AzmoonYar
                </p>
              </div>
              {/* Floating Glass Cards */}
              <div className="absolute ml-235 inset-0 pointer-events-none hidden xl:block z-20">
                {/* Card 1 */}
                <div
                  className="floating-card floating-1 absolute top-[9%] right-10 w-64 rounded-2xl border border-white/25 bg-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.15)] px-5 py-4
    "
                >
                  <div className="flex items-center gap-4" dir="rtl">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 shadow-[0_0_20px_rgba(255,255,255,0.15)]
      "
                    >
                      <ClipboardCheck className="text-white" size={29} />
                    </div>

                    <div>
                      <h3 className="font-[Vazir] text-white font-bold text-sm">
                        ساخت آزمون حرفه‌ای
                      </h3>

                      <p className="font-[Vazir] text-white/65 text-[11px] mt-1 leading-5">
                        طراحی آزمون‌های استاندارد در چند دقیقه
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="floating-card floating-2 absolute top-[32%] -left-50 w-64 rounded-2xl border border-white/25 bg-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.15)] px-5 py-4">
                  <div className="flex items-center gap-4" dir="rtl">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <BookOpen className="text-white" size={29} />
                    </div>

                    <div>
                      <h3 className="font-[Vazir] text-white font-bold text-sm">
                        بانک سوالات هوشمند
                      </h3>

                      <p className="font-[Vazir] text-white/65 text-[11px] mt-1 leading-5">
                        دسترسی به سوالات طبقه‌بندی‌شده و به‌روز
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="floating-card floating-3 absolute top-[53%] right-10 w-64 rounded-2xl border border-white/25 bg-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.15)] px-5 py-4">
                  <div className="flex items-center gap-4" dir="rtl">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <ChartNoAxesCombined className="text-white" size={29} />
                    </div>

                    <div>
                      <h3 className="font-[Vazir] text-white font-bold text-sm">
                        گزارش و تحلیل دقیق
                      </h3>

                      <p className="font-[Vazir] text-white/65 text-[11px] mt-1 leading-5">
                        بررسی عملکرد و پیشرفت با نمودارهای حرفه‌ای
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="floating-card floating-4 absolute top-[73%] -left-50 w-64 rounded-2xl border border-white/25 bg-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.15)] px-5 py-4">
                  <div className="flex items-center gap-4" dir="rtl">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ">
                      <ShieldCheck className="text-white" size={29} />
                    </div>

                    <div>
                      <h3 className="font-[Vazir] text-white font-bold text-sm">
                        امن و قابل اعتماد
                      </h3>

                      <p className="font-[Vazir] text-white/65 text-[11px] mt-1 leading-5">
                        حفظ امنیت اطلاعات با بالاترین استانداردها
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-10 pt-5" data-aos-delay="150">
              <p className="font-[Vazir] text-white text-lg flex items-center justify-center">
                پلتفرم هوشمند مدیریت سوالات و ساخت امتحان
              </p>

              <p className="font-[Vazir] text-white text-lg flex items-center justify-center">
                ویژه معلم‌های حرفه‌ای
              </p>
            </div>

            {activeForm === "singin" && (
              <div data-aos="zoom-in" data-aos-delay="250">
                <img
                  src={pictureSystem}
                  alt="System"
                  className="w-170 h-110 object-contain pl-15"
                />
              </div>
            )}
            {activeForm === "singup" && (
              <div data-aos="zoom-in" data-aos-delay="250">
                <img
                  src={picSingUp}
                  alt="System"
                  className="w-170 h-110 object-contain pl-15"
                />
              </div>
            )}
          </div>
        </div>
        <div className="relative" data-aos="fade-left" data-aos-delay="150">
          {activeForm === "singin" && (
            <FormSingIn
              title="ورود به آزمون یار"
              subtitle="برای ادامه وارد حساب کاربری خود شوید"
              onSingUp={() => setActiveForm("singup")}
            />
          )}

          {activeForm === "singup" && (
            <FormSingUp
              title="ثبت نام"
              subtitle="برای ایجاد حساب کاربری، اطلاعات خود را وارد کنید"
              onLogin={() => setActiveForm("singin")}
              onSuccess={() => {
                setAlert(true);

                setTimeout(() => {
                  setAlert(false);
                  setActiveForm("singin");
                }, 2500);
              }}
            />
          )}
        </div>
      </div>
      {alert && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-md animate-[fadeIn_0.35s_ease-out]"
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/60 bg-white p-8 text-center shadow-[0_25px_80px_-20px_rgba(0,0,0,0.35)] sm:p-10 animate-[modalIn_0.45s_cubic-bezier(0.16,1,0.3,1)]">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-green-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-emerald-400/10 blur-3xl" />

            {/* Success Icon */}
            <div className="relative mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-linear-to-br from-green-50 to-emerald-100 ring-8 ring-green-50 animate-[iconPop_0.5s_ease-out_0.15s_both]">
              <div className="flex size-16 items-center justify-center rounded-full bg-linear-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
                <svg
                  className="size-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="relative font-[Vazir] text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              ثبت‌نام با موفقیت انجام شد
            </h2>

            <p className="relative mt-4 font-[Vazir] text-sm font-medium leading-7 text-slate-500 sm:text-base">
              حساب کاربری شما با موفقیت ایجاد شد.
            </p>

            {/* Redirect message */}
            <div className="relative mt-5 flex items-center justify-center gap-2">
              <span className="size-2 animate-pulse rounded-full bg-green-500" />
              <p className="font-[Vazir] text-xs text-slate-400 sm:text-sm">
                در حال انتقال به صفحه ورود...
              </p>
            </div>

            {/* Progress */}
            <div className="relative mt-7 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-full origin-right animate-[progress_2.5s_linear] rounded-full bg-linear-to-l from-green-500 via-emerald-500 to-teal-500" />
            </div>

            <p className="relative mt-3 font-[Vazir] text-[11px] text-slate-400">
              لطفاً چند لحظه صبر کنید
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormContent;
