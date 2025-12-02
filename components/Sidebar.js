"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  MessageCircle,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
} from "lucide-react";

const navItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/curriculum", label: "Curricula", icon: BookOpen },
  { href: "/app/mentor", label: "Cogni AI", icon: MessageCircle },
  { href: "/app/profile", label: "Profile", icon: User },
];

export default function Sidebar({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (href) => {
    if (href === "/app/dashboard") {
      return pathname === "/app/dashboard";
    }
    return pathname.startsWith(href);
  };

  if (!user) return null;

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
              <p className="text-zinc-400 text-sm">{user.credits} credits</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center ${
                  sidebarOpen ? "gap-3" : "justify-center"
                } px-4 py-3 rounded-lg mb-2 transition-colors ${
                  active
                    ? "bg-zinc-800 text-teal-400 font-medium"
                    : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50"
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={logout}
            className={`flex items-center ${
              sidebarOpen ? "gap-3" : "justify-center"
            } px-4 py-3 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/50 w-full transition-colors`}
            title="Logout"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {/* Toggle Button - positioned in main content area */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-6 left-6 z-40 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-50 hover:bg-zinc-800 transition-colors"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>

        {children}
      </main>
    </div>
  );
}
