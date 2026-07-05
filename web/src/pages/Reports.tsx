import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertTriangle,
  Check,
  Clock,
  Download,
  Lock,
  Mail,
  FileStack,
  FileText,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n"
import { useSession } from "@/lib/session"
import {
  AUDIENCE_LABEL,
  COMPLIANCE_EVIDENCE_ITEMS,
  REPORTS,
  REPORT_TYPE_LABEL,
  SEV_LABEL,
  STATUS_LABEL,
  pick,
  type Audience,
  type ReportSeverity,
  type ReportStatus,
} from "@/lib/reports-data"

const SEVERITY_TEXT: Record<ReportSeverity, string> = {
  critical: "text-red-600",
  high: "text-amber-600",
  medium: "text-foreground",
  low: "text-muted-foreground",
}

const STATUS_TEXT: Record<ReportStatus, string> = {
  open: "text-amber-600",
  review: "text-muted-foreground",
  closed: "text-emerald-600",
}

function StatusPill({ status }: { status: ReportStatus }) {
  const { t } = useI18n()
  const Icon = status === "open" ? AlertTriangle : status === "review" ? Clock : Check
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${STATUS_TEXT[status]}`}>
      <Icon className="size-2.5" />
      {t(STATUS_LABEL[status].en, STATUS_LABEL[status].id)}
    </span>
  )
}

export function Reports() {
  const { lang, t } = useI18n()
  const { account } = useSession()
  const isFreeTier = account.tier === "free"
  const [selectedId, setSelectedId] = useState("047")
  const [audience, setAudience] = useState<Audience>("direktur")
  const [showCompliancePack, setShowCompliancePack] = useState(false)
  const [reviewAction, setReviewAction] = useState<"export" | "email" | null>(null)
  const [promptValue, setPromptValue] = useState("")
  const [toast, setToast] = useState<string | null>(null)

  const report = useMemo(() => REPORTS.find((r) => r.id === selectedId)!, [selectedId])

  const typeLabel = t(REPORT_TYPE_LABEL[audience].en, REPORT_TYPE_LABEL[audience].id)
  const cyberXrayLine =
    lang === "en"
      ? `Cyber X-Ray ${typeLabel} — ${report.date}`
      : `${typeLabel} Cyber X-Ray — ${report.date}`

  const summary = pick(report.summary, audience)

  const confirmExport = () => {
    const isEmail = reviewAction === "email"
    setReviewAction(null)
    setToast(
      isEmail
        ? t("Sending watermarked preview by email…", "Mengirim pratinjau bertanda air lewat email…")
        : t("Generating watermarked PDF…", "Membuat PDF bertanda air…")
    )
    setTimeout(() => setToast(null), 2500)
  }

  const handleGenerate = () => {
    if (!promptValue.trim()) return
    setToast(t("Custom report request queued (preview only)", "Permintaan laporan khusus diantrekan (hanya pratinjau)"))
    setPromptValue("")
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("Incident Reports", "Laporan Insiden")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            {t(
              "AI-generated report for each incident. Select from the list to preview, export, or generate a compliance evidence pack.",
              "Laporan bertenaga AI untuk setiap insiden. Pilih dari daftar untuk pratinjau, ekspor, atau buat paket bukti kepatuhan."
            )}
          </p>
        </div>
        <Select value={audience} onValueChange={(v) => setAudience(v as Audience)}>
          <SelectTrigger className="w-[220px]" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(AUDIENCE_LABEL) as Audience[]).map((a) => (
              <SelectItem key={a} value={a}>
                {t("Viewing as: ", "Tampilan: ")}
                {t(AUDIENCE_LABEL[a].en, AUDIENCE_LABEL[a].id)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isFreeTier && (
        <Alert>
          <AlertTriangle className="size-4 text-amber-600" />
          <AlertDescription>
            {t(
              "Free Tier — reports are watermarked previews only. Upgrade to Sprint for clean, audit-ready PDFs.",
              "Tier Gratis — laporan hanya pratinjau bertanda air. Upgrade ke Sprint untuk PDF bersih siap audit."
            )}
          </AlertDescription>
        </Alert>
      )}

      {toast && (
        <Alert>
          <FileText className="size-4 text-emerald-600" />
          <AlertDescription>{toast}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 items-start">
        {/* LEFT: report list */}
        <Card className="overflow-hidden py-0 gap-0">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="text-sm font-medium">{t("All Reports", "Semua Laporan")}</span>
            <span className="text-xs text-muted-foreground">{REPORTS.length}</span>
          </div>
          <div className="flex flex-col divide-y">
            {REPORTS.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className={`text-left px-4 py-3 transition-colors hover:bg-muted/50 border-l-2 ${
                  r.id === selectedId ? "bg-primary/5 border-l-primary" : "border-l-transparent"
                }`}
              >
                <div className="text-[10px] font-mono text-muted-foreground mb-0.5">RPT-2026-{r.id}</div>
                <div className="text-sm font-medium leading-snug mb-1.5">{t(r.titleEn, r.titleId)}</div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[10px] font-semibold uppercase tracking-wide ${SEVERITY_TEXT[r.severity]}`}>
                    {t(SEV_LABEL[r.severity].en, SEV_LABEL[r.severity].id)}
                  </span>
                  <StatusPill status={r.status} />
                  <span className="text-[11px] text-muted-foreground ml-auto">{r.date}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* RIGHT: detail preview */}
        <div className="flex flex-col gap-4">
          <Card className="flex-row items-center justify-between flex-wrap gap-2 py-3 px-4">
            <div>
              <div className="text-sm font-semibold">{t(report.titleEn, report.titleId)}</div>
              <div className="text-xs font-mono text-muted-foreground mt-0.5">
                RPT-2026-{report.id} · {report.date}
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Button size="sm" variant="secondary" onClick={() => setShowCompliancePack((v) => !v)}>
                <FileStack className="size-3.5" />
                {t("Compliance Pack", "Paket Kepatuhan")}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setReviewAction("email")}>
                <Mail className="size-3.5" />
                {t("Email", "Email")}
              </Button>
              <Button size="sm" onClick={() => setReviewAction("export")}>
                <Download className="size-3.5" />
                {t("Export PDF", "Ekspor PDF")}
              </Button>
            </div>
          </Card>

          <Card className="flex-row items-center gap-3 flex-wrap py-3 px-4">
            <Input
              placeholder={t(
                "Request a custom report: 'Summary for board meeting…'",
                "Minta laporan khusus: 'Ringkasan untuk rapat dewan…'"
              )}
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              className="flex-1 min-w-[160px]"
            />
            <Button onClick={handleGenerate}>{t("Generate →", "Buat →")}</Button>
          </Card>

          {/* Report card */}
          <Card className="relative overflow-hidden py-6 px-6 sm:px-8">
            {isFreeTier && (
              <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center -rotate-[30deg] text-center text-[52px] font-bold leading-snug tracking-widest text-foreground/5 whitespace-nowrap">
                {t("PREVIEW", "PRATINJAU")}
              </div>
            )}

            <div className="relative flex flex-col gap-6">
              {/* Identity */}
              <div className="pb-6 border-b border-dashed">
                <div className="flex justify-between items-start gap-3 flex-wrap mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">PT Bank Contoh Tbk</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{cyberXrayLine}</p>
                  </div>
                  {isFreeTier && (
                    <Badge variant="outline">{t("Free Tier · Preview", "Tier Gratis · Pratinjau")}</Badge>
                  )}
                </div>
                <Alert>
                  <AlertTriangle className="size-4 text-red-600" />
                  <AlertDescription className="font-semibold text-foreground">
                    {t(summary.en, summary.id)}
                  </AlertDescription>
                </Alert>
              </div>

              {/* Findings */}
              <div className="pb-6 border-b border-dashed">
                <div className="text-sm font-medium mb-2.5">{t("Security Findings", "Temuan Keamanan")}</div>
                <div className="flex flex-col divide-y divide-dashed">
                  {report.findings.map((f, i) => {
                    const title = pick(f.title, audience)
                    const sub = pick(f.sub, audience)
                    return (
                      <div key={i} className="flex items-start gap-2.5 py-2.5">
                        <AlertTriangle className={`size-4 mt-0.5 shrink-0 ${SEVERITY_TEXT[f.sev]}`} />
                        <div className="flex-1 min-w-0 text-sm">
                          <div className={`text-[11px] font-semibold uppercase tracking-wide ${SEVERITY_TEXT[f.sev]}`}>
                            {t(SEV_LABEL[f.sev].en, SEV_LABEL[f.sev].id)}
                          </div>
                          <div>{t(title.en, title.id)}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{t(sub.en, sub.id)}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <div className="text-sm font-medium mb-2.5">
                  {t("Top Recommended Actions", "Tindakan yang Direkomendasikan")}
                </div>
                <div className="flex flex-col divide-y divide-dashed">
                  {report.recommendations.map((r, i) => (
                    <div key={i} className="flex items-start gap-2.5 py-2.5">
                      <span className="text-sm font-semibold text-primary min-w-[18px]">{i + 1}.</span>
                      <div className="flex-1 min-w-0 text-sm">
                        <div>{t(r.en, r.id)}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{t(r.durationEn, r.durationId)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center text-[10px] text-muted-foreground pt-2">
                {t(
                  "Generated by Shannon Sentinel AI · Model: Sentinel SLM · Human review required before sharing",
                  "Dibuat oleh Shannon Sentinel AI · Model: Sentinel SLM · Diperlukan tinjauan manusia sebelum dibagikan"
                )}
              </div>
            </div>
          </Card>

          {/* Compliance evidence pack lock gate / content */}
          {showCompliancePack ? (
            <Card className="py-4 px-5">
              <h4 className="text-sm font-medium mb-2">
                {t("Compliance Evidence Pack", "Paket Bukti Kepatuhan")}
              </h4>
              <p className="text-xs text-muted-foreground mb-2.5">
                {t(
                  "Generated evidence documents for compliance review:",
                  "Dokumen bukti yang dibuat untuk tinjauan kepatuhan:"
                )}
              </p>
              <ul className="flex flex-col gap-1.5">
                {COMPLIANCE_EVIDENCE_ITEMS.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <FileText className="size-3.5 shrink-0 mt-0.5" />
                    {t(item.en, item.id)}
                  </li>
                ))}
              </ul>
              <Button size="sm" variant="secondary" className="mt-3" onClick={() => setShowCompliancePack(false)}>
                {t("Close", "Tutup")}
              </Button>
            </Card>
          ) : (
            <Card className="relative min-h-[90px] py-4 px-5">
              <p className="text-sm opacity-30">{t("Compliance Evidence Pack", "Paket Bukti Kepatuhan")}</p>
              <p className="text-xs opacity-20 mt-1">
                {t("Model inventory · Human oversight log · Incident evidence…", "Model inventory · Human oversight log · Incident evidence…")}
              </p>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-background/90 p-4 text-center">
                <Lock className="size-5 text-muted-foreground" />
                <span className="text-sm font-medium">{t("Available on MDR plans", "Tersedia di paket MDR")}</span>
                <Link to="/pricing" className="text-xs font-medium text-primary hover:underline">
                  {t("See what's included →", "Lihat apa yang termasuk →")}
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Human Review Modal */}
      <Dialog open={reviewAction !== null} onOpenChange={(o) => !o && setReviewAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Human Review Required", "Tinjauan Manusia Diperlukan")}</DialogTitle>
            <DialogDescription>
              {t(
                "This report contains critical findings. A human analyst must review before sharing.",
                "Laporan ini mengandung temuan kritis. Analis manusia harus meninjau sebelum dibagikan."
              )}
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertTriangle className="size-4 text-red-600" />
            <AlertDescription>
              <ul className="list-disc pl-4 text-sm">
                <li>{t("No DMARC policy — email spoofing risk", "Tidak ada kebijakan DMARC — risiko pemalsuan email")}</li>
                <li>{t("Log retention 7 days (audit standard minimum: 90)", "Retensi log 7 hari (minimum standar audit: 90)")}</li>
              </ul>
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setReviewAction(null)}>
              {t("Cancel", "Batalkan")}
            </Button>
            <Button onClick={confirmExport}>{t("Confirm & Continue", "Konfirmasi & Lanjutkan")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
