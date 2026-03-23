import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { deductQuota, checkQuota, calculateQuotaDeduction, type ActionType } from "@/lib/quota"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Please sign in to use this feature" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { text, checkType = "all" } = body

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
    const actionType: ActionType = "CHECK"
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

    // Perform uniqueness check (mock)
    const result = calculateUniqueness(text, checkType)

    // Deduct quota
    try {
      await deductQuota(session.user.id, quotaNeeded, actionType, {
        inputLength,
        uniquenessScore: result.uniquenessScore,
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
      data: result
    })
  } catch (error) {
    console.error("Uniqueness check error:", error)
    return NextResponse.json(
      { success: false, error: "Check failed" },
      { status: 500 }
    )
  }
}

function calculateUniqueness(text: string, checkType: string) {
  const result = {
    uniquenessScore: 0,
    riskLevel: "low" as "low" | "medium" | "high",
    matches: [] as any[],
    details: {
      templateMatchScore: 0,
      vocabularyDiversity: 0,
      sentenceStructureVariety: 0,
      paragraphPatternScore: 0,
    }
  }

  // Template matching
  const commonTemplates = [
    "In today's rapidly evolving world",
    "With the advent of",
    "It is important to note that",
    "In conclusion,",
    "To sum up,",
    "First, Second, Third",
  ]

  let templateMatches = 0
  commonTemplates.forEach(template => {
    if (text.toLowerCase().includes(template.toLowerCase())) {
      templateMatches++
      result.matches.push({
        type: "template",
        matchedPattern: template,
        similarity: 0.8,
        text: template,
        suggestion: "用更独特的表达方式",
      })
    }
  })

  result.details.templateMatchScore = Math.max(100 - templateMatches * 15, 0)

  // Vocabulary diversity
  const words = text.toLowerCase().split(/\s+/)
  const uniqueWords = new Set(words)
  const vocabularyDiversity = (uniqueWords.size / words.length) * 100
  result.details.vocabularyDiversity = Math.round(vocabularyDiversity)

  // High-frequency AI words
  const highFreqWords = ["crucial", "pivotal", "important", "significant", "essential"]
  highFreqWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    const matches = text.match(regex)
    if (matches && matches.length > 2) {
      result.matches.push({
        type: "vocabulary",
        word,
        frequency: matches.length,
        suggestion: "尝试使用更具体的同义词",
      })
    }
  })

  // Sentence structure variety
  const sentences = text.split(/[.!?]+/)
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length)
  const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length
  result.details.sentenceStructureVariety = Math.min(Math.round(variance * 10), 100)

  // Paragraph pattern
  const paragraphs = text.split(/\n\n+/)
  result.details.paragraphPatternScore = Math.min(Math.round(paragraphs.length * 15), 100)

  // Calculate overall uniqueness score
  result.uniquenessScore = Math.round(
    result.details.templateMatchScore * 0.4 +
    vocabularyDiversity * 0.3 +
    result.details.sentenceStructureVariety * 0.2 +
    result.details.paragraphPatternScore * 0.1
  )

  // Determine risk level
  if (result.uniquenessScore >= 70) {
    result.riskLevel = "low"
  } else if (result.uniquenessScore >= 40) {
    result.riskLevel = "medium"
  } else {
    result.riskLevel = "high"
  }

  return result
}
