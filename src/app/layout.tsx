import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const promptFont = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "My Garden - Grow with happiness",
  description: "GardenVerse management dashboard",
  icons: {
    icon: '/images/logo_gardenverse.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${promptFont.variable} antialiased`}>
      <body className="font-sans bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
