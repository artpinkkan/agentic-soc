import { useMemo, useState, type ReactNode } from "react"
import {
  Info,
  MessageSquareWarning,
  Wrench,
  Check,
  AlertTriangle,
  Clock,
  Lock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"
import { useSession } from "@/lib/session"
import {
  RESPONSE_TRACES,
  RAW_PROMPT_LOG,
  AGENT_ACTIONS,
  AUDIT_CHAIN,
  KG_NODE_STYLES,
} from "@/lib/inspector-data"

export function Inspector() {
  const { t } = useI18n()
  const { account } = useSession()
  const [responseId, setResponseId] = useState("1")

  const trace = useMemo(
    () => RESPONSE_TRACES.find((r) => r.id === responseId) ?? RESPONSE_TRACES[0],
    [responseId]
  )

  return (
    <div className="flex flex-col gap-6">
      {account.tier === "free" && (
        <Alert>
          <Info className="size-4" />
          <AlertDescription>
            {t(
              "Free tier uses shared inference pool (rate-limited). Upgrade to MDR for dedicated capacity and tenant-private GraphRAG context.",
              "Tier gratis menggunakan pool inferensi bersama (dibatasi). Upgrade ke MDR untuk kapasitas dedicated dan konteks GraphRAG privat per tenant."
            )}{" "}
            <a href="/pricing" className="font-medium text-primary hover:underline whitespace-nowrap">
              {t("Learn more →", "Pelajari lebih →")}
            </a>
          </AlertDescription>
        </Alert>
      )}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("AI Inspector", "Inspektor AI")}</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          {t(
            "Per-response trace: which model answered, what was retrieved, which guardrails fired.",
            "Jejak per-respons: model mana yang menjawab, apa yang diambil, guardrail mana yang aktif."
          )}
        </p>
      </div>

      <Tabs defaultValue="response">
        <TabsList>
          <TabsTrigger value="response" className="gap-1.5">
            <MessageSquareWarning className="size-4" />
            {t("Response Trace", "Jejak Respons")}
          </TabsTrigger>
          <TabsTrigger value="actions" className="gap-1.5">
            <Wrench className="size-4" />
            {t("Agent Actions", "Tindakan Agen")}
          </TabsTrigger>
        </TabsList>

        {/* Response Trace tab */}
        <TabsContent value="response" className="flex flex-col gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-sm text-muted-foreground" htmlFor="resp-select">
              {t("Inspect response:", "Periksa respons:")}
            </label>
            <Select value={responseId} onValueChange={setResponseId}>
              <SelectTrigger id="resp-select" className="w-full sm:w-[420px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESPONSE_TRACES.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {t(r.labelEn, r.labelId)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Trace card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("Response Trace", "Jejak Respons")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                <TraceRow label={t("Model", "Model")} value={trace.model} mono />
                <TraceRow label={t("Timestamp", "Stempel waktu")} value={trace.ts} mono />
                <TraceRow
                  label={t("Routing reason", "Alasan routing")}
                  value={t(trace.routingEn, trace.routingId)}
                  mono
                />
                <TraceRow label={t("Latency", "Latensi")} value={trace.latency} mono />
                <TraceRow label={t("Confidence", "Kepercayaan")} value={trace.confidence} mono />
                <TraceRow
                  label={t("Human review", "Tinjauan manusia")}
                  value={
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 font-mono text-xs",
                        trace.hitlRequired ? "text-amber-600" : "text-emerald-600"
                      )}
                    >
                      {trace.hitlRequired ? (
                        <AlertTriangle className="size-3.5" />
                      ) : (
                        <Check className="size-3.5" />
                      )}
                      {trace.hitlRequired ? t("Required", "Diperlukan") : t("Not required", "Tidak diperlukan")}
                    </span>
                  }
                />
                <TraceRow label={t("Tenant", "Tenant")} value="tenant-unknown" mono />
              </CardContent>
            </Card>

            {/* Guardrail table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("Guardrail Checks", "Pemeriksaan Guardrail")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("Layer", "Lapisan")}</TableHead>
                      <TableHead>{t("Check", "Pemeriksaan")}</TableHead>
                      <TableHead>{t("Status", "Status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trace.guardrails.map((g, i) => (
                      <TableRow key={i}>
                        <TableCell>{t(g.layerEn, g.layerId)}</TableCell>
                        <TableCell className="text-muted-foreground">{t(g.checkEn, g.checkId)}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-xs font-medium",
                              g.status === "pass" ? "text-emerald-600" : "text-amber-600"
                            )}
                          >
                            {g.status === "pass" ? (
                              <Check className="size-3.5" />
                            ) : (
                              <AlertTriangle className="size-3.5" />
                            )}
                            {g.status === "pass" ? "PASS" : "FLAG"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t(
                    "These 4 layers inspect model responses. The platform direction extends the same discipline to every agent tool call — a per-action policy engine, not just response guardrails.",
                    "Keempat lapisan ini memeriksa respons model. Arah platform memperluas disiplin yang sama ke setiap panggilan tool agen — mesin kebijakan per tindakan, bukan hanya guardrail respons."
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Knowledge graph nodes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("Knowledge Sources Retrieved", "Sumber Pengetahuan yang Diambil")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trace.nodes.map((n, i) => {
                  const Icon = KG_NODE_STYLES[n.kind].icon
                  return (
                    <Badge key={i} variant="outline" className="gap-1.5 text-xs">
                      <Icon className="size-3.5" />
                      {n.label}
                    </Badge>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Raw prompt log */}
          <details className="rounded-lg border bg-muted/30 text-xs font-mono leading-relaxed">
            <summary className="cursor-pointer select-none px-4 py-2.5 text-sm font-sans font-medium text-primary">
              {t("Raw prompt log (metadata only)", "Log prompt mentah (hanya metadata)")}
            </summary>
            <div className="px-4 pb-4 overflow-x-auto">
              <table className="w-full mb-3">
                <tbody>
                  {RAW_PROMPT_LOG.map(([k, v]) => (
                    <tr key={k}>
                      <td className="pr-3 py-0.5 text-muted-foreground align-top whitespace-nowrap">{k}</td>
                      <td className="py-0.5">{k === "tenant_id" ? "tenant-unknown" : v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-muted-foreground">
                [{t(
                  "Prompt content not stored — metadata-only log per tenant privacy policy",
                  "Konten prompt tidak disimpan — log hanya metadata sesuai kebijakan privasi tenant"
                )}]
              </p>
            </div>
          </details>
        </TabsContent>

        {/* Agent Actions tab */}
        <TabsContent value="actions" className="flex flex-col gap-4">
          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              {t(
                "Concept preview: the Agentic Gateway (per-action tool-call authorization, blast-radius capping, tamper-evident audit chain) is planned but not yet built. Rows below are illustrative.",
                "Pratinjau konsep: Agentic Gateway (otorisasi panggilan tool per-tindakan, batas blast-radius, rantai audit tahan-tamper) sudah direncanakan namun belum dibangun. Baris di bawah bersifat ilustratif."
              )}
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("Tool-Call Trace", "Jejak Panggilan Tool")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Time", "Waktu")}</TableHead>
                    <TableHead>{t("Tool / Action", "Tool / Tindakan")}</TableHead>
                    <TableHead>{t("Scope requested", "Cakupan diminta")}</TableHead>
                    <TableHead>{t("Registry check", "Pemeriksaan registry")}</TableHead>
                    <TableHead>{t("Blast radius", "Blast radius")}</TableHead>
                    <TableHead>{t("Status", "Status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {AGENT_ACTIONS.map((a, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{a.time}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted rounded px-1.5 py-0.5">{a.tool}</code>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{t(a.scopeEn, a.scopeId)}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <Check className="size-3.5" />
                          {a.registryCheck}
                        </span>
                      </TableCell>
                      <TableCell>{t(a.blastRadiusEn, a.blastRadiusId)}</TableCell>
                      <TableCell>
                        {a.status === "pending" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 whitespace-nowrap">
                            <AlertTriangle className="size-3.5" />
                            {t("PENDING REVIEW", "MENUNGGU TINJAUAN")}
                          </span>
                        ) : a.status === "allowed-auto" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 whitespace-nowrap">
                            <Check className="size-3.5" />
                            {t("ALLOWED (auto)", "DIIZINKAN (otomatis)")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 whitespace-nowrap">
                            <Check className="size-3.5" />
                            ALLOWED
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t(
                  "Blast radius above threshold routes to the human-review queue instead of auto-executing — 1 action pending below.",
                  "Blast radius di atas ambang batas dialihkan ke antrean tinjauan manusia, bukan dieksekusi otomatis — 1 tindakan menunggu di bawah."
                )}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("Pending Human Review", "Menunggu Tinjauan Manusia")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                <span className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-amber-600">
                  <AlertTriangle className="size-3.5" />
                  {t("1 action awaiting approval", "1 tindakan menunggu persetujuan")}
                </span>
                <div className="mt-3 flex flex-col">
                  <TraceRow label={t("Action", "Tindakan")} value="isolate_host(ip=10.2.4.17)" mono />
                  <TraceRow label={t("Requested by", "Diminta oleh")} value="agent-triage-01" mono />
                  <TraceRow
                    label={t("Reason", "Alasan")}
                    value={t(
                      "Blast radius exceeds auto-approve threshold",
                      "Blast radius melebihi ambang auto-approve"
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("Audit Chain", "Rantai Audit")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col font-mono text-xs">
                  {AUDIT_CHAIN.map((link, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center gap-2.5 py-2",
                        i < AUDIT_CHAIN.length - 1 && "border-b"
                      )}
                    >
                      <span className="text-foreground/80">{link.from}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className={link.to ? "text-foreground/80" : "text-muted-foreground italic"}>
                        {link.to || `(${t("pending — awaiting review action", "menunggu — tindakan belum selesai ditinjau")})`}
                      </span>
                      <span
                        className={cn(
                          "ml-auto inline-flex items-center gap-1 font-medium",
                          link.sealed ? "text-emerald-600" : "text-amber-600"
                        )}
                      >
                        {link.sealed ? <Lock className="size-3.5" /> : <Clock className="size-3.5" />}
                        {link.sealed ? t("signed", "ditandatangani") : t("unsealed", "belum disegel")}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t(
                    "Hash-chained, per-tenant, tamper-evident — each entry signs the previous. Anomalies feed a detector that can trigger review, never auto-remediation.",
                    "Berantai hash, per-tenant, tahan-tamper — setiap entri menandatangani entri sebelumnya. Anomali diumpankan ke detektor yang dapat memicu tinjauan, tidak pernah remediasi otomatis."
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TraceRow({
  label,
  value,
  mono,
}: {
  label: string
  value: ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex justify-between items-start gap-2 py-1.5 text-sm border-b last:border-b-0">
      <span className="text-muted-foreground shrink-0 min-w-[110px]">{label}</span>
      <span className={cn("text-right", mono && "font-mono text-xs")}>{value}</span>
    </div>
  )
}
