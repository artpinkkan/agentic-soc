export type Severity = "critical" | "high"

export interface Citation {
  kind: "internal" | "attck" | "abuseipdb" | "cve"
  label: string
  title: string
}

export interface Message {
  role: "user" | "ai"
  en: string
  id: string
  citations?: Citation[]
  citationCoverageEn?: string
  citationCoverageId?: string
  recommendationEn?: string
  recommendationId?: string
  confidence?: number
  verified?: string
  abstain?: boolean
}

export interface Conversation {
  key: string
  titleEn: string
  titleId: string
  ref?: string | null
  severity?: Severity
  messages: Message[]
}

export const INITIAL_CONVERSATIONS: Record<string, Conversation> = {
  network: {
    key: "network",
    titleEn: "SSH brute force — ssh.domain.com",
    titleId: "Brute force SSH — ssh.domain.com",
    ref: "CASE-2026-0417",
    severity: "critical",
    messages: [
      {
        role: "user",
        en: "We got an alert about 847 failed SSH logins in the last hour on ssh.domain.com. Is this an active attack?",
        id: "Kami mendapat alert tentang 847 kegagalan login SSH dalam satu jam terakhir di ssh.domain.com. Apakah ini serangan aktif?",
      },
      {
        role: "ai",
        en: "Analysis complete. This matches a distributed SSH brute-force pattern — 847 attempts from 34 distinct IPs, no successful logins. Requires immediate attention: rate-limit or block the source ranges.",
        id: "Analisis selesai. Ini cocok dengan pola brute-force SSH terdistribusi — 847 percobaan dari 34 IP berbeda, tanpa login berhasil. Memerlukan perhatian segera: batasi laju atau blokir rentang sumber.",
        citations: [
          { kind: "internal", label: "log:auth_query", title: "node_hash: 5c9e14af · tier: internal-telemetry" },
          { kind: "attck", label: "attck:T1110.001", title: "node_hash: 2b7f0a91 · tier: knowledge-graph" },
        ],
        citationCoverageEn: "2 independent citations — meets ≥2 required",
        citationCoverageId: "2 sitasi independen — memenuhi ≥2 yang diperlukan",
        recommendationEn: "Enable fail2ban / rate limiting on ssh.domain.com and block the top offending source ranges.",
        recommendationId: "Aktifkan fail2ban / pembatasan laju pada ssh.domain.com dan blokir rentang sumber utama.",
        confidence: 87,
        verified: "4/5",
      },
    ],
  },
  email: {
    key: "email",
    titleEn: "DMARC policy missing on domain",
    titleId: "Kebijakan DMARC hilang di domain",
    ref: "CASE-2026-0416",
    severity: "critical",
    messages: [
      { role: "user", en: "How do we fix this?", id: "Bagaimana cara memperbaikinya?" },
      {
        role: "ai",
        en: "Your company domain has no DMARC record, so spoofed mail using your domain will not be rejected or reported.",
        id: "Domain perusahaan Anda tidak memiliki rekaman DMARC, sehingga email yang dipalsukan menggunakan domain Anda tidak akan ditolak atau dilaporkan.",
        citations: [
          { kind: "internal", label: "dns:txt_lookup", title: "node_hash: 9a1c22de · tier: internal-telemetry" },
          { kind: "cve", label: "ref:rfc7489", title: "node_hash: 44e0b6aa · tier: knowledge-graph" },
        ],
        citationCoverageEn: "2 independent citations — meets ≥2 required",
        citationCoverageId: "2 sitasi independen — memenuhi ≥2 yang diperlukan",
        recommendationEn: "Publish a DMARC TXT record starting at p=quarantine, then move to p=reject after monitoring reports.",
        recommendationId: "Terbitkan rekaman TXT DMARC mulai dari p=quarantine, lalu pindah ke p=reject setelah memantau laporan.",
        confidence: 91,
        verified: "5/5",
      },
    ],
  },
  identity: {
    key: "identity",
    titleEn: "4 admin accounts without MFA",
    titleId: "4 akun admin tanpa MFA",
    ref: "CASE-2026-0415",
    severity: "high",
    messages: [
      { role: "user", en: "Which accounts are affected?", id: "Akun mana saja yang terdampak?" },
      {
        role: "ai",
        en: "4 accounts with administrator-level roles do not have MFA enrolled. These accounts have standing access to production resources.",
        id: "4 akun dengan peran administrator tidak memiliki pendaftaran MFA. Akun-akun ini memiliki akses tetap ke sumber daya produksi.",
        citations: [
          { kind: "internal", label: "iam:role_audit", title: "node_hash: 71bb90fc · tier: internal-telemetry" },
          { kind: "attck", label: "attck:T1078", title: "node_hash: 0c3d81ab · tier: knowledge-graph" },
        ],
        citationCoverageEn: "2 independent citations — meets ≥2 required",
        citationCoverageId: "2 sitasi independen — memenuhi ≥2 yang diperlukan",
        recommendationEn: "Enforce MFA for all administrator roles via conditional access policy before the next access review.",
        recommendationId: "Wajibkan MFA untuk semua peran administrator melalui kebijakan akses kondisional sebelum tinjauan akses berikutnya.",
        confidence: 84,
        verified: "4/5",
      },
    ],
  },
  log: {
    key: "log",
    titleEn: "SIEM ingestion pipeline delayed 6h",
    titleId: "Pipa ingesti SIEM tertunda 6 jam",
    ref: "CASE-2026-0414",
    severity: "critical",
    messages: [
      { role: "user", en: "Why is ingestion lagging?", id: "Mengapa ingesti tertunda?" },
      {
        role: "ai",
        en: "Log ingestion into the central SIEM has been delayed by up to 6 hours over the past 2 days, likely due to a queue backlog on the collector tier.",
        id: "Ingesti log ke SIEM pusat tertunda hingga 6 jam selama 2 hari terakhir, kemungkinan karena antrean menumpuk di tingkat kolektor.",
        citations: [
          { kind: "internal", label: "log:pipeline_lag", title: "node_hash: 3fa76c12 · tier: internal-telemetry" },
        ],
        citationCoverageEn: "1 independent citation — below the ≥2 required, treat as low-confidence",
        citationCoverageId: "1 sitasi independen — di bawah ≥2 yang diperlukan, anggap sebagai tingkat keyakinan rendah",
        confidence: 52,
        verified: "3/5",
        abstain: true,
      },
    ],
  },
  web: {
    key: "web",
    titleEn: "Expired TLS cert on staging subdomain",
    titleId: "Sertifikat TLS kedaluwarsa di subdomain staging",
    ref: "CASE-2026-0413",
    severity: "high",
    messages: [
      { role: "user", en: "Which cert, and how urgent?", id: "Sertifikat mana, seberapa mendesak?" },
      {
        role: "ai",
        en: "The TLS certificate for staging.domain.com expired 3 days ago. It is not public-facing production traffic, but browsers will now show hard warnings to anyone accessing it.",
        id: "Sertifikat TLS untuk staging.domain.com kedaluwarsa 3 hari lalu. Ini bukan lalu lintas produksi publik, tetapi browser sekarang akan menampilkan peringatan keras bagi siapa pun yang mengaksesnya.",
        citations: [
          { kind: "internal", label: "tls:cert_scan", title: "node_hash: b219e4f0 · tier: internal-telemetry" },
          { kind: "cve", label: "ref:rfc5280", title: "node_hash: 8d4a1c77 · tier: knowledge-graph" },
        ],
        citationCoverageEn: "2 independent citations — meets ≥2 required",
        citationCoverageId: "2 sitasi independen — memenuhi ≥2 yang diperlukan",
        recommendationEn: "Renew the certificate and enable auto-renewal (e.g. via ACME/Let's Encrypt) to prevent recurrence.",
        recommendationId: "Perbarui sertifikat dan aktifkan pembaruan otomatis (mis. melalui ACME/Let's Encrypt) untuk mencegah terulang.",
        confidence: 88,
        verified: "5/5",
      },
    ],
  },
  endpoint: {
    key: "endpoint",
    titleEn: "New conversation",
    titleId: "Percakapan baru",
    ref: null,
    messages: [],
  },
}
