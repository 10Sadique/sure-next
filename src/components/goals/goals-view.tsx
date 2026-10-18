"use client"

import { useState } from "react"
import {
  Compass01Icon,
  Add01Icon,
  Calendar01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/ui/icon"
import { usePrivacy } from "@/components/providers"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { createGoalAction } from "@/actions"

interface GoalItem {
  id: string
  name: string
  targetAmountNum: number
  currentAmountNum: number
  percentage: number
  remaining: number
  targetDate?: Date | string | null
  status: string
}

interface GoalsViewProps {
  goals: GoalItem[]
}

export function GoalsView({ goals }: GoalsViewProps) {
  const { formatMoney } = usePrivacy()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      await createGoalAction(formData)
      setIsOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Financial Goals
          </h2>
          <p className="text-xs text-muted-foreground">
            Save for milestones, emergency funds, and major purchases.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsOpen(true)}
          className="gap-1.5 text-xs h-8"
        >
          <Icon icon={Add01Icon} size={14} />
          New Goal
        </Button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((g) => {
          const dateStr = g.targetDate
            ? new Date(g.targetDate).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : null

          return (
            <Card key={g.id} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-1">
                    <Icon icon={Compass01Icon} size={18} />
                  </div>
                  {g.percentage >= 100 && (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Icon icon={CheckmarkCircle01Icon} size={12} /> Completed
                    </span>
                  )}
                </div>
                <CardTitle className="text-sm font-semibold">{g.name}</CardTitle>
                {dateStr && (
                  <CardDescription className="flex items-center gap-1 text-[11px]">
                    <Icon icon={Calendar01Icon} size={12} /> Target: {dateStr}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-lg font-bold text-foreground">
                      {formatMoney(g.currentAmountNum)}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      of {formatMoney(g.targetAmountNum)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${g.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                  <span>{g.percentage}% reached</span>
                  <span>{formatMoney(g.remaining)} remaining</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Financial Goal</DialogTitle>
            <DialogDescription>
              Set a savings milestone with a target amount and target date.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="goal-name">Goal Name</Label>
              <Input
                id="goal-name"
                name="name"
                placeholder="e.g. Down Payment, New Car"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="targetAmount">Target Amount ($)</Label>
                <Input
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  step="100"
                  placeholder="10000"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="currentAmount">Starting Amount ($)</Label>
                <Input
                  id="currentAmount"
                  name="currentAmount"
                  type="number"
                  step="100"
                  defaultValue="0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="targetDate">Target Date (Optional)</Label>
              <DatePicker id="targetDate" name="targetDate" placeholder="Select target date" />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={loading}>
                {loading ? "Saving..." : "Create Goal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
