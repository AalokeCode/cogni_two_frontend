"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/elements/loader";
import { curriculumAPI, quizAPI } from "@/utils/api";
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
  ChevronDown,
  ChevronRight,
  Sparkles,
  Play,
  BarChart3,
  Trash2,
  Edit3,
  Check,
  X,
  Layers,
  AlertCircle,
  Target,
} from "lucide-react";

const QUIZ_CREDIT_COST = 5;

function CurriculumDetailPage() {
  const { user, logout, checkAuth } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [quiz, setQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [deletingQuiz, setDeletingQuiz] = useState(false);
  const [deletingCurriculum, setDeletingCurriculum] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);
  const [progress, setProgress] = useState({});

  const hasEnoughCredits = user?.credits >= QUIZ_CREDIT_COST;

  useEffect(() => {
    fetchCurriculum();
  }, [params.id]);

  const fetchCurriculum = async () => {
    try {
      const data = await curriculumAPI.getById(params.id);
      setCurriculum(data.data);
      setNewTitle(data.data.title);
      setProgress(data.data.progress || {});

      // Try to fetch quiz
      try {
        const quizData = await quizAPI.get(params.id);
        // Backend returns { success: true, data: quiz } where quiz has results array
        const quizObj = quizData.data;
        setQuiz(quizObj);
        // Get the latest result if exists
        setQuizResult(quizObj.results?.[0] || null);
      } catch {
        // No quiz exists
        setQuiz(null);
        setQuizResult(null);
      }
    } catch (error) {
      console.error("Failed to fetch curriculum:", error);
      toast.error("Failed to load curriculum");
      router.push("/app/curriculum");
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (index) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleProgress = async (key) => {
    const prevProgress = { ...progress };
    const newProgress = {
      ...progress,
      [key]: !progress[key],
    };
    setProgress(newProgress);

    try {
      await curriculumAPI.update(params.id, { progress: newProgress });
    } catch {
      // Revert on error
      setProgress(prevProgress);
    }
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!curriculum?.modules) return 0;
    let totalItems = 0;
    let completedItems = 0;

    curriculum.modules.forEach((module, moduleIndex) => {
      // Count module
      totalItems++;
      if (progress[`module-${moduleIndex}`]) completedItems++;

      // Count lessons
      module.lessons?.forEach((_, lessonIndex) => {
        totalItems++;
        if (progress[`module-${moduleIndex}-lesson-${lessonIndex}`])
          completedItems++;
      });
    });

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const handleGenerateQuiz = async () => {
    if (!hasEnoughCredits) {
      toast.error("Insufficient credits");
      return;
    }

    setGeneratingQuiz(true);
    try {
      const data = await quizAPI.generate(params.id);
      setQuiz(data.data);
      toast.success("Quiz generated successfully");
      await checkAuth();
    } catch (error) {
      console.error("Failed to generate quiz:", error);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleDeleteQuiz = async () => {
    setDeletingQuiz(true);
    try {
      await quizAPI.delete(params.id);
      setQuiz(null);
      setQuizResult(null);
      toast.success("Quiz deleted");
      setDeleteModal(null);
    } catch (error) {
      console.error("Failed to delete quiz:", error);
    } finally {
      setDeletingQuiz(false);
    }
  };

  const handleDeleteCurriculum = async () => {
    setDeletingCurriculum(true);
    try {
      await curriculumAPI.delete(params.id);
      toast.success("Curriculum deleted");
      router.push("/app/curriculum");
    } catch (error) {
      console.error("Failed to delete curriculum:", error);
    } finally {
      setDeletingCurriculum(false);
    }
  };

  const handleUpdateTitle = async () => {
    if (!newTitle.trim() || newTitle === curriculum.title) {
      setEditingTitle(false);
      setNewTitle(curriculum.title);
      return;
    }

    try {
      await curriculumAPI.update(params.id, { title: newTitle });
      setCurriculum((prev) => ({ ...prev, title: newTitle }));
      toast.success("Title updated");
      setEditingTitle(false);
    } catch (error) {
      console.error("Failed to update title:", error);
      setNewTitle(curriculum.title);
    }
  };

  if (!user || loading) {
    return <Loader />;
  }

  if (!curriculum) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">Curriculum not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-zinc-900 border-r border-zinc-800 flex flex-col h-screen sticky top-0 transition-all duration-300`}
      >
        {/* Logo - Centered */}
        <div className="p-6 border-b border-zinc-800 flex justify-center">
          {sidebarOpen ? (
            <Image src="/logo.png" alt="cogni logo" width={120} height={30} />
          ) : (
            <Image src="/favicon.png" alt="cogni" width={32} height={32} />
          )}
        </div>

        {/* User Profile with Credit Progress Circle */}
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

        {/* Navigation */}
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

        {/* Logout Button */}
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

        <div className="max-w-4xl mx-auto px-8 py-12 relative z-10">
          {/* Header with Toggle */}
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
                href="/app/curriculum"
                className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-50 text-sm mb-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Curricula
              </Link>

              {/* Editable Title */}
              {editingTitle ? (
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="text-3xl font-bold bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-zinc-50 focus:outline-none focus:border-teal-400"
                    autoFocus
                  />
                  <button
                    onClick={handleUpdateTitle}
                    className="p-2 rounded-lg bg-teal-400 text-zinc-950 hover:bg-teal-500 transition-colors"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingTitle(false);
                      setNewTitle(curriculum.title);
                    }}
                    className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-3">
                  <h1 className="text-3xl font-bold text-zinc-50">
                    {curriculum.title}
                  </h1>
                  <button
                    onClick={() => setEditingTitle(true)}
                    className="p-2 rounded-lg text-zinc-500 hover:text-zinc-50 hover:bg-zinc-800 transition-colors"
                    title="Edit title"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <p className="text-zinc-400">{curriculum.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-400">
                Overall Progress
              </span>
              <span className="text-sm font-bold text-teal-400">
                {calculateOverallProgress()}%
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-400 transition-all duration-300"
                style={{ width: `${calculateOverallProgress()}%` }}
              />
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 mb-8">
            <span
              className={`text-sm font-medium px-3 py-1.5 rounded-lg ${
                curriculum.difficulty === "beginner"
                  ? "bg-green-500/20 text-green-400"
                  : curriculum.difficulty === "intermediate"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {curriculum.difficulty?.charAt(0).toUpperCase() +
                curriculum.difficulty?.slice(1)}
            </span>
            <span className="text-sm font-medium px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              {curriculum.modules?.length || 0} modules
            </span>
            <span className="text-sm font-medium px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 capitalize">
              {curriculum.depth} depth
            </span>
          </div>

          {/* Quiz Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-zinc-50 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-400" />
              Quiz
            </h2>

            {quizResult ? (
              // Quiz has been taken - show results
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <p className="text-zinc-400 mb-1">Your Score</p>
                    <p className="text-3xl font-bold text-zinc-50">
                      {Math.round(quizResult.score)}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/app/curriculum/${params.id}/quiz/results`}
                      className="flex items-center gap-2 bg-teal-400 hover:bg-teal-500 text-zinc-950 font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                      View Results
                    </Link>
                    <button
                      onClick={() => setDeleteModal("quiz")}
                      className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-50 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Retake
                    </button>
                  </div>
                </div>
                {quizResult.weakTopics && quizResult.weakTopics.length > 0 && (
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm mb-2">
                      Focus Areas for Improvement:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quizResult.weakTopics.map((item, i) => (
                        <span
                          key={i}
                          className="text-sm px-2 py-1 rounded bg-rose-500/20 text-rose-400"
                        >
                          {typeof item === "object" ? item.topic : item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : quiz ? (
              // Quiz exists but not taken
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-50 font-medium">Quiz Ready</p>
                  <p className="text-zinc-400 text-sm">
                    {quiz.questions?.length || 0} questions
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/app/curriculum/${params.id}/quiz`}
                    className="flex items-center gap-2 bg-teal-400 hover:bg-teal-500 text-zinc-950 font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Take Quiz
                  </Link>
                  <button
                    onClick={() => setDeleteModal("quiz")}
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-50 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              // No quiz - show generate button
              <div>
                {!hasEnoughCredits && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <p className="text-red-400 text-sm">
                      You need {QUIZ_CREDIT_COST} credits. You have{" "}
                      {user.credits}.
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-50 font-medium">No Quiz Yet</p>
                    <p className="text-zinc-400 text-sm">
                      Generate a quiz to test your knowledge
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateQuiz}
                    disabled={generatingQuiz || !hasEnoughCredits}
                    className="flex items-center gap-2 bg-teal-400 hover:bg-teal-500 text-zinc-950 font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingQuiz ? (
                      <>
                        <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate ({QUIZ_CREDIT_COST} credits)
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modules */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-zinc-50 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-400" />
              Modules
            </h2>
            <div className="space-y-3">
              {curriculum.modules?.map((module, moduleIndex) => {
                const moduleKey = `module-${moduleIndex}`;
                const moduleCompleted = progress[moduleKey];
                const lessonsCompleted =
                  module.lessons?.filter(
                    (_, i) => progress[`module-${moduleIndex}-lesson-${i}`]
                  ).length || 0;
                const totalLessons = module.lessons?.length || 0;

                return (
                  <div
                    key={moduleIndex}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                  >
                    <div className="flex items-center">
                      {/* Module Checkbox */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProgress(moduleKey);
                        }}
                        className={`ml-4 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          moduleCompleted
                            ? "bg-teal-400 border-teal-400"
                            : "border-zinc-600 hover:border-zinc-500"
                        }`}
                      >
                        {moduleCompleted && (
                          <Check className="w-3 h-3 text-zinc-950" />
                        )}
                      </button>

                      <button
                        onClick={() => toggleModule(moduleIndex)}
                        className="flex-1 flex items-center justify-between p-4 text-left hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                              moduleCompleted
                                ? "bg-teal-400/20 text-teal-400"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {moduleIndex + 1}
                          </span>
                          <span
                            className={`font-medium ${
                              moduleCompleted
                                ? "text-zinc-400 line-through"
                                : "text-zinc-50"
                            }`}
                          >
                            {module.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-400">
                          <span className="text-sm">
                            {lessonsCompleted}/{totalLessons} lessons
                          </span>
                          {expandedModules[moduleIndex] ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </div>
                      </button>
                    </div>

                    {expandedModules[moduleIndex] && (
                      <div className="border-t border-zinc-800">
                        {module.lessons?.map((lesson, lessonIndex) => {
                          const lessonKey = `module-${moduleIndex}-lesson-${lessonIndex}`;
                          const lessonCompleted = progress[lessonKey];

                          return (
                            <div
                              key={lessonIndex}
                              className="p-4 border-b border-zinc-800 last:border-b-0"
                            >
                              <div className="flex items-start gap-3">
                                {/* Lesson Checkbox */}
                                <button
                                  onClick={() => toggleProgress(lessonKey)}
                                  className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                                    lessonCompleted
                                      ? "bg-teal-400 border-teal-400"
                                      : "border-zinc-600 hover:border-zinc-500"
                                  }`}
                                >
                                  {lessonCompleted && (
                                    <Check className="w-3 h-3 text-zinc-950" />
                                  )}
                                </button>
                                <div className="flex-1">
                                  <h4
                                    className={`font-medium mb-2 ${
                                      lessonCompleted
                                        ? "text-zinc-500 line-through"
                                        : "text-zinc-50"
                                    }`}
                                  >
                                    {lessonIndex + 1}. {lesson.title}
                                  </h4>
                                  <p
                                    className={`text-sm whitespace-pre-wrap ${
                                      lessonCompleted
                                        ? "text-zinc-600"
                                        : "text-zinc-400"
                                    }`}
                                  >
                                    {lesson.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-6">
            <h2 className="text-lg font-bold text-red-400 mb-4">Danger Zone</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-50 font-medium">Delete Curriculum</p>
                <p className="text-zinc-400 text-sm">
                  This action cannot be undone
                </p>
              </div>
              <button
                onClick={() => setDeleteModal("curriculum")}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-zinc-50 mb-2">
              Delete {deleteModal === "quiz" ? "Quiz" : "Curriculum"}
            </h3>
            <p className="text-zinc-400 mb-6">
              {deleteModal === "quiz"
                ? "This will delete the quiz and your results. You can generate a new quiz afterwards."
                : "This will permanently delete this curriculum and all associated data."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                disabled={deletingQuiz || deletingCurriculum}
                className="flex-1 px-4 py-3 rounded-lg border border-zinc-700 text-zinc-50 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={
                  deleteModal === "quiz"
                    ? handleDeleteQuiz
                    : handleDeleteCurriculum
                }
                disabled={deletingQuiz || deletingCurriculum}
                className="flex-1 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {deletingQuiz || deletingCurriculum ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CurriculumDetail() {
  return (
    <ProtectedRoute>
      <CurriculumDetailPage />
    </ProtectedRoute>
  );
}
