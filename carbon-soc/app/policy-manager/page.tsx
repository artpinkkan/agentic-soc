const frameworks = [
  { name: "NIST CSF 2.0", score: 82, controls: 108, passed: 89, color: "#0f62fe" },
  { name: "SOC 2 Type II", score: 91, controls: 64,  passed: 58, color: "#198038" },
  { name: "ISO 27001",     score: 74, controls: 93,  passed: 69, color: "#f57c00" },
  { name: "MITRE ATT&CK", score: 67, controls: 185, passed: 124, color: "#9c27b0" },
];

const categories = [
  { label: "Network", count: 24, issues: 3 },
  { label: "Endpoint", count: 31, issues: 5 },
  { label: "Data", count: 18, issues: 1 },
  { label: "Identity", count: 22, issues: 4 },
  { label: "Cloud", count: 16, issues: 2 },
];

const policies = [
  { name: "Egress Rule #402",       category: "Network",  framework: "NIST",  status: "violated", lastFired: "9m ago",   severity: "HIGH"   },
  { name: "MFA Enforcement",         category: "Identity", framework: "SOC2",  status: "enforced", lastFired: "2h ago",   severity: "CRIT"   },
  { name: "Data Exfil Threshold",    category: "Data",     framework: "ISO",   status: "enforced", lastFired: "1d ago",   severity: "HIGH"   },
  { name: "Privileged Access Review",category: "Identity", framework: "NIST",  status: "warning",  lastFired: "3d ago",   severity: "MEDIUM" },
  { name: "Endpoint Patch SLA",      category: "Endpoint", framework: "SOC2",  status: "violated", lastFired: "5h ago",   severity: "HIGH"   },
  { name: "Log Retention Policy",    category: "Data",     framework: "ISO",   status: "enforced", lastFired: "6h ago",   severity: "MEDIUM" },
  { name: "Network Segmentation",    category: "Network",  framework: "NIST",  status: "warning",  lastFired: "12h ago",  severity: "MEDIUM" },
  { name: "Cloud IAM Least Privilege",category: "Cloud",  framework: "ISO",   status: "enforced", lastFired: "1d ago",   severity: "CRIT"   },
  { name: "Suspicious Login Policy", category: "Identity", framework: "ATT&CK",status: "enforced", lastFired: "34m ago",  severity: "HIGH"   },
  { name: "Ransomware Kill-Switch",  category: "Endpoint", framework: "NIST",  status: "enforced", lastFired: "3d ago",   severity: "CRIT"   },
];

const violations = [
  { policy: "Egress Rule #402",        asset: "SRV-PROD-SQL-02",  time: "09:14:02", details: "14.2 GB outbound to unknown destination" },
  { policy: "Endpoint Patch SLA",      asset: "TX-FIN-004-WK",    time: "08:30:00", details: "Patch overdue by 22 days — CVE-2024-8192" },
  { policy: "Privileged Access Review",asset: "admin@corp.com",   time: "2d ago",   details: "Quarterly review overdue — 180 days elapsed" },
];

const statusStyle: Record<string, string> = {
  enforced: "text-[#198038] bg-[#defbe6]",
  warning:  "text-[#f57c00] bg-[#fff8e1]",
  violated: "text-[#da1e28] bg-[#fff1f1]",
};

const severityStyle: Record<string, string> = {
  CRIT:   "text-[#da1e28] bg-[#fff1f1]",
  HIGH:   "text-[#f57c00] bg-[#fff8e1]",
  MEDIUM: "text-[#f9a825] bg-[#fffde7]",
};

export default function PolicyManagerPage() {
  const totalControls  = frameworks.reduce((s, f) => s + f.controls, 0);
  const passedControls = frameworks.reduce((s, f) => s + f.passed, 0);
  const overallScore   = Math.round((passedControls / totalControls) * 100);

  return (
    <div className="h-full overflow-y-auto bg-[#f4f4f4] custom-scrollbar">
      {/* Header */}
      <div className="bg-white border-b border-[#e0e0e0] px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Policy Manager</h1>
          <p className="text-xs text-[#6f6f6f] mt-0.5">
            {policies.length} policies · {policies.filter(p => p.status === "violated").length} violations · {policies.filter(p => p.status === "warning").length} warnings
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 h-9 border border-[#0f62fe] text-[#0f62fe] text-xs font-semibold hover:bg-[#d0e2ff] transition-colors">
            <span className="material-symbols-outlined text-sm">file_download</span> Export Report
          </button>
          <button className="flex items-center gap-2 px-4 h-9 bg-[#0f62fe] text-white text-xs font-semibold hover:bg-[#0043ce] transition-colors">
            <span className="material-symbols-outlined text-sm">add</span> New Policy
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Compliance Score + Frameworks */}
        <div className="grid grid-cols-12 gap-6">
          {/* Overall score ring */}
          <div className="col-span-3 bg-white p-6 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 mb-4">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e0e0e0" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke={overallScore >= 80 ? "#198038" : overallScore >= 65 ? "#f57c00" : "#da1e28"}
                  strokeWidth="10"
                  strokeDasharray={`${(overallScore / 100) * 314} 314`}
                  strokeLinecap="butt"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-light">{overallScore}%</span>
                <span className="text-[10px] text-[#6f6f6f]">Compliance</span>
              </div>
            </div>
            <p className="text-xs font-semibold text-center">Overall Security Posture</p>
            <p className="text-[10px] text-[#6f6f6f] text-center mt-1">{passedControls}/{totalControls} controls passing</p>
          </div>

          {/* Framework coverage */}
          <div className="col-span-9 bg-white p-6">
            <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest mb-5">Framework Coverage</h3>
            <div className="grid grid-cols-2 gap-6">
              {frameworks.map(({ name, score, controls, passed, color }) => (
                <div key={name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold">{name}</span>
                    <span className="text-xs font-bold" style={{ color }}>{score}%</span>
                  </div>
                  <div className="h-2 bg-[#f4f4f4] mb-1">
                    <div className="h-full transition-all" style={{ width: `${score}%`, background: color }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-[#8d8d8d]">
                    <span>{passed} / {controls} controls</span>
                    <span>{controls - passed} gaps</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Category tree + violations */}
          <div className="col-span-3 flex flex-col gap-4">
            {/* Categories */}
            <div className="bg-white p-4">
              <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest mb-3">Policy Categories</h3>
              {categories.map(({ label, count, issues }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-[#f4f4f4] last:border-0 cursor-pointer hover:bg-[#f4f4f4] -mx-4 px-4 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#6f6f6f]">
                      {label === "Network" ? "router" : label === "Endpoint" ? "computer" : label === "Data" ? "storage" : label === "Identity" ? "badge" : "cloud"}
                    </span>
                    <span className="text-xs">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#6f6f6f]">{count}</span>
                    {issues > 0 && (
                      <span className="text-[9px] bg-[#da1e28] text-white px-1.5 py-0.5 font-bold">{issues}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Active violations */}
            <div className="bg-white p-4">
              <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest mb-3">Active Violations</h3>
              <div className="space-y-3">
                {violations.map(({ policy, asset, time, details }) => (
                  <div key={policy} className="border-l-4 border-[#da1e28] pl-3 py-1">
                    <p className="text-[10px] font-bold text-[#da1e28]">{policy}</p>
                    <p className="text-[10px] font-mono text-[#161616]">{asset}</p>
                    <p className="text-[9px] text-[#6f6f6f] mt-0.5">{details}</p>
                    <p className="text-[9px] text-[#8d8d8d] mt-0.5">{time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Policy rules table */}
          <div className="col-span-6 bg-white overflow-hidden">
            <div className="p-4 border-b border-[#e0e0e0] flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest">All Policies</h3>
              <div className="flex gap-2">
                <select className="text-[10px] bg-[#f4f4f4] border-none px-2 py-1 text-[#6f6f6f] focus:outline-none">
                  <option>All Status</option>
                  <option>Violated</option>
                  <option>Warning</option>
                </select>
              </div>
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#e0e0e0] text-[#6f6f6f] text-[10px] uppercase font-bold">
                  {["Policy Name", "Category", "Framework", "Severity", "Status", "Last Fired"].map((h) => (
                    <th key={h} className="px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {policies.map(({ name, category, framework, severity, status, lastFired }) => (
                  <tr key={name} className="border-b border-[#f4f4f4] hover:bg-[#f4f4f4] transition-colors cursor-pointer">
                    <td className="px-4 py-3 font-semibold text-[11px]">{name}</td>
                    <td className="px-4 py-3 text-[10px] text-[#6f6f6f]">{category}</td>
                    <td className="px-4 py-3">
                      <span className="text-[9px] bg-[#e0e0e0] px-2 py-0.5 font-mono text-[#525252]">{framework}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] px-1.5 py-0.5 font-bold ${severityStyle[severity]}`}>{severity}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] px-2 py-0.5 font-bold uppercase ${statusStyle[status]}`}>{status}</span>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-[#6f6f6f]">{lastFired}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rule editor panel */}
          <div className="col-span-3 bg-white p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest">Rule Editor</h3>
              <span className="text-[9px] bg-[#da1e28] text-white px-2 py-0.5 font-bold">VIOLATED</span>
            </div>

            <div>
              <p className="text-sm font-bold">Egress Rule #402</p>
              <p className="text-[10px] text-[#6f6f6f] mt-0.5">Network · NIST CSF 2.0</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-[#6f6f6f] uppercase font-semibold block mb-1">Condition</label>
                <div className="bg-[#f4f4f4] p-2 font-mono text-[10px] text-[#161616] border-l-2 border-[#0f62fe]">
                  outbound_bytes &gt; 5GB<br/>AND destination NOT IN allowlist
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#6f6f6f] uppercase font-semibold block mb-1">Response Action</label>
                <select className="w-full h-8 bg-[#f4f4f4] border-none text-[10px] focus:outline-none focus:ring-1 focus:ring-[#0f62fe] px-2">
                  <option>Alert + Block Connection</option>
                  <option>Alert Only</option>
                  <option>Block + Isolate Host</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#6f6f6f] uppercase font-semibold block mb-1">Severity</label>
                <select className="w-full h-8 bg-[#f4f4f4] border-none text-[10px] focus:outline-none focus:ring-1 focus:ring-[#0f62fe] px-2">
                  <option>HIGH</option>
                  <option>CRITICAL</option>
                  <option>MEDIUM</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#6f6f6f] uppercase font-semibold block mb-1">Exceptions</label>
                <div className="space-y-1">
                  {["svc_backup → s3://soc-backups", "svc_deploy → cdn.corp.com"].map((e) => (
                    <div key={e} className="flex items-center justify-between bg-[#f4f4f4] px-2 py-1">
                      <span className="text-[9px] font-mono text-[#525252]">{e}</span>
                      <button className="text-[#6f6f6f] hover:text-[#da1e28]">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                  <button className="text-[10px] text-[#0f62fe] hover:underline">+ Add exception</button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-auto pt-2">
              <button className="flex-1 py-2 border border-[#e0e0e0] text-xs text-[#6f6f6f] hover:bg-[#f4f4f4] transition-colors">
                Disable
              </button>
              <button className="flex-1 py-2 bg-[#0f62fe] text-white text-xs font-semibold hover:bg-[#0043ce] transition-colors">
                Save Rule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
