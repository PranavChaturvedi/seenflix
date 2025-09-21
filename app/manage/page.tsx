import { SearchInput } from "../components/SearchInput";
import { RecommendationCards } from "../components/RecommendationCards";
import React from "react";
import { Header } from "../components/Header";
export default function GetStarted() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent1)] to-[var(--accent2)]">
          Manage Your Watchlist
        </h1>
        <div className="max-w-4xl mx-auto">
          <SearchInput />
        </div>
        <h4 className="text-2xl font-bold mt-12 mb-6">Recommendations</h4>
        <RecommendationCards />
      </div>
    </>
  );
}
