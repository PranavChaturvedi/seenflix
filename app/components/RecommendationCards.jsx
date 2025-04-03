"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { axiosInstance } from "../common/axios"
import { Image as ImageIcon, Bookmark, Expand } from "lucide-react"
import { getToken } from "../common/jwtToken"
import { MediaDialog } from "./MediaDialog"
import { useSession } from "@clerk/nextjs"
import Image from "next/image"

export function RecommendationCards() {
  const [recommendations, setRecommnedation] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { session } = useSession();


  const addEntry = async (item) => {
    const token = await getToken(session);
    axiosInstance.post('/add-entry', {
      imdb_id: item.imdb_id,
      rating: 0,
      status: "planned",
      comment: "",
    }, {
      headers: {
        Authorization: token
      }
    }).then(() => {
      setRecommnedation((prev) => prev.map((key) => {
        if (key.imdb_id == item.imdb_id) {
          return { ...key, user_status: "added" }
        }
        return key;
      }))
    }).catch((error) => {
      console.error(error);
    })
  }


  useEffect(() => {
    async function getData() {
      const token = await getToken(session);
      axiosInstance.get('/recommendations', {
        headers: {
          Authorization: token
        }
      }).then((response) => {
        setRecommnedation(response.data);
      }).catch((error) => {
        console.error(error);
      })
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (recommendations.length == 0) {
    return (
      <h4 className="text-2xl font-bold text-[#40e0d0] mb-8 text-center ml-5">Searching Recommendations...</h4>
    )
  }
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {recommendations.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow h-full flex flex-col">
            {/* Poster Image with Fallback */}
            <div className="relative aspect-[2/3] w-full max-h-48 overflow-hidden">
              {item.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}  // Using w300 for smaller size
                  alt={`${item.title} poster`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <div className="text-center p-4 text-muted-foreground">
                    <ImageIcon className="mx-auto h-8 w-8" />
                    <span className="text-xs mt-2">NO POSTER</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="flex flex-col flex-grow p-4">
              <CardHeader className="p-0 pb-2">
                <CardTitle>
                  <div className="flex justify-between items-center w-full">
                    <span className="line-clamp-1 text-base">{item.title}</span>
                    <Expand
                      className="cursor-pointer flex-shrink-0 ml-2"
                      size={18}
                      onClick={() => { setSelectedItem(item); setDialogOpen(true); }}
                    />
                  </div>
                </CardTitle>
                <CardDescription className="text-xs">
                  {item.type} • {item.release_date}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 flex-grow">
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {item.overview}
                </p>
              </CardContent>

              <CardFooter className="p-0 pt-3 justify-end">
                <Bookmark
                  className="cursor-pointer hover:text-primary"
                  onClick={() => addEntry(item)}
                  fill={item.user_status === "not_added" ? "transparent" : "currentColor"}
                  size={18}
                />
              </CardFooter>
            </div>
          </Card>

        ))}
      </div>
      <MediaDialog open={dialogOpen} item={selectedItem} onOpenChange={(open) => {
        if (!open) {
          setDialogOpen(false)
          setSelectedItem(null)
        }
      }}
        type="recs"
      />
    </div>
  )
}

