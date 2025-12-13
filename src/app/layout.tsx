import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { Sidebar } from "@/components/Sidebar";
import { Player } from "@/components/Player";
import { PlayerProvider } from "@/lib/player-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SoundChain - Decentralized Music Streaming",
  description: "Stream music, support artists directly with crypto payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#121212] text-white`}
      >
        <PlayerProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 pb-[90px] overflow-x-hidden transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
              {children}
            </main>
            <Player />
          </div>
        </PlayerProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}