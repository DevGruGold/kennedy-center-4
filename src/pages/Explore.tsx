import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Palette, 
  Shield, 
  DollarSign, 
  Users, 
  Award,
  ArrowRight,
  Heart,
  Rocket,
  ChartBar
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Explore = () => {
  const { toast } = useToast();
  const [isMinting, setIsMinting] = useState(false);
  const [mintProgress, setMintProgress] = useState(0);

  const simulateMinting = async () => {
    setIsMinting(true);
    setMintProgress(0);
    
    // Simulate minting process with progress updates
    for(let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMintProgress(i);
      
      // Show different status messages at different stages
      if(i === 20) {
        toast({
          title: "Preparing artwork data",
          description: "Validating digital signatures and metadata...",
        });
      } else if(i === 60) {
        toast({
          title: "Generating smart contract",
          description: "Creating unique token identifiers...",
        });
      }
    }
    
    toast({
      title: "Minting complete!",
      description: "Your artwork has been successfully minted on the blockchain.",
      variant: "success",
    });
    
    setIsMinting(false);
  };

  const features = [
    {
      icon: Shield,
      title: "Secure Art Preview",
      description: "Our innovative preview system protects artists while allowing collectors to experience the work."
    },
    {
      icon: Palette,
      title: "Digital Art Platform",
      description: "A dedicated space for digital artists to showcase and sell their work with institutional backing."
    },
    {
      icon: DollarSign,
      title: "Smart Pricing",
      description: "Set fair market values for your digital art with our pricing recommendations."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Connect with other artists, collectors, and art enthusiasts in our growing community."
    },
    {
      icon: Award,
      title: "Kennedy Center Backing",
      description: "Benefit from the prestige and support of the Kennedy Center institution."
    }
  ];

  const benefits = {
    artists: [
      {
        icon: Heart,
        title: "Institutional Recognition",
        description: "Get validated by one of the most prestigious art institutions in the world."
      },
      {
        icon: DollarSign,
        title: "Secure Revenue Stream",
        description: "Earn from primary sales and receive royalties from secondary market transactions."
      },
      {
        icon: Shield,
        title: "Copyright Protection",
        description: "Our platform ensures your intellectual property rights are protected."
      }
    ],
    kennedyCenter: [
      {
        icon: Rocket,
        title: "Digital Innovation",
        description: "Lead the transformation of traditional art institutions into the digital age."
      },
      {
        icon: Users,
        title: "Expanded Reach",
        description: "Connect with a new generation of artists and art enthusiasts globally."
      },
      {
        icon: ChartBar,
        title: "Sustainable Growth",
        description: "Generate new revenue streams while supporting digital artists."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Welcome to the Future of Digital Art
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover how our platform revolutionizes the way digital art is shared,
            protected, and traded.
          </p>
          <div className="aspect-video mb-8">
            <iframe
              className="w-full h-full rounded-xl shadow-lg"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Platform Introduction"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Artist Benefits */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center">For Artists</h3>
              <div className="space-y-4">
                {benefits.artists.map((benefit, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 flex items-start space-x-4">
                      <benefit.icon className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold">{benefit.title}</h4>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Kennedy Center Benefits */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center">For Kennedy Center</h3>
              <div className="space-y-4">
                {benefits.kennedyCenter.map((benefit, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 flex items-start space-x-4">
                      <benefit.icon className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold">{benefit.title}</h4>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Try Our Minting Process</h2>
          <p className="text-gray-600 mb-8">Experience how easy it is to mint your digital artwork on our platform</p>
          
          {isMinting ? (
            <div className="max-w-md mx-auto">
              <div className="h-2 bg-gray-200 rounded-full mb-4">
                <div 
                  className="h-2 bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${mintProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">Minting Progress: {mintProgress}%</p>
            </div>
          ) : (
            <Button 
              size="lg"
              className="bg-primary text-white"
              onClick={simulateMinting}
            >
              Simulate Minting <ArrowRight className="ml-2" />
            </Button>
          )}
        </section>
      </main>
    </div>
  );
};

export default Explore;