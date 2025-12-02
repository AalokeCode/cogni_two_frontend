"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Button from "@/components/elements/button";
import Loader from "@/components/elements/loader";
import { curriculumAPI } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  BookOpen,
  PlusCircle,
  Library,
  MessageCircle,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
} from "lucide-react";

function DashboardPage() {
  const { user, logout } = useAuth();
  const [curricula, setCurricula] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [totalQuizzes, setTotalQuizzes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const curriculaData = await curriculumAPI.getAll();
        // Backend returns { success: true, data: [...] }
        const curriculaArray = Array.isArray(curriculaData.data)
          ? curriculaData.data
          : curriculaData.data?.curricula || [];
        setCurricula(curriculaArray.slice(0, 5));

        // Count total quizzes taken
        let quizCount = 0;
        for (const curriculum of curriculaArray) {
          try {
            const quizData = await curriculumAPI.getById(curriculum.id);
            if (quizData.data?.quiz) quizCount++;
          } catch {
            // Quiz doesn't exist for this curriculum
          }
        }
        setTotalQuizzes(quizCount);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

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
              <p className="text-zinc-400 text-sm">Admin account</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            href="/app/dashboard"
            className={`flex items-center ${
              sidebarOpen ? "gap-3" : "justify-center"
            } px-4 py-3 rounded-lg bg-zinc-800 text-zinc-50 mb-2`}
            title="Dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link
            href="/app/curriculum"
            className={`flex items-center ${
              sidebarOpen ? "gap-3" : "justify-center"
            } px-4 py-3 rounded-lg text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50 mb-2 transition-colors`}
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

        {/* Credit Progress Bar */}
        {sidebarOpen && (
          <div className="p-4 border-t border-zinc-800">
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-400">Quizzes Taken</span>
                <span className="text-zinc-50 font-semibold">
                  {totalQuizzes}/{curricula.length}
                </span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-teal-400 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      curricula.length > 0
                        ? (totalQuizzes / curricula.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

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
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none animate-float-slow" />
        <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[150px] pointer-events-none animate-float" />

        <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
          {/* Header with Toggle */}
          <div className="mb-16 flex items-start gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-50 hover:bg-zinc-800 transition-colors mt-1"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-zinc-50 mb-3">
                Dashboard
              </h1>
              <p className="text-zinc-400 text-lg">Welcome back, {user.name}</p>
            </div>
          </div>

          {/* Stats Cards with Light Backgrounds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Credits Card - Light Teal */}
            <div className="bg-teal-400/10 border border-teal-400/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-zinc-50 text-sm font-medium">
                  Credits Remaining
                </p>
                <div className="w-8 h-8 rounded-lg bg-teal-400/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                </div>
              </div>
              <p className="text-4xl font-bold text-zinc-50">{user.credits}</p>
            </div>

            {/* Curricula Card - Light Gray */}
            <div className="bg-zinc-400/10 border border-zinc-400/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-zinc-50 text-sm font-medium">
                  Curricula Created
                </p>
                <div className="w-8 h-8 rounded-lg bg-zinc-400/20 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-zinc-400" />
                </div>
              </div>
              <p className="text-4xl font-bold text-zinc-50">
                {curricula.length}
              </p>
            </div>
          </div>

          {/* Quick Actions with Icons */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-zinc-50 mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/app/curriculum/create"
                className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-teal-400/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-teal-400/10 flex items-center justify-center group-hover:bg-teal-400/20 transition-colors">
                  <PlusCircle className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-zinc-50 font-semibold">
                    Create Curriculum
                  </h3>
                  <p className="text-zinc-400 text-sm">Start a new course</p>
                </div>
              </Link>

              <Link
                href="/app/curriculum"
                className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-400/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-zinc-400/10 flex items-center justify-center group-hover:bg-zinc-400/20 transition-colors">
                  <Library className="w-6 h-6 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-zinc-50 font-semibold">My Curricula</h3>
                  <p className="text-zinc-400 text-sm">View all courses</p>
                </div>
              </Link>

              <Link
                href="/app/mentor"
                className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-rose-400/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-rose-400/10 flex items-center justify-center group-hover:bg-rose-400/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-zinc-50 font-semibold">AI Mentor</h3>
                  <p className="text-zinc-400 text-sm">Chat with mentor</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Curricula */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-zinc-50">
                Recent Curricula
              </h2>
              {curricula.length > 0 && (
                <Link
                  href="/app/curriculum"
                  className="text-teal-400 hover:text-teal-300 text-sm transition-colors"
                >
                  View all →
                </Link>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            ) : curricula.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-teal-400/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-teal-400" />
                </div>
                <p className="text-zinc-400 mb-6 text-lg">
                  You haven&apos;t created any curricula yet.
                </p>
                <Button variant="primary" isLink url="/app/curriculum/create">
                  Create Your First Curriculum
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {curricula.map((curriculum) => (
                  <Link
                    key={curriculum.id}
                    href={`/app/curriculum/${curriculum.id}`}
                  >
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-zinc-50 hover:text-teal-400 transition-colors">
                          {curriculum.title}
                        </h3>
                        <span className="text-xs text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full">
                          {curriculum.difficulty}
                        </span>
                      </div>
                      <p className="text-zinc-400 mb-4">{curriculum.topic}</p>
                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <span className="flex items-center gap-1">
                          <span className="text-teal-400">●</span> Depth:{" "}
                          {curriculum.depth}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-zinc-400">●</span>{" "}
                          {curriculum.modules?.length || 0} modules
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-rose-400">●</span>
                          {new Date(curriculum.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}
