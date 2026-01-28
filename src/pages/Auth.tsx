import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type Props = {
  isLogin?: boolean;
};

// Zod validation schema
const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Username là bắt buộc")
    .min(5, "Username phải có ít nhất 5 ký tự"),
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Password là bắt buộc")
    .min(7, "Password phải có ít nhất 7 ký tự"),
  confirmPassword: z.string().min(1, "Xác nhận password là bắt buộc"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password không khớp",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Password là bắt buộc"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

function AuthPage({ isLogin: defaultIsLogin = false }: Props) {
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const nav = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues | LoginFormValues>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: RegisterFormValues | LoginFormValues) => {
    try {
      if (isLogin) {
        // login
        const { data } = await axios.post(
          "http://localhost:3000/login",
          values,
        );
        localStorage.setItem("accessToken", data.accessToken);
        toast.success("Đăng nhập thành công");
        nav("/list");
      } else {
        // register
        await axios.post("http://localhost:3000/register", values);
        toast.success("Đăng ký thành công");
        setIsLogin(true);
        reset();
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          {isLogin ? "Đăng Nhập" : "Đăng Ký"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field - Only for Register */}
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block font-medium mb-1">
                Tên người dùng
              </label>
              <input
                {...register("username")}
                type="text"
                placeholder="Nhập tên người dùng (ít nhất 5 ký tự)"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.username ? "border-red-500" : ""
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Nhập email của bạn"
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block font-medium mb-1">
              Mật khẩu
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder={isLogin ? "Nhập mật khẩu" : "Nhập mật khẩu (ít nhất 7 ký tự)"}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field - Only for Register */}
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block font-medium mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Xác nhận mật khẩu của bạn"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isLogin ? "Đăng Nhập" : "Đăng Ký"}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                reset();
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold ml-2"
            >
              {isLogin ? "Đăng Ký" : "Đăng Nhập"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
