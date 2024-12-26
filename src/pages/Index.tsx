import { Navigation } from "@/components/Navigation";
import { ArtworkCard } from "@/components/ArtworkCard";
import { HistoricalCharacters } from "@/components/HistoricalCharacters";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Artwork {
  id: string;
  title: string;
  image_url: string;
  creator_id: string;
  profile: {
    display_name: string | null;
  } | null;
}

const Index = () => {
  const { data: artworks } = useQuery({
    queryKey: ['artworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select(`
          id,
          title,
          image_url,
          creator_id,
          profile:profiles!creator_id(display_name)
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Artwork[];
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4">
        {/* Header Section */}
        <section className="py-12 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4 animate-fade-in">
            Kennedy Center Digital Arts
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 animate-fade-in">
            Experience groundbreaking AI technology bringing history to life through interactive conversations with legendary figures.
          </p>
        </section>

        <section className="mb-16">
          <HistoricalCharacters />
        </section>

        <section className="py-16 bg-white rounded-lg shadow-sm mb-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-primary mb-4">
                In Partnership with the Smithsonian
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A groundbreaking collaboration between the Kennedy Center and the Smithsonian Institution,
                bringing together arts and innovation.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-8 text-center">
            Featured Digital Artworks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {artworks && artworks.length > 0 ? (
              artworks.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  title={artwork.title}
                  artist={artwork.profile?.display_name || "Anonymous"}
                  imageUrl={artwork.image_url}
                />
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">No artworks submitted yet</p>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm md:text-base">© 2024 Kennedy Center Digital Art Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;