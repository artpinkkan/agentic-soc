import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  CircleAlert,
  Lock,
  Mail,
  UserCog,
  Network,
  FileText,
  Laptop,
  Globe,
  ArrowRight,
  Eye,
  Circle,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useI18n } from "@/lib/i18n"
import { useSession } from "@/lib/session"

type Severity = "critical" | "high"

interface Finding {
  key: string
  sev: Severity
  en: string
  id: string
}

interface DomainData {
  icon: typeof Mail
  chip: string
  dot: string
  nameEn: string
  nameId: string
  checksEn: string
  checksId: string
  checksDone: number
  checksTotal: number
  tier: "verified" | "deterministic" | "review" | "unscanned"
  findings: Finding[]
}

const DOMAIN_FINDINGS: Record<string, DomainData> = {
  email: {
    icon: Mail,
    chip: "bg-sky-100 text-sky-600",
    dot: "#0284c7",
    nameEn: "Email Security",
    nameId: "Keamanan Email",
    checksEn: "7 of 16 checks complete",
    checksId: "7 dari 16 pemeriksaan selesai",
    checksDone: 7,
    checksTotal: 16,
    tier: "review",
    findings: [
      { key: "email-dmarc", sev: "critical", en: "DMARC policy missing on company domain", id: "Kebijakan DMARC hilang pada domain perusahaan" },
      { key: "email-spf", sev: "critical", en: "SPF record allows unauthorized senders", id: "Rekaman SPF mengizinkan pengirim tidak sah" },
      { key: "email-dkim", sev: "high", en: "DKIM signing not enabled on secondary domain", id: "Penandatanganan DKIM belum diaktifkan pada domain sekunder" },
    ],
  },
  identity: {
    icon: UserCog,
    chip: "bg-violet-100 text-violet-600",
    dot: "#7c3aed",
    nameEn: "Identity & Access",
    nameId: "Identitas & Akses",
    checksEn: "3 of 14 checks complete",
    checksId: "3 dari 14 pemeriksaan selesai",
    checksDone: 3,
    checksTotal: 14,
    tier: "verified",
    findings: [
      { key: "identity-mfa", sev: "high", en: "4 admin accounts without MFA", id: "4 akun admin tanpa MFA" },
      { key: "identity-stale", sev: "high", en: "Stale service account with owner-level access", id: "Akun layanan tidak aktif dengan akses setingkat pemilik" },
    ],
  },
  network: {
    icon: Network,
    chip: "bg-amber-100 text-amber-600",
    dot: "#d97706",
    nameEn: "Network & Perimeter",
    nameId: "Jaringan & Perimeter",
    checksEn: "5 of 16 checks complete",
    checksId: "5 dari 16 pemeriksaan selesai",
    checksDone: 5,
    checksTotal: 16,
    tier: "verified",
    findings: [
      { key: "network-rdp", sev: "critical", en: "Exposed RDP service on public IP", id: "Layanan RDP terbuka pada IP publik" },
      { key: "network-tls", sev: "high", en: "Outdated TLS version (1.0) on VPN gateway", id: "Versi TLS usang (1.0) pada gateway VPN" },
      { key: "network-fw", sev: "high", en: "Firewall rule allows any-to-any on port 22", id: "Aturan firewall mengizinkan any-to-any pada port 22" },
    ],
  },
  log: {
    icon: FileText,
    chip: "bg-cyan-100 text-cyan-600",
    dot: "#0891b2",
    nameEn: "Log Management",
    nameId: "Manajemen Log",
    checksEn: "1 of 12 checks complete",
    checksId: "1 dari 12 pemeriksaan selesai",
    checksDone: 1,
    checksTotal: 12,
    tier: "review",
    findings: [
      { key: "log-siem", sev: "critical", en: "No centralized log retention — SIEM ingestion gap", id: "Tidak ada retensi log terpusat — celah pada penyerapan SIEM" },
      { key: "log-audit", sev: "high", en: "Audit logging disabled on 3 critical servers", id: "Pencatatan audit dinonaktifkan pada 3 server kritis" },
      { key: "log-retention", sev: "high", en: "Log retention below compliance minimum (7 days)", id: "Retensi log di bawah standar minimum kepatuhan (7 hari)" },
    ],
  },
  endpoint: {
    icon: Laptop,
    chip: "bg-rose-100 text-rose-600",
    dot: "#e11d48",
    nameEn: "Endpoint Security",
    nameId: "Keamanan Endpoint",
    checksEn: "0 of 16 checks complete",
    checksId: "0 dari 16 pemeriksaan selesai",
    checksDone: 0,
    checksTotal: 16,
    tier: "unscanned",
    findings: [],
  },
  web: {
    icon: Globe,
    chip: "bg-indigo-100 text-indigo-600",
    dot: "#4f46e5",
    nameEn: "Web & Subdomain",
    nameId: "Web & Subdomain",
    checksEn: "5 of 14 checks complete",
    checksId: "5 dari 14 pemeriksaan selesai",
    checksDone: 5,
    checksTotal: 14,
    tier: "verified",
    findings: [
      { key: "web-tls", sev: "high", en: "Expired TLS certificate on subdomain", id: "Sertifikat TLS kedaluwarsa pada subdomain" },
    ],
  },
}

const TIER_LABEL: Record<DomainData["tier"], { en: string; id: string }> = {
  verified: { en: "Tier 3 · Verified", id: "Tier 3 · Terverifikasi" },
  deterministic: { en: "Tier 2 · Deterministic", id: "Tier 2 · Deterministik" },
  review: { en: "Tier 4 · Review", id: "Tier 4 · Tinjauan" },
  unscanned: { en: "Not scanned", id: "Belum dipindai" },
}

const ALERT_TREND_END_DATE = "2026-07-05"
const ALERT_TREND_DAYS = 42

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10)
}

const DAILY_ALERTS: { date: string; value: number }[] = Array.from({ length: ALERT_TREND_DAYS }, (_, i) => {
  const end = new Date(`${ALERT_TREND_END_DATE}T00:00:00Z`)
  const d = new Date(end)
  d.setUTCDate(end.getUTCDate() - (ALERT_TREND_DAYS - 1 - i))
  const dayOfWeek = d.getUTCDay()
  const weekendDip = dayOfWeek === 0 || dayOfWeek === 6 ? -1 : 0
  const isLastWeek = i >= ALERT_TREND_DAYS - 7
  const base = 2 + ((i * 7) % 5) + weekendDip
  const value = Math.max(0, isLastWeek ? base + 2 : base)
  return { date: toISODate(d), value }
})

function bucketAlerts(alerts: { date: string; value: number }[], targetBuckets: number) {
  if (alerts.length === 0) return []
  const bucketCount = Math.max(1, Math.min(targetBuckets, alerts.length))
  const size = Math.ceil(alerts.length / bucketCount)
  const buckets: { label: string; value: number }[] = []
  for (let i = 0; i < alerts.length; i += size) {
    const chunk = alerts.slice(i, i + size)
    const value = chunk.reduce((sum, a) => sum + a.value, 0)
    const start = new Date(`${chunk[0].date}T00:00:00Z`)
    const label = start.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
    buckets.push({ label, value })
  }
  return buckets
}

export function Dashboard() {
  const { lang, t } = useI18n()
  const { account } = useSession()
  const [openDomain, setOpenDomain] = useState<string | null>(null)
  const domain = openDomain ? DOMAIN_FINDINGS[openDomain] : null
  const firstName = account.name.split(" ")[0]

  const findingLink = (domainKey: string, f: Finding) => {
    const text = lang === "en" ? f.en : f.id
    const params = new URLSearchParams({ conv: f.key, t: text, sev: f.sev, dom: domainKey })
    return `/investigate?${params.toString()}`
  }

  const domainEntries = useMemo(() => Object.entries(DOMAIN_FINDINGS), [])

  const donutTotal = useMemo(
    () => domainEntries.reduce((sum, [, d]) => sum + d.findings.length, 0),
    [domainEntries]
  )
  const donutGradient = useMemo(() => {
    let acc = 0
    const stops = domainEntries
      .filter(([, d]) => d.findings.length > 0)
      .map(([, d]) => {
        const start = (acc / donutTotal) * 360
        acc += d.findings.length
        const end = (acc / donutTotal) * 360
        return `${d.dot} ${start}deg ${end}deg`
      })
    return `conic-gradient(${stops.join(", ")})`
  }, [domainEntries, donutTotal])

  const defaultStart = DAILY_ALERTS[0].date
  const defaultEnd = DAILY_ALERTS[DAILY_ALERTS.length - 1].date
  const [trendRange, setTrendRange] = useState({ start: defaultStart, end: defaultEnd })
  const [draftRange, setDraftRange] = useState(trendRange)
  const [trendFilterOpen, setTrendFilterOpen] = useState(false)

  const filteredAlerts = useMemo(
    () => DAILY_ALERTS.filter((a) => a.date >= trendRange.start && a.date <= trendRange.end),
    [trendRange]
  )
  const trendBuckets = useMemo(() => bucketAlerts(filteredAlerts, 8), [filteredAlerts])
  const maxTrend = Math.max(1, ...trendBuckets.map((w) => w.value))
  const trendPeak = Math.max(0, ...trendBuckets.map((w) => w.value))

  const applyTrendFilter = () => {
    if (draftRange.start > draftRange.end) return
    setTrendRange(draftRange)
    setTrendFilterOpen(false)
  }
  const resetTrendFilter = () => {
    const reset = { start: defaultStart, end: defaultEnd }
    setDraftRange(reset)
    setTrendRange(reset)
  }
  const formatRangeLabel = (date: string) =>
    new Date(`${date}T00:00:00Z`).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    })

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner */}
      <Card className="bg-primary/5 py-5 px-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {t(`Welcome back, ${firstName}!`, `Selamat datang kembali, ${firstName}!`)}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t(
                "2 critical findings need attention and 1 finding is pending analyst review.",
                "2 temuan kritis memerlukan perhatian dan 1 temuan menunggu tinjauan analis."
              )}{" "}
              <Link to="/triage" className="text-primary font-medium hover:underline">
                {t("Go to Triage →", "Ke Triase →")}
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/ai-governance"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Lock className="size-3.5" />
                  {t("Audit trail →", "Jejak audit →")}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                {t("Audit chain: last verification 2h ago · redaction gates PASS", "Rantai audit: verifikasi terakhir 2j lalu · gerbang redaksi LULUS")}
              </TooltipContent>
            </Tooltip>
            <Link to="/onboarding" className="text-xs text-primary hover:underline">
              {t("Domain settings", "Pengaturan domain")}
            </Link>
          </div>
        </div>
      </Card>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="py-3 px-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-6 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertOctagon className="size-3.5" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {t("Critical Findings", "Temuan Kritis")}
            </span>
          </div>
          <div className="text-2xl font-semibold tracking-tight">2</div>
          <div className="text-xs text-red-600 font-medium mt-0.5">
            {t("+1 vs last scan", "+1 dari pindaian terakhir")}
          </div>
        </Card>
        <Card className="py-3 px-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-6 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="size-3.5" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {t("High Findings", "Temuan Tinggi")}
            </span>
          </div>
          <div className="text-2xl font-semibold tracking-tight">2</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {t("No change vs last scan", "Tidak berubah dari pindaian terakhir")}
          </div>
        </Card>
        <Card className="py-3 px-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-6 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CircleAlert className="size-3.5" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {t("Medium", "Sedang")}
            </span>
          </div>
          <div className="text-2xl font-semibold tracking-tight">0</div>
          <div className="text-xs text-emerald-600 font-medium mt-0.5">
            {t("All clear", "Semua bersih")}
          </div>
        </Card>
      </div>

      {/* AI verification strip */}
      <Card className="flex-row items-center gap-4 flex-wrap py-3 px-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="gap-1 cursor-help">
                <ShieldCheck className="size-3.5" />
                {t("9/10 findings verified", "9/10 temuan terverifikasi")}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {t(
                "9/10 findings passed self-consistency voting (k=5) + judge model review",
                "9/10 temuan lolos voting self-consistency (k=5) + tinjauan model juri"
              )}
            </TooltipContent>
          </Tooltip>
          <Separator />
          <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-600">
            <AlertTriangle className="size-3.5" />
            {t("1 abstained — pending analyst review", "1 abstain — menunggu tinjauan analis")}
          </span>
        </div>
        <Link to="/triage" className="ml-auto text-sm font-medium text-primary hover:underline">
          {t("Review in Triage →", "Tinjau di Triase →")}
        </Link>
      </Card>

      {/* Findings breakdown, alert trend, findings status */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 items-stretch">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">{t("Alert Trend", "Tren Peringatan")}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatRangeLabel(trendRange.start)} – {formatRangeLabel(trendRange.end)}
              </p>
            </div>
            <Popover
              open={trendFilterOpen}
              onOpenChange={(open) => {
                setTrendFilterOpen(open)
                if (open) setDraftRange(trendRange)
              }}
            >
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <SlidersHorizontal className="size-3.5" />
                  {t("Filter", "Filter")}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72">
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-medium">{t("Advanced filter", "Filter lanjutan")}</p>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="trend-start-date" className="text-xs text-muted-foreground">
                      {t("Start date", "Tanggal mulai")}
                    </Label>
                    <Input
                      id="trend-start-date"
                      type="date"
                      value={draftRange.start}
                      max={draftRange.end}
                      onChange={(e) => setDraftRange((r) => ({ ...r, start: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="trend-end-date" className="text-xs text-muted-foreground">
                      {t("End date", "Tanggal akhir")}
                    </Label>
                    <Input
                      id="trend-end-date"
                      type="date"
                      value={draftRange.end}
                      min={draftRange.start}
                      max={defaultEnd}
                      onChange={(e) => setDraftRange((r) => ({ ...r, end: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={resetTrendFilter}>
                      <RotateCcw className="size-3.5" />
                      {t("Reset", "Atur ulang")}
                    </Button>
                    <Button size="sm" onClick={applyTrendFilter}>
                      {t("Apply", "Terapkan")}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            {trendBuckets.length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                {t("No alerts in this range", "Tidak ada peringatan pada rentang ini")}
              </div>
            ) : (
              <div className="flex flex-1 items-end gap-3">
                {trendBuckets.map((w, i) => {
                  const isSpike = w.value === trendPeak && w.value > 0
                  const heightPct = (w.value / maxTrend) * 100
                  return (
                    <div key={`${w.label}-${i}`} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      {isSpike && (
                        <span className="text-xs font-semibold text-red-600">{w.value}</span>
                      )}
                      <div
                        className={`w-full rounded-t-sm ${isSpike ? "bg-red-500" : "bg-emerald-400"}`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-[10px] text-muted-foreground">{w.label}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("Finding Sources Breakdown", "Rincian Sumber Temuan")}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="relative size-24 shrink-0 rounded-full" style={{ background: donutGradient }}>
                <div className="absolute inset-3 rounded-full bg-card flex flex-col items-center justify-center">
                  <span className="text-lg font-semibold tracking-tight">{donutTotal}</span>
                  <span className="text-[10px] text-muted-foreground">{t("findings", "temuan")}</span>
                </div>
              </div>
              <ul className="flex w-full flex-col gap-1.5 text-sm min-w-0">
                {domainEntries
                  .filter(([, d]) => d.findings.length > 0)
                  .map(([key, d]) => (
                    <li key={key} className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: d.dot }} />
                      <span className="truncate text-foreground/80">{t(d.nameEn, d.nameId)}</span>
                      <span className="ml-auto font-medium">{d.findings.length}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("Findings Status", "Status Temuan")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm">
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="bg-sky-500" style={{ width: `${(12 / 25) * 100}%` }} />
                <div className="bg-violet-500" style={{ width: `${(4 / 25) * 100}%` }} />
                <div className="bg-emerald-500" style={{ width: `${(9 / 25) * 100}%` }} />
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-6 rounded-md bg-sky-100 text-sky-600 flex items-center justify-center">
                      <Circle className="size-3" />
                    </span>
                    {t("Open", "Terbuka")}
                  </span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-6 rounded-md bg-violet-100 text-violet-600 flex items-center justify-center">
                      <Eye className="size-3" />
                    </span>
                    {t("Monitoring", "Pemantauan")}
                  </span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-6 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck className="size-3" />
                    </span>
                    {t("Resolved", "Terselesaikan")}
                  </span>
                  <span className="font-medium">9</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium pt-3 border-t border-dashed">
                <ShieldCheck className="size-3.5" />
                {t("8/9 findings ≥2 independent citations", "8/9 temuan ≥2 sitasi independen")}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security Domain Coverage */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight mb-3">
          {t("Security Domain Coverage", "Cakupan Domain Keamanan")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {domainEntries.map(([key, d]) => {
            const Icon = d.icon
            const criticalCount = d.findings.filter((f) => f.sev === "critical").length
            const highCount = d.findings.filter((f) => f.sev === "high").length
            return (
              <Card
                key={key}
                role="button"
                tabIndex={0}
                onClick={() => setOpenDomain(key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setOpenDomain(key)
                  }
                }}
                className="cursor-pointer hover:border-primary/50 transition-colors"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2.5">
                    <span className={`size-7 rounded-lg flex items-center justify-center shrink-0 ${d.chip}`}>
                      <Icon className="size-3.5" />
                    </span>
                    {t(d.nameEn, d.nameId)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Progress value={(d.checksDone / d.checksTotal) * 100} />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t(d.checksEn, d.checksId)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs">
                      {criticalCount > 0 && (
                        <span className="text-red-600 font-medium mr-2">{criticalCount} {t("critical", "kritis")}</span>
                      )}
                      {highCount > 0 && (
                        <span className="text-amber-600 font-medium">{highCount} {t("high", "tinggi")}</span>
                      )}
                      {d.findings.length === 0 && (
                        <span className="text-muted-foreground">{t("Not yet scanned", "Belum dipindai")}</span>
                      )}
                    </span>
                    <Badge
                      variant={d.tier === "verified" ? "default" : d.tier === "review" ? "outline" : "secondary"}
                      className="text-[10px]"
                    >
                      {t(TIER_LABEL[d.tier].en, TIER_LABEL[d.tier].id)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Domain detail dialog — one Investigate action per finding */}
      <Dialog open={!!openDomain} onOpenChange={(o) => !o && setOpenDomain(null)}>
        <DialogContent className="sm:max-w-lg">
          {domain && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <domain.icon className="size-4 text-muted-foreground" />
                  {t(domain.nameEn, domain.nameId)}
                </DialogTitle>
                <DialogDescription>{t(domain.checksEn, domain.checksId)}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col divide-y">
                {domain.findings.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    {t("No findings yet — this domain has not been scanned.", "Belum ada temuan — domain ini belum dipindai.")}
                  </p>
                ) : (
                  domain.findings.map((f) => (
                    <div key={f.key} className="flex items-start gap-3 py-3">
                      <AlertTriangle className={`size-4 mt-0.5 shrink-0 ${f.sev === "critical" ? "text-red-600" : "text-amber-600"}`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-[11px] font-semibold uppercase tracking-wide ${f.sev === "critical" ? "text-red-600" : "text-amber-600"}`}>
                          {f.sev === "critical" ? t("Critical", "Kritis") : t("High", "Tinggi")}
                        </div>
                        <div className="text-sm">{t(f.en, f.id)}</div>
                      </div>
                      <Button asChild variant="link" size="sm" className="shrink-0 px-0 h-auto">
                        <Link to={findingLink(openDomain!, f)}>
                          {t("Investigate", "Investigasi")} <ArrowRight className="size-3" />
                        </Link>
                      </Button>
                    </div>
                  ))
                )}
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpenDomain(null)}>
                  {t("Close", "Tutup")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Separator() {
  return <span className="w-px h-4 bg-border" />
}
