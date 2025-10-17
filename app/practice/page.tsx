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
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
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

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Full Mock Test Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-blue-200 transition-all duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Full Mock Test
                </h2>
                <p className="text-gray-600">Complete exam simulation</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-medium">2 Hours (120 minutes)</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="font-medium">100 Questions Total</span>
              </div>

              <div className="ml-8 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>• Physics</span>
                  <span className="font-medium">20 Questions</span>
                </div>
                <div className="flex justify-between">
                  <span>• Chemistry</span>
                  <span className="font-medium">20 Questions</span>
                </div>
                <div className="flex justify-between">
                  <span>• Mathematics</span>
                  <span className="font-medium">20 Questions</span>
                </div>
                <div className="flex justify-between">
                  <span>• English</span>
                  <span className="font-medium">20 Questions</span>
                </div>
                <div className="flex justify-between">
                  <span>• Computer Science</span>
                  <span className="font-medium">20 Questions</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <strong>Important:</strong> Tab switching is restricted
                    during the test. The exam will auto-submit if you switch
                    tabs or windows.
                  </div>
                </div>
              </div>

              <Button
                onClick={() => router.push("/practice/full-mock")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Full Mock Test
                <ArrowRight className="w-5 h-5 ml-2" />
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
                    "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
                },
                {
                  name: "Chemistry",
                  path: "chemistry",
                  color:
                    "bg-green-50 hover:bg-green-100 text-green-700 border-green-200",
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
                    "bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200",
                },
                {
                  name: "Computer Science",
                  path: "computer-science",
                  color:
                    "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200",
                },
              ].map((subject) => (
                <Button
                  key={subject.path}
                  onClick={() =>
                    router.push(`/practice/subject/${subject.path}`)
                  }
                  variant="outline"
                  className={`w-full justify-between border-2 ${subject.color} hover:shadow-md transition-all duration-200 py-4 rounded-xl`}
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

        {/* How It Works Section */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our unique flow allows you to practice without commitment, then
              save your results when you're ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Take the Test
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Answer questions without logging in. Your progress is
                automatically saved locally in your browser.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Submit & Review
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Submit your test and instantly see your score breakdown with
                detailed subject-wise analysis.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Save Results
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Create an account or login to permanently save your results and
                track your progress over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
