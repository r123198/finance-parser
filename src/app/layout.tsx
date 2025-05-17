import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { VT323 } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });
const vt323 = VT323({ weight: "400", subsets: ["latin"], variable: '--font-vt323' });

export const metadata: Metadata = {
  title: "Statement Analyzer",
  description: "Analyze your financial statements with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={vt323.variable}>
      <body className={`${inter.className} font-mono bg-black`}>
        <nav
          className={`bg-transparent border-4 border-cyan-400 drop-shadow-lg retro-nav`}
          style={{
            borderBottom: '4px solid #00fff7',
            boxShadow: '0 4px 0 #ff00c8',
          }}
        >
          <div className="container mx-auto px-4">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-3">
                <span className="text-3xl" role="img" aria-label="floppy">💾</span>
                <Link href="/" className="text-3xl font-bold text-cyan-400 tracking-widest retro-title">
                  Statement Analyzer
                </Link>
              </div>
              <div className="hidden sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-3 pt-1 text-lg font-bold text-pink-500 hover:text-yellow-400 retro-link"
                >
                  Dashboard
                </Link>
                <Link
                  href="/upload"
                  className="inline-flex items-center px-3 pt-1 text-lg font-bold text-green-400 hover:text-yellow-400 retro-link"
                >
                  Upload
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
