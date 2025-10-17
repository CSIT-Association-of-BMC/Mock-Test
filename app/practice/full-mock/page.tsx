"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";

type Question = {
  id: string;
  text: string;
  options: string[];
  subjectId: string;
  subjectName: string;
};

type TestData = {
  setId: string;
  setName: string;
  questions: Question[];
};

export default function FullMockTestPage() {
  const router = useRouter();
  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(7200); // 2 hours in seconds
  const [loading, setLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  // Fetch questions
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/questions/full-mock");
      if (response.ok) {
        const data = await response.json();
        setTestData(data);
        setAnswers(new Array(data.questions.length).fill(null));
      } else {
        alert("Failed to load questions. Please try again.");
        router.push("/practice");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("An error occurred. Please try again.");
      router.push("/practice");
    } finally {
      setLoading(false);
    }
  };

  // Timer
  useEffect(() => {
    if (!testStarted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted]);

  // Tab lock functionality
  useEffect(() => {
    if (!testStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            alert(
              "You have switched tabs too many times. The test will be auto-submitted."
            );
            handleAutoSubmit();
          } else {
            setTabSwitchWarning(true);
            setTimeout(() => setTabSwitchWarning(false), 3000);
          }
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [testStarted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleAutoSubmit = useCallback(() => {
    if (testData) {
      submitTest();
    }
  }, [testData, answers]);

  const submitTest = async () => {
    if (!testData) return;

    // Calculate score (will be verified on server)
    const score = answers.filter((answer) => answer !== null).length;

    // Prepare attempt details
    const attemptDetails = {
      questionSetId: testData.setId,
      answers: answers.map((answer, index) => ({
        questionId: testData.questions[index].id,
        selectedAnswer: answer,
        subjectId: testData.questions[index].subjectId,
      })),
    };

    // Store in localStorage
    const resultData = {
      setId: testData.setId,
      score: score,
      totalQuestions: testData.questions.length,
      attemptDetails: JSON.stringify(attemptDetails),
      testType: "full_mock",
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("pendingTestResult", JSON.stringify(resultData));

    // Redirect to result login page
    router.push("/result/login");
  };

  const handleStartTest = () => {
    if (
      confirm(
        "Once you start, the 2-hour timer will begin. Tab switching is restricted. Are you ready?"
      )
    ) {
      setTestStarted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading test questions...</p>
        </div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Failed to load questions</p>
          <Button onClick={() => router.push("/practice")} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Full Mock Test - Instructions
          </h1>
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900">
                  Duration: 2 Hours
                </h3>
                <p className="text-sm text-blue-800">
                  Timer starts when you click "Start Test"
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-purple-900">100 Questions</h3>
                <p className="text-sm text-purple-800">
                  20 questions each from 5 subjects
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900">Tab Lock Active</h3>
                <p className="text-sm text-red-800">
                  Switching tabs or minimizing the window will trigger warnings.
                  After 3 warnings, the test will auto-submit.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <Button
              onClick={handleStartTest}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-6"
            >
              I'm Ready - Start Test
            </Button>
            <Button
              onClick={() => router.push("/practice")}
              variant="outline"
              className="w-full"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = testData.questions[currentQuestion];
  const answeredCount = answers.filter((a) => a !== null).length;
  const progress = (answeredCount / testData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Warning Banner */}
      {tabSwitchWarning && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-3 px-4 z-50 text-center font-semibold">
          ⚠️ Warning: Tab switching detected! ({tabSwitchCount}/3) - Test will
          auto-submit after 3 warnings.
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {testData.setName}
              </h2>
              <p className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {testData.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-600">Answered</p>
                <p className="text-lg font-bold text-gray-900">
                  {answeredCount}/{testData.questions.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Time Remaining</p>
                <p
                  className={`text-lg font-bold ${
                    timeRemaining < 600 ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="mb-4">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              {currentQ.subjectName}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQ.text}
          </h3>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  answers[currentQuestion] === index
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <span className="font-medium text-gray-700">
                  {String.fromCharCode(65 + index)}.
                </span>{" "}
                <span className="text-gray-900">{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            variant="outline"
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {Array.from({ length: testData.questions.length }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded text-xs font-medium ${
                    index === currentQuestion
                      ? "bg-indigo-600 text-white"
                      : answers[index] !== null
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-gray-100 text-gray-600 border border-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
          {currentQuestion < testData.questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={submitTest}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit Test
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
