import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative flex flex-col items-center pb-5">
      <Image
        src="/logo.png"
        alt="logo"
        width={160}
        height={40}
        className="logo md:mt-20"
      />
      <div className="text-white text-center z-30 relative">
        <p>
          &copy; 2025 cogni.study. Made by{" "}
          <Link href="https://aaloke.com" className="underline">
            Aaloke Eppalapalli
          </Link>
        </p>
      </div>
    </footer>
  );
}
