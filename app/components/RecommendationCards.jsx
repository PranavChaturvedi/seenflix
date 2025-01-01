import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"


const recommendations = [
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
]

export function RecommendationCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {recommendations.map((item, index) => (
        <Card key={index} className="bg-purple-600">
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.type} - {item.year}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>A brief description of the {item.type.toLowerCase()} could go here.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Add to Watched</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

