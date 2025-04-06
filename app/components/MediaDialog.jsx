"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { SiImdb } from "react-icons/si";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import { useSession } from "@clerk/nextjs";
import { getToken } from "../common/jwtToken";
import { axiosInstance } from "../common/axios";
import { DialogDescription } from "@radix-ui/react-dialog";

export function MediaDialog({ item, open, onOpenChange, type, setReload }) {
  const [rating, setRating] = useState(item?.rating ?? 0);
  const [comment, setComment] = useState(item?.comment ?? "");
  const [status, setStatus] = useState(item?.user_status ?? "planned");
  const { session } = useSession();

  const handleSave = () => {
    async function update() {
      const token = await getToken(session);
      axiosInstance
        .post(
          "/add-entry",
          {
            imdb_id: item.imdb_id,
            rating: rating,
            comment: comment,
            status: status,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then(() => {})
        .catch((error) => {
          console.error(error);
        });
    }
    update();
    onOpenChange(false);
    setReload((prev) => prev + 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogDescription></DialogDescription>
        <DialogHeader className="sr-only">
          <DialogTitle>{item?.title || "Media"} Details</DialogTitle>
        </DialogHeader>

        {item?.backdrop_path && (
          <div className="relative aspect-video">
            <Image
              src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
              alt={`${item.title} backdrop`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          </div>
        )}

        <div className="p-6">
          {item && (
            <>
              <div className="flex items-center w-full">
                <h2 className="text-3xl font-bold mr-5">{item.title}</h2>
                <Link
                  href={`http://imdb.com/title/${item.imdb_id}`}
                  target="_blank"
                >
                  <SiImdb size={40} />
                </Link>
              </div>
              <div className="text-lg text-muted-foreground mt-2">
                {item.type === "movie" ? "Movie" : "TV Show"} •{" "}
                {item.release_date} • {item.original_language.toUpperCase()}
              </div>

              <div className="mt-6 space-y-6">
                {item.poster_path && (
                  <div className="relative w-48 h-72 rounded-lg overflow-hidden border">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={`${item.title} poster`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {item.genre?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.genre.map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {item.overview && (
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Overview</h3>
                    <p className="text-muted-foreground">{item.overview}</p>
                  </div>
                )}

                {/* Review Section - Only shown when type is "watch" */}
                {type === "watch" && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-xl font-semibold">Your Review</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Rating (0-10)
                        </label>
                        <Input
                          type="text"
                          value={rating}
                          onChange={(e) =>
                            setRating(parseInt(e.target.value) || 0)
                          }
                          className="w-24"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Status
                        </label>
                        <Select
                          value={status}
                          onValueChange={setStatus}
                          className="cursor:pointer"
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="watching">Watching</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="left">Left</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Comments
                      </label>
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          onOpenChange(false);
                          setRating(0);
                          setComment("");
                          setStatus("planned");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Status:</span> {item.status}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
