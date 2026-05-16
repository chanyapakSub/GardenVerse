"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [identifier, setIdentifier] = useState(""); // For login (email or username)
  const [email, setEmail] = useState(""); // For signup
  const [username, setUsername] = useState(""); // For signup
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const usersRaw = localStorage.getItem("gardenverse_users");
      const users = usersRaw ? JSON.parse(usersRaw) : [];

      if (isLogin) {
        // Handle Login
        const user = users.find((u: any) => 
          (u.email === identifier || u.username === identifier) && u.password === password
        );

        if (user) {
          // Success
          localStorage.setItem("current_user", JSON.stringify({ username: user.username, email: user.email }));
          document.cookie = "is_authenticated=true; path=/";
          router.push("/home");
        } else {
          setError("Username/Email หรือรหัสผ่านไม่ถูกต้อง");
        }
      } else {
        // Handle Sign Up
        // Check if exists
        const exists = users.find((u: any) => u.email === email || u.username === username);
        if (exists) {
          setError("Username หรือ Email นี้ถูกใช้งานแล้ว");
          return;
        }

        // Save new user
        users.push({ username, email, password });
        localStorage.setItem("gardenverse_users", JSON.stringify(users));
        
        setSuccess("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
        setIsLogin(true);
        // Reset fields
        setPassword("");
        setIdentifier(username);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
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

          {isLogin ? (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block ml-1" htmlFor="identifier">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-gray-800 placeholder-gray-400"
                  placeholder="Username หรือ Email"
                  required
                  suppressHydrationWarning
                />
              </div>
            </div>
          ) : (
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
                  required={!isLogin}
                  suppressHydrationWarning
                />
              </div>
            </div>
          )}

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
                suppressHydrationWarning
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 active:scale-[0.98] mt-2"
          >
            <span>{isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</span>
            <ArrowRight size={18} />
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
