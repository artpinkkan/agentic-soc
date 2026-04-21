const agents = [
  { name: "TriageBot-01",    role: "Triage",    task: "Analyzing INC-2024-0812 brute-force pattern",   status: "active",  uptime: "14h 22m", cpu: 38, mem: 52, actions: 142, model: "claude-sonnet-4-6" },
  { name: "HunterBot-Alpha", role: "Hunter",    task: "Scanning subnet 10.0.4.0/24 for lateral movement", status: "active",  uptime: "8h 05m",  cpu: 61, mem: 44, actions: 87,  model: "claude-opus-4-7"   },
  { name: "ResponderBot-02", role: "Responder", task: "Executing playbook: Auto-Block Brute Force",     status: "active",  uptime: "22h 11m", cpu: 12, mem: 31, actions: 312, model: "claude-haiku-4-5"  },
  { name: "IntelBot-03",     role: "Intel",     task: "Correlating CVE-2024-8192 with asset inventory", status: "active",  uptime: "3h 48m",  cpu: 29, mem: 60, actions: 54,  model: "claude-sonnet-4-6" },
  { name: "ForensicsBot-01", role: "Forensics", task: "Idle — awaiting task assignment",                status: "idle",    uptime: "2d 4h",   cpu: 2,  mem: 18, actions: 891, model: "claude-opus-4-7"   },
  { name: "ComplianceBot",   role: "Compliance",task: "Running policy audit: NIST CSF framework",       status: "active",  uptime: "1d 6h",   cpu: 18, mem: 35, actions: 203, model: "claude-sonnet-4-6" },
  { name: "TriageBot-02",    role: "Triage",    task: "Error: context window exceeded on log analysis", status: "error",   uptime: "0h 44m",  cpu: 0,  mem: 0,  actions: 12,  model: "claude-sonnet-4-6" },
  { name: "HunterBot-Beta",  role: "Hunter",    task: "Pending deployment — awaiting network access",   status: "pending", uptime: "—",       cpu: 0,  mem: 0,  actions: 0,   model: "claude-opus-4-7"   },
];

const taskHistory = [
  { agent: "ResponderBot-02", action: "Blocked IP 104.22.4.19",            time: "2m ago",  result: "success" },
  { agent: "TriageBot-01",    action: "Escalated INC-2024-0812 to L3",     time: "9m ago",  result: "success" },
  { agent: "IntelBot-03",     action: "Fetched MISP feed — 218 new IOCs",  time: "14m ago", result: "success" },
  { agent: "HunterBot-Alpha", action: "Port scan complete on 10.0.4.0/24", time: "21m ago", result: "success" },
  { agent: "TriageBot-02",    action: "Log analysis failed — token limit",  time: "44m ago", result: "failed"  },
  { agent: "ComplianceBot",   action: "Policy audit: 12 violations found",  time: "1h ago",  result: "warn"    },
];

const roleColor: Record<string, string> = {
  Triage:    "text-[#0f62fe] bg-[#e8f0fe]",
  Hunter:    "text-[#9c27b0] bg-[#f3e5f5]",
  Responder: "text-[#da1e28] bg-[#fff1f1]",
  Intel:     "text-[#f57c00] bg-[#fff8e1]",
  Forensics: "text-[#198038] bg-[#defbe6]",
  Compliance:"text-[#6f6f6f] bg-[#e0e0e0]",
};

const statusDot: Record<string, string> = {
  active:  "bg-[#198038]",
  idle:    "bg-[#6f6f6f]",
  error:   "bg-[#da1e28]",
  pending: "bg-[#f57c00]",
};

export default function AgentFleetPage() {
  const active  = agents.filter((a) => a.status === "active").length;
  const idle    = agents.filter((a) => a.status === "idle").length;
  const errored = agents.filter((a) => a.status === "error").length;

  return (
    <div className="h-full overflow-y-auto bg-[#f4f4f4] custom-scrollbar">
      {/* Header */}
      <div className="bg-white border-b border-[#e0e0e0] px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Agent Fleet</h1>
          <p className="text-xs text-[#6f6f6f] mt-0.5">{agents.length} agents deployed · {active} active · {idle} idle · {errored} errored</p>
        </div>
        <button className="flex items-center gap-2 px-4 h-9 bg-[#0f62fe] text-white text-xs font-semibold hover:bg-[#0043ce] transition-colors">
          <span className="material-symbols-outlined text-sm">add</span> Deploy New Agent
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Fleet status bar */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: "Total Agents",      value: agents.length,                   icon: "memory",        border: "border-[#0f62fe]" },
            { label: "Active",            value: active,                          icon: "play_circle",   border: "border-[#198038]" },
            { label: "Idle",              value: idle,                            icon: "pause_circle",  border: "border-[#6f6f6f]" },
            { label: "Errored",           value: errored,                         icon: "error",         border: "border-[#da1e28]" },
            { label: "Actions Today",     value: agents.reduce((s,a)=>s+a.actions,0), icon: "bolt",      border: "border-[#f57c00]" },
          ].map(({ label, value, icon, border }) => (
            <div key={label} className={`bg-white p-4 border-l-4 ${border}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-[#6f6f6f] uppercase font-semibold">{label}</p>
                  <p className="text-2xl font-light mt-1">{value.toLocaleString()}</p>
                </div>
                <span className="material-symbols-outlined text-[#6f6f6f]">{icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Agent cards grid */}
          <div className="col-span-8">
            <div className="grid grid-cols-2 gap-4">
              {agents.map(({ name, role, task, status, uptime, cpu, mem, actions, model }) => (
                <div key={name} className="bg-white p-4 border border-transparent hover:border-[#0f62fe] transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusDot[status]} ${status === "active" ? "animate-pulse" : ""}`} />
                      <span className="text-xs font-bold">{name}</span>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 font-bold ${roleColor[role]}`}>{role}</span>
                  </div>

                  <p className="text-[10px] text-[#525252] leading-relaxed mb-3 min-h-[2.5rem]">{task}</p>

                  {status !== "pending" && status !== "error" && (
                    <div className="space-y-1.5 mb-3">
                      <div>
                        <div className="flex justify-between text-[9px] text-[#6f6f6f] mb-0.5">
                          <span>CPU</span><span>{cpu}%</span>
                        </div>
                        <div className="h-1 bg-[#f4f4f4]">
                          <div className={`h-full ${cpu > 60 ? "bg-[#da1e28]" : "bg-[#0f62fe]"}`} style={{ width: `${cpu}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-[#6f6f6f] mb-0.5">
                          <span>Memory</span><span>{mem}%</span>
                        </div>
                        <div className="h-1 bg-[#f4f4f4]">
                          <div className={`h-full ${mem > 70 ? "bg-[#f57c00]" : "bg-[#198038]"}`} style={{ width: `${mem}%` }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="bg-[#fff1f1] border border-[#da1e28] p-2 mb-3">
                      <p className="text-[10px] text-[#da1e28] font-semibold">Agent halted — review required</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[9px] text-[#8d8d8d]">
                    <span>Uptime: {uptime}</span>
                    <span className="font-mono">{actions} actions</span>
                  </div>
                  <div className="mt-2 text-[9px] text-[#8d8d8d] font-mono truncate">{model}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Task history + Deploy wizard */}
          <div className="col-span-4 flex flex-col gap-4">
            {/* Task history */}
            <div className="bg-white">
              <div className="px-4 py-3 border-b border-[#e0e0e0]">
                <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest">Recent Agent Actions</h3>
              </div>
              <div className="divide-y divide-[#f4f4f4]">
                {taskHistory.map(({ agent, action, time, result }) => (
                  <div key={`${agent}-${time}`} className="px-4 py-3">
                    <div className="flex justify-between items-start mb-0.5">
                      <span className="text-[10px] font-bold text-[#0f62fe]">{agent}</span>
                      <span className={`text-[9px] font-bold ${result === "success" ? "text-[#198038]" : result === "failed" ? "text-[#da1e28]" : "text-[#f57c00]"}`}>
                        {result === "success" ? "✓" : result === "failed" ? "✗" : "⚠"}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#525252] leading-tight">{action}</p>
                    <p className="text-[9px] text-[#8d8d8d] mt-0.5">{time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Deploy wizard */}
            <div className="bg-white p-4">
              <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest mb-4">Quick Deploy</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-[#6f6f6f] uppercase font-semibold block mb-1">Agent Template</label>
                  <select className="w-full h-9 bg-[#f4f4f4] border-none text-xs focus:outline-none focus:ring-1 focus:ring-[#0f62fe] px-3">
                    <option>Triage Agent</option>
                    <option>Hunter Agent</option>
                    <option>Responder Agent</option>
                    <option>Intel Agent</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#6f6f6f] uppercase font-semibold block mb-1">Model</label>
                  <select className="w-full h-9 bg-[#f4f4f4] border-none text-xs focus:outline-none focus:ring-1 focus:ring-[#0f62fe] px-3">
                    <option>claude-opus-4-7</option>
                    <option>claude-sonnet-4-6</option>
                    <option>claude-haiku-4-5</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#6f6f6f] uppercase font-semibold block mb-1">Scope</label>
                  <input className="w-full h-9 bg-[#f4f4f4] border-none text-xs focus:outline-none focus:ring-1 focus:ring-[#0f62fe] px-3" placeholder="e.g. subnet 10.0.4.0/24" />
                </div>
                <div>
                  <label className="text-[10px] text-[#6f6f6f] uppercase font-semibold block mb-1">Guardrails</label>
                  <div className="space-y-1">
                    {["Require human approval for destructive actions", "Max 100 tool calls/session", "No external network calls"].map((g) => (
                      <label key={g} className="flex items-center gap-2 text-[10px] text-[#525252]">
                        <input type="checkbox" defaultChecked className="accent-[#0f62fe]" />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
                <button className="w-full bg-[#0f62fe] text-white py-2.5 text-xs font-semibold hover:bg-[#0043ce] transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">rocket_launch</span> Deploy Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
