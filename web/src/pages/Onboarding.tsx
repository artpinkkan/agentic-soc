import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ShieldCheck,
  Check,
  ArrowLeft,
  Lock,
  AlertTriangle,
  FolderOpen,
  CircleCheck,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useI18n } from "@/lib/i18n"
import {
  FUNNEL_META,
  INCIDENT_TYPES,
  SERVICE_OPTIONS,
  type Funnel,
} from "@/lib/onboarding-data"

const STEP_LABELS = [
  { en: "Service", id: "Layanan" },
  { en: "Setup", id: "Pengaturan" },
  { en: "Connect", id: "Sambungkan" },
  { en: "Scan", id: "Pindai" },
]


export function Onboarding() {
  const { t } = useI18n()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [funnel, setFunnel] = useState<Funnel | null>(null)

  // Step 2 form state
  const [domain, setDomain] = useState("")
  const [mailDomain, setMailDomain] = useState("")
  const [provider, setProvider] = useState<"google" | "microsoft" | null>(null)
  const [incidentDate, setIncidentDate] = useState("")
  const [incidentType, setIncidentType] = useState<string | null>(null)
  const [affectedSystems, setAffectedSystems] = useState("")

  // Step 3 state
  const [epCount, setEpCount] = useState(0)
  const [oauthProvider, setOauthProvider] = useState<"google" | "microsoft" | null>(null)

  // Step 4 scan state
  const [scanDone, setScanDone] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const meta = funnel ? FUNNEL_META[funnel] : null

  const goStep = (n: number) => {
    setStep(n)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const selectAndStart = (f: Funnel) => {
    setFunnel(f)
    goStep(2)
  }

  // Scan animation
  useEffect(() => {
    if (step !== 4 || !meta) return
    setScanDone(false)
    setScanProgress(0)
    let idx = 0
    const total = meta.scan.items.length
    timerRef.current = setInterval(() => {
      idx++
      setScanProgress(idx)
      if (idx >= total) {
        if (timerRef.current) clearInterval(timerRef.current)
        setTimeout(() => setScanDone(true), 400)
      }
    }, 380)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, funnel])

  const pct = meta ? Math.round((scanProgress / meta.scan.items.length) * 100) : 0
  const circumference = 213.6
  const dashOffset = circumference - (circumference * pct) / 100

  const handleViewReport = () => {
    try {
      const sess = JSON.parse(sessionStorage.getItem("ss-session") || "{}")
      sess.setupComplete = true
      sess.funnel = funnel
      sessionStorage.setItem("ss-session", JSON.stringify(sess))
    } catch {
      // ignore
    }
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3.5 border-b bg-background sticky top-0 z-10">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-primary">
          <ShieldCheck className="size-5" />
          Shannon Sentinel
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">SS</span>
        </div>
      </header>

      <div className="px-6 py-8">
        {/* Step indicator */}
        <div className="flex items-start justify-center max-w-xl mx-auto mb-10">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1
            const active = n === step
            const done = n < step
            return (
              <div key={n} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div
                    className={`size-9 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${
                      active
                        ? "bg-primary border-primary text-primary-foreground ring-4 ring-primary/15"
                        : done
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground bg-background"
                    }`}
                  >
                    {done ? <Check className="size-4" /> : n}
                  </div>
                  <span
                    className={`text-[11px] whitespace-nowrap font-medium ${
                      active ? "text-foreground font-bold" : done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {t(label.en, label.id)}
                  </span>
                </div>
                {n < STEP_LABELS.length && (
                  <div className="flex-1 h-9 flex items-center mx-2">
                    <div className={`h-0.5 w-full rounded-full ${done ? "bg-primary" : "bg-muted-foreground/20"}`} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Step 1: Service selection */}
        {step === 1 && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 max-w-md mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                {t("What would you like to check first?", "Apa yang ingin Anda periksa terlebih dahulu?")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("Choose a starting point. You can run more services later.", "Pilih titik awal. Anda bisa menjalankan layanan lain nanti.")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SERVICE_OPTIONS.map((svc) => {
                const Icon = svc.icon
                const selected = funnel === svc.key
                return (
                  <Card
                    key={svc.key}
                    role="button"
                    tabIndex={0}
                    onClick={() => setFunnel(svc.key)}
                    className={`relative flex flex-col gap-3 p-5 cursor-pointer transition-colors hover:border-primary/50 ${
                      selected ? "ring-2 ring-primary border-primary/50" : ""
                    }`}
                  >
                    {svc.popular && (
                      <Badge className="absolute top-3 right-3">
                        {t("Most popular", "Paling populer")}
                      </Badge>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-lg flex items-center justify-center shrink-0 bg-muted">
                        <Icon className="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                          {t(svc.labelEn, svc.labelId)}
                        </span>
                        <p className="text-base font-bold leading-tight">{t(svc.nameEn, svc.nameId)}</p>
                      </div>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{t(svc.descEn, svc.descId)}</p>
                    <div className="border-t" />
                    <ul className="flex flex-col gap-1.5 flex-1">
                      {svc.checks.map((c) => (
                        <li key={c.en} className="text-xs flex items-start gap-1.5">
                          <Check className="size-3.5 shrink-0 mt-0.5 text-muted-foreground" />
                          <span>{t(c.en, c.id)}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-muted-foreground bg-muted rounded-md px-2.5 py-1.5 leading-snug">
                      {t(svc.useCaseEn, svc.useCaseId)}
                    </p>
                    <Button
                      variant={selected ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation()
                        selectAndStart(svc.key)
                      }}
                    >
                      {t(svc.ctaEn, svc.ctaId)}
                    </Button>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: Context setup */}
        {step === 2 && meta && funnel && (
          <div className="max-w-xl mx-auto">
            <Card className="p-6">
              <CardContent className="p-0 flex flex-col gap-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">{t(meta.step2.h2.en, meta.step2.h2.id)}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(meta.step2.sub.en, meta.step2.sub.id)}</p>
                </div>

                {funnel === "xray" && (
                  <div className="flex flex-col gap-1.5">
                    <Label>{t("Company domain", "Domain perusahaan")}</Label>
                    <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="perusahaan.com" />
                  </div>
                )}

                {funnel === "inbox" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <Label>{t("Work email domain", "Domain email kerja")}</Label>
                      <Input value={mailDomain} onChange={(e) => setMailDomain(e.target.value)} placeholder="perusahaan.com" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>{t("Mail provider", "Penyedia email")}</Label>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setProvider("google")}
                          className={`flex items-center gap-2.5 px-3.5 py-3 rounded-md border text-sm font-medium transition-colors ${
                            provider === "google" ? "border-primary bg-muted" : "hover:border-primary/50"
                          }`}
                        >
                          <span className="text-foreground font-bold">G</span>
                          {t("Google Workspace", "Google Workspace")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setProvider("microsoft")}
                          className={`flex items-center gap-2.5 px-3.5 py-3 rounded-md border text-sm font-medium transition-colors ${
                            provider === "microsoft" ? "border-primary bg-muted" : "hover:border-primary/50"
                          }`}
                        >
                          <span className="text-foreground font-bold">M</span>
                          {t("Microsoft 365", "Microsoft 365")}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t(
                          "Other providers (Yahoo Mail, Zoho, etc.) — manual config on next step.",
                          "Penyedia lain (Yahoo Mail, Zoho, dll.) — konfigurasi manual di langkah berikutnya."
                        )}
                      </p>
                    </div>
                  </>
                )}

                {funnel === "postincident" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <Label>{t("When did the incident occur?", "Kapan insiden terjadi?")}</Label>
                      <Input type="date" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>{t("Type of incident", "Jenis insiden")}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {INCIDENT_TYPES.map((it) => (
                          <button
                            key={it.en}
                            type="button"
                            onClick={() => setIncidentType(it.en)}
                            className={`px-3 py-2 rounded-md border text-[13px] text-left transition-colors ${
                              incidentType === it.en ? "border-primary bg-muted font-semibold" : "hover:border-primary/50"
                            }`}
                          >
                            {t(it.en, it.id)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>{t("Affected systems (optional)", "Sistem yang terpengaruh (opsional)")}</Label>
                      <Textarea
                        rows={2}
                        value={affectedSystems}
                        onChange={(e) => setAffectedSystems(e.target.value)}
                        placeholder={t("e.g. File server, email, domain controller", "mis. Server file, email, domain controller")}
                      />
                    </div>
                  </>
                )}

                <div className="rounded-md bg-muted/60 p-3.5">
                  <p className="text-xs font-medium text-muted-foreground mb-2">{t("We will check:", "Kami akan memeriksa:")}</p>
                  <ul className="flex flex-col gap-1.5">
                    {meta.step2.checks.map((c) => (
                      <li key={c.en} className="text-[13px] flex items-start gap-1.5">
                        <Check className="size-3.5 shrink-0 mt-0.5 text-primary" />
                        <span>{t(c.en, c.id)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-muted-foreground">{t(meta.step2.hint.en, meta.step2.hint.id)}</p>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => goStep(1)} className="gap-1.5">
                    <ArrowLeft className="size-4" />
                    {t("Back", "Kembali")}
                  </Button>
                  <Button onClick={() => goStep(3)}>{t("Next →", "Lanjut →")}</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Connect assets */}
        {step === 3 && meta && funnel && (
          <div className="max-w-xl mx-auto">
            <Card className="p-6">
              <CardContent className="p-0 flex flex-col gap-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">{t(meta.step3.h2.en, meta.step3.h2.id)}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(meta.step3.sub.en, meta.step3.sub.id)}</p>
                </div>

                {funnel === "xray" && (
                  <>
                    <div className="flex flex-col gap-2.5">
                      <div className="rounded-md border border-primary bg-primary/5 p-3.5">
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="size-4 rounded-full bg-primary ring-2 ring-offset-2 ring-primary/30" />
                          <p className="text-sm font-medium">Wazuh Agent</p>
                          <Badge variant="secondary" className="text-[10px]">{t("Recommended", "Direkomendasikan")}</Badge>
                        </div>
                        <p className="text-[13px] text-muted-foreground mb-2.5">
                          {t(
                            "Install on one or more endpoints. Sends telemetry to your Shannon dashboard.",
                            "Pasang pada satu atau beberapa endpoint. Mengirim telemetri ke dashboard Shannon Anda."
                          )}
                        </p>
                        <div className="flex gap-2 flex-wrap mb-2.5">
                          <Badge variant="outline" className="text-primary">Windows .exe</Badge>
                          <Badge variant="outline" className="text-primary">Linux .deb</Badge>
                          <Badge variant="outline" className="text-primary">macOS .pkg</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t("Manager address:", "Alamat manager:")}{" "}
                          <code className="bg-muted px-1.5 py-0.5 rounded">sentinel.shannondynamics.id:1514</code>
                        </p>
                      </div>
                      <div className="rounded-md border p-3.5 opacity-50 pointer-events-none">
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div className="size-4 rounded-full border" />
                          <p className="text-sm font-medium text-muted-foreground">Forward Syslog</p>
                          <Badge variant="secondary" className="text-[10px]">{t("Coming soon", "Segera hadir")}</Badge>
                        </div>
                        <p className="text-[13px] text-muted-foreground">
                          {t("Forward syslog to Shannon's central collector.", "Forward syslog ke kolektor pusat Shannon.")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{t("Endpoints connected:", "Endpoint terhubung:")}</span>
                      <strong className="text-foreground">{epCount}</strong> / 10
                      <Button size="sm" variant="ghost" onClick={() => setEpCount((n) => Math.min(10, n + 1))}>
                        {t("+ Simulate connect", "+ Simulasi koneksi")}
                      </Button>
                    </div>
                  </>
                )}

                {funnel === "inbox" && (
                  <>
                    <div className="rounded-md border overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-3 bg-muted/60 border-b text-[13px] font-semibold">
                        <Lock className="size-4 text-primary" />
                        {t(
                          "Read-only access — we never send, delete, or modify emails.",
                          "Akses read-only — kami tidak pernah mengirim, menghapus, atau mengubah email."
                        )}
                      </div>
                      <div className="p-4 flex flex-col gap-2.5">
                        <button
                          type="button"
                          onClick={() => setOauthProvider("google")}
                          className="flex items-center gap-3 px-4 py-3 rounded-md border hover:border-primary/50 hover:bg-muted text-left transition-colors"
                        >
                          <span className="text-foreground text-lg font-bold">G</span>
                          <div>
                            <p className="text-sm font-semibold">{t("Connect Google Workspace", "Hubungkan Google Workspace")}</p>
                            <p className="text-xs text-muted-foreground">{t("Gmail logs, login activity, MFA status", "Log Gmail, aktivitas login, status MFA")}</p>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOauthProvider("microsoft")}
                          className="flex items-center gap-3 px-4 py-3 rounded-md border hover:border-primary/50 hover:bg-muted text-left transition-colors"
                        >
                          <span className="text-foreground text-lg font-bold">M</span>
                          <div>
                            <p className="text-sm font-semibold">{t("Connect Microsoft 365", "Hubungkan Microsoft 365")}</p>
                            <p className="text-xs text-muted-foreground">{t("Exchange logs, Entra ID sign-ins, MFA events", "Log Exchange, sign-in Entra ID, event MFA")}</p>
                          </div>
                        </button>
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground my-1">
                          <span className="flex-1 h-px bg-border" />
                          {t("or configure manually", "atau konfigurasi manual")}
                          <span className="flex-1 h-px bg-border" />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          {t("Manual IMAP / syslog forwarding — coming soon", "Penerusan IMAP / syslog manual — segera hadir")}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <ShieldCheck className="size-3.5 shrink-0 mt-0.5 text-primary" />
                      {t(
                        "Shannon only requests mail header metadata and login event logs — never message body content.",
                        "Shannon hanya meminta metadata header email dan log event login — tidak pernah konten isi pesan."
                      )}
                    </p>
                    {oauthProvider && (
                      <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                        <ShieldCheck className="size-4" />
                        {oauthProvider === "google" ? "Google Workspace" : "Microsoft 365"}{" "}
                        {t("connected. Ready to scan.", "terhubung. Siap untuk dipindai.")}
                      </div>
                    )}
                  </>
                )}

                {funnel === "postincident" && (
                  <>
                    <div className="border-2 border-dashed rounded-md p-8 text-center flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/50 hover:bg-muted hover:text-foreground cursor-pointer transition-colors">
                      <FolderOpen className="size-8" />
                      <span className="font-semibold text-sm">
                        {t("Drop log files here or click to upload", "Letakkan file log di sini atau klik untuk upload")}
                      </span>
                      <span className="text-xs">{t("Supports multiple files at once", "Mendukung beberapa file sekaligus")}</span>
                      <div className="flex gap-1.5 flex-wrap justify-center mt-1">
                        {["EVTX", "CSV", "JSON", "TXT", "Syslog"].map((fmt) => (
                          <Badge key={fmt} variant="secondary" className="text-[10px]">
                            {fmt}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-muted-foreground rounded-md px-3 py-2.5">
                      <AlertTriangle className="size-3.5 shrink-0 mt-0.5 text-amber-600" />
                      {t(
                        "If this is an active incident, don't wait for a full log export. Upload whatever you have now — partial logs still produce a useful triage.",
                        "Jika ini adalah insiden aktif, jangan tunggu ekspor log lengkap. Upload apa pun yang Anda punya sekarang — log parsial tetap menghasilkan triase yang berguna."
                      )}
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => goStep(2)} className="gap-1.5">
                    <ArrowLeft className="size-4" />
                    {t("Back", "Kembali")}
                  </Button>
                  <div className="flex items-center gap-3">
                    <button className="text-sm text-muted-foreground hover:underline" onClick={() => goStep(4)}>
                      {t("Skip for now", "Lewati untuk sekarang")}
                    </button>
                    <Button onClick={() => goStep(4)}>{t(meta.step3.cta.en, meta.step3.cta.id)}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Scanning */}
        {step === 4 && meta && (
          <div className="max-w-3xl mx-auto">
            <Card className="p-6">
              <CardContent className="p-0">
                {!scanDone ? (
                  <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-6 sm:gap-0">
                    <div className="flex flex-col items-center text-center gap-2 sm:border-r sm:pr-6">
                      <div className="relative shrink-0">
                        <svg viewBox="0 0 80 80" width="110" height="110">
                          <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted-foreground/20" />
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            transform="rotate(-90 40 40)"
                            className="text-foreground transition-all duration-300"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">{pct}%</span>
                      </div>
                      <p className="font-bold text-sm">{t(meta.scan.title.en, meta.scan.title.id)}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-foreground animate-pulse" />
                        {t(meta.scan.eta.en, meta.scan.eta.id)}
                      </p>
                    </div>
                    <div className="sm:pl-6">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-3.5">
                        {t("Analysis progress", "Progres analisis")}
                      </p>
                      <ul className="flex flex-col gap-1.5">
                        {meta.scan.items.map((item, i) => {
                          const done = i < scanProgress
                          return (
                            <li
                              key={item.en}
                              className={`text-[13px] flex items-start gap-2 ${done ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {done ? (
                                <Check className="size-3.5 shrink-0 mt-0.5 text-primary" />
                              ) : (
                                <span className="size-3.5 shrink-0 mt-0.5 flex items-center justify-center">·</span>
                              )}
                              {t(item.en, item.id)}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 flex-wrap p-2">
                    <CircleCheck className="size-11 shrink-0 text-emerald-600" />
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-bold text-lg">{t(meta.scan.doneTitle.en, meta.scan.doneTitle.id)}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{t(meta.scan.doneSub.en, meta.scan.doneSub.id)}</p>
                    </div>
                    <Button onClick={handleViewReport}>{t("View report →", "Lihat laporan →")}</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
