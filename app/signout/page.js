"use client";
import { useEffect } from "react";
export default function SignOutPage() {
  useEffect(() => {
    localStorage.clear();
    window.location.href = "/";
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#131313] text-white">
      <h1>Sign Out</h1>
      <p>You have been signed out successfully.</p>
    </div>
  );
}
