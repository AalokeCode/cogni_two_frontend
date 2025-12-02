"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
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
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  ChevronRight,
  Plus,
  Calendar,
  BarChart3,
  Layers,
} from "lucide-react";

function CurriculaPage() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [curricula, setCurricula] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCurricula();
  }, [searchQuery, difficultyFilter, sortOrder]);

  const fetchCurricula = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (difficultyFilter !== "all") params.difficulty = difficultyFilter;
      params.sortBy = "createdAt";
      params.order = sortOrder === "newest" ? "desc" : "asc";

      const data = await curriculumAPI.getAll(params);
      // Backend returns { success: true, data: [...] }
      const curriculaArray = Array.isArray(data.data)
        ? data.data
        : data.data?.curricula || [];
      setCurricula(curriculaArray);
    } catch (error) {
      console.error("Failed to fetch curricula:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await curriculumAPI.delete(id);
      setCurricula(curricula.filter((c) => c.id !== id));
      toast.success("Curriculum deleted");
      setDeleteModal(null);
    } catch (error) {
      console.error("Failed to delete curriculum:", error);
    } finally {
      setDeleting(false);
    }
  };

  // Filter and sort curricula
  const filteredCurricula = curricula
    .filter((c) => {
      const matchesSearch =
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.topic?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty =
        difficultyFilter === "all" || c.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

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

        <div className="max-w-6xl mx-auto px-8 py-12 relative z-10">
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
              <h1 className="text-4xl font-bold text-zinc-50 mb-3">
                My Curricula
              </h1>
              <p className="text-zinc-400 text-lg">
                Manage and explore your learning paths
              </p>
            </div>
            <Link
              href="/app/curriculum/create"
              className="flex items-center gap-2 bg-teal-400 hover:bg-teal-500 text-zinc-950 font-semibold px-5 py-3 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create New
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or topic..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-teal-400 transition-colors"
                />
              </div>

              {/* Difficulty Filter */}
              <div className="relative">
                <Filter className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="appearance-none bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-10 py-3 text-zinc-50 focus:outline-none focus:border-teal-400 transition-colors cursor-pointer"
                >
                  <option value="all">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="relative">
                <ArrowUpDown className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-10 py-3 text-zinc-50 focus:outline-none focus:border-teal-400 transition-colors cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Curricula Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : filteredCurricula.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zinc-50 mb-2">
                {curricula.length === 0
                  ? "No curricula yet"
                  : "No matching curricula"}
              </h3>
              <p className="text-zinc-400 mb-6">
                {curricula.length === 0
                  ? "Create your first curriculum to start learning"
                  : "Try adjusting your search or filters"}
              </p>
              {curricula.length === 0 && (
                <Link
                  href="/app/curriculum/create"
                  className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-500 text-zinc-950 font-semibold px-5 py-3 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Curriculum
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCurricula.map((curriculum) => (
                <div
                  key={curriculum.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
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
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setDeleteModal(curriculum);
                        }}
                        className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-50 mb-2 line-clamp-2">
                      {curriculum.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                      {curriculum.description ||
                        `Learn about ${curriculum.topic}`}
                    </p>
                  </div>

                  {/* Card Meta */}
                  <div className="px-6 pb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <Layers className="w-4 h-4" />
                      <span>{curriculum.modules?.length || 0} modules</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <BarChart3 className="w-4 h-4" />
                      <span className="capitalize">
                        {curriculum.depth} depth
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(curriculum.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <Link
                    href={`/app/curriculum/${curriculum.id}`}
                    className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 text-teal-400 hover:bg-zinc-800/50 transition-colors"
                  >
                    <span className="font-medium">View Details</span>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Results Count */}
          {!loading && filteredCurricula.length > 0 && (
            <p className="text-zinc-500 text-sm mt-6 text-center">
              Showing {filteredCurricula.length} of {curricula.length} curricula
            </p>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-zinc-50 mb-2">
              Delete Curriculum
            </h3>
            <p className="text-zinc-400 mb-6">
              Are you sure you want to delete &quot;{deleteModal.title}&quot;?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                disabled={deleting}
                className="flex-1 px-4 py-3 rounded-lg border border-zinc-700 text-zinc-50 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.id)}
                disabled={deleting}
                className="flex-1 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Curricula() {
  return (
    <ProtectedRoute>
      <CurriculaPage />
    </ProtectedRoute>
  );
}
