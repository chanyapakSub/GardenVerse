import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // ปิดระบบ Cache รูปภาพของ Next.js ทำให้เปลี่ยนรูปแล้วอัปเดตทันที
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
