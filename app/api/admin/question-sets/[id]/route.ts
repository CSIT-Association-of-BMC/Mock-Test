import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

type QuestionInput = {
    text: string;
    options: string[];
    correctAnswerIndex: number;
    subjectId: string;
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const questionSet = await prisma.questionSet.findUnique({
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

        if (!questionSet) {
            return NextResponse.json(
                { error: "Question set not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(questionSet);
    } catch (error) {
        console.error("Error fetching question set:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

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
        const { questions } = await request.json();

        if (!questions || !Array.isArray(questions)) {
            return NextResponse.json(
                { error: "Questions array is required" },
                { status: 400 }
            );
        }

        // Create questions in bulk
        const createdQuestions = await prisma.question.createMany({
            data: questions.map((q: QuestionInput) => ({
                text: q.text,
                options: q.options,
                correctAnswerIndex: q.correctAnswerIndex,
                subjectId: q.subjectId,
                questionSetId: id,
            })),
        });

        return NextResponse.json(createdQuestions);
    } catch (error) {
        console.error("Error adding questions:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Check if question set exists
        const questionSet = await prisma.questionSet.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { questions: true },
                },
            },
        });

        if (!questionSet) {
            return NextResponse.json(
                { error: "Question set not found" },
                { status: 404 }
            );
        }

        // Delete the question set (this will cascade delete related questions due to Prisma schema)
        await prisma.questionSet.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Question set deleted successfully" });
    } catch (error) {
        console.error("Error deleting question set:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
