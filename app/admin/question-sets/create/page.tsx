"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreateQuestionSetPage() {
  const [setName, setSetName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/question-sets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setName }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/admin/question-sets/${data.id}/link-questions`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create question set");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          onClick={() => router.push("/admin")}
          variant="outline"
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create New Question Set
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="setName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Question Set Name <span className="text-red-500">*</span>
              </label>
              <input
                id="setName"
                type="text"
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                required
                placeholder="e.g., Mock Test 2025 - Set 1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              <p className="mt-2 text-sm text-gray-600">
                Choose a descriptive name for your question set
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => router.push("/admin")}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !setName.trim()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? "Creating..." : "Create & Add Questions"}
              </Button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>
                After creating the set, you&apos;ll link questions from the
                question bank
              </li>
              <li>
                Select questions from subjects (Physics, Chemistry, Math,
                English, Computer Science)
              </li>
              <li>You can add as few as 4-5 questions or up to any number</li>
              <li>
                Questions are managed individually in the Subjects section
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
