export type RiskLevel = "high" | "medium"

export interface PendingAction {
  id: number
  risk: RiskLevel
  timeAgoEn: string
  timeAgoId: string
  toolCall: string
  reasonEn: string
  reasonId: string
}

export const PENDING_ACTIONS: PendingAction[] = [
  {
    id: 1,
    risk: "medium",
    timeAgoEn: "3 min ago",
    timeAgoId: "3 menit lalu",
    toolCall: 'read_employee_records(department="finance", fields=["access_log","device_id"], limit=50)',
    reasonEn: "Correlating identity anomaly with employee access patterns — HR data access requires approval.",
    reasonId: "Mengkorelasikan anomali identitas dengan pola akses karyawan — akses data HR memerlukan persetujuan.",
  },
  {
    id: 2,
    risk: "high",
    timeAgoEn: "7 min ago",
    timeAgoId: "7 menit lalu",
    toolCall: 'update_dlp_policy(rule_id="ext-upload-block", add_exception="trusted-vendor.co.id", duration="7d")',
    reasonEn: "Temporary DLP exception requested for approved vendor data transfer — policy modification requires human approval + audit.",
    reasonId: "Pengecualian DLP sementara diminta untuk transfer data vendor yang disetujui — modifikasi kebijakan memerlukan persetujuan manusia + audit.",
  },
  {
    id: 3,
    risk: "medium",
    timeAgoEn: "15 min ago",
    timeAgoId: "15 menit lalu",
    toolCall: 'send_executive_brief(recipients=["ceo@contoh.co.id","ciso@contoh.co.id"], subject="Incident Summary Q2")',
    reasonEn: "AI-generated incident summary for C-suite. First-time external send to these recipients requires approval.",
    reasonId: "Ringkasan insiden yang dibuat AI untuk C-suite. Pengiriman eksternal pertama kali ke penerima ini memerlukan persetujuan.",
  },
]

export type PolicyMode = "hitl" | "audit" | "auto"

export interface PolicyRule {
  nameEn: string
  nameId: string
  mode: PolicyMode
  icon: "users" | "settings" | "mail" | "export" | "brain" | "search" | "logs" | "report"
}

export const POLICY_GROUPS: { labelEn: string; labelId: string; rules: PolicyRule[] }[] = [
  {
    labelEn: "Requires Approval",
    labelId: "Persetujuan Diperlukan",
    rules: [
      { nameEn: "Access HR / employee records", nameId: "Akses data karyawan / HR", mode: "hitl", icon: "users" },
      { nameEn: "Modify security policy", nameId: "Modifikasi kebijakan keamanan", mode: "audit", icon: "settings" },
      { nameEn: "Send external communication", nameId: "Kirim komunikasi eksternal", mode: "hitl", icon: "mail" },
      { nameEn: "Export data externally", nameId: "Ekspor data ke luar", mode: "audit", icon: "export" },
      { nameEn: "Update knowledge base", nameId: "Perbarui basis pengetahuan", mode: "hitl", icon: "brain" },
    ],
  },
  {
    labelEn: "Auto-approved",
    labelId: "Otomatis Disetujui",
    rules: [
      { nameEn: "Query external threat intel", nameId: "Kueri intelijen ancaman eksternal", mode: "auto", icon: "search" },
      { nameEn: "Read log data", nameId: "Baca data log", mode: "auto", icon: "logs" },
      { nameEn: "Generate compliance report", nameId: "Buat laporan kepatuhan", mode: "auto", icon: "report" },
    ],
  },
]

export type AuditDecision = "auto" | "approved" | "rejected"
export type AuditOutcome = "success" | "none"

export interface AuditEntry {
  time: string
  agent: string
  toolCall: string
  decision: AuditDecision
  decidedByEn: string
  decidedById: string
  outcome: AuditOutcome
}

export const AUDIT_LOG: AuditEntry[] = [
  { time: "14:32", agent: "Shannon SOC Agent", toolCall: 'read_logs(source="siem", days=7)', decision: "auto", decidedByEn: "Policy", decidedById: "Kebijakan", outcome: "success" },
  { time: "14:29", agent: "Shannon SOC Agent", toolCall: 'query_threat_intel(ioc="45.33.32.156")', decision: "auto", decidedByEn: "Policy", decidedById: "Kebijakan", outcome: "success" },
  { time: "14:27", agent: "Shannon SOC Agent", toolCall: 'send_executive_brief(recipients=["ciso@..."])', decision: "approved", decidedByEn: "Budi S.", decidedById: "Budi S.", outcome: "success" },
  { time: "14:24", agent: "Shannon SOC Agent", toolCall: 'update_dlp_policy(rule_id="ext-upload-block")', decision: "rejected", decidedByEn: "Budi S.", decidedById: "Budi S.", outcome: "none" },
  { time: "14:21", agent: "Shannon SOC Agent", toolCall: 'generate_compliance_report(framework="ISO27001")', decision: "auto", decidedByEn: "Policy", decidedById: "Kebijakan", outcome: "success" },
  { time: "14:17", agent: "Shannon SOC Agent", toolCall: 'read_employee_records(dept="finance", limit=50)', decision: "approved", decidedByEn: "Budi S.", decidedById: "Budi S.", outcome: "success" },
  { time: "14:12", agent: "Shannon SOC Agent", toolCall: 'read_logs(source="firewall", days=3)', decision: "auto", decidedByEn: "Policy", decidedById: "Kebijakan", outcome: "success" },
  { time: "14:08", agent: "Shannon SOC Agent", toolCall: 'update_knowledge_base(source="incident-52")', decision: "approved", decidedByEn: "Budi S.", decidedById: "Budi S.", outcome: "success" },
  { time: "14:05", agent: "Shannon SOC Agent", toolCall: 'export_data(dest="siem-backup", rows=1200)', decision: "rejected", decidedByEn: "Budi S.", decidedById: "Budi S.", outcome: "none" },
  { time: "14:01", agent: "Shannon SOC Agent", toolCall: 'query_threat_intel(ioc="malware.contoh.io")', decision: "auto", decidedByEn: "Policy", decidedById: "Kebijakan", outcome: "success" },
]
