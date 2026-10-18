"use client"

import { useState } from "react"
import { Edit02Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/ui/icon"
import { usePrivacy } from "@/components/providers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveBudgetAction } from "@/actions"

interface BudgetItem {
  category: { id: string; name: string; group: string; color?: string | null }
  budgeted: number
  spent: number
  remaining: number
  percentage: number
  isOverBudget: boolean
}

interface BudgetsViewProps {
  month: string
  budgetItems: BudgetItem[]
  totalBudgeted: number
  totalSpent: number
  totalRemaining: number
}

export function BudgetsView({
  month,
  budgetItems,
  totalBudgeted,
  totalSpent,
  totalRemaining,
}: BudgetsViewProps) {
  const { formatMoney } = usePrivacy()
  const [editingCatId, setEditingCatId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleEditClick = (categoryId: string, currentAmount: number) => {
    setEditingCatId(categoryId)
    setEditAmount(currentAmount.toString())
  }

  const handleSave = async (categoryId: string) => {
    setIsSaving(true)
    try {
      const amt = parseFloat(editAmount || "0")
      await saveBudgetAction(categoryId, month, amt)
      setEditingCatId(null)
    } finally {
      setIsSaving(false)
    }
  }

  const overallPct =
    totalBudgeted > 0
      ? Math.min(Math.round((totalSpent / totalBudgeted) * 100), 100)
      : 0

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <span className="text-xs text-muted-foreground font-medium">Total Budgeted</span>
          <div className="text-2xl font-bold tracking-tight text-foreground mt-1">
            {formatMoney(totalBudgeted)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Planned for {month}
          </p>
        </Card>

        <Card className="p-4">
          <span className="text-xs text-muted-foreground font-medium">Total Spent</span>
          <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 mt-1">
            {formatMoney(totalSpent)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {overallPct}% of total budget used
          </p>
        </Card>

        <Card className="p-4">
          <span className="text-xs text-muted-foreground font-medium">Remaining to Spend</span>
          <div
            className={`text-2xl font-bold tracking-tight mt-1 ${
              totalRemaining >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {formatMoney(totalRemaining)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {totalRemaining >= 0 ? "Under budget" : "Exceeded budget"}
          </p>
        </Card>
      </div>

      {/* Categories Budget List */}
      <Card>
        <CardHeader>
          <CardTitle>Category Budgets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="divide-y divide-border/60">
            {budgetItems.map((item) => (
              <div key={item.category.id} className="py-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.category.color || "#6366f1" }}
                    />
                    <span className="font-semibold text-foreground">
                      {item.category.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      ({item.category.group})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {editingCatId === item.category.id ? (
                      <div className="flex items-center gap-1.5">
                        <Input
                          type="number"
                          step="10"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="h-6 w-24 text-xs"
                          autoFocus
                        />
                        <Button
                          size="xs"
                          onClick={() => handleSave(item.category.id)}
                          disabled={isSaving}
                        >
                          Save
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => setEditingCatId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="font-semibold text-foreground">
                            {formatMoney(item.spent)}
                          </span>
                          <span className="text-muted-foreground">
                            {" "}
                            / {formatMoney(item.budgeted)}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            handleEditClick(item.category.id, item.budgeted)
                          }
                          className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors cursor-pointer"
                          title="Edit Budget"
                        >
                          <Icon icon={Edit02Icon} size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.isOverBudget
                          ? "bg-rose-500"
                          : item.percentage > 85
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>{item.percentage}% spent</span>
                    <span
                      className={
                        item.isOverBudget
                          ? "text-rose-600 dark:text-rose-400 font-medium"
                          : ""
                      }
                    >
                      {item.isOverBudget
                        ? `Over by ${formatMoney(Math.abs(item.remaining))}`
                        : `${formatMoney(item.remaining)} remaining`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
