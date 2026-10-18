"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/ui/icon"
import { SureLogo } from "@/components/ui/sure-logo"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await signIn.email({
        email,
        password,
      })

      if (res.error) {
        setError(res.error.message || "Failed to sign in. Please verify your credentials.")
      } else {
        router.push("/")
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCreds = () => {
    setEmail("user@example.com")
    setPassword("Password1!")
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-sm space-y-4">
        {/* Logo and Brand */}
        <div className="text-center space-y-1">
          <div className="flex justify-center mb-2">
            <SureLogo size={42} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Sign in to Sure
          </h1>
          <p className="text-xs text-muted-foreground">
            The personal finance and wealth management app
          </p>
        </div>

        {/* Quick Demo Credentials Banner */}
        <div className="p-3 bg-secondary/80 border border-border rounded-lg text-xs flex items-center justify-between">
          <div>
            <p className="font-semibold text-foreground">Demo Credentials</p>
            <p className="text-muted-foreground text-[11px]">
              user@example.com • Password1!
            </p>
          </div>
          <Button size="xs" variant="outline" onClick={fillDemoCreds}>
            Quick Fill
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full gap-2" size="sm" disabled={loading}>
                <span>{loading ? "Signing in..." : "Sign in"}</span>
                {!loading && <Icon icon={ArrowRight01Icon} size={14} />}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-border/60 text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Create one
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
