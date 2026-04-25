"use client";

import { useState } from "react";

const quickItems = [
  { icon: "📊", label: "Weekly security report",        prompt: "Generate a weekly security report for this week" },
  { icon: "🚨", label: "Incident report — SSH attack",  prompt: "Generate an incident report for the SSH brute force attack INC-2047" },
  { icon: "👔", label: "Executive board summary",       prompt: "Generate an executive board summary of top threats this month" },
  { icon: "⚖️", label: "OJK compliance report",         prompt: "Generate a compliance report for OJK POJK 11/2022" },
];

const templates = [
  { icon: "🚨", name: "Incident Report",     type: "TEMPLATE" },
  { icon: "📈", name: "Weekly SOC Summary",  type: "TEMPLATE" },
  { icon: "⚖️", name: "Compliance Report",   type: "TEMPLATE" },
  { icon: "👔", name: "Executive Briefing",  type: "TEMPLATE" },
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

function ReportContent() {
  return (
    <div id="pdf-report-content">
      {/* Doc header */}
      <div className="flex items-start justify-between mb-6 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#0D9488]" style={{ clipPath: "polygon(50% 0%,100% 22%,100% 68%,50% 100%,0% 68%,0% 22%)" }} />
          <span className="text-[13px] font-semibold text-[#0D9488]">Shannon Sentinel</span>
        </div>
        <div className="text-right text-[11px] font-mono text-slate-400 leading-relaxed">
          Generated: 25 Apr 2026, 14:30 WIB<br />
          Prepared by: AI Agent v2.1<br />
          Classification: INTERNAL
        </div>
      </div>

      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0D9488] mb-1.5">Weekly Security Report</p>
      <h1 className="text-[24px] font-semibold text-slate-900 leading-tight mb-1.5" style={{ fontFamily: "Georgia, serif" }}>Weekly Security Operations Summary</h1>
      <p className="text-[12px] text-slate-400 mb-6">Period: 19 April – 25 April 2026 · PT Contoh Tbk · Prepared by Shannon Sentinel AI</p>

      {/* Executive summary */}
      <div className="bg-[#F0FDFA] border-l-4 border-[#0D9488] rounded-r-xl px-4 py-3.5 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#0D9488] mb-1.5">Executive Summary</p>
        <p className="text-[13px] text-slate-600 leading-relaxed">This week saw a <strong>38% increase in alert volume</strong> driven primarily by an SSH brute force campaign targeting authentication infrastructure. The SOC detected and contained all critical incidents within SLA. <strong>12 incidents</strong> were escalated to analysts — all resolved. No confirmed data breaches. AI auto-triage handled <strong>92% of alerts automatically</strong>.</p>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Key Metrics</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {[
          { val: "12",    label: "Incidents this week", color: "text-[#EF4444]" },
          { val: "4.2m",  label: "Avg detection time",  color: "text-[#0D9488]" },
          { val: "94%",   label: "SLA compliance",      color: "text-[#10B981]" },
          { val: "1,847", label: "Total alerts",        color: "text-[#F59E0B]" },
          { val: "18m",   label: "Avg response time",   color: "text-[#10B981]" },
          { val: "92%",   label: "AI auto-triaged",     color: "text-[#3B82F6]" },
        ].map((m) => (
          <div key={m.label} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
            <div className={`text-2xl font-bold font-mono leading-none mb-1 ${m.color}`}>{m.val}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Incidents table */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Top Incidents This Week</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      <table className="w-full text-[12px] mb-6">
        <thead>
          <tr>
            {["ID", "Title", "Severity", "Status", "Resolution"].map((h) => (
              <th key={h} className="text-left pb-2 text-[10px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-200">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { id: "INC-2047", title: "SSH Brute Force — 192.168.10.45", sev: "Critical", sevCls: "bg-red-50 text-red-600",    status: "Resolved",   stCls: "text-[#10B981]", res: "14 min" },
            { id: "INC-2044", title: "Lateral Movement — AD01",          sev: "Critical", sevCls: "bg-red-50 text-red-600",    status: "Resolved",   stCls: "text-[#10B981]", res: "22 min" },
            { id: "INC-2041", title: "Data Exfiltration — joko@corp.id", sev: "High",     sevCls: "bg-amber-50 text-amber-600",status: "Monitoring", stCls: "text-[#F59E0B]", res: "In progress" },
            { id: "INC-2038", title: "Suspicious PowerShell Execution",  sev: "High",     sevCls: "bg-amber-50 text-amber-600",status: "Resolved",   stCls: "text-[#10B981]", res: "31 min" },
          ].map((row) => (
            <tr key={row.id} className="border-b border-slate-100">
              <td className="py-2.5 font-mono text-[#0D9488] text-[11px]">{row.id}</td>
              <td className="py-2.5 text-slate-600">{row.title}</td>
              <td className="py-2.5"><span className={`text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded ${row.sevCls}`}>{row.sev}</span></td>
              <td className={`py-2.5 font-medium ${row.stCls}`}>{row.status}</td>
              <td className="py-2.5 text-slate-500">{row.res}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Recommendations */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Recommendations</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      <div className="space-y-2.5">
        {[
          { n: 1, text: "Block IP range 192.168.10.0/24 at perimeter firewall. The attacker IP has 47 abuse reports in the last 30 days on AbuseIPDB.", prio: "HIGH",   prioCls: "bg-red-50 text-red-600" },
          { n: 2, text: "Rotate credentials for all accounts targeted in the brute force campaign (root, admin, ubuntu) and enforce MFA on SSH access.", prio: "HIGH",   prioCls: "bg-red-50 text-red-600" },
          { n: 3, text: "Investigate user joko@corp.id for potential insider threat — 4.2 GB upload at 2 AM is anomalous and warrants HR review.", prio: "MEDIUM", prioCls: "bg-amber-50 text-amber-600" },
          { n: 4, text: "Patch Active Directory server AD01 for CVE-2025-33071. The lateral movement exploited a known privilege escalation vulnerability.", prio: "HIGH",   prioCls: "bg-red-50 text-red-600" },
        ].map((r) => (
          <div key={r.n} className="flex gap-3 py-2.5 border-b border-slate-100 last:border-0">
            <div className="w-6 h-6 rounded-lg bg-[#F0FDFA] border border-[#99F6E4] flex items-center justify-center text-[11px] font-bold text-[#0D9488] shrink-0 mt-0.5">{r.n}</div>
            <p className="text-[12px] text-slate-600 leading-relaxed flex-1">
              {r.text}
              <span className={`inline-block text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ml-2 ${r.prioCls}`}>{r.prio}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [prompt, setPrompt] = useState(quickItems[0].prompt);
  const [activeQuick, setActiveQuick] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(-1);
  const [showReport, setShowReport] = useState(true);
  const [pdfPreview, setPdfPreview] = useState(false);

  function generate() {
    setGenerating(true);
    setShowReport(false);
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

  return (
    <>
    <div className="flex h-full overflow-hidden">

      {/* Sidebar */}
      <aside className="glass-sidebar w-[244px] shrink-0 flex flex-col overflow-hidden">
        <div className="px-3.5 py-3.5 border-b border-white/40">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Quick Generate</p>
          {quickItems.map((item, i) => (
            <button
              key={i}
              onClick={() => { setActiveQuick(i); setPrompt(item.prompt); }}
              className={`w-full text-left flex items-start gap-2 px-3 py-2 rounded-xl mb-1 text-[12px] transition-all border ${
                activeQuick === i
                  ? "bg-primary-light/70 text-primary border-primary-border/50"
                  : "text-slate-600 border-transparent hover:bg-white/40 hover:border-white/60"
              }`}
            >
              <span className="mt-0.5 shrink-0">{item.icon}</span>
              <span className="leading-snug">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="px-3.5 py-3 border-b border-white/40">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Templates</p>
          {templates.map((t, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-white/40 cursor-pointer transition-colors">
              <div className="w-6 h-6 rounded-lg bg-white/50 border border-white/60 flex items-center justify-center text-[12px] shrink-0">{t.icon}</div>
              <div>
                <div className="text-[12px] font-medium text-slate-600">{t.name}</div>
                <div className="text-[9px] font-mono text-slate-400">{t.type}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto scroll-thin">
          <div className="px-3.5 py-2.5 border-b border-white/30">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Recent Reports</p>
          </div>
          {recent.map((r, i) => (
            <div key={i} className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-white/25 last:border-0 hover:bg-white/30 cursor-pointer transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
              <div>
                <div className="text-[12px] text-slate-600">{r.name}</div>
                <div className="text-[10px] font-mono text-slate-400">{r.date}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="glass-bar h-[52px] shrink-0 flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary" style={{ clipPath: "polygon(50% 0%,100% 22%,100% 68%,50% 100%,0% 68%,0% 22%)" }} />
            <span className="text-[15px] font-semibold text-slate-900">Shannon Sentinel</span>
            <span className="text-slate-300 mx-1">/</span>
            <span className="text-[13px] font-medium text-slate-500">AI Report Generator</span>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 bg-warning-light/70 text-warning border border-warning-border/60 rounded-full">Auto Reporting</span>
        </div>

        {/* Prompt bar */}
        <div className="glass-bar border-t-0 border-b border-white/40 px-5 py-3 shrink-0 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-[12px] font-bold shrink-0">AI</div>
          <input
            className="flex-1 h-10 px-3.5 glass-input rounded-xl text-[13px] text-slate-800 placeholder:text-slate-400"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the report you need…"
          />
          <button
            onClick={generate}
            disabled={generating}
            className="px-5 h-10 bg-primary/90 backdrop-blur-sm text-white text-[13px] font-semibold rounded-xl hover:bg-primary transition-colors disabled:opacity-40 whitespace-nowrap"
          >
            {generating ? "Generating…" : "Generate →"}
          </button>
        </div>

        {/* Tabs */}
        <div className="glass-bar border-b border-white/40 px-5 flex shrink-0">
          {["Report Preview", "Raw Data", "History"].map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-all ${
                activeTab === i ? "text-primary border-primary" : "text-slate-400 border-transparent hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Generating state */}
        {generating && (
          <div className="flex-1 flex flex-col items-center justify-center gap-5">
            <div className="w-9 h-9 border-[3px] border-slate-200 border-t-primary rounded-full animate-spin-slow" />
            <div className="space-y-2">
              {genSteps.map((step, i) => (
                <div key={i} className={`flex items-center gap-2.5 text-[12px] font-mono transition-colors ${
                  i < genStep ? "text-success" : i === genStep ? "text-primary" : "text-slate-400"
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report preview */}
        {showReport && !generating && (
          <div className="flex-1 overflow-y-auto scroll-thin px-6 py-5">
            <div className="glass rounded-2xl p-8 max-w-[780px] mx-auto animate-fade-up">
              <ReportContent />
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="glass-bar border-t border-white/40 px-5 py-2.5 shrink-0 flex items-center gap-2">
          <button
            onClick={() => setPdfPreview(true)}
            className="text-[12px] font-medium px-3.5 py-1.5 rounded-lg transition-colors bg-primary-light/70 text-primary border border-primary-border/50 hover:bg-primary-mid/50"
          >
            Export PDF
          </button>
          {["Send via Email", "Edit", "Schedule Weekly"].map((label) => (
            <button key={label} className="text-[12px] font-medium px-3.5 py-1.5 rounded-lg transition-colors glass-btn text-slate-600">
              {label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5 text-[11px] font-mono text-success">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Report ready
          </div>
        </div>

      </div>
    </div>

    {/* PDF Preview Modal */}
    {pdfPreview && (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(15,23,42,0.82)", backdropFilter: "blur(6px)" }}>

        {/* Viewer toolbar */}
        <div className="shrink-0 flex items-center gap-3 px-5 h-[52px] border-b border-white/10" style={{ background: "rgba(15,23,42,0.90)" }}>
          {/* File info */}
          <div className="flex items-center gap-2 mr-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-slate-400 shrink-0">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>
            </svg>
            <span className="text-[13px] font-medium text-slate-200">Weekly_Security_Report_Apr2026.pdf</span>
          </div>

          {/* Page + zoom */}
          <div className="flex items-center gap-2 text-[12px] font-mono text-slate-400 border border-white/10 rounded-lg px-3 py-1.5" style={{ background: "rgba(255,255,255,0.05)" }}>
            <span>Page 1 / 1</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] font-mono text-slate-400 border border-white/10 rounded-lg px-3 py-1.5" style={{ background: "rgba(255,255,255,0.05)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            <span>100%</span>
          </div>

          <div className="flex-1" />

          {/* Download button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-[12px] font-semibold px-4 py-1.5 rounded-lg transition-all"
            style={{ background: "#0D9488", color: "#fff" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download PDF
          </button>

          {/* Close */}
          <button
            onClick={() => setPdfPreview(false)}
            className="ml-1 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Viewer body */}
        <div className="flex-1 overflow-y-auto scroll-thin py-8 px-4" style={{ background: "#374151" }}>
          {/* A4 page */}
          <div
            id="pdf-print-root"
            className="mx-auto bg-white rounded shadow-2xl p-[52px]"
            style={{ width: "794px", minHeight: "1123px", fontFamily: "Inter, sans-serif" }}
          >
            <ReportContent />
          </div>
        </div>

      </div>
    )}
    </>
  );
}
