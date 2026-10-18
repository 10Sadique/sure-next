"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"

interface PrivacyContextType {
  isPrivacyMode: boolean
  togglePrivacyMode: () => void
  formatMoney: (amount: number | string, currency?: string) => string
}

const PrivacyContext = createContext<PrivacyContextType>({
  isPrivacyMode: false,
  togglePrivacyMode: () => {},
  formatMoney: () => "",
})

export const usePrivacy = () => useContext(PrivacyContext)

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

interface SidebarContextType {
  isAccountsSidebarOpen: boolean
  toggleAccountsSidebar: () => void
  setAccountsSidebarOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  isAccountsSidebarOpen: true,
  toggleAccountsSidebar: () => {},
  setAccountsSidebarOpen: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

export function Providers({ children }: { children: React.ReactNode }) {
  const [isPrivacyMode, setIsPrivacyMode] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isAccountsSidebarOpen, setIsAccountsSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedPrivacy = localStorage.getItem("sure_privacy_mode")
    if (savedPrivacy === "true") setIsPrivacyMode(true)

    const savedSidebar = localStorage.getItem("sure_sidebar_open")
    if (savedSidebar !== null) setIsAccountsSidebarOpen(savedSidebar === "true")

    const savedTheme = localStorage.getItem("sure_theme")
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const togglePrivacyMode = () => {
    setIsPrivacyMode((prev) => {
      const next = !prev
      localStorage.setItem("sure_privacy_mode", String(next))
      return next
    })
  }

  const toggleAccountsSidebar = () => {
    setIsAccountsSidebarOpen((prev) => {
      const next = !prev
      localStorage.setItem("sure_sidebar_open", String(next))
      return next
    })
  }

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      localStorage.setItem("sure_theme", next ? "dark" : "light")
      if (next) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      return next
    })
  }

  const formatMoney = (amount: number | string, currency = "BDT") => {
    if (isPrivacyMode) {
      return "••••••"
    }

    const num = typeof amount === "string" ? parseFloat(amount) : amount
    if (isNaN(num)) {
      return currency === "BDT" ? "৳0.00" : "$0.00"
    }

    const abs = Math.abs(num)
    const parts = abs.toFixed(2).split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    const formatted = parts.join(".")
    const sign = num < 0 ? "-" : ""

    if (currency === "BDT") {
      return `${sign}৳${formatted}`
    }

    if (currency === "USD") {
      return `${sign}$${formatted}`
    }

    if (currency === "EUR") {
      return `${sign}€${formatted}`
    }

    if (currency === "GBP") {
      return `${sign}£${formatted}`
    }

    return `${sign}${currency} ${formatted}`
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <SidebarContext.Provider
        value={{
          isAccountsSidebarOpen,
          toggleAccountsSidebar,
          setAccountsSidebarOpen: setIsAccountsSidebarOpen,
        }}
      >
        <PrivacyContext.Provider
          value={{ isPrivacyMode, togglePrivacyMode, formatMoney }}
        >
          <TooltipProvider>{children}</TooltipProvider>
        </PrivacyContext.Provider>
      </SidebarContext.Provider>
    </ThemeContext.Provider>
  )
}
