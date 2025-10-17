import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

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

        // Verify subject exists
        const subject = await prisma.subject.findUnique({
            where: { id },
        });

        if (!subject) {
            return NextResponse.json(
                { error: "Subject not found" },
                { status: 404 }
            );
        }

        const questions = await prisma.question.findMany({
            where: { subjectId: id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
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

        // Verify subject exists
        const subject = await prisma.subject.findUnique({
            where: { id },
        });

        if (!subject) {
            return NextResponse.json(
                { error: "Subject not found" },
                { status: 404 }
            );
        }

        const question = await prisma.question.create({
            data: {
                text,
                options,
                correctAnswerIndex,
                subjectId: id,
            },
        });

        return NextResponse.json(question, { status: 201 });
    } catch (error) {
        console.error("Error creating question:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}