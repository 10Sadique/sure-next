"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { usePrivacy } from "@/components/providers"

interface CashflowDataPoint {
  month: string
  income: number
  expenses: number
  net: number
}

interface MoneyFlowChartProps {
  data: CashflowDataPoint[]
}

export function MoneyFlowChart({ data }: MoneyFlowChartProps) {
  const { formatMoney, isPrivacyMode } = usePrivacy()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const income = payload.find((p: any) => p.dataKey === "income")?.value || 0
      const expenses = payload.find((p: any) => p.dataKey === "expenses")?.value || 0
      const net = income - expenses

      return (
        <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md space-y-1">
          <p className="font-semibold text-foreground">{label}</p>
          <div className="flex justify-between gap-4 text-emerald-600 dark:text-emerald-400">
            <span>Inflows:</span>
            <span className="font-medium">{formatMoney(income)}</span>
          </div>
          <div className="flex justify-between gap-4 text-rose-600 dark:text-rose-400">
            <span>Outflows:</span>
            <span className="font-medium">{formatMoney(expenses)}</span>
          </div>
          <div className="border-t border-border/60 pt-1 flex justify-between gap-4 font-semibold text-foreground">
            <span>Net:</span>
            <span>{formatMoney(net)}</span>
          </div>
        </div>
      )
    }
    return null
  }

  const formatYAxis = (val: number) => {
    if (isPrivacyMode) return "••••"
    if (Math.abs(val) >= 1000000) return `${(val / 1000000).toFixed(1)}M`
    if (Math.abs(val) >= 1000) return `${Math.round(val / 1000)}k`
    return `${val}`
  }

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <XAxis
            dataKey="month"
            stroke="#888888"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatYAxis}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="income"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="expenses"
            fill="#f43f5e"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
