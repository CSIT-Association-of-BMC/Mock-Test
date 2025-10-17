import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/session";

export async function POST(request: NextRequest) {
    try {
        const session = await getUserSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId, setId, score, totalQuestions, attemptDetails, testType, subjectId } = await request.json();

        // Verify the session user matches the provided userId
        if (session.id !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse attempt details to calculate actual score
        const parsedDetails = JSON.parse(attemptDetails);
        const questionIds = parsedDetails.answers.map((a: any) => a.questionId);

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
        parsedDetails.answers.forEach((answer: any, index: number) => {
            const question = questions.find((q: any) => q.id === answer.questionId);
            if (question && answer.selectedAnswer === question.correctAnswerIndex) {
                correctCount++;
            }
        });

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
