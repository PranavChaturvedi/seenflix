"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { axiosInstance } from "../common/axios"
import { Bookmark, Expand } from "lucide-react"
import { getToken } from "../common/jwtToken"
import { MediaDialog } from "./MediaDialog"
import { useSession } from "@clerk/nextjs"

export function RecommendationCards() {
  const [recommendations, setRecommnedation] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { session } = useSession();


  const addEntry = async (item) => {
    const token = await getToken(session);
    axiosInstance.post('/add-entry', {
      imdb_id: item.imdb_id,
      rating: 10,
      status: "planned",
      comment: "",
    }, {
      headers: {
        Authorization: token
      }
    }).then(() => {
      setRecommnedation((prev) => prev.map((key) => {
        if(key.imdb_id == item.imdb_id){
          return {...key, user_status : "added"}
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
          <Card key={index}>
            {/* <img src="">
          </img> */}
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between items-center w-full">
                  <span>{item.title}</span>
                  <Expand className="cursor-pointer" onClick={() => { setSelectedItem(item); setDialogOpen(true); }} />
                </div>
              </CardTitle>

              <CardDescription>{item.type} - {item.release_date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{item.overview.substring(0, 50)}...</p>
            </CardContent>
            <CardFooter>
              <Bookmark className="cursor-pointer" onClick={() => {
                addEntry(item);
              }}
                fill={item.user_status === "not_added" ? "" : "white"}
              />
            </CardFooter>
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

