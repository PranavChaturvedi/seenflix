import Link from 'next/link'
import React from 'react'

export function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">SeenFlix</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link href="/get-started" className="hover:text-gray-300">Get Started</Link></li>
            <li>{/* TODO: Add Clerk UserButton here */}</li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

