"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { usePrivacy } from "@/components/providers"

interface NetWorthDataPoint {
  date: string
  netWorth: number
  assets: number
  liabilities: number
}

interface NetWorthChartProps {
  data: NetWorthDataPoint[]
}

export function NetWorthChart({ data }: NetWorthChartProps) {
  const { formatMoney, isPrivacyMode } = usePrivacy()

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-56 flex flex-col items-center justify-center text-center p-4">
        <p className="text-xs text-muted-foreground font-medium">No historical balance snapshots yet.</p>
        <p className="text-[11px] text-muted-foreground/70 mt-1">
          Historical trends appear automatically as you record transactions and update account balances.
        </p>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value
      return (
        <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
          <p className="font-medium text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold text-foreground">
            {formatMoney(val)}
          </p>
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
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
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
          <Area
            type="monotone"
            dataKey="netWorth"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#netWorthGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
