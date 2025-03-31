import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { axiosInstance } from "../common/axios"
import { Bookmark, Pencil } from "lucide-react"
import { getToken } from "../common/jwtToken"
import { useSession } from "@clerk/nextjs"
import { MediaDialog } from "../components/MediaDialog"

export default function CardView() {
    const [watchlist, setWatchlist] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [retry, setRetry] = useState(1);
    const { session } = useSession();


    const addEntry = async (item) => {
        const token = await getToken(session);
        axiosInstance.delete(`/delete-entry?imdb_id=${item.imdb_id}`, {
            headers: {
                Authorization: token
            }
        }).then(() => {
            setWatchlist((prev) => prev.filter((key) => key.imdb_id !== item.imdb_id));
        }).catch((error) => {
            console.error(error);
        })
    }


    useEffect(() => {
        async function getData() {
            const token = await getToken(session);
            axiosInstance.get('/sf-watchlist', {
                headers: {
                    Authorization: token
                }
            }).then((response) => {
                setWatchlist(response.data);
            }).catch((error) => {
                console.error(error);
            })
        };
        getData();
    }, [retry, session]);

    if (watchlist.length == 0) {
        return (
            <h4 className="text-2xl font-bold text-[#40e0d0] mb-8 text-center ml-5">Searching Watchlist...</h4>
        )
    }
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                {watchlist.map((item, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex justify-between items-center w-full">
                                    <span>{item.title}</span>
                                    <Pencil className="cursor-pointer" onClick={() => { setSelectedItem(item); setDialogOpen(true); }} />
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
                                setRetry(retry + 1);
                            }}
                                fill={"white"}
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
                type = "watch"
            }}
            />
        </div>
    )
};
