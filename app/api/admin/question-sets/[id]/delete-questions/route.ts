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

        // Delete questions from database (only if they belong to this set)
        const result = await prisma.question.deleteMany({
            where: {
                id: { in: questionIds },
                questionSetId: id, // Only delete if currently linked to this set
            },
        });

        return NextResponse.json({
            message: `Successfully deleted ${result.count} questions`,
            deletedCount: result.count,
        });
    } catch (error) {
        console.error("Error deleting questions:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}