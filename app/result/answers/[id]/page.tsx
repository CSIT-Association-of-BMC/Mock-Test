import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ResultAnswersPage({ params }: PageProps) {
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

  const attemptData = JSON.parse(result.attemptDetails);

  // Fetch questions with answers
  const questionIds = attemptData.answers.map((a: any) => a.questionId);
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
    include: { subject: true },
  });

  // Create a map of question ID to question data
  const questionMap = questions.reduce((acc: any, q: any) => {
    acc[q.id] = q;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Detailed Answers
            </h1>
            <p className="text-gray-600">
              {result.questionSet?.setName ||
                result.subject?.name ||
                "Test Result"}
            </p>
          </div>
          <Link href={`/result/view/${id}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Results
            </Button>
          </Link>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {attemptData.answers.map((answer: any, index: number) => {
            const question = questionMap[answer.questionId];
            if (!question) return null;

            const isCorrect =
              answer.selectedAnswer === question.correctAnswerIndex;
            const selectedOption =
              answer.selectedAnswer !== null
                ? question.options[answer.selectedAnswer]
                : null;

            return (
              <div
                key={question.id}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        Question {index + 1}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {question.subject.name}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-4">{question.text}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {question.options.map(
                    (option: string, optionIndex: number) => {
                      let optionClass =
                        "flex items-center gap-3 p-3 rounded border ";
                      let icon = null;

                      if (optionIndex === question.correctAnswerIndex) {
                        optionClass +=
                          "border-green-200 bg-green-50 text-green-800";
                        icon = (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        );
                      } else if (
                        optionIndex === answer.selectedAnswer &&
                        !isCorrect
                      ) {
                        optionClass += "border-red-200 bg-red-50 text-red-800";
                        icon = (
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
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
                          {icon}
                        </div>
                      );
                    }
                  )}
                </div>

                {answer.selectedAnswer === null && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
                    <p className="text-orange-800 text-sm font-medium">
                      Not answered
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link href={`/result/view/${id}`}>
            <Button className="bg-gray-800 hover:bg-gray-900">
              Back to Results Summary
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
