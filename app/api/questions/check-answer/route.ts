import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { questionId, selectedAnswer } = await request.json();

        if (!questionId || typeof selectedAnswer !== 'number') {
            return NextResponse.json(
                { error: "Question ID and selected answer are required" },
                { status: 400 }
            );
        }

        const question = await prisma.question.findUnique({
            where: { id: questionId },
            select: {
                correctAnswerIndex: true,
            }
        });

        if (!question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        const isCorrect = question.correctAnswerIndex === selectedAnswer;

        return NextResponse.json({
            isCorrect,
            correctAnswer: question.correctAnswerIndex
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}