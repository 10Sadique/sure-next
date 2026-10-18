"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { usePrivacy } from "@/components/providers"

interface CategoryBreakdown {
  name: string
  amount: number
  color: string
}

interface SpendingDonutChartProps {
  data: CategoryBreakdown[]
}

const DEFAULT_COLORS = [
  "#6366f1",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#14b8a6",
  "#06b6d4",
  "#8b5cf6",
]

export function SpendingDonutChart({ data }: SpendingDonutChartProps) {
  const { formatMoney } = usePrivacy()

  const total = data.reduce((sum, item) => sum + item.amount, 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      const pct = total > 0 ? ((item.amount / total) * 100).toFixed(1) : "0"
      return (
        <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md space-y-0.5">
          <p className="font-semibold text-foreground">{item.name}</p>
          <p className="text-muted-foreground">
            {formatMoney(item.amount)} ({pct}%)
          </p>
        </div>
      )
    }
    return null
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-56 flex items-center justify-center text-xs text-muted-foreground">
        No expense data for this month
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-4">
      {/* Chart */}
      <div className="size-48 shrink-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={78}
              paddingAngle={3}
              dataKey="amount"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Total Spent
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {formatMoney(total)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 w-full space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {data.slice(0, 6).map((item, index) => {
          const pct = total > 0 ? ((item.amount / total) * 100).toFixed(0) : "0"
          const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]

          return (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs py-0.5"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="truncate text-foreground font-medium">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-muted-foreground">{pct}%</span>
                <span className="font-semibold text-foreground">
                  {formatMoney(item.amount)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
