import { PrismaClient, AccountType, AccountClassification } from "@prisma/client"
import { hashPassword } from "better-auth/crypto"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding Sure database...")

  // Clean existing data
  await prisma.dailyBalance.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.budget.deleteMany()
  await prisma.goal.deleteMany()
  await prisma.financialAccount.deleteMany()
  await prisma.merchant.deleteMany()
  await prisma.category.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()
  await prisma.family.deleteMany()

  // 1. Create Default Family
  const family = await prisma.family.create({
    data: {
      name: "Sure Family",
      currency: "USD",
    },
  })

  // 2. Create Demo User
  const demoEmail = "user@example.com"
  const passwordHash = await hashPassword("Password1!")

  const user = await prisma.user.create({
    data: {
      name: "Alex Morgan",
      email: demoEmail,
      emailVerified: true,
      role: "admin",
      familyId: family.id,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=faces",
    },
  })

  // Create credential account for Better Auth
  await prisma.account.create({
    data: {
      userId: user.id,
      accountId: user.id,
      providerId: "credential",
      password: passwordHash,
    },
  })

  console.log("Created demo user:", demoEmail)

  // 3. Create Categories
  const categoryDefs = [
    { name: "Salary", group: "Income", color: "#10b981", icon: "briefcase" },
    { name: "Investments", group: "Income", color: "#06b6d4", icon: "trending-up" },
    { name: "Other Income", group: "Income", color: "#3b82f6", icon: "wallet" },
    { name: "Housing & Rent", group: "Fixed Expenses", color: "#6366f1", icon: "home" },
    { name: "Utilities", group: "Fixed Expenses", color: "#8b5cf6", icon: "zap" },
    { name: "Internet & Phone", group: "Fixed Expenses", color: "#a855f7", icon: "wifi" },
    { name: "Groceries", group: "Variable Expenses", color: "#ec4899", icon: "shopping-cart" },
    { name: "Dining Out", group: "Variable Expenses", color: "#f43f5e", icon: "coffee" },
    { name: "Entertainment", group: "Variable Expenses", color: "#f97316", icon: "film" },
    { name: "Shopping", group: "Variable Expenses", color: "#eab308", icon: "shopping-bag" },
    { name: "Transportation", group: "Variable Expenses", color: "#84cc16", icon: "car" },
    { name: "Health & Fitness", group: "Variable Expenses", color: "#14b8a6", icon: "heart-pulse" },
    { name: "Travel", group: "Variable Expenses", color: "#0ea5e9", icon: "plane" },
    { name: "Mortgage Payment", group: "Debt & Loans", color: "#ef4444", icon: "landmark" },
    { name: "Credit Card Payment", group: "Debt & Loans", color: "#f59e0b", icon: "credit-card" },
  ]

  const categoriesMap = new Map<string, string>()
  for (const cat of categoryDefs) {
    const created = await prisma.category.create({
      data: {
        familyId: family.id,
        name: cat.name,
        group: cat.group,
        color: cat.color,
        icon: cat.icon,
      },
    })
    categoriesMap.set(cat.name, created.id)
  }

  // 4. Create Merchants
  const merchantNames = [
    "TechCorp Payroll",
    "Whole Foods Market",
    "Trader Joe's",
    "Starbucks",
    "Target",
    "Amazon",
    "Netflix",
    "Spotify",
    "Uber",
    "Chevron",
    "Equinox",
    "Apple Store",
    "Vanguard Brokerage",
    "Chase Mortgage",
  ]

  const merchantsMap = new Map<string, string>()
  for (const name of merchantNames) {
    const created = await prisma.merchant.create({
      data: {
        familyId: family.id,
        name,
      },
    })
    merchantsMap.set(name, created.id)
  }

  // 5. Create Financial Accounts
  const accountDefs = [
    {
      name: "Primary Checking",
      type: AccountType.DEPOSITORY,
      classification: AccountClassification.ASSET,
      subtype: "Checking",
      institutionName: "Chase",
      balance: 6840.50,
      cashBalance: 6840.50,
      currency: "USD",
    },
    {
      name: "High Yield Savings",
      type: AccountType.DEPOSITORY,
      classification: AccountClassification.ASSET,
      subtype: "Savings",
      institutionName: "Marcus by Goldman",
      balance: 28500.00,
      cashBalance: 28500.00,
      currency: "USD",
    },
    {
      name: "Vanguard 401(k)",
      type: AccountType.INVESTMENT,
      classification: AccountClassification.ASSET,
      subtype: "Retirement 401k",
      institutionName: "Vanguard",
      balance: 142600.00,
      cashBalance: 1200.00,
      currency: "USD",
    },
    {
      name: "Fidelity Roth IRA",
      type: AccountType.INVESTMENT,
      classification: AccountClassification.ASSET,
      subtype: "Roth IRA",
      institutionName: "Fidelity",
      balance: 38450.00,
      cashBalance: 500.00,
      currency: "USD",
    },
    {
      name: "Crypto Cold Wallet",
      type: AccountType.CRYPTO,
      classification: AccountClassification.ASSET,
      subtype: "Cold Storage",
      institutionName: "Ledger",
      balance: 14200.00,
      cashBalance: 0.00,
      currency: "USD",
    },
    {
      name: "Primary Residence",
      type: AccountType.PROPERTY,
      classification: AccountClassification.ASSET,
      subtype: "Real Estate",
      institutionName: "Zillow / Appraised",
      balance: 485000.00,
      cashBalance: 0.00,
      currency: "USD",
    },
    {
      name: "Tesla Model Y",
      type: AccountType.VEHICLE,
      classification: AccountClassification.ASSET,
      subtype: "Automobile",
      institutionName: "Tesla",
      balance: 34000.00,
      cashBalance: 0.00,
      currency: "USD",
    },
    {
      name: "Chase Sapphire Reserve",
      type: AccountType.CREDIT_CARD,
      classification: AccountClassification.LIABILITY,
      subtype: "Credit Card",
      institutionName: "Chase",
      balance: 2450.75, // Owed
      cashBalance: 0.00,
      currency: "USD",
    },
    {
      name: "Home Mortgage",
      type: AccountType.LOAN,
      classification: AccountClassification.LIABILITY,
      subtype: "Fixed 30Y Mortgage",
      institutionName: "Wells Fargo",
      balance: 318000.00, // Owed
      cashBalance: 0.00,
      currency: "USD",
    },
  ]

  const accountsMap = new Map<string, string>()
  for (const acc of accountDefs) {
    const created = await prisma.financialAccount.create({
      data: {
        familyId: family.id,
        name: acc.name,
        type: acc.type,
        classification: acc.classification,
        subtype: acc.subtype,
        institutionName: acc.institutionName,
        balance: acc.balance,
        cashBalance: acc.cashBalance,
        currency: acc.currency,
      },
    })
    accountsMap.set(acc.name, created.id)
  }

  // 6. Create Transactions (over the last 60 days)
  const checkingId = accountsMap.get("Primary Checking")!
  const sapphireId = accountsMap.get("Chase Sapphire Reserve")!

  const transactionData = [
    // Income (negative amount in Sure convention)
    { name: "TechCorp Payroll", amount: -4850.00, date: new Date("2026-10-15"), accountId: checkingId, cat: "Salary", mer: "TechCorp Payroll" },
    { name: "TechCorp Payroll", amount: -4850.00, date: new Date("2026-09-30"), accountId: checkingId, cat: "Salary", mer: "TechCorp Payroll" },
    { name: "TechCorp Payroll", amount: -4850.00, date: new Date("2026-09-15"), accountId: checkingId, cat: "Salary", mer: "TechCorp Payroll" },
    { name: "Dividend Payout", amount: -245.50, date: new Date("2026-10-05"), accountId: checkingId, cat: "Investments", mer: "Vanguard Brokerage" },

    // Fixed & Housing
    { name: "Mortgage Auto-pay", amount: 2150.00, date: new Date("2026-10-01"), accountId: checkingId, cat: "Mortgage Payment", mer: "Chase Mortgage" },
    { name: "Mortgage Auto-pay", amount: 2150.00, date: new Date("2026-09-01"), accountId: checkingId, cat: "Mortgage Payment", mer: "Chase Mortgage" },
    { name: "City Electric & Gas", amount: 165.40, date: new Date("2026-10-08"), accountId: checkingId, cat: "Utilities", mer: null },
    { name: "City Electric & Gas", amount: 182.10, date: new Date("2026-09-09"), accountId: checkingId, cat: "Utilities", mer: null },
    { name: "Fiber Internet Gigabit", amount: 80.00, date: new Date("2026-10-04"), accountId: checkingId, cat: "Internet & Phone", mer: null },
    { name: "Cellular Family Plan", amount: 130.00, date: new Date("2026-10-03"), accountId: checkingId, cat: "Internet & Phone", mer: null },

    // Groceries & Food (Credit card expenses)
    { name: "Whole Foods Market", amount: 142.30, date: new Date("2026-10-17"), accountId: sapphireId, cat: "Groceries", mer: "Whole Foods Market" },
    { name: "Trader Joe's", amount: 95.80, date: new Date("2026-10-14"), accountId: sapphireId, cat: "Groceries", mer: "Trader Joe's" },
    { name: "Whole Foods Market", amount: 168.90, date: new Date("2026-10-10"), accountId: sapphireId, cat: "Groceries", mer: "Whole Foods Market" },
    { name: "Trader Joe's", amount: 84.20, date: new Date("2026-10-02"), accountId: sapphireId, cat: "Groceries", mer: "Trader Joe's" },
    { name: "Whole Foods Market", amount: 154.20, date: new Date("2026-09-24"), accountId: sapphireId, cat: "Groceries", mer: "Whole Foods Market" },

    // Dining Out
    { name: "Sushi Restaurant Omakase", amount: 210.00, date: new Date("2026-10-16"), accountId: sapphireId, cat: "Dining Out", mer: null },
    { name: "Starbucks Coffee", amount: 14.50, date: new Date("2026-10-16"), accountId: sapphireId, cat: "Dining Out", mer: "Starbucks" },
    { name: "Trattoria Pasta House", amount: 88.50, date: new Date("2026-10-11"), accountId: sapphireId, cat: "Dining Out", mer: null },
    { name: "Starbucks Coffee", amount: 12.75, date: new Date("2026-10-09"), accountId: sapphireId, cat: "Dining Out", mer: "Starbucks" },
    { name: "Ramen Bowl Dinner", amount: 46.20, date: new Date("2026-10-05"), accountId: sapphireId, cat: "Dining Out", mer: null },

    // Transportation & Lifestyle
    { name: "Chevron Gas Station", amount: 56.40, date: new Date("2026-10-13"), accountId: sapphireId, cat: "Transportation", mer: "Chevron" },
    { name: "Chevron Gas Station", amount: 62.10, date: new Date("2026-09-29"), accountId: sapphireId, cat: "Transportation", mer: "Chevron" },
    { name: "Uber Ride Airport", amount: 45.80, date: new Date("2026-10-07"), accountId: sapphireId, cat: "Transportation", mer: "Uber" },
    { name: "Equinox Gym Monthly", amount: 275.00, date: new Date("2026-10-01"), accountId: sapphireId, cat: "Health & Fitness", mer: "Equinox" },
    { name: "Target Home Goods", amount: 112.45, date: new Date("2026-10-12"), accountId: sapphireId, cat: "Shopping", mer: "Target" },
    { name: "Amazon Essentials", amount: 74.90, date: new Date("2026-10-08"), accountId: sapphireId, cat: "Shopping", mer: "Amazon" },
    { name: "Netflix Subscription", amount: 22.99, date: new Date("2026-10-06"), accountId: sapphireId, cat: "Entertainment", mer: "Netflix" },
    { name: "Spotify Duo", amount: 16.99, date: new Date("2026-10-04"), accountId: sapphireId, cat: "Entertainment", mer: "Spotify" },
    { name: "Weekend Getaway Hotel", amount: 480.00, date: new Date("2026-09-20"), accountId: sapphireId, cat: "Travel", mer: null },
  ]

  for (const tx of transactionData) {
    await prisma.transaction.create({
      data: {
        familyId: family.id,
        accountId: tx.accountId,
        categoryId: tx.cat ? categoriesMap.get(tx.cat) : null,
        merchantId: tx.mer ? merchantsMap.get(tx.mer) : null,
        name: tx.name,
        amount: tx.amount,
        date: tx.date,
        currency: "USD",
      },
    })
  }

  // 7. Create Budgets for Current Month (2026-10)
  const currentMonth = "2026-10"
  const budgetPlan = [
    { cat: "Housing & Rent", amount: 2150.00 },
    { cat: "Utilities", amount: 200.00 },
    { cat: "Internet & Phone", amount: 220.00 },
    { cat: "Groceries", amount: 700.00 },
    { cat: "Dining Out", amount: 450.00 },
    { cat: "Transportation", amount: 250.00 },
    { cat: "Shopping", amount: 300.00 },
    { cat: "Entertainment", amount: 150.00 },
    { cat: "Health & Fitness", amount: 300.00 },
  ]

  for (const b of budgetPlan) {
    const catId = categoriesMap.get(b.cat)
    if (catId) {
      await prisma.budget.create({
        data: {
          familyId: family.id,
          month: currentMonth,
          categoryId: catId,
          amount: b.amount,
        },
      })
    }
  }

  // 8. Create Financial Goals
  await prisma.goal.create({
    data: {
      familyId: family.id,
      name: "Emergency Fund (6 Months)",
      targetAmount: 35000.00,
      currentAmount: 28500.00,
      targetDate: new Date("2026-12-31"),
      status: "active",
    },
  })

  await prisma.goal.create({
    data: {
      familyId: family.id,
      name: "Home Solar & Battery",
      targetAmount: 18000.00,
      currentAmount: 8500.00,
      targetDate: new Date("2027-06-30"),
      status: "active",
    },
  })

  await prisma.goal.create({
    data: {
      familyId: family.id,
      name: "Japan Vacation Fund",
      targetAmount: 6000.00,
      currentAmount: 4200.00,
      targetDate: new Date("2027-04-15"),
      status: "active",
    },
  })

  // 9. Create Historical Net Worth / Daily Balance snapshots (past 6 months)
  const months = [
    { date: new Date("2026-05-31"), assets: 712000, liabilities: 326000 },
    { date: new Date("2026-06-30"), assets: 724000, liabilities: 324500 },
    { date: new Date("2026-07-31"), assets: 731000, liabilities: 323000 },
    { date: new Date("2026-08-31"), assets: 739000, liabilities: 321800 },
    { date: new Date("2026-09-30"), assets: 745000, liabilities: 320600 },
    { date: new Date("2026-10-18"), assets: 749640, liabilities: 320450 },
  ]

  for (const m of months) {
    await prisma.dailyBalance.create({
      data: {
        accountId: checkingId,
        date: m.date,
        balance: m.assets,
        cashBalance: 28500,
        currency: "USD",
        inflows: 9700,
        outflows: 4850,
      },
    })
  }

  console.log("Seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
