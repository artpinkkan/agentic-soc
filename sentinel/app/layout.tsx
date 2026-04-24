import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NavSidebar from "@/components/NavSidebar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Shannon Sentinel",
  description: "Agentic Security Operations Center",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="h-full bg-gradient-to-br from-slate-100 via-sky-50/60 to-teal-50/80 antialiased">
        {/* Decorative ambient orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
          <div
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(13,148,136,0.09) 0%, transparent 68%)" }}
          />
          <div
            className="absolute top-1/2 -left-40 w-80 h-80 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 68%)" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 68%)" }}
          />
        </div>

        <NavSidebar />

        <div className="ml-[52px] h-full relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
