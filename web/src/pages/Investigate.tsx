import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  Plus,
  MessageCircle,
  Menu,
  Send,
  Shield,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"
import { useI18n } from "@/lib/i18n"
import { CitationChip } from "@/components/investigate/CitationChip"
import {
  INITIAL_CONVERSATIONS,
  type Conversation,
  type Message,
  type Severity,
} from "@/lib/investigate-data"

const GENERIC_CITATIONS = [
  { kind: "internal" as const, label: "log:siem_query", title: "node_hash: 5c9e14af · tier: internal-telemetry" },
  { kind: "attck" as const, label: "attck:lookup", title: "node_hash: 2b7f0a91 · tier: knowledge-graph" },
]

function truncateChars(text: string, max: number) {
  if (text.length <= max) return text
  return `${text.slice(0, max).trimEnd()}...`
}

function severityBadge(sev: Severity | undefined, t: (en: string, id: string) => string) {
  if (!sev) return null
  return (
    <Badge variant={sev === "critical" ? "destructive" : "outline"} className="text-[10px]">
      {sev === "critical" ? t("Critical", "Kritis") : t("High", "Tinggi")}
    </Badge>
  )
}

function ConversationList({
  conversations,
  activeKey,
  onSelect,
  onNew,
  onDelete,
}: {
  conversations: Record<string, Conversation>
  activeKey: string
  onSelect: (key: string) => void
  onNew: () => void
  onDelete: (key: string) => void
}) {
  const { t, lang } = useI18n()
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-3 py-3 border-b">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("Conversations", "Percakapan")}
        </span>
        <Button size="sm" variant="secondary" className="h-7 gap-1 text-xs" onClick={onNew}>
          <Plus className="size-3.5" />
          {t("New", "Baru")}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {Object.values(conversations).map((c) => {
            const title = lang === "en" ? c.titleEn : c.titleId
            const lastMsg = c.messages[c.messages.length - 1]
            const snippet = truncateChars(
              lastMsg ? (lang === "en" ? lastMsg.en : lastMsg.id) : t("No messages yet", "Belum ada pesan"),
              36
            )
            const active = c.key === activeKey
            return (
              <div
                key={c.key}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(c.key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onSelect(c.key)
                  }
                }}
                className={
                  "group relative flex w-full cursor-pointer items-start gap-2.5 pl-3 pr-6 py-2.5 text-left border-l-2 transition-colors hover:bg-accent " +
                  (active ? "bg-accent border-l-primary" : "border-l-transparent")
                }
              >
                <span
                  className={
                    "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md " +
                    (active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")
                  }
                >
                  <MessageCircle className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-medium">{title}</div>
                  <div className="overflow-hidden text-nowrap text-[11.5px] text-muted-foreground">{snippet}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    {c.severity && severityBadge(c.severity, t)}
                    {c.ref && (
                      <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {c.ref}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={t("Delete conversation", "Hapus percakapan")}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(c.key)
                  }}
                  className="absolute right-0.5 top-1/2 hidden size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive group-hover:flex"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const { t, lang } = useI18n()
  const text = lang === "en" ? message.en : message.id

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          {text}
        </div>
      </div>
    )
  }

  const citations = message.citations
  const coverage = lang === "en" ? message.citationCoverageEn : message.citationCoverageId
  const recommendation = lang === "en" ? message.recommendationEn : message.recommendationId

  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary">
        <Shield className="size-4 text-primary-foreground" />
      </span>
      <div className="flex-1 min-w-0 max-w-[85%]">
        <div className="rounded-2xl rounded-tl-sm border bg-card px-4 py-3 text-sm">
          <div className="mb-1 text-xs font-semibold text-muted-foreground">
            {t("Summary", "Ringkasan")}
          </div>
          <p>{text}</p>
          {citations && citations.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {citations.map((c, i) => (
                <CitationChip key={i} citation={c} />
              ))}
            </div>
          )}
          {coverage && (
            <div
              className={
                "mt-2 flex items-center gap-1.5 border-t pt-2 text-xs font-medium " +
                (message.abstain ? "text-amber-600" : "text-emerald-600")
              }
            >
              {message.abstain ? <AlertTriangle className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
              {coverage}
            </div>
          )}
          {recommendation && (
            <>
              <div className="my-2 border-t" />
              <div className="mb-1 text-xs font-semibold text-muted-foreground">
                {t("Recommendations", "Rekomendasi")}
              </div>
              <p>{recommendation}</p>
            </>
          )}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="gap-1 text-[10px]">
            <Shield className="size-3" /> Sentinel SLM
          </Badge>
          {message.confidence != null && (
            <Badge variant="secondary" className="text-[10px]">
              ✓ {message.confidence}%
            </Badge>
          )}
          {message.verified && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="gap-1 text-[10px] cursor-help">
                  <ShieldCheck className="size-3" /> {t(`Verified ${message.verified}`, `Terverifikasi ${message.verified}`)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {message.abstain
                  ? t("Self-consistency votes split · judge model: ABSTAIN", "Voting self-consistency terbagi · model juri: ABSTAIN")
                  : t("Self-consistency votes agree · judge model: PASS", "Voting self-consistency sepakat · model juri: LULUS")}
              </TooltipContent>
            </Tooltip>
          )}
          {message.abstain && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600">
              <AlertTriangle className="size-3" /> {t("Human Review", "Tinjauan Manusia")}
            </span>
          )}
          <a
            href="/agentic-soc/inspector/"
            className="ml-auto inline-flex items-center gap-0.5 text-[11px] font-medium text-primary hover:underline"
          >
            {t("Inspect", "Periksa")} <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

export function Investigate() {
  const { t, lang } = useI18n()
  const isMobile = useIsMobile()
  const [searchParams] = useSearchParams()
  const [conversations, setConversations] = useState<Record<string, Conversation>>(INITIAL_CONVERSATIONS)
  const [activeKey, setActiveKey] = useState("network")
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const counterRef = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const didInit = useRef(false)

  useEffect(() => {
    if (didInit.current) return
    didInit.current = true

    const convKey = searchParams.get("conv")
    const domainKey = searchParams.get("domain")

    if (convKey) {
      setConversations((prev) => {
        if (prev[convKey]) return prev
        const title = searchParams.get("t") || convKey
        const sev = (searchParams.get("sev") as Severity) || "high"
        const dom = searchParams.get("dom") || undefined
        const welcome: Message = {
          role: "ai",
          en: "Ask a question below to start the investigation for this specific finding.",
          id: "Ajukan pertanyaan di bawah untuk memulai investigasi temuan ini.",
        }
        return {
          ...prev,
          [convKey]: { key: convKey, titleEn: title, titleId: title, ref: dom, severity: sev, messages: [welcome] },
        }
      })
      setActiveKey(convKey)
    } else if (domainKey && INITIAL_CONVERSATIONS[domainKey]) {
      setActiveKey(domainKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [conversations, activeKey, isTyping])

  const active = conversations[activeKey]

  const handleNew = () => {
    const ref = window.prompt(
      t("Reference an incident ID? (optional, leave blank to skip)", "Rujuk ke ID insiden? (opsional, kosongkan untuk lewati)"),
      ""
    )
    counterRef.current += 1
    const key = `new-${counterRef.current}`
    const label = t("New conversation", "Percakapan baru")
    setConversations((prev) => ({
      ...prev,
      [key]: { key, titleEn: label, titleId: label, ref: ref?.trim() || null, messages: [] },
    }))
    setActiveKey(key)
    setSidebarOpen(false)
  }

  const handleSelect = (key: string) => {
    setActiveKey(key)
    setSidebarOpen(false)
  }

  const handleDelete = (key: string) => {
    const ok = window.confirm(
      t("Delete this conversation? This cannot be undone.", "Hapus percakapan ini? Tindakan ini tidak dapat dibatalkan.")
    )
    if (!ok) return

    const remainingKeys = Object.keys(conversations).filter((k) => k !== key)
    setConversations((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    if (activeKey === key) {
      setActiveKey(remainingKeys[0] ?? "")
    }
  }

  const handleSend = () => {
    const text = input.trim()
    if (!text || !active) return
    setInput("")

    const userMsg: Message = { role: "user", en: text, id: text }
    setConversations((prev) => ({
      ...prev,
      [active.key]: { ...prev[active.key], messages: [...prev[active.key].messages, userMsg] },
    }))
    setIsTyping(true)

    setTimeout(() => {
      const aiMsg: Message = {
        role: "ai",
        en: "Analysis complete. Based on current telemetry and threat intelligence, this requires immediate attention.",
        id: "Analisis selesai. Berdasarkan telemetri saat ini dan intelijen ancaman, ini memerlukan perhatian segera.",
        citations: GENERIC_CITATIONS,
        citationCoverageEn: "2 independent citations — meets ≥2 required",
        citationCoverageId: "2 sitasi independen — memenuhi ≥2 yang diperlukan",
        recommendationEn: "Review the findings in the triage dashboard and follow the recommended playbook steps.",
        recommendationId: "Tinjau temuan di dasbor triase dan ikuti langkah-langkah playbook yang direkomendasikan.",
        confidence: 87,
        verified: "4/5",
      }
      setConversations((prev) => ({
        ...prev,
        [active.key]: { ...prev[active.key], messages: [...prev[active.key].messages, aiMsg] },
      }))
      setIsTyping(false)
    }, 1400)
  }

  const title = active ? (lang === "en" ? active.titleEn : active.titleId) : ""

  const sidebarContent = (
    <ConversationList
      conversations={conversations}
      activeKey={activeKey}
      onSelect={handleSelect}
      onNew={handleNew}
      onDelete={handleDelete}
    />
  )

  const messages = useMemo(() => active?.messages ?? [], [active])

  return (
    <div className="flex min-h-0 flex-1 -m-4 md:-m-6 overflow-hidden border-t md:border">
      {!isMobile && <div className="w-80 shrink-0 border-r">{sidebarContent}</div>}

      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">{t("Conversations", "Percakapan")}</SheetTitle>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b px-4 py-3">
          {isMobile && (
            <Button size="icon" variant="ghost" className="shrink-0" onClick={() => setSidebarOpen(true)}>
              <Menu className="size-4" />
            </Button>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-semibold">
              {title || t("SOC Investigation Assistant", "Asisten Investigasi SOC")}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {t(
                "Ask about alerts, threats, or request a root-cause analysis",
                "Tanyakan tentang alert, ancaman, atau minta analisis akar masalah"
              )}
            </div>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex">Sentinel SLM</Badge>
        </div>

        <ScrollArea className="flex-1 min-h-0" viewportRef={scrollRef}>
          <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6 md:px-6">
            {messages.length === 0 && (
              <p className="py-16 text-center text-sm text-muted-foreground">
                {t("Ask a question to start this conversation.", "Ajukan pertanyaan untuk memulai percakapan ini.")}
              </p>
            )}
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} />
            ))}
            {isTyping && (
              <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Shield className="size-4 text-primary-foreground" />
                </span>
                <div className="flex gap-1 rounded-2xl rounded-tl-sm border bg-card px-4 py-3">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-3 md:p-4">
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder={t(
                "Ask about alerts, threats, or incidents…",
                "Tanyakan tentang alert, ancaman, atau insiden…"
              )}
              className="min-h-10 flex-1 resize-none"
              rows={1}
            />
            <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
