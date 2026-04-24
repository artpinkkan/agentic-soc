"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="10" y="1" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="1" y="10" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="10" y="10" width="7" height="7" rx="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/investigate",
    label: "Investigate",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 4C2 3.45 2.45 3 3 3H15C15.55 3 16 3.45 16 4V11C16 11.55 15.55 12 15 12H6L2 15V4Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/triage",
    label: "Triage",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="4" y="4" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6.5" y="6.5" width="5" height="5" rx="1" fill="currentColor" />
        <line x1="4" y1="7" x2="2" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4" y1="11" x2="2" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="7" y1="4" x2="7" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="11" y1="4" x2="11" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="7" y1="14" x2="7" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="11" y1="14" x2="11" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/reports",
    label: "Reports",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <line x1="6" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="6" y1="10" x2="12" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="6" y1="13" x2="9" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function NavSidebar() {
  const pathname = usePathname();

  return (
    <nav className="glass-nav fixed left-0 top-0 bottom-0 w-[52px] flex flex-col items-center py-3.5 gap-1 z-50">
      {/* Logo mark */}
      <Link href="/dashboard" className="mb-3.5 shrink-0 block">
        <div
          className="w-7 h-7 bg-primary"
          style={{ clipPath: "polygon(50% 0%,100% 22%,100% 68%,50% 100%,0% 68%,0% 22%)" }}
        />
      </Link>

      {navItems.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={`relative group w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 ${
              active
                ? "bg-primary/12 text-primary shadow-sm"
                : "text-slate-400 hover:bg-white/60 hover:text-slate-600"
            }`}
          >
            {item.icon}
            {/* Tooltip */}
            <span className="pointer-events-none absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 glass-heavy rounded-lg text-[11px] font-medium text-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-sm">
              {item.label}
            </span>
          </Link>
        );
      })}

      <div className="flex-1" />

      {/* Settings */}
      <button
        title="Settings"
        className="relative group w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white/60 hover:text-slate-600 transition-all duration-150"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 2v1.5M9 14.5V16M2 9h1.5M14.5 9H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3.93 3.93l1.06 1.06M13.01 13.01l1.06 1.06M3.93 14.07l1.06-1.06M13.01 4.99l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="pointer-events-none absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 glass-heavy rounded-lg text-[11px] font-medium text-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-sm">
          Settings
        </span>
      </button>
    </nav>
  );
}
