"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for feedback
const feedbackSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(3, "Message must be at least 3 characters").max(1000, "Message is too long"),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;

export async function submitFeedback(formData: FormData) {
    try {
        // Extract form data
        const rawData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            message: formData.get("message") as string,
        };

        // Validate the data
        const validatedData = feedbackSchema.parse(rawData);

        // Save to database
        const feedback = await prisma.feedback.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                message: validatedData.message,
            },
        });

        // Revalidate any pages that might show feedback (optional)
        // revalidatePath("/admin/feedback"); // Uncomment if you have an admin page

        return {
            success: true,
            message: "Feedback submitted successfully",
            feedbackId: feedback.id,
        };
    } catch (error) {
        console.error("Feedback submission error:", error);

        if (error instanceof z.ZodError) {
            // Handle validation errors
            const errorMessages = error.issues.map((issue) => issue.message);
            return {
                success: false,
                message: errorMessages.join(". "),
            };
        }

        // Handle other errors
        return {
            success: false,
            message: "Failed to submit feedback. Please try again.",
        };
    }
}

// Server action to get all feedback (for admin use)
export async function getAllFeedback() {
    try {
        const feedback = await prisma.feedback.findMany({
            orderBy: {
                createdAt: "desc",
            },
        }); return {
            success: true,
            data: feedback,
        };
    } catch (error) {
        console.error("Error fetching feedback:", error);
        return {
            success: false,
            message: "Failed to fetch feedback",
        };
    }
}

// Server action to mark feedback as read (for admin use)
export async function markFeedbackAsRead(feedbackId: string) {
    try {
        await (prisma as any).feedback.update({
            where: { id: feedbackId },
            data: { isRead: true },
        });

        return {
            success: true,
            message: "Feedback marked as read",
        };
    } catch (error) {
        console.error("Error marking feedback as read:", error);
        return {
            success: false,
            message: "Failed to mark feedback as read",
        };
    }
}