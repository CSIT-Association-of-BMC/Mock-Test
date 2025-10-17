import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
    try {
        const session = await getUserSession();

        if (!session) {
            return NextResponse.json(
                { authenticated: false },
                { status: 200 }
            );
        }

        // Get user details
        const user = await prisma.user.findUnique({
            where: { id: session.id },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { authenticated: false },
                { status: 200 }
            );
        }

        return NextResponse.json({
            authenticated: true,
            user,
        });
    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}