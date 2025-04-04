"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export function Header({ includeManage = false }: { includeManage?: boolean }) {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          SeenFlix
        </Link>
        <SignedIn>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="hover:text-gray-300">
                  Home
                </Link>
              </li>
              {!includeManage && (
                <li>
                  <Link href="/watchlist" className="hover:text-gray-300">
                    Watchlist
                  </Link>
                </li>
              )}
              {includeManage && (
                <li>
                  <Link href="/manage" className="hover:text-gray-300">
                    Manage
                  </Link>
                </li>
              )}
              <li>
                <UserButton />
              </li>
            </ul>
          </nav>
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
}
