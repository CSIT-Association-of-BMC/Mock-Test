"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FileText, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

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
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [csvInput, setCsvInput] = useState("");
  const [csvImportLoading, setCsvImportLoading] = useState(false);

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
    setCsvDialogOpen(true);
  };

  const handleCsvImport = async () => {
    if (!csvInput.trim()) {
      setError("Please enter CSV data");
      return;
    }

    setCsvImportLoading(true);
    setError("");

    try {
      const lines = csvInput.trim().split("\n");
      const imported: Question[] = [];
      const errors: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines

        const parts = line.split(",").map((s) => s.trim());
        if (parts.length < 7) {
          errors.push(
            `Line ${
              i + 1
            }: Invalid format. Expected 7 columns: question,option1,option2,option3,option4,correctIndex,subjectName`
          );
          continue;
        }

        const [
          questionText,
          opt1,
          opt2,
          opt3,
          opt4,
          correctIndexStr,
          subjectName,
        ] = parts;

        // Validate required fields
        if (!questionText) {
          errors.push(`Line ${i + 1}: Question text is required`);
          continue;
        }

        // Find subject
        const subject = subjects.find(
          (s) => s.name.toLowerCase() === subjectName.toLowerCase()
        );

        if (!subject) {
          errors.push(
            `Line ${
              i + 1
            }: Subject "${subjectName}" not found. Available subjects: ${subjects
              .map((s) => s.name)
              .join(", ")}`
          );
          continue;
        }

        // Validate correct answer index
        const correctIndex = parseInt(correctIndexStr);
        if (isNaN(correctIndex) || correctIndex < 0 || correctIndex > 3) {
          errors.push(
            `Line ${
              i + 1
            }: Correct answer index must be 0-3 (got ${correctIndexStr})`
          );
          continue;
        }

        imported.push({
          text: questionText,
          options: [opt1, opt2, opt3, opt4],
          correctAnswerIndex: correctIndex,
          subjectId: subject.id,
        });
      }

      if (errors.length > 0) {
        setError(`Import failed:\n${errors.join("\n")}`);
        return;
      }

      if (imported.length === 0) {
        setError("No valid questions found in CSV data");
        return;
      }

      // Merge imported questions with existing ones
      const newQuestions = [...questions];
      for (let i = 0; i < Math.min(imported.length, 100); i++) {
        if (i < newQuestions.length) {
          newQuestions[i] = imported[i];
        } else {
          newQuestions.push(imported[i]);
        }
      }

      setQuestions(newQuestions.slice(0, 100));
      setCsvDialogOpen(false);
      setCsvInput("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Show success message
      setTimeout(() => {
        alert(
          `Successfully imported ${imported.length} question${
            imported.length !== 1 ? "s" : ""
          }!`
        );
      }, 100);
    } catch (error) {
      console.error("CSV import error:", error);
      setError("Failed to parse CSV data. Please check the format.");
    } finally {
      setCsvImportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button
            onClick={() => router.push("/admin")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Dialog open={csvDialogOpen} onOpenChange={setCsvDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <FileText className="w-4 h-4" />
                  Add as CSV
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto px-6">
                <DialogHeader>
                  <DialogTitle>Import Questions from CSV</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CSV Format Instructions:
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm font-mono">
                      <div className="text-gray-600 mb-2">
                        Format:
                        question,option1,option2,option3,option4,correctIndex,subjectName
                      </div>
                      <div className="text-gray-500">Example:</div>
                      <div>What is 2+2?,2,3,4,5,0,Mathematics</div>
                      <div>
                        What is the capital of
                        Nepal?,Kathmandu,Pokhara,Lalitpur,Biratnagar,0,Geography
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        • correctIndex: 0=A, 1=B, 2=C, 3=D
                        <br />
                        • subjectName must match existing subjects
                        <br />• One question per line
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paste your CSV data:
                    </label>
                    <Textarea
                      value={csvInput}
                      onChange={(e) => setCsvInput(e.target.value)}
                      placeholder="Paste your CSV data here..."
                      className="min-h-[300px] font-mono text-sm"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCsvDialogOpen(false);
                        setCsvInput("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCsvImport}
                      disabled={csvImportLoading || !csvInput.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {csvImportLoading ? "Importing..." : "Import Questions"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
          <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Questions saved successfully! Redirecting...
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Add 100 Questions
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Fill in all 100 questions with their options, correct answers, and
              subjects. Use the CSV import for bulk operations.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-2 sm:pr-4">
            {questions.map((question, qIndex) => (
              <div
                key={qIndex}
                className="p-3 sm:p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2">
                  <h3 className="font-semibold text-base sm:text-lg">
                    Question {qIndex + 1}
                  </h3>
                  <div className="w-full sm:w-auto">
                    <select
                      value={question.subjectId}
                      onChange={(e) =>
                        updateQuestion(qIndex, "subjectId", e.target.value)
                      }
                      className="w-full sm:w-auto px-3 py-1 border rounded text-sm bg-white"
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
                      className="w-full px-3 py-2 border rounded-lg resize-vertical min-h-[60px] sm:min-h-[80px] text-sm sm:text-base"
                      rows={2}
                      placeholder="Enter question text"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Options (Select the correct answer)
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {question.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className="flex items-center gap-2 p-2 bg-white rounded border"
                        >
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctAnswerIndex === oIndex}
                            onChange={() =>
                              updateQuestion(
                                qIndex,
                                "correctAnswerIndex",
                                oIndex
                              )
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateOption(qIndex, oIndex, e.target.value)
                            }
                            className="flex-1 px-3 py-2 border rounded text-sm"
                            placeholder={`Option ${oIndex + 1}`}
                          />
                          <span className="text-xs text-gray-500 font-medium w-6 text-center">
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                        </div>
                      ))}
                    </div>
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
