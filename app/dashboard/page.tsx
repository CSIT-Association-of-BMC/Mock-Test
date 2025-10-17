import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  BookOpen,
  User,
  LogOut,
  TrendingUp,
  Target,
  Award,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getUserSession();
  if (!session) {
    redirect("/result/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      results: {
        include: {
          questionSet: {
            select: { setName: true },
          },
          subject: {
            select: { name: true },
          },
        },
        orderBy: { dateTaken: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/result/login");
  }

  const totalTests = user.results.length;
  const averageScore =
    totalTests > 0
      ? Math.round(
          user.results.reduce(
            (sum: number, r: any) => sum + (r.score / r.totalQuestions) * 100,
            0
          ) / totalTests
        )
      : 0;

  const bestScore =
    totalTests > 0
      ? Math.max(
          ...user.results.map((r: any) =>
            Math.round((r.score / r.totalQuestions) * 100)
          )
        )
      : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 text-sm">
                Track your progress and continue your preparation journey
              </p>
            </div>
            <form
              action={async () => {
                "use server";
                const { cookies } = await import("next/headers");
                (await cookies()).delete("user-token");
                redirect("/");
              }}
            >
              <Button
                type="submit"
                variant="outline"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 text-sm px-3 py-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Total Tests</p>
                <p className="text-xl font-bold text-gray-900">{totalTests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">
                  Average Score
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {averageScore}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Best Score</p>
                <p className="text-xl font-bold text-gray-900">{bestScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">
                  Tests This Month
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {
                    user.results.filter(
                      (r: any) =>
                        new Date(r.dateTaken).getMonth() ===
                        new Date().getMonth()
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Test History */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Test History</h2>
            <p className="text-gray-600 text-sm">
              Your recent performance and progress
            </p>
          </div>

          <div className="p-6">
            {user.results.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Tests Completed Yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
                  Start your first practice test to begin tracking your progress
                  and building your skills.
                </p>
                <Link href="/practice">
                  <Button className="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-sm">
                    Start Your First Test
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {user.results.map((result: any) => {
                  const percentage = Math.round(
                    (result.score / result.totalQuestions) * 100
                  );
                  return (
                    <div
                      key={result.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 border border-gray-200 rounded-lg hover:shadow-md hover:border-primary/20 transition-all duration-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 w-full">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-lg ${
                              percentage >= 80
                                ? "bg-green-50"
                                : percentage >= 60
                                ? "bg-yellow-50"
                                : "bg-red-50"
                            }`}
                          >
                            <Trophy
                              className={`w-5 h-5 ${
                                percentage >= 80
                                  ? "text-green-600"
                                  : percentage >= 60
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900">
                              {result.questionSet?.setName ||
                                result.subject?.name ||
                                "Practice Test"}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(
                                  result.dateTaken
                                ).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                {result.score}/{result.totalQuestions} correct
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-6">
                          <div className="text-center sm:text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {percentage}%
                            </p>
                            <p className="text-xs text-gray-600">Score</p>
                          </div>
                          <Link href={`/result/view/${result.id}`}>
                            <Button
                              variant="outline"
                              className="border-gray-300 hover:bg-gray-50 rounded-lg px-3 py-1.5 w-full sm:w-auto text-sm cursor-pointer"
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ready for Another Test?
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/practice">
              <Button className="bg-primary hover:bg-primary/90 rounded-sm px-6 py-3 text-sm cursor-pointer">
                Take Full Mock Test
              </Button>
            </Link>
            <Link href="/practice">
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-50 rounded-sm px-6 py-3 text-sm cursor-pointer"
              >
                Practice by Subject
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
