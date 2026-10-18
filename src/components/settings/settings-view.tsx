"use client"

import { useState } from "react"
import {
  UserIcon,
  Home01Icon,
  Database01Icon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/ui/icon"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SettingsViewProps {
  familyName: string
  currency: string
  userEmail: string
  userName: string
}

export function SettingsView({
  familyName,
  currency,
  userEmail,
  userName,
}: SettingsViewProps) {
  const [copied, setCopied] = useState(false)

  const copyCreds = () => {
    navigator.clipboard.writeText("user@example.com / Password1!")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={UserIcon} className="size-4 text-primary" />
            <span>User Profile</span>
          </CardTitle>
          <CardDescription>Your personal account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input defaultValue={userName} readOnly />
            </div>
            <div className="space-y-1.5">
              <Label>Email Address</Label>
              <Input defaultValue={userEmail} readOnly />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Badge variant="secondary" className="text-xs">
              Role: Admin
            </Badge>
            <Badge variant="outline" className="text-xs">
              Auth: Better-Auth
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Household & Tenancy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={Home01Icon} className="size-4 text-primary" />
            <span>Household & Tenancy</span>
          </CardTitle>
          <CardDescription>
            Manage family settings, preferred currency, and sharing rules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Household Name</Label>
              <Input defaultValue={familyName} />
            </div>
            <div className="space-y-1.5">
              <Label>Primary Currency</Label>
              <Select defaultValue={currency}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BDT">BDT (৳ - Bangladeshi Taka)</SelectItem>
                  <SelectItem value="USD">USD ($ - US Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (€ - Euro)</SelectItem>
                  <SelectItem value="GBP">GBP (£ - British Pound)</SelectItem>
                  <SelectItem value="CAD">CAD ($ - Canadian Dollar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Local Development & Demo Data */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={Database01Icon} className="size-4 text-primary" />
            <span>Local Development & Demo Credentials</span>
          </CardTitle>
          <CardDescription>
            Running locally on Next.js 16, Base UI, Better-Auth, and Docker PostgreSQL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-muted/60 rounded-lg flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-foreground">Default Demo Credentials</p>
              <p className="text-muted-foreground mt-0.5">
                Email: <span className="font-mono text-foreground font-medium">user@example.com</span> • Password: <span className="font-mono text-foreground font-medium">Password1!</span>
              </p>
            </div>
            <Button size="xs" variant="outline" onClick={copyCreds}>
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>

          <div className="text-[11px] text-muted-foreground space-y-1">
            <p>• To seed or re-seed realistic demo data, run: <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">npx prisma db seed</code></p>
            <p>• Local PostgreSQL Docker service: <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">docker compose up -d</code></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
