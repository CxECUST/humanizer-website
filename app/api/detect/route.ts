import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { deductQuota, checkQuota, calculateQuotaDeduction, type ActionType } from "@/lib/quota"

export async function POST(request: Request) {
  try {
    const session = await auth()

    // Allow anonymous access with limits, but logged in users get better experience
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Please sign in to use this feature" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      )
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { success: false, error: "Text exceeds maximum length of 5000 characters" },
        { status: 400 }
      )
    }

    const inputLength = text.length
    const actionType: ActionType = "DETECT"
    const quotaNeeded = calculateQuotaDeduction(actionType, inputLength)

    // Check quota
    const hasQuota = await checkQuota(session.user.id, quotaNeeded)
    if (!hasQuota) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INSUFFICIENT_QUOTA",
            message: "额度不足，请升级套餐或等待下月重置",
          }
        },
        { status: 402 }
      )
    }

    // Detect AI patterns (mock)
    const aiScore = calculateAIScore(text)
    const patterns = detectAIPatterns(text)

    // Deduct quota
    try {
      await deductQuota(session.user.id, quotaNeeded, actionType, {
        inputLength,
      })
    } catch (quotaError) {
      if ((quotaError as Error).message === "INSUFFICIENT_QUOTA") {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INSUFFICIENT_QUOTA",
              message: "额度不足，请升级套餐或等待下月重置",
            }
          },
          { status: 402 }
        )
      }
      throw quotaError
    }

    return NextResponse.json({
      success: true,
      data: {
        aiScore,
        patterns,
        quotaDeducted: quotaNeeded,
      }
    })
  } catch (error) {
    console.error("Detect error:", error)
    return NextResponse.json(
      { success: false, error: "Detection failed" },
      { status: 500 }
    )
  }
}

function calculateAIScore(text: string): number {
  const aiIndicators = [
    /\bcrucial\b/gi,
    /\bpivotal\b/gi,
    /\btestament to\b/gi,
    /\bunderscores\b/gi,
    /\bhighlights\b/gi,
    /\bserves as\b/gi,
    /\bstands as\b/gi,
    /\bAdditionally,\b/gi,
    /\bFurthermore,\b/gi,
    /\bMoreover,\b/gi,
    /\bin today's rapidly evolving\b/gi,
    /\bit is important to note that\b/gi,
  ]

  let matchCount = 0
  aiIndicators.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      matchCount += matches.length
    }
  })

  const words = text.split(/\s+/).length
  const baseScore = Math.min((matchCount / Math.max(words, 1)) * 100, 50)

  // Add some randomness for variety
  return Math.min(Math.floor(baseScore + Math.random() * 20), 90)
}

function detectAIPatterns(text: string): any[] {
  const patterns: any[] = []

  const aiPatterns = [
    { pattern: /\bcrucial\b/gi, type: "ai_vocabulary", suggestion: "important" },
    { pattern: /\bpivotal\b/gi, type: "ai_vocabulary", suggestion: "key" },
    { pattern: /\btestament to\b/gi, type: "ai_vocabulary", suggestion: "shows" },
    { pattern: /\bunderscores\b/gi, type: "ai_vocabulary", suggestion: "highlights" },
    { pattern: /\bserves as\b/gi, type: "ai_structure", suggestion: "is" },
    { pattern: /\bstands as\b/gi, type: "ai_structure", suggestion: "is" },
    { pattern: /\bAdditionally,\s/gi, type: "ai_transition", suggestion: "Remove" },
    { pattern: /\bFurthermore,\s/gi, type: "ai_transition", suggestion: "Remove" },
    { pattern: /\bMoreover,\s/gi, type: "ai_transition", suggestion: "Remove" },
  ]

  aiPatterns.forEach(({ pattern, type, suggestion }) => {
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach(match => {
        const index = text.indexOf(match)
        patterns.push({
          type,
          text: match,
          position: [index, index + match.length],
          suggestion,
        })
      })
    }
  })

  return patterns
}
