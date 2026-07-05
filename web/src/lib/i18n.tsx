import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Lang = "en" | "id"

interface I18nContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (en: string, id: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(
    () => (localStorage.getItem("ss-lang") as Lang) || "id"
  )

  useEffect(() => {
    localStorage.setItem("ss-lang", lang)
  }, [lang])

  const setLang = (l: Lang) => setLangState(l)
  const t = (en: string, id: string) => (lang === "en" ? en : id)

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
