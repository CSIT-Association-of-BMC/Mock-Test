import { NextRequest, NextResponse } from "next/server";
import { getUserSession, getAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
    try {
        // First check for user session
        const userSession = await getUserSession();

        if (userSession) {
            // Get user details
            const user = await prisma.user.findUnique({
                where: { id: userSession.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });

            if (user) {
                return NextResponse.json({
                    authenticated: true,
                    user: { ...user, role: 'user' },
                });
            }
        }

        // If no user session, check for admin session
        const adminSession = await getAdminSession();

        if (adminSession) {
            // Get admin details
            const admin = await prisma.admin.findUnique({
                where: { id: adminSession.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });

            if (admin) {
                return NextResponse.json({
                    authenticated: true,
                    user: { ...admin, role: admin.role, isAdmin: true },
                });
            }
        }

        return NextResponse.json(
            { authenticated: false },
            { status: 200 }
        );
    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}