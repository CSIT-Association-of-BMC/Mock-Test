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

        // Verify all questions exist and are not already linked to another set
        const questions = await prisma.question.findMany({
            where: {
                id: { in: questionIds },
            },
        });

        if (questions.length !== questionIds.length) {
            return NextResponse.json(
                { error: "Some questions not found" },
                { status: 400 }
            );
        }

        // Check if any questions are already linked to another question set
        const linkedQuestions = questions.filter(q => q.questionSetId && q.questionSetId !== id);
        if (linkedQuestions.length > 0) {
            return NextResponse.json(
                {
                    error: "Some questions are already linked to other question sets",
                    linkedQuestions: linkedQuestions.map(q => ({ id: q.id, text: q.text }))
                },
                { status: 400 }
            );
        }

        // Link questions to the question set
        await prisma.question.updateMany({
            where: {
                id: { in: questionIds },
            },
            data: {
                questionSetId: id,
            },
        });

        // Get updated question set with linked questions
        const updatedQuestionSet = await prisma.questionSet.findUnique({
            where: { id },
            include: {
                questions: {
                    include: {
                        subject: true,
                    },
                },
                _count: {
                    select: { questions: true },
                },
            },
        });

        return NextResponse.json(updatedQuestionSet);
    } catch (error) {
        console.error("Error linking questions:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}