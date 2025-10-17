"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  BookOpen,
  LogOut,
  BarChart3,
  Users,
  FileText,
  Settings,
} from "lucide-react";

type QuestionSet = {
  id: string;
  setName: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    questions: number;
  };
};

export default function AdminDashboard() {
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchQuestionSets();
  }, []);

  const fetchQuestionSets = async () => {
    try {
      const response = await fetch("/api/admin/question-sets");
      if (response.ok) {
        const data = await response.json();
        setQuestionSets(data);
      }
    } catch (error) {
      console.error("Error fetching question sets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const totalQuestions = questionSets.reduce(
    (sum, set) => sum + set._count.questions,
    0
  );
  const activeSets = questionSets.filter((set) => set.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your mock test platform
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/admin/subjects")}
                variant="outline"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4" />
                Manage Subjects
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Question Sets
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {questionSets.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Sets</p>
                <p className="text-2xl font-bold text-gray-900">{activeSets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Questions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalQuestions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Sets Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Question Sets
              </h2>
              <p className="text-gray-600 mt-1">
                Manage and organize your mock test questions
              </p>
            </div>
            <Button
              onClick={() => router.push("/admin/question-sets/create")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-lg px-6 py-3"
            >
              <PlusCircle className="w-5 h-5" />
              Create New Set
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading question sets...</p>
            </div>
          ) : questionSets.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No Question Sets Yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Get started by creating your first question set to begin
                building your mock test collection.
              </p>
              <Button
                onClick={() => router.push("/admin/question-sets/create")}
                className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6 py-3"
              >
                Create Your First Set
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {questionSets.map((set) => (
                <div
                  key={set.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {set.setName}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        set.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {set.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {set._count.questions} questions
                    </div>
                    <div className="text-sm text-gray-500">
                      Created {new Date(set.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() =>
                        router.push(`/admin/question-sets/${set.id}`)
                      }
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-300 hover:bg-gray-50"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() =>
                        router.push(
                          `/admin/question-sets/${set.id}/add-questions`
                        )
                      }
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Add Questions
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
