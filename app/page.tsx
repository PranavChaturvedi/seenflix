import Link from 'next/link'
import { Header } from './components/Header'
import React from 'react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-900">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-white mb-4">SeenFlix</h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            A platform to showcase the Movies and TV Shows you have watched.
            Get your tastes roasted by your peers!
          </p>
          <Link
            href="/manage"
            className="bg-purple-600 text-white font-bold py-2 px-6 rounded-full hover:bg-purple-700 transition duration-300 text-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  )
}

