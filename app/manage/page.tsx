import { SearchInput } from '../components/SearchInput'
import { RecommendationCards } from '../components/RecommendationCards'
import { Header } from '../components/Header'
import React from 'react'

export default function GetStarted() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">Get Started with SeenFlix</h1>
        <div className="flex justify-center mb-8">
          <SearchInput />
        </div>
        <RecommendationCards />
      </div>
    </main>
  )
}

