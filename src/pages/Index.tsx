import { Navigation } from "@/components/Navigation";
import { ArtworkCard } from "@/components/ArtworkCard";
import { Button } from "@/components/ui/button";

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
          <h1 className="font-heading text-5xl font-bold text-primary mb-4">
            Digital Art Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Submit your digital artwork, mint NFTs, and receive institutional funding support
            from the Kennedy Center.
          </p>
          <Button
            size="lg"
            className="bg-secondary text-primary hover:bg-secondary/90"
          >
            Start Creating
          </Button>
        </section>

        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-primary mb-8 text-center">
            Featured Artworks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArtworks.map((artwork, index) => (
              <ArtworkCard key={index} {...artwork} />
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 Kennedy Center Digital Art Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;