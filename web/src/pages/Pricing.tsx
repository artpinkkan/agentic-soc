import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ShieldCheck,
  Shield,
  RefreshCw,
  Bot,
  LayoutGrid,
  Check,
  X,
  Plus,
  Minus,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  FAQ_ITEMS,
  PRICING_PLANS,
  COMPARE_ROWS,
  PLATFORM_CARDS,
  type CompareCell,
} from "@/lib/pricing-data"

const PLATFORM_ICONS = { shield: Shield, refresh: RefreshCw, robot: Bot }

function CompareValue({ value, lang }: { value: CompareCell; lang: "en" | "id" }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="size-4 text-primary" />
    ) : (
      <X className="size-4 text-muted-foreground" />
    )
  }
  if (typeof value === "string") return <>{value}</>
  return <>{lang === "en" ? value.en : value.id}</>
}

export function Pricing() {
  const { lang, t } = useI18n()
  const [openFaq, setOpenFaq] = useState<number>(0)
  const [showCompare, setShowCompare] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b bg-card px-6 py-3.5">
        <Link to="/dashboard" className="flex items-center gap-2 font-heading text-[15px] font-bold text-primary">
          <ShieldCheck className="size-5" />
          Shannon Sentinel
        </Link>
        <Link to="/dashboard" className="ml-auto text-[13px] text-muted-foreground hover:text-foreground">
          {t("← Back to dashboard", "← Kembali ke dasbor")}
        </Link>
      </header>

      {/* Hero: two-column layout */}
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-start gap-10 px-6 py-16 md:grid-cols-[380px_1fr] md:gap-0">
        {/* Left: headline + FAQ */}
        <div className="md:sticky md:top-20 md:pr-14">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5" />
            {t("Built for Indonesian mid-market", "Dirancang untuk perusahaan menengah Indonesia")}
          </div>

          <h1 className="mb-4 font-heading text-[40px] font-bold leading-[1.18] tracking-tight text-foreground">
            {t("Transparent pricing.", "Harga transparan.")}
            <br />
            {t("No lock-in.", "Tanpa lock-in.")}
          </h1>

          <p className="mb-10 max-w-[320px] text-[15px] leading-relaxed text-muted-foreground">
            {t(
              "Start free, fix what's red with a one-time Sprint, then stay monitored — each step on your own timeline.",
              "Mulai gratis, perbaiki temuan merah dengan Sprint satu kali, lalu tetap dimonitor — setiap langkah sesuai waktu Anda."
            )}
          </p>

          {/* FAQ accordion */}
          <div className="flex flex-col border-t">
            {FAQ_ITEMS.map((item, i) => {
              const open = openFaq === i
              return (
                <div key={i} className="border-b">
                  <button
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    className="flex w-full items-center justify-between gap-3 py-3.5 text-left text-sm font-medium text-foreground hover:text-primary"
                  >
                    <span>{t(item.qEn, item.qId)}</span>
                    <span
                      className={`flex size-[22px] shrink-0 items-center justify-center rounded-full border ${
                        open ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground"
                      }`}
                    >
                      {open ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                    </span>
                  </button>
                  {open && (
                    <p className="pb-3.5 text-[13px] leading-relaxed text-muted-foreground">
                      {t(item.aEn, item.aId)}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: stacked pricing cards */}
        <div className="flex flex-col gap-3.5">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.key}
              className={`relative grid grid-cols-1 gap-6 p-6 sm:grid-cols-[220px_1fr] ${
                plan.featured ? "bg-primary/5 ring-2 ring-primary" : ""
              }`}
            >
              {plan.badgeEn && (
                <Badge className="absolute top-3 right-3">{t(plan.badgeEn, plan.badgeId!)}</Badge>
              )}
              <div className="flex flex-col gap-1.5">
                <p className={`text-[11px] font-bold uppercase tracking-wide ${plan.featured ? "text-primary" : "text-muted-foreground"}`}>
                  {t(plan.tierLabelEn, plan.tierLabelId)}
                </p>
                <p className="font-heading text-[28px] font-bold leading-tight tracking-tight text-foreground">
                  {plan.priceMain}
                </p>
                {plan.priceSubEn && (
                  <p className="mb-1.5 text-xs text-muted-foreground">{t(plan.priceSubEn, plan.priceSubId!)}</p>
                )}
                <p className="mb-2.5 text-[13px] leading-relaxed text-muted-foreground">
                  {t(plan.descEn, plan.descId)}
                </p>
                <Button
                  asChild
                  variant={plan.ctaVariant === "primary" ? "default" : "outline"}
                  className="w-full"
                >
                  {plan.ctaTarget === "signup" ? (
                    <Link to="/signup">{t(plan.ctaEn, plan.ctaId)}</Link>
                  ) : (
                    <a href="mailto:sales@shannondynamics.id">{t(plan.ctaEn, plan.ctaId)}</a>
                  )}
                </Button>
              </div>
              <div className="pt-1">
                <ul className="flex flex-col gap-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] leading-snug text-foreground/80">
                      <Check className={`mt-0.5 size-3.5 shrink-0 ${plan.featured ? "text-primary" : "text-muted-foreground"}`} />
                      <span>{t(f.en, f.id)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Compare table toggle */}
      <div className="mx-auto max-w-[1120px] px-6 pb-12">
        <button
          onClick={() => setShowCompare((v) => !v)}
          className="flex items-center gap-1.5 py-2 text-[13px] font-semibold text-primary hover:text-primary/80"
        >
          <LayoutGrid className="size-4" />
          {showCompare
            ? t("Hide comparison ↑", "Sembunyikan perbandingan ↑")
            : t("Compare all features ↓", "Bandingkan semua fitur ↓")}
        </button>
        {showCompare && (
          <Table className="mt-3">
            <TableHeader>
              <TableRow>
                <TableHead>{t("Feature", "Fitur")}</TableHead>
                <TableHead>{t("Free", "Gratis")}</TableHead>
                <TableHead>Sprint</TableHead>
                <TableHead>{t("Core MDR", "MDR Inti")}</TableHead>
                <TableHead>{t("AI MDR", "MDR AI")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPARE_ROWS.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{t(row.featureEn, row.featureId)}</TableCell>
                  <TableCell><CompareValue value={row.free} lang={lang} /></TableCell>
                  <TableCell><CompareValue value={row.sprint} lang={lang} /></TableCell>
                  <TableCell><CompareValue value={row.mdr} lang={lang} /></TableCell>
                  <TableCell><CompareValue value={row.aiMdr} lang={lang} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Platform direction */}
      <section className="mx-auto max-w-[1120px] px-6 pb-6">
        <Card className="p-8">
          <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            {t("PLATFORM DIRECTION — NOT YET LIVE", "ARAH PLATFORM — BELUM TERSEDIA")}
          </span>
          <h2 className="mb-2.5 font-heading text-2xl font-bold tracking-tight text-foreground">
            {t("Where the platform is headed", "Ke mana arah platform ini")}
          </h2>
          <p className="mb-6 max-w-[600px] text-sm leading-relaxed text-muted-foreground">
            {t(
              "Every tier above ships the detect-and-respond brain. The direction we're building toward is one closed loop: prevent, detect, respond, and govern every AI action — not four separate products.",
              "Setiap paket di atas mengirimkan otak deteksi-dan-respons. Arah yang kami bangun adalah satu lingkaran tertutup: cegah, deteksi, respons, dan kendalikan setiap tindakan AI — bukan empat produk terpisah."
            )}
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {PLATFORM_CARDS.map((card, i) => {
              const Icon = PLATFORM_ICONS[card.icon]
              return (
                <div key={i} className="rounded-md border border-dashed bg-muted/40 p-5">
                  <Icon className="mb-2.5 size-5 text-primary/80" />
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{t(card.titleEn, card.titleId)}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{t(card.descEn, card.descId)}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <p className="text-xs italic text-muted-foreground">
              {t(
                "None of this is sold or shipped today. It's the direction the roadmap points.",
                "Tidak ada yang dijual atau dikirimkan hari ini. Ini adalah arah roadmap kami."
              )}
            </p>
            <Button variant="ghost" asChild>
              <a href="mailto:sales@shannondynamics.id?subject=Platform%20direction">
                {t("Shape the roadmap →", "Bentuk roadmap →")}
              </a>
            </Button>
          </div>
        </Card>
      </section>

      {/* Bottom CTA */}
      <section className="border-t bg-primary/5 px-6 py-14 text-center">
        <h2 className="mb-2 font-heading text-2xl font-bold tracking-tight text-foreground">
          {t("Not sure which plan fits?", "Tidak yakin paket mana yang cocok?")}
        </h2>
        <p className="mb-6 text-[15px] text-muted-foreground">
          {t(
            "Start with the free X-Ray — it takes 2 minutes and shows you exactly where you stand.",
            "Mulai dengan X-Ray gratis — hanya 2 menit dan menunjukkan posisi Anda persis."
          )}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/signup">{t("Start Cyber X-Ray — free →", "Mulai Cyber X-Ray — gratis →")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="mailto:sales@shannondynamics.id">{t("Talk to the team", "Bicara dengan tim")}</a>
          </Button>
        </div>
      </section>
    </div>
  )
}
