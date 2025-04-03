'use client'

import { useState, useEffect, useCallback } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Input } from "../../components/ui/input"
import { Card, CardContent } from "../../components/ui/card"
import { Bookmark, Film, Tv } from 'lucide-react'
import Image from 'next/image'
import { useDebounce } from 'use-debounce'
import { getToken } from '../common/jwtToken'
import { axiosInstance } from '../common/axios'
import { useSession } from '@clerk/nextjs'

export function SearchInput() {
  const [contentType, setContentType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500) // 500ms debounce
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { session } = useSession();

  const searchMedia = useCallback(async (query) => {
    if (!query) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    try {
      const token = await getToken(session);
      const response = await axiosInstance.get(`search`, {
        params: {
          title: query,
          type: contentType === 'all' ? undefined : contentType
        },
        headers: {
          Authorization: token
        }
      })
      setSearchResults(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType]) // Add contentType as dependency

  useEffect(() => {
    searchMedia(debouncedSearchTerm)
  }, [debouncedSearchTerm, searchMedia]) // Remove contentType from here since it's already in searchMedia's deps

  const addEntry = async (item) => {
    const token = await getToken(session);
    axiosInstance.post("/add-entry", {
      imdb_id: item.imdb_id,
      rating: 0,
      status: "planned",
      comment: "",
    }, {
      headers: {
        Authorization: token
      }
    }).then(() => {
      const newSearchResult = searchResults.map((key) => {
        if (key.imdb_id == item.imdb_id) {
          return { ...key, added: 1 }
        }
        return key;
      })
      setSearchResults(newSearchResult);
    }).catch((error) => {
      console.error(error);
    })
  }

  return (
    <div className="w-full max-w-md mb-8 relative">
      <div className="flex mb-2 gap-2">
        <Input
          type="text"
          placeholder="Search for a movie or TV show"
          className="flex-grow bg-gray-800 text-white border-gray-700"
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
            <SelectItem value="tv" className="hover:bg-gray-700">TV Show</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {searchTerm && (
        <Card className="absolute z-10 w-full bg-gray-800 border-gray-700 mt-1 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-gray-400">Searching...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((item) => (
                <div
                  key={item.imdb_id}
                  className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 flex items-center"
                >
                  {item.poster_path && (
                    <div className="relative h-12 w-8 flex-shrink-0 mr-3">
                      <Image
                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                        alt={`${item.title} poster`}
                        fill
                        className="object-cover rounded"
                        sizes="50px"
                      />
                    </div>
                  )}

                  <div className="flex-grow min-w-0">
                    <div className="font-medium truncate">{item.title}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <span>{item.type === 'movie' ? <Film size={12} /> : <Tv size={12} />}</span>
                      <span>{item.release_date?.split('-')[0] || 'N/A'}</span>
                    </div>
                  </div>

                  <Bookmark
                    size={18}
                    className="ml-2 text-gray-400 hover:text-yellow-400 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      addEntry(item)
                    }}
                    fill={Object.keys(item).includes("added") ? "white" : ""}
                  />
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-400">
                {searchTerm ? "No results found" : "Start typing to search"}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}