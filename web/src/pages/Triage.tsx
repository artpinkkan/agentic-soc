import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Check,
  X,
  Lock,
  AlertTriangle,
  ShieldCheck,
  ListChecks,
  LayoutList,
  Info,
  UserCircle,
  UserX,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CitationChip } from "@/components/investigate/CitationChip"
import { useI18n } from "@/lib/i18n"
import { useSession } from "@/lib/session"
import {
  APPROVE_LABELS,
  CASE_QUEUE,
  PLAYBOOK_STEPS,
  ROLE_VIEW_NOTES,
  type Case,
  type StepStatus,
} from "@/lib/triage-data"

const SEVERITY_TEXT_CLASS: Record<Case["severity"], string> = {
  critical: "text-red-600 font-medium",
  high: "text-amber-600 font-medium",
  medium: "text-muted-foreground font-medium",
  low: "text-muted-foreground font-medium",
}

const SEVERITY_LABEL: Record<Case["severity"], { en: string; id: string }> = {
  critical: { en: "Critical", id: "Kritis" },
  high: { en: "High", id: "Tinggi" },
  medium: { en: "Medium", id: "Sedang" },
  low: { en: "Low", id: "Rendah" },
}

const STATUS_LABEL: Record<Case["status"], { en: string; id: string }> = {
  pending: { en: "Pending approval", id: "Menunggu persetujuan" },
  new: { en: "New", id: "Baru" },
  investigating: { en: "Investigating", id: "Diselidiki" },
  resolved: { en: "Resolved", id: "Selesai" },
}

type QueueFilter = "all" | "mine" | "unassigned" | "pending"

function stepIcon(status: StepStatus) {
  switch (status) {
    case "done":
    case "approved":
      return <Check className="size-3.5" />
    case "pending":
      return <AlertTriangle className="size-3.5" />
    case "rejected":
      return <X className="size-3.5" />
    case "locked":
    default:
      return <Lock className="size-3.5" />
  }
}

const STEP_ICON_CLASS: Record<StepStatus, string> = {
  done: "bg-muted text-emerald-600",
  approved: "bg-muted text-emerald-600",
  pending: "bg-muted text-amber-600",
  rejected: "bg-muted text-red-600",
  locked: "bg-muted text-muted-foreground",
}

export function Triage() {
  const { lang, t } = useI18n()
  const { account } = useSession()
  const [statTriaged, setStatTriaged] = useState(0)
  const [hitlStates, setHitlStates] = useState<Record<number, StepStatus>>({
    3: "pending",
    4: "locked",
    5: "locked",
  })
  const [auditLog, setAuditLog] = useState<{ time: string; en: string; id: string }[]>([
    { time: "14:07", en: "Alert received — SSH Brute Force classified (AI)", id: "Alert diterima — SSH Brute Force diklasifikasi (AI)" },
    { time: "14:08", en: "Log enrichment complete — no successful logins", id: "Pengayaan log selesai — tidak ada login berhasil" },
    { time: "14:08", en: "HITL gate triggered — awaiting approval for 3 steps", id: "Gate HITL aktif — menunggu persetujuan 3 langkah" },
  ])
  const [queueFilter, setQueueFilter] = useState<QueueFilter>("all")
  const [role, setRole] = useState<"analyst" | "admin" | "compliance">("analyst")

  useEffect(() => {
    let n = 0
    const target = 12
    const interval = setInterval(() => {
      n++
      setStatTriaged(n)
      if (n >= target) clearInterval(interval)
    }, 80)
    return () => clearInterval(interval)
  }, [])

  const now = () =>
    new Date().toLocaleTimeString(lang === "en" ? "en-US" : "id-ID", { hour: "2-digit", minute: "2-digit" })

  const addAudit = (en: string, id: string) => {
    setAuditLog((prev) => [{ time: now(), en, id }, ...prev])
  }

  const approveStep = (n: number) => {
    setHitlStates((prev) => {
      const next = { ...prev, [n]: "approved" as StepStatus }
      if (n < 5) next[n + 1] = "pending"
      return next
    })
    const label = APPROVE_LABELS[n]
    if (label) addAudit(label.en, label.id)
  }

  const rejectStep = (n: number) => {
    setHitlStates((prev) => ({ ...prev, [n]: "rejected" as StepStatus }))
    addAudit(`Step ${n} rejected by analyst`, `Langkah ${n} ditolak oleh analis`)
  }

  const stepStatus = (step: (typeof PLAYBOOK_STEPS)[number]): StepStatus =>
    hitlStates[step.id] ?? step.initialStatus

  const filteredCases = useMemo(() => {
    switch (queueFilter) {
      case "mine":
        return CASE_QUEUE.filter((c) => c.assignedToMe)
      case "unassigned":
        return CASE_QUEUE.filter((c) => !c.assignee)
      case "pending":
        return CASE_QUEUE.filter((c) => c.status === "pending")
      default:
        return CASE_QUEUE
    }
  }, [queueFilter])

  const roleNote = ROLE_VIEW_NOTES[role]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("Incident Response Playbooks", "Playbook Respons Insiden")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          {t(
            "AI-guided containment steps for active incidents — block, isolate, escalate — each requiring your approval before execution.",
            "Langkah penahanan insiden aktif dengan panduan AI — blokir, isolasi, eskalasi — setiap tindakan memerlukan persetujuan Anda sebelum dieksekusi."
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="text-center py-4">
          <CardContent className="p-0">
            <div className="text-2xl font-semibold text-primary">{statTriaged}</div>
            <div className="text-xs text-muted-foreground mt-1">{t("Alerts triaged today", "Alert triase hari ini")}</div>
          </CardContent>
        </Card>
        <Card className="text-center py-4">
          <CardContent className="p-0">
            <div className="text-2xl font-semibold text-primary">94%</div>
            <div className="text-xs text-muted-foreground mt-1">{t("Avg. AI confidence", "Kepercayaan AI rata-rata")}</div>
          </CardContent>
        </Card>
        <Card className="text-center py-4">
          <CardContent className="p-0">
            <div className="text-2xl font-semibold text-primary">82%</div>
            <div className="text-xs text-muted-foreground mt-1">{t("Auto-triage rate (triage only)", "Laju auto-triase (hanya triase)")}</div>
          </CardContent>
        </Card>
        <Card className="text-center py-4">
          <CardContent className="p-0">
            <div className="text-2xl font-semibold text-primary">3</div>
            <div className="text-xs text-muted-foreground mt-1">{t("HITL approvals pending", "Persetujuan HITL tertunda")}</div>
          </CardContent>
        </Card>
      </div>

      {/* Currently triaging strip */}
      <Card className="flex-row items-center gap-3 flex-wrap py-3 px-4">
        <span className="size-2 rounded-full bg-red-600 shrink-0" />
        <span className="text-sm text-muted-foreground">{t("Currently triaging:", "Sedang ditriase:")}</span>
        <span className="text-sm font-medium">SSH Brute Force — ssh.domain.com</span>
        <span className="text-sm text-red-600 font-medium">{t("Critical", "Kritis")}</span>
        <span className="text-xs text-muted-foreground">14:07</span>
        <span className="ml-auto text-sm font-medium text-primary hover:underline cursor-pointer">
          {t("2 more alerts waiting → View Case Queue", "2 alert lain menunggu → Lihat Antrean Kasus")}
        </span>
      </Card>

      <Tabs defaultValue="playbook">
        <TabsList className="gap-2">
          <TabsTrigger value="playbook" className="gap-1.5">
            <ListChecks className="size-4" />
            {t("Active Playbook", "Playbook Aktif")}
          </TabsTrigger>
          <TabsTrigger value="queue" className="gap-1.5">
            <LayoutList className="size-4" />
            {t("Case Queue", "Antrean Kasus")}
          </TabsTrigger>
        </TabsList>

        {/* Playbook tab */}
        <TabsContent value="playbook" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
            <div className="flex flex-col gap-4">
              <Card className="overflow-hidden">
                <CardHeader className="border-b flex-row items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-base">{t("Brute Force Response", "Respons Brute Force")}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      ssh.domain.com · 14:07 WIB · 847 {t("failed attempts", "percobaan gagal")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1" title="5/5 self-consistency votes agree · judge model: PASS">
                      <ShieldCheck className="size-3.5" />
                      {t("Verified 5/5", "Terverifikasi 5/5")}
                    </Badge>
                    <Badge>{t("Active", "Aktif")}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                  {PLAYBOOK_STEPS.map((step) => {
                    const status = stepStatus(step)
                    const locked = status === "locked"
                    return (
                      <div key={step.id} className={`flex items-start gap-3 p-4 ${locked ? "opacity-45" : ""}`}>
                        <div className={`size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${STEP_ICON_CLASS[status]}`}>
                          {stepIcon(status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium mb-1">{t(step.titleEn, step.titleId)}</div>
                          <div className="text-sm text-muted-foreground leading-relaxed">{t(step.descEn, step.descId)}</div>
                          {step.citations && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {step.citations.map((c) => (
                                <CitationChip key={c.label} citation={c} />
                              ))}
                            </div>
                          )}
                          {step.coverageEn && (
                            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1.5">
                              <ShieldCheck className="size-3.5" />
                              {t(step.coverageEn, step.coverageId!)}
                            </div>
                          )}
                          {step.requiresApproval && !locked && (
                            <div className="mt-2.5">
                              {status === "approved" ? (
                                <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                                  <Check className="size-4" />
                                  {t("Approved — executing…", "Disetujui — mengeksekusi…")}
                                </div>
                              ) : status === "rejected" ? (
                                <div className="flex items-center gap-1.5 text-sm text-red-600 font-medium">
                                  <X className="size-4" />
                                  {t("Rejected — manual action required", "Ditolak — tindakan manual diperlukan")}
                                </div>
                              ) : (
                                <Alert className="py-2.5 px-3.5">
                                  <AlertTriangle className="size-4 text-amber-600" />
                                  <AlertTitle className="text-xs font-semibold uppercase tracking-wide">
                                    {t("Human Approval Required", "Persetujuan Manusia Diperlukan")}
                                  </AlertTitle>
                                  <AlertDescription className="text-sm">
                                    {step.id === 3 &&
                                      t(
                                        "This action modifies firewall rules. Review and approve before execution.",
                                        "Tindakan ini memodifikasi aturan firewall. Tinjau dan setujui sebelum eksekusi."
                                      )}
                                    {step.id === 4 &&
                                      t(
                                        "This action modifies SSH configuration. Ensure key-based auth is working before approving.",
                                        "Pastikan autentikasi berbasis kunci berfungsi sebelum menyetujui."
                                      )}
                                    {step.id === 5 &&
                                      t(
                                        "This will send notifications to the on-call team.",
                                        "Ini akan mengirim notifikasi ke tim on-call."
                                      )}
                                    <div className="flex gap-2 mt-2.5">
                                      <Button size="sm" onClick={() => approveStep(step.id)}>
                                        {t("Approve", "Setujui")}
                                      </Button>
                                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => rejectStep(step.id)}>
                                        {t("Reject", "Tolak")}
                                      </Button>
                                    </div>
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {account.tier === "free" && (
                <Alert>
                  <Info className="size-4" />
                  <AlertDescription>
                    {t(
                      "Free tier: view and approve triage steps, but containment actions (isolate, block, revoke) are executed by our team on Sprint/MDR plans.",
                      "Tier gratis: lihat dan setujui langkah triase, tetapi tindakan penahanan (isolasi, blokir, cabut) dieksekusi oleh tim kami di paket Sprint/MDR."
                    )}{" "}
                    <Link to="/pricing" className="font-medium text-primary hover:underline whitespace-nowrap">
                      {t("Learn more →", "Pelajari lebih lanjut →")}
                    </Link>
                  </AlertDescription>
                </Alert>
              )}

              <p className="text-xs text-muted-foreground leading-relaxed pt-3 border-t border-dashed">
                {t(
                  "Approved containment steps hand off to the case-management / SOAR layer for execution and ticketing — this trace only reflects the analyst decision, not direct tool execution.",
                  "Langkah penahanan yang disetujui diserahkan ke lapisan manajemen kasus / SOAR untuk eksekusi dan pencatatan tiket — jejak ini hanya mencerminkan keputusan analis, bukan eksekusi tool secara langsung."
                )}
              </p>
            </div>

            {/* Right column: audit trail */}
            <div className="flex flex-col gap-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t("Audit Trail", "Jejak Audit")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-2">
                    {auditLog.map((entry, i) => (
                      <li key={i} className="flex gap-2.5 text-xs">
                        <span className="text-muted-foreground font-mono shrink-0">{entry.time}</span>
                        <span className="text-foreground/80">{t(entry.en, entry.id)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("This approve/reject flow now extends to every AI agent action in ", "Alur setuju/tolak ini kini diperluas ke setiap tindakan agen AI di ")}
                <Link to="/ai-governance" className="font-semibold text-primary">
                  {t("AI Governance →", "Tata Kelola AI →")}
                </Link>
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Case Queue tab */}
        <TabsContent value="queue" className="flex flex-col gap-4">
          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              {t(
                "Concept preview: a role-gated, multi-case analyst queue (analyst / tenant-admin / compliance views) is planned but not yet built. Rows below are illustrative.",
                "Pratinjau konsep: antrean analis multi-kasus dengan akses berbasis peran (analis / admin-tenant / kepatuhan) sudah direncanakan namun belum dibangun. Baris di bawah bersifat ilustratif."
              )}
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" variant={queueFilter === "all" ? "default" : "outline"} onClick={() => setQueueFilter("all")}>
              {t("All cases", "Semua kasus")}
            </Button>
            <Button size="sm" variant={queueFilter === "mine" ? "default" : "outline"} onClick={() => setQueueFilter("mine")}>
              {t("Assigned to me", "Ditugaskan ke saya")}
            </Button>
            <Button size="sm" variant={queueFilter === "unassigned" ? "default" : "outline"} onClick={() => setQueueFilter("unassigned")}>
              {t("Unassigned", "Belum ditugaskan")}
            </Button>
            <Button size="sm" variant={queueFilter === "pending" ? "default" : "outline"} onClick={() => setQueueFilter("pending")}>
              {t("Pending approval", "Menunggu persetujuan")}
            </Button>
            <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
              <SelectTrigger className="ml-auto w-[220px]" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analyst">{t("Viewing as: Analyst", "Tampilan: Analis")}</SelectItem>
                <SelectItem value="admin">{t("Viewing as: Tenant Admin", "Tampilan: Admin Tenant")}</SelectItem>
                <SelectItem value="compliance">{t("Viewing as: Compliance", "Tampilan: Kepatuhan")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground -mt-2">{roleNote ? t(roleNote.en, roleNote.id) : null}</p>

          <Card className="overflow-hidden py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Case", "Kasus")}</TableHead>
                  <TableHead>{t("Severity", "Keparahan")}</TableHead>
                  <TableHead>{t("Status", "Status")}</TableHead>
                  <TableHead>{t("AI confidence", "Kepercayaan AI")}</TableHead>
                  <TableHead>{t("Assignee", "Ditugaskan ke")}</TableHead>
                  <TableHead>{t("Updated", "Diperbarui")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-medium">{t(c.titleEn, c.titleId)}</div>
                      <div className="text-xs text-muted-foreground font-mono">{c.id}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${SEVERITY_TEXT_CLASS[c.severity]}`}>
                        {t(SEVERITY_LABEL[c.severity].en, SEVERITY_LABEL[c.severity].id)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{t(STATUS_LABEL[c.status].en, STATUS_LABEL[c.status].id)}</Badge>
                    </TableCell>
                    <TableCell>{c.confidence}%</TableCell>
                    <TableCell>
                      {c.assignee ? (
                        <div className="flex items-center gap-1.5 text-sm">
                          <UserCircle className="size-4 text-muted-foreground" />
                          {c.assignee}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground italic">
                          <UserX className="size-4" />
                          {t("Unassigned", "Belum ditugaskan")}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{t(c.updatedEn, c.updatedId)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {t(
              "Role-gated views and citation trail are previewed above; full calibration feedback and cross-tenant case ownership remain a separate planned capability.",
              "Tampilan berbasis peran dan jejak sitasi telah dipratinjau di atas; umpan balik kalibrasi penuh dan kepemilikan kasus lintas tenant masih merupakan kapabilitas terencana terpisah."
            )}
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
