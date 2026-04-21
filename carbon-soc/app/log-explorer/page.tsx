const logs = [
  { time: "09:14:02.441", level: "CRIT", source: "auth-server-01",   event: "Multiple failed SSH logins from 192.168.44.102 — 4,290 attempts/min targeting root", user: "root",   proto: "SSH"  },
  { time: "09:13:58.120", level: "HIGH", source: "edge-firewall-04", event: "DDoS threshold exceeded — incoming traffic 64.2 Gbps on interface eth0",              user: "-",      proto: "TCP"  },
  { time: "09:13:44.009", level: "HIGH", source: "db-prod-cluster",  event: "Unauthorized query pattern detected — bulk SELECT on customers table from 10.0.3.22", user: "svc_bi", proto: "SQL"  },
  { time: "09:12:30.887", level: "INFO", source: "web-server-03",    event: "HTTP 500 error rate elevated — 18% of requests returning 5xx in last 60s",            user: "-",      proto: "HTTP" },
  { time: "09:11:05.334", level: "WARN", source: "vpn-gateway-01",   event: "Concurrent session limit warning — 94% capacity reached for remote access pool",      user: "-",      proto: "IKE"  },
  { time: "09:10:22.001", level: "INFO", source: "auth-server-01",   event: "Successful LDAP bind for service account svc_deploy from 10.0.1.50",                  user: "svc_deploy", proto: "LDAP" },
  { time: "09:09:48.765", level: "CRIT", source: "endpoint-tx-fin",  event: "Ransomware behavior detected — mass file extension modification .locked on share",    user: "j_doe",  proto: "SMB"  },
  { time: "09:08:12.440", level: "INFO", source: "db-backup",        event: "Daily differential backup completed — 142 GB written to s3://soc-backups/2024-10-24", user: "backup", proto: "S3"   },
  { time: "09:07:55.210", level: "WARN", source: "k8s-node-04",      event: "Pod crash loop detected — soc-collector-7d9f restarted 5 times in last 10 minutes",   user: "-",      proto: "K8s"  },
  { time: "09:06:30.113", level: "INFO", source: "edge-firewall-04", event: "IP 104.22.4.19 automatically blocked by playbook Auto-Block Brute Force",             user: "system", proto: "FW"   },
];

const facets = [
  { label: "Source Host",  values: [{ v: "auth-server-01", n: 312 }, { v: "edge-firewall-04", n: 188 }, { v: "db-prod-cluster", n: 97 }, { v: "web-server-03", n: 74 }] },
  { label: "Level",        values: [{ v: "CRIT", n: 18 }, { v: "HIGH", n: 43 }, { v: "WARN", n: 127 }, { v: "INFO", n: 824 }] },
  { label: "Protocol",     values: [{ v: "SSH", n: 412 }, { v: "HTTP", n: 389 }, { v: "TCP", n: 201 }, { v: "SQL", n: 88 }] },
];

const histogram = [22, 31, 18, 45, 38, 62, 55, 71, 48, 90, 83, 66, 44, 38, 52, 70, 88, 95, 72, 61, 54, 42, 38, 50];

const levelColor: Record<string, string> = {
  CRIT: "text-[#da1e28] bg-[#fff1f1]",
  HIGH: "text-[#f57c00] bg-[#fff8e1]",
  WARN: "text-[#f9a825] bg-[#fffde7]",
  INFO: "text-[#0f62fe] bg-[#e8f0fe]",
};

export default function LogExplorerPage() {
  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">

      {/* Search bar */}
      <div className="border-b border-[#e0e0e0] px-6 py-4 bg-white">
        <div className="flex gap-3 items-center mb-3">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6f6f6f]">manage_search</span>
            <input
              className="w-full h-10 bg-[#f4f4f4] border-b-2 border-[#8d8d8d] focus:border-[#0f62fe] border-t-0 border-x-0 outline-none pl-10 pr-4 text-sm font-mono"
              defaultValue='source:"auth-server-01" level:CRIT'
              type="text"
            />
          </div>
          <select className="h-10 bg-[#f4f4f4] border-none px-3 text-xs text-[#161616] focus:outline-none focus:ring-1 focus:ring-[#0f62fe]">
            <option>Last 15 minutes</option>
            <option>Last 1 hour</option>
            <option>Last 24 hours</option>
            <option>Custom range</option>
          </select>
          <button className="h-10 bg-[#0f62fe] text-white px-5 text-xs font-semibold hover:bg-[#0043ce] transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">search</span> Search
          </button>
        </div>
        <div className="flex gap-2">
          {["Failed SSH Login", "Firewall Block", "DB Anomaly", "High Traffic"].map((q) => (
            <button key={q} className="text-[10px] bg-[#e8f0fe] text-[#0f62fe] px-2 py-1 hover:bg-[#d0e2ff] transition-colors">
              {q}
            </button>
          ))}
          <span className="text-[10px] text-[#6f6f6f] px-2 py-1">Saved queries</span>
        </div>
      </div>

      {/* Histogram */}
      <div className="px-6 py-3 border-b border-[#e0e0e0] bg-[#f4f4f4]">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-[#6f6f6f] font-semibold uppercase">Event volume — last 24h</span>
          <span className="text-[10px] text-[#6f6f6f]">1,012 events matched</span>
        </div>
        <div className="flex items-end gap-0.5 h-12">
          {histogram.map((h, i) => (
            <div
              key={i}
              className="flex-1 hover:bg-[#0f62fe] transition-colors cursor-pointer"
              style={{ height: `${(h / 100) * 100}%`, background: i === 9 || i === 10 ? "#da1e28" : "#c6c6c6" }}
              title={`${h} events`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-[#8d8d8d] mt-1">
          <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>now</span>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Facets sidebar */}
        <div className="w-52 border-r border-[#e0e0e0] overflow-y-auto custom-scrollbar bg-white shrink-0">
          {facets.map(({ label, values }) => (
            <div key={label} className="border-b border-[#f4f4f4]">
              <div className="px-4 py-2 flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase text-[#6f6f6f] tracking-widest">{label}</span>
                <span className="material-symbols-outlined text-sm text-[#6f6f6f]">expand_more</span>
              </div>
              {values.map(({ v, n }) => (
                <label key={v} className="flex items-center gap-2 px-4 py-1.5 hover:bg-[#f4f4f4] cursor-pointer">
                  <input type="checkbox" className="accent-[#0f62fe]" />
                  <span className="text-[10px] flex-1 truncate">{v}</span>
                  <span className="text-[9px] text-[#8d8d8d] font-mono">{n}</span>
                </label>
              ))}
            </div>
          ))}
        </div>

        {/* Log results */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#e0e0e0] text-[#6f6f6f] text-[10px] uppercase font-bold">
                <th className="px-4 py-3 w-36">Timestamp</th>
                <th className="px-4 py-3 w-16">Level</th>
                <th className="px-4 py-3 w-36">Source</th>
                <th className="px-4 py-3">Event Message</th>
                <th className="px-4 py-3 w-24">User</th>
                <th className="px-4 py-3 w-16">Proto</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {logs.map(({ time, level, source, event, user, proto }) => (
                <tr key={time} className="border-b border-[#f4f4f4] hover:bg-[#f4f4f4] transition-colors cursor-pointer group">
                  <td className="px-4 py-3 font-mono text-[10px] text-[#6f6f6f] whitespace-nowrap">{time}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] px-1.5 py-0.5 font-bold ${levelColor[level]}`}>{level}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-[#0f62fe] whitespace-nowrap">{source}</td>
                  <td className="px-4 py-3 text-xs text-[#161616] leading-relaxed">{event}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-[#6f6f6f]">{user}</td>
                  <td className="px-4 py-3">
                    <span className="text-[9px] bg-[#e0e0e0] px-1.5 py-0.5 font-mono text-[#525252]">{proto}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="opacity-0 group-hover:opacity-100 text-[#0f62fe] transition-opacity" title="Investigate with AI">
                      <span className="material-symbols-outlined text-sm">psychology</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 flex justify-between items-center border-t border-[#e0e0e0] bg-white sticky bottom-0">
            <span className="text-[10px] text-[#6f6f6f]">Showing 1–10 of 1,012 results</span>
            <div className="flex gap-1">
              {["chevron_left", "1", "2", "3", "…", "102", "chevron_right"].map((p, i) => (
                <button
                  key={i}
                  className={`min-w-[28px] h-7 flex items-center justify-center text-[10px] border transition-colors ${
                    p === "1" ? "bg-[#0f62fe] text-white border-[#0f62fe]" : "border-[#e0e0e0] text-[#6f6f6f] hover:bg-[#f4f4f4]"
                  }`}
                >
                  {p.startsWith("chevron") ? <span className="material-symbols-outlined text-sm">{p}</span> : p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
