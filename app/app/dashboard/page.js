"use client";
import { useEffect } from "react";
import Image from "next/image";
import Button from "@/components/elements/button";

export default function Dashboard() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/signin";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="relative bg-[#131313] min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative text-center z-10 max-w-2xl">
        <Image
          src="/logo.png"
          alt="cogni logo"
          width={240}
          height={56}
          className="mx-auto mb-8"
        />
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Dashboard
        </h1>
        <p className="text-2xl md:text-3xl text-gray-400 mb-12 tracking-wide">
          Coming Soon
        </p>

        <div className="flex justify-center">
          <Button
            backgroundColor="white"
            textColor="[#131313]"
            clickHandler={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
