export default function AIAssistantPage() {
  return (
    <div className="flex h-full bg-white overflow-hidden">

      {/* Chat Section */}
      <section className="flex-1 flex flex-col border-r border-[#e0e0e0]">

        {/* Chat Header */}
        <header className="h-14 flex items-center px-6 border-b border-[#e0e0e0] justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#0f62fe]">psychology</span>
            <h1 className="text-lg font-semibold tracking-tight">Security Analyst Copilot</h1>
            <span className="bg-[#f4f4f4] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#6f6f6f]">
              Active Analysis
            </span>
          </div>
          <div className="flex gap-2">
            <button className="text-xs font-semibold px-3 py-1.5 border border-[#8d8d8d] hover:bg-[#f4f4f4] transition-colors">
              Export Session
            </button>
            <button className="text-xs font-semibold px-3 py-1.5 bg-[#0f62fe] text-white hover:bg-[#0043ce] transition-colors">
              Share Report
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">

          {/* User message */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 shrink-0 bg-[#f4f4f4] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#6f6f6f]">person</span>
            </div>
            <div className="max-w-2xl bg-[#f4f4f4] p-4">
              <p className="text-sm leading-relaxed">
                Analyze the recent egress anomaly on subnet{" "}
                <code className="bg-[#c6c6c6] px-1 text-xs">10.0.4.0/24</code>. Focus on
                identifying potential data exfiltration vectors.
              </p>
            </div>
          </div>

          {/* AI response */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 shrink-0 bg-[#0f62fe] flex items-center justify-center">
              <span className="material-symbols-outlined text-white">auto_awesome</span>
            </div>
            <div className="flex-1 space-y-6">
              <div className="max-w-3xl">
                <h3 className="text-sm font-semibold mb-3">Threat Vector Analysis: Egress Anomaly</h3>
                <p className="text-sm leading-relaxed text-[#525252] mb-6">
                  Based on flow log analysis from 08:00 to 09:15 UTC, I&apos;ve identified a persistent
                  encrypted connection to a known cloud hosting provider. This correlates with unusual
                  memory spikes on{" "}
                  <code className="bg-[#c6c6c6] px-1 text-xs">SRV-PROD-SQL-02</code>.
                </p>

                {/* Vector cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-[#e0e0e0] p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-[#da1e28] text-lg">warning</span>
                      <span className="text-xs font-bold uppercase text-[#da1e28]">Critical Vector</span>
                    </div>
                    <p className="text-xs font-semibold mb-1">RDP Tunneling over HTTPS</p>
                    <p className="text-[11px] text-[#6f6f6f]">
                      Observed high-entropy traffic on port 443 with beaconing intervals of 120s.
                    </p>
                  </div>
                  <div className="border border-[#e0e0e0] p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-[#0f62fe] text-lg">info</span>
                      <span className="text-xs font-bold uppercase text-[#0f62fe]">Secondary Vector</span>
                    </div>
                    <p className="text-xs font-semibold mb-1">DNS Query Volume</p>
                    <p className="text-[11px] text-[#6f6f6f]">
                      350% increase in NXDOMAIN responses for pseudo-random subdomains.
                    </p>
                  </div>
                </div>

                {/* Network topology */}
                <div className="border border-[#e0e0e0] bg-[#f4f4f4] p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#6f6f6f]">
                      Network Topology Map
                    </span>
                    <span className="text-[10px] text-[#8d8d8d]">Interactive view</span>
                  </div>
                  <div
                    className="h-48 border border-[#e0e0e0] relative overflow-hidden"
                    style={{ background: "#0a0f1e", backgroundImage: "radial-gradient(circle, rgba(15,98,254,0.15) 0%, transparent 70%)" }}
                  >
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 192" fill="none">
                      <line x1="80" y1="96" x2="180" y2="60"  stroke="#0f62fe" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
                      <line x1="80" y1="96" x2="180" y2="130" stroke="#0f62fe" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
                      <line x1="180" y1="60"  x2="300" y2="50"  stroke="#0f62fe" strokeWidth="1" opacity="0.4" />
                      <line x1="180" y1="130" x2="300" y2="140" stroke="#da1e28" strokeWidth="2" opacity="0.8" />
                      <line x1="300" y1="140" x2="420" y2="100" stroke="#da1e28" strokeWidth="2" strokeDasharray="6 3" opacity="0.7" />
                      <circle cx="80"  cy="96"  r="8" fill="#0f62fe" opacity="0.9" />
                      <circle cx="180" cy="60"  r="6" fill="#d0e2ff" opacity="0.8" />
                      <circle cx="180" cy="130" r="6" fill="#d0e2ff" opacity="0.8" />
                      <circle cx="300" cy="50"  r="5" fill="#6f6f6f" opacity="0.6" />
                      <circle cx="300" cy="140" r="8" fill="#da1e28" opacity="0.9" />
                      <circle cx="420" cy="100" r="6" fill="#da1e28" opacity="0.6" />
                      <text x="68"  y="112" fill="#78a9ff" fontSize="8" fontFamily="monospace">CORE</text>
                      <text x="290" y="158" fill="#ff8389" fontSize="8" fontFamily="monospace">THREAT</text>
                    </svg>
                    <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-0.5 bg-[#da1e28]" />
                        <span className="text-[9px] text-[#6f6f6f] font-mono">Exfil path</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-0.5 bg-[#0f62fe]" />
                        <span className="text-[9px] text-[#6f6f6f] font-mono">Normal traffic</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {[
                    { icon: "visibility", label: "View raw logs" },
                    { icon: "policy",     label: "Compare with baseline" },
                  ].map(({ icon, label }) => (
                    <button key={label} className="flex items-center gap-1 text-[11px] font-semibold text-[#0f62fe] hover:underline">
                      <span className="material-symbols-outlined text-xs">{icon}</span> {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#e0e0e0] bg-white shrink-0">
          <div className="relative flex items-center">
            <input
              className="w-full h-12 bg-[#f4f4f4] border-b-2 border-[#8d8d8d] focus:border-[#0f62fe] border-t-0 border-x-0 outline-none px-4 text-sm transition-all"
              placeholder="Ask follow-up or command agent..."
              type="text"
            />
            <div className="absolute right-3 flex gap-2">
              {["attach_file", "mic"].map((icon) => (
                <button key={icon} className="p-1 text-[#6f6f6f] hover:text-[#0f62fe]">
                  <span className="material-symbols-outlined">{icon}</span>
                </button>
              ))}
              <button className="p-1 text-[#0f62fe]">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
          <div className="mt-2 flex gap-2 flex-wrap">
            <span className="text-[10px] text-[#6f6f6f] font-bold uppercase tracking-widest px-1">
              Quick actions:
            </span>
            {["Isolate Endpoint", "Block IP Range", "Flush DNS Cache"].map((a) => (
              <button key={a} className="text-[10px] bg-[#f4f4f4] px-2 py-0.5 border border-[#e0e0e0] hover:border-[#0f62fe]">
                {a}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Context Library */}
      <section className="w-80 flex flex-col bg-[#f4f4f4] shrink-0">
        <div className="h-14 flex items-center px-4 border-b border-[#e0e0e0] shrink-0">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#6f6f6f]">Context Library</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar">

          {/* Live Metrics */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold">Active Metrics</span>
              <span className="text-[10px] text-[#198038] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#198038]" /> Live
              </span>
            </div>
            <div className="space-y-3">
              {[
                { label: "CPU Usage",    val: "78.4%", width: "78%",  bar: "bg-[#da1e28]" },
                { label: "Memory Load", val: "62.1%", width: "62%",  bar: "bg-[#0f62fe]" },
              ].map(({ label, val, width, bar }) => (
                <div key={label} className="bg-white p-3 border border-[#e0e0e0]">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#6f6f6f]">{label}</span>
                    <span className="font-bold">{val}</span>
                  </div>
                  <div className="w-full h-1 bg-[#f4f4f4]">
                    <div className={`${bar} h-full`} style={{ width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Logs */}
          <div>
            <span className="text-xs font-semibold block mb-3">Linked Event Logs</span>
            <div className="space-y-1">
              {[
                { level: "CRIT", levelColor: "text-[#da1e28]", time: "09:12:44", msg: "Connection reset by peer: 192.168.1.5" },
                { level: "INFO", levelColor: "text-[#0f62fe]",  time: "09:10:02", msg: "Outbound socket opened via 443/TCP" },
                { level: "INFO", levelColor: "text-[#0f62fe]",  time: "09:08:15", msg: "Audit process started PID: 45091" },
              ].map(({ level, levelColor, time, msg }) => (
                <div key={time} className="text-[10px] font-mono p-2 border border-[#e0e0e0] bg-white hover:bg-[#f4f4f4] cursor-pointer">
                  <div className="flex justify-between mb-1">
                    <span className={levelColor}>{level}</span>
                    <span className="text-[#8d8d8d]">{time}</span>
                  </div>
                  <p className="truncate text-[#161616]">{msg}</p>
                </div>
              ))}
            </div>
            <button className="w-full text-center py-2 text-[10px] font-bold text-[#0f62fe] hover:underline uppercase tracking-tighter">
              View all 428 logs
            </button>
          </div>

          {/* Threat Intel */}
          <div>
            <span className="text-xs font-semibold block mb-3">Threat Intel Reports</span>
            <div className="space-y-2">
              {[
                { icon: "description", title: "CVE-2024-8192 Analysis",  sub: "Exploitation of kernel-level egress filters." },
                { icon: "language",    title: "Domain Reputation",        sub: "Destination IP mapped to 'ShadowNode' infrastructure." },
              ].map(({ icon, title, sub }) => (
                <div key={title} className="bg-white p-3 border border-[#e0e0e0]">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm text-[#6f6f6f]">{icon}</span>
                    <div>
                      <p className="text-[11px] font-bold">{title}</p>
                      <p className="text-[10px] text-[#6f6f6f] mt-0.5">{sub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Policy Alert */}
          <div className="pt-4 border-t border-[#e0e0e0]">
            <div className="bg-[#044317] p-4">
              <p className="text-[10px] text-[#42be65] font-bold uppercase mb-2">Automated Policy Check</p>
              <p className="text-xs text-white leading-tight">
                The current activity violates{" "}
                <span className="underline">Egress Rule #402</span>. Compliance score decreased by 12%.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
