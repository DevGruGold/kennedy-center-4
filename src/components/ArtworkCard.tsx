import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ArtworkCardProps {
  title: string;
  artist: string;
  imageUrl: string;
  status?: string;
}

export const ArtworkCard = ({ title, artist, imageUrl, status }: ArtworkCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fadeIn">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-heading text-lg font-semibold text-primary">{title}</h3>
        <p className="text-sm text-gray-600">by {artist}</p>
        {status && (
          <span className="inline-block px-2 py-1 mt-2 text-xs font-medium rounded-full bg-secondary/20 text-secondary">
            {status}
          </span>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};