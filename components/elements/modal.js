"use client";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl w-full ${
          sizes[size] || sizes.md
        } max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-50">{title}</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
