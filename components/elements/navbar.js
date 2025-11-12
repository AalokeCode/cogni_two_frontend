"use client";
import Image from "next/image";
import Button from "./button";
import Link from "next/link";
import { LogOut, LogIn } from "lucide-react";
import { useState } from "react";

export default function Navbar({ isLoggedIn }) {
  let navbarLinks = [
    { name: "home", url: "/" },
    { name: "features", url: "#features" },
    { name: "contact", url: "https://linkedin.com/aaloke_" },
    { name: "github", url: "https://github.com/AalokeCode/cogni.study" },
  ];
  let authorizedNavbarLinks = [
    { name: "dashboard", url: "/app/dashboard" },
    { name: "topiclists", url: "/app/topiclist" },
    { name: "profile", url: "/app/profile" },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full flex items-center justify-between md:justify-center gap-10 p-5 py-6 relative z-40">
      <Image
        src="/logo.png"
        alt="logo"
        width={160}
        height={40}
        className="logo"
      />

      <ul className="bottom-navbar hidden md:flex text-white gap-12 bg-[#1E1E1E] px-8 py-3 rounded-full">
        {(isLoggedIn ? authorizedNavbarLinks : navbarLinks).map((link) => (
          <Link
            key={link.name}
            href={link.url}
            className="hover:text-gray-300 transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </ul>

      <div className="hidden md:flex">
        {!isLoggedIn ? (
          <Button
            backgroundColor="white"
            textColor="[#131313]"
            isLink="true"
            url="signin"
          >
            Sign In / Sign Up <LogIn className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            backgroundColor="white"
            textColor="[#131313]"
            isLink="true"
            url="/signout"
          >
            Sign Out <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <button
          aria-label="Open menu"
          className="p-2 rounded focus:outline-none"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        {!isLoggedIn ? (
          <Button
            backgroundColor="white"
            textColor="[#131313]"
            isLink="true"
            url="signin"
          >
            <span className="hidden sm:inline">Sign In / Sign Up</span>
            <LogIn className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            backgroundColor="white"
            textColor="[#131313]"
            isLink="true"
            url="/signout"
          >
            <span className="hidden sm:inline">Sign Out</span>
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#1E1E1E] z-[100] flex flex-col items-center rounded-2xl border border-neutral-700 md:hidden transition-all duration-300">
          {(isLoggedIn ? authorizedNavbarLinks : navbarLinks).map((link) => (
            <Link
              key={link.name}
              href={link.url}
              className="text-white text-lg py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
