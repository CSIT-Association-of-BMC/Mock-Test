import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "your-secret-key");

export async function POST(request: NextRequest) {
    try {
        const { email, password, userType } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        if (userType === "admin") {
            const admin = await prisma.admin.findUnique({
                where: { email },
            });

            if (!admin) {
                return NextResponse.json(
                    { error: "Invalid credentials" },
                    { status: 401 }
                );
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);

            if (!isPasswordValid) {
                return NextResponse.json(
                    { error: "Invalid credentials" },
                    { status: 401 }
                );
            }

            // Create JWT token
            const token = await new SignJWT({ id: admin.id, email: admin.email, role: "admin" })
                .setProtectedHeader({ alg: "HS256" })
                .setExpirationTime("24h")
                .sign(secret);

            // Set cookie
            (await cookies()).set("admin-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24, // 24 hours
            });

            return NextResponse.json({ success: true, user: { id: admin.id, email: admin.email, role: "admin" } });
        } else {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return NextResponse.json(
                    { error: "Invalid credentials" },
                    { status: 401 }
                );
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return NextResponse.json(
                    { error: "Invalid credentials" },
                    { status: 401 }
                );
            }

            // Create JWT token
            const token = await new SignJWT({ id: user.id, email: user.email, role: "user" })
                .setProtectedHeader({ alg: "HS256" })
                .setExpirationTime("24h")
                .sign(secret);

            // Set cookie
            (await cookies()).set("user-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24, // 24 hours
            });

            return NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: "user" } });
        }
    } catch (error) {
        console.error("Sign in error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
