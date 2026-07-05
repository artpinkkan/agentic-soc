export interface FaqItem {
  qEn: string
  qId: string
  aEn: string
  aId: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    qEn: "Do I need to commit to MDR right away?",
    qId: "Apakah saya harus langsung berkomitmen ke MDR?",
    aEn: "No. Start with the free Cyber X-Ray. If you find red findings, the 30-Day Sprint is a one-time project — not a subscription. MDR comes after, once you've seen the value.",
    aId: "Tidak. Mulai dengan Cyber X-Ray gratis. Jika ada temuan merah, Sprint 30 Hari adalah proyek satu kali — bukan langganan. MDR hadir setelahnya, setelah Anda melihat nilainya.",
  },
  {
    qEn: "Is this only for large enterprises?",
    qId: "Apakah ini hanya untuk perusahaan besar?",
    aEn: "No. Shannon Sentinel is designed for mid-market organizations — 50 to 2,000 employees — across any industry. The Free tier is genuinely free and useful without a dedicated IT team.",
    aId: "Tidak. Shannon Sentinel dirancang untuk organisasi menengah — 50 hingga 2.000 karyawan — di industri apa pun. Tier Gratis benar-benar gratis dan berguna tanpa tim IT khusus.",
  },
  {
    qEn: "What if we were already hacked?",
    qId: "Bagaimana jika kami sudah diretas?",
    aEn: "Use the Post-Incident Triage free taster — upload your logs and get an AI-assisted draft timeline immediately. If you need hands-on help, contact us for Emergency Stabilization.",
    aId: "Gunakan taster gratis Triase Pasca-Insiden — upload log Anda dan dapatkan draf timeline berbantuan AI segera. Jika butuh bantuan langsung, hubungi kami untuk Stabilisasi Darurat.",
  },
  {
    qEn: "Are there any hidden fees?",
    qId: "Apakah ada biaya tersembunyi?",
    aEn: "None. The Free tier is permanently free. Sprint is a fixed one-time project fee agreed upfront. MDR is a monthly retainer with no hidden overages — scope is defined before you sign.",
    aId: "Tidak ada. Tier Gratis selamanya gratis. Sprint adalah biaya proyek satu kali yang disepakati di muka. MDR adalah retainer bulanan tanpa biaya tersembunyi — lingkup ditentukan sebelum Anda menandatangani.",
  },
]

export type CtaVariant = "primary" | "secondary"
export type CtaTarget = "signup" | "mailto"

export interface PricingPlan {
  key: string
  featured: boolean
  badgeEn?: string
  badgeId?: string
  tierLabelEn: string
  tierLabelId: string
  priceMain: string
  priceSubEn?: string
  priceSubId?: string
  descEn: string
  descId: string
  ctaEn: string
  ctaId: string
  ctaVariant: CtaVariant
  ctaTarget: CtaTarget
  features: { en: string; id: string }[]
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    key: "free",
    featured: false,
    tierLabelEn: "Free — forever",
    tierLabelId: "Gratis — selamanya",
    priceMain: "Cyber X-Ray",
    descEn: "Find out where your risks are. No credit card needed.",
    descId: "Cari tahu di mana risiko Anda. Tanpa kartu kredit.",
    ctaEn: "Start free →",
    ctaId: "Mulai gratis →",
    ctaVariant: "secondary",
    ctaTarget: "signup",
    features: [
      { en: "SPF / DKIM / DMARC check", id: "Pemeriksaan SPF / DKIM / DMARC" },
      { en: "Subdomain & open port scan", id: "Pemindaian subdomain & port terbuka" },
      { en: "Endpoint security posture (5–10 devices)", id: "Postur keamanan endpoint (5–10 perangkat)" },
      { en: "50 AI analyses / month", id: "50 analisis AI / bulan" },
      { en: "Watermarked report preview", id: "Pratinjau laporan bertanda air" },
      { en: "View & approve triage steps only — no direct containment actions", id: "Hanya lihat & setujui langkah triase — tanpa tindakan penahanan langsung" },
    ],
  },
  {
    key: "sprint",
    featured: true,
    badgeEn: "Most popular",
    badgeId: "Paling populer",
    tierLabelEn: "One-time project",
    tierLabelId: "Proyek satu kali",
    priceMain: "Rp 35–75 jt",
    priceSubEn: "30-Day Clean-Up Sprint",
    priceSubId: "Sprint Perbaikan 30 Hari",
    descEn: "Our team fixes your red findings in 30 days. Flat fee, no subscription.",
    descId: "Tim kami memperbaiki temuan merah Anda dalam 30 hari. Biaya tetap, tanpa langganan.",
    ctaEn: "Talk to us →",
    ctaId: "Hubungi kami →",
    ctaVariant: "primary",
    ctaTarget: "mailto",
    features: [
      { en: "Everything in Free", id: "Semua yang ada di Gratis" },
      { en: "Email security hardening (DMARC, DKIM, SPF)", id: "Penguatan keamanan email (DMARC, DKIM, SPF)" },
      { en: "MFA hygiene on critical accounts", id: "Kebersihan MFA pada akun kritis" },
      { en: "Endpoint baseline hardening", id: "Penguatan baseline endpoint" },
      { en: "Human analyst validation of red findings", id: "Validasi analis manusia pada temuan merah" },
      { en: "Executive before/after report (no watermark)", id: "Laporan eksekutif sebelum/sesudah (tanpa tanda air)" },
    ],
  },
  {
    key: "mdr",
    featured: false,
    tierLabelEn: "Monthly retainer",
    tierLabelId: "Retainer bulanan",
    priceMain: "Rp 25–60 jt",
    priceSubEn: "Core MDR",
    priceSubId: "MDR Inti",
    descEn: "Always-on detection so you're never blind again.",
    descId: "Deteksi selalu aktif agar Anda tidak pernah buta lagi.",
    ctaEn: "Talk to us →",
    ctaId: "Hubungi kami →",
    ctaVariant: "secondary",
    ctaTarget: "mailto",
    features: [
      { en: "Everything in Sprint", id: "Semua yang ada di Sprint" },
      { en: "24/7 detection & alert triage", id: "Deteksi & triase alert 24/7" },
      { en: "30-day log retention", id: "Retensi log 30 hari" },
      { en: "Unlimited AI analyses", id: "Analisis AI tak terbatas" },
      { en: "Response SLA: 4h critical", id: "SLA respons: 4 jam kritis" },
      { en: "Monthly executive report (clean PDF)", id: "Laporan eksekutif bulanan (PDF bersih)" },
    ],
  },
]

export type CompareCell = string | { en: string; id: string } | boolean

export interface CompareRow {
  featureEn: string
  featureId: string
  free: CompareCell
  sprint: CompareCell
  mdr: CompareCell
  aiMdr: CompareCell
}

export const COMPARE_ROWS: CompareRow[] = [
  { featureEn: "Endpoints", featureId: "Endpoint", free: "5–10", sprint: { en: "Up to 50", id: "Hingga 50" }, mdr: { en: "Unlimited", id: "Tak terbatas" }, aiMdr: { en: "Unlimited", id: "Tak terbatas" } },
  { featureEn: "Log retention", featureId: "Retensi log", free: { en: "3–7 days", id: "3–7 hari" }, sprint: { en: "30 days", id: "30 hari" }, mdr: { en: "30 days", id: "30 hari" }, aiMdr: { en: "90 days", id: "90 hari" } },
  { featureEn: "AI analyses/month", featureId: "Analisis AI/bulan", free: "50", sprint: "500", mdr: { en: "Unlimited", id: "Tak terbatas" }, aiMdr: { en: "Unlimited", id: "Tak terbatas" } },
  { featureEn: "Human analyst", featureId: "Analis manusia", free: false, sprint: { en: "✓ (sprint only)", id: "✓ (sprint saja)" }, mdr: true, aiMdr: true },
  { featureEn: "SOAR / containment", featureId: "SOAR / penahanan", free: false, sprint: false, mdr: { en: "Basic", id: "Dasar" }, aiMdr: { en: "Full", id: "Penuh" } },
  { featureEn: "Phishing mailbox integration", featureId: "Integrasi mailbox phishing", free: { en: "Manual only", id: "Manual saja" }, sprint: false, mdr: false, aiMdr: true },
  { featureEn: "Response SLA", featureId: "SLA respons", free: { en: "None", id: "Tidak ada" }, sprint: { en: "None", id: "Tidak ada" }, mdr: { en: "4h critical", id: "4j kritis" }, aiMdr: { en: "2h critical", id: "2j kritis" } },
  { featureEn: "Report (PDF)", featureId: "Laporan (PDF)", free: { en: "Watermarked preview", id: "Pratinjau bertanda air" }, sprint: { en: "Clean", id: "Bersih" }, mdr: { en: "Clean + monthly", id: "Bersih + bulanan" }, aiMdr: { en: "Clean + monthly + QBR", id: "Bersih + bulanan + QBR" } },
]

export interface PlatformCard {
  icon: "shield" | "refresh" | "robot"
  titleEn: string
  titleId: string
  descEn: string
  descId: string
}

export const PLATFORM_CARDS: PlatformCard[] = [
  {
    icon: "shield",
    titleEn: "Prevention edge",
    titleId: "Edge pencegahan",
    descEn: "Identity-based access to private apps, inline traffic inspection, and data-loss prevention — stopping bulk transfers, not just alerting afterward.",
    descId: "Akses berbasis identitas ke aplikasi privat, inspeksi lalu lintas inline, dan pencegahan kebocoran data — menghentikan transfer massal, bukan hanya memberi tahu setelahnya.",
  },
  {
    icon: "refresh",
    titleEn: "One closed loop",
    titleId: "Satu lingkaran tertutup",
    descEn: "The edge enforces and streams everything to the brain. The brain detects, decides, and drives the response back — one console, one rulebook, instead of stitched-together tools.",
    descId: "Edge menegakkan dan mengalirkan semuanya ke otak. Otak mendeteksi, memutuskan, dan mengarahkan respons kembali — satu konsol, satu aturan, bukan tools yang dijahit bersama.",
  },
  {
    icon: "robot",
    titleEn: "Govern every AI action",
    titleId: "Kendalikan setiap tindakan AI",
    descEn: "The same policy engine that governs your people governs every AI agent — every tool call checked before it runs, with a full audit trail.",
    descId: "Mesin kebijakan yang sama yang mengatur orang Anda mengatur setiap agen AI — setiap panggilan tool diperiksa sebelum dijalankan, dengan jejak audit lengkap.",
  },
]
