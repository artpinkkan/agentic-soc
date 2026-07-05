import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShieldCheck, Info, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

const TIERS = [
  { key: "free", en: "Free — Cyber X-Ray", id: "Gratis — Cyber X-Ray", active: true },
  { key: "sprint", en: "Sprint — 30-day fix", id: "Sprint — Perbaikan 30 hari", active: false },
  { key: "mdr", en: "MDR — Always monitored", id: "MDR — Selalu dimonitor", active: false },
]

const QUESTIONS = [
  {
    en: "Can attackers send fake emails as your company?",
    id: "Bisakah penyerang mengirim email palsu atas nama perusahaan Anda?",
  },
  {
    en: "Are any of your systems visible from the internet?",
    id: "Apakah ada sistem Anda yang terlihat dari internet?",
  },
  {
    en: "If you got hacked today, do you have enough evidence to investigate?",
    id: "Jika diretas hari ini, apakah Anda punya cukup bukti untuk investigasi?",
  },
]

export function Login() {
  const { lang, setLang, t } = useI18n()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  const handleLogin = () => {
    if (!email.trim() || !password) {
      setError(true)
      return
    }
    setError(false)
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden rounded-3xl p-0 shadow-2xl min-h-[540px]">
        {/* Left: form panel */}
        <div className="flex-1 min-w-0 bg-background flex flex-col p-8 md:p-10">
          <div className="mb-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-semibold text-primary no-underline"
            >
              <ShieldCheck className="size-5" />
              Shannon Sentinel
            </Link>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight mb-1.5">
              {t("Sign in to your account", "Masuk ke akun Anda")}
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              {t("Don't have an account?", "Belum punya akun?")}{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                {t("Sign up free", "Daftar gratis")}
              </Link>
            </p>

            {error && (
              <div className="mb-4 rounded-md border-l-3 border-destructive bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                {t("Email and password are required.", "Email dan kata sandi wajib diisi.")}
              </div>
            )}

            <div
              className="flex flex-col gap-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin()
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="login-email">{t("Work email", "Email kerja")}</Label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("you@company.com", "anda@perusahaan.com")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">{t("Password", "Kata sandi")}</Label>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    {t("Forgot password?", "Lupa kata sandi?")}
                  </a>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button className="w-full mt-1" onClick={handleLogin}>
                {t("Sign in", "Masuk")}
              </Button>
            </div>

            <p className="flex items-center justify-center gap-1 text-center text-xs text-muted-foreground mt-4 leading-relaxed">
              <Info className="size-3" />
              {t(
                "Demo: enter any email + password to sign in.",
                "Demo: masukkan email + kata sandi apa pun untuk masuk."
              )}
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLang(lang === "en" ? "id" : "en")}
            >
              {lang === "en" ? "ID" : "EN"}
            </Button>
          </div>
        </div>

        {/* Right: brand panel */}
        <div className="hidden md:flex w-[42%] shrink-0 flex-col justify-between p-9 relative overflow-hidden bg-[#003d38]">
          <ShieldCheck
            aria-hidden
            className="absolute top-1/2 left-1/2 size-[320px] -translate-x-1/2 -translate-y-[60%] text-white/[0.055] pointer-events-none select-none"
          />

          <Link
            to="/"
            className="relative z-10 inline-flex items-center gap-2 font-semibold text-white/60 no-underline"
          >
            <ShieldCheck className="size-5 text-white/50" />
            Shannon Sentinel
          </Link>

          <div className="relative z-10 flex-1 flex flex-col justify-center py-5">
            <p className="text-xl font-bold tracking-tight text-white leading-snug mb-5">
              {t(
                "Know your real cyber risk in 2 minutes.",
                "Ketahui risiko siber nyata Anda dalam 2 menit."
              )}
            </p>
            <ul className="flex flex-col gap-3">
              {QUESTIONS.map((q, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/75 leading-relaxed">
                  <ArrowRight className="size-4 text-white/40 shrink-0 mt-0.5" />
                  <span>{t(q.en, q.id)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-4 flex flex-col gap-2">
            {TIERS.map((tier) => (
              <div
                key={tier.key}
                className={`flex items-center gap-2.5 text-sm ${
                  tier.active ? "text-white/90 font-semibold" : "text-white/50"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full shrink-0 ${
                    tier.active ? "bg-white/85" : "bg-white/25"
                  }`}
                />
                <span>{t(tier.en, tier.id)}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
