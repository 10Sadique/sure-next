"use client"

import { useState } from "react"
import {
  Search01Icon,
  FilterIcon,
  ArrowDownRight01Icon,
  ArrowUpRight01Icon,
  Delete02Icon,
  Add01Icon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/ui/icon"
import { usePrivacy } from "@/components/providers"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog"
import { deleteTransactionAction } from "@/actions"

interface TransactionsViewProps {
  initialTransactions: any[]
  accounts: any[]
  categories: any[]
}

export function TransactionsView({
  initialTransactions,
  accounts,
  categories,
}: TransactionsViewProps) {
  const { formatMoney } = usePrivacy()
  const [search, setSearch] = useState("")
  const [selectedAccount, setSelectedAccount] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState<"all" | "inflow" | "outflow">("all")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = initialTransactions.filter((tx) => {
    const amt = Number(tx.amount)
    const isInflow = amt < 0

    // Search filter
    if (
      search &&
      !tx.name.toLowerCase().includes(search.toLowerCase()) &&
      !(tx.notes || "").toLowerCase().includes(search.toLowerCase())
    ) {
      return false
    }

    // Account filter
    if (selectedAccount !== "all" && tx.accountId !== selectedAccount) {
      return false
    }

    // Category filter
    if (selectedCategory !== "all" && tx.categoryId !== selectedCategory) {
      return false
    }

    // Type filter
    if (selectedType === "inflow" && !isInflow) return false
    if (selectedType === "outflow" && isInflow) return false

    return true
  })

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      setDeletingId(id)
      try {
        await deleteTransactionAction(id)
      } finally {
        setDeletingId(null)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative w-full">
            <Icon
              icon={Search01Icon}
              size={15}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs bg-card"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Account Filter */}
          <Select
            value={selectedAccount}
            onValueChange={(val) => {
              if (val) setSelectedAccount(val)
            }}
          >
            <SelectTrigger className="h-8 text-xs bg-card min-w-36">
              <SelectValue placeholder="All Accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={selectedCategory}
            onValueChange={(val) => {
              if (val) setSelectedCategory(val)
            }}
          >
            <SelectTrigger className="h-8 text-xs bg-card min-w-36">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type Toggle */}
          <div className="flex items-center rounded-md border border-input bg-card p-0.5 text-xs">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-2 py-1 text-[11px] rounded font-medium transition-colors cursor-pointer ${
                selectedType === "all"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType("inflow")}
              className={`px-2 py-1 text-[11px] rounded font-medium transition-colors cursor-pointer ${
                selectedType === "inflow"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Inflows
            </button>
            <button
              onClick={() => setSelectedType("outflow")}
              className={`px-2 py-1 text-[11px] rounded font-medium transition-colors cursor-pointer ${
                selectedType === "outflow"
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Outflows
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="h-8 gap-1 text-xs cursor-pointer"
          >
            <Icon icon={Add01Icon} size={14} />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Transactions Table / List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border/60">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No transactions found matching your filters.
              </div>
            ) : (
              filtered.map((tx) => {
                const amt = Number(tx.amount)
                const isInflow = amt < 0
                const formattedDate = new Date(tx.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })

                return (
                  <div
                    key={tx.id}
                    className="p-3.5 flex items-center justify-between text-xs hover:bg-muted/30 transition-colors group"
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
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {tx.name}
                          </span>
                          {tx.category && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-normal"
                            >
                              {tx.category.name}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-[11px] mt-0.5">
                          <span>{tx.account?.name || "Account"}</span>
                          <span>•</span>
                          <span>{formattedDate}</span>
                          {tx.notes && (
                            <>
                              <span>•</span>
                              <span className="italic">{tx.notes}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`font-semibold text-sm ${
                          isInflow
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-foreground"
                        }`}
                      >
                        {isInflow ? "+" : "-"}
                        {formatMoney(Math.abs(amt))}
                      </span>

                      <button
                        onClick={() => handleDelete(tx.id)}
                        disabled={deletingId === tx.id}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-600 p-1 rounded transition-all cursor-pointer"
                        title="Delete transaction"
                      >
                        <Icon icon={Delete02Icon} size={15} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      <AddTransactionDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        accounts={accounts}
        categories={categories}
      />
    </div>
  )
}
