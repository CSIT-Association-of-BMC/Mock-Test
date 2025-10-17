"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, FileText, BarChart3 } from "lucide-react";

type Subject = {
  id: string;
  name: string;
  _count: {
    questions: number;
  };
  createdAt: string;
};

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/admin/subjects");
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalQuestions = subjects.reduce(
    (sum, subject) => sum + subject._count.questions,
    0
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/admin")}
                variant="outline"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Subject Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage subjects and their questions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Subjects
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {subjects.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Questions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalQuestions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Questions/Subject
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {subjects.length > 0
                    ? Math.round(totalQuestions / subjects.length)
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">All Subjects</h2>
            <p className="text-gray-600 mt-1">
              Click on a subject to manage its questions
            </p>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading subjects...</p>
              </div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No Subjects Found
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Subjects should be created during database seeding. Please
                  check your database setup.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200 cursor-pointer"
                    onClick={() => router.push(`/admin/subjects/${subject.id}`)}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {subject.name}
                        </h3>
                        <p className="text-sm text-gray-500">Subject</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Questions:</span>
                        <span className="font-medium text-gray-900">
                          {subject._count.questions}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(subject.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/subjects/${subject.id}`);
                        }}
                      >
                        Manage Questions
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
