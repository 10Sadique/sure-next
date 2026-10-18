import { getDashboardData } from "@/lib/data"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { NetWorthChart } from "@/components/dashboard/net-worth-chart"
import { MoneyFlowChart } from "@/components/dashboard/money-flow-chart"
import { SpendingDonutChart } from "@/components/dashboard/spending-donut-chart"

export default async function ReportsPage() {
  const data = await getDashboardData()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Financial Reports & Analytics
        </h2>
        <p className="text-xs text-muted-foreground">
          In-depth insights into your net worth velocity, income generation, and expense allocation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Net Worth Growth</CardTitle>
            <CardDescription>Historical progression over 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <NetWorthChart data={data.netWorthHistory} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cashflow History</CardTitle>
            <CardDescription>Monthly income vs expense analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <MoneyFlowChart data={data.cashflowHistory} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Distribution</CardTitle>
          <CardDescription>Spending by category breakdown for the current period</CardDescription>
        </CardHeader>
        <CardContent>
          <SpendingDonutChart data={data.categoryBreakdown} />
        </CardContent>
      </Card>
    </div>
  )
}
