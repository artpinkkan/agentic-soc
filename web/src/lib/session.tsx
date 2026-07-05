import { createContext, useContext, useState, type ReactNode } from "react"

export type Tier = "free" | "sprint" | "mdr_ai"

export interface DemoAccount {
  email: string
  name: string
  company: string
  tier: Tier
  tierLabel: { en: string; id: string }
}

export const DEMO_ACCOUNTS: Record<Tier, DemoAccount> = {
  free: {
    email: "rudi@contoh.co.id",
    name: "Rudi Hartono",
    company: "Contoh Corp",
    tier: "free",
    tierLabel: { en: "Free Tier", id: "Tier Gratis" },
  },
  sprint: {
    email: "sari@berkembang.co.id",
    name: "Sari Wulandari",
    company: "Berkembang Corp",
    tier: "sprint",
    tierLabel: { en: "Sprint", id: "Sprint" },
  },
  mdr_ai: {
    email: "budi@majuindustri.co.id",
    name: "Budi Santoso",
    company: "Maju Industri",
    tier: "mdr_ai",
    tierLabel: { en: "MDR AI Active", id: "MDR AI Aktif" },
  },
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

interface SessionContextValue {
  account: DemoAccount
  accounts: DemoAccount[]
  switchAccount: (tier: Tier) => void
  initials: (name: string) => string
}

const SessionContext = createContext<SessionContextValue | null>(null)

const STORAGE_KEY = "ss-session-tier"

export function SessionProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<Tier>(
    () => (sessionStorage.getItem(STORAGE_KEY) as Tier) || "mdr_ai"
  )

  const switchAccount = (nextTier: Tier) => {
    sessionStorage.setItem(STORAGE_KEY, nextTier)
    setTier(nextTier)
  }

  return (
    <SessionContext.Provider
      value={{
        account: DEMO_ACCOUNTS[tier],
        accounts: Object.values(DEMO_ACCOUNTS),
        switchAccount,
        initials,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error("useSession must be used within SessionProvider")
  return ctx
}
