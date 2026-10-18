"use client"

import { useState } from "react"
import { Add01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/ui/icon"
import { Button } from "@/components/ui/button"
import { AddAccountDialog } from "@/components/accounts/add-account-dialog"

export function AccountsHeaderActions() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)} className="gap-1.5 text-xs h-8 cursor-pointer">
        <Icon icon={Add01Icon} size={14} />
        Add Account
      </Button>
      <AddAccountDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}
