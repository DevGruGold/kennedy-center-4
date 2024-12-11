import { Navigation } from "@/components/Navigation";
import { ArtworkCard } from "@/components/ArtworkCard";
import { Button } from "@/components/ui/button";
import { KennedyPreviewSystem } from "@/components/KennedyPreviewSystem";

const Index = () => {
  const featuredArtworks = [
    {
      title: "Digital Metamorphosis",
      artist: "Elena Rivera",
      imageUrl: "/placeholder.svg",
      status: "Featured",
    },
    {
      title: "Quantum Dreams",
      artist: "Marcus Chen",
      imageUrl: "/placeholder.svg",
      status: "New",
    },
    {
      title: "Virtual Horizons",
      artist: "Sarah Johnson",
      imageUrl: "/placeholder.svg",
      status: "Featured",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-16 animate-fadeIn">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 leading-tight">
            Digital Art Platform
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto px-4">
            Submit your digital artwork, mint NFTs, and receive institutional funding support
            from the Kennedy Center.
          </p>
          <div className="space-x-4">
            <Button
              size="lg"
              className="bg-secondary text-primary hover:bg-secondary/90"
              onClick={() => window.location.href = '/submit'}
            >
              Submit Artwork
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="hidden md:inline-block"
              onClick={() => window.location.href = '/about'}
            >
              Learn More
            </Button>
          </div>
        </section>

        <section className="mb-16">
          <KennedyPreviewSystem />
        </section>

        <section className="mb-16">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-8 text-center">
            Featured Artworks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredArtworks.map((artwork, index) => (
              <ArtworkCard key={index} {...artwork} />
            ))}
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