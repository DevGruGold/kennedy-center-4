import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ArtworkCardProps {
  title: string;
  artist: string;
  imageUrl: string;
  status?: string;
  id?: string;
  onTokenize?: (artworkId: string) => void;
  showTokenize?: boolean;
}

export const ArtworkCard = ({ 
  title, 
  artist, 
  imageUrl, 
  status, 
  id,
  onTokenize,
  showTokenize = false 
}: ArtworkCardProps) => {
  const { toast } = useToast();

  const handleTokenize = async () => {
    if (!id) return;

    try {
      const { error } = await supabase.functions.invoke('mint-token', {
        body: { artworkId: id }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Artwork has been tokenized successfully.",
      });

      if (onTokenize) {
        onTokenize(id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to tokenize artwork",
        variant: "destructive",
      });
    }
  };

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
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Button variant="outline" className="w-full">
          View Details
        </Button>
        {showTokenize && !status && (
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={handleTokenize}
          >
            Tokenize Artwork
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};