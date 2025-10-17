import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ subjectname: string }> }
) {
    try {
        const { subjectname } = await params;

        // Map URL path to database subject name
        const subjectNameMap: { [key: string]: string } = {
            'physics': 'Physics',
            'chemistry': 'Chemistry',
            'mathematics': 'Mathematics',
            'english': 'English',
            'computer-science': 'Computer Science'
        };

        const dbSubjectName = subjectNameMap[subjectname] || subjectname;

        // Find the subject by name
        const subject = await prisma.subject.findFirst({
            where: {
                name: {
                    equals: dbSubjectName,
                    mode: 'insensitive' // Case insensitive search
                }
            }
        });

        if (!subject) {
            return NextResponse.json(
                { error: "Subject not found" },
                { status: 404 }
            );
        }

        // Get all questions for this subject
        const questions = await prisma.question.findMany({
            where: {
                subjectId: subject.id
            },
            include: {
                subject: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        if (questions.length === 0) {
            return NextResponse.json(
                { error: "No questions available for this subject" },
                { status: 404 }
            );
        }

        // Remove correct answers from response (client shouldn't see them until submission)
        const questionsForClient = questions.map((q) => ({
            id: q.id,
            text: q.text,
            options: q.options,
            subjectId: q.subjectId,
            subjectName: q.subject.name,
        }));

        return NextResponse.json({
            subject: {
                id: subject.id,
                name: subject.name
            },
            questions: questionsForClient,
            totalQuestions: questionsForClient.length
        });
    } catch (error) {
        console.error("Error fetching subject questions:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}