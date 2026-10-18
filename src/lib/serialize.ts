/**
 * Serialization utilities to prevent Next.js RSC boundary serialization errors:
 * "Only plain objects can be passed to Client Components from Server Components. Decimal objects are not supported."
 */

export function sanitizeForRSC<T>(data: T): T {
  if (data === null || data === undefined) {
    return data
  }

  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      // Prisma Decimal instance or objects with toFixed / s / e / d fields
      if (
        typeof value === "object" &&
        value !== null &&
        typeof value.toFixed === "function" &&
        (typeof value.d === "object" || typeof value.toNumber === "function")
      ) {
        return Number(value)
      }
      return value
    })
  )
}

export interface SerializedAccount {
  id: string
  familyId: string
  name: string
  type: string
  classification: string
  subtype: string | null
  balance: number
  cashBalance: number | null
  currency: string
  institutionName: string | null
  notes: string | null
  status: string
  excludeFromReports: boolean
  createdAt: string
  updatedAt: string
}

export interface SerializedCategory {
  id: string
  familyId: string
  name: string
  group: string
  color: string
  icon: string | null
  createdAt?: string
  updatedAt?: string
}

export interface SerializedTransaction {
  id: string
  familyId: string
  accountId: string
  categoryId: string | null
  merchantId: string | null
  name: string
  amount: number
  date: string
  notes: string | null
  status: string
  createdAt?: string
  updatedAt?: string
  account?: SerializedAccount
  category?: SerializedCategory | null
  merchant?: any
}

export function serializeAccount(acc: any): SerializedAccount {
  return {
    ...acc,
    balance: Number(acc.balance ?? 0),
    cashBalance: acc.cashBalance != null ? Number(acc.cashBalance) : null,
    createdAt: acc.createdAt instanceof Date ? acc.createdAt.toISOString() : String(acc.createdAt),
    updatedAt: acc.updatedAt instanceof Date ? acc.updatedAt.toISOString() : String(acc.updatedAt),
  }
}

export function serializeCategory(cat: any): SerializedCategory {
  return {
    ...cat,
    createdAt: cat.createdAt instanceof Date ? cat.createdAt.toISOString() : cat.createdAt,
    updatedAt: cat.updatedAt instanceof Date ? cat.updatedAt.toISOString() : cat.updatedAt,
  }
}

export function serializeTransaction(tx: any): SerializedTransaction {
  return {
    ...tx,
    amount: Number(tx.amount ?? 0),
    date: tx.date instanceof Date ? tx.date.toISOString() : String(tx.date),
    createdAt: tx.createdAt instanceof Date ? tx.createdAt.toISOString() : tx.createdAt,
    updatedAt: tx.updatedAt instanceof Date ? tx.updatedAt.toISOString() : tx.updatedAt,
    account: tx.account ? serializeAccount(tx.account) : undefined,
    category: tx.category ? serializeCategory(tx.category) : (tx.category ?? null),
  }
}
