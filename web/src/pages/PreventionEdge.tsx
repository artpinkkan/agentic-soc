import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  ShieldAlert,
  Building2,
  Network,
  ShieldCheck,
  Search,
  RefreshCw,
  Users,
  Key,
  Clock,
  Pencil,
  Trash2,
  ArrowRight,
  Ban,
  Bell,
  Lock,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSession } from "@/lib/session"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  INITIAL_APPS,
  INITIAL_TRAFFIC,
  INITIAL_DLP_RULES,
  STATUS_LABEL,
  AUTH_LABEL,
  ACTION_LABEL,
  DLP_ACTION_LABEL,
  PATTERN_LABEL,
  type PrivateApp,
  type AppStatus,
  type AuthType,
  type InspectionLevel,
  type TrafficAction,
  type DlpRule,
  type DlpAction,
  type PatternType,
  type AppliesTo,
} from "@/lib/prevention-edge-data"

const ACTION_ICON: Record<DlpAction, typeof Ban> = {
  block: Ban,
  inspect: Search,
  alert: Bell,
  mfa: ShieldCheck,
}

const ACTION_BADGE_VARIANT: Record<TrafficAction, "default" | "outline" | "secondary"> = {
  allow: "default",
  block: "outline",
  inspect: "secondary",
}

function usePagedTable<T>(
  data: T[],
  matchesFilter: (row: T, filter: string) => boolean,
  matchesSearch: (row: T, search: string) => boolean
) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(5)

  const filtered = useMemo(() => {
    return data.filter((row) => {
      const okSearch = search === "" || matchesSearch(row, search.toLowerCase())
      const okFilter = filter === "all" || matchesFilter(row, filter)
      return okSearch && okFilter
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, search, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * perPage
  const rows = filtered.slice(start, start + perPage)

  const setFilterReset = (v: string) => {
    setFilter(v)
    setPage(1)
  }
  const setSearchReset = (v: string) => {
    setSearch(v)
    setPage(1)
  }
  const setPerPageReset = (v: number) => {
    setPerPage(v)
    setPage(1)
  }

  return {
    search,
    setSearch: setSearchReset,
    filter,
    setFilter: setFilterReset,
    page: safePage,
    setPage,
    perPage,
    setPerPage: setPerPageReset,
    rows,
    total: filtered.length,
    totalPages,
    start,
    end: Math.min(start + perPage, filtered.length),
  }
}

function Pager({
  page,
  totalPages,
  onPage,
}: {
  page: number
  totalPages: number
  onPage: (n: number) => void
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="size-7"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      >
        <ChevronLeft className="size-3.5" />
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <Button
          key={n}
          variant={n === page ? "default" : "outline"}
          size="icon"
          className="size-7 text-xs"
          onClick={() => onPage(n)}
        >
          {n}
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        className="size-7"
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
      >
        <ChevronRight className="size-3.5" />
      </Button>
    </div>
  )
}

function TableMeta({
  perPage,
  setPerPage,
  start,
  end,
  total,
  page,
  totalPages,
  setPage,
}: {
  perPage: number
  setPerPage: (n: number) => void
  start: number
  end: number
  total: number
  page: number
  totalPages: number
  setPage: (n: number) => void
}) {
  const { t } = useI18n()
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 border-t px-4 py-2.5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{t("Show", "Tampilkan")}</span>
        <Select value={String(perPage)} onValueChange={(v) => setPerPage(+v)}>
          <SelectTrigger size="sm" className="w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
          </SelectContent>
        </Select>
        <span>{t("items", "item")}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          {total === 0 ? 0 : start + 1}–{end} of {total}
        </span>
        <Pager page={page} totalPages={totalPages} onPage={setPage} />
      </div>
    </div>
  )
}

function StatusPicker({
  value,
  onChange,
}: {
  value: AppStatus
  onChange: (v: AppStatus) => void
}) {
  const { t } = useI18n()
  const options: AppStatus[] = ["active", "protected", "reviewing"]
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <Button
          key={o}
          type="button"
          size="sm"
          variant={value === o ? "default" : "outline"}
          className="h-7 text-xs"
          onClick={() => onChange(o)}
        >
          {t(STATUS_LABEL[o].en, STATUS_LABEL[o].id)}
        </Button>
      ))}
    </div>
  )
}

function ActionsPicker({
  value,
  onChange,
}: {
  value: DlpAction[]
  onChange: (v: DlpAction[]) => void
}) {
  const { t } = useI18n()
  const options: DlpAction[] = ["block", "inspect", "alert", "mfa"]
  const toggle = (a: DlpAction) => {
    onChange(value.includes(a) ? value.filter((v) => v !== a) : [...value, a])
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const Icon = ACTION_ICON[o]
        return (
          <Button
            key={o}
            type="button"
            size="sm"
            variant={value.includes(o) ? "default" : "outline"}
            className="h-7 gap-1 text-xs"
            onClick={() => toggle(o)}
          >
            <Icon className="size-3" />
            {t(DLP_ACTION_LABEL[o].en, DLP_ACTION_LABEL[o].id)}
          </Button>
        )
      })}
    </div>
  )
}

interface AppFormState {
  name: string
  domain: string
  groups: string
  auth: AuthType
  inspection: InspectionLevel
  status: AppStatus
}

const EMPTY_APP_FORM: AppFormState = {
  name: "",
  domain: "",
  groups: "",
  auth: "sso",
  inspection: "standard",
  status: "active",
}

interface RuleFormState {
  name: string
  desc: string
  patternType: PatternType
  applies: AppliesTo
  pattern: string
  actions: DlpAction[]
}

const EMPTY_RULE_FORM: RuleFormState = {
  name: "",
  desc: "",
  patternType: "custom_regex",
  applies: "all",
  pattern: "",
  actions: [],
}

export function PreventionEdge() {
  const { lang, t } = useI18n()
  const { account } = useSession()

  const [apps, setApps] = useState<PrivateApp[]>(INITIAL_APPS)
  const [traffic] = useState(INITIAL_TRAFFIC)
  const [dlpRules, setDlpRules] = useState<DlpRule[]>(INITIAL_DLP_RULES)
  const [refreshing, setRefreshing] = useState(false)

  // App modal state
  const [appDialogOpen, setAppDialogOpen] = useState(false)
  const [editingAppId, setEditingAppId] = useState<string | null>(null)
  const [appForm, setAppForm] = useState<AppFormState>(EMPTY_APP_FORM)

  // Rule modal state
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false)
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null)
  const [ruleForm, setRuleForm] = useState<RuleFormState>(EMPTY_RULE_FORM)

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<{ type: "app" | "rule"; id: string } | null>(null)

  const appsTable = usePagedTable(
    apps,
    (row, f) => row.status === f,
    (row, s) => row.name.toLowerCase().includes(s) || row.domain.toLowerCase().includes(s)
  )
  const trafficTable = usePagedTable(
    traffic,
    (row, f) => row.action === f,
    (row, s) =>
      row.user.toLowerCase().includes(s) ||
      row.dest.toLowerCase().includes(s) ||
      row.reasonEn.toLowerCase().includes(s) ||
      row.reasonId.toLowerCase().includes(s)
  )
  const dlpTable = usePagedTable(
    dlpRules,
    (row, f) => row.actions.includes(f as DlpAction),
    (row, s) =>
      row.nameEn.toLowerCase().includes(s) ||
      row.nameId.toLowerCase().includes(s) ||
      row.descEn.toLowerCase().includes(s) ||
      row.descId.toLowerCase().includes(s)
  )

  const doRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 800)
  }

  const openAddApp = () => {
    setEditingAppId(null)
    setAppForm(EMPTY_APP_FORM)
    setAppDialogOpen(true)
  }

  const openEditApp = (app: PrivateApp) => {
    setEditingAppId(app.id)
    setAppForm({
      name: app.name,
      domain: app.domain,
      groups: app.groups,
      auth: app.auth,
      inspection: app.inspection,
      status: app.status,
    })
    setAppDialogOpen(true)
  }

  const saveApp = () => {
    if (!appForm.name.trim() || !appForm.domain.trim()) return
    if (editingAppId) {
      setApps((prev) =>
        prev.map((a) =>
          a.id === editingAppId
            ? {
                ...a,
                name: appForm.name.trim(),
                domain: appForm.domain.trim(),
                groups: appForm.groups.trim(),
                auth: appForm.auth,
                inspection: appForm.inspection,
                status: appForm.status,
              }
            : a
        )
      )
    } else {
      setApps((prev) => [
        ...prev,
        {
          id: `app-${Date.now()}`,
          name: appForm.name.trim(),
          domain: appForm.domain.trim(),
          groups: appForm.groups.trim(),
          users: 0,
          lastAccessEn: "Just now",
          lastAccessId: "Baru saja",
          status: appForm.status,
          auth: appForm.auth,
          inspection: appForm.inspection,
        },
      ])
    }
    setAppDialogOpen(false)
  }

  const openAddRule = () => {
    setEditingRuleId(null)
    setRuleForm(EMPTY_RULE_FORM)
    setRuleDialogOpen(true)
  }

  const openEditRule = (rule: DlpRule) => {
    setEditingRuleId(rule.id)
    setRuleForm({
      name: lang === "en" ? rule.nameEn : rule.nameId,
      desc: lang === "en" ? rule.descEn : rule.descId,
      patternType: rule.patternType,
      applies: rule.applies,
      pattern: rule.pattern ?? "",
      actions: rule.actions,
    })
    setRuleDialogOpen(true)
  }

  const saveRule = () => {
    if (!ruleForm.name.trim() || ruleForm.actions.length === 0) return
    if (editingRuleId) {
      setDlpRules((prev) =>
        prev.map((r) =>
          r.id === editingRuleId
            ? {
                ...r,
                nameEn: ruleForm.name.trim(),
                nameId: ruleForm.name.trim(),
                descEn: ruleForm.desc.trim(),
                descId: ruleForm.desc.trim(),
                actions: ruleForm.actions,
                patternType: ruleForm.patternType,
                applies: ruleForm.applies,
                pattern: ruleForm.pattern.trim() || undefined,
              }
            : r
        )
      )
    } else {
      setDlpRules((prev) => [
        ...prev,
        {
          id: `dlp-${Date.now()}`,
          enabled: true,
          nameEn: ruleForm.name.trim(),
          nameId: ruleForm.name.trim(),
          descEn: ruleForm.desc.trim(),
          descId: ruleForm.desc.trim(),
          actions: ruleForm.actions,
          patternType: ruleForm.patternType,
          applies: ruleForm.applies,
          pattern: ruleForm.pattern.trim() || undefined,
        },
      ])
    }
    setRuleDialogOpen(false)
  }

  const toggleRuleEnabled = (id: string, enabled: boolean) => {
    setDlpRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled } : r)))
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    if (deleteTarget.type === "app") {
      setApps((prev) => prev.filter((a) => a.id !== deleteTarget.id))
    } else {
      setDlpRules((prev) => prev.filter((r) => r.id !== deleteTarget.id))
    }
    setDeleteTarget(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground mb-2">
          <ShieldAlert className="size-3" />
          {t("SSE · Secure Service Edge", "SSE · Secure Service Edge")}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("Prevention Edge", "Edge Pencegahan")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          {t(
            "Zero Trust access control, real-time traffic inspection and data loss prevention — all enforced at the network edge.",
            "Kontrol akses Zero Trust, inspeksi lalu lintas real-time dan pencegahan kebocoran data — semua ditegakkan di edge jaringan."
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="text-center py-4">
          <CardContent className="p-0">
            <div className="text-2xl font-semibold text-primary">{apps.length}</div>
            <div className="text-xs text-muted-foreground mt-1">{t("Private apps connected", "Aplikasi privat terhubung")}</div>
          </CardContent>
        </Card>
        <Card className="text-center py-4">
          <CardContent className="p-0">
            <div className="text-2xl font-semibold text-primary">90</div>
            <div className="text-xs text-muted-foreground mt-1">{t("Active users", "Pengguna aktif")}</div>
          </CardContent>
        </Card>
        <Card className="text-center py-4">
          <CardContent className="p-0">
            <div className="text-2xl font-semibold text-red-600">3</div>
            <div className="text-xs text-muted-foreground mt-1">{t("Blocked threats today", "Ancaman diblokir hari ini")}</div>
          </CardContent>
        </Card>
        <Card className="text-center py-4">
          <CardContent className="p-0">
            <div className="text-2xl font-semibold text-amber-600">2</div>
            <div className="text-xs text-muted-foreground mt-1">{t("DLP violations today", "Pelanggaran DLP hari ini")}</div>
          </CardContent>
        </Card>
        <Card className="text-center py-4">
          <CardContent className="p-0">
            <div className="text-2xl font-semibold text-primary">{dlpRules.length}</div>
            <div className="text-xs text-muted-foreground mt-1">{t("DLP rules active", "Aturan DLP aktif")}</div>
          </CardContent>
        </Card>
      </div>

      {account.tier !== "mdr_ai" && (
        <Alert>
          <Lock className="size-4" />
          <AlertTitle>{t("Available on MDR AI plan", "Tersedia di paket MDR AI")}</AlertTitle>
          <AlertDescription>
            {t(
              "Prevention Edge requires MDR AI — full ZTNA, inline DPI and data loss prevention with AI-assisted policy enforcement. This preview is fully interactive for evaluation.",
              "Prevention Edge memerlukan MDR AI — ZTNA penuh, DPI inline, dan pencegahan kebocoran data dengan penegakan kebijakan berbantuan AI. Pratinjau ini sepenuhnya interaktif untuk evaluasi."
            )}{" "}
            <Link to="/pricing" className="font-medium text-primary hover:underline whitespace-nowrap">
              {t("Upgrade to MDR AI →", "Upgrade ke MDR AI →")}
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="apps">
        <TabsList className="gap-2">
          <TabsTrigger value="apps" className="gap-1.5">
            <Building2 className="size-4" />
            {t("Private App Access", "Akses Aplikasi Privat")}
          </TabsTrigger>
          <TabsTrigger value="traffic" className="gap-1.5">
            <Network className="size-4" />
            {t("Inline Traffic Inspection", "Inspeksi Lalu Lintas Inline")}
          </TabsTrigger>
          <TabsTrigger value="dlp" className="gap-1.5">
            <ShieldAlert className="size-4" />
            {t("Data Loss Prevention", "Pencegahan Kebocoran Data")}
          </TabsTrigger>
        </TabsList>

        {/* ── Private App Access ────────────────────────────────────────── */}
        <TabsContent value="apps" className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-muted-foreground max-w-2xl">
              {t(
                "Identity-based Zero Trust Network Access (ZTNA) — users connect to private applications without exposing them to the public internet.",
                "Akses jaringan Zero Trust (ZTNA) berbasis identitas — pengguna terhubung ke aplikasi privat tanpa mengeksposnya ke internet publik."
              )}
            </p>
            <Button size="sm" className="gap-1 shrink-0" onClick={openAddApp}>
              <Plus className="size-4" />
              {t("Add App", "Tambah Aplikasi")}
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                className="pl-8 h-9"
                placeholder={t("Search apps…", "Cari aplikasi…")}
                value={appsTable.search}
                onChange={(e) => appsTable.setSearch(e.target.value)}
              />
            </div>
            <Select value={appsTable.filter} onValueChange={appsTable.setFilter}>
              <SelectTrigger size="sm" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All Status", "Semua Status")}</SelectItem>
                <SelectItem value="active">{t("Active", "Aktif")}</SelectItem>
                <SelectItem value="protected">{t("Protected", "Dilindungi")}</SelectItem>
                <SelectItem value="reviewing">{t("Reviewing", "Ditinjau")}</SelectItem>
              </SelectContent>
            </Select>
            <span className="ml-auto text-xs text-muted-foreground">
              {appsTable.total} {t("apps found", "aplikasi ditemukan")}
            </span>
          </div>

          <Card className="py-0 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
              {appsTable.rows.map((app) => {
                const initials = app.name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0] ?? "")
                  .join("")
                  .toUpperCase()
                return (
                  <div key={app.id} className="flex items-start gap-3 bg-card p-4">
                    <div className="size-9 rounded-full flex items-center justify-center text-xs font-semibold bg-muted text-foreground shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">{app.name}</span>
                        <Badge
                          variant={app.status === "active" ? "default" : app.status === "protected" ? "secondary" : "outline"}
                          className="text-[10px] shrink-0"
                        >
                          {t(STATUS_LABEL[app.status].en, STATUS_LABEL[app.status].id)}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono truncate">{app.domain}</div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <Users className="size-3" /> {app.users}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Key className="size-3" /> {AUTH_LABEL[app.auth]}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3" /> {t(app.lastAccessEn, app.lastAccessId)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => openEditApp(app)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-red-600 hover:text-red-600"
                        onClick={() => setDeleteTarget({ type: "app", id: app.id })}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                )
              })}
              {appsTable.rows.length === 0 && (
                <div className="col-span-full py-10 text-center text-sm text-muted-foreground bg-card">
                  {t("No apps match your filters.", "Tidak ada aplikasi yang cocok dengan filter.")}
                </div>
              )}
            </div>
            <TableMeta
              perPage={appsTable.perPage}
              setPerPage={appsTable.setPerPage}
              start={appsTable.start}
              end={appsTable.end}
              total={appsTable.total}
              page={appsTable.page}
              totalPages={appsTable.totalPages}
              setPage={appsTable.setPage}
            />
          </Card>
        </TabsContent>

        {/* ── Inline Traffic Inspection ─────────────────────────────────── */}
        <TabsContent value="traffic" className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-muted-foreground max-w-2xl">
              {t(
                "Real-time log of all proxied sessions — every connection is inspected for threats, DLP violations and anomalous behaviour.",
                "Log real-time semua sesi yang diproxy — setiap koneksi diperiksa untuk ancaman, pelanggaran DLP, dan perilaku anomali."
              )}
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-600" />
                {t("Live", "Langsung")}
              </span>
              <Button size="sm" variant="outline" className="gap-1" disabled={refreshing} onClick={doRefresh}>
                <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
                {t("Refresh", "Segarkan")}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                className="pl-8 h-9"
                placeholder={t("Search log…", "Cari log…")}
                value={trafficTable.search}
                onChange={(e) => trafficTable.setSearch(e.target.value)}
              />
            </div>
            <Select value={trafficTable.filter} onValueChange={trafficTable.setFilter}>
              <SelectTrigger size="sm" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All Actions", "Semua Tindakan")}</SelectItem>
                <SelectItem value="allow">{t("Allow", "Izinkan")}</SelectItem>
                <SelectItem value="block">{t("Block", "Blokir")}</SelectItem>
                <SelectItem value="inspect">{t("Inspect", "Periksa")}</SelectItem>
              </SelectContent>
            </Select>
            <span className="ml-auto text-xs text-muted-foreground">
              {trafficTable.total} {t("entries found", "entri ditemukan")}
            </span>
          </div>

          <Card className="py-0 overflow-hidden">
            <div className="divide-y">
              {trafficTable.rows.map((row) => (
                <div key={row.id} className="flex items-center gap-3 p-3 text-sm flex-wrap">
                  <span
                    className={`size-1.5 rounded-full shrink-0 ${
                      row.action === "block" ? "bg-red-600" : row.action === "inspect" ? "bg-amber-500" : "bg-emerald-600"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground font-mono shrink-0">{row.time}</span>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-xs truncate">{row.user}</span>
                    <ArrowRight className="size-3 text-muted-foreground shrink-0" />
                    <span className="font-mono text-xs truncate">{row.dest}</span>
                  </div>
                  <Badge variant={ACTION_BADGE_VARIANT[row.action]} className="text-[10px] shrink-0">
                    {t(ACTION_LABEL[row.action].en, ACTION_LABEL[row.action].id)}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {t(row.reasonEn, row.reasonId)}
                  </span>
                </div>
              ))}
              {trafficTable.rows.length === 0 && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  {t("No entries match your filters.", "Tidak ada entri yang cocok dengan filter.")}
                </div>
              )}
            </div>
            <TableMeta
              perPage={trafficTable.perPage}
              setPerPage={trafficTable.setPerPage}
              start={trafficTable.start}
              end={trafficTable.end}
              total={trafficTable.total}
              page={trafficTable.page}
              totalPages={trafficTable.totalPages}
              setPage={trafficTable.setPage}
            />
          </Card>
        </TabsContent>

        {/* ── Data Loss Prevention ──────────────────────────────────────── */}
        <TabsContent value="dlp" className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-muted-foreground max-w-2xl">
              {t(
                "Policy rules are enforced inline — violations are blocked or flagged in real time before data leaves the perimeter.",
                "Aturan kebijakan ditegakkan secara inline — pelanggaran diblokir atau ditandai secara real-time sebelum data keluar dari perimeter."
              )}
            </p>
            <Button size="sm" className="gap-1 shrink-0" onClick={openAddRule}>
              <Plus className="size-4" />
              {t("Add Rule", "Tambah Aturan")}
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                className="pl-8 h-9"
                placeholder={t("Search rules…", "Cari aturan…")}
                value={dlpTable.search}
                onChange={(e) => dlpTable.setSearch(e.target.value)}
              />
            </div>
            <Select value={dlpTable.filter} onValueChange={dlpTable.setFilter}>
              <SelectTrigger size="sm" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All Actions", "Semua Tindakan")}</SelectItem>
                <SelectItem value="block">{t("Block", "Blokir")}</SelectItem>
                <SelectItem value="inspect">{t("Inspect", "Periksa")}</SelectItem>
                <SelectItem value="alert">{t("Alert", "Peringatan")}</SelectItem>
                <SelectItem value="mfa">{t("Require MFA", "Wajib MFA")}</SelectItem>
              </SelectContent>
            </Select>
            <span className="ml-auto text-xs text-muted-foreground">
              {dlpTable.total} {t("rules found", "aturan ditemukan")}
            </span>
          </div>

          <Card className="py-0 overflow-hidden">
            <div className="divide-y">
              {dlpTable.rows.map((rule) => (
                <div
                  key={rule.id}
                  className={`flex items-start gap-3 p-4 ${!rule.enabled ? "opacity-50" : ""}`}
                >
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(v) => toggleRuleEnabled(rule.id, v)}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium flex items-center gap-2 flex-wrap">
                      {t(rule.nameEn, rule.nameId)}
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {PATTERN_LABEL[rule.patternType]}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">{t(rule.descEn, rule.descId)}</div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {rule.actions.map((a) => {
                        const Icon = ACTION_ICON[a]
                        return (
                          <span
                            key={a}
                            className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                          >
                            <Icon className="size-3" />
                            {t(DLP_ACTION_LABEL[a].en, DLP_ACTION_LABEL[a].id)}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => openEditRule(rule)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-red-600 hover:text-red-600"
                      onClick={() => setDeleteTarget({ type: "rule", id: rule.id })}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
              {dlpTable.rows.length === 0 && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  {t("No rules match your filters.", "Tidak ada aturan yang cocok dengan filter.")}
                </div>
              )}
            </div>
            <TableMeta
              perPage={dlpTable.perPage}
              setPerPage={dlpTable.setPerPage}
              start={dlpTable.start}
              end={dlpTable.end}
              total={dlpTable.total}
              page={dlpTable.page}
              totalPages={dlpTable.totalPages}
              setPage={dlpTable.setPage}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Add / Edit App dialog ──────────────────────────────────────── */}
      <Dialog open={appDialogOpen} onOpenChange={setAppDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAppId ? t("Edit App", "Edit Aplikasi") : t("Add App", "Tambah Aplikasi")}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>
                {t("App Name", "Nama Aplikasi")} <span className="text-red-600">*</span>
              </Label>
              <Input
                placeholder="e.g. Finance Dashboard"
                value={appForm.name}
                onChange={(e) => setAppForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>
                {t("Internal URL / Domain", "URL / Domain Internal")} <span className="text-red-600">*</span>
              </Label>
              <Input
                placeholder="e.g. finance.internal.corp"
                value={appForm.domain}
                onChange={(e) => setAppForm((f) => ({ ...f, domain: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("Access Groups", "Grup Akses")}</Label>
              <Input
                placeholder="e.g. finance-team, admin"
                value={appForm.groups}
                onChange={(e) => setAppForm((f) => ({ ...f, groups: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                {t("Comma-separated group names", "Nama grup dipisahkan koma")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>{t("Authentication", "Autentikasi")}</Label>
                <Select value={appForm.auth} onValueChange={(v) => setAppForm((f) => ({ ...f, auth: v as AuthType }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sso">{t("SSO Only", "SSO Saja")}</SelectItem>
                    <SelectItem value="sso_mfa">{t("SSO + MFA Required", "SSO + MFA Wajib")}</SelectItem>
                    <SelectItem value="cert">{t("Certificate", "Sertifikat")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t("Inspection Level", "Level Inspeksi")}</Label>
                <Select
                  value={appForm.inspection}
                  onValueChange={(v) => setAppForm((f) => ({ ...f, inspection: v as InspectionLevel }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">{t("Standard", "Standar")}</SelectItem>
                    <SelectItem value="dpi">{t("Deep Packet Inspection", "Inspeksi Paket Dalam")}</SelectItem>
                    <SelectItem value="bypass">{t("Bypass", "Lewati")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("Status", "Status")}</Label>
              <StatusPicker value={appForm.status} onChange={(v) => setAppForm((f) => ({ ...f, status: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAppDialogOpen(false)}>
              {t("Cancel", "Batal")}
            </Button>
            <Button onClick={saveApp} disabled={!appForm.name.trim() || !appForm.domain.trim()}>
              {editingAppId ? t("Save Changes", "Simpan Perubahan") : t("Add App", "Tambah Aplikasi")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Add / Edit DLP rule dialog ─────────────────────────────────── */}
      <Dialog open={ruleDialogOpen} onOpenChange={setRuleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRuleId ? t("Edit Rule", "Edit Aturan") : t("Add DLP Rule", "Tambah Aturan DLP")}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>
                {t("Rule Name", "Nama Aturan")} <span className="text-red-600">*</span>
              </Label>
              <Input
                placeholder="e.g. Block PAN data exfiltration"
                value={ruleForm.name}
                onChange={(e) => setRuleForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("Description", "Deskripsi")}</Label>
              <Textarea
                placeholder={t("Describe what this rule does…", "Jelaskan fungsi aturan ini…")}
                value={ruleForm.desc}
                onChange={(e) => setRuleForm((f) => ({ ...f, desc: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>{t("Pattern Type", "Tipe Pola")}</Label>
                <Select
                  value={ruleForm.patternType}
                  onValueChange={(v) => setRuleForm((f) => ({ ...f, patternType: v as PatternType }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom_regex">{t("Custom Regex", "Regex Kustom")}</SelectItem>
                    <SelectItem value="pan">{t("Credit Card (PAN)", "Kartu Kredit (PAN)")}</SelectItem>
                    <SelectItem value="large_file">{t("Large File Transfer", "Transfer File Besar")}</SelectItem>
                    <SelectItem value="keyword">{t("Keyword Match", "Pencocokan Kata Kunci")}</SelectItem>
                    <SelectItem value="extension">{t("File Extension", "Ekstensi File")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t("Applies To", "Berlaku Untuk")}</Label>
                <Select
                  value={ruleForm.applies}
                  onValueChange={(v) => setRuleForm((f) => ({ ...f, applies: v as AppliesTo }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("All Traffic", "Semua Lalu Lintas")}</SelectItem>
                    <SelectItem value="specific">{t("Specific Apps", "Aplikasi Tertentu")}</SelectItem>
                    <SelectItem value="outbound">{t("Outbound Only", "Hanya Keluar")}</SelectItem>
                    <SelectItem value="inbound">{t("Inbound Only", "Hanya Masuk")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {ruleForm.patternType === "custom_regex" && (
              <div className="flex flex-col gap-1.5">
                <Label>{t("Custom Pattern", "Pola Kustom")}</Label>
                <Input
                  placeholder="e.g. \d{16}"
                  value={ruleForm.pattern}
                  onChange={(e) => setRuleForm((f) => ({ ...f, pattern: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  {t("Regular expression pattern", "Pola ekspresi reguler")}
                </p>
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <Label>{t("Action (select all that apply)", "Tindakan (pilih yang berlaku)")}</Label>
              <ActionsPicker value={ruleForm.actions} onChange={(v) => setRuleForm((f) => ({ ...f, actions: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRuleDialogOpen(false)}>
              {t("Cancel", "Batal")}
            </Button>
            <Button onClick={saveRule} disabled={!ruleForm.name.trim() || ruleForm.actions.length === 0}>
              {editingRuleId ? t("Save Changes", "Simpan Perubahan") : t("Add Rule", "Tambah Aturan")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation ────────────────────────────────────────── */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="size-4 text-red-600" />
              {t("Delete", "Hapus")}
            </DialogTitle>
            <DialogDescription>
              {t("This action cannot be undone.", "Tindakan ini tidak dapat dibatalkan.")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              {t("Cancel", "Batal")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("Delete", "Hapus")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
