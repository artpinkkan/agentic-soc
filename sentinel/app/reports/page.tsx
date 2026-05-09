"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, SSSession } from "@/lib/session";

// ─── Data ────────────────────────────────────────────────────────────────────

const quickItems = [
  { icon: "📊", label: "Weekly security report",        prompt: "Generate a weekly security report for this week" },
  { icon: "🚨", label: "Incident report — SSH attack",  prompt: "Generate an incident report for the SSH brute force attack INC-2047" },
  { icon: "👔", label: "Executive board summary",       prompt: "Generate an executive board summary of top threats this month" },
  { icon: "⚖️", label: "OJK compliance report",         prompt: "Generate a compliance report for OJK POJK 11/2022" },
];

const templates = [
  { icon: "🚨", name: "Incident Report",    type: "TEMPLATE" },
  { icon: "📈", name: "Weekly SOC Summary", type: "TEMPLATE" },
  { icon: "⚖️", name: "Compliance Report",  type: "TEMPLATE" },
  { icon: "👔", name: "Executive Briefing", type: "TEMPLATE" },
];

const recent = [
  { name: "Weekly Report — Apr 18", date: "Generated 7 days ago" },
  { name: "Incident INC-2031",      date: "Generated 9 days ago" },
  { name: "Monthly Summary — Mar",  date: "Generated 24 days ago" },
];

const genSteps = [
  "Pulling incident data for last 7 days…",
  "Correlating alert trends and statistics…",
  "Generating executive summary…",
  "Compiling recommendations…",
  "Formatting final document…",
];

const rawDataSections = [
  {
    key: "report_metadata",
    label: "report_metadata",
    color: "text-[var(--color-primary)]",
    fields: [
      { k: "report_id",      v: '"RPT-20260425-001"',          vc: "text-amber-600" },
      { k: "generated_at",   v: '"2026-04-25T14:30:00+07:00"', vc: "text-amber-600" },
      { k: "period_start",   v: '"2026-04-19T00:00:00+07:00"', vc: "text-amber-600" },
      { k: "period_end",     v: '"2026-04-25T23:59:59+07:00"', vc: "text-amber-600" },
      { k: "organization",   v: '"PT Contoh Tbk"',              vc: "text-amber-600" },
      { k: "classification", v: '"INTERNAL"',                   vc: "text-amber-600" },
      { k: "agent_version",  v: '"v2.1.4"',                     vc: "text-amber-600" },
    ],
  },
  {
    key: "alert_statistics",
    label: "alert_statistics",
    color: "text-[#3B82F6]",
    fields: [
      { k: "total_alerts",       v: "1847",  vc: "text-[#3B82F6]" },
      { k: "auto_triaged",       v: "1700",  vc: "text-[#10B981]" },
      { k: "escalated",          v: "12",    vc: "text-[#EF4444]" },
      { k: "false_positives",    v: "135",   vc: "text-slate-400" },
      { k: "auto_triage_pct",    v: "92.04", vc: "text-[#10B981]" },
      { k: "alert_delta_7d_pct", v: "+38.2", vc: "text-[#EF4444]" },
    ],
  },
  {
    key: "sla_metrics",
    label: "sla_metrics",
    color: "text-[#8B5CF6]",
    fields: [
      { k: "avg_detection_sec",  v: "252",  vc: "text-[var(--color-primary)]" },
      { k: "avg_response_sec",   v: "1080", vc: "text-[#10B981]" },
      { k: "sla_compliance_pct", v: "94.0", vc: "text-[#10B981]" },
      { k: "breached_sla",       v: "1",    vc: "text-[#F59E0B]" },
      { k: "p95_detection_sec",  v: "840",  vc: "text-slate-500" },
    ],
  },
  {
    key: "top_incidents",
    label: "top_incidents  [ 4 items ]",
    color: "text-[#EF4444]",
    fields: [
      { k: "[0].id",             v: '"INC-2047"',                        vc: "text-amber-600" },
      { k: "[0].title",          v: '"SSH Brute Force — 192.168.10.45"', vc: "text-amber-600" },
      { k: "[0].severity",       v: '"CRITICAL"',                        vc: "text-[#EF4444]" },
      { k: "[0].resolved_in_sec",v: "840",                               vc: "text-[#10B981]" },
      { k: "[1].id",             v: '"INC-2044"',                        vc: "text-amber-600" },
      { k: "[1].severity",       v: '"CRITICAL"',                        vc: "text-[#EF4444]" },
      { k: "[2].id",             v: '"INC-2041"',                        vc: "text-amber-600" },
      { k: "[2].severity",       v: '"HIGH"',                            vc: "text-[#F59E0B]" },
      { k: "[2].status",         v: '"MONITORING"',                      vc: "text-[#F59E0B]" },
      { k: "[3].id",             v: '"INC-2038"',                        vc: "text-amber-600" },
      { k: "[3].severity",       v: '"HIGH"',                            vc: "text-[#F59E0B]" },
    ],
  },
  {
    key: "data_sources",
    label: "data_sources  [ 5 queried ]",
    color: "text-slate-500",
    fields: [
      { k: "siem",        v: '"Elastic SIEM  · 1,847 events"',   vc: "text-slate-400" },
      { k: "edr",         v: '"CrowdStrike   · 312 detections"',  vc: "text-slate-400" },
      { k: "firewall",    v: '"Palo Alto NGF · 9,204 log lines"', vc: "text-slate-400" },
      { k: "ad_logs",     v: '"AD01/AD02     · 5,612 events"',    vc: "text-slate-400" },
      { k: "threat_intel",v: '"AbuseIPDB    · 14 IP lookups"',    vc: "text-slate-400" },
    ],
  },
];

const historyItems = [
  { id: "RPT-20260425-001", title: "Weekly Security Report",        type: "WEEKLY",     date: "25 Apr 2026", time: "14:30", status: "ready",    agent: "AI Agent v2.1", size: "184 KB", pages: 2 },
  { id: "RPT-20260418-003", title: "Weekly Security Report",        type: "WEEKLY",     date: "18 Apr 2026", time: "09:15", status: "ready",    agent: "AI Agent v2.1", size: "176 KB", pages: 2 },
  { id: "RPT-20260416-002", title: "Incident Report — INC-2031",    type: "INCIDENT",   date: "16 Apr 2026", time: "18:42", status: "ready",    agent: "AI Agent v2.0", size: "98 KB",  pages: 1 },
  { id: "RPT-20260401-001", title: "Monthly Summary — March 2026",  type: "MONTHLY",    date: "01 Apr 2026", time: "08:00", status: "ready",    agent: "AI Agent v2.0", size: "241 KB", pages: 3 },
  { id: "RPT-20260325-002", title: "OJK Compliance Report Q1",      type: "COMPLIANCE", date: "25 Mar 2026", time: "11:30", status: "ready",    agent: "AI Agent v1.9", size: "317 KB", pages: 5 },
  { id: "RPT-20260318-001", title: "Weekly Security Report",        type: "WEEKLY",     date: "18 Mar 2026", time: "09:00", status: "archived", agent: "AI Agent v1.9", size: "162 KB", pages: 2 },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: "var(--color-surface-container-lowest)",
  borderRadius: "1.5rem",
  boxShadow: "0px 10px 40px rgba(25,28,30,0.06)",
};

const pillPrimary: React.CSSProperties = {
  background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)",
  color: "#fff",
  borderRadius: "9999px",
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
};

const pillGhost: React.CSSProperties = {
  background: "var(--color-surface-container)",
  color: "var(--color-on-surface)",
  borderRadius: "9999px",
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
};

const typeBadgeStyle: Record<string, React.CSSProperties> = {
  WEEKLY:     { background: "var(--color-primary-fixed)", color: "var(--color-primary)" },
  INCIDENT:   { background: "var(--color-error-container)", color: "var(--color-error)" },
  MONTHLY:    { background: "#dbeafe", color: "#1d4ed8" },
  COMPLIANCE: { background: "#ede9fe", color: "#6d28d9" },
};

// ─── ReportContent ────────────────────────────────────────────────────────────

function ReportContent() {
  return (
    <div id="pdf-report-content">
      {/* Doc header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--color-surface-container)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: 20, height: 20,
              background: "var(--color-primary)",
              clipPath: "polygon(50% 0%,100% 22%,100% 68%,50% 100%,0% 68%,0% 22%)",
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-primary)", fontFamily: "var(--font-headline)" }}>Shannon Sentinel</span>
        </div>
        <div style={{ textAlign: "right", fontSize: 11, fontFamily: "monospace", color: "var(--color-outline)", lineHeight: 1.6 }}>
          Generated: 25 Apr 2026, 14:30 WIB<br />
          Prepared by: AI Agent v2.1<br />
          Classification: INTERNAL
        </div>
      </div>

      <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-primary)", marginBottom: 6, fontFamily: "var(--font-headline)" }}>Weekly Security Report</p>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: "var(--color-on-surface)", lineHeight: 1.3, marginBottom: 6, fontFamily: "var(--font-headline)" }}>Weekly Security Operations Summary</h1>
      <p style={{ fontSize: 12, color: "var(--color-outline)", marginBottom: "1.5rem", fontFamily: "var(--font-sans)" }}>Period: 19 April – 25 April 2026 · PT Contoh Tbk · Prepared by Shannon Sentinel AI</p>

      {/* Executive summary */}
      <div style={{ background: "var(--color-surface-container-low)", borderLeft: "4px solid var(--color-primary)", borderRadius: "0 0.75rem 0.75rem 0", padding: "0.875rem 1rem", marginBottom: "1.5rem" }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-primary)", marginBottom: 6, fontFamily: "var(--font-headline)" }}>Executive Summary</p>
        <p style={{ fontSize: 13, color: "var(--color-on-surface-variant)", lineHeight: 1.6, fontFamily: "var(--font-sans)" }}>
          This week saw a <strong>38% increase in alert volume</strong> driven primarily by an SSH brute force campaign targeting authentication infrastructure. The SOC detected and contained all critical incidents within SLA. <strong>12 incidents</strong> were escalated to analysts — all resolved. No confirmed data breaches. AI auto-triage handled <strong>92% of alerts automatically</strong>.
        </p>
      </div>

      {/* Metrics */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-on-surface)", fontFamily: "var(--font-headline)" }}>Key Metrics</span>
        <div style={{ flex: 1, height: 1, background: "var(--color-surface-container)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: "1.5rem" }}>
        {[
          { val: "12",    label: "Incidents this week", color: "#EF4444" },
          { val: "4.2m",  label: "Avg detection time",  color: "var(--color-primary)" },
          { val: "94%",   label: "SLA compliance",      color: "#10B981" },
          { val: "1,847", label: "Total alerts",        color: "#F59E0B" },
          { val: "18m",   label: "Avg response time",   color: "#10B981" },
          { val: "92%",   label: "AI auto-triaged",     color: "#3B82F6" },
        ].map((m) => (
          <div key={m.label} style={{ background: "var(--color-surface-container-low)", borderRadius: "0.75rem", padding: "0.75rem 1rem" }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "monospace", color: m.color, lineHeight: 1, marginBottom: 4 }}>{m.val}</div>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-outline)", fontFamily: "var(--font-sans)" }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Incidents table */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-on-surface)", fontFamily: "var(--font-headline)" }}>Top Incidents This Week</span>
        <div style={{ flex: 1, height: 1, background: "var(--color-surface-container)" }} />
      </div>
      <table style={{ width: "100%", fontSize: 12, marginBottom: "1.5rem", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["ID", "Title", "Severity", "Status", "Resolution"].map((h) => (
              <th key={h} style={{ textAlign: "left", paddingBottom: 8, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-outline)", fontWeight: 600, borderBottom: "1px solid var(--color-surface-container)", fontFamily: "var(--font-sans)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { id: "INC-2047", title: "SSH Brute Force — 192.168.10.45", sev: "Critical", sevBg: "#fef2f2", sevColor: "#dc2626", status: "Resolved",   stColor: "#10B981", res: "14 min" },
            { id: "INC-2044", title: "Lateral Movement — AD01",          sev: "Critical", sevBg: "#fef2f2", sevColor: "#dc2626", status: "Resolved",   stColor: "#10B981", res: "22 min" },
            { id: "INC-2041", title: "Data Exfiltration — joko@corp.id", sev: "High",     sevBg: "#fffbeb", sevColor: "#d97706", status: "Monitoring", stColor: "#F59E0B", res: "In progress" },
            { id: "INC-2038", title: "Suspicious PowerShell Execution",  sev: "High",     sevBg: "#fffbeb", sevColor: "#d97706", status: "Resolved",   stColor: "#10B981", res: "31 min" },
          ].map((row) => (
            <tr key={row.id} style={{ borderBottom: "1px solid var(--color-surface-container-low)" }}>
              <td style={{ padding: "10px 0", fontFamily: "monospace", color: "var(--color-primary)", fontSize: 11 }}>{row.id}</td>
              <td style={{ padding: "10px 8px", color: "var(--color-on-surface-variant)", fontFamily: "var(--font-sans)" }}>{row.title}</td>
              <td style={{ padding: "10px 8px" }}>
                <span style={{ fontSize: 10, fontWeight: 600, fontFamily: "monospace", padding: "2px 6px", borderRadius: 4, background: row.sevBg, color: row.sevColor }}>{row.sev}</span>
              </td>
              <td style={{ padding: "10px 8px", fontWeight: 500, color: row.stColor, fontFamily: "var(--font-sans)" }}>{row.status}</td>
              <td style={{ padding: "10px 0", color: "var(--color-outline)", fontFamily: "var(--font-sans)" }}>{row.res}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Recommendations */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-on-surface)", fontFamily: "var(--font-headline)" }}>Recommendations</span>
        <div style={{ flex: 1, height: 1, background: "var(--color-surface-container)" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { n: 1, text: "Block IP range 192.168.10.0/24 at perimeter firewall. The attacker IP has 47 abuse reports in the last 30 days on AbuseIPDB.", prio: "HIGH",   prioBg: "#fef2f2", prioColor: "#dc2626" },
          { n: 2, text: "Rotate credentials for all accounts targeted in the brute force campaign (root, admin, ubuntu) and enforce MFA on SSH access.", prio: "HIGH",   prioBg: "#fef2f2", prioColor: "#dc2626" },
          { n: 3, text: "Investigate user joko@corp.id for potential insider threat — 4.2 GB upload at 2 AM is anomalous and warrants HR review.", prio: "MEDIUM", prioBg: "#fffbeb", prioColor: "#d97706" },
          { n: 4, text: "Patch Active Directory server AD01 for CVE-2025-33071. The lateral movement exploited a known privilege escalation vulnerability.", prio: "HIGH",   prioBg: "#fef2f2", prioColor: "#dc2626" },
        ].map((r) => (
          <div key={r.n} style={{ display: "flex", gap: 12, paddingBottom: 10, borderBottom: "1px solid var(--color-surface-container-low)" }}>
            <div style={{ width: 24, height: 24, borderRadius: 8, background: "var(--color-surface-container-low)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--color-primary)", flexShrink: 0, marginTop: 2 }}>{r.n}</div>
            <p style={{ fontSize: 12, color: "var(--color-on-surface-variant)", lineHeight: 1.6, flex: 1, fontFamily: "var(--font-sans)" }}>
              {r.text}
              <span style={{ display: "inline-block", fontSize: 9, fontWeight: 700, fontFamily: "monospace", padding: "2px 6px", borderRadius: 4, marginLeft: 8, background: r.prioBg, color: r.prioColor }}>{r.prio}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RawDataTab ───────────────────────────────────────────────────────────────

function RawDataTab() {
  const [open, setOpen] = useState<Record<string, boolean>>({
    report_metadata: true,
    alert_statistics: true,
    sla_metrics: false,
    top_incidents: false,
    data_sources: false,
  });

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem" }}>
      <div style={{ ...card, overflow: "hidden", maxWidth: 860, margin: "0 auto" }}>
        {/* Header bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--color-surface-container)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
            <span style={{ marginLeft: 8, fontSize: 12, fontFamily: "monospace", color: "var(--color-outline)" }}>RPT-20260425-001.json</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, fontFamily: "monospace", color: "var(--color-outline)" }}>
            <span>5 sections</span>
            <span style={{ width: 1, height: 12, background: "var(--color-surface-container)" }} />
            <span style={{ color: "#10B981" }}>✓ valid JSON</span>
          </div>
        </div>

        {/* JSON viewer */}
        <div style={{ padding: "1.25rem", fontFamily: "monospace", fontSize: 12, lineHeight: 1.6, background: "var(--color-surface-container-lowest)" }}>
          <div style={{ color: "var(--color-outline)" }}>{"{"}</div>
          {rawDataSections.map((section) => (
            <div key={section.key} style={{ marginBottom: 4 }}>
              <button
                onClick={() => setOpen((prev) => ({ ...prev, [section.key]: !prev[section.key] }))}
                style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", paddingLeft: 16, borderRadius: 6, padding: "2px 8px 2px 16px" }}
              >
                <svg
                  width="10" height="10" viewBox="0 0 10 10"
                  style={{ color: "var(--color-outline)", transition: "transform 0.15s", transform: open[section.key] ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0 }}
                  fill="currentColor"
                >
                  <path d="M3 2l4 3-4 3V2z"/>
                </svg>
                <span className={section.color} style={{ fontWeight: 600 }}>&quot;{section.label}&quot;</span>
                <span style={{ color: "var(--color-outline)" }}>:</span>
                <span style={{ color: "var(--color-outline)", marginLeft: 4 }}>{open[section.key] ? "{" : "{ … }"}</span>
              </button>

              {open[section.key] && (
                <div style={{ paddingLeft: 40, marginTop: 2, marginBottom: 4, borderLeft: "1px solid var(--color-surface-container)", marginLeft: 24 }}>
                  {section.fields.map((f, fi) => (
                    <div key={fi} style={{ display: "flex", alignItems: "baseline", gap: 6, padding: "2px 0" }}>
                      <span style={{ color: "var(--color-outline)", flexShrink: 0 }}>&quot;{f.k}&quot;</span>
                      <span style={{ color: "var(--color-outline)" }}>:</span>
                      <span className={f.vc}>{f.v}</span>
                      {fi < section.fields.length - 1 && <span style={{ color: "var(--color-surface-container-high)" }}>,</span>}
                    </div>
                  ))}
                  <div style={{ color: "var(--color-outline)", marginTop: 2 }}>{"}"}{section.key !== rawDataSections[rawDataSections.length - 1].key ? "," : ""}</div>
                </div>
              )}
            </div>
          ))}
          <div style={{ color: "var(--color-outline)", marginTop: 4 }}>{"}"}</div>
        </div>

        {/* Footer */}
        <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--color-surface-container)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--color-outline)" }}>Queried 5 data sources · 18,975 raw events processed</span>
          <button style={{ fontSize: 11, fontFamily: "monospace", color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Copy JSON</button>
        </div>
      </div>
    </div>
  );
}

// ─── HistoryTab ───────────────────────────────────────────────────────────────

function HistoryTab() {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem" }}>
      <div style={{ ...card, overflow: "hidden", maxWidth: 860, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--color-surface-container)" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)", fontFamily: "var(--font-headline)" }}>Generation History</p>
            <p style={{ fontSize: 11, color: "var(--color-outline)", marginTop: 2, fontFamily: "var(--font-sans)" }}>{historyItems.length} reports · last 30 days</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontFamily: "monospace", color: "var(--color-outline)", background: "var(--color-surface-container-low)", borderRadius: "0.5rem", padding: "6px 12px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--color-outline)" }}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            <span>All types</span>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-surface-container)" }}>
              {["Report", "Type", "Generated", "Pages", "Size", "Status", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 20px", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-outline)", fontFamily: "var(--font-sans)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {historyItems.map((item, i) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: "1px solid var(--color-surface-container-low)",
                  background: i === 0 ? "var(--color-surface-container-low)" : "transparent",
                  transition: "background 0.15s",
                }}
              >
                <td style={{ padding: "12px 20px" }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-on-surface)", fontFamily: "var(--font-sans)" }}>{item.title}</div>
                  <div style={{ fontSize: 10, fontFamily: "monospace", color: "var(--color-outline)", marginTop: 2 }}>{item.id}</div>
                </td>
                <td style={{ padding: "12px 20px" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "monospace", padding: "3px 8px", borderRadius: 9999, ...typeBadgeStyle[item.type] }}>{item.type}</span>
                </td>
                <td style={{ padding: "12px 20px" }}>
                  <div style={{ fontSize: 12, color: "var(--color-on-surface-variant)", fontFamily: "var(--font-sans)" }}>{item.date}</div>
                  <div style={{ fontSize: 10, fontFamily: "monospace", color: "var(--color-outline)" }}>{item.time} WIB · {item.agent}</div>
                </td>
                <td style={{ padding: "12px 20px", fontFamily: "monospace", color: "var(--color-outline)" }}>{item.pages}</td>
                <td style={{ padding: "12px 20px", fontFamily: "monospace", color: "var(--color-outline)" }}>{item.size}</td>
                <td style={{ padding: "12px 20px" }}>
                  {item.status === "ready" ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: "monospace", color: "#10B981" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />Ready
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: "monospace", color: "var(--color-outline)" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-outline)", display: "inline-block" }} />Archived
                    </span>
                  )}
                </td>
                <td style={{ padding: "12px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <button style={{ fontSize: 11, fontFamily: "monospace", color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>View</button>
                    <button style={{ fontSize: 11, fontFamily: "monospace", color: "var(--color-outline)", background: "none", border: "none", cursor: "pointer" }}>PDF</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--color-surface-container)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--color-outline)" }}>Showing 6 of 6 reports</span>
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--color-outline)" }}>Reports auto-deleted after 90 days</span>
        </div>
      </div>
    </div>
  );
}

// ─── HumanReviewModal ─────────────────────────────────────────────────────────

function HumanReviewModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        background: "rgba(25,28,30,0.5)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div style={{ ...card, padding: "2rem", maxWidth: 460, width: "90%", fontFamily: "var(--font-sans)" }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: "var(--color-on-surface)", marginBottom: "0.5rem", fontFamily: "var(--font-headline)" }}>
          ⚠ Tinjau Sebelum Dikirim
        </p>
        <p style={{ fontSize: 13, color: "var(--color-on-surface-variant)", marginBottom: "1rem" }}>
          Laporan ini mengandung temuan kritis:
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0", display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "DMARC tidak dikonfigurasi", badge: "Berisiko", bg: "var(--color-error-container)", color: "var(--color-error)" },
            { label: "Port RDP terbuka ke internet", badge: "Perlu Perhatian", bg: "#fffbeb", color: "#d97706" },
            { label: "Retensi log 7 hari (OJK: 90 hari)", badge: "Berisiko", bg: "var(--color-error-container)", color: "var(--color-error)" },
          ].map((item) => (
            <li key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--color-surface-container-low)", borderRadius: "0.75rem", padding: "0.625rem 0.875rem" }}>
              <span style={{ fontSize: 13, color: "var(--color-on-surface)" }}>{item.label}</span>
              <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "monospace", padding: "3px 8px", borderRadius: 9999, background: item.bg, color: item.color }}>{item.badge}</span>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{ ...pillGhost, fontSize: 13, fontWeight: 600, padding: "0.5rem 1.25rem" }}
          >
            Batalkan
          </button>
          <button
            onClick={onConfirm}
            style={{ ...pillPrimary, fontSize: 13, fontWeight: 600, padding: "0.5rem 1.5rem" }}
          >
            Konfirmasi & Kirim
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type AudienceTab = "direktur" | "it" | "finance" | "auditor";

export default function ReportsPage() {
  const router = useRouter();
  const [session, setSession] = useState<SSSession | null>(null);

  const [prompt, setPrompt] = useState(quickItems[0].prompt);
  const [activeQuick, setActiveQuick] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [audienceTab, setAudienceTab] = useState<AudienceTab>("direktur");
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(-1);
  const [showReport, setShowReport] = useState(true);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  useEffect(() => {
    const sess = getSession();
    if (!sess) { router.replace("/login"); return; }
    setSession(sess);
  }, [router]);

  if (!session) return null;

  function generate() {
    setGenerating(true);
    setShowReport(false);
    setActiveTab(0);
    setGenStep(0);
    let i = 0;
    const tick = () => {
      setGenStep(i);
      i++;
      if (i < genSteps.length) setTimeout(tick, 650);
      else setTimeout(() => { setGenerating(false); setShowReport(true); setGenStep(-1); }, 700);
    };
    setTimeout(tick, 100);
  }

  function handleExportAction(action: string) {
    if (activeTab === 0) {
      setPendingAction(action);
      setShowReviewModal(true);
    } else if (action === "Export PDF") {
      setPdfPreview(true);
    }
  }

  const audienceTabs: { id: AudienceTab; label: string }[] = [
    { id: "direktur", label: "Direktur" },
    { id: "it",       label: "Manajer IT" },
    { id: "finance",  label: "Keuangan" },
    { id: "auditor",  label: "Auditor" },
  ];

  return (
    <>
    <div style={{ display: "flex", height: "100%", overflow: "hidden", fontFamily: "var(--font-sans)" }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside style={{ width: 244, flexShrink: 0, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--color-surface-container-low)" }}>

        {/* Quick Generate */}
        <div style={{ padding: "0.875rem", borderBottom: "1px solid var(--color-surface-container)" }}>
          <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-outline)", marginBottom: 8, fontFamily: "var(--font-headline)" }}>Quick Generate</p>
          {quickItems.map((item, i) => (
            <button
              key={i}
              onClick={() => { setActiveQuick(i); setPrompt(item.prompt); }}
              style={{
                width: "100%", textAlign: "left", display: "flex", alignItems: "flex-start", gap: 8,
                padding: "8px 12px", borderRadius: "0.75rem", marginBottom: 4, fontSize: 12,
                border: "none", cursor: "pointer", transition: "background 0.15s",
                background: activeQuick === i ? "var(--color-primary-fixed)" : "transparent",
                color: activeQuick === i ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                fontFamily: "var(--font-sans)",
              }}
            >
              <span style={{ marginTop: 1, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ lineHeight: 1.4 }}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Templates */}
        <div style={{ padding: "0.75rem 0.875rem", borderBottom: "1px solid var(--color-surface-container)" }}>
          <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-outline)", marginBottom: 8, fontFamily: "var(--font-headline)" }}>Templates</p>
          {templates.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px", borderRadius: "0.75rem", cursor: "pointer" }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: "var(--color-surface-container)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>{t.icon}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-on-surface-variant)", fontFamily: "var(--font-sans)" }}>{t.name}</div>
                <div style={{ fontSize: 9, fontFamily: "monospace", color: "var(--color-outline)" }}>{t.type}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Reports */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ padding: "0.625rem 0.875rem", borderBottom: "1px solid var(--color-surface-container)" }}>
            <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-outline)", fontFamily: "var(--font-headline)" }}>Recent Reports</p>
          </div>
          {recent.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "1px solid var(--color-surface-container-low)", cursor: "pointer" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-outline)", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, color: "var(--color-on-surface-variant)", fontFamily: "var(--font-sans)" }}>{r.name}</div>
                <div style={{ fontSize: 10, fontFamily: "monospace", color: "var(--color-outline)" }}>{r.date}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{ height: 52, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", background: "var(--color-surface-container-low)", borderBottom: "1px solid var(--color-surface-container)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, background: "var(--color-primary)", clipPath: "polygon(50% 0%,100% 22%,100% 68%,50% 100%,0% 68%,0% 22%)" }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--color-on-surface)", fontFamily: "var(--font-headline)" }}>AI Report Generator</span>
          </div>
          <span style={{ fontSize: 11, fontFamily: "monospace", padding: "4px 10px", background: "#fef3c7", color: "#92400e", borderRadius: 9999 }}>Auto Reporting</span>
        </div>

        {/* Prompt bar */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 12, padding: "0.75rem 1.25rem", background: "var(--color-surface-container-low)", borderBottom: "1px solid var(--color-surface-container)" }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: "var(--font-headline)" }}>AI</div>
          <input
            style={{ flex: 1, height: 40, padding: "0 14px", background: "var(--color-surface-container-lowest)", borderRadius: "1.5rem", border: "none", fontSize: 13, color: "var(--color-on-surface)", fontFamily: "var(--font-sans)", outline: "none", boxShadow: "0 0 0 1.5px var(--color-surface-container)" }}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the report you need…"
            onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px var(--color-primary)")}
            onBlur={(e) => (e.currentTarget.style.boxShadow = "0 0 0 1.5px var(--color-surface-container)")}
          />
          <button
            onClick={generate}
            disabled={generating}
            style={{ ...pillPrimary, padding: "0 1.25rem", height: 40, fontSize: 13, fontWeight: 600, opacity: generating ? 0.4 : 1, whiteSpace: "nowrap" }}
          >
            {generating ? "Generating…" : "Generate →"}
          </button>
        </div>

        {/* Audience tabs */}
        <div style={{ flexShrink: 0, padding: "0.75rem 1.25rem 0", background: "var(--color-surface)", borderBottom: "1px solid var(--color-surface-container)" }}>
          <p style={{ fontSize: 11, color: "var(--color-on-surface-variant)", marginBottom: 8, fontFamily: "var(--font-sans)" }}>Tampilkan laporan sebagai:</p>
          <div style={{ display: "flex", gap: 6, paddingBottom: "0.75rem" }}>
            {audienceTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAudienceTab(tab.id)}
                style={{
                  fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 9999, border: "none", cursor: "pointer",
                  fontFamily: "var(--font-sans)", transition: "all 0.15s",
                  ...(audienceTab === tab.id
                    ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))", color: "#fff" }
                    : { background: "var(--color-surface-container)", color: "var(--color-on-surface-variant)" }),
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report view tabs */}
        <div style={{ flexShrink: 0, display: "flex", padding: "0 1.25rem", background: "var(--color-surface)", borderBottom: "1px solid var(--color-surface-container)" }}>
          {["Report Preview", "Raw Data", "History"].map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "10px 16px", fontSize: 13, fontWeight: 500, border: "none",
                background: "transparent", cursor: "pointer", fontFamily: "var(--font-sans)",
                borderBottom: activeTab === i ? "2px solid var(--color-primary)" : "2px solid transparent",
                color: activeTab === i ? "var(--color-primary)" : "var(--color-outline)",
                marginBottom: -1, transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Generating state */}
        {generating && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, background: "var(--color-surface)" }}>
            <div style={{ width: 36, height: 36, border: "3px solid var(--color-surface-container)", borderTopColor: "var(--color-primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {genSteps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, fontSize: 12, fontFamily: "monospace",
                    color: i < genStep ? "#10B981" : i === genStep ? "var(--color-primary)" : "var(--color-outline)",
                    transition: "color 0.2s",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report Preview tab */}
        {!generating && activeTab === 0 && showReport && (
          <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem", background: "var(--color-surface)" }}>
            {/* Watermark notice banner */}
            <div style={{ background: "#fef3c7", borderRadius: "1rem", padding: "0.75rem 1rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#92400e", fontFamily: "var(--font-sans)" }}>⚠ Tier Gratis — pratinjau bertanda air. Upgrade untuk PDF bersih siap audit.</span>
              <button style={{ ...pillPrimary, fontSize: 12, fontWeight: 600, padding: "6px 14px" }}>Upgrade →</button>
            </div>

            {/* Report card with diagonal watermark */}
            <div style={{ ...card, padding: "2rem", maxWidth: 780, margin: "0 auto", position: "relative", overflow: "hidden" }}>
              {/* Diagonal watermark overlay */}
              <div
                style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  justifyContent: "center", pointerEvents: "none", zIndex: 10,
                  transform: "rotate(-30deg)",
                }}
              >
                <span style={{ fontSize: "4rem", fontWeight: 700, color: "rgba(0,78,71,0.06)", letterSpacing: "0.2em", whiteSpace: "nowrap", fontFamily: "var(--font-headline)" }}>
                  PRATINJAU · PREVIEW
                </span>
              </div>
              <ReportContent />
            </div>
          </div>
        )}

        {!generating && activeTab === 1 && <RawDataTab />}
        {!generating && activeTab === 2 && <HistoryTab />}

        {/* Bottom toolbar */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "0.625rem 1.25rem", background: "var(--color-surface-container-low)", borderTop: "1px solid var(--color-surface-container)" }}>
          <button
            onClick={() => handleExportAction("Export PDF")}
            style={{ ...pillPrimary, fontSize: 12, fontWeight: 600, padding: "6px 14px" }}
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExportAction("Send via Email")}
            style={{ ...pillGhost, fontSize: 12, fontWeight: 600, padding: "6px 14px" }}
          >
            Send via Email
          </button>
          {["Edit", "Schedule Weekly"].map((label) => (
            <button key={label} style={{ ...pillGhost, fontSize: 12, fontWeight: 600, padding: "6px 14px" }}>{label}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: "monospace", color: "#10B981" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
            Report ready
          </div>
        </div>

      </div>
    </div>

    {/* ── Human Review Modal ───────────────────────────────────────────────── */}
    {showReviewModal && (
      <HumanReviewModal
        onCancel={() => { setShowReviewModal(false); setPendingAction(null); }}
        onConfirm={() => {
          setShowReviewModal(false);
          if (pendingAction === "Export PDF") setPdfPreview(true);
          setPendingAction(null);
        }}
      />
    )}

    {/* ── PDF Preview Modal ────────────────────────────────────────────────── */}
    {pdfPreview && (
      <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", background: "rgba(15,23,42,0.82)", backdropFilter: "blur(6px)" }}>

        {/* Viewer toolbar */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 12, padding: "0 1.25rem", height: 52, borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,23,42,0.9)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 16 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "#94a3b8", flexShrink: 0 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0", fontFamily: "var(--font-sans)" }}>Weekly_Security_Report_Apr2026.pdf</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontFamily: "monospace", color: "#94a3b8", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 12px" }}>
            <span>Page 1 / 1</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: "monospace", color: "#94a3b8", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 12px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            <span>100%</span>
          </div>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => window.print()}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer", background: "var(--color-primary)", color: "#fff", fontFamily: "var(--font-sans)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download PDF
          </button>
          <button
            onClick={() => setPdfPreview(false)}
            style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Viewer body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "2rem 1rem", background: "#374151" }}>
          <div
            id="pdf-print-root"
            style={{ margin: "0 auto", background: "#fff", borderRadius: 4, boxShadow: "0 25px 60px rgba(0,0,0,0.5)", padding: 52, width: 794, minHeight: 1123, fontFamily: "Inter, sans-serif" }}
          >
            <ReportContent />
          </div>
        </div>

      </div>
    )}

    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
