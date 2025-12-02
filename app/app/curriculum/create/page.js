"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/elements/loader";
import { curriculumAPI } from "@/utils/api";
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
  Sparkles,
  ArrowLeft,
  Zap,
  AlertCircle,
} from "lucide-react";

const CREDIT_COST = 10;

function CreateCurriculumPage() {
  const { user, logout, checkAuth } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [depth, setDepth] = useState("moderate");
  const [creating, setCreating] = useState(false);

  const hasEnoughCredits = user?.credits >= CREDIT_COST;

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    if (!hasEnoughCredits) {
      toast.error("Insufficient credits");
      return;
    }

    setCreating(true);
    try {
      const data = await curriculumAPI.create({ topic, difficulty, depth });
      toast.success("Curriculum created successfully");
      // Refresh user to update credits
      await checkAuth();
      // Redirect to the new curriculum
      router.push(`/app/curriculum/${data.data.id}`);
    } catch (error) {
      console.error("Failed to create curriculum:", error);
    } finally {
      setCreating(false);
    }
  };

  if (!user) {
    return <Loader />;
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
            {/* Progress Circle */}
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
            {/* Profile Picture */}
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
        {/* Ethereal background gradients */}
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-2xl mx-auto px-8 py-12 relative z-10">
          {/* Header with Toggle */}
          <div className="mb-8 flex items-start gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-50 hover:bg-zinc-800 transition-colors mt-1"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <Link
                href="/app/curriculum"
                className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-50 text-sm mb-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Curricula
              </Link>
              <h1 className="text-4xl font-bold text-zinc-50 mb-3">
                Create Curriculum
              </h1>
              <p className="text-zinc-400 text-lg">
                Generate a personalized learning path with AI
              </p>
            </div>
          </div>

          {/* Credit Warning */}
          {!hasEnoughCredits && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-400 font-medium">Insufficient Credits</p>
                <p className="text-red-400/70 text-sm mt-1">
                  You need {CREDIT_COST} credits to create a curriculum. You
                  currently have {user.credits} credits.
                </p>
              </div>
            </div>
          )}

          {/* Form Card */}
          <form onSubmit={handleCreate}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-6">
              {/* Topic Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Machine Learning Fundamentals, React Development, etc."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-teal-400 transition-colors"
                  disabled={creating}
                />
                <p className="text-zinc-500 text-sm mt-2">
                  Enter the subject you want to learn about
                </p>
              </div>

              {/* Difficulty Select */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-teal-400 transition-colors cursor-pointer"
                  disabled={creating}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <p className="text-zinc-500 text-sm mt-2">
                  Choose based on your current knowledge level
                </p>
              </div>

              {/* Depth Select */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Content Depth
                </label>
                <select
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-teal-400 transition-colors cursor-pointer"
                  disabled={creating}
                >
                  <option value="brief">Brief - Quick overview</option>
                  <option value="moderate">Moderate - Balanced coverage</option>
                  <option value="comprehensive">
                    Comprehensive - In-depth exploration
                  </option>
                </select>
                <p className="text-zinc-500 text-sm mt-2">
                  Determines how detailed the curriculum will be
                </p>
              </div>
            </div>

            {/* Credit Cost Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-400/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-zinc-50 font-medium">Credit Cost</p>
                    <p className="text-zinc-400 text-sm">
                      This will use {CREDIT_COST} credits
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-zinc-50">
                    {CREDIT_COST}
                  </p>
                  <p className="text-zinc-400 text-sm">
                    Balance: {user.credits}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={creating || !hasEnoughCredits || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 bg-teal-400 hover:bg-teal-500 text-zinc-950 font-semibold px-6 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? (
                <>
                  <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  Generating Curriculum...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Curriculum
                </>
              )}
            </button>

            {creating && (
              <p className="text-zinc-400 text-sm text-center mt-4">
                This may take a moment while AI generates your personalized
                curriculum...
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

export default function CreateCurriculum() {
  return (
    <ProtectedRoute>
      <CreateCurriculumPage />
    </ProtectedRoute>
  );
}
