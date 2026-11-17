import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Drops — des idées à portée de rue",
    template: "%s — Drops",
  },
  description: "Des mots, photos, recommandations et énigmes partagés autour de vous.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#contenu"
          className="sr-only z-50 rounded-md bg-white px-4 py-2 text-zinc-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Aller au contenu
        </a>
        <header className="border-b border-zinc-200 bg-white/90 dark:border-zinc-800 dark:bg-zinc-950/90">
          <nav
            aria-label="Navigation principale"
            className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
          >
            <Link
              href="/"
              className="rounded-sm text-lg font-bold tracking-tight text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 dark:text-white"
            >
              Drops<span className="text-blue-700">.</span>
            </Link>
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/drops"
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                Explorer
              </Link>
              <Link
                href="/status"
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                Statut
              </Link>
            </div>
          </nav>
        </header>
        <div id="contenu" className="flex flex-1 flex-col">
          {children}
        </div>
        <footer className="border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-zinc-500 sm:px-6 lg:px-8 dark:text-zinc-400">
            Drops — des découvertes partagées autour de vous.
          </div>
        </footer>
      </body>
    </html>
  );
}
