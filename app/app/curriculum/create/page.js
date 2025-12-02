"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/elements/loader";
import { curriculumAPI } from "@/utils/api";
import toast from "react-hot-toast";
import { ArrowLeft, Sparkles, Coins } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

const CURRICULUM_CREDIT_COST = 10;

function CreateCurriculumPage() {
  const { user, checkAuth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    difficulty: "beginner",
    depth: "comprehensive",
    additionalContext: "",
  });

  const hasEnoughCredits = user?.credits >= CURRICULUM_CREDIT_COST;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    if (!hasEnoughCredits) {
      toast.error("Insufficient credits");
      return;
    }

    setLoading(true);
    try {
      const response = await curriculumAPI.create(formData);
      await checkAuth(); // Refresh user credits
      toast.success("Curriculum created successfully!");
      router.push(`/app/curriculum/${response.data.id}`);
    } catch (error) {
      console.error("Failed to create curriculum:", error);
      toast.error("Failed to create curriculum");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <Sidebar>
      <div className="max-w-3xl mx-auto px-8 py-12 relative z-10">
        {/* Header */}
        <div className="mb-12 pt-12">
          <Link
            href="/app/curriculum"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-50 mb-6 transition-colors"
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

        {/* Credit Cost Info */}
        <div className="bg-teal-400/10 border border-teal-400/20 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coins className="w-6 h-6 text-teal-400" />
              <div>
                <p className="text-zinc-50 font-medium">
                  Cost: {CURRICULUM_CREDIT_COST} credits
                </p>
                <p className="text-zinc-400 text-sm">
                  Your balance: {user.credits} credits
                </p>
              </div>
            </div>
            {!hasEnoughCredits && (
              <span className="text-rose-400 text-sm">
                Insufficient credits
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic */}
          <div>
            <label
              htmlFor="topic"
              className="block text-zinc-50 font-medium mb-2"
            >
              Topic *
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g., Machine Learning, Web Development, Data Structures"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-teal-400 transition-colors"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label
              htmlFor="difficulty"
              className="block text-zinc-50 font-medium mb-2"
            >
              Difficulty Level
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 focus:outline-none focus:border-teal-400 transition-colors"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Depth */}
          <div>
            <label
              htmlFor="depth"
              className="block text-zinc-50 font-medium mb-2"
            >
              Course Depth
            </label>
            <select
              id="depth"
              name="depth"
              value={formData.depth}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 focus:outline-none focus:border-teal-400 transition-colors"
            >
              <option value="overview">Overview - Quick introduction</option>
              <option value="standard">Standard - Balanced coverage</option>
              <option value="comprehensive">
                Comprehensive - In-depth learning
              </option>
            </select>
          </div>

          {/* Additional Context */}
          <div>
            <label
              htmlFor="additionalContext"
              className="block text-zinc-50 font-medium mb-2"
            >
              Additional Context (Optional)
            </label>
            <textarea
              id="additionalContext"
              name="additionalContext"
              value={formData.additionalContext}
              onChange={handleChange}
              rows={4}
              placeholder="Any specific goals, background knowledge, or focus areas..."
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-teal-400 transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !hasEnoughCredits}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all ${
                loading || !hasEnoughCredits
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-teal-400 text-zinc-950 hover:bg-teal-300"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                  Generating Curriculum...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Curriculum
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
}

export default function CreateCurriculum() {
  return (
    <ProtectedRoute>
      <CreateCurriculumPage />
    </ProtectedRoute>
  );
}
