"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";

/* ─── Data ──────────────────────────────────────────────────────────────── */

const feedPool = [
  { name: "Failed login — admin portal",    meta: "10.0.0.22",           type: "fp",    label: "False positive" },
  { name: "Suspicious PowerShell",           meta: "dev-pc-07",           type: "esc",   label: "Escalated →" },
  { name: "Port scan internal",              meta: "192.168.1.105",       type: "watch", label: "Watching" },
  { name: "DNS beacon pattern detected",     meta: "ws-finance-04",       type: "esc",   label: "Escalated →" },
  { name: "Large file download",             meta: "joko@corp.id 2.1 GB", type: "watch", label: "Watching" },
  { name: "Repeated firewall block",         meta: "5.196.33.1:8080",     type: "auto",  label: "Auto-blocked" },
  { name: "Antivirus scan triggered",        meta: "hr-laptop-09",        type: "fp",    label: "False positive" },
  { name: "Login from new country",          meta: "budi@corp.id — SG",   type: "esc",   label: "Escalated →" },
  { name: "SQL error spike",                 meta: "db-prod-01",          type: "fp",    label: "False positive" },
  { name: "Outbound IRC traffic",            meta: "10.0.0.88:6667",      type: "esc",   label: "Escalated →" },
];

const typeStyle: Record<string, { barColor: string; badgeBg: string; badgeColor: string }> = {
  fp:    { barColor: "#22c55e", badgeBg: "#dcfce7", badgeColor: "#15803d" },
  esc:   { barColor: "var(--color-error)", badgeBg: "var(--color-error-container)", badgeColor: "var(--color-error)" },
  watch: { barColor: "#f59e0b", badgeBg: "#fffbeb", badgeColor: "#b45309" },
  auto:  { barColor: "var(--color-primary)", badgeBg: "var(--color-primary-fixed)", badgeColor: "var(--color-primary)" },
};

/* ─── HITL step definitions ─────────────────────────────────────────────── */

const HITL_STEPS = [
  { index: 2, label: "Isolate source host" },
  { index: 3, label: "Create incident ticket" },
  { index: 4, label: "Notify Tier 2" },
];

type HitlStatus = "pending" | "approved" | "rejected";

interface FeedItem { name: string; meta: string; type: string; label: string; }
interface AuditEntry { time: string; message: string; }

function nowTime(): string {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function TriagePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [counts, setCounts] = useState({ ingested: 0, processed: 0, closed: 0, watching: 0, escalated: 0 });
  const [hitl, setHitl] = useState<Record<number, HitlStatus>>({ 2: "pending", 3: "pending", 4: "pending" });
  const [audit, setAudit] = useState<AuditEntry[]>([
    { time: "14:28:03", message: "Alert triggered: SSH Brute Force (340 attempts)" },
    { time: "14:28:05", message: "AI analysis completed: confidence 94%" },
    { time: "14:28:06", message: "Step 1 auto-executed: IP captured (192.168.10.45)" },
    { time: "14:28:07", message: "Step 2 auto-executed: Firewall rule applied" },
    { time: "14:28:07", message: "Step 3 HITL gate: awaiting analyst approval" },
  ]);
  const poolIdx = useRef(0);

  /* Auth guard */
  useEffect(() => {
    const sess = getSession();
    if (!sess) { router.replace("/login"); return; }
    setReady(true);
  }, [router]);

  /* Feed + counter animation */
  useEffect(() => {
    if (!ready) return;

    const initial: FeedItem[] = [];
    for (let i = 0; i < 7; i++) {
      initial.unshift(feedPool[poolIdx.current++ % feedPool.length]);
    }
    setFeed(initial);

    const feedTimer = setInterval(() => {
      setFeed((prev) => [feedPool[poolIdx.current++ % feedPool.length], ...prev.slice(0, 9)]);
    }, 3200);

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
  }, [ready]);

  function simulate() {
    setFeed((prev) => [feedPool[poolIdx.current++ % feedPool.length], ...prev.slice(0, 9)]);
  }

  function handleHitl(stepIndex: number, stepLabel: string, action: "approved" | "rejected") {
    setHitl((prev) => ({ ...prev, [stepIndex]: action }));
    setAudit((prev) => [
      ...prev,
      {
        time: nowTime(),
        message: `Analyst ${action === "approved" ? "approved" : "rejected"}: ${stepLabel}`,
      },
    ]);
  }

  const pipeline = [
    { id: "ingested",  icon: "📥", label: "Ingested",     sub: "raw events",         count: counts.ingested,  valueColor: "var(--color-on-surface-variant)" },
    { id: "processed", icon: "🤖", label: "AI Processed", sub: "scored & correlated", count: counts.processed, valueColor: "#7c3aed" },
    { id: "closed",    icon: "✅", label: "Auto-closed",  sub: "false positives",     count: counts.closed,    valueColor: "#15803d" },
    { id: "watching",  icon: "👁",  label: "Watching",     sub: "low confidence",      count: counts.watching,  valueColor: "#b45309" },
    { id: "escalated", icon: "🚨", label: "Escalated",    sub: "to analyst",          count: counts.escalated, valueColor: "var(--color-error)" },
  ];

  /* Step 3 unlocked always; step 4 unlocked after step 3 approved; step 5 after step 4 */
  function isUnlocked(stepIndex: number): boolean {
    if (stepIndex === 2) return true;
    if (stepIndex === 3) return hitl[2] === "approved";
    if (stepIndex === 4) return hitl[3] === "approved";
    return false;
  }

  if (!ready) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--color-surface)", fontFamily: "var(--font-sans, Inter, sans-serif)" }}>

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "var(--color-surface-container-low)",
        height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 1.5rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: 24, height: 24, background: "var(--color-primary)",
            clipPath: "polygon(50% 0%,100% 22%,100% 68%,50% 100%,0% 68%,0% 22%)",
          }} />
          <span style={{ fontFamily: "var(--font-headline, Manrope, sans-serif)", fontSize: 15, fontWeight: 700, color: "var(--color-on-surface)" }}>
            Shannon Sentinel
          </span>
          <span style={{ color: "var(--color-outline)", margin: "0 2px" }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-on-surface-variant)" }}>
            Agentic Triage &amp; Playbook Engine
          </span>
        </div>
        <span style={{
          fontSize: 11, fontFamily: "monospace", fontWeight: 600,
          padding: "3px 12px", borderRadius: 9999,
          background: "var(--color-primary-fixed)", color: "var(--color-primary)",
        }}>
          Automation
        </span>
      </header>

      {/* ── Scrollable body ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* ── Pipeline card ─────────────────────────────────────────────── */}
        <div style={{
          background: "var(--color-surface-container-lowest)", borderRadius: "1.5rem",
          boxShadow: "0px 10px 40px rgba(25,28,30,0.06)", padding: "1.5rem",
        }}>
          <p style={{
            fontFamily: "var(--font-headline, Manrope, sans-serif)",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: "var(--color-on-surface-variant)", marginBottom: "1.25rem",
          }}>
            AI Triage Pipeline — Hari Ini
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
            {pipeline.map((p, i) => (
              <div key={p.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative" }}>
                {i < pipeline.length - 1 && (
                  <div style={{ position: "absolute", left: "100%", top: 20, width: "100%", transform: "translateX(-50%)", display: "flex", justifyContent: "center", pointerEvents: "none" }}>
                    <span style={{ color: "var(--color-outline)", fontSize: 14 }}>→</span>
                  </div>
                )}
                <div style={{
                  width: 48, height: 48, borderRadius: "1rem",
                  background: "var(--color-surface-container-low)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, marginBottom: 10,
                }}>
                  {p.icon}
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "monospace", lineHeight: 1, marginBottom: 4, color: p.valueColor }}>
                  {p.count.toLocaleString()}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-on-surface)", marginBottom: 2 }}>{p.label}</div>
                <div style={{ fontSize: 10, color: "var(--color-on-surface-variant)" }}>{p.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Two-column grid ───────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", alignItems: "start" }}>

          {/* ── Left: Live Triage Feed ──────────────────────────────────── */}
          <div style={{
            background: "var(--color-surface-container-lowest)", borderRadius: "1.5rem",
            boxShadow: "0px 10px 40px rgba(25,28,30,0.06)", overflow: "hidden", display: "flex", flexDirection: "column",
          }}>
            {/* Feed header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1.25rem", background: "var(--color-surface-container-low)", borderRadius: "1.5rem 1.5rem 0 0" }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-on-surface-variant)", fontFamily: "var(--font-headline, Manrope)" }}>
                Live Triage Feed
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: "monospace", color: "var(--color-primary)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: 9999, background: "var(--color-primary)", display: "inline-block", animation: "blink 1.3s infinite" }} />
                  Processing
                </div>
                <button
                  onClick={simulate}
                  style={{
                    fontSize: 11, fontFamily: "monospace", fontWeight: 600,
                    padding: "4px 12px", borderRadius: 9999, border: "none", cursor: "pointer",
                    background: "var(--color-primary-fixed)", color: "var(--color-primary)",
                  }}
                >
                  + Simulate
                </button>
              </div>
            </div>

            {/* Feed items */}
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {feed.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid", gridTemplateColumns: "3px 1fr auto",
                    gap: 12, alignItems: "center",
                    padding: "0.625rem 1.25rem",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-container-low)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                >
                  <div style={{ background: typeStyle[item.type].barColor, borderRadius: 2, alignSelf: "stretch", minHeight: 28 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-on-surface)", marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--color-on-surface-variant)" }}>{item.meta}</div>
                  </div>
                  <span style={{
                    fontSize: 11, fontFamily: "monospace", fontWeight: 600,
                    padding: "2px 10px", borderRadius: 9999,
                    background: typeStyle[item.type].badgeBg, color: typeStyle[item.type].badgeColor,
                  }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Feed footer stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "var(--color-surface-container-low)", borderRadius: "0 0 1.5rem 1.5rem" }}>
              {[
                { val: "92%",  label: "Auto rate",  color: "#15803d" },
                { val: "0.3s", label: "Avg triage", color: "var(--color-primary)" },
                { val: "12",   label: "Escalated",  color: "var(--color-error)" },
              ].map((s, i) => (
                <div key={s.label} style={{ padding: "0.875rem 0", textAlign: "center", borderRight: i < 2 ? "1px solid var(--color-surface-container)" : "none" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "monospace", lineHeight: 1, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-on-surface-variant)", marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column: Playbook + Audit Trail ───────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* ── Playbook Engine ────────────────────────────────────────── */}
            <div style={{
              background: "var(--color-surface-container-lowest)", borderRadius: "1.5rem",
              boxShadow: "0px 10px 40px rgba(25,28,30,0.06)",
            }}>
              {/* Playbook header */}
              <div style={{ padding: "1rem 1.25rem 0.75rem", background: "var(--color-surface-container-low)", borderRadius: "1.5rem 1.5rem 0 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-on-surface-variant)", fontFamily: "var(--font-headline, Manrope)", marginBottom: 6 }}>
                    Playbook Engine
                  </p>
                  <div style={{ fontFamily: "var(--font-headline, Manrope)", fontSize: 15, fontWeight: 700, color: "var(--color-on-surface)" }}>
                    🔒 SSH Brute Force Response
                  </div>
                  <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--color-on-surface-variant)", marginTop: 3 }}>
                    Trigger: ≥50 SSH failures / 5 min
                  </div>
                </div>
                <span style={{
                  fontSize: 11, fontFamily: "monospace", fontWeight: 600,
                  padding: "4px 12px", borderRadius: 9999,
                  background: "var(--color-primary-fixed)", color: "var(--color-primary)", whiteSpace: "nowrap", marginTop: 2,
                }}>
                  ● Running
                </span>
              </div>

              {/* Steps */}
              <div style={{ padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>

                {/* Step 1 — completed */}
                <CompletedStep label="Capture offending IP" />
                {/* Step 2 — completed */}
                <CompletedStep label="Block at firewall" />

                {/* HITL Steps */}
                {HITL_STEPS.map(({ index, label }) => {
                  const status = hitl[index];
                  const unlocked = isUnlocked(index);

                  if (status === "approved") {
                    return <CompletedStep key={index} label={label} />;
                  }

                  if (status === "rejected") {
                    return (
                      <div key={index} style={{
                        borderRadius: "1rem", padding: "0.75rem 1rem",
                        background: "var(--color-error-container)",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 14, color: "var(--color-error)" }}>✗</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-error)" }}>{label}</span>
                          <span style={{
                            marginLeft: "auto", fontSize: 10, fontWeight: 700,
                            padding: "2px 10px", borderRadius: 9999,
                            background: "var(--color-error)", color: "#fff",
                          }}>
                            Ditolak
                          </span>
                        </div>
                      </div>
                    );
                  }

                  /* pending */
                  return (
                    <div key={index} style={{
                      border: "1.5px solid #f59e0b", borderRadius: "1rem",
                      padding: "0.75rem 1rem",
                      background: unlocked ? "#fffbeb" : "var(--color-surface-container-low)",
                      opacity: unlocked ? 1 : 0.55,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>
                          {!unlocked ? "🔒 " : "⚠ "}{label}
                        </span>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 9999,
                          background: "#f59e0b", color: "#fff",
                        }}>
                          ⚠ Perlu Persetujuan
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: "var(--color-on-surface-variant)", margin: "0 0 0.625rem" }}>
                        Tindakan destruktif — persetujuan analis diperlukan
                      </p>
                      {unlocked && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => handleHitl(index, label, "approved")}
                            style={{
                              fontSize: 12, fontWeight: 700, padding: "5px 16px", borderRadius: 9999,
                              border: "none", cursor: "pointer",
                              background: "var(--color-primary)", color: "#fff",
                            }}
                          >
                            ✓ Setuju
                          </button>
                          <button
                            onClick={() => handleHitl(index, label, "rejected")}
                            style={{
                              fontSize: 12, fontWeight: 700, padding: "5px 16px", borderRadius: 9999,
                              border: "none", cursor: "pointer",
                              background: "var(--color-error-container)", color: "var(--color-error)",
                            }}
                          >
                            ✗ Tolak
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Note */}
                <p style={{ fontSize: 11, color: "var(--color-on-surface-variant)", fontStyle: "italic", marginTop: 4 }}>
                  Auto-rate stat: triage only — containment requires approval
                </p>
              </div>
            </div>

            {/* ── Audit Trail Panel ──────────────────────────────────────── */}
            <div style={{
              background: "var(--color-surface-container-lowest)", borderRadius: "1.5rem",
              boxShadow: "0px 10px 40px rgba(25,28,30,0.06)",
            }}>
              <div style={{ padding: "0.875rem 1.25rem", background: "var(--color-surface-container-low)", borderRadius: "1.5rem 1.5rem 0 0" }}>
                <span style={{ fontFamily: "var(--font-headline, Manrope, sans-serif)", fontSize: 13, fontWeight: 700, color: "var(--color-on-surface)" }}>
                  Audit Trail
                </span>
              </div>
              <div style={{ padding: "0.75rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.375rem", maxHeight: 220, overflowY: "auto" }}>
                {audit.map((entry, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "baseline" }}>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--color-on-surface-variant)", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {entry.time}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--color-on-surface)", lineHeight: 1.5 }}>
                      {entry.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function CompletedStep({ label }: { label: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      borderRadius: "1rem", padding: "0.625rem 1rem",
      background: "var(--color-surface-container-low)",
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: 9999, flexShrink: 0,
        background: "var(--color-primary-fixed)", color: "var(--color-primary)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700,
      }}>
        ✓
      </span>
      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-primary)" }}>{label}</span>
    </div>
  );
}
