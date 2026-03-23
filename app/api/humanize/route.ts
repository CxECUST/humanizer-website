import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { deductQuota, checkQuota, calculateQuotaDeduction, type ActionType } from "@/lib/quota"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { text, mode = "standard", tone = "natural", language = "zh", antiDuplicate = false } = body

    // Validate input
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
    const actionType: ActionType = "HUMANIZE"
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
            remainingQuota: 0,
          }
        },
        { status: 402 }
      )
    }

    // Mock AI processing (replace with actual API call)
    const humanizedText = simulateHumanization(text, mode, tone)
    const aiScoreBefore = Math.floor(Math.random() * 30) + 50 // 50-80
    const aiScoreAfter = Math.floor(Math.random() * 20) + 10 // 10-30
    const uniquenessScore = Math.floor(Math.random() * 20) + 80 // 80-100

    // Deduct quota
    try {
      await deductQuota(session.user.id, quotaNeeded, actionType, {
        mode,
        tone,
        language,
        antiDuplicate,
        aiScoreBefore,
        aiScoreAfter,
        uniquenessScore,
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

    // Detect AI patterns (mock)
    const patternsFound = detectAIPatterns(text)

    return NextResponse.json({
      success: true,
      data: {
        original: text,
        humanized: humanizedText,
        changes: patternsFound,
        stats: {
          aiScoreBefore,
          aiScoreAfter,
          uniquenessScore,
          inputLength,
          quotaDeducted: quotaNeeded,
          remainingQuota: (quotaNeeded * -1), // Will be updated in production
        }
      }
    })
  } catch (error) {
    console.error("Humanize error:", error)
    return NextResponse.json(
      { success: false, error: "Processing failed" },
      { status: 500 }
    )
  }
}

// Mock humanization function - replace with actual AI API
function simulateHumanization(text: string, mode: string, tone: string): string {
  // This is a placeholder - in production, you would call Claude API or similar
  const modifications = [
    "crucial" => "important",
    "pivotal" => "key",
    "testament to" => "shows",
    "underscores" => "highlights",
    "Additionally," => "",
    "Furthermore," => "",
    "Moreover," => "",
    "In today's rapidly evolving" => "In our current",
    "It is important to note that" => "Note that",
    "serves as" => "is",
    "stands as" => "is",
  ]

  let result = text
  for (const [oldWord, newWord] of Object.entries(modifications)) {
    const regex = new RegExp(oldWord, "gi")
    result = result.replace(regex, newWord)
  }

  return result
}

// Mock AI pattern detection
function detectAIPatterns(text: string): any[] {
  const patterns: any[] = []

  const aiWords = ["crucial", "pivotal", "testament", "underscores", "additionally", "furthermore"]
  aiWords.forEach(word => {
    const regex = new RegExp(word, "gi")
    if (regex.test(text)) {
      patterns.push({
        type: "ai_vocabulary",
        original: word,
        replacement: "more natural alternative",
        reason: "AI常用词汇替换",
      })
    }
  })

  return patterns
}
