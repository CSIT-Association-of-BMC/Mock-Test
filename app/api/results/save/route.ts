import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/session";

type AnswerDetail = {
    questionId: string;
    selectedAnswer: number;
};

type ParsedAttemptDetails = {
    answers: AnswerDetail[];
};

export async function POST(request: NextRequest) {
    try {
        const session = await getUserSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { userId, setId, totalQuestions, attemptDetails, testType, subjectId } = body ?? {};

        // Verify the session user matches the provided userId
        if (session.id !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Validate required fields
        if (typeof totalQuestions !== "number") {
            return NextResponse.json({ error: "Missing or invalid totalQuestions" }, { status: 400 });
        }

        // Parse attempt details to calculate actual score
        let parsedDetails: ParsedAttemptDetails | null = null;
        try {
            if (typeof attemptDetails === "string") {
                parsedDetails = JSON.parse(attemptDetails);
            } else if (attemptDetails && typeof attemptDetails === "object") {
                parsedDetails = attemptDetails as ParsedAttemptDetails;
            } else {
                // attemptDetails missing or invalid
                console.error("Invalid attemptDetails received:", { attemptDetails, body });
                return NextResponse.json({ error: "Missing or invalid attemptDetails" }, { status: 400 });
            }
        } catch (err) {
            console.error("Failed to parse attemptDetails:", err, { attemptDetails, body });
            return NextResponse.json({ error: "Invalid attemptDetails JSON" }, { status: 400 });
        }

        const questionIds = parsedDetails && Array.isArray(parsedDetails.answers)
            ? parsedDetails.answers.map((a: AnswerDetail) => a.questionId)
            : [];

        // Fetch the correct answers
        const questions = await prisma.question.findMany({
            where: {
                id: { in: questionIds },
            },
            select: {
                id: true,
                correctAnswerIndex: true,
            },
        });

        // Calculate real score
        let correctCount = 0;
        if (parsedDetails && Array.isArray(parsedDetails.answers)) {
            parsedDetails.answers.forEach((answer: AnswerDetail) => {
                const question = questions.find((q) => q.id === answer.questionId);
                if (question && answer.selectedAnswer === question.correctAnswerIndex) {
                    correctCount++;
                }
            });
        }

        // Save result to database
        const result = await prisma.userResult.create({
            data: {
                userId,
                questionSetId: testType === "full_mock" ? setId : null,
                subjectId: testType === "subject_wise" ? subjectId : null,
                score: correctCount,
                totalQuestions,
                attemptDetails,
                testType,
            },
        });

        return NextResponse.json({ success: true, resultId: result.id, actualScore: correctCount });
    } catch (error) {
        console.error("Error saving result:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
