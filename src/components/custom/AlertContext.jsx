import { createContext, useContext, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alertData, setAlertData] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const alert = ({
    type = "info",
    title = "توجه",
    message = "",
    confirmText = "باشه",
    cancelText = "خیر",
    onConfirm,
    onCancel,
    showCancel = false,
  }) => {
    setIsClosing(false);

    setAlertData({
      type,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
      showCancel,
    });
  };

  const closeAlert = () => {
    if (isClosing) return;

    setIsClosing(true);

    setTimeout(() => {
      setAlertData(null);
      setIsClosing(false);
    }, 250);
  };

  const handleConfirm = () => {
    alertData?.onConfirm?.();
    closeAlert();
  };

  const handleCancel = () => {
    alertData?.onCancel?.();
    closeAlert();
  };

  return (
    <AlertContext.Provider value={{ alert, closeAlert }}>
      {children}

      {alertData && (
        <GlobalAlert
          {...alertData}
          isClosing={isClosing}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onClose={closeAlert}
        />
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlert باید داخل AlertProvider استفاده شود.");
  }

  return context;
}

function GlobalAlert({
  type,
  title,
  message,
  confirmText,
  cancelText,
  showCancel,
  isClosing,
  onConfirm,
  onCancel,
  onClose,
}) {
  const styles = {
    success: {
      icon: CheckCircle2,
      iconBox:
        "bg-emerald-50 text-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-400",
      glow: "bg-emerald-400/20",
      line: "from-emerald-400 via-emerald-500 to-emerald-400",
      button: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25",
    },

    error: {
      icon: XCircle,
      iconBox:
        "bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400",
      glow: "bg-rose-400/20",
      line: "from-rose-400 via-rose-500 to-rose-400",
      button: "bg-rose-500 hover:bg-rose-600 shadow-rose-500/25",
    },

    warning: {
      icon: AlertTriangle,
      iconBox:
        "bg-amber-50 text-amber-500 dark:bg-amber-950/50 dark:text-amber-400",
      glow: "bg-amber-400/20",
      line: "from-amber-400 via-amber-500 to-amber-400",
      button: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25",
    },

    info: {
      icon: Info,
      iconBox:
        "bg-violet-50 text-violet-500 dark:bg-violet-950/50 dark:text-violet-400",
      glow: "bg-violet-400/20",
      line: "from-violet-400 via-indigo-500 to-violet-400",
      button: "bg-violet-600 hover:bg-violet-700 shadow-violet-500/25",
    },

    confirm: {
      icon: AlertTriangle,
      iconBox:
        "bg-violet-50 text-violet-500 dark:bg-violet-950/50 dark:text-violet-400",
      glow: "bg-violet-400/20",
      line: "from-violet-400 via-indigo-500 to-violet-400",
      button: "bg-violet-600 hover:bg-violet-700 shadow-violet-500/25",
    },
  };

  const currentStyle = styles[type] || styles.info;
  const Icon = currentStyle.icon;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isClosing ? "bg-slate-950/0 backdrop-blur-0" : "bg-slate-950/40 backdrop-blur-sm"}`}
      dir="rtl"
    >
      {/* Background click */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        aria-label="بستن"
      />

      {/* Main Glow */}
      <div
        className={`pointer-events-none absolute h-72 w-72 rounded-full blur-3xl transition-all duration-500 ${currentStyle.glow} ${isClosing ? "scale-50 opacity-0" : "scale-100 opacity-100"}`}
      />

      {/* Alert */}
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/60 bg-white/95 shadow-[0_25px_80px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/95 ${isClosing ? "animate-[alertExit_0.25s_ease-in_forwards]" : "animate-[alertEnter_0.3s_ease-out_forwards]"}`}
      >
        {/* Animated Top Line */}
        <div
          className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${currentStyle.line} transition-opacity duration-200 ${isClosing ? "opacity-0" : "animate-pulse"}`}
        />

        {/* Decorative Background */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-900/20" />

        <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-indigo-200/20 blur-3xl dark:bg-indigo-900/20" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100/80 text-slate-400 transition-all duration-200 hover:rotate-90 hover:bg-slate-200 hover:text-slate-700 active:scale-90 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:hover:text-white"
          aria-label="بستن"
        >
          <X size={17} />
        </button>

        <div className="relative px-7 pb-7 pt-8">
          {/* Icon */}
          <div className="relative mb-6 flex justify-center">
            {/* Icon Glow */}
            <div
              className={`absolute h-20 w-20 rounded-full blur-2xl ${currentStyle.glow} ${isClosing ? "animate-[iconGlowExit_0.25s_ease-in_forwards]" : "animate-[iconGlowEnter_0.4s_ease-out_forwards]"}`}
            />

            {/* Icon Box */}
            <div
              className={`relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm ${currentStyle.iconBox} ${isClosing ? "animate-[iconExit_0.25s_ease-in_forwards]" : "animate-[alertIcon_0.5s_ease-out_forwards]"}`}
            >
              <Icon size={30} strokeWidth={1.8} />
            </div>
          </div>

          {/* Content */}
          <div className="relative text-center">
            <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">
              {title}
            </h3>

            {message && (
              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">
                {message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="relative mt-8 flex gap-3">
            {showCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 active:translate-y-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {cancelText}
              </button>
            )}

            <button
              type="button"
              onClick={onConfirm}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98] ${currentStyle.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes alertEnter {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.9);
            filter: blur(4px);
          }

          60% {
            opacity: 1;
            transform: translateY(-2px) scale(1.015);
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes alertExit {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }

          100% {
            opacity: 0;
            transform: translateY(16px) scale(0.9);
            filter: blur(4px);
          }
        }

        @keyframes alertIcon {
          0% {
            opacity: 0;
            transform: scale(0.4) rotate(-12deg);
          }

          60% {
            opacity: 1;
            transform: scale(1.12) rotate(3deg);
          }

          100% {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }

        @keyframes iconExit {
          0% {
            opacity: 1;
            transform: scale(1) rotate(0);
          }

          100% {
            opacity: 0;
            transform: scale(0.6) rotate(8deg);
          }
        }

        @keyframes iconGlowEnter {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }

          60% {
            opacity: 1;
            transform: scale(1.15);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes iconGlowExit {
          0% {
            opacity: 1;
            transform: scale(1);
          }

          100% {
            opacity: 0;
            transform: scale(0.5);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
