import Link from "next/link"
import {
  BankIcon,
  CreditCardIcon,
  Building01Icon,
  Car01Icon,
  TradeUpIcon,
  Coins01Icon,
  ChevronRightIcon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/ui/icon"
import { getAccountsData } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AccountsHeaderActions } from "@/components/accounts/accounts-header-actions"

function formatAmount(val: number): string {
  const abs = Math.abs(val)
  const parts = abs.toFixed(2).split(".")
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return parts.join(".")
}

export default async function AccountsPage() {
  const data = await getAccountsData()
  const currencySymbol = data.family?.currency === "BDT" ? "৳" : "$"

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
    <div className="max-w-6xl mx-auto space-y-6" suppressHydrationWarning>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Financial Accounts
          </h2>
          <p className="text-xs text-muted-foreground">
            Overview of all depository, investment, property, credit card, and loan accounts.
          </p>
        </div>
        <AccountsHeaderActions />
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <span className="text-xs text-muted-foreground font-medium">Net Worth</span>
          <div className="text-xl font-bold tracking-tight mt-1 text-foreground">
            {currencySymbol}{formatAmount(data.netWorth)}
          </div>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-muted-foreground font-medium">Total Assets</span>
          <div className="text-xl font-bold tracking-tight mt-1 text-emerald-600 dark:text-emerald-400">
            {currencySymbol}{formatAmount(data.totalAssets)}
          </div>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-muted-foreground font-medium">Total Debt</span>
          <div className="text-xl font-bold tracking-tight mt-1 text-rose-600 dark:text-rose-400">
            {currencySymbol}{formatAmount(data.totalLiabilities)}
          </div>
        </Card>
      </div>

      {/* ASSETS SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span>Assets</span>
            <Badge variant="secondary" className="text-[10px]">
              {data.assets.length}
            </Badge>
          </h3>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {currencySymbol}{formatAmount(data.totalAssets)}
          </span>
        </div>

        {data.assets.length === 0 ? (
          <div className="py-8 text-center border border-dashed rounded-xl border-border bg-muted/20 text-xs text-muted-foreground">
            No asset accounts added yet. Click &quot;Add Account&quot; to connect or track your bank, cash, or investments.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.assets.map((acc: any) => {
              const icon = getAccountIcon(acc.type)
              return (
                <Link key={acc.id} href={`/accounts/${acc.id}`}>
                  <Card className="hover:border-primary/40 hover:shadow-xs transition-all cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Icon icon={icon} size={18} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs text-foreground truncate max-w-[140px]">
                            {acc.name}
                          </h4>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {acc.institutionName || acc.subtype || "Manual Account"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-xs text-foreground">
                          {currencySymbol}{formatAmount(Number(acc.balance))}
                        </div>
                        <span className="text-[10px] text-muted-foreground flex items-center justify-end gap-1 mt-0.5">
                          {acc._count?.transactions ?? 0} txns
                          <Icon icon={ChevronRightIcon} size={12} />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* LIABILITIES SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span>Liabilities</span>
            <Badge variant="secondary" className="text-[10px]">
              {data.liabilities.length}
            </Badge>
          </h3>
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            {currencySymbol}{formatAmount(data.totalLiabilities)}
          </span>
        </div>

        {data.liabilities.length === 0 ? (
          <div className="py-8 text-center border border-dashed rounded-xl border-border bg-muted/20 text-xs text-muted-foreground">
            No debt or liability accounts recorded.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.liabilities.map((acc: any) => {
              const icon = getAccountIcon(acc.type)
              return (
                <Link key={acc.id} href={`/accounts/${acc.id}`}>
                  <Card className="hover:border-rose-500/40 hover:shadow-xs transition-all cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                          <Icon icon={icon} size={18} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs text-foreground truncate max-w-[140px]">
                            {acc.name}
                          </h4>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {acc.institutionName || acc.subtype || "Debt"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-xs text-rose-600 dark:text-rose-400">
                          {currencySymbol}{formatAmount(Number(acc.balance))}
                        </div>
                        <span className="text-[10px] text-muted-foreground flex items-center justify-end gap-1 mt-0.5">
                          {acc._count?.transactions ?? 0} txns
                          <Icon icon={ChevronRightIcon} size={12} />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
