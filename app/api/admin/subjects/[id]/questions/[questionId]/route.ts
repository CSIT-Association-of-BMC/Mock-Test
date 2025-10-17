import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; questionId: string }> }
) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, questionId } = await params;
        const { text, options, correctAnswerIndex } = await request.json();

        if (!text || !options || correctAnswerIndex === undefined) {
            return NextResponse.json(
                { error: "Question text, options, and correct answer index are required" },
                { status: 400 }
            );
        }

        if (!Array.isArray(options) || options.length < 2) {
            return NextResponse.json(
                { error: "At least 2 options are required" },
                { status: 400 }
            );
        }

        if (correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
            return NextResponse.json(
                { error: "Invalid correct answer index" },
                { status: 400 }
            );
        }

        // Verify question exists and belongs to the subject
        const existingQuestion = await prisma.question.findFirst({
            where: {
                id: questionId,
                subjectId: id,
            },
        });

        if (!existingQuestion) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        const updatedQuestion = await prisma.question.update({
            where: { id: questionId },
            data: {
                text,
                options,
                correctAnswerIndex,
            },
        });

        return NextResponse.json(updatedQuestion);
    } catch (error) {
        console.error("Error updating question:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; questionId: string }> }
) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, questionId } = await params;

        // Verify question exists and belongs to the subject
        const existingQuestion = await prisma.question.findFirst({
            where: {
                id: questionId,
                subjectId: id,
            },
        });

        if (!existingQuestion) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        // Check if question is linked to any question sets
        const linkedQuestionSets = await prisma.questionSet.findMany({
            where: {
                questions: {
                    some: {
                        id: questionId,
                    },
                },
            },
        });

        if (linkedQuestionSets.length > 0) {
            return NextResponse.json(
                {
                    error: "Cannot delete question that is linked to question sets. Remove it from question sets first.",
                    linkedSets: linkedQuestionSets.map(set => set.setName)
                },
                { status: 400 }
            );
        }

        await prisma.question.delete({
            where: { id: questionId },
        });

        return NextResponse.json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error("Error deleting question:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}