import { NavRail } from "@/components/layout/nav-rail"
import { AccountsSidebar } from "@/components/layout/accounts-sidebar"
import { TopHeader } from "@/components/layout/top-header"
import { prisma } from "@/lib/prisma"
import { getOrCreateDefaultFamily } from "@/lib/data"
import { serializeAccount, serializeCategory } from "@/lib/serialize"

export const dynamic = "force-dynamic"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const family = await getOrCreateDefaultFamily()

  const [rawAccounts, rawCategories] = await Promise.all([
    prisma.financialAccount.findMany({
      where: { familyId: family.id },
      orderBy: { createdAt: "asc" },
    }),
    prisma.category.findMany({
      where: { familyId: family.id },
      orderBy: { name: "asc" },
    }),
  ])

  const accounts = rawAccounts.map(serializeAccount)
  const categories = rawCategories.map(serializeCategory)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* 1. Left Icon Navigation Rail */}
      <NavRail />

      {/* 2. Collapsible Accounts Sidebar */}
      <AccountsSidebar accounts={accounts} />

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopHeader accounts={accounts} categories={categories} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
