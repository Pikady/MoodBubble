"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createClient } from '@/lib/supabase/client';

interface RegisterFormProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function RegisterForm({
  title = "创建账号",
  description = "注册你的情绪泡泡账号",
  className = ""
}: RegisterFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("请输入邮箱");
      return false;
    }

    // 更严格的邮箱验证，符合 Supabase 的要求
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError("请输入有效的邮箱地址（如：user@example.com）");
      return false;
    }

    // 邮箱长度限制
    if (email.length > 255) {
      setEmailError("邮箱地址过长");
      return false;
    }

    setEmailError("");
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("请输入密码");
      return false;
    }

    if (password.length < 6) {
      setPasswordError("密码至少需要6个字符");
      return false;
    }

    if (password.includes(' ')) {
      setPasswordError("密码不能包含空格");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError("请确认密码");
      return false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("两次密码输入不一致");
      return false;
    }

    setConfirmPasswordError("");
    return true;
  };

  const validateForm = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);

    return isEmailValid && isPasswordValid && isConfirmPasswordValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success("注册成功！请使用新账号登录");
        console.log("注册成功，用户信息:", data.user);

        // 注册成功后跳转到登录页面
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      }
    } catch (error: any) {
      console.error("注册错误:", error);

      // 更好的错误处理，特别是针对 AuthApiError
      let errorMessage = "注册失败，请重试";

      if (error.name === 'AuthApiError') {
        // 处理 Supabase Auth API 错误
        if (error.message.includes('is invalid') || error.message.includes('Invalid email')) {
          errorMessage = "邮箱地址格式不正确，请检查后重新输入";
        } else if (error.message.includes('User already registered')) {
          errorMessage = "该邮箱已被注册，请直接登录";
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = "密码至少需要6个字符";
        } else if (error.message.includes('Password is too short')) {
          errorMessage = "密码太短，请输入至少6位密码";
        } else if (error.message.includes('Password contains whitespace')) {
          errorMessage = "密码不能包含空格";
        } else if (error.message.includes('Email rate limit exceeded')) {
          errorMessage = "发送验证邮件过于频繁，请稍后再试";
        } else {
          errorMessage = `注册失败：${error.message}`;
        }
      } else if (error.message) {
        // 处理其他类型的错误
        if (error.message.includes('User already registered')) {
          errorMessage = "该邮箱已被注册";
        } else if (error.message.includes('Invalid email')) {
          errorMessage = "请输入有效的邮箱地址";
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = "密码至少需要6个字符";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`w-full max-w-sm ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              邮箱
            </label>
            <Input
              id="email"
              type="email"
              placeholder="请输入邮箱（如：user@example.com）"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              onBlur={() => validateEmail(email)}
              required
              className={`h-11 ${emailError ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {emailError && (
              <p className="text-sm text-red-600 mt-1">{emailError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              密码
            </label>
            <Input
              id="password"
              type="password"
              placeholder="请输入密码（至少6位）"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              onBlur={() => validatePassword(password)}
              required
              minLength={6}
              className={`h-11 ${passwordError ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {passwordError && (
              <p className="text-sm text-red-600 mt-1">{passwordError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              确认密码
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                validateConfirmPassword(password, e.target.value);
              }}
              onBlur={() => validateConfirmPassword(password, confirmPassword)}
              required
              minLength={6}
              className={`h-11 ${confirmPasswordError ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {confirmPasswordError && (
              <p className="text-sm text-red-600 mt-1">{confirmPasswordError}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11"
            disabled={isLoading}
          >
            {isLoading ? "注册中..." : "注册"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            已有账号？{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="text-blue-600 hover:underline font-medium"
            >
              立即登录
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}