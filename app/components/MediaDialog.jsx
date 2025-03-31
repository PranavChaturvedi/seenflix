"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import Image from "next/image"
import Link from "next/link";
import { SiImdb } from "react-icons/si";

export function MediaDialog({ item, open, onOpenChange, type }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Required accessible title (hidden visually) */}
        <DialogHeader className="sr-only">
          <DialogTitle>{item?.title || 'Media'} Details</DialogTitle>
        </DialogHeader>

        {/* Backdrop image (only if exists) */}
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

        {/* Main content area (always visible) */}
        <div className="p-6">
          {item && (
            <>
              <div className="flex items-center w-full">
                <h2 className="text-3xl font-bold mr-5">{item.title}</h2>
                <Link href={`http://imdb.com/title/${item.imdb_id}`} target="_blank">
                  <SiImdb size={40}/>
                </Link>
              </div>
              <div className="text-lg text-muted-foreground mt-2">
                {item.type === 'movie' ? 'Movie' : 'TV Show'} • {item.release_date} • {item.original_language.toUpperCase()}
              </div>

              <div className="mt-6 space-y-6">
                {/* Poster image (if exists) */}
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

                {/* Genres */}
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

                {/* Overview */}
                {item.overview && (
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Overview</h3>
                    <p className="text-muted-foreground">{item.overview}</p>
                  </div>
                )}

                {/* Metadata */}
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
  )
}