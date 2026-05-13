"use client";

import React, { useState } from "react";
import Sidebar from "@/components/organisms/Sidebar";
import Navbar from "@/components/organisms/Navbar";
import { Upload, Camera, AlertCircle, CheckCircle2, ChevronRight, RefreshCw, Info, History, Trash2, Activity } from "lucide-react";
import Image from "next/image";
import { useStore } from "@/store/useStore";

export default function DiseaseDetectPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    prediction: string;
    confidence: number;
    advice: string;
    class_id?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { addDetectionHistory, detectionHistory } = useStore();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !previewUrl) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "ไม่สามารถติดต่อเซิร์ฟเวอร์ AI ได้");
      }

      const data = await response.json();
      const newResult = {
        prediction: data.prediction,
        confidence: data.confidence,
        advice: data.advice,
        class_id: data.class_id,
      };
      
      setResult(newResult);
      addDetectionHistory({
        ...newResult,
        imageUrl: previewUrl,
      });

    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการวิเคราะห์ กรุณาลองใหม่อีกครั้ง");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 lg:p-8">
        <div className="flex gap-6 h-full">
          {/* Left Sidebar */}
          <div className="w-[280px] shrink-0 hidden lg:block">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">ตรวจสุขภาพพืชด้วย AI</h1>
                <p className="text-gray-500">อัปโหลดรูปใบพืชของคุณเพื่อให้ AI ช่วยวิเคราะห์หาโรคและแนวทางการรักษาอย่างแม่นยำ</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Upload Section */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                    
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-green-600" />
                      ถ่ายภาพหรืออัปโหลดใบพืช
                    </h2>

                    <div 
                      className={`
                        border-2 border-dashed rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center min-h-[350px]
                        ${previewUrl ? 'border-green-200 bg-green-50/20' : 'border-gray-200 hover:border-green-400 hover:bg-gray-50'}
                      `}
                    >
                      {previewUrl ? (
                        <div className="relative w-full max-w-[400px] aspect-square rounded-2xl overflow-hidden shadow-2xl border-8 border-white bg-gray-50">
                          <Image 
                            src={previewUrl} 
                            alt="Preview" 
                            fill 
                            className="object-contain"
                          />
                          <div className="absolute inset-0 bg-black/10"></div>
                          <button 
                            onClick={() => { setSelectedImage(null); setPreviewUrl(null); setResult(null); }}
                            className="absolute top-4 right-4 bg-white/90 backdrop-blur text-red-600 p-2 rounded-xl hover:bg-white transition-all shadow-lg active:scale-95"
                            title="ลบรูปภาพ"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="bg-green-50 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform duration-500">
                            <Upload className="w-10 h-10 text-green-500" />
                          </div>
                          <p className="text-gray-600 font-medium mb-1">ลากรูปมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
                          <p className="text-xs text-gray-400 mb-6 text-center">รองรับไฟล์ JPG, PNG ความละเอียดสูงเพื่อความแม่นยำ</p>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            className="hidden" 
                            id="image-upload"
                          />
                          <label 
                            htmlFor="image-upload"
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-2xl font-bold cursor-pointer transition-all shadow-xl shadow-green-900/10 active:scale-[0.98]"
                          >
                            เลือกรูปภาพจากเครื่อง
                          </label>
                        </>
                      )}
                    </div>

                    <button
                      onClick={handleAnalyze}
                      disabled={!selectedImage || loading}
                      className={`
                        w-full mt-8 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all
                        ${!selectedImage || loading 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-green-600 text-white hover:bg-green-700 shadow-2xl shadow-green-900/20 active:scale-[0.97]'}
                      `}
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-6 h-6 animate-spin" />
                          กำลังประมวลผลด้วย AI...
                        </>
                      ) : (
                        <>
                          เริ่มการวิเคราะห์สุขภาพพืช
                          <ChevronRight className="w-6 h-6" />
                        </>
                      )}
                    </button>

                    {error && (
                      <div className="mt-6 bg-red-50 border border-red-100 p-5 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-red-800 font-bold mb-1">เกิดข้อผิดพลาด</p>
                          <p className="text-red-600/80">{error}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Result Section */}
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[400px] flex flex-col sticky top-24">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      ผลการวิเคราะห์ล่าสุด
                    </h2>

                    {!result && !loading && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                        <div className="bg-gray-50 p-8 rounded-full mb-6">
                          <Activity className="w-12 h-12 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-medium">รอการอัปโหลดพื่อประเมินอาการ</p>
                      </div>
                    )}

                    {loading && (
                      <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-10">
                        <div className="relative">
                          <div className="w-24 h-24 border-[6px] border-green-50 border-t-green-600 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-green-100" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-green-700 font-black text-xl animate-pulse mb-2">Deep Scanning...</p>
                          <p className="text-gray-400 text-sm max-w-[200px]">AI กำลังตรวจสอบลวดลายและความผิดปกติบนใบพืช</p>
                        </div>
                      </div>
                    )}

                    {result && (
                      <div className="animate-in fade-in zoom-in-95 duration-500 space-y-8 flex-1">
                        <div className="bg-green-50/50 rounded-3xl p-8 text-center border border-green-100/50">
                          <div className="inline-flex items-center justify-center bg-white p-4 rounded-3xl mb-4 shadow-sm">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                          </div>
                          <h3 className="text-xs text-green-700 font-black mb-2 uppercase tracking-[0.2em]">
                            {result.class_id !== undefined ? `Class ${result.class_id} วินิจฉัยพบ` : "วินิจฉัยพบ"}
                          </h3>
                          <div className="text-2xl font-black text-gray-900 mb-4 leading-tight">{result.prediction}</div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-bold text-green-700 uppercase tracking-wider mb-1">
                              <span>ความมั่นใจ (Confidence)</span>
                              <span>{result.confidence}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-white rounded-full overflow-hidden border border-green-100">
                              <div 
                                className="h-full bg-green-500 transition-all duration-1000 ease-out" 
                                style={{ width: `${result.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50">
                          <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            คำแนะนำการรักษา
                          </h4>
                          <p className="text-blue-800/80 text-sm leading-relaxed font-medium">
                            {result.advice}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <History className="w-7 h-7 text-green-600" />
                    ประวัติการตรวจสอบ
                  </h2>
                  <span className="text-sm font-bold text-gray-400 bg-gray-100 px-4 py-1.5 rounded-full">
                    ทั้งหมด {detectionHistory.length} รายการ
                  </span>
                </div>

                {detectionHistory.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {detectionHistory.map((item) => (
                      <div key={item.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image 
                            src={item.imageUrl} 
                            alt={item.prediction} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                            {item.timestamp}
                          </div>
                          <div className="absolute bottom-4 right-4 bg-green-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                            CONFIDENCE {item.confidence}%
                          </div>
                        </div>
                        <div className="p-6">
                          <h4 className="text-lg font-black text-gray-900 mb-2 line-clamp-1">{item.prediction}</h4>
                          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{item.advice}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-200 p-20 text-center">
                    <History className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                    <p className="text-gray-400 font-bold text-lg">ยังไม่มีประวัติการวิเคราะห์</p>
                    <p className="text-gray-300 text-sm">ข้อมูลที่วิเคราะห์จะปรากฏที่นี่เพื่อการติดตามผลย้อนหลัง</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
