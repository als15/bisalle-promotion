import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
}).refine(
  (data) => data.email || data.phone,
  "Either email or phone is required"
);

function generateCode(): string {
  return randomBytes(16).toString("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    // Check if email or phone already exists
    if (validated.email) {
      const existing = await prisma.participant.findUnique({
        where: { email: validated.email },
      });
      if (existing) {
        return NextResponse.json(
          { error: "This email has already been registered" },
          { status: 400 }
        );
      }
    }

    if (validated.phone) {
      const existing = await prisma.participant.findUnique({
        where: { phone: validated.phone },
      });
      if (existing) {
        return NextResponse.json(
          { error: "This phone number has already been registered" },
          { status: 400 }
        );
      }
    }

    // Create participant with unique code
    const code = generateCode();
    const participant = await prisma.participant.create({
      data: {
        fullName: validated.fullName,
        email: validated.email || null,
        phone: validated.phone || null,
        code,
      },
    });

    return NextResponse.json({
      code: participant.code,
      id: participant.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
