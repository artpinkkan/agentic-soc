export default function DashboardPage() {
  return (
    <div className="flex h-full">
      {/* Dashboard Workspace */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-white">

        {/* Summary Bar */}
        <div className="flex gap-4 mb-8">
          {[
            { label: "Active Agents",  value: "1,248", sub: "+12%",   subColor: "text-[#198038]", border: "border-[#0f62fe]" },
            { label: "System Health",  value: "99.9%", sub: "stable", subColor: "text-[#6f6f6f]", border: "border-[#198038]" },
            { label: "Threat Level",   value: "Elevated", sub: "",    subColor: "",               border: "border-[#da1e28]", valueColor: "text-[#da1e28] uppercase" },
            { label: "Network Load",   value: "42 Gbps", sub: "",     subColor: "",               border: "border-[#8d8d8d]" },
          ].map(({ label, value, sub, subColor, border, valueColor }) => (
            <div key={label} className={`flex-1 bg-[#f4f4f4] p-4 border-l-4 ${border}`}>
              <p className="text-xs text-[#6f6f6f] uppercase font-semibold">{label}</p>
              <p className={`text-2xl font-light mt-1 ${valueColor ?? ""}`}>
                {value}{" "}
                {sub && <span className={`text-xs ${subColor}`}>{sub}</span>}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">

          {/* Network Traffic Chart */}
          <div className="bg-[#f4f4f4] p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Network Traffic (Real-time)
              </h3>
              <span className="material-symbols-outlined text-[#6f6f6f] cursor-pointer">more_vert</span>
            </div>
            <div className="h-48 w-full flex items-end gap-1 px-2 relative">
              {[40, 45, 65, 55, 60, 85, 70, 60, 95, 40, 35, 55].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 ${i % 3 === 2 ? "bg-[#0f62fe]" : "bg-[#d0e2ff]"}`}
                  style={{ height: `${h}%` }}
                />
              ))}
              {[25, 50, 75].map((h) => (
                <div
                  key={h}
                  className="absolute inset-x-0 border-b border-[#e0e0e0] pointer-events-none"
                  style={{ bottom: 0, height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-[#6f6f6f]">
              {["08:00", "08:15", "08:30", "08:45", "09:00"].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>

          {/* CPU Load Donut */}
          <div className="bg-[#f4f4f4] p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Aggregate CPU Load
              </h3>
              <span className="material-symbols-outlined text-[#6f6f6f] cursor-pointer">more_vert</span>
            </div>
            <div className="h-48 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-[#e0e0e0] relative">
                <div
                  className="absolute inset-0 rounded-full border-8 border-[#0f62fe]"
                  style={{ clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)" }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold">64%</span>
                  <span className="text-[10px] text-[#6f6f6f]">Normal</span>
                </div>
              </div>
              <div className="ml-8 space-y-2">
                {[
                  { color: "bg-[#0f62fe]", label: "User Processes" },
                  { color: "bg-[#d0e2ff]", label: "Kernel Tasks" },
                  { color: "bg-[#e0e0e0]", label: "Idle" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${color}`} />
                    <span className="text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="bg-[#f4f4f4] overflow-hidden">
          <div className="p-4 border-b border-[#e0e0e0] flex justify-between items-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Active High-Priority Alerts
            </h3>
            <button className="text-xs text-[#0f62fe] font-semibold hover:underline">
              View All Alerts
            </button>
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#e0e0e0] text-[#6f6f6f] uppercase font-bold">
                {["Severity", "Timestamp", "Target Asset", "Alert Type", "Status", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { sev: "CRITICAL", time: "2023-10-24 09:14:02", asset: "auth-server-01",   type: "Brute-force Attempt",        status: "Under Analysis", bg: "bg-white" },
                { sev: "HIGH",     time: "2023-10-24 09:12:45", asset: "db-prod-cluster",  type: "Unauthorized Query Pattern", status: "Pending Review", bg: "bg-[#f8f8f8]" },
                { sev: "HIGH",     time: "2023-10-24 09:10:11", asset: "edge-firewall-04", type: "DDoS Threshold Exceeded",    status: "Mitigating",     bg: "bg-white" },
              ].map(({ sev, time, asset, type, status, bg }) => (
                <tr key={time} className={`border-b border-[#e0e0e0] ${bg} hover:bg-white transition-colors`}>
                  <td className="px-4 py-3">
                    <span className="bg-[#fff1f1] text-[#da1e28] px-2 py-0.5 font-semibold">{sev}</span>
                  </td>
                  <td className="px-4 py-3 text-[#6f6f6f]">{time}</td>
                  <td className="px-4 py-3 font-semibold">{asset}</td>
                  <td className="px-4 py-3">{type}</td>
                  <td className="px-4 py-3 text-[#6f6f6f]">{status}</td>
                  <td className="px-4 py-3">
                    <button className="text-[#0f62fe] material-symbols-outlined text-sm">
                      open_in_new
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right AI Chat Panel */}
      <div className="w-80 bg-[#f4f4f4] border-l border-[#e0e0e0] flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0f62fe]">smart_toy</span>
            <span className="text-sm font-bold">SOC Assistant</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#198038]" />
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-2">
            <div className="bg-white p-3 border border-[#e0e0e0] text-xs shadow-sm">
              <p className="font-bold text-[#0f62fe] mb-1">Analysis Report: Brute-force Attack</p>
              <p className="text-[#161616] leading-relaxed">
                I&apos;ve detected a sustained brute-force attempt on{" "}
                <span className="bg-[#d0e2ff] px-1">auth-server-01</span> targeting the{" "}
                <span className="font-semibold">root</span> user.
              </p>
              <div className="mt-3 p-2 bg-[#f4f4f4] border border-[#e0e0e0]">
                <p className="text-[10px] text-[#6f6f6f]">SOURCE IP</p>
                <p className="font-mono font-bold">192.168.44.102</p>
                <p className="text-[10px] text-[#6f6f6f] mt-2">ATTEMPTS</p>
                <p className="font-mono font-bold">4,290 / min</p>
              </div>
              <p className="mt-3 text-[#161616]">
                Probability of compromise is currently{" "}
                <span className="text-[#da1e28] font-bold">92%</span>. Matches the{" "}
                <span className="italic">APT-28 pattern</span>.
              </p>
            </div>
            <span className="text-[10px] text-[#6f6f6f]">AI Assistant · Just now</span>
          </div>

          <div className="bg-[#d0e2ff]/30 border border-[#0f62fe] p-4 space-y-3">
            <p className="text-xs font-bold text-[#161616]">Recommended Response</p>
            <p className="text-xs text-[#161616]">
              Immediate isolation of Source IP 192.168.44.102 at the edge firewall level.
            </p>
            <button className="w-full bg-[#0f62fe] text-white py-2 text-xs font-semibold hover:bg-[#0043ce] transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">block</span>
              Block IP 192.168.44.102
            </button>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-[#e0e0e0]">
          <div className="relative">
            <textarea
              className="w-full bg-[#f4f4f4] border-none text-xs p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-[#0f62fe] h-20 resize-none"
              placeholder="Ask the analyst assistant..."
            />
            <button className="absolute bottom-2 right-2 text-[#0f62fe]">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            {["Isolate Host", "Get PCAP", "WHOIS IP"].map((a) => (
              <button
                key={a}
                className="text-[10px] border border-[#e0e0e0] px-2 py-1 hover:bg-[#f4f4f4]"
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
