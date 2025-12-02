import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "cogni 2.0 - AI-powered curriculum platform",
  description:
    "Create personalized curricula, take AI-generated quizzes, and chat with your AI mentor.",
  icons: {
    icon: "/favicon.png",
  },
  authors: [
    {
      name: "Aaloke Eppalapalli",
      url: "https://aaloke.com",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-zinc-950 text-zinc-50`}
      >
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#27272a",
                color: "#fafafa",
                border: "1px solid #3f3f46",
              },
              success: {
                iconTheme: {
                  primary: "#22d3ee",
                  secondary: "#fafafa",
                },
              },
              error: {
                iconTheme: {
                  primary: "#f472b6",
                  secondary: "#fafafa",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
