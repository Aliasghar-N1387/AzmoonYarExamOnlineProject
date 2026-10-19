import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import auth from "../../api/auth";

const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessTokenExpireTime");
  localStorage.removeItem("refreshTokenExpireTime");
  localStorage.removeItem("user");
};

const ProtectedRoute = () => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [sessionVersion, setSessionVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer;

    const refreshAccessToken = async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        clearAuth();

        if (!cancelled) {
          setAuthenticated(false);
          setChecking(false);
        }
        return;
      }

      try {
        const response = await auth.postRefreshTokenForExpierd(refreshToken);

        const result = await response.json().catch(() => null);

        if (
          !response.ok ||
          result?.success !== true ||
          !result?.data?.accessToken ||
          !result?.data?.refreshToken
        ) {
          throw new Error("Refresh token is invalid or expired");
        }

        const {
          accessToken,
          refreshToken: newRefreshToken,
          accessTokenExpireTime,
          refreshTokenExpireTime,
          user,
        } = result.data;

        // توکن‌های جدید را ذخیره کن
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        if (accessTokenExpireTime) {
          localStorage.setItem("accessTokenExpireTime", accessTokenExpireTime);
        }

        if (refreshTokenExpireTime) {
          localStorage.setItem(
            "refreshTokenExpireTime",
            refreshTokenExpireTime,
          );
        }

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }

        if (!cancelled) {
          setAuthenticated(true);
          setChecking(false);
          setSessionVersion((version) => version + 1);
        }
      } catch (error) {
        console.error("Refresh token error:", error);

        clearAuth();

        if (!cancelled) {
          setAuthenticated(false);
          setChecking(false);
        }
      }
    };

    const accessToken = localStorage.getItem("accessToken");
    const expireTime = localStorage.getItem("accessTokenExpireTime");

    if (!accessToken || !expireTime) {
      clearAuth();
      setAuthenticated(false);
      setChecking(false);
      return;
    }

    const expireAt = new Date(expireTime).getTime();

    if (Number.isNaN(expireAt)) {
      clearAuth();
      setAuthenticated(false);
      setChecking(false);
      return;
    }

    setChecking(true);

    // یک دقیقه قبل از انقضا تمدید کن
    const refreshIn = expireAt - Date.now() - 60_000;

    if (refreshIn <= 0) {
      refreshAccessToken();
    } else {
      setAuthenticated(true);
      setChecking(false);

      timer = setTimeout(() => {
        refreshAccessToken();
      }, refreshIn);
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sessionVersion]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        در حال بررسی و تمدید نشست...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
