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
  selectedAnswer: number;
  isCorrect: boolean;
  correctAnswer: number;
};

export default function SubjectMockTestPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testCompleted, setTestCompleted] = useState(false);

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

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || !questions[currentQuestionIndex]) return;

    try {
      // Get the correct answer from the API
      const response = await fetch(`/api/questions/subject/${subjectName}`);
      if (response.ok) {
        const data = await response.json();
        const currentQuestion = data.questions[currentQuestionIndex];
        const correctAnswerIndex = currentQuestion.correctAnswerIndex;

        const result: TestResult = {
          questionId: questions[currentQuestionIndex].id,
          selectedAnswer,
          isCorrect: selectedAnswer === correctAnswerIndex,
          correctAnswer: correctAnswerIndex,
        };

        setTestResults((prev) => [...prev, result]);
        setShowResult(true);
      }
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setTestCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
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
          <div className="flex justify-between items-center">
            <Button
              onClick={() => router.push("/practice")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Practice
            </Button>

            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">
                {subject?.name} Mock Test
              </h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-lg font-bold text-blue-600">
                {getScore()}/{testResults.length}
              </p>
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
                  let buttonClass =
                    "w-full text-left p-4 border rounded-lg transition-all ";
                  let icon = null;

                  if (showResult && currentResult) {
                    if (index === currentResult.correctAnswer) {
                      buttonClass +=
                        "border-green-200 bg-green-50 text-green-800";
                      icon = <CheckCircle className="w-5 h-5 text-green-600" />;
                    } else if (
                      index === currentResult.selectedAnswer &&
                      !currentResult.isCorrect
                    ) {
                      buttonClass += "border-red-200 bg-red-50 text-red-800";
                      icon = <XCircle className="w-5 h-5 text-red-600" />;
                    } else {
                      buttonClass += "border-gray-200 opacity-50";
                    }
                  } else {
                    buttonClass +=
                      selectedAnswer === index
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={buttonClass}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                        {icon && <div className="flex-shrink-0">{icon}</div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {!showResult ? (
              <div className="flex justify-center">
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="px-8"
                >
                  Submit Answer
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-4">
                  {currentResult?.isCorrect ? (
                    <div className="text-green-600 font-medium">
                      ✓ Correct Answer!
                    </div>
                  ) : (
                    <div className="text-red-600 font-medium">
                      ✗ Incorrect Answer
                    </div>
                  )}
                </div>
                <Button onClick={handleNextQuestion}>
                  {currentQuestionIndex < questions.length - 1
                    ? "Next Question"
                    : "View Results"}
                </Button>
              </div>
            )}
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
