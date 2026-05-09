import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import NavSidebar from "@/components/NavSidebar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-manrope",
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
    <html lang="en" className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="h-full antialiased" style={{ backgroundColor: "var(--color-surface)", color: "var(--color-on-surface)" }}>
        <NavSidebar />
        <div className="ml-[52px] h-full relative">
          {children}
        </div>
      </body>
    </html>
  );
}
