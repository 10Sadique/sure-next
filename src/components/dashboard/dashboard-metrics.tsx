"use client"

import { usePrivacy } from "@/components/providers"
import { Card, CardContent } from "@/components/ui/card"
import {
  TradeUpIcon,
  BankIcon,
  CreditCardIcon,
  ArrowDownLeft01Icon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/ui/icon"

interface DashboardMetricsProps {
  netWorth: number
  totalAssets: number
  totalLiabilities: number
  totalInflows: number
  totalOutflows: number
}

export function DashboardMetrics({
  netWorth,
  totalAssets,
  totalLiabilities,
  totalInflows,
  totalOutflows,
}: DashboardMetricsProps) {
  const { formatMoney } = usePrivacy()
  const netSavings = totalInflows - totalOutflows
  const savingsRate =
    totalInflows > 0 ? Math.round((netSavings / totalInflows) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Net Worth */}
      <Card className="bg-card/70 border-border">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Net Worth</span>
            <div className="size-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Icon icon={TradeUpIcon} size={15} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {formatMoney(netWorth)}
            </div>
            <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
              {netWorth >= 0 ? "Total net asset value" : "Net total liabilities"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Assets */}
      <Card className="bg-card/70 border-border">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Assets</span>
            <div className="size-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Icon icon={BankIcon} size={15} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {formatMoney(totalAssets)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Across cash, investments & property
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Total Liabilities */}
      <Card className="bg-card/70 border-border">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Debt</span>
            <div className="size-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Icon icon={CreditCardIcon} size={15} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
              {formatMoney(totalLiabilities)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Cards, loans & mortgage
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Monthly Net Savings / Cashflow */}
      <Card className="bg-card/70 border-border">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">October Savings</span>
            <div className="size-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Icon icon={ArrowDownLeft01Icon} size={15} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {formatMoney(netSavings)}
            </div>
            <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
              {totalInflows > 0 ? `${savingsRate}% savings rate` : "No income recorded this month"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
