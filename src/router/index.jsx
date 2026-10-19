import { Navigate, createBrowserRouter } from "react-router";

import MainLayout from "../layouts/MainLayout";

import FormContent from "../views/login/FormContent";

import DashboardContent from "../views/dashboard/DashboardContent";
import BookContent from "../views/book/BookContent";
import QuestionContent from "../views/questions/QuestionContent";
import ExamContent from "../views/exams/ExamContent";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";
import MessagesPage from "../components/header/MessagesPage";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <FormContent />,
      },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <DashboardContent />,
          },
          {
            path: "books",
            element: <BookContent />,
          },
          {
            path: "exams",
            element: <ExamContent />,
          },
          {
            path: "questions",
            element: <QuestionContent />,
          },
          {
            path: "messages",
            element: <MessagesPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
