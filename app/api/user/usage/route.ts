import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserUsage } from "@/lib/quota"

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get("limit")) || 20
    const offset = Number(searchParams.get("offset")) || 0
    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : undefined
    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : undefined

    const result = await getUserUsage(session.user.id, {
      limit,
      offset,
      startDate,
      endDate,
    })

    return NextResponse.json({
      success: true,
      data: {
        usages: result.usages,
        total: result.total,
        limit,
        offset,
      }
    })
  } catch (error) {
    console.error("Get usage error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get usage" },
      { status: 500 }
    )
  }
}
