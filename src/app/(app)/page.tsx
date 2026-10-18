import Link from "next/link"
import {
  TradeUpIcon,
  ArrowUpRight01Icon,
  ArrowDownRight01Icon,
  Invoice01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/ui/icon"
import { getDashboardData } from "@/lib/data"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NetWorthChart } from "@/components/dashboard/net-worth-chart"
import { MoneyFlowChart } from "@/components/dashboard/money-flow-chart"
import { SpendingDonutChart } from "@/components/dashboard/spending-donut-chart"
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics"
import { CashflowSankey } from "@/components/dashboard/cashflow-sankey"

function formatAmount(val: number): string {
  const abs = Math.abs(val)
  const parts = abs.toFixed(2).split(".")
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return parts.join(".")
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  const currencySymbol = data.family?.currency === "BDT" ? "৳" : "$"

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12" suppressHydrationWarning>
      {/* 1. Header Overview Metrics */}
      <DashboardMetrics
        netWorth={data.netWorth}
        totalAssets={data.totalAssets}
        totalLiabilities={data.totalLiabilities}
        totalInflows={data.totalInflows}
        totalOutflows={data.totalOutflows}
      />

      {/* 2. Official Sure Cash Flow Diagram (Sankey Flow) */}
      <CashflowSankey
        totalInflows={data.totalInflows}
        totalOutflows={data.totalOutflows}
        incomeBreakdown={data.incomeBreakdown || []}
        expenseBreakdown={data.categoryBreakdown || []}
        accounts={data.accounts}
        categories={data.categories}
      />

      {/* 3. Primary Charts Grid: Net Worth Evolution & Money Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Net Worth Progression */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Net Worth Evolution</CardTitle>
              <CardDescription>Historical balance progression</CardDescription>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <Icon icon={TradeUpIcon} size={14} />
              <span>{currencySymbol}{formatAmount(data.netWorth)}</span>
            </div>
          </CardHeader>
          <CardContent>
            <NetWorthChart data={data.netWorthHistory} />
          </CardContent>
        </Card>

        {/* Money Flow (Income vs Expenses) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Monthly Money Flow</CardTitle>
              <CardDescription>Past 6 months comparison</CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2 rounded-full bg-emerald-500" /> Inflows
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2 rounded-full bg-rose-500" /> Outflows
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <MoneyFlowChart data={data.cashflowHistory} />
          </CardContent>
        </Card>
      </div>

      {/* 4. Secondary Grid: Outflows Breakdown & Balance Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outflows by Category */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Current month expense distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <SpendingDonutChart data={data.categoryBreakdown} />
          </CardContent>
        </Card>

        {/* Balance Sheet Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Balance Sheet</CardTitle>
            <CardDescription>Assets versus Liabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Assets</span>
                <span className="font-semibold text-foreground">
                  {currencySymbol}{formatAmount(data.totalAssets)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "100%" }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Liabilities (Debt)</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  {currencySymbol}{formatAmount(data.totalLiabilities)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{
                    width: `${data.totalAssets > 0
                      ? Math.min(Math.round((data.totalLiabilities / data.totalAssets) * 100), 100)
                      : data.totalLiabilities > 0 ? 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Debt-to-Asset Ratio</span>
              <span className="font-semibold text-foreground">
                {data.totalAssets > 0
                  ? `${((data.totalLiabilities / data.totalAssets) * 100).toFixed(1)}%`
                  : "0.0%"}
              </span>
            </div>

            <Link
              href="/accounts"
              className="mt-2 inline-flex items-center justify-center gap-1.5 text-xs text-primary hover:underline font-medium w-full pt-1"
            >
              <span>View all accounts</span>
              <Icon icon={ArrowRight01Icon} size={14} />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* 5. Recent Transactions Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Activity across all connected and manual accounts</CardDescription>
          </div>
          <Link
            href="/transactions"
            className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
          >
            <span>See all</span>
            <Icon icon={ArrowRight01Icon} size={14} />
          </Link>
        </CardHeader>
        <CardContent>
          {data.recentTransactions.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
              <Icon icon={Invoice01Icon} size={32} className="text-muted-foreground/40" />
              <p>No transactions recorded yet.</p>
              <Link
                href="/transactions"
                className="text-primary hover:underline font-medium inline-flex items-center gap-1 mt-1"
              >
                Go to Transactions to add one
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {data.recentTransactions.map((tx: any) => {
                const amountNum = Number(tx.amount)
                const isInflow = amountNum < 0
                const formattedDate = new Date(tx.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })

                return (
                  <div
                    key={tx.id}
                    className="py-3 flex items-center justify-between text-xs hover:bg-muted/30 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isInflow
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon
                          icon={isInflow ? ArrowDownRight01Icon : ArrowUpRight01Icon}
                          size={16}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{tx.name}</p>
                        <div className="flex items-center gap-2 text-muted-foreground text-[11px] mt-0.5">
                          <span>{tx.account?.name || "Account"}</span>
                          <span>•</span>
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {tx.category && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-normal hidden sm:inline-flex"
                        >
                          {tx.category.name}
                        </Badge>
                      )}
                      <span
                        className={`font-semibold shrink-0 ${
                          isInflow
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-foreground"
                        }`}
                      >
                        {isInflow ? "+" : "-"}{currencySymbol}
                        {formatAmount(amountNum)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
