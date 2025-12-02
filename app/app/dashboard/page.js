"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Button from "@/components/elements/button";
import Loader from "@/components/elements/loader";
import { curriculumAPI } from "@/utils/api";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  PlusCircle,
  Library,
  MessageCircle,
} from "lucide-react";

function DashboardPage() {
  const { user } = useAuth();
  const [curricula, setCurricula] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const curriculaData = await curriculumAPI.getAll();
        const curriculaArray = Array.isArray(curriculaData.data)
          ? curriculaData.data
          : curriculaData.data?.curricula || [];
        setCurricula(curriculaArray.slice(0, 5));
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
    <Sidebar>
      <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
        {/* Header */}
        <div className="mb-16 pt-12">
          <h1 className="text-4xl font-bold text-zinc-50 mb-3">Dashboard</h1>
          <p className="text-zinc-400 text-lg">Welcome back, {user.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
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

        {/* Quick Actions */}
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
                <h3 className="text-zinc-50 font-semibold">Cogni AI</h3>
                <p className="text-zinc-400 text-sm">Chat with AI</p>
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
            <div className="space-y-6">
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
    </Sidebar>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}
