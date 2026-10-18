import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import "dotenv/config"

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/sure_next?schema=public"
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function clean() {
  console.log("Removing demo transactions, balances, budgets, goals, and accounts...")
  await prisma.dailyBalance.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.budget.deleteMany()
  await prisma.goal.deleteMany()
  await prisma.financialAccount.deleteMany()
  await prisma.merchant.deleteMany()

  // Ensure default Family exists with BDT as default currency
  let family = await prisma.family.findFirst()
  if (!family) {
    family = await prisma.family.create({
      data: {
        name: "My Household",
        currency: "BDT",
      },
    })
  } else {
    await prisma.family.update({
      where: { id: family.id },
      data: { name: "My Household", currency: "BDT" },
    })
  }

  // Ensure standard categories exist for easy categorization
  const count = await prisma.category.count({ where: { familyId: family.id } })
  if (count === 0) {
    const categoryDefs = [
      { name: "Salary", group: "Income", color: "#10b981", icon: "briefcase" },
      { name: "Business & Investments", group: "Income", color: "#06b6d4", icon: "trending-up" },
      { name: "Other Income", group: "Income", color: "#3b82f6", icon: "wallet" },
      { name: "Housing & Rent", group: "Fixed Expenses", color: "#6366f1", icon: "home" },
      { name: "Utilities", group: "Fixed Expenses", color: "#8b5cf6", icon: "zap" },
      { name: "Internet & Phone", group: "Fixed Expenses", color: "#a855f7", icon: "wifi" },
      { name: "Groceries", group: "Variable Expenses", color: "#ec4899", icon: "shopping-cart" },
      { name: "Dining & Food", group: "Variable Expenses", color: "#f43f5e", icon: "coffee" },
      { name: "Entertainment", group: "Variable Expenses", color: "#f97316", icon: "film" },
      { name: "Shopping", group: "Variable Expenses", color: "#eab308", icon: "shopping-bag" },
      { name: "Transportation & Fuel", group: "Variable Expenses", color: "#84cc16", icon: "car" },
      { name: "Health & Medical", group: "Variable Expenses", color: "#14b8a6", icon: "heart-pulse" },
      { name: "Education", group: "Variable Expenses", color: "#0ea5e9", icon: "book-open" },
      { name: "Debt & Loans", group: "Debt & Loans", color: "#ef4444", icon: "landmark" },
    ]
    for (const cat of categoryDefs) {
      await prisma.category.create({
        data: {
          familyId: family.id,
          name: cat.name,
          group: cat.group,
          color: cat.color,
          icon: cat.icon,
        },
      })
    }
  }

  console.log("Demo data cleared successfully. Clean workspace ready!")
}

clean()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
