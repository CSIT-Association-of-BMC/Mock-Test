"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  BookOpen,
  PlusCircle,
  Trash2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  subject: {
    id: string;
    name: string;
  };
};

type QuestionSet = {
  id: string;
  setName: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    questions: number;
  };
  questions: Question[];
};

export default function QuestionSetDetailsPage() {
  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const questionSetId = params.id as string;

  const fetchQuestionSet = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/question-sets/${questionSetId}`);
      if (response.ok) {
        const data = await response.json();
        setQuestionSet(data);
      }
    } catch (error) {
      console.error("Error fetching question set:", error);
    } finally {
      setLoading(false);
    }
  }, [questionSetId]);

  useEffect(() => {
    fetchQuestionSet();
  }, [fetchQuestionSet]);

  const handleUnlinkQuestion = async (questionId: string) => {
    if (
      !confirm("Are you sure you want to unlink this question from the set?")
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/question-sets/${questionSetId}/unlink-questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionIds: [questionId],
          }),
        }
      );

      if (response.ok) {
        fetchQuestionSet(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || "Failed to unlink question");
      }
    } catch (error) {
      console.error("Error unlinking question:", error);
      alert("Failed to unlink question");
    }
  };

  const toggleActiveStatus = async () => {
    if (!questionSet) return;

    try {
      const response = await fetch(
        `/api/admin/question-sets/${questionSetId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !questionSet.isActive,
          }),
        }
      );

      if (response.ok) {
        fetchQuestionSet(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading question set...</p>
        </div>
      </div>
    );
  }

  if (!questionSet) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Question Set Not Found
          </h1>
          <Button onClick={() => router.push("/admin")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const subjectBreakdown = questionSet.questions.reduce((acc, question) => {
    const subjectName = question.subject.name;
    acc[subjectName] = (acc[subjectName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/admin")}
                variant="outline"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {questionSet.setName}
                </h1>
                <p className="text-gray-600 mt-1">
                  {questionSet.questions.length} questions • Created{" "}
                  {new Date(questionSet.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleActiveStatus}
                variant={questionSet.isActive ? "outline" : "default"}
                className={
                  questionSet.isActive
                    ? "border-green-300 text-green-700 hover:bg-green-50"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              >
                {questionSet.isActive ? "Active" : "Inactive"}
              </Button>
              <Button
                onClick={() =>
                  router.push(
                    `/admin/question-sets/${questionSetId}/link-questions`
                  )
                }
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="w-4 h-4" />
                Link Questions
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Questions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {questionSet.questions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p
                  className={`text-2xl font-bold ${
                    questionSet.isActive ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {questionSet.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Subjects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(subjectBreakdown).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Ready for Tests
                </p>
                <p
                  className={`text-2xl font-bold ${
                    questionSet.questions.length >= 4
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {questionSet.questions.length >= 4 ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Breakdown */}
        {Object.keys(subjectBreakdown).length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Subject Breakdown
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(subjectBreakdown).map(([subject, count]) => (
                <div
                  key={subject}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{subject}</span>
                  <span className="text-gray-600">{count} questions</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Linked Questions
            </h2>
            <p className="text-gray-600 mt-1">
              {questionSet.questions.length === 0
                ? "No questions linked yet. Link questions to make this set available for tests."
                : `${questionSet.questions.length} question${
                    questionSet.questions.length !== 1 ? "s" : ""
                  } linked to this set.`}
            </p>
          </div>

          <div className="p-8">
            {questionSet.questions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No Questions Linked
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Link questions from the question bank to make this set
                  available for testing.
                </p>
                <Button
                  onClick={() =>
                    router.push(
                      `/admin/question-sets/${questionSetId}/link-questions`
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Link Questions
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {questionSet.questions.map((question, index) => (
                  <Card key={question.id} className="border border-gray-200">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">
                            Question {index + 1}
                          </CardTitle>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {question.subject.name}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnlinkQuestion(question.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-900 mb-4 font-medium">
                        {question.text}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
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
