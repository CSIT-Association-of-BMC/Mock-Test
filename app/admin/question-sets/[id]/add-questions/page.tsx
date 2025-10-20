"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

type Subject = {
  id: string;
  name: string;
};

type Question = {
  text: string;
  options: string[];
  correctAnswerIndex: number;
  subjectId: string;
};

export default function AddQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSubjects();
    // Initialize with 100 empty questions
    const initialQuestions: Question[] = Array(100)
      .fill(null)
      .map(() => ({
        text: "",
        options: ["", "", "", ""],
        correctAnswerIndex: 0,
        subjectId: "",
      }));
    setQuestions(initialQuestions);
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/admin/subjects");
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | string[] | number
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
    setQuestions(updatedQuestions);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        setError(`Question ${i + 1}: Question text is required`);
        return false;
      }
      if (!q.subjectId) {
        setError(`Question ${i + 1}: Subject is required`);
        return false;
      }
      for (let j = 0; j < 4; j++) {
        if (!q.options[j].trim()) {
          setError(`Question ${i + 1}: Option ${j + 1} is required`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!validateQuestions()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/question-sets/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin");
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to add questions");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = () => {
    const csvInput = prompt(
      "Paste CSV data (format: question,option1,option2,option3,option4,correctIndex,subjectName):"
    );

    if (csvInput) {
      const lines = csvInput.trim().split("\n");
      const imported: Question[] = [];

      for (const line of lines) {
        const parts = line.split(",").map((s) => s.trim());
        if (parts.length >= 7) {
          const subjectName = parts[6];
          const subject = subjects.find(
            (s) => s.name.toLowerCase() === subjectName.toLowerCase()
          );

          if (subject) {
            imported.push({
              text: parts[0],
              options: [parts[1], parts[2], parts[3], parts[4]],
              correctAnswerIndex: parseInt(parts[5]),
              subjectId: subject.id,
            });
          }
        }
      }

      if (imported.length > 0) {
        const newQuestions = [...imported];
        while (newQuestions.length < 100) {
          newQuestions.push({
            text: "",
            options: ["", "", "", ""],
            correctAnswerIndex: 0,
            subjectId: "",
          });
        }
        setQuestions(newQuestions.slice(0, 100));
        alert(`Imported ${imported.length} questions`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <Button
            onClick={() => router.push("/admin")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save All Questions"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Questions saved successfully! Redirecting...
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Add 100 Questions
          </h1>
          <p className="text-gray-600 mb-6">
            Fill in all 100 questions with their options, correct answers, and
            subjects
          </p>

          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">
                    Question {qIndex + 1}
                  </h3>
                  <div className="flex gap-2">
                    <select
                      value={question.subjectId}
                      onChange={(e) =>
                        updateQuestion(qIndex, "subjectId", e.target.value)
                      }
                      className="px-3 py-1 border rounded text-sm"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Text
                    </label>
                    <textarea
                      value={question.text}
                      onChange={(e) =>
                        updateQuestion(qIndex, "text", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={2}
                      placeholder="Enter question text"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={question.correctAnswerIndex === oIndex}
                          onChange={() =>
                            updateQuestion(qIndex, "correctAnswerIndex", oIndex)
                          }
                          className="w-4 h-4"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            updateOption(qIndex, oIndex, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border rounded"
                          placeholder={`Option ${oIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
