import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ResultViewPage({ params }: PageProps) {
  const session = await getUserSession();
  if (!session) {
    redirect("/result/login");
  }

  const { id } = await params;

  const result = await prisma.userResult.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      questionSet: {
        select: {
          setName: true,
        },
      },
      subject: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Result Not Found
          </h1>
          <Link href="/practice">
            <Button>Back to Practice</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Verify user owns this result
  if (result.userId !== session.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Unauthorized
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to view this result.
          </p>
          <Link href="/practice">
            <Button>Back to Practice</Button>
          </Link>
        </div>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const attemptData = JSON.parse(result.attemptDetails || "{}");

  // Calculate attempted counts from stored attempt details
  let attemptedCount = 0;
  if (attemptData && Array.isArray(attemptData.answers)) {
    attemptedCount = attemptData.answers.filter(
      (a: any) => a.selectedAnswer !== null && a.selectedAnswer !== undefined
    ).length;
  }
  // Wrong answers should be counted only from attempted answers
  const wrongFromAttempted = Math.max(0, attemptedCount - result.score);
  const attemptedPercent = result.totalQuestions
    ? Math.round((attemptedCount / result.totalQuestions) * 100)
    : 0;

  // Calculate subject-wise breakdown for full mock tests
  const subjectBreakdown: {
    [key: string]: { correct: number; total: number };
  } = {};

  if (result.testType === "full_mock" && attemptData.answers) {
    // Fetch questions with subjects
    const questionIds = attemptData.answers.map((a: any) => a.questionId);
    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      include: { subject: true },
    });

    attemptData.answers.forEach((answer: any) => {
      const question = questions.find((q: any) => q.id === answer.questionId);
      if (question) {
        const subjectName = question.subject.name;
        if (!subjectBreakdown[subjectName]) {
          subjectBreakdown[subjectName] = { correct: 0, total: 0 };
        }
        subjectBreakdown[subjectName].total++;
        if (answer.selectedAnswer === question.correctAnswerIndex) {
          subjectBreakdown[subjectName].correct++;
        }
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Results
          </h1>
          <p className="text-gray-600">
            {result.questionSet?.setName ||
              result.subject?.name ||
              "Test Result"}
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            {percentage}%
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            {result.score} out of {result.totalQuestions} correct
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-600">
            <div>{new Date(result.dateTaken).toLocaleDateString()}</div>
            <div>
              {result.testType === "full_mock"
                ? "Full Mock Test"
                : "Subject-Wise Practice"}
            </div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Accuracy</span>
                  <span className="text-sm font-semibold">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Questions Attempted
                  </span>
                  <span className="text-sm font-semibold">
                    {attemptedCount}/{result.totalQuestions}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${attemptedPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Correct Answers</span>
                <span className="font-semibold text-gray-900">
                  {result.score}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wrong Answers</span>
                <span className="font-semibold text-gray-900">
                  {wrongFromAttempted}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Questions</span>
                <span className="font-semibold text-gray-900">
                  {result.totalQuestions}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject-Wise Breakdown (for full mock tests) */}
        {result.testType === "full_mock" &&
          Object.keys(subjectBreakdown).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Subject-Wise Performance
              </h3>
              <div className="space-y-4">
                {Object.entries(subjectBreakdown).map(([subject, data]) => {
                  const subjectPercentage = Math.round(
                    (data.correct / data.total) * 100
                  );
                  return (
                    <div key={subject}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-700">
                          {subject}
                        </span>
                        <span className="text-sm text-gray-600">
                          {data.correct}/{data.total} ({subjectPercentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${subjectPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {/* View Detailed Answers */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Review Your Answers
            </h3>
            <p className="text-gray-600 mb-4">
              View detailed answers and explanations for all questions
            </p>
            <Link href={`/result/answers/${id}`}>
              <Button className="bg-primary hover:bg-primary/90 cursor-pointer">
                View Detailed Answers
              </Button>
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link href="/practice">
            <Button className="bg-primary hover:bg-primary/90 cursor-pointer">
              Take Another Test
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="cursor-pointer">
              View All Results
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
