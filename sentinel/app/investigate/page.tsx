"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface Message { role: "ai" | "user"; html: string; time: string; }

const aiReplies: Record<string, string> = {
  isolat: "Isolation command sent to EDR. Host <strong>192.168.10.45</strong> has been quarantined — all active sessions terminated. Incident ticket <strong style='color:#0D9488'>#INC-2047</strong> created and assigned to Tier 2.",
  timeline: "Full attack timeline:<br><pre style='margin-top:8px;padding:10px 12px;background:rgba(255,255,255,0.5);border-radius:8px;font-size:11px;line-height:1.8'>14:08 — Port scan (1,200 ports on DMZ subnet)\n14:10 — Recon on auth-server-01\n14:26 — SSH brute force started\n14:28 — <span style='color:#EF4444'>340 failed logins detected</span>\n14:28 — Shannon Sentinel alert triggered\n14:29 — AI analysis completed</pre>Total from recon to detection: ~20 minutes.",
  account: "Analyzing targeted accounts…<br><pre style='margin-top:8px;padding:10px 12px;background:rgba(255,255,255,0.5);border-radius:8px;font-size:11px;line-height:1.8'>Targeted: root, admin, ubuntu, ec2-user\nFailed: 340 attempts\nSuccessful: <span style='color:#10B981'>0 — none succeeded</span>\nAuto-locked: 2 accounts</pre>No credentials compromised. Recommend rotating passwords as a precaution.",
  report: `Draft incident report generated. <a href='/reports' style='color:#0D9488;text-decoration:underline'>Open in Report Generator →</a>`,
  intel: "Matched in AbuseIPDB (94% confidence, 47 recent reports) and AlienVault OTX (tagged: scanner, brute-force, last seen 6 hours ago). This is a known malicious IP actively scanning SSH targets globally.",
  default: "Based on the current alert data, 192.168.10.45 is part of an automated SSH scanning campaign. The attack pattern is consistent with credential stuffing tools. I recommend isolating the host and rotating passwords for targeted accounts.",
};

function getReply(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("isolat") || m.includes("block") || m.includes("contain")) return aiReplies.isolat;
  if (m.includes("timeline") || m.includes("history")) return aiReplies.timeline;
  if (m.includes("account") || m.includes("success") || m.includes("comprom")) return aiReplies.account;
  if (m.includes("report")) return aiReplies.report;
  if (m.includes("intel") || m.includes("threat") || m.includes("known")) return aiReplies.intel;
  return aiReplies.default;
}

const initialMessages: Message[] = [
  { role: "ai", html: "Alert context loaded. Here's my initial assessment:<br><br><strong>192.168.10.45</strong> attempted <strong style='color:#EF4444'>340 SSH logins</strong> against <code style='padding:1px 5px;background:rgba(255,255,255,0.6);border-radius:4px;font-size:11px'>auth-server-01</code> in under 2 minutes — a clear automated brute force signature.<br><br>I also found a <strong>port scan from the same IP</strong> 20 minutes prior. This is a classic recon → attack sequence.", time: "14:28" },
  { role: "user", html: "Is this IP in threat intelligence? Any history?", time: "14:29" },
  { role: "ai", html: "Yes — matched in <strong>2 threat intel sources</strong>:<br><pre style='margin-top:8px;padding:10px 12px;background:rgba(255,255,255,0.5);border-radius:8px;font-size:11px;line-height:1.8'>Source: AbuseIPDB\nConfidence: 94% malicious\nReports: 47 abuse reports (last 30 days)\nCategory: Brute-Force, SSH Scanner\n\nSource: AlienVault OTX\nTags: scanner, brute-force\nLast seen: 6 hours ago</pre>This is a <strong>known scanner IP</strong>. Recommend immediate block at the firewall level.", time: "14:29" },
];

export default function InvestigatePage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function now() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  function send(txt?: string) {
    const msg = txt ?? input.trim();
    if (!msg) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", html: msg, time: now() }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: "ai", html: getReply(msg), time: now() }]);
    }, 1100);
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left sidebar */}
      <aside className="glass-sidebar w-[272px] shrink-0 flex flex-col overflow-hidden">
        <div className="px-4 py-3.5 border-b border-white/40">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Active Alert</p>
          <p className="text-[14px] font-semibold text-slate-800 leading-snug mb-2">SSH Brute Force Attack</p>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-danger-light/70 text-danger border border-danger-border/50 rounded-full text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-danger" />
            Critical
          </span>
        </div>
        <div className="flex-1 overflow-y-auto scroll-thin px-4 py-3.5 space-y-3.5">
          {[
            ["Source Host", "192.168.10.45", true],
            ["Target", "auth-server-01", false],
            ["Detection Time", "14:28:03 WIB", false],
            ["Event Count", "340 attempts / 2 min", true],
            ["Data Source", "EDR + Firewall Logs", false],
          ].map(([k, v, danger]) => (
            <div key={String(k)}>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{k}</p>
              <p className={`text-[12px] font-mono ${danger ? "text-danger" : "text-slate-700"}`}>{v}</p>
            </div>
          ))}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Raw Log Sample</p>
            <div className="bg-white/40 border-l-2 border-danger rounded-r-lg px-3 py-2 font-mono text-[11px] text-slate-600 leading-relaxed">
              Failed password for root<br />from 192.168.10.45 port 52341<br />ssh2 [repeated 340×]
            </div>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2">Related Alerts</p>
            <div className="glass rounded-xl px-3 py-2.5 mb-2 border border-primary/30">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[12px] font-medium text-slate-700">Lateral Movement</span>
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-danger-light text-danger rounded">CRITICAL</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">AD01 → 3 internal hosts</span>
            </div>
            <div className="glass rounded-xl px-3 py-2.5 hover:border-primary/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[12px] font-medium text-slate-700">Port Scan</span>
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-success-light text-success rounded">LOW</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Same IP — 20 min prior</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Chat panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat topbar */}
        <div className="glass-bar h-[52px] shrink-0 flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-[11px] font-mono text-slate-400 hover:text-primary transition-colors">Dashboard</Link>
            <span className="text-slate-300">/</span>
            <span className="text-[11px] font-mono text-slate-500">SSH Brute Force — 192.168.10.45</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-[12px] font-bold">AI</div>
              <div>
                <p className="text-[12px] font-semibold text-slate-800 leading-none">Shannon AI Agent</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Security investigation assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-success-light/70 text-success border border-success-border/50 rounded-full text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Alert context loaded
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4 space-y-4">
          <div className="flex justify-center">
            <span className="text-[11px] font-mono text-slate-400 glass px-3.5 py-1 rounded-full text-center">
              Alert context auto-injected — SSH Brute Force / 192.168.10.45
            </span>
          </div>

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2.5 animate-fade-up ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-bold text-white mt-0.5 ${m.role === "ai" ? "bg-primary" : "bg-info"}`}>
                {m.role === "ai" ? "AI" : "AK"}
              </div>
              <div className="max-w-[560px]">
                <div className={`px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  m.role === "ai"
                    ? "glass rounded-tl-sm rounded-tr-xl rounded-bl-xl rounded-br-xl text-slate-700"
                    : "bg-primary/90 backdrop-blur-sm text-white rounded-tl-xl rounded-tr-sm rounded-bl-xl rounded-br-xl"
                }`} dangerouslySetInnerHTML={{ __html: m.html }} />
                <p className={`text-[10px] font-mono text-slate-400 mt-1.5 ${m.role === "user" ? "text-right" : ""}`}>
                  {m.time} · {m.role === "ai" ? "AI Agent" : "Analyst Kurniawan"}
                </p>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary shrink-0 flex items-center justify-center text-white text-[11px] font-bold mt-0.5">AI</div>
              <div className="glass rounded-tl-sm rounded-tr-xl rounded-bl-xl rounded-br-xl px-4 py-3">
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((j) => (
                    <span key={j} className="w-1.5 h-1.5 rounded-full bg-slate-400" style={{ animation: `bounce3 0.7s ${j * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="glass-bar border-t border-white/40 px-5 py-3 shrink-0">
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {[
              ["Were any logins successful?", undefined],
              ["What are the containment steps?", undefined],
              ["Is there lateral movement?", undefined],
              ["Generate report ↗", "/reports"],
            ].map(([label, href]) =>
              href ? (
                <Link key={String(label)} href={href} className="text-[11px] font-mono px-2.5 py-1 glass-btn rounded-lg text-primary border-primary-border/40">
                  {label}
                </Link>
              ) : (
                <button key={String(label)} onClick={() => setInput(String(label))} className="text-[11px] font-mono px-2.5 py-1 glass-btn rounded-lg text-slate-500">
                  {label}
                </button>
              )
            )}
          </div>
          <div className="flex gap-2.5">
            <input
              className="flex-1 h-10 px-3.5 glass-input rounded-xl text-[13px] text-slate-800 placeholder:text-slate-400 font-sans"
              placeholder="Ask about this alert…  e.g. 'What accounts were targeted?'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={() => send()}
              className="w-10 h-10 bg-primary/90 backdrop-blur-sm rounded-xl text-white flex items-center justify-center text-base hover:bg-primary transition-colors shrink-0"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
