import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const subjects = await prisma.subject.findMany({
            include: {
                _count: {
                    select: { questions: true },
                },
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(subjects);
    } catch (error) {
        console.error("Error fetching subjects:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
