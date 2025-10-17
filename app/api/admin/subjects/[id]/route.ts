import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const subject = await prisma.subject.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { questions: true },
                },
            },
        });

        if (!subject) {
            return NextResponse.json(
                { error: "Subject not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(subject);
    } catch (error) {
        console.error("Error fetching subject:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}