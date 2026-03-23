import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUsageStats } from "@/lib/quota"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const stats = await getUsageStats(session.user.id)

    const averageAiScoreImprovement =
      stats.averageAiScoreBefore && stats.averageAiScoreAfter
        ? stats.averageAiScoreBefore - stats.averageAiScoreAfter
        : 0

    return NextResponse.json({
      success: true,
      data: {
        totalRequests: stats.totalRequests,
        totalCharactersProcessed: stats.totalCharacters,
        totalQuotaUsed: stats.totalQuotaUsed,
        averageAiScoreImprovement,
        averageUniquenessScore: stats.averageUniquenessScore,
        usageByDay: stats.usageByDay,
        usageByActionType: stats.usageByActionType,
      }
    })
  } catch (error) {
    console.error("Get usage stats error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get usage stats" },
      { status: 500 }
    )
  }
}
