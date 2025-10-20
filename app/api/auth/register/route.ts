import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "your-secret-key");

export async function POST(request: NextRequest) {
    try {
        const { email, password, name, priorityCollege, howHeard, howHeardOther } = await request.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Determine the final howHeard value
        const finalHowHeard = howHeard === "other" ? howHeardOther : howHeard;

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                priorityCollege: priorityCollege || null,
                howHeard: finalHowHeard || null,
            },
        });

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

        return NextResponse.json({
            success: true,
            user: { id: user.id, email: user.email, name: user.name, role: "user" },
        });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
