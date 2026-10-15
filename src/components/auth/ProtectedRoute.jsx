import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";

const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessTokenExpireTime");
  localStorage.removeItem("refreshTokenExpireTime");
  localStorage.removeItem("user");
};

const ProtectedRoute = () => {
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  const expireTime = localStorage.getItem("accessTokenExpireTime");

  useEffect(() => {
    if (!accessToken || !expireTime) {
      return;
    }

    const expireAt = new Date(expireTime).getTime();

    if (Number.isNaN(expireAt)) {
      console.error("Invalid accessTokenExpireTime:", expireTime);

      clearAuth();
      navigate("/login", { replace: true });
      return;
    }

    const remainingTime = expireAt - Date.now();

    console.log("Token expires at:", new Date(expireAt));
    console.log("Remaining time:", remainingTime);

    if (remainingTime <= 0) {
      clearAuth();
      navigate("/login", { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      clearAuth();
      navigate("/login", { replace: true });
    }, remainingTime);

    return () => {
      clearTimeout(timer);
    };
  }, [accessToken, expireTime, navigate]);

  // توکن وجود ندارد
  if (!accessToken || !expireTime) {
    return <Navigate to="/login" replace />;
  }

  const expireAt = new Date(expireTime).getTime();

  // تاریخ انقضا نامعتبر است
  if (Number.isNaN(expireAt)) {
    return <Navigate to="/login" replace />;
  }

  // توکن منقضی شده
  if (Date.now() >= expireAt) {
    clearAuth();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
