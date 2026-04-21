export default function IncidentsPage() {
  return (
    <div className="h-full overflow-y-auto p-6 bg-white custom-scrollbar">

      {/* Header */}
      <div className="flex justify-between items-start mb-6 border-b border-[#e0e0e0] pb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="bg-[#da1e28] text-white text-[10px] px-2 py-0.5 font-bold tracking-wider">
              CRITICAL
            </span>
            <h1 className="text-2xl font-semibold tracking-tight">
              INC-2024-0812: Advanced Persistence Threat
            </h1>
          </div>
          <p className="text-[#6f6f6f] text-sm">
            Detected: 12 Aug 2024 14:22:01 · Assigned to: Lead Analyst Chen
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 h-10 border border-[#0f62fe] text-[#0f62fe] text-sm font-semibold hover:bg-[#d0e2ff] transition-colors">
            <span className="material-symbols-outlined text-sm">share</span> Export Report
          </button>
          <button className="flex items-center gap-2 px-4 h-10 bg-[#0f62fe] text-white text-sm font-semibold hover:bg-[#0043ce] transition-colors">
            <span className="material-symbols-outlined text-sm">check_circle</span> Resolve Incident
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-12 gap-6">

        {/* Left Column */}
        <div className="col-span-8 flex flex-col gap-6">

          {/* Map + Metrics */}
          <div className="grid grid-cols-2 gap-4">

            {/* Map */}
            <div className="bg-[#f4f4f4] p-4 min-h-[300px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest">
                  Target Node Location
                </h3>
                <span className="text-xs text-[#0f62fe] font-mono">192.168.1.104 (Dallas, US)</span>
              </div>
              <div className="flex-1 bg-[#1a1a2e] relative overflow-hidden"
                style={{ backgroundImage: "linear-gradient(rgba(15,98,254,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(15,98,254,0.1) 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 220" fill="none">
                  <path d="M60 80 Q80 60 110 70 L130 90 Q120 110 100 105 Z" fill="#0f62fe" />
                  <path d="M160 60 Q200 40 240 55 L260 80 Q250 110 220 115 Q190 120 165 100 Z" fill="#0f62fe" />
                  <path d="M270 70 Q300 60 320 75 L325 95 Q310 105 285 100 Z" fill="#0f62fe" />
                  <path d="M170 120 Q185 115 195 125 L192 145 Q178 150 170 138 Z" fill="#0f62fe" />
                  <path d="M280 110 Q310 100 330 115 L335 140 Q320 155 295 150 Q270 145 275 128 Z" fill="#0f62fe" />
                </svg>
                <div className="absolute" style={{ left: "22%", top: "42%" }}>
                  <div className="w-6 h-6 bg-[#da1e28]/20 border-2 border-[#da1e28] rounded-full animate-ping absolute -translate-x-1/2 -translate-y-1/2" />
                  <div className="w-3 h-3 bg-[#da1e28] rounded-full absolute -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f4f4f4] p-4 flex flex-col justify-between">
                <span className="text-[#6f6f6f] text-xs">Exfiltrated Data</span>
                <div>
                  <div className="text-2xl font-bold">14.2 GB</div>
                  <div className="text-[10px] text-[#da1e28] font-semibold flex items-center mt-1">
                    <span className="material-symbols-outlined text-[12px] mr-1">trending_up</span>
                    HIGH RISK
                  </div>
                </div>
              </div>
              <div className="bg-[#f4f4f4] p-4 flex flex-col justify-between">
                <span className="text-[#6f6f6f] text-xs">Time to Detect</span>
                <div>
                  <div className="text-2xl font-bold">42m 12s</div>
                  <div className="text-[10px] text-[#198038] font-semibold flex items-center mt-1">
                    <span className="material-symbols-outlined text-[12px] mr-1">bolt</span>
                    TOP 5% SPEED
                  </div>
                </div>
              </div>
              <div className="bg-[#f4f4f4] p-4 col-span-2 flex flex-col justify-between">
                <span className="text-[#6f6f6f] text-xs">Blast Radius</span>
                <div className="w-full bg-[#c6c6c6] h-2 mt-4">
                  <div className="bg-[#da1e28] h-full w-[65%]" />
                </div>
                <div className="flex justify-between text-[10px] mt-2 font-mono">
                  <span>65/100 ENDPOINTS AFFECTED</span>
                  <span className="text-[#da1e28] font-bold">CRITICAL SCOPE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-[#f4f4f4] p-5">
            <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest mb-6">
              Detailed Activity Timeline
            </h3>
            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-[#e0e0e0]">
              {[
                {
                  icon: "login",
                  iconBg: "bg-[#d0e2ff]", iconColor: "text-[#0f62fe]",
                  title: "Initial Access: Phishing Link Execution",
                  time: "14:22:01",
                  desc: "User 'j_doe' executed attachment 'Invoice_394.zip' from external sender. PowerShell script launched hidden process 'svchost_tmp.exe'.",
                  tags: ["SHA256: 8f2...e1c", "PID: 4812"],
                },
                {
                  icon: "sync_alt",
                  iconBg: "bg-[#a7f0ba]", iconColor: "text-[#198038]",
                  title: "Persistence: Registry Key Modification",
                  time: "14:28:44",
                  desc: "Modification of HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run to include path to malicious binary. Scheduled task 'WinUpdateCheck' created.",
                  tags: [],
                },
                {
                  icon: "folder_shared",
                  iconBg: "bg-[#fff1f1]", iconColor: "text-[#da1e28]",
                  title: "Data Discovery: Network Scanning",
                  time: "14:45:10",
                  desc: "Internal port scan initiated on ports 445, 3389 across subnet 10.0.4.0/24. Identification of backup servers and SQL databases.",
                  tags: [],
                },
              ].map(({ icon, iconBg, iconColor, title, time, desc, tags }) => (
                <div key={title} className="relative pl-8">
                  <div className={`absolute left-0 top-1 w-6 h-6 ${iconBg} ${iconColor} flex items-center justify-center rounded-full z-10 border-2 border-white`}>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {icon}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold">{title}</span>
                    <span className="text-[10px] font-mono text-[#6f6f6f]">{time}</span>
                  </div>
                  <p className="text-xs text-[#525252] leading-relaxed">{desc}</p>
                  {tags.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-[#e0e0e0] text-[10px] font-mono text-[#6f6f6f] border border-[#e0e0e0]">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-4 flex flex-col gap-6">

          {/* AI Root Cause */}
          <div className="bg-[#0f62fe] text-white p-5 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10">
              <span className="material-symbols-outlined text-9xl">smart_toy</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-xl">psychology</span>
              <h3 className="text-sm font-bold tracking-tight">AI ROOT CAUSE ANALYSIS</h3>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="p-3 bg-white/10 border-l-2 border-white/50">
                <p className="text-xs leading-relaxed italic">
                  &ldquo;Highly probable &lsquo;Lazarus&rsquo; variant activity. The attack pattern matches TTPs for financial
                  infrastructure targeting. Registry obfuscation suggests a multi-stage payload delivery.&rdquo;
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Confidence", value: "94.2%" },
                  { label: "Severity",   value: "Level 5" },
                ].map(({ label, value }) => (
                  <div key={label} className="p-2 bg-white/5 border border-white/20">
                    <div className="text-[10px] uppercase font-bold opacity-70 mb-1">{label}</div>
                    <div className="text-lg font-bold">{value}</div>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 bg-white text-[#0f62fe] text-xs font-bold hover:bg-[#f4f4f4] transition-colors">
                Generate Full AI Forensics
              </button>
            </div>
          </div>

          {/* Agent Actions */}
          <div className="bg-[#f4f4f4] border border-[#e0e0e0] p-5">
            <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest mb-4">
              Autonomous Agent Actions
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { icon: "block",                    iconColor: "text-[#da1e28]", title: "Block Source IP",  sub: "Block 104.22.4.19 across Edge Firewalls" },
                { icon: "security_update_warning",  iconColor: "text-[#0f62fe]", title: "Quarantine Host",  sub: "Isolate 'TX-FIN-004' from local network" },
                { icon: "group",                    iconColor: "text-[#6f6f6f]", title: "Escalate to L3",   sub: "Notify SOC Manager and CISO" },
              ].map(({ icon, iconColor, title, sub }) => (
                <button
                  key={title}
                  className="flex items-center justify-between w-full p-4 bg-white hover:bg-[#f4f4f4] border border-[#e0e0e0] transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
                    <div>
                      <div className="text-xs font-bold">{title}</div>
                      <div className="text-[10px] text-[#6f6f6f]">{sub}</div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-sm text-[#6f6f6f]">chevron_right</span>
                </button>
              ))}
              <button className="flex items-center justify-center gap-2 w-full p-3 bg-white border border-[#0f62fe] text-[#0f62fe] text-[10px] font-bold uppercase tracking-wider hover:bg-[#d0e2ff] transition-all mt-2">
                <span className="material-symbols-outlined text-xs">tune</span> Customize Response Playbook
              </button>
            </div>
          </div>

          {/* Asset Data */}
          <div className="bg-[#f4f4f4] p-5">
            <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest mb-4">
              Affected Asset Data
            </h3>
            <div className="space-y-3">
              {[
                { label: "Hostname",            value: "TX-FIN-004-WK",        valueClass: "font-bold" },
                { label: "OS Version",          value: "Win 10 Enterprise LTSC" },
                { label: "Last Patch",          value: "02 Aug 2024" },
                { label: "Vulnerability Score", value: "8.4 (High)",           valueClass: "text-[#da1e28] font-bold" },
              ].map(({ label, value, valueClass }, i, arr) => (
                <div key={label} className={`flex justify-between items-center py-2 ${i < arr.length - 1 ? "border-b border-[#e0e0e0]" : ""}`}>
                  <span className="text-xs text-[#6f6f6f]">{label}</span>
                  <span className={`text-xs font-mono ${valueClass ?? ""}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
