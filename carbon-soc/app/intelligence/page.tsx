const threatActors = [
  { name: "APT-28 (Fancy Bear)", origin: "Russia", tier: "Nation-State", ttps: ["Phishing", "Credential Theft", "Lateral Movement"], confidence: 94, lastSeen: "2h ago", color: "border-[#da1e28]" },
  { name: "Lazarus Group",       origin: "DPRK",   tier: "Nation-State", ttps: ["Supply Chain", "Crypto Theft", "RAT Deployment"],   confidence: 88, lastSeen: "6h ago", color: "border-[#f1c21b]" },
  { name: "Scattered Spider",    origin: "Unknown", tier: "eCrime",      ttps: ["SIM Swap", "MFA Bypass", "BEC"],                     confidence: 76, lastSeen: "1d ago", color: "border-[#0f62fe]" },
];

const cves = [
  { id: "CVE-2024-8192", cvss: 9.8,  severity: "CRITICAL", product: "OpenSSL 3.x",    affected: 12, patched: false },
  { id: "CVE-2024-7741", cvss: 8.6,  severity: "HIGH",     product: "Apache HTTP 2.4", affected: 7,  patched: false },
  { id: "CVE-2024-6310", cvss: 7.2,  severity: "HIGH",     product: "Linux Kernel",    affected: 34, patched: true  },
  { id: "CVE-2024-5509", cvss: 6.5,  severity: "MEDIUM",   product: "Node.js 20",      affected: 5,  patched: true  },
  { id: "CVE-2024-4822", cvss: 5.3,  severity: "MEDIUM",   product: "nginx 1.25",      affected: 3,  patched: false },
];

const iocs = [
  { type: "IP",     value: "104.22.4.19",           threat: "C2 Server",      confidence: 97, action: "Blocked" },
  { type: "Domain", value: "update-svc.net",         threat: "Phishing",       confidence: 91, action: "Blocked" },
  { type: "Hash",   value: "8f2a3c...e1c",           threat: "Malware",        confidence: 88, action: "Alerting" },
  { type: "IP",     value: "185.220.101.47",         threat: "Tor Exit Node",  confidence: 99, action: "Blocked" },
  { type: "Domain", value: "cdn-delivery-fast.com",  threat: "Typosquatting",  confidence: 73, action: "Watching" },
];

const feeds = [
  { name: "MISP Community",  status: "healthy", synced: "4m ago",  iocs: 14820 },
  { name: "VirusTotal",      status: "healthy", synced: "12m ago", iocs: 9340  },
  { name: "Shodan",          status: "healthy", synced: "1h ago",  iocs: 2210  },
  { name: "CISA KEV",        status: "healthy", synced: "6h ago",  iocs: 1098  },
  { name: "AlienVault OTX",  status: "warn",    synced: "2d ago",  iocs: 6670  },
];

const severityColor: Record<string, string> = {
  CRITICAL: "bg-[#fff1f1] text-[#da1e28]",
  HIGH:     "bg-[#fff8e1] text-[#f57c00]",
  MEDIUM:   "bg-[#fffde7] text-[#f9a825]",
};

export default function IntelligencePage() {
  return (
    <div className="h-full overflow-y-auto bg-[#f4f4f4] custom-scrollbar">
      {/* Page header */}
      <div className="bg-white border-b border-[#e0e0e0] px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Threat Intelligence Hub</h1>
          <p className="text-xs text-[#6f6f6f] mt-0.5">Live feeds · 5 sources active · Last refresh 4m ago</p>
        </div>
        <button className="flex items-center gap-2 px-4 h-9 bg-[#0f62fe] text-white text-xs font-semibold hover:bg-[#0043ce] transition-colors">
          <span className="material-symbols-outlined text-sm">sync</span> Refresh All Feeds
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Top stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Active IOCs",     value: "34,138", icon: "warning",       color: "border-[#da1e28]", sub: "+218 today" },
            { label: "CVEs Tracked",    value: "1,204",  icon: "bug_report",    color: "border-[#f57c00]", sub: "12 unpatched" },
            { label: "Threat Actors",   value: "47",     icon: "group",         color: "border-[#0f62fe]", sub: "3 high priority" },
            { label: "Intel Feeds",     value: "5 / 5",  icon: "rss_feed",      color: "border-[#198038]", sub: "All healthy" },
          ].map(({ label, value, icon, color, sub }) => (
            <div key={label} className={`bg-white p-4 border-l-4 ${color}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-[#6f6f6f] uppercase font-semibold">{label}</p>
                  <p className="text-2xl font-light mt-1">{value}</p>
                  <p className="text-[10px] text-[#6f6f6f] mt-1">{sub}</p>
                </div>
                <span className="material-symbols-outlined text-[#6f6f6f] text-xl">{icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left: Feeds + World Map */}
          <div className="col-span-4 flex flex-col gap-6">
            {/* World map */}
            <div className="bg-white p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest">Global Threat Origin</h3>
                <span className="text-[10px] text-[#0f62fe]">Live</span>
              </div>
              <div
                className="h-44 relative overflow-hidden"
                style={{ background: "#0d1117", backgroundImage: "linear-gradient(rgba(15,98,254,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,98,254,0.06) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
              >
                <svg className="w-full h-full" viewBox="0 0 400 180" fill="none">
                  {/* simplified continent outlines */}
                  <path d="M55 70 Q75 55 105 62 L118 80 Q108 98 88 94 Z" fill="#0f62fe" opacity="0.3" />
                  <path d="M148 52 Q192 36 230 50 L248 74 Q238 104 208 108 Q178 112 152 93 Z" fill="#0f62fe" opacity="0.3" />
                  <path d="M258 62 Q290 54 308 68 L313 88 Q298 98 272 93 Z" fill="#0f62fe" opacity="0.3" />
                  <path d="M160 112 Q174 108 183 118 L181 136 Q167 142 160 130 Z" fill="#0f62fe" opacity="0.2" />
                  <path d="M270 100 Q298 92 318 106 L322 130 Q308 144 282 138 Q256 132 263 116 Z" fill="#0f62fe" opacity="0.2" />
                  {/* threat dots */}
                  <circle cx="310" cy="65" r="5" fill="#da1e28" opacity="0.9"><animate attributeName="r" values="5;9;5" dur="2s" repeatCount="indefinite"/></circle>
                  <circle cx="178" cy="58" r="4" fill="#da1e28" opacity="0.8"><animate attributeName="r" values="4;7;4" dur="2.5s" repeatCount="indefinite"/></circle>
                  <circle cx="78"  cy="75" r="3" fill="#f1c21b" opacity="0.9"><animate attributeName="r" values="3;6;3" dur="1.8s" repeatCount="indefinite"/></circle>
                  <circle cx="200" cy="60" r="3" fill="#0f62fe" opacity="0.8"><animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite"/></circle>
                  <circle cx="290" cy="108" r="2" fill="#da1e28" opacity="0.7"><animate attributeName="r" values="2;5;2" dur="2.2s" repeatCount="indefinite"/></circle>
                </svg>
                <div className="absolute bottom-2 left-2 flex gap-3">
                  {[{ color: "bg-[#da1e28]", label: "Critical" }, { color: "bg-[#f1c21b]", label: "High" }, { color: "bg-[#0f62fe]", label: "Medium" }].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${color}`} />
                      <span className="text-[9px] text-[#8d8d8d]">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feed status */}
            <div className="bg-white p-4">
              <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest mb-3">Intel Feed Status</h3>
              <div className="space-y-2">
                {feeds.map(({ name, status, synced, iocs }) => (
                  <div key={name} className="flex items-center justify-between py-2 border-b border-[#f4f4f4] last:border-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${status === "healthy" ? "bg-[#198038]" : "bg-[#f57c00]"}`} />
                      <span className="text-xs font-medium">{name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#6f6f6f]">{iocs.toLocaleString()} IOCs</p>
                      <p className="text-[9px] text-[#8d8d8d]">{synced}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center + Right */}
          <div className="col-span-8 flex flex-col gap-6">
            {/* Threat Actors */}
            <div className="bg-white p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest">Active Threat Actors</h3>
                <button className="text-[10px] text-[#0f62fe] font-semibold hover:underline">View All 47</button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {threatActors.map(({ name, origin, tier, ttps, confidence, lastSeen, color }) => (
                  <div key={name} className={`border-l-4 ${color} bg-[#f4f4f4] p-4`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs font-bold leading-tight">{name}</p>
                        <p className="text-[10px] text-[#6f6f6f] mt-0.5">{origin} · {tier}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#0f62fe]">{confidence}%</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {ttps.map((t) => (
                        <span key={t} className="text-[9px] bg-[#e0e0e0] px-1.5 py-0.5 text-[#525252]">{t}</span>
                      ))}
                    </div>
                    <p className="text-[10px] text-[#6f6f6f]">Last seen: {lastSeen}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CVE Table */}
            <div className="bg-white overflow-hidden">
              <div className="p-4 border-b border-[#e0e0e0] flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest">CVE Explorer — Your Environment</h3>
                <div className="flex gap-2">
                  <select className="text-[10px] bg-[#f4f4f4] border-none px-2 py-1 text-[#6f6f6f] focus:outline-none">
                    <option>All Severity</option>
                    <option>Critical</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#e0e0e0] text-[#6f6f6f] uppercase font-bold text-[10px]">
                    {["CVE ID", "CVSS", "Severity", "Affected Product", "Assets Hit", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cves.map(({ id, cvss, severity, product, affected, patched }) => (
                    <tr key={id} className="border-b border-[#f4f4f4] hover:bg-[#f4f4f4] transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-[#0f62fe]">{id}</td>
                      <td className="px-4 py-3 font-bold">{cvss}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold ${severityColor[severity]}`}>{severity}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px]">{product}</td>
                      <td className="px-4 py-3 font-bold">{affected}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold ${patched ? "text-[#198038]" : "text-[#da1e28]"}`}>
                          {patched ? "✓ Patched" : "✗ Unpatched"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* IOC Watchlist */}
            <div className="bg-white p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold uppercase text-[#6f6f6f] tracking-widest">IOC Watchlist</h3>
                <button className="text-[10px] text-[#0f62fe] font-semibold hover:underline">+ Add IOC</button>
              </div>
              <div className="space-y-1">
                {iocs.map(({ type, value, threat, confidence, action }) => (
                  <div key={value} className="flex items-center gap-4 px-3 py-2 bg-[#f4f4f4] hover:bg-[#e0e0e0] transition-colors">
                    <span className="text-[9px] bg-[#e0e0e0] px-2 py-0.5 font-bold text-[#525252] w-12 text-center">{type}</span>
                    <span className="font-mono text-xs flex-1">{value}</span>
                    <span className="text-[10px] text-[#6f6f6f] w-28">{threat}</span>
                    <span className="text-[10px] font-bold w-10 text-right">{confidence}%</span>
                    <span className={`text-[10px] font-bold w-16 text-right ${
                      action === "Blocked" ? "text-[#da1e28]" : action === "Alerting" ? "text-[#f57c00]" : "text-[#6f6f6f]"
                    }`}>{action}</span>
                    <button className="text-[#6f6f6f] hover:text-[#da1e28]">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
