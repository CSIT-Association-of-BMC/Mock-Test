import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { questionIds } = await request.json();

        if (!questionIds || !Array.isArray(questionIds)) {
            return NextResponse.json(
                { error: "Question IDs array is required" },
                { status: 400 }
            );
        }

        // Verify question set exists
        const questionSet = await prisma.questionSet.findUnique({
            where: { id },
        });

        if (!questionSet) {
            return NextResponse.json(
                { error: "Question set not found" },
                { status: 404 }
            );
        }

        // Unlink questions from this set (set questionSetId to null)
        const result = await prisma.question.updateMany({
            where: {
                id: { in: questionIds },
                questionSetId: id, // Only unlink if currently linked to this set
            },
            data: {
                questionSetId: null,
            },
        });

        return NextResponse.json({
            message: `Successfully unlinked ${result.count} questions`,
            unlinkedCount: result.count,
        });
    } catch (error) {
        console.error("Error unlinking questions:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}