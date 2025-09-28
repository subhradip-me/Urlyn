import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { ChatProvider } from "@/contexts/ChatContext";

// Import dev utils for debugging in development
if (process.env.NODE_ENV === "development") {
  // Dynamic import to avoid including in production
  import("@/lib/dev-utils");
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Urlyn 2.0 - Multi-Persona Learning Platform",
  description: "A comprehensive platform for students, creators, and professionals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingProvider>
          <AuthProvider>
            <ChatProvider>
              {children}
            </ChatProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
