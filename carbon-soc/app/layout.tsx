import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  title: "Carbon SOC | System Operations",
  description: "Agentic Security Operations Center",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className="h-full bg-background text-on-surface overflow-hidden"
        style={{ fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif" }}
      >
        <Suspense>
          <TopNav />
        </Suspense>
        <Suspense>
          <Sidebar />
        </Suspense>
        <main className="ml-64 mt-12 h-[calc(100vh-48px)]">{children}</main>
      </body>
    </html>
  );
}
