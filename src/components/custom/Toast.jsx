import React, { createContext, useCallback, useContext, useState } from "react";

import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const toastConfig = {
  success: {
    icon: CheckCircle2,
    title: "موفق",
    iconClass: "text-emerald-500",
    progressClass: "bg-emerald-500",
  },

  error: {
    icon: XCircle,
    title: "خطا",
    iconClass: "text-red-500",
    progressClass: "bg-red-500",
  },

  warning: {
    icon: AlertTriangle,
    title: "هشدار",
    iconClass: "text-amber-500",
    progressClass: "bg-amber-500",
  },

  info: {
    icon: Info,
    title: "اطلاع‌رسانی",
    iconClass: "text-violet-600",
    progressClass: "bg-violet-600",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = "info", message, title, duration = 4000, action }) => {
      const id = Date.now() + Math.random();

      setToasts((prev) => [
        ...prev,
        {
          id,
          type,
          message,
          title,
          duration,
          action,
        },
      ]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast],
  );

  const toast = {
    show: showToast,

    success: (message, options = {}) =>
      showToast({
        type: "success",
        message,
        ...options,
      }),

    error: (message, options = {}) =>
      showToast({
        type: "error",
        message,
        ...options,
      }),

    warning: (message, options = {}) =>
      showToast({
        type: "warning",
        message,
        ...options,
      }),

    info: (message, options = {}) =>
      showToast({
        type: "info",
        message,
        ...options,
      }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast Container */}
      <div
        dir="rtl"
        className="fixed top-5 left-5 z-50 flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-3"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const config = toastConfig[toast.type] || toastConfig.info;
  const Icon = config.icon;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop-blur-md animate-[toastIn_0.35s_ease-out]">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 ${config.iconClass}`}
        >
          <Icon size={22} strokeWidth={2.2} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 text-right">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-extrabold text-gray-800">
              {toast.title || config.title}
            </p>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>

          <p className="mt-1 text-xs leading-6 text-gray-500">
            {toast.message}
          </p>

          {/* Optional Action */}
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action.onClick?.();
                onClose();
              }}
              className="mt-2 text-xs font-bold text-violet-700 transition hover:text-violet-900"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {toast.duration > 0 && (
        <div
          className={`absolute bottom-0 right-0 h-1 ${config.progressClass} animate-toastProgress`}
          style={{
            width: "100%",
            transformOrigin: "right",
            animationDuration: `${toast.duration}ms`,
          }}
        />
      )}
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast باید داخل ToastProvider استفاده شود");
  }

  return context;
}
