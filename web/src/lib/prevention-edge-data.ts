export type AppStatus = "active" | "protected" | "reviewing"
export type AuthType = "sso" | "sso_mfa" | "cert"
export type InspectionLevel = "standard" | "dpi" | "bypass"

export interface PrivateApp {
  id: string
  name: string
  domain: string
  users: number
  lastAccessEn: string
  lastAccessId: string
  status: AppStatus
  auth: AuthType
  inspection: InspectionLevel
  groups: string
}

export const INITIAL_APPS: PrivateApp[] = [
  { id: "jira", name: "Jira Internal", domain: "jira.internal.corp", users: 47, lastAccessId: "2 menit lalu", lastAccessEn: "2 min ago", status: "active", auth: "sso", inspection: "standard", groups: "dev-team, admin" },
  { id: "hr", name: "HR Portal", domain: "hr.internal.corp", users: 12, lastAccessId: "15 menit lalu", lastAccessEn: "15 min ago", status: "active", auth: "sso_mfa", inspection: "standard", groups: "hr-team" },
  { id: "finance", name: "Finance Dashboard", domain: "finance.internal.corp", users: 8, lastAccessId: "1 jam lalu", lastAccessEn: "1 hour ago", status: "protected", auth: "sso_mfa", inspection: "dpi", groups: "finance-team" },
  { id: "erp", name: "Legacy ERP", domain: "erp.internal.corp", users: 23, lastAccessId: "3 jam lalu", lastAccessEn: "3 hours ago", status: "reviewing", auth: "sso", inspection: "standard", groups: "all-staff" },
  { id: "apigw", name: "Dev API Gateway", domain: "api-gw.internal.corp", users: 31, lastAccessId: "5 menit lalu", lastAccessEn: "5 min ago", status: "active", auth: "cert", inspection: "dpi", groups: "dev-team" },
  { id: "gitlab", name: "GitLab Internal", domain: "git.internal.corp", users: 19, lastAccessId: "22 menit lalu", lastAccessEn: "22 min ago", status: "active", auth: "sso_mfa", inspection: "standard", groups: "dev-team, devops" },
  { id: "grafana", name: "Monitoring Stack", domain: "grafana.internal.corp", users: 5, lastAccessId: "2 jam lalu", lastAccessEn: "2 hours ago", status: "protected", auth: "sso_mfa", inspection: "dpi", groups: "devops, sre" },
  { id: "admin", name: "Admin Panel", domain: "admin.internal.corp", users: 3, lastAccessId: "4 jam lalu", lastAccessEn: "4 hours ago", status: "reviewing", auth: "cert", inspection: "dpi", groups: "admin" },
  { id: "backup", name: "Backup Portal", domain: "backup.internal.corp", users: 7, lastAccessId: "Kemarin", lastAccessEn: "Yesterday", status: "reviewing", auth: "sso", inspection: "standard", groups: "devops" },
]

export type TrafficAction = "allow" | "block" | "inspect"

export interface TrafficEntry {
  id: string
  time: string
  user: string
  dest: string
  action: TrafficAction
  reasonEn: string
  reasonId: string
}

export const INITIAL_TRAFFIC: TrafficEntry[] = [
  { id: "t1", time: "14:32", user: "rudi@contoh.co.id", dest: "jira.internal.corp", action: "allow", reasonId: "Identitas terverifikasi", reasonEn: "Identity verified" },
  { id: "t2", time: "14:31", user: "sari@contoh.co.id", dest: "suspicious-site.com", action: "block", reasonId: "Kebijakan DLP: unggahan eksternal diblokir", reasonEn: "DLP policy: external upload blocked" },
  { id: "t3", time: "14:30", user: "budi@contoh.co.id", dest: "finance.internal.corp", action: "allow", reasonId: "Identitas terverifikasi + MFA", reasonEn: "Identity verified + MFA" },
  { id: "t4", time: "14:29", user: "unknown@contoh.co.id", dest: "api.external-service.com", action: "inspect", reasonId: "Volume data anomali", reasonEn: "Anomalous data volume" },
  { id: "t5", time: "14:28", user: "rudi@contoh.co.id", dest: "hr.internal.corp", action: "allow", reasonId: "Identitas terverifikasi", reasonEn: "Identity verified" },
  { id: "t6", time: "14:27", user: "sari@contoh.co.id", dest: "dropbox.com", action: "block", reasonId: "DLP: penyimpanan cloud tidak diizinkan", reasonEn: "DLP: unauthorized cloud storage" },
  { id: "t7", time: "14:26", user: "admin@contoh.co.id", dest: "erp.internal.corp", action: "inspect", reasonId: "Akses pertama kali", reasonEn: "First-time access" },
  { id: "t8", time: "14:25", user: "budi@contoh.co.id", dest: "suspicious-site.com", action: "block", reasonId: "Indikator malware", reasonEn: "Malware indicator" },
  { id: "t9", time: "14:24", user: "rudi@contoh.co.id", dest: "api.external-service.com", action: "allow", reasonId: "Aplikasi disetujui", reasonEn: "Approved app" },
  { id: "t10", time: "14:23", user: "sari@contoh.co.id", dest: "finance.internal.corp", action: "allow", reasonId: "Identitas terverifikasi", reasonEn: "Identity verified" },
  { id: "t11", time: "14:22", user: "andi@contoh.co.id", dest: "git.internal.corp", action: "allow", reasonId: "Identitas terverifikasi", reasonEn: "Identity verified" },
  { id: "t12", time: "14:21", user: "dewi@contoh.co.id", dest: "wetransfer.com", action: "block", reasonId: "DLP: transfer file besar diblokir", reasonEn: "DLP: large file transfer blocked" },
  { id: "t13", time: "14:20", user: "admin@contoh.co.id", dest: "admin.internal.corp", action: "inspect", reasonId: "Autentikasi sertifikat tertunda", reasonEn: "Certificate auth pending" },
  { id: "t14", time: "14:19", user: "rudi@contoh.co.id", dest: "grafana.internal.corp", action: "allow", reasonId: "SSO + MFA terverifikasi", reasonEn: "SSO + MFA verified" },
  { id: "t15", time: "14:18", user: "unknown@contoh.co.id", dest: "pastebin.com", action: "block", reasonId: "Kebocoran data potensial terdeteksi", reasonEn: "Potential data leak detected" },
  { id: "t16", time: "14:17", user: "budi@contoh.co.id", dest: "api-gw.internal.corp", action: "allow", reasonId: "Sertifikat klien valid", reasonEn: "Valid client certificate" },
  { id: "t17", time: "14:16", user: "sari@contoh.co.id", dest: "hr.internal.corp", action: "allow", reasonId: "Identitas terverifikasi", reasonEn: "Identity verified" },
  { id: "t18", time: "14:15", user: "dewi@contoh.co.id", dest: "google-drive.com", action: "inspect", reasonId: "Sinkronisasi cloud terdeteksi", reasonEn: "Cloud sync detected" },
  { id: "t19", time: "14:14", user: "andi@contoh.co.id", dest: "jira.internal.corp", action: "allow", reasonId: "Identitas terverifikasi", reasonEn: "Identity verified" },
  { id: "t20", time: "14:13", user: "admin@contoh.co.id", dest: "backup.internal.corp", action: "inspect", reasonId: "Aktivitas backup tidak terjadwal", reasonEn: "Unscheduled backup activity" },
]

export type DlpAction = "block" | "inspect" | "alert" | "mfa"
export type PatternType = "custom_regex" | "pan" | "large_file" | "keyword" | "extension"
export type AppliesTo = "all" | "specific" | "outbound" | "inbound"

export interface DlpRule {
  id: string
  enabled: boolean
  nameEn: string
  nameId: string
  descEn: string
  descId: string
  actions: DlpAction[]
  patternType: PatternType
  applies: AppliesTo
  pattern?: string
}

export const INITIAL_DLP_RULES: DlpRule[] = [
  { id: "d1", enabled: true, nameEn: "Block external cloud upload", nameId: "Blokir unggahan cloud eksternal", descEn: "Prevent uploads to non-approved cloud storage (Dropbox, WeTransfer, etc.)", descId: "Cegah unggahan ke penyimpanan cloud yang tidak disetujui (Dropbox, WeTransfer, dll.)", actions: ["block"], patternType: "extension", applies: "outbound" },
  { id: "d2", enabled: true, nameEn: "Flag large data transfers", nameId: "Tandai transfer data besar", descEn: "Alert when >50 MB transferred to external destinations", descId: "Beri peringatan jika >50 MB ditransfer ke tujuan eksternal", actions: ["inspect", "alert"], patternType: "large_file", applies: "outbound" },
  { id: "d3", enabled: true, nameEn: "Restrict finance data", nameId: "Batasi data keuangan", descEn: "Block access to finance.internal.corp from unverified devices", descId: "Blokir akses ke finance.internal.corp dari perangkat yang tidak terverifikasi", actions: ["block"], patternType: "keyword", applies: "all" },
  { id: "d4", enabled: true, nameEn: "Credit card number detection", nameId: "Deteksi nomor kartu kredit", descEn: "Scan outbound traffic for PAN data (Primary Account Number)", descId: "Pindai lalu lintas keluar untuk data PAN (Primary Account Number)", actions: ["block", "alert"], patternType: "pan", applies: "outbound" },
  { id: "d5", enabled: true, nameEn: "Enforce MFA for admin apps", nameId: "Wajibkan MFA untuk aplikasi admin", descEn: "Require multi-factor authentication before accessing admin applications", descId: "Wajibkan autentikasi multi-faktor sebelum mengakses aplikasi admin", actions: ["mfa"], patternType: "keyword", applies: "specific" },
  { id: "d6", enabled: true, nameEn: "KTP / NIK number detection", nameId: "Deteksi nomor KTP / NIK", descEn: "Scan for Indonesian national ID patterns", descId: "Pindai pola nomor identitas nasional Indonesia", actions: ["block", "alert"], patternType: "custom_regex", applies: "outbound", pattern: "\\d{16}" },
  { id: "d7", enabled: true, nameEn: "Block USB-to-cloud sync", nameId: "Blokir sinkronisasi USB ke cloud", descEn: "Prevent desktop sync clients uploading to cloud", descId: "Cegah klien sinkronisasi desktop mengunggah ke cloud", actions: ["block"], patternType: "extension", applies: "outbound" },
  { id: "d8", enabled: false, nameEn: "Executive email data guard", nameId: "Perlindungan data email eksekutif", descEn: "Flag emails sent externally from C-suite accounts", descId: "Tandai email yang dikirim ke luar dari akun C-suite", actions: ["inspect", "alert"], patternType: "keyword", applies: "outbound" },
  { id: "d9", enabled: true, nameEn: "Sensitive keyword match", nameId: "Pencocokan kata kunci sensitif", descEn: "Block outbound traffic containing classified keywords", descId: "Blokir lalu lintas keluar yang mengandung kata kunci rahasia", actions: ["block"], patternType: "keyword", applies: "outbound" },
]

export const STATUS_LABEL: Record<AppStatus, { en: string; id: string }> = {
  active: { en: "Active", id: "Aktif" },
  protected: { en: "Protected", id: "Dilindungi" },
  reviewing: { en: "Reviewing", id: "Ditinjau" },
}

export const AUTH_LABEL: Record<AuthType, string> = {
  sso: "SSO",
  sso_mfa: "SSO+MFA",
  cert: "Cert",
}

export const ACTION_LABEL: Record<TrafficAction, { en: string; id: string }> = {
  allow: { en: "Allow", id: "Izinkan" },
  block: { en: "Block", id: "Blokir" },
  inspect: { en: "Inspect", id: "Periksa" },
}

export const DLP_ACTION_LABEL: Record<DlpAction, { en: string; id: string }> = {
  block: { en: "Block", id: "Blokir" },
  inspect: { en: "Inspect", id: "Periksa" },
  alert: { en: "Alert", id: "Peringatan" },
  mfa: { en: "Require MFA", id: "Wajib MFA" },
}

export const PATTERN_LABEL: Record<PatternType, string> = {
  custom_regex: "Regex",
  pan: "PAN",
  large_file: "Large File",
  keyword: "Keyword",
  extension: "Extension",
}
