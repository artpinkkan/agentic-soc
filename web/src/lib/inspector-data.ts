import type { LucideIcon } from "lucide-react"
import { Link2, Clipboard, Zap, Ruler, BarChart3, AlertCircle } from "lucide-react"

export type GuardrailStatus = "pass" | "flag"

export interface GuardrailRow {
  layerEn: string
  layerId: string
  checkEn: string
  checkId: string
  status: GuardrailStatus
}

export type KgNodeKind = "attck" | "nvd" | "kev" | "sigma" | "epss" | "abuseipdb"

export interface KgNode {
  kind: KgNodeKind
  label: string
}

export const KG_NODE_STYLES: Record<KgNodeKind, { icon: LucideIcon }> = {
  attck: { icon: Link2 },
  nvd: { icon: Clipboard },
  kev: { icon: Zap },
  sigma: { icon: Ruler },
  epss: { icon: BarChart3 },
  abuseipdb: { icon: AlertCircle },
}

export interface ResponseTrace {
  id: string
  labelEn: string
  labelId: string
  model: string
  ts: string
  routingEn: string
  routingId: string
  latency: string
  confidence: string
  hitlRequired: boolean
  guardrails: GuardrailRow[]
  nodes: KgNode[]
}

export const RESPONSE_TRACES: ResponseTrace[] = [
  {
    id: "1",
    labelEn: "[14:09] SSH Brute Force analysis — Sentinel SLM",
    labelId: "[14:09] Analisis SSH Brute Force — Sentinel SLM",
    model: "Sentinel SLM (fine-tune pending)",
    ts: "2026-04-25T14:09:17+07:00",
    routingEn: "severity=HIGH → SLM primary",
    routingId: "severity=HIGH → SLM primer",
    latency: "1,247 ms",
    confidence: "94%",
    hitlRequired: true,
    guardrails: [
      { layerEn: "Input", layerId: "Input", checkEn: "Jailbreak / PII / scope", checkId: "Jailbreak / PII / cakupan", status: "pass" },
      { layerEn: "Retrieval", layerId: "Retrieval", checkEn: "Untrusted-content tagging", checkId: "Penandaan konten tidak tepercaya", status: "pass" },
      { layerEn: "Output", layerId: "Output", checkEn: "Dual-use filter / citation enforcement", checkId: "Filter dual-use / penegakan kutipan", status: "pass" },
      { layerEn: "Topical", layerId: "Topikal", checkEn: "Defensive-only scope check", checkId: "Pemeriksaan cakupan hanya defensif", status: "pass" },
    ],
    nodes: [
      { kind: "attck", label: "MITRE ATT&CK T1110.001" },
      { kind: "nvd", label: "NVD CVE-2023-38408" },
      { kind: "kev", label: "CISA KEV 2023-38408" },
      { kind: "sigma", label: "Sigma SSH Brute Force" },
      { kind: "epss", label: "EPSS 0.847" },
      { kind: "abuseipdb", label: "AbuseIPDB ×3" },
    ],
  },
  {
    id: "2",
    labelEn: "[14:11] Escalation recommendation — Sentinel SLM (guardrail flag)",
    labelId: "[14:11] Rekomendasi eskalasi — Sentinel SLM (flag guardrail)",
    model: "Sentinel SLM (fine-tune pending)",
    ts: "2026-04-25T14:11:04+07:00",
    routingEn: "severity=HIGH → SLM primary",
    routingId: "severity=HIGH → SLM primer",
    latency: "1,089 ms",
    confidence: "91%",
    hitlRequired: true,
    guardrails: [
      { layerEn: "Input", layerId: "Input", checkEn: "Jailbreak / PII / scope", checkId: "Jailbreak / PII / cakupan", status: "pass" },
      { layerEn: "Retrieval", layerId: "Retrieval", checkEn: "Untrusted-content tagging", checkId: "Penandaan konten tidak tepercaya", status: "pass" },
      { layerEn: "Output", layerId: "Output", checkEn: "Dual-use filter / citation enforcement", checkId: "Filter dual-use / penegakan kutipan", status: "flag" },
      { layerEn: "Topical", layerId: "Topikal", checkEn: "Defensive-only scope check", checkId: "Pemeriksaan cakupan hanya defensif", status: "pass" },
    ],
    nodes: [
      { kind: "attck", label: "MITRE ATT&CK T1110" },
      { kind: "sigma", label: "Sigma SSH Brute Force" },
      { kind: "epss", label: "EPSS 0.847" },
    ],
  },
  {
    id: "3",
    labelEn: "[13:45] DMARC finding summary — Claude Sonnet fallback",
    labelId: "[13:45] Ringkasan temuan DMARC — cadangan Claude Sonnet",
    model: "claude-sonnet-4-6 (fallback)",
    ts: "2026-04-25T13:45:22+07:00",
    routingEn: "severity=LOW → SLM timeout → Claude fallback",
    routingId: "severity=LOW → timeout SLM → cadangan Claude",
    latency: "2,341 ms",
    confidence: "97%",
    hitlRequired: false,
    guardrails: [
      { layerEn: "Input", layerId: "Input", checkEn: "Jailbreak / PII / scope", checkId: "Jailbreak / PII / cakupan", status: "pass" },
      { layerEn: "Retrieval", layerId: "Retrieval", checkEn: "Untrusted-content tagging", checkId: "Penandaan konten tidak tepercaya", status: "pass" },
      { layerEn: "Output", layerId: "Output", checkEn: "Dual-use filter / citation enforcement", checkId: "Filter dual-use / penegakan kutipan", status: "pass" },
      { layerEn: "Topical", layerId: "Topikal", checkEn: "Defensive-only scope check", checkId: "Pemeriksaan cakupan hanya defensif", status: "pass" },
    ],
    nodes: [
      { kind: "attck", label: "MITRE ATT&CK T1566" },
      { kind: "nvd", label: "RFC 7489 DMARC" },
      { kind: "sigma", label: "Sigma Email Security" },
    ],
  },
]

export const RAW_PROMPT_LOG: [string, string][] = [
  ["request_id", "req_a7f3c2e9b1d4"],
  ["tenant_id", "tenant-unknown"],
  ["model", "Sentinel SLM (stub — fine-tune pending)"],
  ["fallback_model", "claude-sonnet-4-6 (not triggered)"],
  ["input_tokens", "847"],
  ["output_tokens", "412"],
  ["retrieval_nodes", "6 (ATT&CK×2, NVD×1, KEV×1, Sigma×1, EPSS×1)"],
  ["guardrail_input", "PASS (jailbreak:0.02, pii:0.00, scope:0.98)"],
  ["guardrail_retrieval", "PASS (untrusted_content:0.05)"],
  ["guardrail_output", "PASS (dual_use:0.03, citation_coverage:1.00)"],
  ["guardrail_topical", "PASS (defensive_scope:0.97)"],
  ["llama_guard", "PASS (safe)"],
  ["confidence", "0.94"],
  ["hitl_required", "true (confidence < 0.95 threshold)"],
  ["latency_ms", "1247"],
  ["cost_usd", "0.0031"],
]

export type ActionStatus = "allowed" | "allowed-auto" | "pending"

export interface AgentAction {
  time: string
  tool: string
  scopeEn: string
  scopeId: string
  registryCheck: string
  blastRadiusEn: string
  blastRadiusId: string
  status: ActionStatus
}

export const AGENT_ACTIONS: AgentAction[] = [
  {
    time: "14:09:20",
    tool: "query_siem_logs(source=ssh_auth)",
    scopeEn: "Read-only, tenant-scoped",
    scopeId: "Baca-saja, cakupan tenant",
    registryCheck: "Signed",
    blastRadiusEn: "Low",
    blastRadiusId: "Rendah",
    status: "allowed",
  },
  {
    time: "14:09:45",
    tool: "isolate_host(ip=10.2.4.17)",
    scopeEn: "Write, host isolation",
    scopeId: "Tulis, isolasi host",
    registryCheck: "Signed",
    blastRadiusEn: "High",
    blastRadiusId: "Tinggi",
    status: "pending",
  },
  {
    time: "14:11:10",
    tool: "block_ip(ip=203.0.113.44, fw=perimeter)",
    scopeEn: "Write, network policy change",
    scopeId: "Tulis, perubahan kebijakan jaringan",
    registryCheck: "Signed",
    blastRadiusEn: "Medium",
    blastRadiusId: "Sedang",
    status: "allowed-auto",
  },
  {
    time: "13:45:30",
    tool: "send_email_alert(to=soc-team)",
    scopeEn: "Notify-only",
    scopeId: "Hanya notifikasi",
    registryCheck: "Signed",
    blastRadiusEn: "None",
    blastRadiusId: "Tidak ada",
    status: "allowed",
  },
]

export interface AuditChainLink {
  from: string
  to: string
  sealed: boolean
}

export const AUDIT_CHAIN: AuditChainLink[] = [
  { from: "#a7f3c2…e9b1", to: "#3d81f0…7c4a", sealed: true },
  { from: "#3d81f0…7c4a", to: "#9e02b6…41f8", sealed: true },
  { from: "#9e02b6…41f8", to: "", sealed: false },
]
