"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, SSSession } from "@/lib/session";

// ─── Types ───────────────────────────────────────────────────────────────────
type Audience = "direktur" | "it" | "finance" | "auditor";
type Lang = "id" | "en";

// ─── Copy ────────────────────────────────────────────────────────────────────
const copy = {
  id: {
    topbarSub: "Pemindaian selesai 09 Mei 2026 · 23:41 WIB",
    tierBadge: "Tier Gratis · Pratinjau",
    langToggle: "EN",
    audiences: ["Direktur", "Manajer IT", "Keuangan", "Auditor"] as string[],
    actionsHeadline: "3 Tindakan Prioritas Minggu Ini",
    actions: [
      {
        level: "TINGGI",
        levelType: "error" as const,
        text: "Aktifkan kebijakan DMARC pada domain Anda.",
        effort: "~1 jam",
      },
      {
        level: "TINGGI",
        levelType: "error" as const,
        text: "Aktifkan MFA pada semua 4 akun admin yang belum terlindungi.",
        effort: "~1 hari",
      },
      {
        level: "SEDANG",
        levelType: "warning" as const,
        text: "Perpanjang retensi log ke 90 hari (minimum OJK).",
        effort: "~1 minggu",
      },
    ],
    exportLeft: "Tier Gratis — pratinjau bertanda air",
    exportLeftSub: "Upgrade untuk PDF bersih siap audit.",
    exportBtn: "Unduh PDF pratinjau",
    ctaHeadline: "Temukan celah. Sekarang tutup celahnya.",
    ctaSub: "Sprint 30-Hari: Rp 35–75 jt — tim kami membantu memperbaiki semua temuan merah.",
    ctaBtn: "Hubungi kami →",
    detailSummary: "Detail teknis",
    statusError: "Berisiko",
    statusWarning: "Perlu Perhatian",
    cards: [
      // Card 1 — Email Security
      {
        id: "email",
        status: "error" as const,
        questions: {
          direktur: "Bisakah penyerang menyamar sebagai email perusahaan Anda?",
          it: "Apakah konfigurasi SPF, DKIM, dan DMARC sudah benar?",
          finance: "Apakah email tagihan kami rentan dipalsukan?",
          auditor: "Apakah kontrol autentikasi email terdokumentasi?",
        },
        findings: {
          direktur:
            "Domain Anda tidak memiliki kebijakan DMARC. Penyerang dapat mengirim email yang tampak berasal dari perusahaan Anda.",
          it: "SPF ditemukan, DKIM tidak ada, DMARC tidak ada. Terapkan kebijakan DMARC p=quarantine segera.",
          finance:
            "Tanpa DMARC, email tagihan perusahaan Anda dapat dipalsukan. Risiko penipuan pembayaran tinggi.",
          auditor:
            "Tidak ada kebijakan DMARC. Kontrol autentikasi email tidak lengkap sesuai ISO 27001.",
        },
        technical: `SPF:   ✓ v=spf1 include:_spf.google.com ~all\nDKIM:  ✗ No selector found\nDMARC: ✗ No _dmarc TXT record`,
      },
      // Card 2 — Exposed Systems
      {
        id: "exposed",
        status: "warning" as const,
        questions: {
          direktur: "Apakah sistem yang menghadap internet Anda terlindungi dari penyerang?",
          it: "Layanan apa yang terekspos dan kerentanan apa yang ada?",
          finance: "Apakah sistem keuangan kami berisiko akibat paparan internet?",
          auditor:
            "Apakah sistem yang terekspos internet terinventarisasi dan diperkuat?",
        },
        findings: {
          direktur:
            "3 layanan memiliki sertifikat SSL kadaluarsa. Port RDP terbuka ke internet.",
          it: "Port 3389 terekspos, sertifikat SSL kadaluarsa di 3 endpoint, tidak ada WAF pada portal pelanggan.",
          finance:
            "Layanan tanpa sertifikat yang valid dapat mengekspos data keuangan pelanggan.",
          auditor:
            "Inventaris aset tidak lengkap, tidak ada bukti WAF, sertifikat SSL tidak dikelola sesuai kebijakan.",
        },
        technical: `Port 3389 (RDP): ✗ Exposed (0.0.0.0/0)\nSSL cert portal.company.id: ✗ Expired 12 days ago\nSSL cert api.company.id:    ✗ Expires in 3 days\nWAF:                        ✗ Not detected`,
      },
      // Card 3 — Evidence Readiness
      {
        id: "evidence",
        status: "error" as const,
        questions: {
          direktur: "Jika diserang, dapatkah kami membuktikan apa yang terjadi?",
          it: "Apakah retensi log kami cukup untuk investigasi insiden?",
          finance:
            "Dapatkah kami memberikan bukti untuk audit regulasi setelah insiden?",
          auditor:
            "Apakah retensi log memenuhi persyaratan minimum OJK 90 hari?",
        },
        findings: {
          direktur:
            "Retensi log hanya 7 hari. Anda tidak dapat merekonstruksi kejadian dari bulan lalu.",
          it: "Retensi log SIEM: 7 hari. OJK POJK 11/2022 mensyaratkan minimum 90 hari. Kesenjangan: 83 hari.",
          finance:
            "Retensi log 7 hari tidak memenuhi kepatuhan OJK. Risiko denda dan gagal audit.",
          auditor:
            "Kebijakan retensi log tidak patuh. Rantai bukti tidak dapat dibuat untuk insiden lebih dari 7 hari lalu.",
        },
        technical: `SIEM log retention:  7 days (current)\nOJK minimum:         90 days (required)\nGap:                 83 days\nAffected sources:    Firewall, SIEM, AD logs`,
      },
      // Card 4 — User Protection
      {
        id: "user",
        status: "warning" as const,
        questions: {
          direktur: "Dapatkah peretas mengambil alih akun admin Anda?",
          it: "Akun admin mana yang tidak memiliki MFA atau memiliki kredensial lemah?",
          finance:
            "Apakah akun tim keuangan terlindungi dari akses tidak sah?",
          auditor:
            "Apakah autentikasi multi-faktor diberlakukan untuk akun istimewa?",
        },
        findings: {
          direktur:
            "4 dari 5 akun admin tidak memiliki MFA. 2 akun tidak mengganti kata sandi selama 180+ hari.",
          it: "Akun: rudi@, admin@, sysadmin@, devops@ — tanpa MFA. 2 akun: usia kata sandi >180 hari.",
          finance:
            "Akun admin tanpa MFA rentan terhadap serangan credential stuffing yang menargetkan sistem keuangan.",
          auditor:
            "MFA tidak diberlakukan pada 80% akun istimewa. Tidak patuh dengan kebijakan kontrol akses.",
        },
        technical: `Admin accounts:   5 total\nMFA enabled:      1 / 5 (20%)\nPassword >180d:   2 accounts\nLast MFA audit:   Not recorded`,
      },
    ],
  },
  en: {
    topbarSub: "Scan completed 09 May 2026 · 23:41 WIB",
    tierBadge: "Free Tier · Preview",
    langToggle: "ID",
    audiences: ["Director", "IT Manager", "Finance", "Auditor"] as string[],
    actionsHeadline: "3 Priority Actions This Week",
    actions: [
      {
        level: "HIGH",
        levelType: "error" as const,
        text: "Enable DMARC policy on your domain.",
        effort: "~1 hour",
      },
      {
        level: "HIGH",
        levelType: "error" as const,
        text: "Enable MFA on all 4 unprotected admin accounts.",
        effort: "~1 day",
      },
      {
        level: "MEDIUM",
        levelType: "warning" as const,
        text: "Extend log retention to 90 days (OJK minimum).",
        effort: "~1 week",
      },
    ],
    exportLeft: "Free Tier — watermarked preview",
    exportLeftSub: "Upgrade for a clean audit-ready PDF.",
    exportBtn: "Download preview PDF",
    ctaHeadline: "Find the gaps. Now close them.",
    ctaSub: "30-Day Sprint: IDR 35–75M — our team helps fix all red findings.",
    ctaBtn: "Contact us →",
    detailSummary: "Technical detail",
    statusError: "At Risk",
    statusWarning: "Needs Attention",
    cards: [
      // Card 1 — Email Security
      {
        id: "email",
        status: "error" as const,
        questions: {
          direktur: "Can attackers impersonate your company's email?",
          it: "Are SPF, DKIM, and DMARC configured correctly?",
          finance: "Are our billing emails vulnerable to spoofing?",
          auditor: "Are email authentication controls documented?",
        },
        findings: {
          direktur:
            "Your domain has no DMARC policy. Attackers can send emails that appear to come from your company.",
          it: "SPF found, DKIM missing, DMARC missing. Apply DMARC p=quarantine policy immediately.",
          finance:
            "Without DMARC, your company's billing emails can be spoofed. High payment fraud risk.",
          auditor:
            "No DMARC policy. Email authentication controls are incomplete per ISO 27001.",
        },
        technical: `SPF:   ✓ v=spf1 include:_spf.google.com ~all\nDKIM:  ✗ No selector found\nDMARC: ✗ No _dmarc TXT record`,
      },
      // Card 2 — Exposed Systems
      {
        id: "exposed",
        status: "warning" as const,
        questions: {
          direktur: "Are your internet-facing systems protected from attackers?",
          it: "What services are exposed and what vulnerabilities exist?",
          finance: "Are our financial systems at risk due to internet exposure?",
          auditor:
            "Are internet-exposed systems inventoried and hardened?",
        },
        findings: {
          direktur:
            "3 services have expired SSL certificates. RDP port is open to the internet.",
          it: "Port 3389 exposed, SSL certificates expired on 3 endpoints, no WAF on customer portal.",
          finance:
            "Services without valid certificates can expose customer financial data.",
          auditor:
            "Incomplete asset inventory, no WAF evidence, SSL certificates not managed per policy.",
        },
        technical: `Port 3389 (RDP): ✗ Exposed (0.0.0.0/0)\nSSL cert portal.company.id: ✗ Expired 12 days ago\nSSL cert api.company.id:    ✗ Expires in 3 days\nWAF:                        ✗ Not detected`,
      },
      // Card 3 — Evidence Readiness
      {
        id: "evidence",
        status: "error" as const,
        questions: {
          direktur: "If attacked, can we prove what happened?",
          it: "Is our log retention sufficient for incident investigation?",
          finance:
            "Can we provide evidence for regulatory audits after an incident?",
          auditor:
            "Does log retention meet OJK's 90-day minimum requirement?",
        },
        findings: {
          direktur:
            "Log retention is only 7 days. You cannot reconstruct events from last month.",
          it: "SIEM log retention: 7 days. OJK POJK 11/2022 requires a minimum of 90 days. Gap: 83 days.",
          finance:
            "7-day log retention does not meet OJK compliance. Risk of fines and failed audits.",
          auditor:
            "Log retention policy is non-compliant. Chain of evidence cannot be established for incidents older than 7 days.",
        },
        technical: `SIEM log retention:  7 days (current)\nOJK minimum:         90 days (required)\nGap:                 83 days\nAffected sources:    Firewall, SIEM, AD logs`,
      },
      // Card 4 — User Protection
      {
        id: "user",
        status: "warning" as const,
        questions: {
          direktur: "Can hackers take over your admin accounts?",
          it: "Which admin accounts lack MFA or have weak credentials?",
          finance:
            "Are finance team accounts protected against unauthorized access?",
          auditor:
            "Is multi-factor authentication enforced for privileged accounts?",
        },
        findings: {
          direktur:
            "4 out of 5 admin accounts do not have MFA. 2 accounts have not changed passwords in 180+ days.",
          it: "Accounts: rudi@, admin@, sysadmin@, devops@ — without MFA. 2 accounts: password age >180 days.",
          finance:
            "Admin accounts without MFA are vulnerable to credential-stuffing attacks targeting financial systems.",
          auditor:
            "MFA is not enforced on 80% of privileged accounts. Non-compliant with access control policy.",
        },
        technical: `Admin accounts:   5 total\nMFA enabled:      1 / 5 (20%)\nPassword >180d:   2 accounts\nLast MFA audit:   Not recorded`,
      },
    ],
  },
};

// ─── Audience key mapping ─────────────────────────────────────────────────────
const AUDIENCE_KEYS: Audience[] = ["direktur", "it", "finance", "auditor"];

// ─── Shared styles ────────────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: "var(--color-surface-container-lowest)",
  borderRadius: "1.5rem",
  boxShadow: "0px 10px 40px rgba(25,28,30,0.06)",
  padding: "1.5rem",
};

const errorBadge: React.CSSProperties = {
  background: "var(--color-error-container)",
  color: "var(--color-error)",
  borderRadius: "9999px",
  padding: "0.2rem 0.75rem",
  fontSize: "0.75rem",
  fontWeight: 600,
  display: "inline-block",
};

const warningBadge: React.CSSProperties = {
  background: "#fef3c7",
  color: "#92400e",
  borderRadius: "9999px",
  padding: "0.2rem 0.75rem",
  fontSize: "0.75rem",
  fontWeight: 600,
  display: "inline-block",
};

const primaryBtn: React.CSSProperties = {
  background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)",
  color: "var(--color-on-primary)",
  borderRadius: "9999px",
  padding: "0.6rem 1.4rem",
  fontWeight: 600,
  fontSize: "0.875rem",
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
};

const ghostBtn: React.CSSProperties = {
  background: "var(--color-surface-container)",
  color: "var(--color-on-surface)",
  borderRadius: "9999px",
  padding: "0.5rem 1.2rem",
  fontWeight: 500,
  fontSize: "0.875rem",
  border: "none",
  cursor: "pointer",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<SSSession | null>(null);
  const [audience, setAudience] = useState<Audience>("direktur");
  const [lang, setLang] = useState<Lang>("id");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sess = getSession();
    if (!sess) {
      router.replace("/login");
      return;
    }
    setSession(sess);

    const savedAudience = localStorage.getItem("ss-audience") as Audience | null;
    if (savedAudience && AUDIENCE_KEYS.includes(savedAudience)) {
      setAudience(savedAudience);
    }

    const savedLang = localStorage.getItem("ss-lang") as Lang | null;
    if (savedLang === "en" || savedLang === "id") {
      setLang(savedLang);
    }

    setLoaded(true);
  }, [router]);

  const handleAudienceChange = (key: Audience) => {
    setAudience(key);
    localStorage.setItem("ss-audience", key);
  };

  const handleLangToggle = () => {
    const next: Lang = lang === "id" ? "en" : "id";
    setLang(next);
    localStorage.setItem("ss-lang", next);
  };

  const t = copy[lang];

  return (
    <div
      style={{
        background: "var(--color-surface)",
        minHeight: "100vh",
        fontFamily: "var(--font-sans)",
        color: "var(--color-on-surface)",
      }}
    >
      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      <header
        style={{
          background: "var(--color-surface-container-low)",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          {loaded && session ? (
            <>
              <h1
                style={{
                  fontFamily: "var(--font-headline)",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "var(--color-on-surface)",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {session.company} — {lang === "id" ? "Laporan Keamanan" : "Security Report"}
              </h1>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--color-on-surface-variant)",
                  margin: "0.2rem 0 0",
                }}
              >
                {t.topbarSub}
              </p>
            </>
          ) : (
            <>
              <div
                style={{
                  height: "1.25rem",
                  width: "220px",
                  background: "var(--color-surface-container-high)",
                  borderRadius: "0.5rem",
                  marginBottom: "0.35rem",
                }}
              />
              <div
                style={{
                  height: "0.875rem",
                  width: "280px",
                  background: "var(--color-surface-container)",
                  borderRadius: "0.5rem",
                }}
              />
            </>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Tier badge */}
          <span
            style={{
              background: "#a1f1e5",
              color: "var(--color-primary)",
              borderRadius: "9999px",
              padding: "0.25rem 0.85rem",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            {t.tierBadge}
          </span>

          {/* Language toggle */}
          <button onClick={handleLangToggle} style={ghostBtn}>
            {t.langToggle}
          </button>
        </div>
      </header>

      {/* ── Scrollable content ───────────────────────────────────────────────── */}
      <main style={{ padding: "2rem" }}>

        {/* ── Audience tabs ─────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "1.75rem",
          }}
        >
          {t.audiences.map((label, idx) => {
            const key = AUDIENCE_KEYS[idx];
            const active = audience === key;
            return (
              <button
                key={key}
                onClick={() => handleAudienceChange(key)}
                style={{
                  background: active
                    ? "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)"
                    : "var(--color-surface-container)",
                  color: active
                    ? "var(--color-on-primary)"
                    : "var(--color-on-surface-variant)",
                  borderRadius: "9999px",
                  padding: "0.5rem 1.25rem",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* ── 4 X-Ray Cards ─────────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {t.cards.map((card) => {
            const question = card.questions[audience];
            const finding = card.findings[audience];
            const isError = card.status === "error";
            const statusLabel = isError ? t.statusError : t.statusWarning;
            const badgeStyle = isError ? errorBadge : warningBadge;

            return (
              <div key={card.id} style={cardStyle}>
                {/* Question headline */}
                <h2
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "var(--color-on-surface)",
                    margin: "0 0 0.75rem",
                    lineHeight: 1.4,
                  }}
                >
                  {question}
                </h2>

                {/* Status badge */}
                <span style={badgeStyle}>{statusLabel}</span>

                {/* Finding */}
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9rem",
                    color: "var(--color-on-surface-variant)",
                    lineHeight: 1.6,
                    margin: "0.85rem 0 1rem",
                  }}
                >
                  {finding}
                </p>

                {/* Collapsible technical detail */}
                <details
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-on-surface-variant)",
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontWeight: 500,
                      userSelect: "none",
                      color: "var(--color-outline)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {t.detailSummary}
                  </summary>
                  <pre
                    style={{
                      background: "var(--color-surface-container-low)",
                      borderRadius: "0.75rem",
                      padding: "0.875rem 1rem",
                      fontSize: "0.75rem",
                      lineHeight: 1.7,
                      overflowX: "auto",
                      margin: 0,
                      fontFamily: "monospace",
                      color: "var(--color-on-surface)",
                    }}
                  >
                    {card.technical}
                  </pre>
                </details>
              </div>
            );
          })}
        </div>

        {/* ── Top 3 Actions Panel ───────────────────────────────────────────── */}
        <div style={{ ...cardStyle, marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-headline)",
              fontWeight: 700,
              fontSize: "1.125rem",
              color: "var(--color-on-surface)",
              margin: "0 0 1.25rem",
            }}
          >
            {t.actionsHeadline}
          </h2>

          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
            {t.actions.map((action, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "0.875rem 1rem",
                  borderRadius: "1rem",
                  background: "var(--color-surface-container-low)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLLIElement).style.background =
                    "var(--color-surface-container-low)";
                }}
              >
                {/* Number */}
                <span
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    color: "var(--color-outline)",
                    lineHeight: 1,
                    minWidth: "1.5rem",
                    paddingTop: "0.1rem",
                  }}
                >
                  {i + 1}
                </span>

                {/* Badge */}
                <span
                  style={
                    action.levelType === "error" ? errorBadge : warningBadge
                  }
                >
                  {action.level}
                </span>

                {/* Text */}
                <span
                  style={{
                    flex: 1,
                    fontSize: "0.9rem",
                    color: "var(--color-on-surface)",
                    lineHeight: 1.5,
                  }}
                >
                  {action.text}
                </span>

                {/* Effort */}
                <span
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-outline)",
                    whiteSpace: "nowrap",
                    paddingTop: "0.1rem",
                  }}
                >
                  {action.effort}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* ── Export bar ────────────────────────────────────────────────────── */}
        <div
          style={{
            ...cardStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-on-surface)",
                margin: 0,
              }}
            >
              {t.exportLeft}
            </p>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--color-on-surface-variant)",
                margin: "0.2rem 0 0",
              }}
            >
              {t.exportLeftSub}
            </p>
          </div>
          <button style={ghostBtn}>{t.exportBtn}</button>
        </div>

        {/* ── Upgrade CTA banner ────────────────────────────────────────────── */}
        <div
          style={{
            ...cardStyle,
            background: "rgba(161,241,229,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-headline)",
                fontWeight: 700,
                fontSize: "1.0625rem",
                color: "var(--color-on-surface)",
                margin: "0 0 0.3rem",
              }}
            >
              {t.ctaHeadline}
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--color-on-surface-variant)",
                margin: 0,
                maxWidth: "520px",
              }}
            >
              {t.ctaSub}
            </p>
          </div>
          <a href="mailto:sales@shannondynamics.id" style={primaryBtn}>
            {t.ctaBtn}
          </a>
        </div>

      </main>
    </div>
  );
}
