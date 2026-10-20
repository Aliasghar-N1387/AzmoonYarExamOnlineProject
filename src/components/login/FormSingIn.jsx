import BtnDataForm from "./BtnDataForm";
import { useNavigate } from "react-router";
import { Phone, Lock } from "lucide-react";
import GoogleIcon from "../../assets/img/Google-icon.png";
import logo from "../../assets/img/LogoApp.png";
import { useState } from "react";
import loginCrud from "../../api/loginCrud";
import { useToast } from "../custom/Toast";
import auth from "../../api/auth";
import { GoogleLogin } from "@react-oauth/google";

function FormSingIn({ title, subtitle, onSingUp }) {
  const toast = useToast();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const btnSingIn = [
    {
      id: 1,
      name: "phoneNumber",
      lable: "شماره موبایل",
      backIcon: <Phone className="size-5" />,
    },
    {
      id: 2,
      name: "password",
      lable: "رمز عبور",
      type: "password",
      backIcon: <Lock className="size-5" />,
    },
  ];

  const setToken = async () => {
    if (loading) return;

    try {
      setLoading(true);

      if (!formData.phoneNumber.trim()) {
        toast.error("شماره موبایل را وارد کنید", {
          title: "خطا",
          duration: 5000,
        });
        return;
      }

      if (!formData.password) {
        toast.error("رمز عبور را وارد کنید", {
          title: "خطا",
          duration: 5000,
        });
        return;
      }

      const data = {
        login: formData.phoneNumber.trim(),
        password: formData.password,
      };

      const response = await auth.getTokenLogin(data);
      const result = await response.json().catch(() => null);

      console.log("Login Status:", response.status);
      console.log("Login Response:", result);

      // لاگین موفق
      if (response.status === 200 && result?.success === true) {
        const {
          accessToken,
          refreshToken,
          accessTokenExpireTime,
          refreshTokenExpireTime,
          user,
        } = result.data;

        // ذخیره توکن‌ها
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // ذخیره زمان انقضا
        localStorage.setItem("accessTokenExpireTime", accessTokenExpireTime);

        localStorage.setItem("refreshTokenExpireTime", refreshTokenExpireTime);

        // ذخیره اطلاعات کاربر
        localStorage.setItem("user", JSON.stringify(user));

        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);

        toast.success("ورود با موفقیت انجام شد", {
          title: "خوش آمدید 🎉",
          duration: 1500,
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);

        return;
      }

      // خطا
      if (result?.error) {
        const errors = Object.values(result.error).flat();

        errors.forEach((errorMessage) => {
          toast.error(errorMessage, {
            title: "خطای ورود",
            duration: 6000,
          });
        });

        return;
      }

      toast.error("شماره موبایل یا رمز عبور صحیح نیست", {
        title: "ورود ناموفق",
        duration: 6000,
      });
    } catch (error) {
      console.error("Login Error:", error);

      toast.error(error.message || "خطایی هنگام ورود رخ داد", {
        title: "خطای ورود",
        duration: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  <GoogleLogin
    onSuccess={async (credentialResponse) => {
      try {
        setLoading(true);

        const response = await loginCrud.loginWithGoogle({
          idtoken: credentialResponse.credential,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || "ورود با گوگل ناموفق بود");
        }

        console.log("Google login response:", result);

        if (result.success && result.data) {
          const {
            accessToken,
            refreshToken,
            accessTokenExpireTime,
            refreshTokenExpireTime,
            user,
          } = result.data;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          if (accessTokenExpireTime) {
            localStorage.setItem(
              "accessTokenExpireTime",
              accessTokenExpireTime,
            );
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

          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast.error(error.message || "خطا در ورود با گوگل", {
          title: "خطای ورود",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    }}
    onError={() => {
      toast.error("دریافت توکن گوگل ناموفق بود", {
        title: "خطای ورود",
        duration: 5000,
      });
    }}
  />;

  const handleGoogleSuccess = async (credentialResponse) => {
    if (loading) return;

    try {
      setLoading(true);

      const idToken = credentialResponse.credential;

      if (!idToken) {
        throw new Error("توکن گوگل دریافت نشد");
      }

      const response = await loginCrud.loginWithGoogle({
        idtoken: idToken,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success || !result?.data) {
        throw new Error(result?.message || "ورود با گوگل ناموفق بود");
      }

      const {
        accessToken,
        refreshToken,
        accessTokenExpireTime,
        refreshTokenExpireTime,
        user,
      } = result.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      if (accessTokenExpireTime) {
        localStorage.setItem("accessTokenExpireTime", accessTokenExpireTime);
      }

      if (refreshTokenExpireTime) {
        localStorage.setItem("refreshTokenExpireTime", refreshTokenExpireTime);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      toast.success("ورود با موفقیت انجام شد", {
        title: "خوش آمدید",
        duration: 1500,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);

      toast.error(error.message || "خطا در ورود با گوگل", {
        title: "خطای ورود",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    flow: "implicit",

    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);

        // این توکن access_token است، نه id_token
        console.log(
          "Google access token received:",
          !!tokenResponse.access_token,
        );

        // برای اعتبارسنجی با GoogleJsonWebSignature
        // نباید access_token را ارسال کنیم.
      } catch (error) {
        console.error("Google login error:", error);
        toast.error("خطا در ورود با گوگل");
      } finally {
        setLoading(false);
      }
    },

    onError: () => {
      toast.error("دریافت توکن گوگل ناموفق بود");
    },
  });

  return (
    <div className="absolute -left-50 top-10 bg-white rounded-3xl w-150 h-200 p-7 shadow-[0_0_45px_rgba(0,0,0,0.3)]">
      <div className="w-full">
        {/* Title */}
        <div className="py-4 flex items-center justify-center flex-col">
          <h1 className="font-[Vazir] text-gray-900 text-2xl font-extrabold">
            {title}
          </h1>

          <p className="font-[Vazir] p-5 text-gray-500 text-md font-bold">
            {subtitle}
          </p>
        </div>

        {/* Inputs */}
        <div className="px-2">
          {btnSingIn.map((txt) => (
            <BtnDataForm
              key={txt.id}
              name={txt.name}
              lable={txt.lable}
              backIcon={txt.backIcon}
              type={txt.type}
              value={formData[txt.name]}
              showPassword={txt.type === "password" ? showPassword : false}
              onTogglePassword={
                txt.type === "password" ? togglePassword : undefined
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [txt.name]: e.target.value,
                }))
              }
            />
          ))}
        </div>

        {/* Forgot / Remember */}
        <div className="px-2 py-6 flex justify-between items-center">
          <div>
            <a className="font-[Vazir] font-bold text-violet-800 text-sm cursor-pointer transition-all hover:underline">
              فراموشی رمز عبور ؟
            </a>
          </div>

          <div className="flex items-center">
            <label className="font-[Vazir] font-bold pr-3 text-sm">
              مرا به خاطر بسپار
            </label>

            <input
              type="checkbox"
              className="size-4 cursor-pointer accent-violet-800"
            />
          </div>
        </div>

        {/* Login button */}
        <div className="px-2">
          <button
            type="button"
            onClick={setToken}
            disabled={loading}
            className="relative w-full h-14 cursor-pointer rounded-xl font-[Vazir] bg-violet-800 text-lg font-bold text-white flex items-center justify-center overflow-hidden transition-all duration-300 hover:bg-violet-900 hover:shadow-lg hover:shadow-violet-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-90
            "
          >
            <span
              className={`
                absolute
                transition-all duration-300
                ${
                  loading
                    ? "opacity-0 scale-75 translate-y-3"
                    : "opacity-100 scale-100 translate-y-0"
                }
              `}
            >
              ورود
            </span>

            <div
              className={`flex items-center gap-3 transition-all duration-300 ${loading ? "opacity-100 scale-100" : "opacity-0 scale-75"}
              `}
            >
              <span
                className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin
                "
              />

              <span>...در حال ورود</span>
            </div>
          </button>

          {/* Google */}

          <div className="px-2 py-10 relative">
            <hr className="border-gray-300" />

            <p className="font-[Vazir] bg-white absolute left-1/2 -translate-x-1/2 top-8 px-5 text-gray-600">
              یا
            </p>
          </div>

          <div className="relative flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                toast.error("دریافت توکن گوگل ناموفق بود", {
                  title: "خطای ورود",
                  duration: 5000,
                });
              }}
              useOneTap={false}
              text="signin_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="400"
            />
          </div>
        </div>

        {/* Signup */}
        <div className="flex items-center justify-center py-10">
          <span className="font-bold">
            حساب کاربری ندارید ؟{" "}
            <a
              onClick={onSingUp}
              className="font-[Vazir] font-bold text-violet-800 text-sm px-1 underline cursor-pointer
              "
            >
              ثبت نام
            </a>
            کنید
          </span>
        </div>

        {/* Logo */}
        <div className="flex py-8 items-center justify-center">
          <div
            className="w-14 h-12 bg-violet-800"
            style={{
              WebkitMaskImage: `url(${logo})`,
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              WebkitMaskSize: "contain",
              maskImage: `url(${logo})`,
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "contain",
            }}
          />

          <div className="mt-2">
            <h1 className="font-[Vazir] text-gray-700 text-lg font-extrabold">
              آزمون یار
            </h1>

            <p className="font-[Vazir] text-gray-400 text-xs font-bold">
              AzmoonYar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormSingIn;
