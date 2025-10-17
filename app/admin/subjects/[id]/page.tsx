"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  PlusCircle,
  Edit,
  Trash2,
  BookOpen,
  FileText,
  CheckCircle,
} from "lucide-react";

type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  createdAt: string;
};

type Subject = {
  id: string;
  name: string;
  _count: {
    questions: number;
  };
};

export default function AdminSubjectPage() {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const router = useRouter();
  const params = useParams();
  const subjectId = params.id as string;

  // Form state
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSubjectAndQuestions = useCallback(async () => {
    try {
      // Fetch subject details
      const subjectResponse = await fetch(`/api/admin/subjects/${subjectId}`);
      if (subjectResponse.ok) {
        const subjectData = await subjectResponse.json();
        setSubject(subjectData);
      }

      // Fetch questions for this subject
      const questionsResponse = await fetch(
        `/api/admin/subjects/${subjectId}/questions`
      );
      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    fetchSubjectAndQuestions();
  }, [fetchSubjectAndQuestions]);

  const resetForm = () => {
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswerIndex(0);
    setEditingQuestion(null);
  };

  const handleAddQuestion = async () => {
    if (!questionText.trim() || options.some((opt) => !opt.trim())) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/admin/subjects/${subjectId}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: questionText,
            options,
            correctAnswerIndex,
          }),
        }
      );

      if (response.ok) {
        resetForm();
        setIsAddDialogOpen(false);
        fetchSubjectAndQuestions(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add question");
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionText(question.text);
    setOptions([...question.options]);
    setCorrectAnswerIndex(question.correctAnswerIndex);
    setIsAddDialogOpen(true);
  };

  const handleUpdateQuestion = async () => {
    if (
      !editingQuestion ||
      !questionText.trim() ||
      options.some((opt) => !opt.trim())
    ) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/admin/subjects/${subjectId}/questions/${editingQuestion.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: questionText,
            options,
            correctAnswerIndex,
          }),
        }
      );

      if (response.ok) {
        resetForm();
        setIsAddDialogOpen(false);
        fetchSubjectAndQuestions(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update question");
      }
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Failed to update question");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/subjects/${subjectId}/questions/${questionId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchSubjectAndQuestions(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Subject Not Found
          </h1>
          <Button onClick={() => router.push("/admin/subjects")}>
            Back to Subjects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/admin/subjects")}
                variant="outline"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Subjects
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {subject.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage questions for this subject
                </p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={resetForm}
                >
                  <PlusCircle className="w-5 h-5" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingQuestion ? "Edit Question" : "Add New Question"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text
                    </label>
                    <Textarea
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="Enter the question text..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer Options
                    </label>
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...options];
                            newOptions[index] = e.target.value;
                            setOptions(newOptions);
                          }}
                          placeholder={`Option ${index + 1}`}
                        />
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={correctAnswerIndex === index}
                          onChange={() => setCorrectAnswerIndex(index)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <label className="text-sm text-gray-600">Correct</label>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={
                        editingQuestion
                          ? handleUpdateQuestion
                          : handleAddQuestion
                      }
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting
                        ? "Saving..."
                        : editingQuestion
                        ? "Update Question"
                        : "Add Question"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Questions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {questions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Ready for Tests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {questions.length >= 4 ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
            <p className="text-gray-600 mt-1">
              {questions.length === 0
                ? "No questions added yet. Add your first question to get started."
                : `${questions.length} question${
                    questions.length !== 1 ? "s" : ""
                  } in this subject.`}
            </p>
          </div>

          <div className="p-8">
            {questions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No Questions Yet
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start building your question bank by adding the first question
                  for this subject.
                </p>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add First Question
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <Card key={question.id} className="border border-gray-200">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          Question {index + 1}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditQuestion(question)}
                            className="border-gray-300 hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-900 mb-4 font-medium">
                        {question.text}
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border ${
                              optionIndex === question.correctAnswerIndex
                                ? "border-green-200 bg-green-50"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-700">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              <span className="text-gray-900">{option}</span>
                              {optionIndex === question.correctAnswerIndex && (
                                <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-4">
                        Added on{" "}
                        {new Date(question.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
