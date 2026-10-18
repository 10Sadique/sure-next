"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  Add01Icon,
  BankIcon,
  CreditCardIcon,
  Building01Icon,
  Car01Icon,
  TradeUpIcon,
  Coins01Icon,
  SidebarLeftIcon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/ui/icon"
import { usePrivacy, useSidebar } from "@/components/providers"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AddAccountDialog } from "@/components/accounts/add-account-dialog"
import { AccountClassification } from "@prisma/client"
import { SerializedAccount } from "@/lib/serialize"

interface AccountsSidebarProps {
  accounts: (SerializedAccount | any)[]
}

export function AccountsSidebar({ accounts }: AccountsSidebarProps) {
  const pathname = usePathname()
  const { formatMoney } = usePrivacy()
  const { isAccountsSidebarOpen, toggleAccountsSidebar } = useSidebar()
  const [assetsOpen, setAssetsOpen] = useState(true)
  const [liabilitiesOpen, setLiabilitiesOpen] = useState(true)
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)

  const assets = accounts.filter(
    (a) => a.classification === AccountClassification.ASSET || a.classification === "ASSET"
  )
  const liabilities = accounts.filter(
    (a) => a.classification === AccountClassification.LIABILITY || a.classification === "LIABILITY"
  )

  const totalAssets = assets.reduce((sum, a) => sum + Number(a.balance), 0)
  const totalLiabilities = liabilities.reduce(
    (sum, a) => sum + Math.abs(Number(a.balance)),
    0
  )
  const netWorth = totalAssets - totalLiabilities

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "DEPOSITORY":
        return BankIcon
      case "INVESTMENT":
        return TradeUpIcon
      case "CRYPTO":
        return Coins01Icon
      case "PROPERTY":
        return Building01Icon
      case "VEHICLE":
        return Car01Icon
      case "CREDIT_CARD":
      case "LOAN":
      default:
        return CreditCardIcon
    }
  }

  return (
    <aside
      className={cn(
        "transition-all duration-300 ease-in-out shrink-0 bg-card overflow-hidden select-none border-border",
        isAccountsSidebarOpen
          ? "w-72 border-r opacity-100"
          : "w-0 border-r-0 opacity-0 pointer-events-none"
      )}
    >
      <div className="w-72 h-full flex flex-col">
        {/* Header & Net Worth Overview */}
        <div className="p-4 border-b border-border/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Net Worth
            </span>
            <button
              onClick={toggleAccountsSidebar}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted cursor-pointer transition-colors"
              title="Collapse Accounts Sidebar"
            >
              <Icon icon={SidebarLeftIcon} size={15} />
            </button>
          </div>

          <div className="text-xl font-semibold tracking-tight text-foreground">
            {formatMoney(netWorth)}
          </div>

          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <div>
              Assets:{" "}
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {formatMoney(totalAssets)}
              </span>
            </div>
            <div>
              Debt:{" "}
              <span className="font-medium text-rose-600 dark:text-rose-400">
                {formatMoney(totalLiabilities)}
              </span>
            </div>
          </div>
        </div>

        {/* Accounts List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* ASSETS SECTION */}
          <div>
            <button
              onClick={() => setAssetsOpen(!assetsOpen)}
              className="w-full flex items-center justify-between py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Icon
                  icon={assetsOpen ? ChevronDownIcon : ChevronRightIcon}
                  size={14}
                  className="text-muted-foreground"
                />
                Assets ({assets.length})
              </span>
              <span className="text-[11px] font-normal text-muted-foreground">
                {formatMoney(totalAssets)}
              </span>
            </button>

            {assetsOpen && (
              <div className="mt-1 space-y-0.5 pl-1">
                {assets.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground/70 py-1.5 px-2">No asset accounts yet</p>
                ) : (
                  assets.map((acc) => {
                    const icon = getAccountIcon(acc.type)
                    const isActive = pathname === `/accounts/${acc.id}`

                    return (
                      <Link
                        key={acc.id}
                        href={`/accounts/${acc.id}`}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors",
                          isActive
                            ? "bg-secondary text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <Icon icon={icon} size={15} className="shrink-0 text-muted-foreground" />
                          <span className="truncate">{acc.name}</span>
                        </div>
                        <span className="shrink-0 font-medium text-foreground">
                          {formatMoney(Number(acc.balance))}
                        </span>
                      </Link>
                    )
                  })
                )}
              </div>
            )}
          </div>

          {/* LIABILITIES SECTION */}
          <div>
            <button
              onClick={() => setLiabilitiesOpen(!liabilitiesOpen)}
              className="w-full flex items-center justify-between py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Icon
                  icon={liabilitiesOpen ? ChevronDownIcon : ChevronRightIcon}
                  size={14}
                  className="text-muted-foreground"
                />
                Liabilities ({liabilities.length})
              </span>
              <span className="text-[11px] font-normal text-muted-foreground">
                {formatMoney(totalLiabilities)}
              </span>
            </button>

            {liabilitiesOpen && (
              <div className="mt-1 space-y-0.5 pl-1">
                {liabilities.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground/70 py-1.5 px-2">No debt accounts yet</p>
                ) : (
                  liabilities.map((acc) => {
                    const icon = getAccountIcon(acc.type)
                    const isActive = pathname === `/accounts/${acc.id}`

                    return (
                      <Link
                        key={acc.id}
                        href={`/accounts/${acc.id}`}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors",
                          isActive
                            ? "bg-secondary text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <Icon icon={icon} size={15} className="shrink-0 text-muted-foreground" />
                          <span className="truncate">{acc.name}</span>
                        </div>
                        <span className="shrink-0 font-medium text-rose-600 dark:text-rose-400">
                          {formatMoney(Number(acc.balance))}
                        </span>
                      </Link>
                    )
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Add Account Button */}
        <div className="p-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center gap-1.5 text-xs h-8 cursor-pointer"
            onClick={() => setIsAddAccountOpen(true)}
          >
            <Icon icon={Add01Icon} size={14} />
            Add Account
          </Button>
        </div>

        {/* Add Account Dialog */}
        <AddAccountDialog
          open={isAddAccountOpen}
          onOpenChange={setIsAddAccountOpen}
        />
      </div>
    </aside>
  )
}
