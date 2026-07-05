export type ReportSeverity = "critical" | "high" | "medium" | "low"
export type ReportStatus = "open" | "review" | "closed"
export type Audience = "direktur" | "it" | "finance" | "auditor"

export interface Bilingual {
  en: string
  id: string
}

// Some content is audience-tailored (direktur/it/finance/auditor); other content is a
// single EN/ID pair shared across audiences to keep authored content manageable.
export type AudienceText = Bilingual | Partial<Record<Audience, Bilingual>>

export function pick(field: AudienceText, aud: Audience): Bilingual {
  const asMap = field as Partial<Record<Audience, Bilingual>>
  return asMap[aud] ?? asMap.direktur ?? (field as Bilingual)
}

export interface Finding {
  sev: ReportSeverity
  title: AudienceText
  sub: AudienceText
}

export interface Recommendation {
  en: string
  id: string
  durationEn: string
  durationId: string
}

export interface Report {
  id: string
  titleEn: string
  titleId: string
  date: string
  severity: ReportSeverity
  status: ReportStatus
  summary: AudienceText
  findings: Finding[]
  recommendations: Recommendation[]
}

export const AUDIENCE_LABEL: Record<Audience, Bilingual> = {
  direktur: { en: "Executive", id: "Eksekutif" },
  it: { en: "IT / Technical", id: "IT / Teknis" },
  finance: { en: "Finance", id: "Keuangan" },
  auditor: { en: "Auditor / Compliance", id: "Auditor / Kepatuhan" },
}

export const REPORT_TYPE_LABEL: Record<Audience, Bilingual> = {
  direktur: { en: "Executive Report", id: "Laporan Eksekutif" },
  it: { en: "Technical Report", id: "Laporan Teknis" },
  finance: { en: "Financial Risk Report", id: "Laporan Risiko Keuangan" },
  auditor: { en: "Compliance Report", id: "Laporan Kepatuhan" },
}

export const SEV_LABEL: Record<ReportSeverity, Bilingual> = {
  critical: { en: "Critical", id: "Kritis" },
  high: { en: "High", id: "Tinggi" },
  medium: { en: "Medium", id: "Sedang" },
  low: { en: "Low", id: "Rendah" },
}

export const STATUS_LABEL: Record<ReportStatus, Bilingual> = {
  open: { en: "Open", id: "Terbuka" },
  review: { en: "Reviewing", id: "Ditinjau" },
  closed: { en: "Closed", id: "Ditutup" },
}

export const REPORTS: Report[] = [
  {
    id: "047",
    titleEn: "SSH Brute Force — ws-04",
    titleId: "Brute Force SSH — ws-04",
    date: "05 Jul 2026",
    severity: "high",
    status: "open",
    summary: {
      direktur: { en: "Critical findings: 2 critical risks, 2 requiring attention. Immediate executive action required.", id: "Temuan kritis: 2 risiko kritis, 2 perlu perhatian. Tindakan eksekutif segera diperlukan." },
      it: { en: "2 critical controls failed (DMARC, log retention). 2 high findings (SSH exposure, MFA gap). Patch and configuration changes required.", id: "2 kontrol kritis gagal (DMARC, retensi log). 2 temuan tinggi (SSH terekspos, gap MFA). Patch dan perubahan konfigurasi diperlukan." },
      finance: { en: "Financial risk identified: email fraud and unauthorized access to financial systems are possible without immediate action.", id: "Risiko keuangan teridentifikasi: penipuan email dan akses tidak sah ke sistem keuangan mungkin terjadi tanpa tindakan segera." },
      auditor: { en: "4 findings do not meet compliance requirements: DMARC missing, log retention below audit standard minimum, MFA gap, undocumented attack surface.", id: "4 temuan tidak memenuhi persyaratan kepatuhan: DMARC tidak ada, retensi log di bawah minimum standar audit, gap MFA, permukaan serangan tidak terdokumentasi." },
    },
    findings: [
      {
        sev: "critical",
        title: {
          direktur: { en: "No DMARC policy — email spoofing risk to stakeholders", id: "Tidak ada kebijakan DMARC — risiko pemalsuan email ke pemangku kepentingan" },
          it: { en: "DMARC missing on company domain — SPF found, DKIM absent, policy p=none", id: "DMARC tidak ada di domain perusahaan — SPF ditemukan, DKIM tidak ada, kebijakan p=none" },
          finance: { en: "No DMARC — invoice and payment emails can be spoofed, high fraud risk", id: "Tidak ada DMARC — email tagihan dan pembayaran dapat dipalsukan, risiko penipuan tinggi" },
          auditor: { en: "DMARC policy absent — non-compliant with email authentication requirements", id: "Kebijakan DMARC tidak ada — tidak sesuai persyaratan autentikasi email" },
        },
        sub: {
          direktur: { en: "Business impact: brand damage, fraud exposure", id: "Dampak bisnis: kerusakan merek, eksposur penipuan" },
          it: { en: "Fix: add TXT record _dmarc.domain.com with p=quarantine · ~1 hr", id: "Perbaikan: tambahkan record TXT _dmarc.domain.com dengan p=quarantine · ~1 jam" },
          finance: { en: "Estimated fraud exposure: medium-high based on transaction volume", id: "Estimasi eksposur penipuan: sedang-tinggi berdasarkan volume transaksi" },
          auditor: { en: "Required by: standard email security policy §4.2", id: "Disyaratkan oleh: kebijakan keamanan email standar §4.2" },
        },
      },
      {
        sev: "critical",
        title: {
          direktur: { en: "Log retention 7 days — below audit standard", id: "Retensi log 7 hari — di bawah standar audit" },
          it: { en: "Log retention 7 days vs audit-standard 90 days — affects SIEM coverage and forensics", id: "Retensi log 7 hari vs 90 hari standar audit — memengaruhi cakupan SIEM dan forensik" },
          finance: { en: "Short log retention limits fraud investigation window — audit trail incomplete", id: "Retensi log pendek membatasi jendela investigasi penipuan — jejak audit tidak lengkap" },
          auditor: { en: "Log retention 7 days — audit standard minimum is 90 days. Immediate remediation required.", id: "Retensi log 7 hari — minimum standar audit adalah 90 hari. Remediasi segera diperlukan." },
        },
        sub: {
          direktur: { en: "Regulatory risk: audit exposure", id: "Risiko regulasi: eksposur audit" },
          it: { en: "Fix: configure log pipeline retention to 90+ days · ~1 week", id: "Perbaikan: konfigurasi retensi pipeline log ke 90+ hari · ~1 minggu" },
          finance: { en: "Potential regulatory fine if audited in current state", id: "Potensi denda regulasi jika diaudit dalam kondisi saat ini" },
          auditor: { en: "Ref: security policy standard §7.1 — log retention minimum 90 days", id: "Ref: standar kebijakan keamanan §7.1 — retensi log minimum 90 hari" },
        },
      },
      {
        sev: "high",
        title: {
          direktur: { en: "3 public subdomains exposed with outdated services", id: "3 subdomain publik terekspos dengan layanan usang" },
          it: { en: "ssh.domain.com — OpenSSH 7.4 (EOL, CVE-2023-38408). Port 8080 open on panel.domain.com", id: "ssh.domain.com — OpenSSH 7.4 (EOL, CVE-2023-38408). Port 8080 terbuka di panel.domain.com" },
          finance: { en: "Exposed subdomains could provide entry to financial systems", id: "Subdomain terekspos dapat memberi akses ke sistem keuangan" },
          auditor: { en: "3 unprotected subdomains — attack surface not documented in risk register", id: "3 subdomain tidak terlindungi — permukaan serangan tidak terdokumentasi" },
        },
        sub: {
          direktur: { en: "One runs a vulnerable SSH version actively being targeted", id: "Salah satunya menjalankan SSH versi rentan yang sedang aktif diserang" },
          it: { en: "Patch OpenSSH to 9.x, restrict port 22 to VPN-only, close port 8080", id: "Patch OpenSSH ke 9.x, batasi port 22 ke VPN saja, tutup port 8080" },
          finance: { en: "~14 brute-force attempts/min detected since 14:07 WIB today", id: "~14 percobaan brute-force/menit terdeteksi sejak 14:07 WIB hari ini" },
          auditor: { en: "Required: update asset inventory and network diagram", id: "Diperlukan: perbarui inventaris aset dan diagram jaringan" },
        },
      },
      {
        sev: "high",
        title: {
          direktur: { en: "4 of 12 admin accounts without MFA — account takeover risk", id: "4 dari 12 akun admin tanpa MFA — risiko pengambilalihan akun" },
          it: { en: "4 admin accounts (2 domain admin, 2 cloud admin) lack MFA", id: "4 akun admin (2 domain admin, 2 cloud admin) tanpa MFA" },
          finance: { en: "2 accounts with financial system access have no MFA — unauthorized transfer risk", id: "2 akun dengan akses sistem keuangan tidak memiliki MFA — risiko transfer tidak sah" },
          auditor: { en: "4 privileged accounts without MFA — non-compliant with access control policy", id: "4 akun dengan hak istimewa tanpa MFA — tidak sesuai kebijakan kontrol akses" },
        },
        sub: {
          direktur: { en: "Risk: full admin compromise possible without MFA", id: "Risiko: kompromi admin penuh mungkin terjadi tanpa MFA" },
          it: { en: "Affected: domain.admin.01, domain.admin.03, cloud.admin.01, cloud.admin.04", id: "Terdampak: domain.admin.01, domain.admin.03, cloud.admin.01, cloud.admin.04" },
          finance: { en: "Financial system admins: cloud.admin.01 and cloud.admin.04 — high priority", id: "Admin sistem keuangan: cloud.admin.01 dan cloud.admin.04 — prioritas tinggi" },
          auditor: { en: "Mandatory MFA for privileged accounts — access control policy", id: "MFA wajib untuk akun dengan hak istimewa — kebijakan kontrol akses" },
        },
      },
    ],
    recommendations: [
      { en: "Approve DMARC deployment — authorise IT to deploy p=quarantine today", id: "Setujui deployment DMARC — otorisasi IT untuk menerapkan kebijakan p=quarantine hari ini", durationEn: "~1 hour", durationId: "~1 jam" },
      { en: "Mandate MFA for all admin accounts by end of week", id: "Wajibkan MFA untuk semua akun admin sebelum akhir minggu", durationEn: "~1 day", durationId: "~1 hari" },
      { en: "Extend log retention to 90 days to meet audit standards", id: "Perpanjang retensi log ke 90 hari untuk memenuhi persyaratan kepatuhan", durationEn: "~1 week", durationId: "~1 minggu" },
    ],
  },
  {
    id: "046",
    titleEn: "Suspicious DLP Bypass Attempt",
    titleId: "Percobaan Bypass DLP Mencurigakan",
    date: "04 Jul 2026",
    severity: "medium",
    status: "review",
    summary: { en: "Investigation in progress: an employee attempted to move sensitive data outside approved channels using a renamed file extension. No confirmed data loss yet.", id: "Investigasi sedang berlangsung: seorang karyawan mencoba memindahkan data sensitif ke luar kanal yang disetujui menggunakan ekstensi file yang diubah namanya. Belum ada kebocoran data yang terkonfirmasi." },
    findings: [
      { sev: "high", title: { en: "Attempted upload of customer data to personal cloud storage", id: "Percobaan unggah data pelanggan ke penyimpanan cloud pribadi" }, sub: { en: "File renamed from .xlsx to .dat to evade DLP content inspection, blocked before upload completed", id: "File diubah namanya dari .xlsx ke .dat untuk menghindari inspeksi konten DLP, diblokir sebelum unggahan selesai" } },
      { sev: "medium", title: { en: "Personal cloud storage domains not blocked at proxy", id: "Domain penyimpanan cloud pribadi belum diblokir di proxy" }, sub: { en: "Outbound web filter allows access to consumer file-sharing services from the corporate network", id: "Filter web keluar mengizinkan akses ke layanan berbagi file konsumen dari jaringan perusahaan" } },
    ],
    recommendations: [
      { en: "Suspend user session and interview employee pending investigation", id: "Tangguhkan sesi pengguna dan wawancarai karyawan hingga investigasi selesai", durationEn: "Immediate", durationId: "Segera" },
      { en: "Block personal cloud storage domains at the proxy/web filter", id: "Blokir domain penyimpanan cloud pribadi di proxy/filter web", durationEn: "~1 day", durationId: "~1 hari" },
    ],
  },
  {
    id: "045",
    titleEn: "Phishing Campaign — Finance Team",
    titleId: "Kampanye Phishing — Tim Keuangan",
    date: "02 Jul 2026",
    severity: "critical",
    status: "closed",
    summary: { en: "Resolved: a spoofed invoice-payment phishing email reached 12 finance staff. 2 clicked the link and 1 entered credentials before the account was locked.", id: "Diselesaikan: email phishing pembayaran tagihan palsu menjangkau 12 staf keuangan. 2 mengklik tautan dan 1 memasukkan kredensial sebelum akun dikunci." },
    findings: [
      { sev: "critical", title: { en: "Credentials entered on spoofed vendor-payment page", id: "Kredensial dimasukkan di halaman pembayaran vendor palsu" }, sub: { en: "Account was locked and password reset within 40 minutes of detection — no unauthorized transactions occurred", id: "Akun dikunci dan kata sandi direset dalam 40 menit sejak terdeteksi — tidak ada transaksi tidak sah yang terjadi" } },
      { sev: "high", title: { en: "12 finance staff received the spoofed invoice email", id: "12 staf keuangan menerima email tagihan palsu" }, sub: { en: "Email spoofed a known vendor domain, bypassed the spam filter due to missing DMARC enforcement", id: "Email memalsukan domain vendor yang dikenal, melewati filter spam karena penegakan DMARC yang hilang" } },
    ],
    recommendations: [
      { en: "Enforce DMARC p=quarantine on the company domain to block future spoofed sends", id: "Terapkan DMARC p=quarantine pada domain perusahaan untuk memblokir pengiriman palsu di masa depan", durationEn: "~1 hour", durationId: "~1 jam" },
      { en: "Run a phishing-awareness refresher training for the finance team", id: "Jalankan pelatihan penyegaran kesadaran phishing untuk tim keuangan", durationEn: "~1 week", durationId: "~1 minggu" },
    ],
  },
  {
    id: "044",
    titleEn: "Unauthorized API Access — Internal Portal",
    titleId: "Akses API Tidak Sah — Portal Internal",
    date: "28 Jun 2026",
    severity: "high",
    status: "closed",
    summary: { en: "Resolved: an API key with excessive permissions was used from an unrecognized IP to query the internal portal API. The key has been revoked.", id: "Diselesaikan: kunci API dengan izin berlebihan digunakan dari IP yang tidak dikenal untuk mengakses API portal internal. Kunci telah dicabut." },
    findings: [
      { sev: "high", title: { en: "API key with admin-level scope used from an unrecognized IP address", id: "Kunci API dengan cakupan setingkat admin digunakan dari alamat IP yang tidak dikenal" }, sub: { en: "~3,200 requests over 20 minutes enumerated internal employee records before the key was revoked", id: "~3.200 permintaan selama 20 menit melakukan enumerasi data karyawan internal sebelum kunci dicabut" } },
      { sev: "medium", title: { en: "Internal API endpoints missing rate-limiting", id: "Endpoint API internal belum memiliki pembatasan laju (rate-limiting)" }, sub: { en: "No throttling allowed rapid enumeration once a valid key was obtained", id: "Tidak ada pembatasan yang memungkinkan enumerasi cepat setelah kunci valid diperoleh" } },
    ],
    recommendations: [
      { en: "Rotate all API keys and reissue with least-privilege scopes", id: "Rotasi semua kunci API dan terbitkan ulang dengan cakupan hak akses minimum", durationEn: "~1 day", durationId: "~1 hari" },
      { en: "Add rate-limiting and IP allowlisting to internal API endpoints", id: "Tambahkan rate-limiting dan allowlist IP pada endpoint API internal", durationEn: "~1 week", durationId: "~1 minggu" },
    ],
  },
  {
    id: "043",
    titleEn: "Malware Detection — Endpoint ws-12",
    titleId: "Deteksi Malware — Endpoint ws-12",
    date: "25 Jun 2026",
    severity: "critical",
    status: "closed",
    summary: { en: "Resolved: a trojan was detected and quarantined on endpoint ws-12 before lateral movement occurred. Three other endpoints were found running outdated antivirus signatures.", id: "Diselesaikan: sebuah trojan terdeteksi dan dikarantina pada endpoint ws-12 sebelum terjadi pergerakan lateral. Tiga endpoint lain ditemukan menjalankan tanda tangan antivirus yang usang." },
    findings: [
      { sev: "critical", title: { en: "Trojan quarantined on ws-12 before lateral movement", id: "Trojan dikarantina pada ws-12 sebelum pergerakan lateral" }, sub: { en: "Malware attempted an outbound connection to a known C2 domain, blocked by egress filtering", id: "Malware mencoba koneksi keluar ke domain C2 yang dikenal, diblokir oleh egress filtering" } },
      { sev: "high", title: { en: "3 endpoints running outdated antivirus signatures", id: "3 endpoint menjalankan tanda tangan antivirus yang usang" }, sub: { en: "Signature updates had failed silently for 18 days on the affected machines", id: "Pembaruan tanda tangan gagal secara diam-diam selama 18 hari pada mesin yang terdampak" } },
    ],
    recommendations: [
      { en: "Reimage ws-12 and rotate any credentials used on that machine", id: "Reimage ws-12 dan rotasi kredensial apa pun yang digunakan pada mesin tersebut", durationEn: "~1 day", durationId: "~1 hari" },
      { en: "Patch antivirus signature updates fleet-wide and alert on update failures", id: "Perbarui tanda tangan antivirus di seluruh armada dan beri peringatan saat pembaruan gagal", durationEn: "~1 week", durationId: "~1 minggu" },
    ],
  },
  {
    id: "042",
    titleEn: "Credential Stuffing — Login Portal",
    titleId: "Credential Stuffing — Portal Login",
    date: "22 Jun 2026",
    severity: "medium",
    status: "closed",
    summary: { en: "Resolved: approximately 2,400 automated login attempts from a botnet targeted the customer login portal. 3 accounts were locked as a precaution, no confirmed compromise.", id: "Diselesaikan: sekitar 2.400 percobaan login otomatis dari botnet menargetkan portal login pelanggan. 3 akun dikunci sebagai tindakan pencegahan, tidak ada kompromi yang terkonfirmasi." },
    findings: [
      { sev: "medium", title: { en: "~2,400 login attempts from botnet IPs against the customer portal", id: "~2.400 percobaan login dari IP botnet terhadap portal pelanggan" }, sub: { en: "Traffic originated from over 300 distinct IPs over 6 hours, consistent with credential-stuffing lists", id: "Lalu lintas berasal dari lebih dari 300 IP berbeda selama 6 jam, konsisten dengan daftar credential-stuffing" } },
      { sev: "low", title: { en: "Login endpoint has no CAPTCHA or rate-limiting", id: "Endpoint login belum memiliki CAPTCHA atau rate-limiting" }, sub: { en: "Allowed high-volume automated attempts to run undetected until anomaly alerting triggered", id: "Memungkinkan percobaan otomatis bervolume tinggi berjalan tanpa terdeteksi hingga peringatan anomali terpicu" } },
    ],
    recommendations: [
      { en: "Enable CAPTCHA and rate-limiting on the login endpoint", id: "Aktifkan CAPTCHA dan rate-limiting pada endpoint login", durationEn: "~1 day", durationId: "~1 hari" },
      { en: "Force password reset for the 3 locked accounts and screen against known-breach password lists", id: "Wajibkan reset kata sandi untuk 3 akun yang dikunci dan periksa terhadap daftar kata sandi yang bocor", durationEn: "~1 day", durationId: "~1 hari" },
    ],
  },
]

export const COMPLIANCE_EVIDENCE_ITEMS: Bilingual[] = [
  { en: "AI System Registry — Sentinel SLM + Claude Sonnet fallback", id: "Registri Sistem AI — Sentinel SLM + cadangan Claude Sonnet" },
  { en: "Guardrail activation log — 30-day window", id: "Log aktivasi guardrail — jendela 30 hari" },
  { en: "Human review checkpoint record — all HITL decisions", id: "Catatan checkpoint tinjauan manusia — semua keputusan HITL" },
  { en: "Model confidence distribution — last 500 responses", id: "Distribusi kepercayaan model — 500 respons terakhir" },
  { en: "Citation coverage report — knowledge sources used", id: "Laporan cakupan kutipan — sumber pengetahuan yang digunakan" },
]
