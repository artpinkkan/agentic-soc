"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Dashboard",      href: "/" },
  { label: "Log Explorer",   href: "/log-explorer" },
  { label: "Policy Manager", href: "/policy-manager" },
];

export default function TopNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="bg-white flex justify-between items-center w-full px-4 h-12 z-50 fixed top-0 border-b border-[#e0e0e0] text-sm tracking-tight">
      <div className="flex items-center gap-8">
        <span className="text-lg font-semibold text-[#161616]">Carbon SOC</span>
        <nav className="hidden md:flex gap-6 h-full items-center">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`h-12 flex items-center px-1 transition-colors ${
                isActive(href)
                  ? "text-[#0f62fe] border-b-2 border-[#0f62fe]"
                  : "text-[#6f6f6f] hover:bg-[#f4f4f4]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[#6f6f6f] text-sm">
            search
          </span>
          <input
            className="bg-[#f4f4f4] border-none h-8 w-64 pl-8 text-xs focus:outline-none focus:ring-1 focus:ring-[#0f62fe]"
            placeholder="Search resources..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-1">
          {["dns", "notifications", "settings"].map((icon) => (
            <button
              key={icon}
              className="w-10 h-10 flex items-center justify-center text-[#6f6f6f] hover:bg-[#f4f4f4] transition-colors"
            >
              <span className="material-symbols-outlined">{icon}</span>
            </button>
          ))}
        </div>
        <div className="pl-2 border-l border-[#e0e0e0]">
          <div className="w-8 h-8 rounded-full bg-[#0f62fe] flex items-center justify-center text-white text-xs font-semibold">
            TA
          </div>
        </div>
      </div>
    </header>
  );
}
