"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowRight, User, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // For signup only
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (isLogin) {
        // ===== LOGIN =====
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
          return;
        }

        if (data.session) {
          router.push("/home");
        }
      } else {
        // ===== SIGN UP =====
        if (!username.trim()) {
          setError("กรุณากรอก Username");
          return;
        }

        // ตรวจสอบว่า username ซ้ำมั้ย
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", username.trim())
          .single();

        if (existingProfile) {
          setError("Username นี้ถูกใช้งานแล้ว กรุณาเลือก Username อื่น");
          return;
        }

        // สมัครสมาชิกผ่าน Supabase Auth
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: username.trim() },
          },
        });

        if (signUpError) {
          if (signUpError.message.includes("already registered")) {
            setError("อีเมลนี้ถูกใช้งานแล้ว");
          } else {
            setError(signUpError.message);
          }
          return;
        }

        // บันทึก username ลง profiles table
        if (data.user) {
          const { error: profileError } = await supabase.from("profiles").insert({
            id: data.user.id,
            username: username.trim(),
          });

          if (profileError && !profileError.message.includes("duplicate")) {
            console.warn("Profile insert warning:", profileError.message);
          }
        }

        setSuccess("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
        setIsLogin(true);
        setPassword("");
        setEmail(email); // คง email ไว้
        setUsername("");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-emerald-200/40 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-green-200/40 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 relative z-10 border border-gray-100">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-2">
            <Image
              src="/images/logo_main.png"
              alt="GardenVerse Logo"
              width={140}
              height={140}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to GardenVerse</h1>
          <p className="text-gray-500 mt-2 text-center text-sm">
            {isLogin ? "เข้าสู่ระบบเพื่อจัดการสวนของคุณ" : "สมัครสมาชิกเพื่อเริ่มต้นปลูกต้นไม้"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-xl border border-green-100 text-center">
            {success}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleAuth}>
          {/* Username field (signup only) */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block ml-1" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-gray-800 placeholder-gray-400"
                  placeholder="johndoe"
                  required={!isLogin}
                  suppressHydrationWarning
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 block ml-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-gray-800 placeholder-gray-400"
                placeholder="you@example.com"
                required
                suppressHydrationWarning
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-medium text-gray-700 block" htmlFor="password">
                Password
              </label>
              {isLogin && (
                <Link href="#" className="text-xs text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                  ลืมรหัสผ่าน?
                </Link>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-gray-800 placeholder-gray-400"
                placeholder="••••••••"
                required
                minLength={6}
                suppressHydrationWarning
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 active:scale-[0.98] mt-2"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <span>{isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          {isLogin ? "ยังไม่มีบัญชีใช่ไหม? " : "มีบัญชีอยู่แล้วใช่ไหม? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
            }}
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {isLogin ? "สร้างบัญชีใหม่" : "เข้าสู่ระบบ"}
          </button>
        </p>
      </div>
    </div>
  );
}
