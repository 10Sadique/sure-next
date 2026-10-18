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
import { createAccountAction } from "@/actions"

interface AddAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddAccountDialog({ open, onOpenChange }: AddAccountDialogProps) {
  const [loading, setLoading] = useState(false)
  const [classification, setClassification] = useState("ASSET")
  const [accountType, setAccountType] = useState("DEPOSITORY")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      await createAccountAction(formData)
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Financial Account</DialogTitle>
          <DialogDescription>
            Create an asset or liability account to track real balances and transactions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Classification Selection */}
          <div className="space-y-1.5">
            <Label>Classification</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setClassification("ASSET")
                  setAccountType("DEPOSITORY")
                }}
                className={`py-2 px-3 text-xs rounded-lg border font-medium transition-colors cursor-pointer ${
                  classification === "ASSET"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                Asset (Cash, Investments, Property)
              </button>
              <button
                type="button"
                onClick={() => {
                  setClassification("LIABILITY")
                  setAccountType("CREDIT_CARD")
                }}
                className={`py-2 px-3 text-xs rounded-lg border font-medium transition-colors cursor-pointer ${
                  classification === "LIABILITY"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                Liability (Cards, Loans, Mortgage)
              </button>
            </div>
            <input type="hidden" name="classification" value={classification} />
          </div>

          {/* Account Type */}
          <div className="space-y-1.5">
            <Label htmlFor="type">Account Type</Label>
            <Select
              name="type"
              value={accountType}
              onValueChange={(val) => {
                if (val) setAccountType(val)
              }}
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {classification === "ASSET" ? (
                  <>
                    <SelectItem value="DEPOSITORY">Depository (Checking, Savings, Cash)</SelectItem>
                    <SelectItem value="INVESTMENT">Investment (Brokerage, Stocks, Mutual Funds)</SelectItem>
                    <SelectItem value="CRYPTO">Crypto (Wallets, Exchanges)</SelectItem>
                    <SelectItem value="PROPERTY">Property (Real Estate, Land, Home)</SelectItem>
                    <SelectItem value="VEHICLE">Vehicle (Car, Motorcycle)</SelectItem>
                    <SelectItem value="OTHER_ASSET">Other Asset</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                    <SelectItem value="LOAN">Loan / Mortgage / Borrowing</SelectItem>
                    <SelectItem value="OTHER_LIABILITY">Other Liability</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Account Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. City Bank Savings or BRAC Bank Card"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Institution */}
            <div className="space-y-1.5">
              <Label htmlFor="institutionName">Institution (Optional)</Label>
              <Input
                id="institutionName"
                name="institutionName"
                placeholder="e.g. Dutch Bangla Bank, Chase"
              />
            </div>

            {/* Currency */}
            <div className="space-y-1.5">
              <Label htmlFor="currency">Currency</Label>
              <Select name="currency" defaultValue="BDT">
                <SelectTrigger id="currency" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BDT">BDT (৳ - Bangladeshi Taka)</SelectItem>
                  <SelectItem value="USD">USD ($ - US Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (€ - Euro)</SelectItem>
                  <SelectItem value="GBP">GBP (£ - British Pound)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Starting Balance */}
          <div className="space-y-1.5">
            <Label htmlFor="balance">Current Balance</Label>
            <Input
              id="balance"
              name="balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              required
            />
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
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
