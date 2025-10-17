import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Target,
  Trophy,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <CheckCircle className="w-4 h-4" />
            B.Sc. CSIT Entrance Exam Preparation
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Master Your
            <span className="block text-blue-600">CSIT Entrance Exam</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Comprehensive practice platform with full mock tests, subject-wise
            practice, and detailed analytics. Take tests without login, register
            only to save results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/practice">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                Start Practicing
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-4 h-auto rounded-xl"
              >
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to excel in your B.Sc. CSIT entrance exam
            preparation
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-200">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Full Mock Tests
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Complete 100-question tests with 2-hour timer and real exam
              conditions
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-200">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Subject Practice
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Focus on individual subjects: Math, Physics, Chemistry, English,
              Computer
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-200">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Detailed Analytics
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Comprehensive result analysis with subject-wise breakdown and
              progress tracking
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-200">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Flexible Access
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Take tests anonymously, register only when you want to save and
              track results
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100</div>
              <div className="text-gray-600">Questions per Test</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-gray-600">Core Subjects</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">120</div>
              <div className="text-gray-600">Minutes Duration</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Ace Your Exam?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who have successfully prepared for their
            B.Sc. CSIT entrance exam using our platform
          </p>
          <Link href="/practice">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
