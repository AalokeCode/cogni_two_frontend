"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/elements/loader";
import { quizAPI } from "@/utils/api";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, CheckCircle, Circle, Send } from "lucide-react";
import Sidebar from "@/components/Sidebar";

function QuizPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
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
          <h1 className="text-3xl font-bold text-zinc-50 mb-2">Quiz</h1>
          <p className="text-zinc-400">
            Answer all questions to complete the quiz
          </p>
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
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
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
    </Sidebar>
  );
}

export default function Quiz() {
  return (
    <ProtectedRoute>
      <QuizPage />
    </ProtectedRoute>
  );
}
