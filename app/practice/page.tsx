"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  Target,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function PracticePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Target className="w-4 h-4" />
            Practice Modes
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Practice Mode
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select from full mock tests or subject-wise practice to build your
            confidence and track your progress in the B.Sc. CSIT entrance exam.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 mb-16">
          {/* Full Mock Test Card (responsive) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-200">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Full Mock Test
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Complete exam simulation
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="font-medium text-sm sm:text-base">
                  2 Hours (120 minutes)
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="font-medium text-sm sm:text-base">
                  100 Questions Total
                </span>
              </div>

              <div className="ml-6 sm:ml-8 space-y-2 text-xs sm:text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>• Physics</span>
                  <span className="font-medium">25 Questions</span>
                </div>
                <div className="flex justify-between">
                  <span>• Chemistry</span>
                  <span className="font-medium">25 Questions</span>
                </div>
                <div className="flex justify-between">
                  <span>• Mathematics</span>
                  <span className="font-medium">25 Questions</span>
                </div>
                <div className="flex justify-between">
                  <span>• English</span>
                  <span className="font-medium">15 Questions</span>
                </div>
                <div className="flex justify-between">
                  <span>• Computer</span>
                  <span className="font-medium">10 Questions</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mt-0.5" />
                  <div className="text-sm sm:text-sm text-amber-800">
                    <strong>Important:</strong> Tab switching is restricted
                    during the test. The exam will auto submit if you switch
                    tabs or windows.
                  </div>
                </div>
              </div>

              <Button
                onClick={async () => {
                  // Fetch active sets
                  try {
                    const res = await fetch("/api/questions/sets");
                    if (!res.ok) {
                      alert("Failed to load question sets.");
                      return;
                    }
                    const sets = await res.json();
                    if (!sets || sets.length === 0) {
                      alert("No active question sets available at the moment.");
                      return;
                    }

                    if (sets.length === 1) {
                      // Single set: go straight to test (server will pick up the set)
                      router.push(`/practice/full-mock?setId=${sets[0].id}`);
                      return;
                    }

                    // Multiple sets: ask user to pick one (quick prompt for now)
                    const choices = sets
                      .map(
                        (s: any, i: number) =>
                          `${i + 1}. ${s.setName} (${
                            s._count?.questions || 0
                          } Q)`
                      )
                      .join("\n");

                    const input = prompt(
                      `Multiple active sets found.\nChoose a set number:\n\n${choices}`
                    );
                    if (!input) return;
                    const idx = parseInt(input, 10) - 1;
                    if (isNaN(idx) || idx < 0 || idx >= sets.length) {
                      alert("Invalid selection");
                      return;
                    }
                    router.push(`/practice/full-mock?setId=${sets[idx].id}`);
                  } catch (err) {
                    console.error(err);
                    alert("An error occurred while fetching sets.");
                  }
                }}
                className="w-full py-3 sm:py-4 rounded-sm shadow-lg text-sm sm:text-md hover:shadow-xl transition-all duration-200 cursor-pointer"
              >
                Start Full Mock Test
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Subject-Wise Practice Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-blue-200 transition-all duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-green-50 rounded-2xl">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Subject Practice
                </h2>
                <p className="text-gray-600">Focus on individual subjects</p>
              </div>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Strengthen your weak areas by practicing specific subjects. Each
              subject contains targeted questions to help you master individual
              topics.
            </p>

            <div className="space-y-3 mb-6">
              {[
                {
                  name: "Physics",
                  path: "physics",
                  color:
                    "bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 cursor-pointer",
                },
                {
                  name: "Chemistry",
                  path: "chemistry",
                  color:
                    "bg-green-50 hover:bg-green-100 text-green-700 border-green-200 cursor-pointer",
                },
                {
                  name: "Mathematics",
                  path: "mathematics",
                  color:
                    "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200",
                },
                {
                  name: "English",
                  path: "english",
                  color:
                    "bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 cursor-pointer",
                },
                {
                  name: "Computer Science",
                  path: "computer-science",
                  color:
                    "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 cursor-pointer",
                },
              ].map((subject) => (
                <Button
                  key={subject.path}
                  onClick={() =>
                    router.push(`/practice/subject/${subject.path}`)
                  }
                  variant="outline"
                  className={`w-full justify-between border-2 ${subject.color} hover:shadow-md transition-all duration-200 py-4 rounded-sm`}
                >
                  <span className="font-medium">{subject.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Unlimited practice • No time limit • Instant feedback
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
