export interface SSSession {
  email: string;
  name: string;
  company: string;
  slug: string;
  tier: "free" | "sprint" | "mdr";
  state: string;
  setupComplete: boolean;
}

export function getSession(): SSSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("ss-session");
    return raw ? (JSON.parse(raw) as SSSession) : null;
  } catch {
    return null;
  }
}

export function mockLogin(email: string, password: string): SSSession | null {
  if (!email || !password) return null;
  const localPart = email.split("@")[0];
  const name = localPart
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const domain = email.includes("@")
    ? email.split("@")[1].split(".")[0]
    : "perusahaan";
  const company =
    domain.charAt(0).toUpperCase() + domain.slice(1);
  const session: SSSession = {
    email,
    name,
    company,
    slug: domain.toLowerCase().replace(/\s+/g, "-"),
    tier: "free",
    state: "free_active",
    setupComplete: true,
  };
  sessionStorage.setItem("ss-session", JSON.stringify(session));
  return session;
}

export function logout(): void {
  sessionStorage.removeItem("ss-session");
}
