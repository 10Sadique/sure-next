import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AccountDetailView } from "@/components/accounts/account-detail-view"
import { sanitizeForRSC, serializeAccount, serializeCategory, serializeTransaction } from "@/lib/serialize"

export const dynamic = "force-dynamic"

export default async function AccountDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params

  const rawAccount = await prisma.financialAccount.findUnique({
    where: { id },
    include: {
      transactions: {
        include: { category: true },
        orderBy: { date: "desc" },
      },
    },
  })

  if (!rawAccount) {
    notFound()
  }

  const [rawAllAccounts, rawCategories] = await Promise.all([
    prisma.financialAccount.findMany({
      where: { familyId: rawAccount.familyId },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      where: { familyId: rawAccount.familyId },
      orderBy: { name: "asc" },
    }),
  ])

  const account = sanitizeForRSC({
    ...serializeAccount(rawAccount),
    transactions: rawAccount.transactions.map(serializeTransaction),
  })

  const allAccounts = sanitizeForRSC(rawAllAccounts.map(serializeAccount))
  const categories = sanitizeForRSC(rawCategories.map(serializeCategory))

  return (
    <AccountDetailView
      account={account}
      allAccounts={allAccounts}
      categories={categories}
    />
  )
}
