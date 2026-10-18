# Sure Next 💸

A modern re-implementation of **Sure** (the open-source personal finance and wealth management app) built from the ground up using **Next.js (App Router with `src/`)**, **shadcn (Base UI primitives)**, **Better-Auth**, **Prisma ORM**, and **PostgreSQL**.

---

## 🚀 Features

- **Multi-Tenant Family & Account Domain:** Full financial separation by household/family with role-based access.
- **Financial Accounts Management:** Supports Depository (Checking, Savings), Investments (Brokerage, 401k, Roth IRA), Crypto, Properties, Vehicles, Credit Cards, and Loans/Mortgages.
- **Dynamic Cashflow & Money Flow:** Interactive bar charts tracking monthly inflows vs outflows and net savings rate.
- **Net Worth Evolution:** Historical area charts visualizing net worth, total assets, and total liabilities over time.
- **Category Spending Distribution:** Outflows donut chart with real-time percentage allocation and interactive legend.
- **Filterable Transactions Feed:** Search transactions, filter by account, category, or cash movement type (Inflow / Outflow), and add/delete transactions.
- **Monthly Category Budgeting:** Budget vs actual spending progress bars with over-budget alerts.
- **Savings & Milestone Goals:** Visual goal progress cards with target dates and target amounts.
- **Privacy Mode (`••••••`):** Toggle sensitive balance numbers on or off at any time for screen sharing or public recording.
- **Base UI Component System:** Built with `@base-ui/react` and Tailwind CSS.
- **Authentication with Better-Auth:** Email/password credentials, sessions, and user management.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org) 16 (App Router with `src/` directory)
- **UI & Headless Components:** [shadcn](https://ui.shadcn.com) powered by **Base UI** (`@base-ui/react`) & Tailwind CSS
- **Authentication:** [Better-Auth](https://better-auth.com)
- **ORM & Database:** [Prisma](https://prisma.io) 7 with PostgreSQL
- **Containerization:** Docker Compose for local PostgreSQL
- **Charts & Visualization:** [Recharts](https://recharts.org)

---

## 🏁 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org) >= 20
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (for running PostgreSQL locally)

### 2. Start PostgreSQL Container
```bash
docker compose up -d
```

### 3. Push Database Schema & Generate Prisma Client
```bash
npx prisma db push
```

### 4. Seed Realistic Demo Data
Populate the database with a full demo family, accounts, transactions, budgets, and savings goals:
```bash
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔑 Demo Credentials

If you seeded the database using `npx prisma db seed`, log in with:

- **Email:** `user@example.com`
- **Password:** `Password1!`

---

## 📁 Project Structure

```
sure-next/
├── docker-compose.yml          # Local PostgreSQL container service
├── prisma/
│   ├── schema.prisma           # Relational schema (Better-Auth + Sure Domain)
│   └── seed.ts                 # Realistic demo data seed script
├── src/
│   ├── actions/
│   │   └── index.ts            # Server actions (Transactions, Accounts, Budgets, Goals)
│   ├── app/
│   │   ├── (app)/              # Authenticated application shell
│   │   │   ├── layout.tsx      # Main layout (NavRail + AccountsSidebar + TopHeader)
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── accounts/       # Accounts directory & detail views
│   │   │   ├── transactions/   # Transactions table & filters
│   │   │   ├── budgets/        # Monthly budget planner
│   │   │   ├── goals/          # Savings goals
│   │   │   ├── reports/        # Financial analytics
│   │   │   └── settings/       # Household settings & demo credentials
│   │   ├── (auth)/             # Auth pages (login, register)
│   │   ├── api/auth/[...all]/  # Better-Auth route handler
│   │   ├── globals.css         # Theme tokens & design system
│   │   └── layout.tsx          # Root HTML layout with Providers
│   ├── components/
│   │   ├── ui/                 # Base UI shadcn components (button, card, dialog, etc.)
│   │   ├── layout/             # NavRail, AccountsSidebar, TopHeader
│   │   ├── dashboard/          # NetWorthChart, MoneyFlowChart, SpendingDonutChart
│   │   ├── accounts/           # AddAccountDialog, AccountDetailView
│   │   ├── transactions/       # AddTransactionDialog, TransactionsView
│   │   ├── budgets/            # BudgetsView
│   │   ├── goals/              # GoalsView
│   │   └── providers.tsx       # Privacy Mode, Theme & Tooltip providers
│   └── lib/
│       ├── auth.ts             # Better-Auth server configuration
│       ├── auth-client.ts      # Better-Auth client hooks
│       ├── data.ts             # High-performance server queries
│       ├── prisma.ts           # Prisma client singleton
│       └── utils.ts            # Classnames utility
├── CONTRIBUTING.md      # Contribution guidelines & development setup
├── LICENSE              # MIT Open Source License
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) for local development instructions, coding guidelines, and pull request procedures.

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).

