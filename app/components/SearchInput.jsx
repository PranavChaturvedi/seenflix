"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Bookmark, Film, Tv, X } from "lucide-react";
import Image from "next/image";
import { useDebounce } from "use-debounce";
import { getToken } from "../common/jwtToken";
import { axiosInstance } from "../common/axios";
import { RedirectToSignIn, useSession } from "@clerk/nextjs";
import { MediaDialog } from "./MediaDialog";

export function SearchInput() {
  const [contentType, setContentType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const { session } = useSession();

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  const searchMedia = useCallback(
    async (query) => {
      if (!query) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const token = await getToken(session);
        const response = await axiosInstance.get(`search`, {
          params: {
            title: query,
            type: contentType === "all" ? undefined : contentType,
          },
          headers: {
            Authorization: token,
          },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    searchMedia(debouncedSearchTerm);
  }, [debouncedSearchTerm, searchMedia]);

  const addEntry = async (item) => {
    const token = await getToken(session);
    if (!token) {
      setRedirect(true);
      return;
    }
    axiosInstance
      .post(
        "/add-entry",
        JSON.stringify({
          imdb_id: item.imdb_id,
          rating: 0,
          status: "planned",
          comment: "",
        }),
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json;charset=utf-8"
          },
        }
      )
      .then(() => {
        const newSearchResult = searchResults.map((key) => {
          if (key.imdb_id == item.imdb_id) {
            return { ...key, added: 1 };
          }
          return key;
        });
        setSearchResults(newSearchResult);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (redirect) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="w-[800px] mb-8 relative">
      <div className="flex mb-2 gap-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search for a movie or TV show"
            className="w-full bg-gray-800 text-white border-gray-700 pr-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            onClick={(e) => {
              if (e.target.value?.length > 0) setSearchTerm(e.target.value);
            }}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Select value={contentType} onValueChange={setContentType}>
          <SelectTrigger className="w-[180px] bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Content Type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="all" className="hover:bg-gray-700">
              All
            </SelectItem>
            <SelectItem value="movie" className="hover:bg-gray-700">
              Movie
            </SelectItem>
            <SelectItem value="tv" className="hover:bg-gray-700">
              TV Show
            </SelectItem>
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
                  onClick={() => {
                    setSelectedItem(item);
                    setDialogOpen(true);
                  }}
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
                      <span>
                        {item.type === "movie" ? (
                          <Film size={12} />
                        ) : (
                          <Tv size={12} />
                        )}
                      </span>
                      <span>{item.release_date?.split("-")[0] || "N/A"}</span>
                    </div>
                  </div>

                  <Bookmark
                    size={18}
                    className="ml-2 text-gray-400 hover:text-yellow-400 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      addEntry(item);
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
      <MediaDialog 
        item={selectedItem}
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(false);
            setSelectedItem(null);
          }
        }}
        type="recs"
      />
    </div>
  );
}
