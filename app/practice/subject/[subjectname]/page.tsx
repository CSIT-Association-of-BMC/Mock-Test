"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  BookOpen,
  RotateCcw,
} from "lucide-react";

type Question = {
  id: string;
  text: string;
  options: string[];
  subjectId: string;
  subjectName: string;
};

type Subject = {
  id: string;
  name: string;
};

type TestResult = {
  questionId: string;
  selectedAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
};

export default function SubjectMockTestPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testCompleted, setTestCompleted] = useState(false);
  const [processingResults, setProcessingResults] = useState(false);

  const params = useParams();
  const router = useRouter();
  const subjectName = params.subjectname as string;

  useEffect(() => {
    fetchSubjectQuestions();
  }, [subjectName]);

  const fetchSubjectQuestions = async () => {
    try {
      const response = await fetch(`/api/questions/subject/${subjectName}`);
      if (response.ok) {
        const data = await response.json();
        setSubject(data.subject);
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(null));
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to load questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleCompleteTest();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleCompleteTest = async () => {
    if (!questions.length) return;

    setProcessingResults(true);

    try {
      // Get correct answers for all questions
      const results: TestResult[] = [];
      for (let i = 0; i < questions.length; i++) {
        const response = await fetch("/api/questions/check-answer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionId: questions[i].id,
            selectedAnswer: answers[i],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          results.push({
            questionId: questions[i].id,
            selectedAnswer: answers[i],
            correctAnswer: data.correctAnswer,
            isCorrect: answers[i] !== null ? data.isCorrect : false,
          });
        }
      }

      setTestResults(results);
      setTestCompleted(true);
    } catch (error) {
      console.error("Error completing test:", error);
    } finally {
      setProcessingResults(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers(new Array(questions.length).fill(null));
    setTestResults([]);
    setTestCompleted(false);
  };

  const getScore = () => {
    return testResults.filter((result) => result.isCorrect).length;
  };

  const getScorePercentage = () => {
    return Math.round((getScore() / testResults.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button onClick={() => router.push("/practice")}>
            Back to Practice
          </Button>
        </div>
      </div>
    );
  }

  if (processingResults) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-lg text-gray-600">
            Processing, analyzing answers...
          </p>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Test Completed!
            </h1>
            <p className="text-gray-600">{subject?.name} Mock Test Results</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {getScore()}/{testResults.length}
                  </div>
                  <p className="text-gray-600">Correct Answers</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {getScorePercentage()}%
                  </div>
                  <p className="text-gray-600">Score</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {questions.length}
                  </div>
                  <p className="text-gray-600">Total Questions</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Questions Review */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Question Review
            </h2>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const result = testResults[index];
                return (
                  <Card key={question.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            result?.isCorrect
                              ? "bg-green-100 text-green-800"
                              : result?.selectedAnswer !== null
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 mb-4 font-medium">
                            {question.text}
                          </p>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => {
                              let optionClass =
                                "flex items-center gap-3 p-3 rounded-lg border ";
                              let icon = null;

                              if (optionIndex === result?.correctAnswer) {
                                optionClass +=
                                  "border-green-200 bg-green-50 text-green-800";
                                icon = (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                );
                              } else if (
                                optionIndex === result?.selectedAnswer &&
                                !result?.isCorrect
                              ) {
                                optionClass +=
                                  "border-red-200 bg-red-50 text-red-800";
                                icon = (
                                  <XCircle className="w-5 h-5 text-red-600" />
                                );
                              } else {
                                optionClass += "border-gray-200 text-gray-600";
                              }

                              return (
                                <div key={optionIndex} className={optionClass}>
                                  <div className="flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium">
                                    {String.fromCharCode(65 + optionIndex)}
                                  </div>
                                  <span className="flex-1">{option}</span>
                                  {icon && (
                                    <div className="flex-shrink-0">{icon}</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          {result?.selectedAnswer === null && (
                            <div className="mt-3 text-sm text-orange-600 font-medium">
                              ⚠️ Not answered
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={handleRestart} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Take Test Again
            </Button>
            <Button onClick={() => router.push("/practice")}>
              Back to Practice
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentResult = testResults.find(
    (r) => r.questionId === currentQuestion?.id
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-2 w-full">
            {/* Row: Back button (left) and Score (right) on same line */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  onClick={() => router.push("/practice")}
                  variant="outline"
                  className="flex items-center gap-2"
                  aria-label="Back to Practice"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="inline">Back to Practice</span>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">Score</p>
                <p className="text-lg font-bold text-blue-600">
                  {getScore()}/{testResults.length || questions.length}
                </p>
              </div>
            </div>

            {/* Title row: centered on desktop */}
            <div className="w-full">
              <h1 className="mt-2 text-xl font-bold text-gray-900 truncate text-center sm:text-center">
                {subject?.name} Mock Test
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Question {currentQuestionIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-lg text-gray-900 mb-6">
                {currentQuestion?.text}
              </p>

              <div className="space-y-3">
                {currentQuestion?.options.map((option, index) => {
                  const buttonClass =
                    answers[currentQuestionIndex] === index
                      ? "w-full text-left p-4 border-2 border-blue-500 bg-blue-50 rounded-lg transition-all"
                      : "w-full text-left p-4 border border-gray-200 hover:border-gray-300 rounded-lg transition-all";

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        handleAnswerSelect(currentQuestionIndex, index)
                      }
                      className={buttonClass}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
              >
                Previous
              </Button>

              <div className="text-sm text-gray-600 hidden sm:flex">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>

              {currentQuestionIndex < questions.length - 1 ? (
                <Button onClick={handleNextQuestion}>Next</Button>
              ) : (
                <Button
                  onClick={handleCompleteTest}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Complete Test
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>
              {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / questions.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
