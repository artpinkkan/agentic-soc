import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Shield,
  Radar,
  Check,
  Info,
  Loader2,
  CircleCheck,
  CircleAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useI18n } from "@/lib/i18n"

type VerifyState = "idle" | "checking" | "success" | "failed"

const RIGHT_PANEL = {
  icon: Radar,
  name: { en: "Cyber X-Ray", id: "Cyber X-Ray" },
  desc: {
    en: "Full picture of your cyber exposure in ~2 minutes. No IT team needed — just your domain.",
    id: "Gambaran lengkap paparan siber Anda dalam ~2 menit. Tanpa tim IT — cukup dengan domain Anda.",
  },
  checks: {
    en: [
      "SPF / DKIM / DMARC configuration",
      "Exposed subdomains & open ports",
      "AI-generated risk summary",
    ],
    id: [
      "Konfigurasi SPF / DKIM / DMARC",
      "Subdomain terekspos & port terbuka",
      "Ringkasan risiko dari AI",
    ],
  },
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40)
}

export function Signup() {
  const { lang, setLang, t } = useI18n()
  const navigate = useNavigate()

  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [company, setCompany] = useState("")
  const [slug, setSlug] = useState("")
  const [industry, setIndustry] = useState("")
  const [domain, setDomain] = useState("")
  const [showError, setShowError] = useState(false)
  const [verifyState, setVerifyState] = useState<VerifyState>("idle")

  const effectiveSlug = slug || "nama-perusahaan"

  const handleCompanyChange = (value: string) => {
    setCompany(value)
    setSlug(slugify(value))
  }

  const handleEditSlug = () => {
    const current = effectiveSlug
    const promptText =
      lang === "en" ? "Edit workspace slug:" : "Ubah slug workspace:"
    const next = window.prompt(promptText, current)
    if (next) {
      setSlug(next.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40))
    }
  }

  const handleContinue = () => {
    if (!company || !name || !email || !password || !domain) {
      setShowError(true)
      return
    }
    setShowError(false)
    setStep(2)
  }

  const handleBack = () => setStep(1)

  const startVerification = () => {
    setVerifyState("checking")
    setTimeout(() => {
      setVerifyState(Math.random() > 0.3 ? "success" : "failed")
    }, 2800)
  }

  const retryVerification = () => setVerifyState("idle")

  const finishSignup = (domainVerified: boolean) => {
    const session = {
      email,
      name,
      company,
      slug: effectiveSlug,
      domain,
      industry,
      domainVerified,
      tier: "free",
      state: "free_active",
      setupComplete: false,
    }
    sessionStorage.setItem("ss-session", JSON.stringify(session))
    navigate("/onboarding")
  }

  const copyText = (value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {})
  }

  const dnsHost = `_sentinel-verify.${domain || "perusahaan.com"}`
  const dnsValue = "sentinel-verify=a7f3c2e9b1d4"

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-muted/40">
      <div className="w-full max-w-[980px] flex rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(25,28,30,0.14),0_4px_20px_rgba(25,28,30,0.07)] min-h-[600px]">
        {/* ── Left: form panel ───────────────────── */}
        <div className="flex-1 min-w-0 bg-white flex flex-col px-10 pt-8 pb-9">
          {/* Step nav row */}
          <div className="flex items-center gap-3 mb-10">
            {step === 2 && (
              <button
                type="button"
                onClick={handleBack}
                aria-label={t("Back", "Kembali")}
                className="size-[34px] rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
              >
                <ArrowLeft className="size-4" />
              </button>
            )}
            <div className="flex flex-col gap-px">
              <span className="text-xs font-bold tracking-wide text-muted-foreground">
                {step}/2
              </span>
              <span className="text-sm font-semibold">
                {step === 1
                  ? t("Account", "Akun")
                  : t("Verify domain", "Verifikasi domain")}
              </span>
            </div>
          </div>

          {/* Form body */}
          <div className="flex-1">
            {step === 1 ? (
              <div>
                <h1 className="text-[26px] font-bold tracking-tight mb-1.5 leading-tight">
                  {t("Create your free account", "Buat akun gratis Anda")}
                </h1>
                <p className="text-sm text-muted-foreground mb-7 leading-relaxed">
                  {t("Already have an account?", "Sudah punya akun?")}{" "}
                  <Link to="/login" className="text-primary font-medium">
                    {t("Sign in", "Masuk")}
                  </Link>
                </p>

                {showError && (
                  <div className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {t(
                      "Please fill all required fields.",
                      "Mohon isi semua kolom yang wajib."
                    )}
                  </div>
                )}

                {/* Account credentials */}
                <div className="mb-5">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
                    {t("Your account", "Akun Anda")}
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="su-name">
                        {t("Your name", "Nama Anda")}
                        <span className="text-destructive font-bold ml-0.5">*</span>
                      </Label>
                      <Input
                        id="su-name"
                        placeholder="Rudi Hartono"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="su-email">
                        {t("Work email", "Email kerja")}
                        <span className="text-destructive font-bold ml-0.5">*</span>
                      </Label>
                      <Input
                        id="su-email"
                        type="email"
                        placeholder="anda@perusahaan.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="su-password">
                        {t("Password", "Kata sandi")}
                        <span className="text-destructive font-bold ml-0.5">*</span>
                      </Label>
                      <Input
                        id="su-password"
                        type="password"
                        placeholder={t("Min. 8 characters", "Min. 8 karakter")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Organisation details */}
                <div className="mb-5 pt-4.5 border-t border-border">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
                    {t("Your organisation", "Organisasi Anda")}
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="su-company">
                        {t("Company name", "Nama perusahaan")}
                        <span className="text-destructive font-bold ml-0.5">*</span>
                      </Label>
                      <Input
                        id="su-company"
                        placeholder="PT Contoh Corp"
                        value={company}
                        onChange={(e) => handleCompanyChange(e.target.value)}
                      />
                      <div className="flex items-center gap-2 flex-wrap bg-muted rounded-md px-2.5 py-1.5 mt-1.5">
                        <span className="text-[11px] text-muted-foreground shrink-0">
                          URL:
                        </span>
                        <code className="text-[11px] font-mono text-foreground/80 flex-1 min-w-0 truncate">
                          sentinel.shannondynamics.id/
                          <strong className="text-foreground">{effectiveSlug}</strong>
                        </code>
                        <button
                          type="button"
                          onClick={handleEditSlug}
                          className="text-[11px] font-semibold text-primary hover:underline shrink-0"
                        >
                          {t("Edit", "Ubah")}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 max-[420px]:grid-cols-1">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="su-industry">{t("Industry", "Industri")}</Label>
                        <Select value={industry} onValueChange={setIndustry}>
                          <SelectTrigger id="su-industry" className="w-full">
                            <SelectValue placeholder={t("— Select —", "— Pilih —")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fintech">Fintech</SelectItem>
                            <SelectItem value="manufacturing">
                              {t("Manufacturing", "Manufaktur")}
                            </SelectItem>
                            <SelectItem value="retail">{t("Retail", "Ritel")}</SelectItem>
                            <SelectItem value="healthcare">
                              {t("Healthcare", "Kesehatan")}
                            </SelectItem>
                            <SelectItem value="logistics">
                              {t("Logistics", "Logistik")}
                            </SelectItem>
                            <SelectItem value="education">
                              {t("Education", "Pendidikan")}
                            </SelectItem>
                            <SelectItem value="gov">
                              {t("Government", "Pemerintah")}
                            </SelectItem>
                            <SelectItem value="other">{t("Other", "Lainnya")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="su-domain">
                          {t("Company domain", "Domain perusahaan")}
                          <span className="text-destructive font-bold ml-0.5">*</span>
                        </Label>
                        <Input
                          id="su-domain"
                          placeholder="perusahaan.com"
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t(
                        "We'll verify via DNS TXT record.",
                        "Kami verifikasi melalui DNS TXT record."
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="w-full" onClick={handleContinue}>
                    {t("Continue →", "Lanjut →")}
                  </Button>
                  <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground mt-4">
                    <Info className="size-3.5 shrink-0" />
                    {t(
                      "Free: 5–10 endpoints · 50 AI analyses/month · No card needed",
                      "Gratis: 5–10 endpoint · 50 analisis AI/bulan · Tanpa kartu kredit"
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-[26px] font-bold tracking-tight mb-1.5 leading-tight">
                  {t("Verify your domain", "Verifikasi domain Anda")}
                </h1>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  {t(
                    "Add this DNS TXT record to prove ownership of",
                    "Tambahkan TXT record DNS ini untuk membuktikan kepemilikan"
                  )}{" "}
                  <strong className="text-foreground">{domain || "perusahaan.com"}</strong>.
                </p>

                <div className="rounded-lg border border-border overflow-hidden mb-3.5">
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-border/60">
                    <span className="text-xs text-muted-foreground min-w-[68px] font-medium">
                      {t("Type", "Tipe")}
                    </span>
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded">TXT</code>
                  </div>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-border/60">
                    <span className="text-xs text-muted-foreground min-w-[68px] font-medium">
                      Host
                    </span>
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 min-w-0 break-all">
                      {dnsHost}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyText(dnsHost)}
                      className="text-[11px] font-medium text-primary border border-primary rounded-md px-2.5 py-0.5 hover:bg-primary hover:text-primary-foreground transition-colors shrink-0"
                    >
                      {t("Copy", "Salin")}
                    </button>
                  </div>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-border/60">
                    <span className="text-xs text-muted-foreground min-w-[68px] font-medium">
                      {t("Value", "Nilai")}
                    </span>
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 min-w-0 break-all">
                      {dnsValue}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyText(dnsValue)}
                      className="text-[11px] font-medium text-primary border border-primary rounded-md px-2.5 py-0.5 hover:bg-primary hover:text-primary-foreground transition-colors shrink-0"
                    >
                      {t("Copy", "Salin")}
                    </button>
                  </div>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5">
                    <span className="text-xs text-muted-foreground min-w-[68px] font-medium">
                      TTL
                    </span>
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded">300</code>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t(
                    "Usually propagates in minutes, up to 48 hours.",
                    "Biasanya menyebar dalam menit, hingga 48 jam."
                  )}
                </p>

                {verifyState === "idle" && (
                  <div>
                    <Button className="w-full mt-5" onClick={startVerification}>
                      {t("Check DNS now", "Periksa DNS sekarang")}
                    </Button>
                    <button
                      type="button"
                      onClick={() => finishSignup(false)}
                      className="block w-full text-center text-xs text-muted-foreground hover:text-foreground mt-3"
                    >
                      {t("Skip for now (verify later)", "Lewati untuk sekarang (verifikasi nanti)")}
                    </button>
                  </div>
                )}

                {verifyState === "checking" && (
                  <div className="flex items-center gap-3 px-4 py-3.5 bg-muted rounded-lg mt-4 text-sm">
                    <Loader2 className="size-[18px] animate-spin text-primary shrink-0" />
                    <span>{t("Checking DNS records…", "Memeriksa DNS record…")}</span>
                  </div>
                )}

                {verifyState === "success" && (
                  <div>
                    <div className="flex items-start gap-3 px-4 py-3.5 rounded-lg mt-4 border">
                      <CircleCheck className="size-[18px] text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">
                          {t("Domain verified!", "Domain terverifikasi!")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t("Your account is ready.", "Akun Anda siap.")}
                        </p>
                      </div>
                    </div>
                    <Button className="w-full mt-4" onClick={() => finishSignup(true)}>
                      {t("Go to setup →", "Mulai pengaturan →")}
                    </Button>
                  </div>
                )}

                {verifyState === "failed" && (
                  <div>
                    <div className="flex items-start gap-3 px-4 py-3.5 rounded-lg mt-4 border">
                      <CircleAlert className="size-[18px] text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">
                          {t("TXT record not found yet.", "TXT record belum ditemukan.")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t("Add the record above and try again.", "Tambahkan record di atas dan coba lagi.")}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      className="w-full mt-3"
                      onClick={retryVerification}
                    >
                      {t("Try again", "Coba lagi")}
                    </Button>
                    <button
                      type="button"
                      onClick={() => finishSignup(false)}
                      className="block w-full text-center text-xs text-muted-foreground hover:text-foreground mt-3"
                    >
                      {t("Skip for now", "Lewati untuk sekarang")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Language toggle */}
          <div className="flex justify-end mt-5">
            <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
              <Button
                size="sm"
                variant={lang === "id" ? "secondary" : "ghost"}
                className="h-6 px-2 text-xs"
                onClick={() => setLang("id")}
              >
                ID
              </Button>
              <Button
                size="sm"
                variant={lang === "en" ? "secondary" : "ghost"}
                className="h-6 px-2 text-xs"
                onClick={() => setLang("en")}
              >
                EN
              </Button>
            </div>
          </div>
        </div>

        {/* ── Right: brand panel ─────────────────── */}
        <div className="w-[42%] shrink-0 bg-[#003d38] flex flex-col justify-between p-9 relative overflow-hidden max-[720px]:hidden">
          <Shield
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] size-[320px] text-white/[0.055] pointer-events-none select-none"
            aria-hidden="true"
          />

          <Link
            to="/"
            className="relative z-10 flex items-center gap-2 text-[15px] font-bold text-white/60 no-underline"
          >
            <Shield className="size-5 text-white/50" />
            Shannon Sentinel
          </Link>

          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <div className="size-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
              <RIGHT_PANEL.icon className="size-6 text-white" />
            </div>
            <p className="text-xl font-bold text-white mb-2 tracking-tight leading-snug">
              {t(RIGHT_PANEL.name.en, RIGHT_PANEL.name.id)}
            </p>
            <p className="text-[13px] text-white/65 leading-relaxed mb-5">
              {t(RIGHT_PANEL.desc.en, RIGHT_PANEL.desc.id)}
            </p>
            <ul className="flex flex-col gap-2">
              {(lang === "en" ? RIGHT_PANEL.checks.en : RIGHT_PANEL.checks.id).map((c) => (
                <li key={c} className="flex items-start gap-2 text-[13px] text-white/80 leading-snug">
                  <Check className="size-3.5 text-white/50 shrink-0 mt-0.5" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
