"use client";
import Link from "next/link";

export default function Button({
  backgroundColor = "white",
  textColor = "black",
  clickHandler = null,
  children,
  isLink = false,
  url = "#",
  isFullWidth = false,
}) {
  let background = `bg-${backgroundColor}` || "bg-white";
  const borderClass =
    backgroundColor === "transparent" ? "border-2 border-white" : "";

  return isLink || isLink === "true" ? (
    <Link
      href={url}
      className={`${background} ${borderClass} text-${textColor} px-5 py-2.5 rounded-full cursor-pointer hover:scale-105 transition duration-300 flex items-center justify-center gap-3 ${
        isFullWidth ? "w-full" : ""
      }`}
    >
      {children}
    </Link>
  ) : (
    <button
      onClick={clickHandler}
      className={`${background} ${borderClass} text-${textColor} px-5 py-2.5 rounded-full cursor-pointer hover:scale-105 transition duration-300 flex items-center justify-center gap-3 ${
        isFullWidth ? "w-full" : ""
      }`}
    >
      {children}
    </button>
  );
}
