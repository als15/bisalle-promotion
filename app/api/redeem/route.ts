import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const redeemSchema = z.object({
  code: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = redeemSchema.parse(body);

    const participant = await prisma.participant.findUnique({
      where: { code },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Invalid code" },
        { status: 404 }
      );
    }

    if (participant.redeemed) {
      return NextResponse.json(
        { error: "This gift has already been redeemed" },
        { status: 400 }
      );
    }

    const updated = await prisma.participant.update({
      where: { code },
      data: {
        redeemed: true,
        redeemedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      participant: updated,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Redemption error:", error);
    return NextResponse.json(
      { error: "Redemption failed" },
      { status: 500 }
    );
  }
}
