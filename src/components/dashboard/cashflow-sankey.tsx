"use client"

import React, { useState } from "react"
import {
  Activity01Icon,
  Add01Icon,
  ArrowRight01Icon,
  ArrowDownRight01Icon,
  ArrowUpRight01Icon,
  TradeUpIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/ui/icon"
import { usePrivacy } from "@/components/providers"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog"
import { SerializedAccount, SerializedCategory } from "@/lib/serialize"

interface BreakdownItem {
  name: string
  amount: number
  color?: string
}

interface CashflowSankeyProps {
  totalInflows: number
  totalOutflows: number
  incomeBreakdown: BreakdownItem[]
  expenseBreakdown: BreakdownItem[]
  accounts: (SerializedAccount | any)[]
  categories: (SerializedCategory | any)[]
}

export function CashflowSankey({
  totalInflows,
  totalOutflows,
  incomeBreakdown,
  expenseBreakdown,
  accounts,
  categories,
}: CashflowSankeyProps) {
  const { formatMoney } = usePrivacy()
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const hasData = totalInflows > 0 || totalOutflows > 0
  const netSavings = totalInflows - totalOutflows
  const isSurplus = netSavings >= 0
  const capacity = Math.max(totalInflows, totalOutflows)

  // Empty State matching Sure original _cashflow_sankey.html.erb
  if (!hasData) {
    return (
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Cash Flow</CardTitle>
            <CardDescription>Income to expenses flow visualization</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] sm:h-[320px] rounded-xl border border-dashed border-border/80 bg-muted/20 flex flex-col items-center justify-center p-6 text-center">
            <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Icon icon={Activity01Icon} size={24} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              No cash flow data yet
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
              Add your first transaction to see income and expense flows mapped in real-time.
            </p>
            <Button
              size="sm"
              onClick={() => setIsAddTransactionOpen(true)}
              className="gap-1.5 text-xs font-medium cursor-pointer"
            >
              <Icon icon={Add01Icon} size={14} />
              Add Transaction
            </Button>
          </div>

          <AddTransactionDialog
            open={isAddTransactionOpen}
            onOpenChange={setIsAddTransactionOpen}
            accounts={accounts}
            categories={categories}
          />
        </CardContent>
      </Card>
    )
  }

  // Calculate layout geometry for SVG Sankey
  const svgWidth = 860
  const svgHeight = 360
  const colWidth = 180
  const leftX = 20
  const centerX = (svgWidth - colWidth) / 2
  const rightX = svgWidth - colWidth - 20

  const availableHeight = svgHeight - 40
  const minNodeHeight = 28
  const nodePadding = 12

  // 1. Position Left Nodes (Inflows)
  const validIncomes = incomeBreakdown.length > 0
    ? incomeBreakdown
    : [{ name: "Inflows", amount: totalInflows, color: "#10b981" }]

  const incomeTotal = validIncomes.reduce((acc, i) => acc + i.amount, 0) || 1
  let currentIncomeY = 20

  const incomeNodes = validIncomes.map((item, idx) => {
    const rawHeight = (item.amount / incomeTotal) * (availableHeight - (validIncomes.length - 1) * nodePadding)
    const height = Math.max(minNodeHeight, Math.round(rawHeight))
    const node = {
      id: `income-${idx}`,
      name: item.name,
      amount: item.amount,
      color: item.color || "#10b981",
      pct: Math.round((item.amount / incomeTotal) * 100),
      x: leftX,
      y: currentIncomeY,
      height,
    }
    currentIncomeY += height + nodePadding
    return node
  })

  // 2. Position Center Node (Cash Flow)
  const centerHeight = Math.min(availableHeight, Math.max(120, currentIncomeY - 20))
  const centerNode = {
    id: "center-cashflow",
    name: "Cash Flow",
    amount: capacity,
    color: "#64748b",
    pct: 100,
    x: centerX,
    y: Math.max(20, (svgHeight - centerHeight) / 2),
    height: centerHeight,
  }

  // 3. Position Right Nodes (Outflows + Net Savings / Deficit)
  const validExpenses = [...expenseBreakdown]
  if (isSurplus && netSavings > 0) {
    validExpenses.push({
      name: "Net Savings (Surplus)",
      amount: netSavings,
      color: "#059669", // emerald
    })
  }

  const rightTotal = validExpenses.reduce((acc, e) => acc + e.amount, 0) || 1
  let currentExpenseY = 20

  const expenseNodes = validExpenses.map((item, idx) => {
    const rawHeight = (item.amount / rightTotal) * (availableHeight - (validExpenses.length - 1) * nodePadding)
    const height = Math.max(minNodeHeight, Math.round(rawHeight))
    const isSavings = item.name.includes("Savings")
    const node = {
      id: `expense-${idx}`,
      name: item.name,
      amount: item.amount,
      color: item.color || (isSavings ? "#059669" : "#f43f5e"),
      pct: Math.round((item.amount / (totalInflows || rightTotal)) * 100),
      x: rightX,
      y: currentExpenseY,
      height,
      isSavings,
    }
    currentExpenseY += height + nodePadding
    return node
  })

  // Helpers to draw smooth Bézier flow ribbons
  const renderFlowRibbon = (
    id: string,
    x1: number,
    y1: number,
    h1: number,
    x2: number,
    y2: number,
    h2: number,
    color: string,
    active: boolean
  ) => {
    const cpX1 = x1 + (x2 - x1) * 0.45
    const cpX2 = x1 + (x2 - x1) * 0.55

    const path = `
      M ${x1} ${y1}
      C ${cpX1} ${y1}, ${cpX2} ${y2}, ${x2} ${y2}
      L ${x2} ${y2 + h2}
      C ${cpX2} ${y2 + h2}, ${cpX1} ${y1 + h1}, ${x1} ${y1 + h1}
      Z
    `

    return (
      <path
        key={id}
        d={path}
        fill={color}
        fillOpacity={active ? 0.6 : 0.22}
        className="transition-all duration-200 cursor-pointer hover:fill-opacity-50"
        onMouseEnter={() => setHoveredLink(id)}
        onMouseLeave={() => setHoveredLink(null)}
      />
    )
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>Cash Flow Diagram</CardTitle>
            <Badge variant="outline" className="text-[10px] font-normal">
              October 2026
            </Badge>
          </div>
          <CardDescription>
            Sankey flow: Monthly income into total cash flow distributed across categories & net savings
          </CardDescription>
        </div>

        {/* Key Summary Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Icon icon={ArrowDownRight01Icon} size={14} />
            <span>Inflows: {formatMoney(totalInflows)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            <Icon icon={ArrowUpRight01Icon} size={14} />
            <span>Outflows: {formatMoney(totalOutflows)}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
              isSurplus
                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            }`}
          >
            <Icon icon={TradeUpIcon} size={14} />
            <span>Net: {formatMoney(netSavings)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Responsive Diagram Container */}
        <div className="w-full overflow-x-auto pb-2">
          <div className="min-w-[800px] relative bg-muted/20 border border-border/60 rounded-xl p-4">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-[360px] select-none"
            >
              <defs>
                <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#64748b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* 1. Left Inflows to Center Ribbons */}
              {incomeNodes.map((src, i) => {
                const targetY = centerNode.y + (src.amount / incomeTotal) * (centerNode.height - 10) * i
                const targetH = Math.max(6, (src.amount / incomeTotal) * (centerNode.height * 0.7))
                const linkId = `link-in-${src.id}`
                const isActive = hoveredNode === src.id || hoveredLink === linkId || hoveredNode === centerNode.id

                return renderFlowRibbon(
                  linkId,
                  src.x + colWidth,
                  src.y + 4,
                  src.height - 8,
                  centerNode.x,
                  targetY + 4,
                  targetH,
                  src.color,
                  isActive
                )
              })}

              {/* 2. Center to Right Outflows & Savings Ribbons */}
              {expenseNodes.map((tgt, i) => {
                const sourceY = centerNode.y + (tgt.amount / rightTotal) * (centerNode.height - 10) * i
                const sourceH = Math.max(6, (tgt.amount / rightTotal) * (centerNode.height * 0.7))
                const linkId = `link-out-${tgt.id}`
                const isActive = hoveredNode === tgt.id || hoveredLink === linkId || hoveredNode === centerNode.id

                return renderFlowRibbon(
                  linkId,
                  centerNode.x + colWidth,
                  sourceY + 4,
                  sourceH,
                  tgt.x,
                  tgt.y + 4,
                  tgt.height - 8,
                  tgt.color,
                  isActive
                )
              })}

              {/* 3. Render Income Nodes */}
              {incomeNodes.map((node) => (
                <g
                  key={node.id}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <rect
                    x={node.x}
                    y={node.y}
                    width={colWidth}
                    height={node.height}
                    rx={8}
                    fill="var(--card)"
                    stroke={node.color}
                    strokeWidth={hoveredNode === node.id ? 2 : 1.2}
                    className="transition-all duration-150 drop-shadow-xs"
                  />
                  <rect
                    x={node.x + 3}
                    y={node.y + 3}
                    width={4}
                    height={Math.max(node.height - 6, 4)}
                    rx={2}
                    fill={node.color}
                  />
                  <text
                    x={node.x + 14}
                    y={node.y + Math.min(node.height / 2 + 1, 16)}
                    fill="currentColor"
                    className="text-[11px] font-semibold text-foreground truncate"
                  >
                    {node.name}
                  </text>
                  {node.height >= 36 && (
                    <text
                      x={node.x + 14}
                      y={node.y + node.height - 8}
                      fill="currentColor"
                      className="text-[10px] text-muted-foreground"
                    >
                      {formatMoney(node.amount)} ({node.pct}%)
                    </text>
                  )}
                </g>
              ))}

              {/* 4. Render Center Cashflow Node */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode(centerNode.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <rect
                  x={centerNode.x}
                  y={centerNode.y}
                  width={colWidth}
                  height={centerNode.height}
                  rx={10}
                  fill="var(--card)"
                  stroke="#64748b"
                  strokeWidth={hoveredNode === centerNode.id ? 2.5 : 1.5}
                  className="transition-all duration-150 drop-shadow-sm"
                />
                <rect
                  x={centerNode.x + 4}
                  y={centerNode.y + 4}
                  width={4}
                  height={Math.max(centerNode.height - 8, 8)}
                  rx={2}
                  fill="#64748b"
                />
                <text
                  x={centerNode.x + 16}
                  y={centerNode.y + Math.min(centerNode.height / 2 - 4, 32)}
                  fill="currentColor"
                  className="text-xs font-bold text-foreground"
                >
                  Cash Flow Hub
                </text>
                <text
                  x={centerNode.x + 16}
                  y={centerNode.y + Math.min(centerNode.height / 2 + 14, 52)}
                  fill="currentColor"
                  className="text-[11px] font-semibold text-muted-foreground"
                >
                  {formatMoney(centerNode.amount)}
                </text>
              </g>

              {/* 5. Render Expense & Savings Nodes */}
              {expenseNodes.map((node) => (
                <g
                  key={node.id}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <rect
                    x={node.x}
                    y={node.y}
                    width={colWidth}
                    height={node.height}
                    rx={8}
                    fill="var(--card)"
                    stroke={node.color}
                    strokeWidth={hoveredNode === node.id ? 2 : 1.2}
                    className="transition-all duration-150 drop-shadow-xs"
                  />
                  <rect
                    x={node.x + 3}
                    y={node.y + 3}
                    width={4}
                    height={Math.max(node.height - 6, 4)}
                    rx={2}
                    fill={node.color}
                  />
                  <text
                    x={node.x + 14}
                    y={node.y + Math.min(node.height / 2 + 1, 16)}
                    fill="currentColor"
                    className="text-[11px] font-semibold text-foreground truncate"
                  >
                    {node.name}
                  </text>
                  {node.height >= 36 && (
                    <text
                      x={node.x + 14}
                      y={node.y + node.height - 8}
                      fill="currentColor"
                      className="text-[10px] text-muted-foreground"
                    >
                      {formatMoney(node.amount)} ({node.pct}%)
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Bottom Quick Action */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1.5">
            <Icon icon={SparklesIcon} size={14} className="text-primary" />
            <span>Hover over any category ribbon to inspect financial flow paths.</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddTransactionOpen(true)}
            className="h-7 text-xs text-primary hover:underline cursor-pointer gap-1"
          >
            <Icon icon={Add01Icon} size={13} />
            <span>Add Transaction</span>
          </Button>
        </div>

        <AddTransactionDialog
          open={isAddTransactionOpen}
          onOpenChange={setIsAddTransactionOpen}
          accounts={accounts}
          categories={categories}
        />
      </CardContent>
    </Card>
  )
}
