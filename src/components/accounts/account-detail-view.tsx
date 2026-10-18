"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  BankIcon,
  CreditCardIcon,
  Building01Icon,
  Car01Icon,
  TradeUpIcon,
  Coins01Icon,
  Delete02Icon,
  Add01Icon,
  ArrowDownRight01Icon,
  ArrowUpRight01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/ui/icon"
import Link from "next/link"
import { usePrivacy } from "@/components/providers"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog"
import { deleteAccountAction } from "@/actions"

interface AccountDetailViewProps {
  account: any
  allAccounts: any[]
  categories: any[]
}

export function AccountDetailView({
  account,
  allAccounts,
  categories,
}: AccountDetailViewProps) {
  const router = useRouter()
  const { formatMoney } = usePrivacy()
  const [isAddTxOpen, setIsAddTxOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isAsset = account.classification === "ASSET"
  const balanceNum = Number(account.balance)

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${account.name}? This will remove its transactions.`)) {
      setIsDeleting(true)
      try {
        await deleteAccountAction(account.id)
        router.push("/accounts")
      } catch (e) {
        console.error(e)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/accounts"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <Icon icon={ArrowLeft01Icon} size={14} />
        <span>Back to Accounts</span>
      </Link>

      {/* Account Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {account.name}
                </h2>
                <Badge variant={isAsset ? "default" : "destructive"} className="text-[10px]">
                  {account.classification}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {account.institutionName || "Manual"} • {account.subtype || account.type}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddTxOpen(true)}
                className="gap-1.5 text-xs h-8 cursor-pointer"
              >
                <Icon icon={Add01Icon} size={14} />
                Add Transaction
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="gap-1.5 text-xs h-8 cursor-pointer"
              >
                <Icon icon={Delete02Icon} size={14} />
                Delete
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-muted-foreground">Current Balance</span>
              <div
                className={`text-2xl font-bold tracking-tight mt-0.5 ${
                  isAsset ? "text-foreground" : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {formatMoney(balanceNum)}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Cash Available</span>
              <div className="text-lg font-semibold tracking-tight text-foreground mt-1">
                {formatMoney(Number(account.cashBalance))}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Transactions Logged</span>
              <div className="text-lg font-semibold tracking-tight text-foreground mt-1">
                {account.transactions.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Transactions Feed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Account Transactions</CardTitle>
          <span className="text-xs text-muted-foreground">
            {account.transactions.length} records
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/60">
            {account.transactions.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No transactions recorded for this account yet.
              </div>
            ) : (
              account.transactions.map((tx: any) => {
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
                    className="p-3.5 flex items-center justify-between text-xs hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isInflow
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon
                          icon={isInflow ? ArrowDownRight01Icon : ArrowUpRight01Icon}
                          size={15}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{tx.name}</span>
                          {tx.category && (
                            <Badge variant="secondary" className="text-[10px]">
                              {tx.category.name}
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground mt-0.5 block">
                          {formattedDate}
                        </span>
                      </div>
                    </div>

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
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      <AddTransactionDialog
        open={isAddTxOpen}
        onOpenChange={setIsAddTxOpen}
        accounts={allAccounts}
        categories={categories}
      />
    </div>
  )
}
