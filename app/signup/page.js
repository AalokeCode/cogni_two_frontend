"use client";
import { useRef, useState } from "react";
import { Eye, EyeClosed, Check } from "lucide-react";
import Image from "next/image";
import Button from "@/components/elements/button";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef(null);
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!formRef.current.terms.checked) {
      toast.error("You must agree to the Terms of Service and Privacy Policy.");
      return;
    } else {
      if (
        !formRef.current.displayName.value ||
        !formRef.current.email.value ||
        !formRef.current.password.value
      ) {
        toast.error("Please fill in all fields.");
        return;
      }
      const data = {
        displayName: formRef.current.displayName.value,
        email: formRef.current.email.value,
        password: formRef.current.password.value,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        toast.success("Sign up successful! Redirecting to sign in...");
        setTimeout(() => {
          window.location.href = "/signin";
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(`Sign up failed: ${errorData.message}`);
      }
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
          Create Account
        </h1>
        <p className="mb-6 text-center text-sm text-gray-400">
          Join cogni to enhance your study experience
        </p>
        <form className="flex flex-col mb-4" ref={formRef}>
          <label className="mb-1.5 text-sm text-gray-300">
            What do we call you?
          </label>
          <input
            type="text"
            name="displayName"
            placeholder="Eg. John Doe"
            className="bg-[#1E1E1E] w-full p-2.5 border border-[#343434] rounded-lg mb-4 text-white placeholder-neutral-500 transition-all duration-200 ease-in-out hover:border-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 text-sm"
          />
          <label className="mb-1.5 text-sm text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            className="bg-[#1E1E1E] w-full p-2.5 border border-[#343434] rounded-lg mb-4 text-white placeholder-neutral-500 transition-all duration-200 ease-in-out hover:border-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 text-sm"
          />
          <label className="mb-1.5 text-sm text-gray-300">Password</label>
          <div className="relative flex items-center mb-4">
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
          <div className="flex items-center gap-2 mb-4">
            <label className="relative inline-block h-4 w-4">
              <input
                type="checkbox"
                name="terms"
                className="peer appearance-none h-full w-full rounded border-2 border-[#343434] checked:bg-white checked:hover:bg-white bg-[#1E1E1E] hover:border-[#4A4A4A] hover:bg-[#252525] focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#131313] transition-all duration-200 ease-in-out cursor-pointer"
              />
              <Check
                className="absolute inset-0 m-auto h-3 w-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none"
                strokeWidth={3}
              />
            </label>
            <label className="text-xs text-gray-400">
              I agree to the{" "}
              <Link
                href="terms-of-service"
                className="underline text-white hover:text-gray-300 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="privacy-policy"
                className="underline text-white hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          <div className="text-[#131313] flex mb-4">
            <Button
              backgroundColor="white"
              textColor="[#131313]"
              isFullWidth="true"
              clickHandler={handleSignUp}
            >
              Sign Up
            </Button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-400">
          Already a User?{" "}
          <Link
            className="underline text-white hover:text-gray-300 transition-colors"
            href="signin"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
