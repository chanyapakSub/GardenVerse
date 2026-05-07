"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
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
                  autoComplete="username"
                  suppressHydrationWarning
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-gray-800 placeholder-gray-400"
                  placeholder="johndoe"
                  required={!isLogin}
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
                  autoComplete="username email"
                  suppressHydrationWarning
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-gray-800 placeholder-gray-400"
                  placeholder="Username หรือ Email"
                  required
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
                  autoComplete="email"
                  suppressHydrationWarning
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-gray-800 placeholder-gray-400"
                  placeholder="you@example.com"
                  required={!isLogin}
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
                autoComplete="current-password"
                suppressHydrationWarning
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-gray-800 placeholder-gray-400"
                placeholder="••••••••"
                required
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

        <div className="mt-8">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative px-4 bg-white text-xs text-gray-400 uppercase tracking-wider font-medium">
              หรือ
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              GitHub
            </button>
          </div>
        </div>

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
