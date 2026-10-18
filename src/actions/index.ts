"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { AccountClassification, AccountType } from "@prisma/client"
import { getOrCreateDefaultFamily } from "@/lib/data"

export async function createTransactionAction(formData: FormData) {
  const family = await getOrCreateDefaultFamily()

  const accountId = formData.get("accountId") as string
  const name = formData.get("name") as string
  const amountStr = formData.get("amount") as string
  const type = formData.get("type") as string // "expense" | "income"
  const categoryId = formData.get("categoryId") as string
  const dateStr = formData.get("date") as string
  const notes = (formData.get("notes") as string) || null

  let amount = Math.abs(parseFloat(amountStr || "0"))
  // In Sure convention: positive = expense/outflow, negative = income/inflow
  if (type === "income") {
    amount = -amount
  }

  const date = dateStr ? new Date(dateStr) : new Date()

  // Create transaction
  await prisma.transaction.create({
    data: {
      familyId: family.id,
      accountId,
      name,
      amount,
      categoryId: categoryId || null,
      date,
      notes,
    },
  })

  // Update account balance
  const account = await prisma.financialAccount.findUnique({
    where: { id: accountId },
  })

  if (account) {
    // If account is Asset: income (negative) increases balance, expense (positive) decreases balance
    // If account is Liability (e.g. credit card): expense (positive) increases debt
    const currentBal = Number(account.balance)
    let newBal = currentBal
    if (account.classification === AccountClassification.ASSET) {
      newBal = currentBal - amount
    } else {
      newBal = currentBal + amount
    }

    await prisma.financialAccount.update({
      where: { id: accountId },
      data: { balance: newBal },
    })
  }

  revalidatePath("/", "layout")
  revalidatePath("/transactions")
  revalidatePath("/accounts")
  revalidatePath("/budgets")
}

export async function deleteTransactionAction(transactionId: string) {
  const tx = await prisma.transaction.findUnique({
    where: { id: transactionId },
  })

  if (!tx) return

  const amount = Number(tx.amount)
  const accountId = tx.accountId

  await prisma.transaction.delete({
    where: { id: transactionId },
  })

  // Reverse balance change
  const account = await prisma.financialAccount.findUnique({
    where: { id: accountId },
  })

  if (account) {
    const currentBal = Number(account.balance)
    let newBal = currentBal
    if (account.classification === AccountClassification.ASSET) {
      newBal = currentBal + amount
    } else {
      newBal = currentBal - amount
    }

    await prisma.financialAccount.update({
      where: { id: accountId },
      data: { balance: newBal },
    })
  }

  revalidatePath("/", "layout")
  revalidatePath("/transactions")
  revalidatePath("/accounts")
  revalidatePath("/budgets")
}

export async function createAccountAction(formData: FormData) {
  const family = await getOrCreateDefaultFamily()

  const name = formData.get("name") as string
  const typeStr = formData.get("type") as string
  const classificationStr = formData.get("classification") as string
  const subtype = (formData.get("subtype") as string) || null
  const balanceStr = formData.get("balance") as string
  const currencyStr = (formData.get("currency") as string) || family.currency || "BDT"
  const institutionName = (formData.get("institutionName") as string) || null

  const balance = parseFloat(balanceStr || "0")

  await prisma.financialAccount.create({
    data: {
      familyId: family.id,
      name,
      type: (typeStr as AccountType) || AccountType.DEPOSITORY,
      classification:
        (classificationStr as AccountClassification) || AccountClassification.ASSET,
      subtype,
      balance,
      cashBalance: typeStr === "DEPOSITORY" ? balance : 0,
      currency: currencyStr,
      institutionName,
    },
  })

  revalidatePath("/", "layout")
  revalidatePath("/accounts")
}

export async function deleteAccountAction(accountId: string) {
  await prisma.financialAccount.delete({
    where: { id: accountId },
  })

  revalidatePath("/", "layout")
  revalidatePath("/accounts")
  revalidatePath("/transactions")
}

export async function saveBudgetAction(categoryId: string, month: string, amount: number) {
  const family = await getOrCreateDefaultFamily()

  await prisma.budget.upsert({
    where: {
      familyId_categoryId_month: {
        familyId: family.id,
        categoryId,
        month,
      },
    },
    create: {
      familyId: family.id,
      categoryId,
      month,
      amount,
    },
    update: {
      amount,
    },
  })

  revalidatePath("/budgets")
  revalidatePath("/", "layout")
}

export async function createGoalAction(formData: FormData) {
  const family = await getOrCreateDefaultFamily()

  const name = formData.get("name") as string
  const targetAmount = parseFloat((formData.get("targetAmount") as string) || "0")
  const currentAmount = parseFloat((formData.get("currentAmount") as string) || "0")
  const targetDateStr = formData.get("targetDate") as string

  await prisma.goal.create({
    data: {
      familyId: family.id,
      name,
      targetAmount,
      currentAmount,
      targetDate: targetDateStr ? new Date(targetDateStr) : null,
      status: "active",
    },
  })

  revalidatePath("/goals")
}
