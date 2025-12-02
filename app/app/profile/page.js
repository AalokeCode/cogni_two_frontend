"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/elements/loader";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  BookOpen,
  MessageCircle,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  Eye,
  EyeOff,
  Save,
  Key,
  Mail,
  CreditCard,
} from "lucide-react";

function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [name, setName] = useState(user?.name || "");
  const [geminiApiKey, setGeminiApiKey] = useState(user?.geminiApiKey || "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = { name };
      if (geminiApiKey) {
        updates.geminiApiKey = geminiApiKey;
      }
      await updateUser(updates);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
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
            } px-4 py-3 rounded-lg bg-zinc-800 text-zinc-50 mb-2`}
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

        <div className="max-w-3xl mx-auto px-8 py-12 relative z-10">
          {/* Header with Toggle */}
          <div className="mb-12 flex items-start gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-50 hover:bg-zinc-800 transition-colors mt-1"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-zinc-50 mb-3">Profile</h1>
              <p className="text-zinc-400 text-lg">
                Manage your account settings
              </p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-8">
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-zinc-800">
              <div className="relative">
                <Image
                  src="/defaults/pfp.jpg"
                  alt={user.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-50">{user.name}</h2>
                <p className="text-zinc-400">{user.email}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Email (Read-only) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-50 cursor-not-allowed opacity-60"
                />
                <p className="text-zinc-500 text-sm mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Name (Editable) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                  <User className="w-4 h-4" />
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-teal-400 transition-colors"
                />
              </div>

              {/* Gemini API Key (Editable with toggle) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                  <Key className="w-4 h-4" />
                  Gemini API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key (optional)"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 pr-12 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-teal-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-50 transition-colors"
                  >
                    {showApiKey ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-zinc-500 text-sm mt-1">
                  Use your own API key for unlimited generations. Leave empty to
                  use platform credits.
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-zinc-800">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-teal-400 hover:bg-teal-500 text-zinc-950 font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Credits Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-teal-400/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-50">Credits</h3>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-bold text-zinc-50">
                {user.credits}
              </span>
              <span className="text-zinc-400">credits remaining</span>
            </div>

            {/* Credit Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-teal-400 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((user.credits / 1000) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-zinc-500 text-sm mt-2">
                {user.credits} / 1000 credits
              </p>
            </div>

            {/* Credit Costs Explanation */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h4 className="text-zinc-50 font-medium mb-3">Credit Costs</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    Create Curriculum
                  </span>
                  <span className="text-zinc-50 font-medium">10 credits</span>
                </li>
                <li className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-teal-400" />
                    Generate Quiz
                  </span>
                  <span className="text-zinc-50 font-medium">5 credits</span>
                </li>
                <li className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-teal-400" />
                    Mentor Chat (per message)
                  </span>
                  <span className="text-zinc-50 font-medium">1 credit</span>
                </li>
              </ul>
            </div>

            <p className="text-zinc-500 text-sm mt-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Tip: Add your own Gemini API key above to bypass credit costs
              entirely.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
