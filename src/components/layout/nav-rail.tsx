"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  DashboardSquare01Icon,
  Invoice01Icon,
  BankIcon,
  PiggyBankIcon,
  Compass01Icon,
  Analytics01Icon,
  Settings01Icon,
  ViewIcon,
  ViewOffSlashIcon,
  Sun01Icon,
  Moon02Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/ui/icon"
import { usePrivacy, useTheme } from "@/components/providers"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SureLogo } from "@/components/ui/sure-logo"
import { signOut } from "@/lib/auth-client"

export function NavRail() {
  const pathname = usePathname()
  const router = useRouter()
  const { isPrivacyMode, togglePrivacyMode } = usePrivacy()
  const { isDark, toggleTheme } = useTheme()

  const navItems = [
    { label: "Dashboard", href: "/", icon: DashboardSquare01Icon },
    { label: "Transactions", href: "/transactions", icon: Invoice01Icon },
    { label: "Accounts", href: "/accounts", icon: BankIcon },
    { label: "Budgets", href: "/budgets", icon: PiggyBankIcon },
    { label: "Goals", href: "/goals", icon: Compass01Icon },
    { label: "Reports", href: "/reports", icon: Analytics01Icon },
    { label: "Settings", href: "/settings", icon: Settings01Icon },
  ]

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/login")
      router.refresh()
    } catch (e) {
      console.error("Sign out failed", e)
      router.push("/login")
    }
  }

  return (
    <aside className="w-[72px] shrink-0 border-r border-border bg-sidebar flex flex-col items-center py-4 justify-between z-30 select-none">
      {/* Top: Official Sure Logo */}
      <div className="flex flex-col items-center gap-6">
        <Link
          href="/"
          className="size-11 rounded-xl bg-card border border-border/80 flex items-center justify-center p-2 shadow-xs hover:border-primary/50 transition-all group"
          title="Sure - Personal Finance"
        >
          <SureLogo size={26} className="transition-transform group-hover:scale-105" />
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col items-center gap-1.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)
            const icon = item.icon

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger
                  render={
                    <Link
                      href={item.href}
                      className={cn(
                        "size-10 rounded-lg flex items-center justify-center transition-all duration-150",
                        isActive
                          ? "bg-secondary text-foreground shadow-xs font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    />
                  }
                >
                  <Icon icon={icon} size={20} />
                  <span className="sr-only">{item.label}</span>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </div>

      {/* Bottom Actions: Privacy Mode, Theme Toggle, Settings, Logout */}
      <div className="flex flex-col items-center gap-2">
        <Tooltip>
          <TooltipTrigger
            onClick={togglePrivacyMode}
            className={cn(
              "size-10 rounded-lg flex items-center justify-center transition-colors cursor-pointer",
              isPrivacyMode
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Icon icon={isPrivacyMode ? ViewOffSlashIcon : ViewIcon} size={20} />
            <span className="sr-only">Toggle Privacy Mode</span>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            {isPrivacyMode ? "Disable Privacy Mode" : "Enable Privacy Mode"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            onClick={toggleTheme}
            className="size-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <Icon icon={isDark ? Sun01Icon : Moon02Icon} size={20} />
            <span className="sr-only">Toggle Theme</span>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </TooltipContent>
        </Tooltip>

        {/* Logout Button */}
        <Tooltip>
          <TooltipTrigger
            onClick={handleLogout}
            className="size-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <Icon icon={Logout01Icon} size={20} />
            <span className="sr-only">Log Out</span>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            Log Out
          </TooltipContent>
        </Tooltip>

        {/* User Account Avatar */}
        <Link
          href="/settings"
          className="size-9 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold hover:ring-2 hover:ring-primary/20 transition-all mt-1"
          title="Household & Settings"
        >
          BD
        </Link>
      </div>
    </aside>
  )
}
