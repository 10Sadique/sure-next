import { getTransactionsData } from "@/lib/data"
import { TransactionsView } from "@/components/transactions/transactions-view"

export default async function TransactionsPage(props: {
  searchParams?: Promise<{ accountId?: string; categoryId?: string; search?: string }>
}) {
  const searchParams = props.searchParams ? await props.searchParams : {}
  const data = await getTransactionsData(searchParams)

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Transactions
          </h2>
          <p className="text-xs text-muted-foreground">
            Track and categorize money coming in and going out.
          </p>
        </div>
      </div>

      <TransactionsView
        initialTransactions={data.transactions}
        accounts={data.accounts}
        categories={data.categories}
      />
    </div>
  )
}
