"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SSSession, getSession } from "@/lib/session";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  role: "ai" | "user";
  html: string;
  time: string;
}

// ─── AI reply map ─────────────────────────────────────────────────────────────

const aiReplies: Record<string, string> = {
  isolat:
    "Isolation command sent to EDR. Host <strong>192.168.10.45</strong> has been quarantined — all active sessions terminated. Incident ticket <strong style='color:var(--color-primary)'>#INC-2047</strong> created and assigned to Tier 2.",
  timeline:
    "Full attack timeline:<br><pre style='margin-top:8px;padding:10px 12px;background:var(--color-surface-container);border-radius:8px;font-size:11px;line-height:1.8'>14:08 — Port scan (1,200 ports on DMZ subnet)\n14:10 — Recon on auth-server-01\n14:26 — SSH brute force started\n14:28 — <span style='color:#ba1a1a'>340 failed logins detected</span>\n14:28 — Shannon Sentinel alert triggered\n14:29 — AI analysis completed</pre>Total from recon to detection: ~20 minutes.",
  account:
    "Analyzing targeted accounts…<br><pre style='margin-top:8px;padding:10px 12px;background:var(--color-surface-container);border-radius:8px;font-size:11px;line-height:1.8'>Targeted: root, admin, ubuntu, ec2-user\nFailed: 340 attempts\nSuccessful: <span style='color:#1a7a4a'>0 — none succeeded</span>\nAuto-locked: 2 accounts</pre>No credentials compromised. Recommend rotating passwords as a precaution.",
  report: `Draft incident report generated. <a href='/reports' style='color:var(--color-primary);text-decoration:underline'>Open in Report Generator →</a>`,
  intel:
    "Matched in AbuseIPDB (94% confidence, 47 recent reports) and AlienVault OTX (tagged: scanner, brute-force, last seen 6 hours ago). This is a known malicious IP actively scanning SSH targets globally.",
  default:
    "Based on the current alert data, 192.168.10.45 is part of an automated SSH scanning campaign. The attack pattern is consistent with credential stuffing tools. I recommend isolating the host and rotating passwords for targeted accounts.",
};

function getReply(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("isolat") || m.includes("block") || m.includes("contain"))
    return aiReplies.isolat;
  if (m.includes("timeline") || m.includes("history")) return aiReplies.timeline;
  if (m.includes("account") || m.includes("success") || m.includes("comprom"))
    return aiReplies.account;
  if (m.includes("report")) return aiReplies.report;
  if (m.includes("intel") || m.includes("threat") || m.includes("known"))
    return aiReplies.intel;
  return aiReplies.default;
}

const initialMessages: Message[] = [
  {
    role: "ai",
    html: "Alert context loaded. Here's my initial assessment:<br><br><strong>192.168.10.45</strong> attempted <strong style='color:#ba1a1a'>340 SSH logins</strong> against <code style='padding:1px 5px;background:var(--color-surface-container);border-radius:4px;font-size:11px'>auth-server-01</code> in under 2 minutes — a clear automated brute force signature.<br><br>I also found a <strong>port scan from the same IP</strong> 20 minutes prior. This is a classic recon → attack sequence.",
    time: "14:28",
  },
  {
    role: "user",
    html: "Is this IP in threat intelligence? Any history?",
    time: "14:29",
  },
  {
    role: "ai",
    html: "Yes — matched in <strong>2 threat intel sources</strong>:<br><pre style='margin-top:8px;padding:10px 12px;background:var(--color-surface-container);border-radius:8px;font-size:11px;line-height:1.8'>Source: AbuseIPDB\nConfidence: 94% malicious\nReports: 47 abuse reports (last 30 days)\nCategory: Brute-Force, SSH Scanner\n\nSource: AlienVault OTX\nTags: scanner, brute-force\nLast seen: 6 hours ago</pre>This is a <strong>known scanner IP</strong>. Recommend immediate block at the firewall level.",
    time: "14:29",
  },
];

// ─── AI Meta Bar ──────────────────────────────────────────────────────────────

function AiMetaBar() {
  return (
    <div
      style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}
    >
      {/* Model */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "2px 10px",
          borderRadius: "9999px",
          background: "var(--color-surface-container)",
          color: "var(--color-on-surface-variant)",
          fontSize: "10px",
          fontFamily: "var(--font-sans)",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        Model: Qwen 2.5 7B
      </span>

      {/* Confidence */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "2px 10px",
          borderRadius: "9999px",
          background: "var(--color-primary-fixed)",
          color: "var(--color-primary)",
          fontSize: "10px",
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        Confidence: 94%
      </span>

      {/* Human review */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "2px 10px",
          borderRadius: "9999px",
          background: "#fef3c7",
          color: "#92400e",
          fontSize: "10px",
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        ⚠ Human Review Required
      </span>

      {/* Inspector link */}
      <Link
        href="/inspector"
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "2px 10px",
          borderRadius: "9999px",
          background: "transparent",
          color: "var(--color-primary)",
          fontSize: "10px",
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}
      >
        Inspect →
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InvestigatePage() {
  const router = useRouter();
  const [session, setSession] = useState<SSSession | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auth guard
  useEffect(() => {
    const sess = getSession();
    if (!sess) {
      router.replace("/login");
      return;
    }
    setSession(sess);
  }, [router]);

  // Scroll to bottom on new messages
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
      setMessages((prev) => [
        ...prev,
        { role: "ai", html: getReply(msg), time: now() },
      ]);
    }, 1100);
  }

  // Don't render until session is confirmed (prevents flash)
  if (!session) return null;

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>

      {/* ── Left Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className="animate-slide-in"
        style={{
          width: "272px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "var(--color-surface-container-low)",
        }}
      >
        {/* Alert header */}
        <div style={{ padding: "16px", paddingBottom: "14px" }}>
          <p
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-on-surface-variant)",
              marginBottom: "6px",
              fontFamily: "var(--font-sans)",
            }}
          >
            Active Alert
          </p>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--color-on-surface)",
              lineHeight: 1.35,
              marginBottom: "10px",
              fontFamily: "var(--font-headline)",
            }}
          >
            SSH Brute Force Attack
          </p>
          {/* Critical badge */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "9999px",
              background: "var(--color-error-container)",
              color: "var(--color-error)",
              fontSize: "11px",
              fontWeight: 700,
              fontFamily: "var(--font-sans)",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--color-error)",
                flexShrink: 0,
              }}
            />
            Critical
          </span>
        </div>

        {/* Scrollable content */}
        <div
          className="scroll-thin"
          style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}
        >
          {/* Alert fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
            {(
              [
                ["Source Host", "192.168.10.45", true],
                ["Target", "auth-server-01", false],
                ["Detection Time", "14:28:03 WIB", false],
                ["Event Count", "340 attempts / 2 min", true],
                ["Data Source", "EDR + Firewall Logs", false],
              ] as [string, string, boolean][]
            ).map(([k, v, danger]) => (
              <div key={k}>
                <p
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-on-surface-variant)",
                    marginBottom: "2px",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {k}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    fontFamily: "monospace",
                    color: danger ? "var(--color-error)" : "var(--color-on-surface)",
                    fontWeight: danger ? 600 : 400,
                  }}
                >
                  {v}
                </p>
              </div>
            ))}
          </div>

          {/* Raw log */}
          <div style={{ marginBottom: "20px" }}>
            <p
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-on-surface-variant)",
                marginBottom: "6px",
                fontFamily: "var(--font-sans)",
              }}
            >
              Raw Log Sample
            </p>
            <div
              style={{
                borderLeft: "3px solid var(--color-error)",
                background: "var(--color-surface-container-lowest)",
                borderRadius: "0 8px 8px 0",
                padding: "8px 12px",
                fontFamily: "monospace",
                fontSize: "11px",
                color: "var(--color-on-surface-variant)",
                lineHeight: 1.7,
                boxShadow: "0px 10px 40px rgba(25,28,30,0.06)",
              }}
            >
              Failed password for root<br />
              from 192.168.10.45 port 52341<br />
              ssh2 [repeated 340×]
            </div>
          </div>

          {/* Related alerts */}
          <div>
            <p
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-on-surface-variant)",
                marginBottom: "8px",
                fontFamily: "var(--font-sans)",
              }}
            >
              Related Alerts
            </p>

            {/* Lateral movement card */}
            <div
              style={{
                background: "var(--color-surface-container-lowest)",
                borderRadius: "1.5rem",
                boxShadow: "0px 10px 40px rgba(25,28,30,0.06)",
                padding: "10px 14px",
                marginBottom: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-on-surface)", fontFamily: "var(--font-sans)" }}>
                  Lateral Movement
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    background: "var(--color-error-container)",
                    color: "var(--color-error)",
                  }}
                >
                  CRITICAL
                </span>
              </div>
              <span style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--color-outline)" }}>
                AD01 → 3 internal hosts
              </span>
            </div>

            {/* Port scan card */}
            <div
              style={{
                background: "var(--color-surface-container-lowest)",
                borderRadius: "1.5rem",
                boxShadow: "0px 10px 40px rgba(25,28,30,0.06)",
                padding: "10px 14px",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-on-surface)", fontFamily: "var(--font-sans)" }}>
                  Port Scan
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    background: "var(--color-surface-container-high)",
                    color: "var(--color-on-surface-variant)",
                  }}
                >
                  LOW
                </span>
              </div>
              <span style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--color-outline)" }}>
                Same IP — 20 min prior
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Chat Panel ───────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <div
          style={{
            height: "56px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            background: "var(--color-surface-container-low)",
          }}
        >
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Link
              href="/dashboard"
              style={{
                fontSize: "11px",
                fontFamily: "monospace",
                color: "var(--color-outline)",
                textDecoration: "none",
              }}
            >
              Dashboard
            </Link>
            <span style={{ color: "var(--color-outline)", fontSize: "11px" }}>/</span>
            <span
              style={{
                fontSize: "11px",
                fontFamily: "monospace",
                color: "var(--color-on-surface-variant)",
              }}
            >
              SSH Brute Force — 192.168.10.45
            </span>
          </div>

          {/* Agent label + status */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Hexagon logo mark */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
                  borderRadius: "8px",
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 800,
                  fontFamily: "var(--font-headline)",
                  flexShrink: 0,
                }}
              >
                AI
              </div>
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "var(--color-on-surface)",
                    lineHeight: 1,
                    fontFamily: "var(--font-headline)",
                  }}
                >
                  Shannon AI Agent
                </p>
                <p
                  style={{
                    fontSize: "10px",
                    color: "var(--color-outline)",
                    marginTop: "2px",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Security investigation assistant
                </p>
              </div>
            </div>

            {/* Alert context loaded badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "9999px",
                background: "var(--color-primary-fixed)",
                color: "var(--color-primary)",
                fontSize: "11px",
                fontWeight: 600,
                fontFamily: "var(--font-sans)",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--color-primary)",
                  flexShrink: 0,
                }}
              />
              Alert context loaded
            </span>
          </div>
        </div>

        {/* Messages */}
        <div
          className="scroll-thin"
          style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Context pill */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span
              style={{
                fontSize: "11px",
                fontFamily: "monospace",
                color: "var(--color-outline)",
                background: "var(--color-surface-container)",
                padding: "4px 14px",
                borderRadius: "9999px",
                textAlign: "center",
              }}
            >
              Alert context auto-injected — SSH Brute Force / 192.168.10.45
            </span>
          </div>

          {messages.map((m, i) => (
            <div
              key={i}
              className="animate-fade-up"
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: m.role === "user" ? "row-reverse" : "row",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: 800,
                  color: "#fff",
                  marginTop: "2px",
                  background:
                    m.role === "ai"
                      ? "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))"
                      : "linear-gradient(135deg, #4f7df7, #2563eb)",
                  fontFamily: "var(--font-headline)",
                }}
              >
                {m.role === "ai" ? "AI" : session.name.slice(0, 2).toUpperCase()}
              </div>

              {/* Bubble + meta */}
              <div style={{ maxWidth: "560px" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    lineHeight: 1.65,
                    ...(m.role === "ai"
                      ? {
                          background: "var(--color-surface-container-lowest)",
                          borderRadius: "0 1.5rem 1.5rem 1.5rem",
                          boxShadow: "0px 10px 40px rgba(25,28,30,0.06)",
                          color: "var(--color-on-surface)",
                        }
                      : {
                          background:
                            "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
                          borderRadius: "1.5rem 0 1.5rem 1.5rem",
                          color: "#ffffff",
                        }),
                  }}
                  dangerouslySetInnerHTML={{ __html: m.html }}
                />

                {/* AI meta bar */}
                {m.role === "ai" && <AiMetaBar />}

                {/* Timestamp */}
                <p
                  style={{
                    fontSize: "10px",
                    fontFamily: "monospace",
                    color: "var(--color-outline)",
                    marginTop: "6px",
                    textAlign: m.role === "user" ? "right" : "left",
                  }}
                >
                  {m.time} · {m.role === "ai" ? "AI Agent" : session.name}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: 800,
                  color: "#fff",
                  marginTop: "2px",
                  background:
                    "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
                  fontFamily: "var(--font-headline)",
                }}
              >
                AI
              </div>
              <div
                style={{
                  background: "var(--color-surface-container-lowest)",
                  borderRadius: "0 1.5rem 1.5rem 1.5rem",
                  boxShadow: "0px 10px 40px rgba(25,28,30,0.06)",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {[0, 1, 2].map((j) => (
                  <span
                    key={j}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--color-outline)",
                      display: "inline-block",
                      animation: `bounce3 0.7s ${j * 0.15}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input area ─────────────────────────────────────────────────── */}
        <div
          style={{
            flexShrink: 0,
            background: "var(--color-surface-container-low)",
            padding: "12px 20px 16px",
          }}
        >
          {/* Quick action buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
            {(
              [
                ["Were any logins successful?", undefined],
                ["What are the containment steps?", undefined],
                ["Is there lateral movement?", undefined],
                ["Generate report ↗", "/reports"],
              ] as [string, string | undefined][]
            ).map(([label, href]) =>
              href ? (
                <Link
                  key={label}
                  href={href}
                  style={{
                    fontSize: "11px",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    padding: "5px 14px",
                    borderRadius: "9999px",
                    background: "var(--color-primary-fixed)",
                    color: "var(--color-primary)",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </Link>
              ) : (
                <button
                  key={label}
                  onClick={() => setInput(label)}
                  style={{
                    fontSize: "11px",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    padding: "5px 14px",
                    borderRadius: "9999px",
                    background: "var(--color-surface-container)",
                    color: "var(--color-on-surface-variant)",
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </button>
              )
            )}
          </div>

          {/* Input row */}
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              style={{
                flex: 1,
                height: "44px",
                padding: "0 16px",
                background: "var(--color-surface-container-lowest)",
                borderRadius: "1.5rem",
                border: "none",
                outline: "none",
                fontSize: "13px",
                color: "var(--color-on-surface)",
                fontFamily: "var(--font-sans)",
                boxShadow: "0px 2px 12px rgba(25,28,30,0.06)",
              }}
              placeholder="Ask about this alert…  e.g. 'What accounts were targeted?'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              onFocus={(e) => {
                (e.currentTarget as HTMLInputElement).style.boxShadow =
                  "0 0 0 3px rgba(0,78,71,0.10), 0px 2px 12px rgba(25,28,30,0.06)";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLInputElement).style.boxShadow =
                  "0px 2px 12px rgba(25,28,30,0.06)";
              }}
            />
            <button
              onClick={() => send()}
              style={{
                width: "44px",
                height: "44px",
                flexShrink: 0,
                borderRadius: "9999px",
                background:
                  "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "18px",
                fontWeight: 700,
              }}
              aria-label="Send"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
