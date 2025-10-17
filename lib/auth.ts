import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authConfig: NextAuthConfig = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                userType: { label: "User Type", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const userType = credentials.userType as string;

                if (userType === 'admin') {
                    const admin = await prisma.admin.findUnique({
                        where: { email: credentials.email as string }
                    });

                    if (!admin) return null;

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password as string,
                        admin.password
                    );

                    if (!isPasswordValid) return null;

                    return {
                        id: admin.id,
                        email: admin.email,
                        name: admin.name,
                        role: admin.role,
                    };
                } else {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email as string }
                    });

                    if (!user) return null;

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    );

                    if (!isPasswordValid) return null;

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: 'user',
                    };
                }
            },
        }),
    ],
    pages: {
        signIn: "/result/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || 'user';
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
