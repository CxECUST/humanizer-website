import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().min(1, "Email is required").refine(
    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    { message: "Please enter a valid email address" }
  ),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with quota
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        quota: {
          create: {
            totalQuota: 1000,
            usedQuota: 0,
            remainingQuota: 1000,
            planType: "FREE",
            lastRenewalDate: new Date(),
          }
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
      }
    })

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
      return NextResponse.json(
        { success: false, error: `Invalid input: ${issues}` },
        { status: 400 }
      )
    }

    console.error("Registration error:", error)
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    )
  }
}
