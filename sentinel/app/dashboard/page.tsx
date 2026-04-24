"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const alerts = [
  { title: "SSH Brute Force Attack", meta: "192.168.10.45 → auth-server-01", sev: "critical", time: "2m ago", host: "192.168.10.45", src: "EDR", detail: "340 attempts / 2 min", ai: "This IP attempted 340 SSH logins in under 2 minutes — classic brute force. Recommend immediate isolation and password reset on targeted accounts." },
  { title: "Lateral Movement Detected", meta: "AD01 → file-server → db-server", sev: "critical", time: "7m ago", host: "AD01", src: "SIEM", detail: "3 hops detected", ai: "Sequential access across 3 internal hosts in 4 minutes. Matches known APT lateral movement. Contain AD01 immediately." },
  { title: "Unusual Data Exfiltration", meta: "joko@corp.id → external FTP", sev: "high", time: "14m ago", host: "ws-joko-012", src: "DLP", detail: "4.2 GB upload", ai: "4.2 GB uploaded to unrecognized FTP at 2:14 AM — outside working hours. Could be insider threat or compromised account." },
  { title: "Suspicious PowerShell", meta: "CORP\\dev-pc-07 — encoded cmd", sev: "high", time: "31m ago", host: "dev-pc-07", src: "EDR", detail: "Base64 payload", ai: "Encoded PowerShell consistent with download-and-execute patterns. Parent: Word.exe — likely macro malware." },
  { title: "Failed Login Spike", meta: "portal.corp.id — 220 failures", sev: "medium", time: "1h ago", host: "portal.corp.id", src: "WAF", detail: "220 failures / 10 min", ai: "Distributed credential stuffing from 18 IPs. Consider enabling CAPTCHA or rate limiting." },
  { title: "Port Scan from Unknown IP", meta: "45.33.102.77 → DMZ subnet", sev: "low", time: "2h ago", host: "DMZ", src: "Firewall", detail: "1,200 ports scanned", ai: "Reconnaissance scan. No active exploitation detected. Monitor for follow-up activity." },
];

const sevStyle: Record<string, { bar: string; badge: string; text: string; kpiTop: string }> = {
  critical: { bar: "bg-danger",  badge: "bg-danger-light text-danger border border-danger-border",   text: "text-danger",  kpiTop: "border-t-danger" },
  high:     { bar: "bg-warning", badge: "bg-warning-light text-warning border border-warning-border", text: "text-warning", kpiTop: "border-t-warning" },
  medium:   { bar: "bg-info",    badge: "bg-info-light text-info border border-info-border",          text: "text-info",    kpiTop: "" },
  low:      { bar: "bg-success", badge: "bg-success-light text-success border border-success-border", text: "text-success", kpiTop: "" },
};

const sparkBars = [
  { h: "38%", color: "bg-info/40" }, { h: "52%", color: "bg-info/45" },
  { h: "44%", color: "bg-info/50" }, { h: "61%", color: "bg-info/55" },
  { h: "36%", color: "bg-info/45" }, { h: "73%", color: "bg-warning/55" },
  { h: "100%", color: "bg-danger/60" },
];

const categories = [
  { label: "Malware",    pct: 72, color: "bg-danger" },
  { label: "Credential", pct: 55, color: "bg-warning" },
  { label: "Network",    pct: 40, color: "bg-info" },
  { label: "Insider",    pct: 22, color: "bg-purple" },
];

const sources = [
  { name: "Firewall Logs",   ok: true,    note: "Connected" },
  { name: "EDR — Endpoints", ok: true,    note: "Connected" },
  { name: "Cloud / AWS",     ok: true,    note: "Connected" },
  { name: "Active Directory",ok: false,   note: "Lag 2m" },
  { name: "Threat Intel Feed",ok: true,   note: "Connected" },
];

const timeline = [
  { color: "bg-primary", msg: "Auto-triaged 47 alerts — 44 closed as false positives", time: "14:30" },
  { color: "bg-danger",  msg: "Playbook executed — host 192.168.10.45 isolated", time: "14:22" },
  { color: "bg-warning", msg: "New IOC submitted to threat intel database", time: "14:15" },
  { color: "bg-info",    msg: "Weekly report auto-generated and sent", time: "13:58" },
];

export default function DashboardPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setClock(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())} WIB`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Topbar */}
      <header className="glass-bar sticky top-0 z-40 h-[52px] flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-primary" style={{ clipPath: "polygon(50% 0%,100% 22%,100% 68%,50% 100%,0% 68%,0% 22%)" }} />
          <div>
            <span className="text-[15px] font-semibold text-slate-900">Shannon Sentinel</span>
            <span className="text-[11px] text-slate-400 font-mono ml-2">SOC Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-success-light/70 backdrop-blur-sm border border-success-border/60 rounded-full text-[11px] font-medium text-success">
            <span className="w-1.5 h-1.5 rounded-full bg-success" style={{ animation: "blink 1.4s infinite" }} />
            Live
          </div>
          <span className="font-mono text-[12px] text-slate-500">{clock}</span>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4 space-y-4">

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Open Incidents", value: "12",    sub: "↑ 3 from yesterday",  subColor: "text-danger",  topColor: "border-t-danger",   colr: "text-danger" },
            { label: "MTTD",           value: "4.2m",  sub: "✓ Target < 5 min",    subColor: "text-primary", topColor: "border-t-warning",  colr: "text-warning" },
            { label: "MTTR",           value: "18m",   sub: "↓ 22% this week",     subColor: "text-success", topColor: "border-t-success",  colr: "text-success" },
            { label: "Alerts 24h",     value: "1,847", sub: "92% auto-triaged",    subColor: "text-primary", topColor: "border-t-primary",  colr: "text-primary" },
          ].map((kpi) => (
            <div key={kpi.label} className={`glass rounded-xl p-4 border-t-2 ${kpi.topColor} hover:shadow-md transition-shadow`}>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">{kpi.label}</div>
              <div className={`text-3xl font-semibold font-mono leading-none mb-1.5 ${kpi.colr}`}>{kpi.value}</div>
              <div className={`text-[11px] ${kpi.subColor}`}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-[1fr_320px] gap-3">

          {/* Alert feed */}
          <div className="glass rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/50">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Active Alert Feed</span>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-danger-light/70 text-danger border border-danger-border/50 rounded-full">6 open</span>
            </div>
            <div className="overflow-y-auto scroll-thin" style={{ maxHeight: 420 }}>
              {alerts.map((a, i) => (
                <div key={i}>
                  <div
                    className="grid gap-3 items-center px-4 py-3 cursor-pointer transition-colors hover:bg-white/40 border-b border-white/40"
                    style={{ gridTemplateColumns: "3px 1fr auto auto" }}
                    onClick={() => setExpanded(expanded === i ? null : i)}
                  >
                    <div className={`${sevStyle[a.sev].bar} rounded-sm self-stretch`} />
                    <div>
                      <div className="text-[13px] font-medium text-slate-800 mb-0.5">{a.title}</div>
                      <div className="text-[11px] font-mono text-slate-400">{a.meta}</div>
                    </div>
                    <span className={`text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded ${sevStyle[a.sev].badge}`}>{a.sev.toUpperCase()}</span>
                    <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">{a.time}</span>
                  </div>
                  {expanded === i && (
                    <div className="px-4 py-3.5 bg-white/30 backdrop-blur-sm border-b border-white/40 animate-fade-up">
                      <div className="grid grid-cols-4 gap-3 mb-3">
                        {[["Host", a.host], ["Source", a.src], ["Severity", a.sev.toUpperCase()], ["Detail", a.detail]].map(([k, v]) => (
                          <div key={k}>
                            <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">{k}</div>
                            <div className={`text-[11px] font-mono ${k === "Severity" ? sevStyle[a.sev].text : "text-slate-700"}`}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-primary-light/60 backdrop-blur-sm border-l-2 border-primary rounded-r-lg px-3 py-2.5 mb-3">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-primary mb-1">AI Analysis</div>
                        <p className="text-[12px] text-slate-600 leading-relaxed">{a.ai}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-[11px] font-medium px-3 py-1.5 glass-btn rounded-lg text-danger border-danger-border/50">Isolate Host</button>
                        <button className="text-[11px] font-medium px-3 py-1.5 glass-btn rounded-lg text-slate-600">Block IP</button>
                        <Link href="/investigate" className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-primary-light/70 text-primary border border-primary-border/50 hover:bg-primary-mid/50 transition-colors">Open in AI Chat ↗</Link>
                        <button className="text-[11px] font-medium px-3 py-1.5 glass-btn rounded-lg text-slate-500 ml-auto" onClick={(e) => { e.stopPropagation(); setExpanded(null); }}>Close ✕</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* AI bar */}
            <Link href="/investigate" className="flex items-center gap-3 px-4 py-2.5 bg-white/25 hover:bg-primary-light/50 border-t border-white/40 transition-colors group">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0">AI</div>
              <span className="flex-1 text-[12px] text-slate-400 group-hover:text-slate-600 transition-colors">Ask AI about any alert…</span>
              <span className="text-primary text-[13px]">↗</span>
            </Link>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-3">

            {/* Sparkline */}
            <div className="glass rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/50">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Alert Volume — 7 Days</span>
                <span className="text-[11px] font-medium text-danger">↑ 38% today</span>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-end gap-1" style={{ height: 52 }}>
                  {sparkBars.map((b, i) => (
                    <div key={i} className={`flex-1 rounded-t-sm ${b.color} transition-opacity hover:opacity-100`} style={{ height: b.h }} />
                  ))}
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] font-mono text-slate-400">
                  <span>18 Apr</span><span>25 Apr</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="glass rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/50">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Alert Categories</span>
              </div>
              <div className="px-4 py-2.5 space-y-2">
                {categories.map((c) => (
                  <div key={c.label} className="flex items-center gap-2.5">
                    <span className="text-[11px] text-slate-600 w-16 shrink-0">{c.label}</span>
                    <div className="flex-1 bg-white/40 rounded-full h-1.5">
                      <div className={`${c.color} h-1.5 rounded-full`} style={{ width: `${c.pct}%` }} />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 w-8 text-right">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data sources */}
            <div className="glass rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/50">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Data Sources</span>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-success-light/70 text-success border border-success-border/50 rounded-full">5 active</span>
              </div>
              {sources.map((s) => (
                <div key={s.name} className="flex items-center justify-between px-4 py-2 border-b border-white/30 last:border-0 text-[12px]">
                  <span className="font-medium text-slate-700">{s.name}</span>
                  <div className={`flex items-center gap-1.5 font-mono text-[11px] ${s.ok ? "text-success" : "text-warning"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.ok ? "bg-success" : "bg-warning"}`} />
                    {s.note}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Activity */}
            <div className="glass rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/50">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">AI Agent Activity</span>
              </div>
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-3 px-4 py-2.5 border-b border-white/30 last:border-0">
                  <div className={`w-2 h-2 rounded-full ${t.color} shrink-0 mt-1.5 ring-2 ring-white`} />
                  <div>
                    <p className="text-[12px] text-slate-700 leading-snug mb-0.5">{t.msg}</p>
                    <span className="text-[10px] font-mono text-slate-400">{t.time}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
