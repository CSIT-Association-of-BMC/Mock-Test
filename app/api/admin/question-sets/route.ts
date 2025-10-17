import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const questionSets = await prisma.questionSet.findMany({
            include: {
                _count: {
                    select: { questions: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(questionSets);
    } catch (error) {
        console.error("Error fetching question sets:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { setName } = await request.json();

        if (!setName) {
            return NextResponse.json(
                { error: "Set name is required" },
                { status: 400 }
            );
        }

        const questionSet = await prisma.questionSet.create({
            data: {
                setName,
            },
        });

        return NextResponse.json(questionSet);
    } catch (error) {
        console.error("Error creating question set:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
