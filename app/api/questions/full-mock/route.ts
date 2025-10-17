import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Get the most recent active question set with questions
        const questionSet = await prisma.questionSet.findFirst({
            where: {
                isActive: true,
                questions: {
                    some: {},
                },
            },
            include: {
                questions: {
                    include: {
                        subject: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (!questionSet) {
            return NextResponse.json(
                { error: "No active question set found" },
                { status: 404 }
            );
        }

        // Check if we have at least some questions (no minimum requirement)
        if (questionSet.questions.length === 0) {
            return NextResponse.json(
                { error: "Question set has no questions" },
                { status: 400 }
            );
        }

        // Remove correct answers from response (client shouldn't see them until submission)
        const questionsForClient = questionSet.questions.map((q: any) => ({
            id: q.id,
            text: q.text,
            options: q.options,
            subjectId: q.subjectId,
            subjectName: q.subject.name,
        }));

        return NextResponse.json({
            setId: questionSet.id,
            setName: questionSet.setName,
            questions: questionsForClient,
        });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
