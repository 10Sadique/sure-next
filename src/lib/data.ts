import { prisma } from "@/lib/prisma"
import { AccountClassification } from "@prisma/client"
import {
  sanitizeForRSC,
  serializeAccount,
  serializeTransaction,
  serializeCategory,
} from "@/lib/serialize"

export async function getOrCreateDefaultFamily() {
  let family = await prisma.family.findFirst({
    include: {
      financialAccounts: true,
      categories: true,
      users: true,
    },
  })

  if (!family) {
    family = await prisma.family.create({
      data: {
        name: "My Household",
        currency: "BDT",
      },
      include: {
        financialAccounts: true,
        categories: true,
        users: true,
      },
    })
  }

  return sanitizeForRSC(family)
}

export async function getDashboardData() {
  const family = await getOrCreateDefaultFamily()

  // 1. Fetch Accounts
  const rawAccounts = await prisma.financialAccount.findMany({
    where: { familyId: family.id },
    orderBy: { createdAt: "asc" },
  })

  let totalAssets = 0
  let totalLiabilities = 0

  const accounts = rawAccounts.map((acc) => {
    const bal = Number(acc.balance)
    if (acc.classification === AccountClassification.ASSET) {
      totalAssets += bal
    } else {
      totalLiabilities += Math.abs(bal)
    }
    return serializeAccount(acc)
  })

  const netWorth = totalAssets - totalLiabilities

  // 2. Fetch Recent Transactions
  const rawTransactions = await prisma.transaction.findMany({
    where: { familyId: family.id },
    include: {
      account: true,
      category: true,
      merchant: true,
    },
    orderBy: { date: "desc" },
    take: 12,
  })

  const recentTransactions = rawTransactions.map(serializeTransaction)

  // 3. Fetch Category Spending for the current month
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  const monthTransactions = await prisma.transaction.findMany({
    where: {
      familyId: family.id,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    include: { category: true },
  })

  const rawCategories = await prisma.category.findMany({
    where: { familyId: family.id },
    orderBy: { name: "asc" },
  })
  const categories = rawCategories.map(serializeCategory)

  let totalInflows = 0
  let totalOutflows = 0
  const incomeCategoryMap: Record<string, { name: string; amount: number; color: string }> = {}
  const expenseCategoryMap: Record<string, { name: string; amount: number; color: string }> = {}

  monthTransactions.forEach((tx) => {
    const rawAmt = Number(tx.amount)
    const isIncome = rawAmt < 0 || tx.category?.group === "Income"
    const absAmt = Math.abs(rawAmt)

    if (isIncome) {
      totalInflows += absAmt
      const catName = tx.category?.name || "Income"
      const color = tx.category?.color || "#10b981"
      if (!incomeCategoryMap[catName]) {
        incomeCategoryMap[catName] = { name: catName, amount: 0, color }
      }
      incomeCategoryMap[catName].amount += absAmt
    } else {
      totalOutflows += absAmt
      const catName = tx.category?.name || "Uncategorized"
      const color = tx.category?.color || "#94a3b8"
      if (!expenseCategoryMap[catName]) {
        expenseCategoryMap[catName] = { name: catName, amount: 0, color }
      }
      expenseCategoryMap[catName].amount += absAmt
    }
  })

  const incomeBreakdown = Object.values(incomeCategoryMap).sort((a, b) => b.amount - a.amount)
  const categoryBreakdown = Object.values(expenseCategoryMap).sort((a, b) => b.amount - a.amount)

  // 4. Monthly Cashflow History (past 6 months)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
  const historyTransactions = await prisma.transaction.findMany({
    where: {
      familyId: family.id,
      date: { gte: sixMonthsAgo },
    },
    orderBy: { date: "asc" },
  })

  const monthlyCashflowMap: Record<string, { month: string; income: number; expenses: number; net: number }> = {}

  // Initialize past 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = d.toLocaleString("en-US", { month: "short" })
    monthlyCashflowMap[monthKey] = {
      month: monthKey,
      income: 0,
      expenses: 0,
      net: 0,
    }
  }

  historyTransactions.forEach((tx) => {
    const m = tx.date.toLocaleString("en-US", { month: "short" })
    if (monthlyCashflowMap[m]) {
      const amt = Number(tx.amount)
      if (amt < 0) {
        monthlyCashflowMap[m].income += Math.abs(amt)
      } else {
        monthlyCashflowMap[m].expenses += amt
      }
    }
  })

  Object.values(monthlyCashflowMap).forEach((item) => {
    item.net = item.income - item.expenses
  })

  const cashflowHistory = Object.values(monthlyCashflowMap)

  // 5. Historical Net Worth snapshots
  const dailyBalances = await prisma.dailyBalance.findMany({
    where: {
      account: { familyId: family.id },
    },
    orderBy: { date: "asc" },
  })

  const netWorthHistory = dailyBalances.map((b) => ({
    date: b.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    netWorth: Number(b.balance),
    assets: Number(b.balance),
    liabilities: 0,
  }))

  return sanitizeForRSC({
    family,
    accounts,
    categories,
    totalAssets,
    totalLiabilities,
    netWorth,
    recentTransactions,
    totalInflows,
    totalOutflows,
    incomeBreakdown,
    categoryBreakdown,
    expenseBreakdown: categoryBreakdown,
    cashflowHistory,
    netWorthHistory,
  })
}

export async function getTransactionsData(filters?: {
  accountId?: string
  categoryId?: string
  search?: string
  startDate?: string
  endDate?: string
}) {
  const family = await getOrCreateDefaultFamily()

  const whereClause: any = {
    familyId: family.id,
  }

  if (filters?.accountId && filters.accountId !== "all") {
    whereClause.accountId = filters.accountId
  }

  if (filters?.categoryId && filters.categoryId !== "all") {
    whereClause.categoryId = filters.categoryId
  }

  if (filters?.search) {
    whereClause.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { notes: { contains: filters.search, mode: "insensitive" } },
    ]
  }

  if (filters?.startDate || filters?.endDate) {
    whereClause.date = {}
    if (filters.startDate) whereClause.date.gte = new Date(filters.startDate)
    if (filters.endDate) whereClause.date.lte = new Date(filters.endDate)
  }

  const [rawTransactions, rawAccounts, rawCategories] = await Promise.all([
    prisma.transaction.findMany({
      where: whereClause,
      include: {
        account: true,
        category: true,
        merchant: true,
      },
      orderBy: { date: "desc" },
    }),
    prisma.financialAccount.findMany({
      where: { familyId: family.id },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      where: { familyId: family.id },
      orderBy: { name: "asc" },
    }),
  ])

  return sanitizeForRSC({
    transactions: rawTransactions.map(serializeTransaction),
    accounts: rawAccounts.map(serializeAccount),
    categories: rawCategories.map(serializeCategory),
  })
}

export async function getAccountsData() {
  const family = await getOrCreateDefaultFamily()

  const rawAccounts = await prisma.financialAccount.findMany({
    where: { familyId: family.id },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
    orderBy: [{ classification: "asc" }, { type: "asc" }, { name: "asc" }],
  })

  const accounts = rawAccounts.map(serializeAccount)
  const assets = accounts.filter((a) => a.classification === AccountClassification.ASSET)
  const liabilities = accounts.filter((a) => a.classification === AccountClassification.LIABILITY)

  const totalAssets = assets.reduce((sum, a) => sum + Number(a.balance), 0)
  const totalLiabilities = liabilities.reduce((sum, a) => sum + Math.abs(Number(a.balance)), 0)

  return sanitizeForRSC({
    family,
    accounts,
    assets,
    liabilities,
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
  })
}

export async function getBudgetsData(month?: string) {
  const family = await getOrCreateDefaultFamily()
  const now = new Date()
  const targetMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

  const [categories, budgets, transactions] = await Promise.all([
    prisma.category.findMany({
      where: { familyId: family.id },
      orderBy: { group: "asc" },
    }),
    prisma.budget.findMany({
      where: { familyId: family.id, month: targetMonth },
      include: { category: true },
    }),
    prisma.transaction.findMany({
      where: {
        familyId: family.id,
        date: {
          gte: new Date(`${targetMonth}-01`),
          lte: new Date(new Date(`${targetMonth}-01`).getFullYear(), new Date(`${targetMonth}-01`).getMonth() + 1, 0, 23, 59, 59),
        },
      },
      include: { category: true },
    }),
  ])

  // Calculate spent per category
  const spentMap: Record<string, number> = {}
  transactions.forEach((tx) => {
    if (tx.categoryId && Number(tx.amount) > 0) {
      spentMap[tx.categoryId] = (spentMap[tx.categoryId] || 0) + Number(tx.amount)
    }
  })

  const budgetItems = categories
    .filter((c) => c.group !== "Income")
    .map((cat) => {
      const budget = budgets.find((b) => b.categoryId === cat.id)
      const budgetedAmount = budget ? Number(budget.amount) : 0
      const spentAmount = spentMap[cat.id] || 0
      const remaining = budgetedAmount - spentAmount
      const percentage = budgetedAmount > 0 ? Math.min(Math.round((spentAmount / budgetedAmount) * 100), 100) : 0

      return {
        category: serializeCategory(cat),
        budgeted: budgetedAmount,
        spent: spentAmount,
        remaining,
        percentage,
        isOverBudget: spentAmount > budgetedAmount && budgetedAmount > 0,
      }
    })

  const totalBudgeted = budgetItems.reduce((acc, curr) => acc + curr.budgeted, 0)
  const totalSpent = budgetItems.reduce((acc, curr) => acc + curr.spent, 0)

  return sanitizeForRSC({
    month: targetMonth,
    budgetItems,
    totalBudgeted,
    totalSpent,
    totalRemaining: totalBudgeted - totalSpent,
  })
}

export async function getGoalsData() {
  const family = await getOrCreateDefaultFamily()

  const goals = await prisma.goal.findMany({
    where: { familyId: family.id },
    orderBy: { createdAt: "asc" },
  })

  return sanitizeForRSC({
    family,
    goals: goals.map((g) => {
      const target = Number(g.targetAmount)
      const current = Number(g.currentAmount)
      const percentage = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0
      return {
        id: g.id,
        familyId: g.familyId,
        name: g.name,
        targetAmount: target,
        currentAmount: current,
        targetAmountNum: target,
        currentAmountNum: current,
        targetDate: g.targetDate ? g.targetDate.toISOString() : null,
        status: g.status,
        percentage,
        remaining: Math.max(target - current, 0),
        createdAt: g.createdAt.toISOString(),
        updatedAt: g.updatedAt.toISOString(),
      }
    }),
  })
}
