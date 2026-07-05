import type { Citation } from "@/lib/investigate-data"

export type StepStatus = "done" | "pending" | "locked" | "approved" | "rejected"

export interface PlaybookStep {
  id: number
  titleEn: string
  titleId: string
  descEn: string
  descId: string
  citations?: Citation[]
  coverageEn?: string
  coverageId?: string
  requiresApproval: boolean
  initialStatus: StepStatus
}

export const PLAYBOOK_STEPS: PlaybookStep[] = [
  {
    id: 1,
    titleEn: "1. Alert ingested and classified",
    titleId: "1. Alert diterima dan diklasifikasi",
    descEn: "T1110.001 Brute Force — AI confidence 94%. Source IPs identified: 45.152.67.23, 185.220.101.9, 91.240.118.172.",
    descId: "T1110.001 Brute Force — Kepercayaan AI 94%. IP sumber teridentifikasi.",
    citations: [
      { kind: "attck", label: "attck:T1110.001", title: "node_hash: 7f3a91e2 · ingested: 2026-04-25 13:58 WIB · tier: knowledge-graph" },
      { kind: "internal", label: "log:sshd_auth", title: "node_hash: 91ae7c30 · ingested: 2026-04-25 14:07 WIB · tier: internal-telemetry (sshd auth log)" },
    ],
    requiresApproval: false,
    initialStatus: "done",
  },
  {
    id: 2,
    titleEn: "2. Log enrichment & correlation",
    titleId: "2. Pengayaan log & korelasi",
    descEn: "No successful logins detected. All 3 source IPs flagged in AbuseIPDB. No lateral movement detected.",
    descId: "Tidak ada login berhasil terdeteksi. Semua 3 IP sumber ditandai di AbuseIPDB.",
    citations: [
      { kind: "abuseipdb", label: "abuseipdb:×3", title: "node_hash: b04c22d1 · ingested: 2026-04-25 14:02 WIB · tier: external-threat-intel" },
    ],
    coverageEn: "2 independent citations — meets ≥2 required for HIGH-severity verdict",
    coverageId: "2 sitasi independen — memenuhi ≥2 yang diperlukan untuk verdict keparahan TINGGI",
    requiresApproval: false,
    initialStatus: "done",
  },
  {
    id: 3,
    titleEn: "3. Block source IPs at firewall",
    titleId: "3. Blokir IP sumber di firewall",
    descEn: "Add deny rules for 45.152.67.23/32, 185.220.101.9/32, 91.240.118.172/32 to perimeter firewall.",
    descId: "Tambahkan aturan deny untuk 3 IP sumber ke firewall perimeter.",
    requiresApproval: true,
    initialStatus: "pending",
  },
  {
    id: 4,
    titleEn: "4. Disable SSH password authentication",
    titleId: "4. Nonaktifkan autentikasi kata sandi SSH",
    descEn: "Set PasswordAuthentication no in /etc/ssh/sshd_config and reload sshd.",
    descId: "Atur PasswordAuthentication no di sshd_config dan muat ulang sshd.",
    requiresApproval: true,
    initialStatus: "locked",
  },
  {
    id: 5,
    titleEn: "5. Create incident ticket & notify team",
    titleId: "5. Buat tiket insiden & beri tahu tim",
    descEn: "Open DFIR-IRIS case with full evidence bundle. Notify on-call analyst.",
    descId: "Buka kasus DFIR-IRIS dengan bundel bukti lengkap. Beri tahu analis on-call.",
    requiresApproval: true,
    initialStatus: "locked",
  },
]

export const APPROVE_LABELS: Record<number, { en: string; id: string }> = {
  3: { en: "IP block approved and applied", id: "Blokir IP disetujui dan diterapkan" },
  4: { en: "SSH password auth disabled", id: "Autentikasi kata sandi SSH dinonaktifkan" },
  5: { en: "Incident ticket created, team notified", id: "Tiket insiden dibuat, tim diberitahu" },
}

export type CaseSeverity = "critical" | "high" | "medium" | "low"
export type CaseStatus = "pending" | "new" | "investigating" | "resolved"

export interface Case {
  id: string
  titleEn: string
  titleId: string
  severity: CaseSeverity
  status: CaseStatus
  confidence: number
  assignee: string | null
  assignedToMe: boolean
  updatedEn: string
  updatedId: string
}

export const CASE_QUEUE: Case[] = [
  {
    id: "CASE-2026-0417",
    titleEn: "SSH Brute Force — ssh.domain.com",
    titleId: "SSH Brute Force — ssh.domain.com",
    severity: "critical",
    status: "pending",
    confidence: 94,
    assignee: "Rangga P.",
    assignedToMe: true,
    updatedEn: "14:08",
    updatedId: "14:08",
  },
  {
    id: "CASE-2026-0416",
    titleEn: "DMARC policy missing — company domain",
    titleId: "Kebijakan DMARC hilang — domain perusahaan",
    severity: "high",
    status: "new",
    confidence: 88,
    assignee: null,
    assignedToMe: false,
    updatedEn: "13:45",
    updatedId: "13:45",
  },
  {
    id: "CASE-2026-0415",
    titleEn: "4 admin accounts without MFA",
    titleId: "4 akun admin tanpa MFA",
    severity: "medium",
    status: "investigating",
    confidence: 97,
    assignee: "Dian K.",
    assignedToMe: false,
    updatedEn: "12:20",
    updatedId: "12:20",
  },
  {
    id: "CASE-2026-0411",
    titleEn: "Unusual outbound traffic — finance VLAN",
    titleId: "Lalu lintas keluar tidak wajar — VLAN keuangan",
    severity: "medium",
    status: "resolved",
    confidence: 91,
    assignee: "Rangga P.",
    assignedToMe: true,
    updatedEn: "Yesterday",
    updatedId: "Kemarin",
  },
  {
    id: "CASE-2026-0409",
    titleEn: "Phishing email reported by employee",
    titleId: "Email phishing dilaporkan karyawan",
    severity: "low",
    status: "resolved",
    confidence: 99,
    assignee: "Dian K.",
    assignedToMe: false,
    updatedEn: "Yesterday",
    updatedId: "Kemarin",
  },
]

export const ROLE_VIEW_NOTES: Record<string, { en: string; id: string }> = {
  analyst: {
    en: "Role-gated view (concept preview): analysts see full case detail and citations.",
    id: "Tampilan berbasis peran (pratinjau konsep): analis melihat detail kasus dan sitasi lengkap.",
  },
  admin: {
    en: "Role-gated view (concept preview): tenant admins see cross-team case ownership and SLA fields.",
    id: "Tampilan berbasis peran (pratinjau konsep): admin tenant melihat kepemilikan kasus lintas tim dan field SLA.",
  },
  compliance: {
    en: "Role-gated view (concept preview): compliance sees citation trail and audit export fields only.",
    id: "Tampilan berbasis peran (pratinjau konsep): kepatuhan hanya melihat jejak sitasi dan field ekspor audit.",
  },
}
