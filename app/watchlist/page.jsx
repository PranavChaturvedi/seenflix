"use client"
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Header } from "../components/Header";


const watchlist = [
    { title: "Inception", type: "Movie", year: 2010 },
    { title: "Breaking Bad", type: "TV Show", year: 2008 },
    { title: "The Shawshank Redemption", type: "Movie", year: 1994 },
    { title: "Game of Thrones", type: "TV Show", year: 2011 },
    { title: "Pulp Fiction", type: "Movie", year: 1994 },
    { title: "Stranger Things", type: "TV Show", year: 2016 },
    { title: "The Dark Knight", type: "Movie", year: 2008 },
    { title: "Friends", type: "TV Show", year: 1994 },
    { title: "Interstellar", type: "Movie", year: 2014 },
    { title: "The Mandalorian", type: "TV Show", year: 2019 },
];


export default function Watchlist() {
    return (
        <>
            <Header includeManage />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">Your Watchlist</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 mt-30">
                    {watchlist.map((item, index) => (
                        <Card key={index} className="bg-purple-600">
                            <CardHeader>
                                <CardTitle>{item.title}</CardTitle>
                                <CardDescription>{item.type} - {item.year}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>A brief description of the {item.type.toLowerCase()} could go here.</p>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    onClick={() => console.log('clicked')}
                                >
                                    Add to Watched
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
};