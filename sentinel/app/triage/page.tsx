"use client";

import { useState, useEffect, useRef } from "react";

const feedPool = [
  { name: "Failed login — admin portal",    meta: "10.0.0.22",          type: "fp",    label: "False positive" },
  { name: "Suspicious PowerShell",           meta: "dev-pc-07",          type: "esc",   label: "Escalated →" },
  { name: "Port scan internal",              meta: "192.168.1.105",      type: "watch", label: "Watching" },
  { name: "DNS beacon pattern detected",     meta: "ws-finance-04",      type: "esc",   label: "Escalated →" },
  { name: "Large file download",             meta: "joko@corp.id 2.1 GB",type: "watch", label: "Watching" },
  { name: "Repeated firewall block",         meta: "5.196.33.1:8080",    type: "auto",  label: "Auto-blocked" },
  { name: "Antivirus scan triggered",        meta: "hr-laptop-09",       type: "fp",    label: "False positive" },
  { name: "Login from new country",          meta: "budi@corp.id — SG",  type: "esc",   label: "Escalated →" },
  { name: "SQL error spike",                 meta: "db-prod-01",         type: "fp",    label: "False positive" },
  { name: "Outbound IRC traffic",            meta: "10.0.0.88:6667",     type: "esc",   label: "Escalated →" },
];

const typeStyle: Record<string, { bar: string; badge: string }> = {
  fp:    { bar: "bg-success",  badge: "bg-success-light text-success border border-success-border/50" },
  esc:   { bar: "bg-danger",   badge: "bg-danger-light text-danger border border-danger-border/50" },
  watch: { bar: "bg-warning",  badge: "bg-warning-light text-warning border border-warning-border/50" },
  auto:  { bar: "bg-primary",  badge: "bg-primary-light text-primary border border-primary-border/50" },
};

const playbooks = [
  {
    name: "SSH Brute Force Response", trigger: "≥50 SSH failures / 5 min", icon: "🔒", status: "running",
    steps: [{ l: "Capture offending IP", s: "done" }, { l: "Block at firewall", s: "done" }, { l: "Isolate source host", s: "active" }, { l: "Create incident ticket", s: "wait" }, { l: "Notify Tier 2", s: "wait" }],
  },
  {
    name: "Malware Containment", trigger: "EDR: malware confirmed", icon: "🦠", status: "active",
    steps: [{ l: "Kill malicious process", s: "wait" }, { l: "Quarantine host", s: "wait" }, { l: "Extract IOCs", s: "wait" }, { l: "Scan related hosts", s: "wait" }],
  },
  {
    name: "Credential Compromise", trigger: "Geo anomaly + unusual login", icon: "🔑", status: "active",
    steps: [{ l: "Force password reset", s: "wait" }, { l: "Revoke active sessions", s: "wait" }, { l: "Enable MFA prompt", s: "wait" }, { l: "Alert account owner", s: "wait" }],
  },
];

interface FeedItem { name: string; meta: string; type: string; label: string; }

export default function TriagePage() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [openPb, setOpenPb] = useState<number | null>(0);
  const [counts, setCounts] = useState({ ingested: 0, processed: 0, closed: 0, watching: 0, escalated: 0 });
  const poolIdx = useRef(0);

  useEffect(() => {
    // Pre-fill feed
    const initial: FeedItem[] = [];
    for (let i = 0; i < 7; i++) {
      initial.unshift(feedPool[poolIdx.current++ % feedPool.length]);
    }
    setFeed(initial);

    // Auto-add items
    const feedTimer = setInterval(() => {
      setFeed((prev) => [feedPool[poolIdx.current++ % feedPool.length], ...prev.slice(0, 9)]);
    }, 3200);

    // Animate counters
    const targets = [1847, 1847, 1702, 133, 12];
    const keys = ["ingested", "processed", "closed", "watching", "escalated"] as const;
    const steps = targets.map((t) => Math.ceil(t / 28));
    const curr = [0, 0, 0, 0, 0];
    const countTimer = setInterval(() => {
      let done = true;
      targets.forEach((t, i) => {
        if (curr[i] < t) { curr[i] = Math.min(curr[i] + steps[i], t); done = false; }
      });
      setCounts({ ingested: curr[0], processed: curr[1], closed: curr[2], watching: curr[3], escalated: curr[4] });
      if (done) clearInterval(countTimer);
    }, 35);

    return () => { clearInterval(feedTimer); clearInterval(countTimer); };
  }, []);

  function simulate() {
    setFeed((prev) => [feedPool[poolIdx.current++ % feedPool.length], ...prev.slice(0, 9)]);
  }

  const pipeline = [
    { id: "ingested",  icon: "📥", label: "Ingested",     sub: "raw events",          count: counts.ingested,  color: "text-slate-600" },
    { id: "processed", icon: "🤖", label: "AI Processed", sub: "scored & correlated",  count: counts.processed, color: "text-purple" },
    { id: "closed",    icon: "✅", label: "Auto-closed",  sub: "false positives",      count: counts.closed,    color: "text-success" },
    { id: "watching",  icon: "👁",  label: "Watching",     sub: "low confidence",       count: counts.watching,  color: "text-warning" },
    { id: "escalated", icon: "🚨", label: "Escalated",    sub: "to analyst",           count: counts.escalated, color: "text-danger" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Topbar */}
      <header className="glass-bar sticky top-0 z-40 h-[52px] flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary" style={{ clipPath: "polygon(50% 0%,100% 22%,100% 68%,50% 100%,0% 68%,0% 22%)" }} />
          <span className="text-[15px] font-semibold text-slate-900">Shannon Sentinel</span>
          <span className="text-slate-300 mx-1">/</span>
          <span className="text-[13px] font-medium text-slate-500">Agentic Triage &amp; Playbook Engine</span>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 bg-purple-light/70 text-purple border border-purple-border/50 rounded-full">Automation</span>
      </header>

      <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4 space-y-4">

        {/* Pipeline */}
        <div className="glass rounded-xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">AI Triage Pipeline — Today</p>
          <div className="grid grid-cols-5 gap-4">
            {pipeline.map((p, i) => (
              <div key={p.id} className="flex flex-col items-center text-center relative">
                {i < pipeline.length - 1 && (
                  <div className="absolute left-full top-5 w-full -translate-x-1/2 flex items-center justify-center pointer-events-none">
                    <span className="text-slate-300 text-sm">→</span>
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-white/50 border border-white/70 flex items-center justify-center text-xl mb-2.5">{p.icon}</div>
                <div className={`text-2xl font-bold font-mono leading-none mb-1 ${p.color}`}>{p.count.toLocaleString()}</div>
                <div className="text-[12px] font-semibold text-slate-700 mb-0.5">{p.label}</div>
                <div className="text-[10px] text-slate-400">{p.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-col */}
        <div className="grid grid-cols-2 gap-4">

          {/* Triage feed */}
          <div className="glass rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/50">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Live Triage Feed</span>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" style={{ animation: "blink 1.3s infinite" }} />
                  Processing
                </div>
                <button onClick={simulate} className="text-[11px] font-mono px-2.5 py-1 bg-primary-light/70 text-primary border border-primary-border/50 rounded-lg hover:bg-primary-mid/50 transition-colors">
                  + Simulate
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scroll-thin" style={{ maxHeight: 300 }}>
              {feed.map((item, i) => (
                <div key={i} className="grid gap-3 items-center px-4 py-2.5 border-b border-white/30 last:border-0 animate-slide-in" style={{ gridTemplateColumns: "3px 1fr auto" }}>
                  <div className={`${typeStyle[item.type].bar} rounded-sm self-stretch`} />
                  <div>
                    <div className="text-[12px] font-medium text-slate-700 mb-0.5">{item.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{item.meta}</div>
                  </div>
                  <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full ${typeStyle[item.type].badge}`}>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 border-t border-white/40">
              {[
                { val: "92%", label: "Auto rate", color: "text-success" },
                { val: "0.3s", label: "Avg triage", color: "text-primary" },
                { val: "12",   label: "Escalated",  color: "text-danger" },
              ].map((s) => (
                <div key={s.label} className="py-3 text-center border-r border-white/40 last:border-0">
                  <div className={`text-xl font-bold font-mono leading-none ${s.color}`}>{s.val}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Playbook engine */}
          <div className="glass rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/50">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Playbook Engine</span>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-success-light/70 text-success border border-success-border/50 rounded-full">3 configured</span>
            </div>
            {playbooks.map((pb, i) => (
              <div key={i} className="border-b border-white/30 last:border-0">
                <button
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/30 transition-colors text-left"
                  onClick={() => setOpenPb(openPb === i ? null : i)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/50 border border-white/60 flex items-center justify-center text-base shrink-0">{pb.icon}</div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-800">{pb.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">Trigger: {pb.trigger}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[11px] font-mono font-medium px-2.5 py-1 rounded-full ${pb.status === "running" ? "bg-primary-light/70 text-primary border border-primary-border/50" : "bg-success-light/70 text-success border border-success-border/50"}`}>
                      ● {pb.status === "running" ? "Running" : "Active"}
                    </span>
                    <span className={`text-[11px] text-slate-400 transition-transform ${openPb === i ? "rotate-180" : ""}`}>▼</span>
                  </div>
                </button>
                {openPb === i && (
                  <div className="px-4 pb-3 pl-[52px] space-y-1 animate-fade-up">
                    {pb.steps.map((step, j) => (
                      <div key={j} className="flex items-center gap-2.5 py-1">
                        <div className={`w-4.5 h-4.5 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 border ${
                          step.s === "done"   ? "bg-success-light text-success border-success-border/50" :
                          step.s === "active" ? "bg-primary-light text-primary border-primary-border/50" :
                                               "bg-white/50 text-slate-400 border-slate-200/60"
                        }`}>
                          {step.s === "done" ? "✓" : step.s === "active" ? "●" : "○"}
                        </div>
                        <span className={`text-[12px] ${
                          step.s === "done"   ? "text-success" :
                          step.s === "active" ? "text-primary font-medium" :
                                               "text-slate-400"
                        }`}>{step.l}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
