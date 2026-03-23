import { prisma } from "./prisma"

export type ActionType = "HUMANIZE" | "DETECT" | "CHECK"

export interface UsageMetadata {
  mode?: string
  tone?: string
  language?: string
  antiDuplicate?: boolean
  aiScoreBefore?: number
  aiScoreAfter?: number
  uniquenessScore?: number
  requestId?: string
}

/**
 * Calculate quota deduction based on action type and input length
 */
export function calculateQuotaDeduction(
  actionType: ActionType,
  inputLength: number
): number {
  let multiplier = 1

  switch (actionType) {
    case "HUMANIZE":
      multiplier = 1
      break
    case "DETECT":
      multiplier = 0.5
      break
    case "CHECK":
      multiplier = 0.3
      break
    default:
      multiplier = 1
  }

  const calculated = Math.floor(inputLength * multiplier)

  // Minimum quota per request
  const minQuota = actionType === "HUMANIZE" ? 10 : actionType === "DETECT" ? 5 : 3

  return Math.max(calculated, minQuota)
}

/**
 * Check if user has sufficient quota
 */
export async function checkQuota(userId: string, requiredQuota: number): Promise<boolean> {
  const quota = await prisma.quota.findUnique({
    where: { userId }
  })

  if (!quota) {
    return false
  }

  return quota.remainingQuota >= requiredQuota
}

/**
 * Get user quota information
 */
export async function getUserQuota(userId: string) {
  const quota = await prisma.quota.findUnique({
    where: { userId }
  })

  return quota
}

/**
 * Deduct quota and record usage
 */
export async function deductQuota(
  userId: string,
  amount: number,
  actionType: ActionType,
  metadata?: UsageMetadata
): Promise<void> {
  // Check if user has sufficient quota first
  const hasQuota = await checkQuota(userId, amount)
  if (!hasQuota) {
    throw new Error("INSUFFICIENT_QUOTA")
  }

  // Update quota atomically
  await prisma.$transaction(async (tx) => {
    // Update quota
    const quota = await tx.quota.update({
      where: { userId },
      data: {
        usedQuota: { increment: amount },
        remainingQuota: { decrement: amount },
      }
    })

    // Create usage record
    await tx.usage.create({
      data: {
        userId,
        actionType,
        inputLength: metadata?.mode ? Math.floor(amount / (actionType === "HUMANIZE" ? 1 : actionType === "DETECT" ? 0.5 : 0.3)) : amount,
        quotaDeducted: amount,
        aiScoreBefore: metadata?.aiScoreBefore,
        aiScoreAfter: metadata?.aiScoreAfter,
        uniquenessScore: metadata?.uniquenessScore,
        mode: metadata?.mode,
        tone: metadata?.tone,
        language: metadata?.language,
        antiDuplicate: metadata?.antiDuplicate ?? false,
        requestId: metadata?.requestId,
      }
    })

    // Ensure remaining quota doesn't go negative
    if (quota.remainingQuota < amount) {
      throw new Error("INSUFFICIENT_QUOTA")
    }
  })
}

/**
 * Get user usage records with pagination
 */
export async function getUserUsage(
  userId: string,
  options?: {
    limit?: number
    offset?: number
    startDate?: Date
    endDate?: Date
  }
) {
  const { limit = 20, offset = 0, startDate, endDate } = options || {}

  const where: any = { userId }
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = startDate
    if (endDate) where.createdAt.lte = endDate
  }

  const [usages, total] = await Promise.all([
    prisma.usage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.usage.count({ where }),
  ])

  return { usages, total }
}

/**
 * Get usage statistics
 */
export async function getUsageStats(userId: string) {
  const stats = await prisma.usage.groupBy({
    by: ["actionType"],
    where: { userId },
    _count: true,
    _sum: {
      inputLength: true,
      quotaDeducted: true,
    },
  })

  const totalRequests = stats.reduce((sum, s) => sum + s._count, 0)
  const totalCharacters = stats.reduce((sum, s) => sum + (s._sum.inputLength || 0), 0)
  const totalQuotaUsed = stats.reduce((sum, s) => sum + (s._sum.quotaDeducted || 0), 0)

  // Calculate average scores
  const avgScores = await prisma.usage.aggregate({
    where: { userId },
    _avg: {
      aiScoreBefore: true,
      aiScoreAfter: true,
      uniquenessScore: true,
    },
  })

  // Usage by day (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const usageByDay = await prisma.$queryRaw`
    SELECT
      DATE(createdAt) as date,
      COUNT(*) as count
    FROM Usage
    WHERE userId = ${userId} AND createdAt >= ${sevenDaysAgo}
    GROUP BY DATE(createdAt)
    ORDER BY date DESC
  ` as Array<{ date: string; count: bigint }>

  return {
    totalRequests,
    totalCharacters,
    totalQuotaUsed,
    averageAiScoreBefore: avgScores._avg.aiScoreBefore || 0,
    averageAiScoreAfter: avgScores._avg.aiScoreAfter || 0,
    averageUniquenessScore: avgScores._avg.uniquenessScore || 0,
    usageByActionType: stats.reduce((acc, s) => {
      acc[s.actionType] = s._count
      return acc
    }, {} as Record<string, number>),
    usageByDay: usageByDay.map((u) => ({
      date: u.date,
      count: Number(u.count),
    })),
  }
}
