import { useState } from "react"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  Shield,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  FileSearch,
  FileText,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  ChevronsUpDown,
  ChevronRight,
  ChevronDown,
  Check,
  LogOut,
  Search,
  Bell,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { useSession } from "@/lib/session"

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, en: "Dashboard", id: "Dasbor" },
  { to: "/investigate", icon: MessageSquare, en: "Investigate", id: "Investigasi" },
  { to: "/triage", icon: ListChecks, en: "Triage", id: "Triase" },
  { to: "/reports", icon: FileText, en: "Reports", id: "Laporan" },
  { to: "/sse", icon: ShieldAlert, en: "Prevention Edge", id: "Edge Pencegahan" },
]

const AI_OVERSIGHT_ITEMS = [
  { to: "/inspector", icon: FileSearch, en: "Inspector", id: "Inspektor" },
  { to: "/ai-governance", icon: ScrollText, en: "AI Governance", id: "Tata Kelola AI" },
]

const ALL_NAV_ITEMS = [...NAV_ITEMS, ...AI_OVERSIGHT_ITEMS]

export function AppShell() {
  const { lang, setLang, t } = useI18n()
  const { account, accounts, switchAccount, initials } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const currentItem = ALL_NAV_ITEMS.find((item) => item.to === location.pathname)
  const isAiOversightRoute = AI_OVERSIGHT_ITEMS.some((item) => item.to === location.pathname)
  const [oversightOpen, setOversightOpen] = useState(isAiOversightRoute)

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <Shield className="size-5 text-primary shrink-0" />
            <span className="font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
              Shannon Sentinel
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t("Security Operations", "Operasi Keamanan")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild tooltip={t(item.en, item.id)}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          isActive ? "font-medium text-primary" : ""
                        }
                      >
                        <item.icon />
                        <span>{t(item.en, item.id)}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={t("AI Oversight", "Pengawasan AI")}
                    onClick={() => setOversightOpen((v) => !v)}
                    className={isAiOversightRoute ? "font-medium text-primary" : ""}
                  >
                    <ShieldCheck />
                    <span>{t("AI Oversight", "Pengawasan AI")}</span>
                    <ChevronDown
                      className={`ml-auto size-4 transition-transform ${oversightOpen ? "rotate-180" : ""}`}
                    />
                  </SidebarMenuButton>
                  {oversightOpen && (
                    <SidebarMenuSub>
                      {AI_OVERSIGHT_ITEMS.map((item) => (
                        <SidebarMenuSubItem key={item.to}>
                          <SidebarMenuSubButton asChild>
                            <NavLink
                              to={item.to}
                              className={({ isActive }) =>
                                isActive ? "font-medium text-primary" : ""
                              }
                            >
                              <item.icon />
                              <span>{t(item.en, item.id)}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {account.tier === "free" && (
            <div className="mx-2 mb-2 flex flex-col gap-1.5 rounded-md border bg-muted/40 p-2.5 group-data-[collapsible=icon]:hidden">
              <p className="text-xs text-muted-foreground">
                {t("You're on Free Tier", "Anda di Tier Gratis")}
              </p>
              <Button asChild size="sm" className="h-7 text-xs">
                <NavLink to="/pricing">{t("See paid plans →", "Lihat paket berbayar →")}</NavLink>
              </Button>
            </div>
          )}
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar size="sm">
                      <AvatarFallback>{initials(account.name)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{account.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {account.company}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64"
                  align="end"
                  side="top"
                  sideOffset={4}
                >
                  <div className="flex flex-col gap-1.5 px-2 py-1.5">
                    <div className="min-w-0">
                      <span className="text-xs text-muted-foreground">
                        {t("Signed in as", "Masuk sebagai")}
                      </span>
                      <p className="truncate text-sm font-medium">{account.email}</p>
                    </div>
                    <Badge className="w-fit whitespace-nowrap">
                      {t(account.tierLabel.en, account.tierLabel.id)}
                    </Badge>
                  </div>
                  <DropdownMenuSeparator />
                  {accounts.map((acc) => (
                    <DropdownMenuItem
                      key={acc.tier}
                      className="gap-2"
                      onSelect={() => switchAccount(acc.tier)}
                    >
                      <Avatar size="sm">
                        <AvatarFallback>{initials(acc.name)}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 leading-tight">
                        <span className="truncate text-sm">{acc.name}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {acc.company} · {t(acc.tierLabel.en, acc.tierLabel.id)}
                        </span>
                      </div>
                      {acc.tier === account.tier && (
                        <Check className="size-4 text-primary shrink-0" />
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate("/login")}>
                    <LogOut className="size-4" />
                    {t("Sign out", "Keluar")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
          <Separator className="mb-2" />
          <div className="flex items-center justify-between px-2 pb-1 group-data-[collapsible=icon]:hidden">
            <Badge variant={account.tier === "free" ? "outline" : "secondary"} className="text-[10px]">
              {t(account.tierLabel.en, account.tierLabel.id)}
            </Badge>
            <div className="flex gap-1">
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
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <div className="flex items-center gap-1.5 text-sm min-w-0">
            <NavLink to="/dashboard" className="text-muted-foreground truncate hover:text-foreground hover:underline">
              {account.company}
            </NavLink>
            <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
            <NavLink
              to={currentItem?.to ?? "/dashboard"}
              className="font-medium truncate hover:underline"
            >
              {currentItem ? t(currentItem.en, currentItem.id) : t("Dashboard", "Dasbor")}
            </NavLink>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="hidden sm:flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground w-56 hover:bg-muted/70 transition-colors"
            >
              <Search className="size-3.5 shrink-0" />
              <span className="flex-1 text-left truncate">{t("Search", "Cari")}</span>
              <kbd className="text-[10px] font-medium bg-background border rounded px-1 py-0.5 shrink-0">
                ⌘K
              </kbd>
            </button>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="size-4" />
              <span className="absolute top-2 right-2 size-1.5 rounded-full bg-red-600" />
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 min-h-0 min-w-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
