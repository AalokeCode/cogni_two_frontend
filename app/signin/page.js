"use client";
import { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeClosed } from "lucide-react";
import Image from "next/image";
import Button from "@/components/elements/button";
import Link from "next/link";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/app/dashboard";
    }
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!formRef.current.email.value || !formRef.current.password.value) {
      toast.error("Please fill in all fields.");
      return;
    }
    const data = {
      email: formRef.current.email.value,
      password: formRef.current.password.value,
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (response.ok) {
      toast.success("Sign in successful! Redirecting to dashboard...");
      const responseData = await response.json();
      localStorage.setItem("token", responseData.token);
      setTimeout(() => {
        window.location.href = "/app/dashboard";
      }, 2000);
    }
  };
  return (
    <div className="relative bg-[#131313] flex items-center justify-center min-h-screen px-4 py-4 overflow-hidden">
      <Toaster />

      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#2A2A2A] rounded-2xl p-6 shadow-2xl">
        <Image
          src="/logo.png"
          alt="logo"
          width={160}
          height={37}
          className="logo mx-auto mb-4"
        />
        <h1 className="text-2xl sm:text-3xl font-semibold mb-1 text-center text-white">
          Welcome Back
        </h1>
        <p className="mb-6 text-center text-sm text-gray-400">
          Sign in to continue to cogni
        </p>
        <form className="flex flex-col mb-4" ref={formRef}>
          <label className="mb-1.5 text-sm text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            className="bg-[#1E1E1E] w-full p-2.5 border border-[#343434] rounded-lg mb-4 text-white placeholder-gray-500 transition-all duration-200 ease-in-out hover:border-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 text-sm"
          />
          <label className="mb-1.5 text-sm text-gray-300">Password</label>
          <div className="relative flex items-center mb-5">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="⋅⋅⋅⋅⋅⋅⋅"
              suggested="current-password"
              className="bg-[#1E1E1E] w-full p-2.5 pr-10 border border-[#343434] rounded-lg text-white placeholder-neutral-500 transition-all duration-200 ease-in-out hover:border-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 text-sm"
            />
            <span className="absolute right-3 cursor-pointer flex items-center h-full top-0">
              {showPassword ? (
                <EyeClosed onClick={() => setShowPassword(false)} />
              ) : (
                <Eye onClick={() => setShowPassword(true)} />
              )}
            </span>
          </div>
          <div className="text-[#131313] flex mb-4">
            <Button
              backgroundColor="white"
              textColor="[#131313]"
              isFullWidth="true"
              clickHandler={handleSignIn}
            >
              Sign In
            </Button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-400">
          New to cogni?{" "}
          <Link
            className="underline text-white hover:text-gray-300 transition-colors"
            href="signup"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
