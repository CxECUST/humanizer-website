import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserQuota } from "@/lib/quota"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const quota = await getUserQuota(session.user.id)

    if (!quota) {
      return NextResponse.json(
        { success: false, error: "Quota not found" },
        { status: 404 }
      )
    }

    const usagePercentage = quota.totalQuota > 0
      ? Math.round((quota.usedQuota / quota.totalQuota) * 100)
      : 0

    return NextResponse.json({
      success: true,
      data: {
        totalQuota: quota.totalQuota,
        usedQuota: quota.usedQuota,
        remainingQuota: quota.remainingQuota,
        planType: quota.planType,
        lastRenewalDate: quota.lastRenewalDate,
        nextRenewalDate: quota.nextRenewalDate,
        usagePercentage,
      }
    })
  } catch (error) {
    console.error("Get quota error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get quota" },
      { status: 500 }
    )
  }
}
