import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "your-secret-key");

export async function getAdminSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token");

    if (!token) {
        return null;
    }

    try {
        const verified = await jwtVerify(token.value, secret);
        return verified.payload as { id: string; email: string; role: string };
    } catch (_error) {
        return null;
    }
}

export async function getUserSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("user-token");

    if (!token) {
        return null;
    }

    try {
        const verified = await jwtVerify(token.value, secret);
        return verified.payload as { id: string; email: string; role: string };
    } catch (_error) {
        return null;
    }
}
