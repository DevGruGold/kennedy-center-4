import { Navigation } from "@/components/Navigation";
import { ArtworkCard } from "@/components/ArtworkCard";
import { Button } from "@/components/ui/button";
import KennedyPreviewSystem from "@/components/KennedyPreviewSystem";
import { HistoricalCharacters } from "@/components/HistoricalCharacters";
import { Building, Handshake, Award } from "lucide-react";
import { KennedyChat } from "@/components/KennedyChat";

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
        <section className="relative py-20 mb-16">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              alt="AI Animation Technology"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
              Meet Historical Figures Through AI
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in">
              Experience groundbreaking AI animations powered by Google's Gemini model, bringing Kennedy Center's legendary figures to life.
            </p>
            <Button
              size="lg"
              className="bg-secondary text-primary hover:bg-secondary/90 animate-fade-in"
              onClick={() => {
                const element = document.getElementById('historical-characters');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Meet the Legends
            </Button>
          </div>
        </section>

        {/* Co-sponsorship Section */}
        <section className="py-16 bg-white mb-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
                In Partnership with the Smithsonian
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A groundbreaking collaboration between the Kennedy Center and the Smithsonian Institution,
                bringing together arts and innovation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <Building className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold mb-2">Cultural Heritage</h3>
                <p className="text-gray-600">
                  Preserving and celebrating America's artistic and cultural legacy
                </p>
              </div>
              
              <div className="text-center p-6">
                <Handshake className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold mb-2">Joint Innovation</h3>
                <p className="text-gray-600">
                  Combining expertise in arts and technology
                </p>
              </div>
              
              <div className="text-center p-6">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold mb-2">Excellence</h3>
                <p className="text-gray-600">
                  Setting new standards in digital art curation
                </p>
              </div>
            </div>
          </div>
        </section>

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

        <section id="historical-characters" className="mb-16">
          <HistoricalCharacters />
        </section>

        <section className="mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary text-center mb-8">
            Interactive Chat with President Kennedy
          </h2>
          <KennedyChat />
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
