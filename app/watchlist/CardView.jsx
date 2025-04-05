import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { axiosInstance } from "../common/axios";
import { Image as ImageIcon, Bookmark, Pencil } from "lucide-react";
import { getToken } from "../common/jwtToken";
import { useSession } from "@clerk/nextjs";
import { MediaDialog } from "../components/MediaDialog";
import Image from "next/image";

export default function CardView() {
  const [watchlist, setWatchlist] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { session } = useSession();

  const deleteEntry = async (item) => {
    const token = await getToken(session);
    axiosInstance
      .delete(`/delete-entry?imdb_id=${item.imdb_id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then(() => {
        setWatchlist((prev) =>
          prev.filter((key) => key.imdb_id !== item.imdb_id)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    async function getData() {
      const token = await getToken(session);
      if (!token) {
        return;
      }
      axiosInstance
        .get("/sf-watchlist", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setWatchlist(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (!session) {
    return (
      <h4 className="text-2xl font-bold text-[#40e0d0] mb-8 text-center ml-5">
        Cannot Load data for an Unknown User
      </h4>
    );
  }
  if (watchlist.length == 0) {
    return (
      <h4 className="text-2xl font-bold text-[#40e0d0] mb-8 text-center ml-5">
        Searching Watchlist...
      </h4>
    );
  }
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {watchlist.map((item, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow h-full flex flex-col"
          >
            {/* Poster Image with Fallback */}
            <div className="relative aspect-[2/3] w-full max-h-48 overflow-hidden">
              {item.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
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
                    <Pencil
                      className="cursor-pointer flex-shrink-0 ml-2"
                      size={18}
                      onClick={() => {
                        setSelectedItem(item);
                        setDialogOpen(true);
                      }}
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
                  onClick={() => deleteEntry(item)}
                  fill={
                    item.user_status === "not_added"
                      ? "transparent"
                      : "currentColor"
                  }
                  size={18}
                />
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
      {selectedItem && (
        <MediaDialog
          open={dialogOpen}
          item={selectedItem}
          onOpenChange={(open) => {
            if (!open) {
              setDialogOpen(false);
              setSelectedItem(null);
            }
          }}
          type={"watch"}
        />
      )}
    </div>
  );
}
