"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/elements/loader";
import { quizAPI } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  BookOpen,
  MessageCircle,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Circle,
  Send,
} from "lucide-react";

function QuizPage() {
  const { user, logout } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [params.id]);

  const fetchQuiz = async () => {
    try {
      const data = await quizAPI.get(params.id);
      // Backend returns { success: true, data: quiz } where quiz has results array
      const quizObj = data.data;
      if (quizObj.results && quizObj.results.length > 0) {
        // Quiz already taken, redirect to results
        router.push(`/app/curriculum/${params.id}/quiz/results`);
        return;
      }
      setQuiz(quizObj);
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
      toast.error("No quiz found");
      router.push(`/app/curriculum/${params.id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionIndex, answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const handleSubmit = async () => {
    const unanswered = quiz.questions.filter(
      (_, index) => answers[index] === undefined
    );
    if (unanswered.length > 0) {
      toast.error(
        `Please answer all questions (${unanswered.length} remaining)`
      );
      return;
    }

    setSubmitting(true);
    try {
      // Convert answers object to array format expected by backend
      const answersArray = quiz.questions.map((_, index) => answers[index]);
      await quizAPI.submit(params.id, answersArray);
      toast.success("Quiz submitted!");
      router.push(`/app/curriculum/${params.id}/quiz/results`);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const goNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goPrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (!user || loading) {
    return <Loader />;
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">Quiz not found</p>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-zinc-900 border-r border-zinc-800 flex flex-col h-screen sticky top-0 transition-all duration-300`}
      >
        <div className="p-6 border-b border-zinc-800 flex justify-center">
          {sidebarOpen ? (
            <Image src="/logo.png" alt="cogni logo" width={120} height={30} />
          ) : (
            <Image src="/favicon.png" alt="cogni" width={32} height={32} />
          )}
        </div>

        <div className="p-6 border-b border-zinc-800 flex justify-center">
          <div className="relative">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-zinc-800"
              />
              <circle
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${(user.credits / 1000) * 163.36} 163.36`}
                className="text-teal-400"
                strokeLinecap="round"
              />
            </svg>
            <Image
              src="/defaults/pfp.jpg"
              alt={user.name}
              width={48}
              height={48}
              className="rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          {sidebarOpen && (
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-zinc-50 font-semibold truncate">{user.name}</p>
              <p className="text-zinc-400 text-sm">
                {user.role === "admin" ? "Admin account" : "User account"}
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            href="/app/dashboard"
            className={`flex items-center ${
              sidebarOpen ? "gap-3" : "justify-center"
            } px-4 py-3 rounded-lg text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50 mb-2 transition-colors`}
            title="Dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link
            href="/app/curriculum"
            className={`flex items-center ${
              sidebarOpen ? "gap-3" : "justify-center"
            } px-4 py-3 rounded-lg bg-zinc-800 text-zinc-50 mb-2`}
            title="Curricula"
          >
            <BookOpen className="w-5 h-5" />
            {sidebarOpen && <span>Curricula</span>}
          </Link>
          <Link
            href="/app/mentor"
            className={`flex items-center ${
              sidebarOpen ? "gap-3" : "justify-center"
            } px-4 py-3 rounded-lg text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50 mb-2 transition-colors`}
            title="Mentor Chat"
          >
            <MessageCircle className="w-5 h-5" />
            {sidebarOpen && <span>Mentor Chat</span>}
          </Link>
          <Link
            href="/app/profile"
            className={`flex items-center ${
              sidebarOpen ? "gap-3" : "justify-center"
            } px-4 py-3 rounded-lg text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50 mb-2 transition-colors`}
            title="Profile"
          >
            <User className="w-5 h-5" />
            {sidebarOpen && <span>Profile</span>}
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={logout}
            className={`flex items-center ${
              sidebarOpen ? "gap-3" : "justify-center"
            } px-4 py-3 rounded-lg text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50 w-full transition-colors`}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-8 py-12 relative z-10">
          {/* Header */}
          <div className="mb-8 flex items-start gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-50 hover:bg-zinc-800 transition-colors mt-1"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <Link
                href={`/app/curriculum/${params.id}`}
                className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-50 text-sm mb-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Curriculum
              </Link>
              <h1 className="text-3xl font-bold text-zinc-50 mb-2">Quiz</h1>
              <p className="text-zinc-400">
                Answer all questions to complete the quiz
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-sm">Progress</span>
              <span className="text-zinc-50 font-medium">
                {answeredCount} / {quiz.questions.length} answered
              </span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-teal-400 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Navigation Dots */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? "bg-teal-400 text-zinc-950"
                    : answers[index] !== undefined
                    ? "bg-teal-400/20 text-teal-400 border border-teal-400/30"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {answers[index] !== undefined ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </button>
            ))}
          </div>

          {/* Question Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-8">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
              <span>Question {currentQuestion + 1}</span>
              <span>/</span>
              <span>{quiz.questions.length}</span>
            </div>

            <h2 className="text-xl font-semibold text-zinc-50 mb-6">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() => handleAnswer(currentQuestion, optionIndex)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                    answers[currentQuestion] === optionIndex
                      ? "bg-teal-400/10 border-teal-400 text-zinc-50"
                      : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      answers[currentQuestion] === optionIndex
                        ? "border-teal-400 bg-teal-400"
                        : "border-zinc-600"
                    }`}
                  >
                    {answers[currentQuestion] === optionIndex && (
                      <Circle className="w-2 h-2 fill-zinc-950 text-zinc-950" />
                    )}
                  </span>
                  <span>{option}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-50 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting || answeredCount !== quiz.questions.length}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-teal-400 text-zinc-950 font-semibold hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Quiz
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={goNext}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-50 hover:bg-zinc-700 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Quiz() {
  return (
    <ProtectedRoute>
      <QuizPage />
    </ProtectedRoute>
  );
}
