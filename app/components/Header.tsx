"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export function Header({ includeManage = false }: { includeManage?: boolean }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-[var(--surface-blur)] bg-[var(--surface)] border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link
          href="/"
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent1)] to-[var(--accent2)]"
        >
          SeenFlix
        </Link>
        <SignedIn>
          <nav className="flex items-center gap-4">
            <Link href="/" className="hover:text-[var(--accent1)] transition">
              Home
            </Link>
            {!includeManage && (
              <Link
                href="/watchlist"
                className="hover:text-[var(--accent1)] transition"
              >
                Watchlist
              </Link>
            )}
            {includeManage && (
              <Link
                href="/manage"
                className="hover:text-[var(--accent1)] transition"
              >
                Manage
              </Link>
            )}
            <UserButton />
          </nav>
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
}
