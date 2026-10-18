import { getBudgetsData } from "@/lib/data"
import { BudgetsView } from "@/components/budgets/budgets-view"

export default async function BudgetsPage() {
  const currentMonth = "2026-10"
  const data = await getBudgetsData(currentMonth)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Monthly Budget
        </h2>
        <p className="text-xs text-muted-foreground">
          Track planned spending against actual expenses by category.
        </p>
      </div>

      <BudgetsView
        month={data.month}
        budgetItems={data.budgetItems}
        totalBudgeted={data.totalBudgeted}
        totalSpent={data.totalSpent}
        totalRemaining={data.totalRemaining}
      />
    </div>
  )
}
