"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/elements/loader";
import { quizAPI } from "@/utils/api";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  BookOpen,
  ArrowLeft,
  Trophy,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

function QuizResultsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [params.id]);

  const fetchResults = async () => {
    try {
      const data = await quizAPI.get(params.id);
      // Backend returns { success: true, data: quiz } where quiz has results array
      const quizObj = data.data;
      if (!quizObj.results || quizObj.results.length === 0) {
        // Quiz not taken yet, redirect to quiz
        router.push(`/app/curriculum/${params.id}/quiz`);
        return;
      }
      setQuiz(quizObj);
      setResult(quizObj.results[0]); // Get latest result
    } catch (error) {
      console.error("Failed to fetch results:", error);
      toast.error("No quiz results found");
      router.push(`/app/curriculum/${params.id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async () => {
    setDeleting(true);
    try {
      await quizAPI.delete(params.id);
      toast.success("Quiz deleted - you can now retake");
      router.push(`/app/curriculum/${params.id}`);
    } catch (error) {
      console.error("Failed to delete quiz:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (!user || loading) {
    return <Loader />;
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">Results not found</p>
      </div>
    );
  }

  const scoreColor =
    result.score >= 80
      ? "text-green-400"
      : result.score >= 60
      ? "text-yellow-400"
      : "text-red-400";

  const scoreMessage =
    result.score >= 80
      ? "Excellent work!"
      : result.score >= 60
      ? "Good effort!"
      : "Keep practicing!";

  return (
    <Sidebar>
      <div className="max-w-3xl mx-auto px-8 py-12 relative z-10">
        {/* Header */}
        <div className="mb-8 pt-12">
          <Link
            href={`/app/curriculum/${params.id}`}
            className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-50 text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Curriculum
          </Link>
          <h1 className="text-3xl font-bold text-zinc-50 mb-2">Quiz Results</h1>
        </div>

        {/* Score Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-8 text-center">
          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <Trophy className={`w-10 h-10 ${scoreColor}`} />
          </div>
          <p className={`text-6xl font-bold ${scoreColor} mb-2`}>
            {Math.round(result.score)}%
          </p>
          <p className="text-zinc-400 text-lg">{scoreMessage}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-zinc-400">Correct</span>
            </div>
            <p className="text-3xl font-bold text-zinc-50">
              {result.correctCount ||
                Math.round((result.score / 100) * quiz.questions.length)}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-zinc-400">Incorrect</span>
            </div>
            <p className="text-3xl font-bold text-zinc-50">
              {result.incorrectCount ||
                quiz.questions.length -
                  Math.round((result.score / 100) * quiz.questions.length)}
            </p>
          </div>
        </div>

        {/* Question Breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-zinc-50 mb-4">
            Question Breakdown
          </h2>
          <div className="space-y-4">
            {quiz.questions.map((question, index) => {
              const userAnswer = result.answers?.[index];
              const isCorrect = userAnswer === question.correctAnswer;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isCorrect
                      ? "bg-green-500/10 border-green-500/20"
                      : "bg-red-500/10 border-red-500/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-zinc-50 font-medium mb-2">
                        Q{index + 1}: {question.question}
                      </p>
                      <div className="space-y-1 text-sm">
                        <p className="text-zinc-400">
                          Your answer:{" "}
                          <span
                            className={
                              isCorrect ? "text-green-400" : "text-red-400"
                            }
                          >
                            {question.options[userAnswer] || "Not answered"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-zinc-400">
                            Correct answer:{" "}
                            <span className="text-green-400">
                              {question.options[question.correctAnswer]}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak Topics */}
        {result.weakTopics && result.weakTopics.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-semibold text-zinc-50">
                Focus Areas
              </h2>
            </div>
            <p className="text-zinc-400 text-sm mb-4">
              These topics need more attention based on your answers:
            </p>
            <div className="flex flex-wrap gap-2">
              {result.weakTopics.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 text-sm"
                >
                  {typeof item === "object" ? item.topic : item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-semibold text-zinc-50">
                Recommendations
              </h2>
            </div>
            <p className="text-zinc-400">{result.recommendations}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <Link
            href={`/app/curriculum/${params.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-teal-400 text-zinc-950 font-semibold hover:bg-teal-500 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Review Curriculum
          </Link>
          <button
            onClick={() => setDeleteModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-800 text-zinc-50 hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Retake Quiz
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-zinc-50 mb-2">Retake Quiz</h3>
            <p className="text-zinc-400 mb-6">
              This will delete your current results. You&apos;ll need to
              generate a new quiz (costs 5 credits) to try again.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-3 rounded-lg border border-zinc-700 text-zinc-50 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuiz}
                disabled={deleting}
                className="flex-1 px-4 py-3 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete & Retake"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}

export default function QuizResults() {
  return (
    <ProtectedRoute>
      <QuizResultsPage />
    </ProtectedRoute>
  );
}
