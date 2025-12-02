"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/elements/button";
import Input from "@/components/elements/input";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function SignIn() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/10 rounded-full blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="w-full max-w-md relative z-10">
        <Image
          src="/logo.png"
          alt="cogni logo"
          width={160}
          height={40}
          className="mx-auto mb-8"
        />

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-zinc-50 mb-2">
              Welcome back
            </h1>
            <p className="text-zinc-400">Sign in to continue your learning</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-zinc-400 hover:text-zinc-50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button
              variant="primary"
              isFullWidth
              disabled={loading}
              clickHandler={handleSubmit}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-zinc-400 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
