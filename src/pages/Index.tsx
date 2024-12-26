import { Navigation } from "@/components/Navigation";
import { ArtworkCard } from "@/components/ArtworkCard";
import { HistoricalCharacters } from "@/components/HistoricalCharacters";

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