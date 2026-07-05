import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Bot,
  ShieldCheck,
  ClockAlert,
  AlertTriangle,
  Info,
  Check,
  X,
  Timer,
  History,
  UserCheck,
  Zap,
  Users,
  Settings2,
  MailWarning,
  DatabaseZap,
  BrainCircuit,
  Globe,
  FileSearch,
  FileBarChart,
  Plus,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useSession } from "@/lib/session"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useI18n } from "@/lib/i18n"
import {
  AUDIT_LOG,
  PENDING_ACTIONS,
  POLICY_GROUPS,
  type PolicyRule,
} from "@/lib/ai-governance-data"

const RISK_BADGE: Record<string, "destructive" | "secondary"> = {
  high: "destructive",
  medium: "secondary",
}

const RISK_LABEL: Record<string, { en: string; id: string }> = {
  high: { en: "High", id: "Tinggi" },
  medium: { en: "Medium", id: "Sedang" },
}

const POLICY_ICON: Record<PolicyRule["icon"], typeof Users> = {
  users: Users,
  settings: Settings2,
  mail: MailWarning,
  export: DatabaseZap,
  brain: BrainCircuit,
  search: Globe,
  logs: FileSearch,
  report: FileBarChart,
}

function PolicyModePill({ mode }: { mode: PolicyRule["mode"] }) {
  const { t } = useI18n()
  if (mode === "hitl") {
    return (
      <Badge className="gap-1">
        <UserCheck className="size-3" />
        {t("Human approval", "Persetujuan manusia")}
      </Badge>
    )
  }
  if (mode === "audit") {
    return (
      <Badge className="gap-1">
        <ShieldCheck className="size-3" />
        {t("+ audit", "+ audit")}
      </Badge>
    )
  }
  return (
    <Badge className="gap-1">
      <Zap className="size-3" />
      {t("Auto", "Otomatis")}
    </Badge>
  )
}

const DECISION_BADGE: Record<string, { icon: typeof Zap; en: string; id: string }> = {
  auto: { icon: Zap, en: "Auto-approved", id: "Otomatis" },
  approved: { icon: UserCheck, en: "Approved", id: "Disetujui" },
  rejected: { icon: X, en: "Rejected", id: "Ditolak" },
}

type CardState = "pending" | "approved" | "rejected"

export function AiGovernance() {
  const { t } = useI18n()
  const { account } = useSession()
  const [cardStates, setCardStates] = useState<Record<number, CardState>>({})
  const [previewUnlocked, setPreviewUnlocked] = useState(false)
  const tierUnlocked = account.tier === "mdr_ai" || previewUnlocked

  const pendingCount = PENDING_ACTIONS.filter((a) => (cardStates[a.id] ?? "pending") === "pending").length

  const approve = (id: number) => setCardStates((prev) => ({ ...prev, [id]: "approved" }))
  const reject = (id: number) => setCardStates((prev) => ({ ...prev, [id]: "rejected" }))

  const stats = [
    { value: pendingCount, label: { en: "Pending approval", id: "Menunggu persetujuan" }, danger: true },
    { value: 47, label: { en: "Actions today", id: "Tindakan hari ini" } },
    { value: 38, label: { en: "Auto-approved", id: "Disetujui otomatis" } },
    { value: 6, label: { en: "Human-approved", id: "Disetujui manusia" } },
    { value: 1, label: { en: "Rejected", id: "Ditolak" } },
    { value: 8, label: { en: "Active policies", id: "Kebijakan aktif" } },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("AI Governance", "Tata Kelola AI")}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            {t(
              "Policy engine for AI agent data access, configuration changes, and external communications. Incident containment is handled in Triage.",
              "Mesin kebijakan untuk akses data, perubahan konfigurasi, dan komunikasi eksternal oleh agen AI. Penahanan insiden ditangani di Triase."
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="gap-1">
            <Bot className="size-3" />
            {t("Shannon SOC Agent", "Shannon SOC Agent")}
          </Badge>
          <span className="size-1.5 rounded-full bg-emerald-600 inline-block" />
          <span className="text-xs text-muted-foreground">{t("Active", "Aktif")}</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <Card key={s.label.en} className="text-center py-4">
            <CardContent className="p-0">
              <div className={`text-2xl font-semibold ${s.danger ? "text-red-600" : "text-primary"}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{t(s.label.en, s.label.id)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main lockable content */}
      <div className="relative">
        {!tierUnlocked && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-center rounded-xl bg-background/90 backdrop-blur-sm p-8">
            <div className="size-12 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center">
              <Bot className="size-6" />
            </div>
            <div className="text-base font-semibold">{t("Available on MDR AI plan", "Tersedia di paket MDR AI")}</div>
            <p className="text-sm text-muted-foreground max-w-md">
              {t(
                "Per-action AI governance — policy enforcement on every agent tool call — is a flagship feature of the MDR AI plan.",
                "Tata kelola AI per-tindakan — penegakan kebijakan pada setiap pemanggilan alat agen — adalah fitur unggulan paket MDR AI."
              )}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Button asChild size="sm">
                <Link to="/pricing">{t("See MDR AI plan →", "Lihat paket MDR AI →")}</Link>
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPreviewUnlocked(true)}>
                {t("Preview as MDR AI", "Pratinjau sebagai MDR AI")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("Or switch accounts below to preview", "Atau ganti akun di bawah untuk pratinjau")}
            </p>
          </div>
        )}

        <div className={`flex flex-col gap-6 ${!tierUnlocked ? "pointer-events-none select-none opacity-40" : ""}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Pending Actions */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardContent className="flex items-center gap-3 py-3">
                  <AlertTriangle className={`size-5 shrink-0 ${pendingCount > 0 ? "text-red-600" : "text-emerald-600"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">
                      {pendingCount > 0
                        ? t("AI Agent Awaiting Your Decision", "Agen AI Menunggu Keputusan Anda")
                        : t("All Actions Resolved", "Semua Tindakan Terselesaikan")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t(
                        "These tool calls are blocked until a human approves or rejects them.",
                        "Pemanggilan alat ini diblokir hingga manusia menyetujui atau menolaknya."
                      )}
                    </div>
                  </div>
                  <div className="text-2xl font-semibold shrink-0">{pendingCount}</div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  <ClockAlert className="size-4" />
                  {t("Pending Actions", "Tindakan Tertunda")}
                </div>
                <span className="text-xs text-muted-foreground">
                  {t("Requires human decision before execution", "Memerlukan keputusan manusia sebelum eksekusi")}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {PENDING_ACTIONS.map((action) => {
                  const state = cardStates[action.id] ?? "pending"
                  return (
                    <Card key={action.id} className={state !== "pending" ? "opacity-60" : ""}>
                      <CardContent className="flex flex-col gap-2.5 py-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 text-sm font-medium">
                            <Bot className="size-4 text-muted-foreground" />
                            Shannon SOC Agent
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={RISK_BADGE[action.risk]}>{t(RISK_LABEL[action.risk].en, RISK_LABEL[action.risk].id)}</Badge>
                            <span className="text-xs text-muted-foreground">{t(action.timeAgoEn, action.timeAgoId)}</span>
                          </div>
                        </div>
                        <code className="text-xs bg-muted rounded-md px-2.5 py-1.5 font-mono break-all">{action.toolCall}</code>
                        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <Info className="size-3.5 shrink-0 mt-0.5" />
                          <span>{t(action.reasonEn, action.reasonId)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-1">
                          {state === "pending" ? (
                            <div className="flex items-center gap-2">
                              <Button size="sm" onClick={() => approve(action.id)}>
                                <Check className="size-3.5" />
                                {t("Approve", "Setujui")}
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => reject(action.id)}>
                                <X className="size-3.5" />
                                {t("Reject", "Tolak")}
                              </Button>
                            </div>
                          ) : state === "approved" ? (
                            <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                              <Check className="size-4" />
                              {t("Approved — executing…", "Disetujui — mengeksekusi…")}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-sm text-red-600 font-medium">
                              <X className="size-4" />
                              {t("Rejected — action blocked", "Ditolak — tindakan diblokir")}
                            </div>
                          )}
                          <Link to="/inspector" className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0">
                            <Timer className="size-3" />
                            {t("View trace", "Lihat jejak")}
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Right: Policy Rules */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  <ShieldCheck className="size-4" />
                  {t("Policy Rules", "Aturan Kebijakan")}
                </div>
                <Button size="sm" variant="outline" disabled>
                  <Plus className="size-3.5" />
                  {t("Add Rule", "Tambah Aturan")}
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><UserCheck className="size-3" /> {t("Human approval", "Persetujuan manusia")}</span>
                <span className="flex items-center gap-1"><ShieldCheck className="size-3" /> {t("+ audit", "+ audit")}</span>
                <span className="flex items-center gap-1"><Zap className="size-3" /> {t("Auto", "Otomatis")}</span>
              </div>

              <Card className="py-0 overflow-hidden">
                <CardContent className="p-0 divide-y">
                  {POLICY_GROUPS.map((group) => (
                    <div key={group.labelEn}>
                      <div className="px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted/50">
                        {t(group.labelEn, group.labelId)}
                      </div>
                      {group.rules.map((rule) => {
                        const Icon = POLICY_ICON[rule.icon]
                        return (
                          <div key={rule.nameEn} className="flex items-center justify-between gap-3 px-4 py-3 border-t">
                            <div className="flex items-center gap-2 text-sm min-w-0">
                              <Icon className="size-4 text-muted-foreground shrink-0" />
                              <span className="truncate">{t(rule.nameEn, rule.nameId)}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <PolicyModePill mode={rule.mode} />
                              <Switch checked disabled />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Audit Log */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                <History className="size-4" />
                {t("Audit Log", "Log Audit")}
              </div>
              <span className="text-xs font-medium text-primary cursor-pointer hover:underline">
                {t("Export CSV", "Ekspor CSV")}
              </span>
            </div>

            <Card className="py-0 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Time", "Waktu")}</TableHead>
                    <TableHead>{t("Agent", "Agen")}</TableHead>
                    <TableHead>{t("Tool Call", "Pemanggilan Alat")}</TableHead>
                    <TableHead>{t("Decision", "Keputusan")}</TableHead>
                    <TableHead>{t("Decided By", "Diputuskan Oleh")}</TableHead>
                    <TableHead>{t("Outcome", "Hasil")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {AUDIT_LOG.map((entry, i) => {
                    const d = DECISION_BADGE[entry.decision]
                    const DIcon = d.icon
                    return (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">{entry.time}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{entry.agent}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted rounded px-1.5 py-0.5 font-mono">{entry.toolCall}</code>
                        </TableCell>
                        <TableCell>
                          <Badge className="gap-1">
                            <DIcon className="size-3" />
                            {t(d.en, d.id)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{entry.decision === "auto" ? t(entry.decidedByEn, entry.decidedById) : entry.decidedByEn}</TableCell>
                        <TableCell>
                          {entry.outcome === "success" ? (
                            <Check className="size-4 text-emerald-600" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>

            <p className="text-xs text-muted-foreground leading-relaxed pt-3 border-t border-dashed">
              {t(
                "The same policy engine that governs your people governs every agent. Every AI tool call is logged here with full attribution — who approved, which policy matched, and what happened.",
                "Mesin kebijakan yang sama yang mengatur orang-orang Anda mengatur setiap agen. Setiap pemanggilan alat AI dicatat di sini dengan atribusi lengkap — siapa yang menyetujui, kebijakan mana yang cocok, dan apa yang terjadi."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
