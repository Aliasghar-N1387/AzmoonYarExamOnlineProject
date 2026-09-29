import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

function Modal({ header, content, footer, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);

    setTimeout(() => {
      onClose?.();
    }, 250);
  };

  return (
    <div
      className={`fixed  inset-0 z-50 flex items-center justify-center p-5 transition-all duration-300 ease-out
        ${isVisible ? "bg-slate-900/30 backdrop-blur-[3px]" : "bg-slate-900/0 backdrop-blur-0"}`}
      dir="rtl"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className={`w-full max-w-4xl overflow-hidden rounded-3xl bg-white dark:bg-slate-900 dark:border dark:border-white shadow-2xl transform-gpu transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-[0.96] opacity-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100  px-7 py-5">
          <div className="flex-1">{header}</div>

          <button
            type="button"
            onClick={handleClose}
            className="mr-5 flex size-9 items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:rotate-90 hover:bg-gray-100 dark:hover:bg-transparent dark:hover:text-white hover:text-gray-700 active:scale-90"
          >
            <X size={22} />
          </button>
        </div>
        {/* Content */}
        <div className="latest-scroll px-2 h-100 overflow-auto">
          {content}
        </div>
        {/* Footer */}
        <div className="border-t border-gray-100 bg-white dark:bg-slate-900 px-7 py-5">
          {footer}
        </div>
      </div>
    </div>
  );
}

export default Modal;
