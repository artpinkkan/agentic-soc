"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview",     href: "/",               icon: "dashboard" },
  { label: "Incidents",    href: "/incidents",      icon: "security" },
  { label: "Intelligence", href: "/intelligence",   icon: "hub" },
  { label: "Automations",  href: "/automations",    icon: "smart_toy" },
  { label: "Agent Fleet",  href: "/agent-fleet",    icon: "memory" },
  { label: "AI Assistant", href: "/ai-assistant",   icon: "psychology" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="bg-[#f4f4f4] fixed left-0 top-12 h-[calc(100vh-48px)] flex flex-col z-40 w-64 border-r border-[#e0e0e0] text-xs font-normal">
      <div className="p-4 border-b border-[#e0e0e0]">
        <p className="text-sm font-bold text-[#161616] uppercase tracking-wider">
          System Operations
        </p>
        <p className="text-[#6f6f6f] text-[10px]">Enterprise Tier</p>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ label, href, icon }) =>
          isActive(href) ? (
            <span
              key={label}
              className="bg-white border-l-4 border-[#0f62fe] text-[#0f62fe] font-semibold flex items-center px-4 py-3 gap-3"
            >
              <span className="material-symbols-outlined text-lg">{icon}</span>
              {label}
            </span>
          ) : (
            <Link
              key={label}
              href={href}
              className="text-[#6f6f6f] flex items-center px-4 py-3 gap-3 hover:bg-[#e0e0e0] transition-all"
            >
              <span className="material-symbols-outlined text-lg">{icon}</span>
              {label}
            </Link>
          )
        )}
      </nav>

      <div className="p-4">
        <button className="w-full bg-[#0f62fe] text-white py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#0043ce] active:scale-[0.98] transition-all">
          <span className="material-symbols-outlined text-sm">add</span>
          Deploy Agent
        </button>
      </div>
    </aside>
  );
}
