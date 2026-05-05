"use client";

import React, { useState, useRef } from "react";
import { X, Upload, Check, Palette } from "lucide-react";
import Image from "next/image";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  currentImage: string;
  onSave: (username: string, image: string, theme: string) => void;
}

const THEMES = [
  { id: "default", name: "Green (Default)", color: "#16a34a" },
  { id: "blue", name: "Ocean Blue", color: "#2563eb" },
  { id: "rose", name: "Rose Pink", color: "#e11d48" },
  { id: "purple", name: "Royal Purple", color: "#9333ea" },
];

export default function SettingsModal({ isOpen, onClose, currentUsername, currentImage, onSave }: SettingsModalProps) {
  const [username, setUsername] = useState(currentUsername);
  const [image, setImage] = useState(currentImage);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("gardenverse_theme") || "default";
    }
    return "default";
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem("gardenverse_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    onSave(username, image, theme);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Palette className="w-5 h-5 text-green-600" />
            ตั้งค่าโปรไฟล์และธีม
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-indigo-50 relative">
                <Image src={image} alt="Profile" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-6 h-6 text-white mb-1" />
                  <span className="text-[10px] text-white font-medium">เปลี่ยนรูป</span>
                </div>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <p className="text-xs text-gray-400">คลิกที่รูปเพื่ออัปโหลดใหม่</p>
          </div>

          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">ชื่อบัญชีผู้ใช้ (Username)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none text-gray-800"
              placeholder="ตั้งชื่อผู้ใช้ของคุณ"
            />
          </div>

          {/* Theme Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 ml-1">เลือกสีธีมของเว็บไซต์</label>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${theme === t.id ? 'border-gray-800 bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: t.color }}>
                    {theme === t.id && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">
            ยกเลิก
          </button>
          <button onClick={handleSave} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors">
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>

      </div>
    </div>
  );
}
