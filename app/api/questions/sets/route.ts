import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
    try {
        // Return active question sets (most recent first)
        const sets = await prisma.questionSet.findMany({
            where: { isActive: true },
            include: { _count: { select: { questions: true } } },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(sets);
    } catch (error) {
        console.error("Error fetching question sets:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
