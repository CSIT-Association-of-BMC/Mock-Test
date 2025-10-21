"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Minimize2, AlertCircle } from "lucide-react";
import { submitFeedback } from "@/lib/actions";
import { toast } from "sonner";

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has already closed the widget
    const hasClosed = localStorage.getItem("feedback-widget-closed");
    if (hasClosed) return;

    // Show widget after 1 minute
    const timer = setTimeout(() => {
      setShowWidget(true);
    }, 10000); // 60 seconds //60000

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
    // Don't hide the widget completely, just close the dialog
  };

  const handleMinimize = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData for server action
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("message", formData.message);

      // Use server action instead of fetch
      const result = await submitFeedback(submitData);

      if (result.success) {
        setSubmitted(true);
        toast.success("Feedback Submitted!", {
          description: "Thank you for your feedback. We appreciate your input!",
        });
        // Don't auto-close, let user see the success message
        setTimeout(() => {
          setSubmitted(false);
          setIsOpen(false);
          setIsMinimized(true);
          // Reset form
          setFormData({ name: "", email: "", message: "" });
        }, 3000);
      } else {
        setError(
          result.message || "Failed to send feedback. Please try again."
        );
        toast.error("Submission Failed", {
          description:
            result.message || "Failed to send feedback. Please try again.",
        });
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!showWidget && !isMinimized) return null;

  return (
    <>
      {/* Fixed Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {isMinimized ? (
          <Button
            onClick={handleOpen}
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
            size="icon"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        ) : (
          <Button
            onClick={handleOpen}
            className="h-14 px-4 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">Feedback</span>
          </Button>
        )}
      </div>

      {/* Feedback Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md max-w-[95vw] p-0 overflow-hidden border-0 shadow-2xl"
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-4 w-4" />
              </div>
              <DialogTitle className="text-lg font-semibold">
                Report a Problem / Feedback
              </DialogTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMinimize}
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10 rounded-lg transition-colors"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Thank you!
                </h3>
                <p className="text-gray-600">
                  Your feedback has been submitted successfully.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full h-11 border-gray-300 focus:border-primary focus:ring-primary/20 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="w-full h-11 border-gray-300 focus:border-primary focus:ring-primary/20 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    placeholder="Describe the problem or share your feedback in detail..."
                    required
                    className="w-full min-h-[120px] resize-none border-gray-300 focus:border-primary focus:ring-primary/20 transition-colors"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Sending Feedback...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Feedback
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
