import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const participant = await prisma.participant.findUnique({
      where: { code },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(participant);
  } catch (error) {
    console.error("Fetch participant error:", error);
    return NextResponse.json(
      { error: "Failed to fetch participant" },
      { status: 500 }
    );
  }
}
