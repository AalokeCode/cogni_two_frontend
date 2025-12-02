"use client";
import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Button from "./button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publicLinks = [
    { name: "Home", url: "/" },
    { name: "Features", url: "/#features" },
  ];

  const authorizedLinks = [
    { name: "Dashboard", url: "/app/dashboard" },
    { name: "Curricula", url: "/app/curricula" },
    { name: "Mentor", url: "/app/mentor" },
    { name: "Profile", url: "/app/profile" },
  ];

  const links = user ? authorizedLinks : publicLinks;

  return (
    <nav className="w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-zinc-50">
            cogni <span className="text-cyan-400">2.0</span>
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.url}
                  className="text-zinc-400 hover:text-zinc-50 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-zinc-400">
                  {user.credits} credits
                </span>
                <Button variant="outline" clickHandler={logout}>
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" isLink url="/signin">
                  Login
                </Button>
                <Button variant="accent" isLink url="/signup">
                  Sign Up
                </Button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-zinc-400 hover:text-zinc-50"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950">
          <div className="px-4 py-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                className="block text-zinc-400 hover:text-zinc-50 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              {user ? (
                <>
                  <div className="text-sm text-zinc-400">
                    {user.credits} credits
                  </div>
                  <Button variant="outline" clickHandler={logout} isFullWidth>
                    <LogOut size={16} />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" isLink url="/signin" isFullWidth>
                    Login
                  </Button>
                  <Button variant="accent" isLink url="/signup" isFullWidth>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
