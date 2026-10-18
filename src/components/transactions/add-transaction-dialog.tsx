"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { createTransactionAction } from "@/actions"
import { SerializedAccount, SerializedCategory } from "@/lib/serialize"

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: (SerializedAccount | any)[]
  categories: (SerializedCategory | any)[]
}

export function AddTransactionDialog({
  open,
  onOpenChange,
  accounts,
  categories,
}: AddTransactionDialogProps) {
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<"expense" | "income">("expense")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (accounts.length === 0) {
      alert("Please create at least one financial account first.")
      return
    }
    setLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      await createTransactionAction(formData)
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const todayStr = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
          <DialogDescription>
            Record an expense, income, or transfer in your accounts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Type Toggle: Expense vs Income */}
          <div className="space-y-1.5">
            <Label>Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`py-1.5 px-3 text-xs rounded-lg border font-medium transition-colors cursor-pointer ${
                  type === "expense"
                    ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                Expense (Outflow)
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`py-1.5 px-3 text-xs rounded-lg border font-medium transition-colors cursor-pointer ${
                  type === "income"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                Income (Inflow)
              </button>
            </div>
            <input type="hidden" name="type" value={type} />
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <DatePicker
                id="date"
                name="date"
                defaultValue={new Date()}
                required
              />
            </div>
          </div>

          {/* Payee / Description */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Description / Payee</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Grocery Store, Salary Deposit, Coffee"
              required
            />
          </div>

          {/* Account & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="accountId">Account</Label>
              <Select
                name="accountId"
                defaultValue={accounts[0]?.id || ""}
                required
              >
                <SelectTrigger id="accountId" className="w-full">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.length === 0 ? (
                    <SelectItem value="" disabled>No accounts available</SelectItem>
                  ) : (
                    accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="categoryId">Category</Label>
              <Select name="categoryId" defaultValue="">
                <SelectTrigger id="categoryId" className="w-full">
                  <SelectValue placeholder="Uncategorized" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Uncategorized</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name} ({cat.group})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input id="notes" name="notes" placeholder="Add any details..." />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading || accounts.length === 0}
            >
              {loading ? "Saving..." : "Save Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
