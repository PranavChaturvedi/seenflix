'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Input } from "../../components/ui/input"
import { Card, CardContent } from "../../components/ui/card"

const allItems = [
  { title: "Inception", type: "Movie" },
  { title: "Breaking Bad", type: "TV Show" },
  { title: "The Shawshank Redemption", type: "Movie" },
  { title: "Game of Thrones", type: "TV Show" },
  { title: "Pulp Fiction", type: "Movie" },
  { title: "Stranger Things", type: "TV Show" },
  { title: "The Dark Knight", type: "Movie" },
  { title: "Friends", type: "TV Show" },
  { title: "Interstellar", type: "Movie" },
  { title: "The Mandalorian", type: "TV Show" },
]

export function SearchInput() {
  const [contentType, setContentType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    const results = allItems.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (contentType === 'all' || item.type.toLowerCase() === contentType)
    )
    setSearchResults(results)
  }, [searchTerm, contentType])

  return (
    <div className="w-full max-w-md mb-8 relative">
      <div className="flex mb-2">
        <Input 
          type="text" 
          placeholder="Search for a movie or TV show" 
          className="flex-grow mr-2 bg-gray-800 text-white border-gray-700" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={contentType} onValueChange={setContentType}>
          <SelectTrigger className="w-[180px] bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Content Type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="all" className="hover:bg-gray-700">All</SelectItem>
            <SelectItem value="movie" className="hover:bg-gray-700">Movie</SelectItem>
            <SelectItem value="tv show" className="hover:bg-gray-700">TV Show</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {searchTerm && (
        <Card className="absolute z-10 w-full bg-gray-800 border-gray-700 mt-1">
          <CardContent className="p-2">
            {searchResults.map((item, index) => (
              <div key={index} className="p-2 hover:bg-gray-700 cursor-pointer">
                {item.title} - {item.type}
              </div>
            ))}
            {searchResults.length === 0 && (
              <div className="p-2 text-gray-400">No results found</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

