"use client";
import Link from "next/link";

export default function Button({
  variant = "primary",
  clickHandler = null,
  children,
  isLink = false,
  url = "#",
  isFullWidth = false,
  disabled = false,
}) {
  const variants = {
    primary:
      "bg-zinc-50 text-zinc-950 hover:bg-zinc-200 border border-zinc-200",
    secondary:
      "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 border border-zinc-700",
    outline:
      "bg-transparent text-zinc-50 hover:bg-zinc-900 border border-zinc-700",
    accent:
      "bg-cyan-500 text-zinc-950 hover:bg-cyan-400 border border-cyan-400",
    danger:
      "bg-pink-500 text-zinc-950 hover:bg-pink-400 border border-pink-400",
  };

  const baseClass = `px-5 py-2.5 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
    isFullWidth ? "w-full" : ""
  } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"} ${
    variants[variant] || variants.primary
  }`;

  return isLink ? (
    <Link href={url} className={baseClass}>
      {children}
    </Link>
  ) : (
    <button onClick={clickHandler} disabled={disabled} className={baseClass}>
      {children}
    </button>
  );
}
