const playbooks = [
  { name: "Auto-Block Brute Force",     trigger: "Alert: Failed logins > 50/min", status: "active",  lastRun: "9m ago",  runs: 142, success: 98 },
  { name: "Phishing Email Quarantine",  trigger: "Email: Malicious link detected", status: "active",  lastRun: "1h ago",  runs: 87,  success: 100 },
  { name: "Ransomware Kill-Switch",     trigger: "Alert: Crypto behavior on host", status: "active",  lastRun: "3d ago",  runs: 4,   success: 100 },
  { name: "DDoS Mitigation",            trigger: "Threshold: Traffic > 60 Gbps",   status: "paused",  lastRun: "12d ago", runs: 21,  success: 90  },
  { name: "Credential Stuffing Guard",  trigger: "Alert: Account spray detected",  status: "active",  lastRun: "32m ago", runs: 63,  success: 95  },
  { name: "Insider Threat Escalation",  trigger: "Policy: DLP violation fired",    status: "draft",   lastRun: "Never",   runs: 0,   success: 0   },
];

const execLog = [
  { playbook: "Auto-Block Brute Force",    time: "09:14:02", duration: "1.2s", steps: 4, result: "success" },
  { playbook: "Phishing Email Quarantine", time: "09:10:55", duration: "0.8s", steps: 3, result: "success" },
  { playbook: "Auto-Block Brute Force",    time: "09:08:11", duration: "1.4s", steps: 4, result: "success" },
  { playbook: "Credential Stuffing Guard", time: "08:57:33", duration: "2.1s", steps: 5, result: "failed"  },
  { playbook: "Auto-Block Brute Force",    time: "08:45:20", duration: "1.1s", steps: 4, result: "success" },
  { playbook: "Phishing Email Quarantine", time: "08:30:44", duration: "0.9s", steps: 3, result: "success" },
];

const nodes = [
  { id: "trigger",  label: "Trigger",      sub: "Failed logins > 50/min", x: 30,  y: 30,  icon: "bolt",           color: "#0f62fe" },
  { id: "check",    label: "Condition",    sub: "IP in allowlist?",        x: 30,  y: 130, icon: "rule",           color: "#f57c00" },
  { id: "block",    label: "Block IP",     sub: "Edge Firewall",           x: 30,  y: 230, icon: "block",          color: "#da1e28" },
  { id: "notify",   label: "Notify",       sub: "Slack + PagerDuty",       x: 220, y: 130, icon: "notifications",  color: "#198038" },
  { id: "ticket",   label: "Create Ticket",sub: "Jira SOC project",        x: 220, y: 230, icon: "confirmation_number", color: "#6f6f6f" },
];

const edges = [
  { x1: 95,  y1: 50,  x2: 95,  y2: 130 },
  { x1: 95,  y1: 150, x2: 95,  y2: 230 },
  { x1: 170, y1: 140, x2: 220, y2: 140 },
  { x1: 285, y1: 160, x2: 285, y2: 230 },
];

const statusStyle: Record<string, string> = {
  active: "text-[#198038] bg-[#defbe6]",
  paused: "text-[#f57c00] bg-[#fff8e1]",
  draft:  "text-[#6f6f6f] bg-[#e0e0e0]",
};

export default function AutomationsPage() {
  return (
    <div className="h-full overflow-y-auto bg-[#f4f4f4] custom-scrollbar">
      {/* Header */}
      <div className="bg-white border-b border-[#e0e0e0] px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Playbook Engine</h1>
          <p className="text-xs text-[#6f6f6f] mt-0.5">6 playbooks · 5 active · 312 executions today</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 h-9 border border-[#0f62fe] text-[#0f62fe] text-xs font-semibold hover:bg-[#d0e2ff] transition-colors">
            <span className="material-symbols-outlined text-sm">import_export</span> Import
          </button>
          <button className="flex items-center gap-2 px-4 h-9 bg-[#0f62fe] text-white text-xs font-semibold hover:bg-[#0043ce] transition-colors">
            <span className="material-symbols-outlined text-sm">add</span> New Playbook
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">

          {/* Playbook Library */}
          <div className="col-span-4 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest">Playbook Library</h3>
            {playbooks.map(({ name, trigger, status, lastRun, runs, success }) => (
              <div key={name} className="bg-white p-4 cursor-pointer hover:border-[#0f62fe] border border-transparent transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs font-bold leading-tight group-hover:text-[#0f62fe] transition-colors">{name}</p>
                  <span className={`text-[9px] px-2 py-0.5 font-bold uppercase ${statusStyle[status]}`}>{status}</span>
                </div>
                <p className="text-[10px] text-[#6f6f6f] mb-3 leading-relaxed">{trigger}</p>
                <div className="flex justify-between items-center text-[10px] text-[#6f6f6f]">
                  <span>Last run: {lastRun}</span>
                  {runs > 0 && (
                    <span className="font-mono">{runs} runs · <span className={success >= 95 ? "text-[#198038]" : "text-[#f57c00]"}>{success}%</span></span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Playbook Builder */}
          <div className="col-span-5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest">Visual Builder — Auto-Block Brute Force</h3>
              <div className="flex gap-2">
                <button className="text-[10px] border border-[#e0e0e0] px-2 py-1 hover:bg-[#e0e0e0] text-[#6f6f6f]">Test Run</button>
                <button className="text-[10px] bg-[#0f62fe] text-white px-3 py-1 hover:bg-[#0043ce]">Save</button>
              </div>
            </div>

            <div className="bg-white p-4 flex-1 min-h-[420px] relative"
              style={{ backgroundImage: "radial-gradient(#e0e0e0 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 380 320">
                {edges.map(({ x1, y1, x2, y2 }, i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c6c6c6" strokeWidth="2" strokeDasharray="4 2" markerEnd="url(#arrow)" />
                ))}
                <defs>
                  <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="#c6c6c6" />
                  </marker>
                </defs>
              </svg>

              {nodes.map(({ id, label, sub, x, y, icon, color }) => (
                <div
                  key={id}
                  className="absolute bg-white border-2 p-3 w-36 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  style={{ left: x, top: y, borderColor: color }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-sm" style={{ color }}>{icon}</span>
                    <span className="text-xs font-bold">{label}</span>
                  </div>
                  <p className="text-[10px] text-[#6f6f6f] leading-tight">{sub}</p>
                </div>
              ))}

              {/* Add step button */}
              <button className="absolute bottom-4 right-4 w-8 h-8 bg-[#0f62fe] text-white flex items-center justify-center hover:bg-[#0043ce] transition-colors">
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>

            {/* Quick recipes */}
            <div className="bg-white p-4">
              <p className="text-[10px] font-bold uppercase text-[#6f6f6f] tracking-widest mb-3">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                {["Block IP", "Isolate Host", "Create Ticket", "Send Alert", "Enrich IOC", "Run Script"].map((a) => (
                  <button key={a} className="text-[10px] border border-[#e0e0e0] px-3 py-1.5 hover:border-[#0f62fe] hover:text-[#0f62fe] transition-colors">
                    + {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Execution Log */}
          <div className="col-span-3 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest">Execution Log</h3>
            <div className="bg-white flex-1">
              <div className="p-3 border-b border-[#e0e0e0] flex justify-between items-center">
                <span className="text-[10px] text-[#6f6f6f]">Recent runs</span>
                <span className="text-[10px] text-[#0f62fe] font-semibold cursor-pointer hover:underline">View all</span>
              </div>
              <div className="divide-y divide-[#f4f4f4]">
                {execLog.map(({ playbook, time, duration, steps, result }, i) => (
                  <div key={i} className="p-3 hover:bg-[#f4f4f4] transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold leading-tight line-clamp-1">{playbook}</span>
                      <span className={`text-[9px] font-bold ${result === "success" ? "text-[#198038]" : "text-[#da1e28]"}`}>
                        {result === "success" ? "✓" : "✗"}
                      </span>
                    </div>
                    <div className="flex justify-between text-[9px] text-[#8d8d8d]">
                      <span>{time}</span>
                      <span>{steps} steps · {duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white p-4 space-y-3">
              <p className="text-[10px] font-bold uppercase text-[#6f6f6f] tracking-widest">Today&apos;s Stats</p>
              {[
                { label: "Total Executions", value: "312", bar: "w-full", color: "bg-[#0f62fe]" },
                { label: "Success Rate",     value: "97%", bar: "w-[97%]", color: "bg-[#198038]" },
                { label: "Avg Duration",     value: "1.3s", bar: "w-[40%]", color: "bg-[#6f6f6f]" },
              ].map(({ label, value, bar, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-[#6f6f6f]">{label}</span>
                    <span className="font-bold">{value}</span>
                  </div>
                  <div className="h-1 bg-[#f4f4f4]">
                    <div className={`h-full ${bar} ${color}`} />
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
