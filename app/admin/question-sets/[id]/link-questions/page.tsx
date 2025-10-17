"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, CheckCircle, PlusCircle } from "lucide-react";

type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  subject: {
    id: string;
    name: string;
  };
  questionSetId: string | null;
};

type Subject = {
  id: string;
  name: string;
  questions: Question[];
};

type QuestionSet = {
  id: string;
  setName: string;
  questions: Question[];
};

type SubjectData = {
  id: string;
  name: string;
};

export default function LinkQuestionsPage() {
  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const router = useRouter();
  const params = useParams();
  const questionSetId = params.id as string;

  const fetchData = useCallback(async () => {
    try {
      // Fetch question set details
      const setResponse = await fetch(
        `/api/admin/question-sets/${questionSetId}`
      );
      if (setResponse.ok) {
        const setData = await setResponse.json();
        setQuestionSet(setData);
        // Initialize selected questions with already linked ones
        setSelectedQuestions(
          new Set(setData.questions.map((q: Question) => q.id))
        );
      }

      // Fetch all subjects with their questions
      const subjectsResponse = await fetch("/api/admin/subjects");
      if (subjectsResponse.ok) {
        const subjectsData = await subjectsResponse.json();

        // Fetch questions for each subject
        const subjectsWithQuestions = await Promise.all(
          subjectsData.map(async (subject: SubjectData) => {
            const questionsResponse = await fetch(
              `/api/admin/subjects/${subject.id}/questions`
            );
            const questions = questionsResponse.ok
              ? await questionsResponse.json()
              : [];
            return {
              ...subject,
              questions: questions.filter((q: Question) => !q.questionSetId), // Only show unlinked questions
            };
          })
        );

        setSubjects(subjectsWithQuestions);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [questionSetId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleQuestionToggle = (questionId: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const handleLinkQuestions = async () => {
    if (selectedQuestions.size === 0) {
      alert("Please select at least one question");
      return;
    }

    setLinking(true);
    try {
      const response = await fetch(
        `/api/admin/question-sets/${questionSetId}/link-questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionIds: Array.from(selectedQuestions),
          }),
        }
      );

      if (response.ok) {
        router.push(`/admin/question-sets/${questionSetId}`);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to link questions");
      }
    } catch (error) {
      console.error("Error linking questions:", error);
      alert("Failed to link questions");
    } finally {
      setLinking(false);
    }
  };

  const totalSelected = selectedQuestions.size;
  const totalAvailable = subjects.reduce(
    (sum, subject) => sum + subject.questions.length,
    0
  );

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={() =>
                  router.push(`/admin/question-sets/${questionSetId}`)
                }
                variant="outline"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Question Set
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Link Questions
                </h1>
                <p className="text-gray-600 mt-1">
                  Select questions to add to &quot;{questionSet.setName}&quot;
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Selected</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalSelected}
                </p>
              </div>
              <Button
                onClick={handleLinkQuestions}
                disabled={linking || totalSelected === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {linking
                  ? "Linking..."
                  : `Link ${totalSelected} Question${
                      totalSelected !== 1 ? "s" : ""
                    }`}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Available Questions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalAvailable}
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
                <p className="text-sm font-medium text-gray-600">Selected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalSelected}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <PlusCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Already Linked
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {questionSet.questions.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions by Subject */}
        <div className="space-y-8">
          {subjects.map((subject) => (
            <Card key={subject.id} className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  {subject.name} ({subject.questions.length} questions)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subject.questions.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No unlinked questions available in this subject.
                    <Button
                      variant="link"
                      className="p-0 h-auto ml-2 text-blue-600"
                      onClick={() =>
                        router.push(`/admin/subjects/${subject.id}`)
                      }
                    >
                      Add questions →
                    </Button>
                  </p>
                ) : (
                  <div className="space-y-4">
                    {subject.questions.map((question) => (
                      <div
                        key={question.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedQuestions.has(question.id)
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleQuestionToggle(question.id)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedQuestions.has(question.id)}
                            onChange={() => handleQuestionToggle(question.id)}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
                          />
                          <div className="flex-1">
                            <p className="text-gray-900 mb-3 font-medium">
                              {question.text}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {question.options.map((option, index) => (
                                <div
                                  key={index}
                                  className={`p-2 rounded ${
                                    index === question.correctAnswerIndex
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {String.fromCharCode(65 + index)}. {option}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {totalAvailable === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No Questions Available
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              There are no unlinked questions in the question bank. Add
              questions to subjects first.
            </p>
            <Button
              onClick={() => router.push("/admin/subjects")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Manage Subjects & Questions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
