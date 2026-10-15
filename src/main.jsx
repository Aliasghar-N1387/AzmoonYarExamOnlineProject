import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { AlertProvider } from "./components/custom/AlertContext";

import "./assets/css/style.css";
import router from "./router/index.jsx";

import { ToastProvider } from "./components/custom/Toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </ToastProvider>
  </StrictMode>,
);
