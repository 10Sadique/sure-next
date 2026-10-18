"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  SidebarLeftIcon,
  Add01Icon,
  ViewIcon,
  ViewOffSlashIcon,
  Calendar01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/ui/icon"
import { usePrivacy, useSidebar } from "@/components/providers"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog"
import { signOut } from "@/lib/auth-client"
import { SerializedAccount, SerializedCategory } from "@/lib/serialize"

interface TopHeaderProps {
  title?: string
  accounts: (SerializedAccount | any)[]
  categories: (SerializedCategory | any)[]
}

export function TopHeader({
  title = "Dashboard",
  accounts,
  categories,
}: TopHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isPrivacyMode, togglePrivacyMode } = usePrivacy()
  const { isAccountsSidebarOpen, toggleAccountsSidebar } = useSidebar()
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Construct dynamic breadcrumb trail based on current path
  const segments = (pathname || "/").split("/").filter(Boolean)

  const labelMap: Record<string, string> = {
    accounts: "Accounts",
    transactions: "Transactions",
    budgets: "Budgets",
    goals: "Goals",
    reports: "Reports",
    settings: "Settings",
  }

  const breadcrumbs: { label: string; href: string; isCurrent: boolean }[] = []

  if (segments.length === 0) {
    breadcrumbs.push({ label: "Dashboard", href: "/", isCurrent: true })
  } else {
    // Root dashboard
    breadcrumbs.push({ label: "Dashboard", href: "/", isCurrent: false })

    const firstSegment = segments[0]
    if (segments.length === 1) {
      const label = labelMap[firstSegment] || title || firstSegment
      breadcrumbs.push({ label, href: `/${firstSegment}`, isCurrent: true })
    } else if (segments.length === 2 && firstSegment === "accounts") {
      breadcrumbs.push({ label: "Accounts", href: "/accounts", isCurrent: false })
      const accountId = segments[1]
      const foundAccount = accounts.find((acc) => acc.id === accountId)
      breadcrumbs.push({
        label: foundAccount?.name || "Account Detail",
        href: `/accounts/${accountId}`,
        isCurrent: true,
      })
    } else {
      let currentPath = ""
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i]
        currentPath += `/${seg}`
        const isCurrent = i === segments.length - 1
        const label = labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1)
        breadcrumbs.push({
          label,
          href: currentPath,
          isCurrent,
        })
      }
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Failed to sign out:", error)
      router.push("/login")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="h-14 border-b border-border bg-card/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Accounts Sidebar Trigger & Functional Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Sidebar Trigger placed BEFORE top nav breadcrumb */}
        <button
          onClick={toggleAccountsSidebar}
          className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          title={isAccountsSidebarOpen ? "Collapse accounts sidebar" : "Expand accounts sidebar"}
          aria-label="Toggle accounts sidebar"
        >
          <Icon icon={SidebarLeftIcon} size={18} />
        </button>

        {/* Functional Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1
              return (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-sm font-semibold text-foreground">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        render={<Link href={crumb.href} />}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md ml-1 select-none">
          <Icon icon={Calendar01Icon} size={14} />
          <span>October 2026</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Privacy Mode Toggle */}
        <button
          onClick={togglePrivacyMode}
          className={`h-8 px-2.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            isPrivacyMode
              ? "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400"
              : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
          title="Privacy Mode"
        >
          {isPrivacyMode ? (
            <>
              <Icon icon={ViewOffSlashIcon} size={15} />
              <span className="hidden sm:inline">Hidden</span>
            </>
          ) : (
            <>
              <Icon icon={ViewIcon} size={15} />
              <span className="hidden sm:inline">Visible</span>
            </>
          )}
        </button>

        {/* Quick Add Transaction */}
        <Button
          size="sm"
          className="h-8 gap-1.5 text-xs font-medium cursor-pointer"
          onClick={() => setIsAddTransactionOpen(true)}
        >
          <Icon icon={Add01Icon} size={15} />
          <span className="hidden sm:inline">Transaction</span>
        </Button>

        {/* Logout Option */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          title="Log out of Sure"
        >
          <Icon icon={Logout01Icon} size={15} />
          <span className="hidden sm:inline">{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </Button>
      </div>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        accounts={accounts}
        categories={categories}
      />
    </header>
  )
}
