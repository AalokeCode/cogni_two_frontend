"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/elements/loader";
import { curriculumAPI } from "@/utils/api";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  BookOpen,
  Plus,
  Calendar,
  Layers,
  BarChart3,
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  ChevronRight,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Button from "@/components/elements/button";

function CurriculaPage() {
  const { user } = useAuth();
  const [curricula, setCurricula] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [deleting, setDeleting] = useState(null);

  const fetchCurricula = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (difficulty) params.difficulty = difficulty;
      if (sortBy) params.sortBy = sortBy;
      if (order) params.order = order;

      const response = await curriculumAPI.getAll(params);
      setCurricula(response.data || []);
    } catch (error) {
      console.error("Failed to fetch curricula:", error);
      toast.error("Failed to load curricula");
    } finally {
      setLoading(false);
    }
  }, [search, difficulty, sortBy, order]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchCurricula();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchCurricula]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (deleting) return;

    setDeleting(id);
    try {
      await curriculumAPI.delete(id);
      setCurricula((prev) => prev.filter((c) => c.id !== id));
      toast.success("Curriculum deleted");
    } catch (error) {
      console.error("Failed to delete curriculum:", error);
      toast.error("Failed to delete curriculum");
    } finally {
      setDeleting(null);
    }
  };

  const getSortLabel = () => {
    if (sortBy === "createdAt")
      return order === "desc" ? "Newest First" : "Oldest First";
    if (sortBy === "updatedAt")
      return order === "desc" ? "Recently Updated" : "Least Recently Updated";
    if (sortBy === "title") return order === "asc" ? "A-Z" : "Z-A";
    return "Newest First";
  };

  const toggleSort = () => {
    if (sortBy === "createdAt" && order === "desc") {
      setOrder("asc");
    } else if (sortBy === "createdAt" && order === "asc") {
      setSortBy("title");
      setOrder("asc");
    } else if (sortBy === "title" && order === "asc") {
      setSortBy("title");
      setOrder("desc");
    } else {
      setSortBy("createdAt");
      setOrder("desc");
    }
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <Sidebar>
      <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
        {/* Header */}
        <div className="mb-8 pt-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-zinc-50 mb-3">
              My Curricula
            </h1>
            <p className="text-zinc-400 text-lg">
              Manage and explore your learning paths
            </p>
          </div>
          <Button variant="primary" isLink url="/app/curriculum/create">
            <Plus className="w-5 h-5 mr-2" />
            Create New
          </Button>
        </div>

        {/* Search and Filters - Inline */}
        <div className="mb-8 flex gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or topic..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-teal-400 transition-colors"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="pl-12 pr-8 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-50 focus:outline-none focus:border-teal-400 appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Sort */}
          <button
            onClick={toggleSort}
            className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-50 hover:border-zinc-700 transition-colors min-w-[160px]"
          >
            <ArrowUpDown className="w-5 h-5 text-zinc-500" />
            <span>{getSortLabel()}</span>
          </button>
        </div>

        {/* Curricula Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : curricula.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-teal-400/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-teal-400" />
            </div>
            {search || difficulty ? (
              <>
                <h3 className="text-xl font-semibold text-zinc-50 mb-2">
                  No results found
                </h3>
                <p className="text-zinc-400 mb-6 text-lg">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setDifficulty("");
                  }}
                  className="text-teal-400 hover:text-teal-300 font-medium"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-zinc-50 mb-2">
                  No curricula yet
                </h3>
                <p className="text-zinc-400 mb-6 text-lg">
                  Create your first curriculum to start learning
                </p>
                <Button variant="primary" isLink url="/app/curriculum/create">
                  Create Your First Curriculum
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curricula.map((curriculum) => (
              <Link
                key={curriculum.id}
                href={`/app/curriculum/${curriculum.id}`}
                className="block group"
              >
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors h-full flex flex-col">
                  {/* Top Row - Badge & Delete */}
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                        curriculum.difficulty === "beginner"
                          ? "bg-teal-500/20 text-teal-400"
                          : curriculum.difficulty === "intermediate"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {curriculum.difficulty}
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, curriculum.id)}
                      disabled={deleting === curriculum.id}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold text-zinc-50 mb-2 line-clamp-2 group-hover:text-teal-400 transition-colors">
                    {curriculum.title}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    Learn about {curriculum.topic}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 text-sm text-zinc-500 mt-auto mb-4">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      <span>{curriculum.modules?.length || 0} modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      <span className="capitalize">
                        {curriculum.depth} Depth
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(curriculum.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* View Details Link */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <span className="text-teal-400 font-medium text-sm group-hover:text-teal-300 transition-colors">
                      View Details
                    </span>
                    <ChevronRight className="w-5 h-5 text-teal-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Sidebar>
  );
}

export default function Curricula() {
  return (
    <ProtectedRoute>
      <CurriculaPage />
    </ProtectedRoute>
  );
}
