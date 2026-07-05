import type { LucideIcon } from "lucide-react"
import { Radar, MailCheck, AlertCircle } from "lucide-react"

export type Funnel = "xray" | "inbox" | "postincident"

interface Bilingual {
  en: string
  id: string
}

export interface ServiceOption {
  key: Funnel
  icon: LucideIcon
  accent: "brand" | "info" | "danger"
  popular?: boolean
  labelEn: string
  labelId: string
  nameEn: string
  nameId: string
  descEn: string
  descId: string
  checks: Bilingual[]
  useCaseEn: string
  useCaseId: string
  ctaEn: string
  ctaId: string
}

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    key: "xray",
    icon: Radar,
    accent: "brand",
    popular: true,
    labelEn: "Exposure Diagnostics",
    labelId: "Diagnostik Eksposur",
    nameEn: "Cyber X-Ray",
    nameId: "Cyber X-Ray",
    descEn: "Get a full picture of your cyber exposure in ~2 minutes. No IT team needed — just your domain.",
    descId: "Gambaran lengkap paparan siber Anda dalam ~2 menit. Tanpa tim IT — cukup dengan domain Anda.",
    checks: [
      { en: "SPF / DKIM / DMARC configuration", id: "Konfigurasi SPF / DKIM / DMARC" },
      { en: "Exposed subdomains & open ports", id: "Subdomain terekspos & port terbuka" },
      { en: "Endpoint security posture", id: "Postur keamanan endpoint" },
      { en: "Evidence readiness score", id: "Skor kesiapan bukti" },
      { en: "AI-generated risk summary", id: "Ringkasan risiko dari AI" },
    ],
    useCaseEn: "Best for: Any company that hasn't done a security audit in the last 12 months.",
    useCaseId: "Cocok untuk: Perusahaan yang belum audit keamanan dalam 12 bulan terakhir.",
    ctaEn: "Start Cyber X-Ray →",
    ctaId: "Mulai Cyber X-Ray →",
  },
  {
    key: "inbox",
    icon: MailCheck,
    accent: "info",
    labelEn: "Email & Identity Security",
    labelId: "Keamanan Email & Identitas",
    nameEn: "Inbox & Identity Guard",
    nameId: "Inbox & Identity Guard",
    descEn: "Detect phishing, invoice fraud, BEC, and suspicious logins. Connects to your mail provider.",
    descId: "Deteksi phishing, fraud faktur, BEC, dan login mencurigakan. Terhubung ke penyedia email Anda.",
    checks: [
      { en: "Email spoofing & DMARC gaps", id: "Spoofing email & celah DMARC" },
      { en: "Suspicious login & MFA anomalies", id: "Login mencurigakan & anomali MFA" },
      { en: "VPN / SSO authentication analysis", id: "Analisis autentikasi VPN / SSO" },
      { en: "BEC & invoice fraud indicators", id: "Indikator BEC & fraud faktur" },
      { en: "AI phishing risk summary", id: "Ringkasan risiko phishing dari AI" },
    ],
    useCaseEn: "Best for: Finance & ops teams worried about CEO fraud or invoice scams.",
    useCaseId: "Cocok untuk: Tim keuangan & operasional khawatir penipuan CEO atau faktur palsu.",
    ctaEn: "Start Inbox Guard →",
    ctaId: "Mulai Inbox Guard →",
  },
  {
    key: "postincident",
    icon: AlertCircle,
    accent: "danger",
    labelEn: "Incident Response",
    labelId: "Respons Insiden",
    nameEn: "Post-Incident Triage",
    nameId: "Triase Pasca-Insiden",
    descEn: "Already hacked or suspect a breach? Upload your logs and get an AI-assisted incident timeline in minutes.",
    descId: "Sudah diretas atau curiga ada insiden? Upload log Anda dan dapatkan timeline insiden berbantuan AI dalam menit.",
    checks: [
      { en: "Log parsing & normalisation", id: "Parsing & normalisasi log" },
      { en: "Attack timeline reconstruction", id: "Rekonstruksi timeline serangan" },
      { en: "IOC extraction (IPs, hashes, domains)", id: "Ekstraksi IOC (IP, hash, domain)" },
      { en: "MITRE ATT&CK technique mapping", id: "Pemetaan teknik MITRE ATT&CK" },
      { en: "AI-generated incident brief", id: "Ringkasan insiden dari AI" },
    ],
    useCaseEn: "Best for: IT teams actively dealing with or investigating a security incident.",
    useCaseId: "Cocok untuk: Tim IT yang sedang menangani atau menyelidiki insiden keamanan.",
    ctaEn: "Start Triage →",
    ctaId: "Mulai Triase →",
  },
]

export const INCIDENT_TYPES: Bilingual[] = [
  { en: "Ransomware", id: "Ransomware" },
  { en: "Data Breach", id: "Kebocoran Data" },
  { en: "Phishing", id: "Phishing" },
  { en: "Unauthorised Access", id: "Akses Tidak Sah" },
  { en: "Not sure yet", id: "Belum yakin" },
]

interface FunnelMeta {
  step2: {
    h2: Bilingual
    sub: Bilingual
    hint: Bilingual
    checks: Bilingual[]
  }
  step3: {
    h2: Bilingual
    sub: Bilingual
    cta: Bilingual
  }
  scan: {
    title: Bilingual
    eta: Bilingual
    doneTitle: Bilingual
    doneSub: Bilingual
    items: Bilingual[]
  }
  whatsNext: { title: Bilingual; sub: Bilingual; active: boolean }[]
}

export const FUNNEL_META: Record<Funnel, FunnelMeta> = {
  xray: {
    step2: {
      h2: { en: "Connect your domain", id: "Hubungkan domain Anda" },
      sub: {
        en: "We'll run a passive scan on your public domain — no login required.",
        id: "Kami akan menjalankan pemindaian pasif pada domain publik Anda — tanpa perlu login.",
      },
      hint: { en: "This scan is passive and non-intrusive.", id: "Pemindaian ini bersifat pasif dan tidak mengganggu operasional." },
      checks: [
        { en: "SPF record", id: "SPF record" },
        { en: "DKIM configuration", id: "Konfigurasi DKIM" },
        { en: "DMARC policy", id: "Kebijakan DMARC" },
        { en: "Exposed subdomains", id: "Subdomain yang terekspos" },
        { en: "Open ports on public services", id: "Port terbuka pada layanan publik" },
      ],
    },
    step3: {
      h2: { en: "Connect your endpoints", id: "Hubungkan endpoint Anda" },
      sub: {
        en: "Install Wazuh Agent on your devices to get endpoint telemetry. You can add more later.",
        id: "Pasang Wazuh Agent pada perangkat Anda untuk mendapatkan telemetri endpoint. Anda dapat menambah lebih banyak nanti.",
      },
      cta: { en: "Start scan →", id: "Mulai pindai →" },
    },
    scan: {
      title: { en: "Scanning domain…", id: "Memindai domain…" },
      eta: { en: "~2 min", id: "~2 menit" },
      doneTitle: { en: "Scan complete", id: "Pemindaian selesai" },
      doneSub: { en: "Your Cyber X-Ray report is ready to review.", id: "Laporan Cyber X-Ray Anda siap untuk ditinjau." },
      items: [
        { en: "Starting domain scan…", id: "Memulai pemindaian domain…" },
        { en: "SPF record found", id: "SPF record ditemukan" },
        { en: "DKIM checked", id: "DKIM diperiksa" },
        { en: "Checking subdomain exposure…", id: "Memeriksa paparan subdomain…" },
        { en: "Subdomain scan complete", id: "Subdomain scan selesai" },
        { en: "Calculating evidence readiness score…", id: "Menghitung skor kesiapan bukti…" },
        { en: "Score calculated", id: "Skor dihitung" },
        { en: "Generating AI summary…", id: "Membuat ringkasan AI…" },
        { en: "Report ready", id: "Laporan siap" },
      ],
    },
    whatsNext: [
      { title: { en: "Review your Cyber X-Ray report", id: "Tinjau laporan Cyber X-Ray Anda" }, sub: { en: "See exactly what's exposed and what's missing.", id: "Lihat persis apa yang terekspos dan apa yang kurang." }, active: true },
      { title: { en: "Fix the red findings — 30-Day Sprint", id: "Perbaiki temuan merah — Sprint 30 Hari" }, sub: { en: "Our team closes your most critical gaps. From Rp 35 jt.", id: "Tim kami menutup celah paling kritis. Mulai Rp 35 jt." }, active: false },
      { title: { en: "Stay monitored — MDR", id: "Tetap dimonitor — MDR" }, sub: { en: "24/7 detection, AI-assisted triage, human escalation.", id: "Deteksi 24/7, triase berbantuan AI, eskalasi manusia." }, active: false },
    ],
  },
  inbox: {
    step2: {
      h2: { en: "Set up email security scanning", id: "Siapkan pemindaian keamanan email" },
      sub: {
        en: "We'll check your email domain for phishing, spoofing, and BEC exposure.",
        id: "Kami akan memeriksa domain email Anda untuk paparan phishing, spoofing, dan BEC.",
      },
      hint: { en: "We only check DNS records and your mail provider's security headers.", id: "Kami hanya memeriksa record DNS dan header keamanan penyedia email Anda." },
      checks: [
        { en: "SPF record", id: "SPF record" },
        { en: "DKIM configuration", id: "Konfigurasi DKIM" },
        { en: "DMARC policy", id: "Kebijakan DMARC" },
        { en: "Email spoofing risk", id: "Risiko email spoofing" },
        { en: "BEC / phishing indicators", id: "Indikator BEC / phishing" },
      ],
    },
    step3: {
      h2: { en: "Connect your mail provider", id: "Hubungkan penyedia email Anda" },
      sub: {
        en: "Grant read-only access so Shannon can analyse login events and mail headers for threats.",
        id: "Berikan akses read-only agar Shannon dapat menganalisis event login dan header email untuk ancaman.",
      },
      cta: { en: "Start analysis →", id: "Mulai analisis →" },
    },
    scan: {
      title: { en: "Scanning inbox…", id: "Memindai inbox…" },
      eta: { en: "~3 min", id: "~3 menit" },
      doneTitle: { en: "Scan complete", id: "Pemindaian selesai" },
      doneSub: { en: "Your Inbox Guard report is ready to review.", id: "Laporan Inbox Guard Anda siap untuk ditinjau." },
      items: [
        { en: "Checking email domain…", id: "Memeriksa domain email…" },
        { en: "SPF record found", id: "SPF record ditemukan" },
        { en: "DKIM checked", id: "DKIM diperiksa" },
        { en: "Analysing DMARC policy…", id: "Menganalisis kebijakan DMARC…" },
        { en: "Phishing indicator scan complete", id: "Pemindaian indikator phishing selesai" },
        { en: "Checking BEC exposure…", id: "Memeriksa paparan BEC…" },
        { en: "Analysing login anomalies…", id: "Menganalisis anomali login…" },
        { en: "Generating AI phishing risk summary…", id: "Membuat ringkasan risiko phishing AI…" },
        { en: "Report ready", id: "Laporan siap" },
      ],
    },
    whatsNext: [
      { title: { en: "Review your phishing & spoofing report", id: "Tinjau laporan phishing & spoofing Anda" }, sub: { en: "See your DMARC gaps, BEC indicators, and login anomalies.", id: "Lihat celah DMARC, indikator BEC, dan anomali login Anda." }, active: true },
      { title: { en: "Block the threats — Email Security Sprint", id: "Blokir ancaman — Sprint Keamanan Email" }, sub: { en: "We fix your DMARC, harden your mail stack, and set up alerts. From Rp 25 jt.", id: "Kami memperbaiki DMARC, memperkuat mail stack, dan menyiapkan alert. Mulai Rp 25 jt." }, active: false },
      { title: { en: "Stay protected — Inbox MDR", id: "Tetap terlindungi — Inbox MDR" }, sub: { en: "Continuous monitoring of your email, identity, and login events.", id: "Pemantauan berkelanjutan email, identitas, dan event login Anda." }, active: false },
    ],
  },
  postincident: {
    step2: {
      h2: { en: "Tell us about the incident", id: "Ceritakan tentang insiden" },
      sub: { en: "This context helps our AI prioritise what to look for in your logs.", id: "Konteks ini membantu AI kami memprioritaskan apa yang harus dicari di log Anda." },
      hint: { en: "All data is processed securely and retained only for your analysis session.", id: "Semua data diproses dengan aman dan hanya disimpan untuk sesi analisis Anda." },
      checks: [
        { en: "Log parsing & normalisation", id: "Parsing & normalisasi log" },
        { en: "Timeline construction", id: "Rekonstruksi timeline" },
        { en: "IOC extraction", id: "Ekstraksi IOC" },
        { en: "MITRE ATT&CK mapping", id: "Pemetaan MITRE ATT&CK" },
        { en: "Initial triage summary", id: "Ringkasan triase awal" },
      ],
    },
    step3: {
      h2: { en: "Upload your incident logs", id: "Upload log insiden Anda" },
      sub: { en: "Drag and drop log files below. The more you provide, the better the triage.", id: "Seret dan lepaskan file log di bawah. Semakin banyak yang Anda berikan, semakin baik triasinya." },
      cta: { en: "Start triage →", id: "Mulai triase →" },
    },
    scan: {
      title: { en: "Analysing logs…", id: "Menganalisis log…" },
      eta: { en: "~4 min", id: "~4 menit" },
      doneTitle: { en: "Analysis complete", id: "Analisis selesai" },
      doneSub: { en: "Your incident triage report is ready to review.", id: "Laporan triase insiden Anda siap untuk ditinjau." },
      items: [
        { en: "Parsing uploaded logs…", id: "Memproses log yang diupload…" },
        { en: "Normalising log format…", id: "Menormalkan format log…" },
        { en: "Building event timeline…", id: "Membuat timeline kejadian…" },
        { en: "Extracting IOCs (IPs, hashes, domains)…", id: "Mengekstrak IOC (IP, hash, domain)…" },
        { en: "Mapping to MITRE ATT&CK…", id: "Memetakan ke MITRE ATT&CK…" },
        { en: "Correlating events across log sources…", id: "Mengkorelasikan kejadian dari berbagai sumber log…" },
        { en: "AI triage analysis complete", id: "Analisis triase AI selesai" },
        { en: "Generating incident brief…", id: "Membuat ringkasan insiden…" },
        { en: "Triage report ready", id: "Laporan triase siap" },
      ],
    },
    whatsNext: [
      { title: { en: "Review your incident triage report", id: "Tinjau laporan triase insiden Anda" }, sub: { en: "See the attack timeline, extracted IOCs, and MITRE mapping.", id: "Lihat timeline serangan, IOC yang diekstrak, dan pemetaan MITRE." }, active: true },
      { title: { en: "Assign remediation — Incident Sprint", id: "Tetapkan remediasi — Sprint Insiden" }, sub: { en: "Our analysts help you contain, eradicate, and recover. Fast.", id: "Analis kami membantu Anda menahan, memberantas, dan memulihkan. Cepat." }, active: false },
      { title: { en: "Prevent recurrence — MDR", id: "Cegah pengulangan — MDR" }, sub: { en: "24/7 monitoring to make sure it never happens again.", id: "Pemantauan 24/7 untuk memastikan hal ini tidak terjadi lagi." }, active: false },
    ],
  },
}
