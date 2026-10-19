import { Navigate, Outlet } from "react-router";

const PublicRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  const expireTime = localStorage.getItem("accessTokenExpireTime");

  if (!accessToken || !expireTime) {
    return <Outlet />;
  }

  // بررسی تاریخ انقضا
  const expireAt = new Date(expireTime).getTime();

  if (Number.isNaN(expireAt)) {
    return <Outlet />;
    
  }

  // اگر توکن هنوز معتبر است
  if (Date.now() < expireAt) {
    return <Navigate to="/dashboard" replace />;
  }

  // اگر توکن منقضی شده، اجازه ورود به Login وجود دارد
  return <Outlet />;
};

export default PublicRoute;
