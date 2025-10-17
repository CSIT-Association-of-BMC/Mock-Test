import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type QuestionWithSubject = {
    id: string;
    text: string;
    options: string[];
    subjectId: string;
    subject: {
        name: string;
    };
};

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const setId = url.searchParams.get("setId");

        // If setId is provided, try to fetch that set; otherwise pick most recent active set
        const questionSet = setId
            ? await prisma.questionSet.findUnique({
                where: { id: setId },
                include: { questions: { include: { subject: true } } },
            })
            : await prisma.questionSet.findFirst({
                where: {
                    isActive: true,
                    questions: { some: {} },
                },
                include: { questions: { include: { subject: true } } },
                orderBy: { createdAt: "desc" },
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
        const questionsForClient = questionSet.questions.map((q: QuestionWithSubject) => ({
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
