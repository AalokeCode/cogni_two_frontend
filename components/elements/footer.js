import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-zinc-400 text-sm">
            © 2024 cogni 2.0. Built by{" "}
            <Link
              href="https://aaloke.com"
              target="_blank"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Aaloke Eppalapalli
            </Link>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="https://github.com/AalokeCode"
              target="_blank"
              className="text-zinc-400 hover:text-zinc-50 transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://linkedin.com/in/aaloke"
              target="_blank"
              className="text-zinc-400 hover:text-zinc-50 transition-colors"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
