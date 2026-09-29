import { Mail, Phone, User, Lock } from "lucide-react";
import { useState } from "react";
import BtnDataForm from "./BtnDataForm";
import GoogleIcon from "../../assets/img/Google-icon.png";
import loginCrud from "../../api/loginCrud";
import { useToast } from "../custom/Toast";
import auth from "../../api/auth";

function FormSingUp({ title, subtitle, onLogin, onSuccess }) {
  const toast = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);

  const btnSingUp = [
    {
      id: 1,
      name: "firstName",
      lable: "نام",
      backIcon: <User className="size-5" />,
    },
    {
      id: 2,
      name: "lastName",
      lable: "نام خانوادگی",
      backIcon: <User className="size-5" />,
    },
    {
      id: 3,
      name: "phoneNumber",
      lable: "شماره موبایل",
      backIcon: <Phone className="size-5" />,
    },
    {
      id: 4,
      name: "email",
      lable: "ایمیل ( اختیاری )",
      backIcon: <Mail className="size-5" />,
    },
    {
      id: 5,
      name: "password",
      lable: "رمز عبور",
      type: "password",
      backIcon: <Lock className="size-5" />,
    },
    {
      id: 6,
      name: "confirmPassword",
      lable: "تکرار رمز عبور",
      type: "password",
      backIcon: <Lock className="size-5" />,
    },
  ];

  const handleSignUp = async () => {
    if (loading) return;

    try {
      setLoading(true);

      if (formData.password !== formData.confirmPassword) {
        toast.error("رمز عبور و تکرار رمز عبور یکسان نیستند", {
          title: "خطای رمز عبور",
          duration: 6000,
        });
        return;
      }

      const data = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      console.log("Register Payload:", data);

      const response = await auth.registerUserSingUp(data);
      const result = await response.json().catch(() => null);

      console.log("Register Response:", result);

      if (!response.ok) {
        if (result?.error) {
          const errors = Object.values(result.error).flat();

          errors.forEach((errorMessage) => {
            toast.error(errorMessage, {
              title: "خطای اعتبارسنجی",
              duration: 6000,
            });
          });

          return;
        }

        if (result?.message) {
          toast.error(result.message, {
            title: "ثبت نام ناموفق",
            duration: 6000,
          });

          return;
        }

        toast.error("ثبت نام انجام نشد", {
          title: "ثبت نام ناموفق",
          duration: 6000,
        });

        return;
      }

      // ثبت نام موفق
      localStorage.setItem(
        "user",
        JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
        }),
      );

      onSuccess?.();
      // انتقال به صفحه ورود
      setTimeout(() => {
        onLogin?.();
      }, 2500);
    } catch (error) {
      console.error("Register Error:", error);

      toast.error(error.message || "خطایی هنگام ثبت نام رخ داد", {
        title: "ثبت نام ناموفق",
        duration: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="absolute -left-50 top-10 bg-white rounded-3xl w-150 min-h-200 p-7 shadow-[0_0_45px_rgba(0,0,0,0.3)]">
      <div className="w-full">
        {/* Title */}
        <div className="py-2 flex items-center justify-center flex-col">
          <h1 className="font-[Vazir] text-gray-900 text-2xl font-extrabold">
            {title}
          </h1>

          <p className="font-[Vazir] p-3 text-gray-500 text-md font-bold">
            {subtitle}
          </p>
        </div>

        {/* Inputs */}
        <div className="px-2">
          {btnSingUp.map((txt) => (
            <BtnDataForm
              key={txt.id}
              name={txt.name}
              lable={txt.lable}
              backIcon={txt.backIcon}
              type={txt.type}
              value={formData[txt.name]}
              showPassword={
                txt.type === "password" ? showPassword[txt.name] : false
              }
              onTogglePassword={
                txt.type === "password"
                  ? () => togglePassword(txt.name)
                  : undefined
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

        {/* Rules */}
        <div className="px-2 py-5 flex justify-end items-center">
          <div className="flex items-center">
            <label
              htmlFor="rules"
              className="font-[Vazir] font-bold pr-3 text-sm text-gray-700"
            >
              <a className="text-violet-800 cursor-pointer hover:underline">
                شرایط و قوانین
              </a>{" "}
              را می‌پذیرم
            </label>

            <input
              id="rules"
              type="checkbox"
              className="size-4 cursor-pointer accent-violet-800"
            />
          </div>
        </div>

        {/* Signup button */}
        <div className="px-2">
          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="relative w-full h-12 cursor-pointer rounded-xl font-[Vazir] bg-violet-800 text-lg font-bold text-white flex items-center justify-center overflow-hidden transition-all duration-300 hover:bg-violet-900 hover:shadow-lg hover:shadow-violet-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-90
            "
          >
            <span
              className={`absolute transition-all duration-300 ${loading ? "opacity-0 scale-75 translate-y-3" : "opacity-100 scale-100 translate-y-0"} `}
            >
              ثبت نام
            </span>

            <div
              className={`flex items-center gap-3 transition-all duration-300 ${loading ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            >
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />

              <span>...در حال ثبت نام</span>
            </div>
          </button>
        </div>

        {/* Login link */}
        <div className="flex items-center justify-center pt-10">
          <span className="font-[Vazir] font-bold text-gray-700">
            قبلاً حساب کاربری دارید؟{" "}
            <a
              onClick={onLogin}
              className="font-[Vazir] font-bold text-violet-800 text-sm px-1 underline cursor-pointer"
            >
              وارد شوید
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default FormSingUp;
