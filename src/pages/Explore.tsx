import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Palette, 
  Shield, 
  DollarSign, 
  Users, 
  Award,
  ArrowRight
} from "lucide-react";

const Explore = () => {
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

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="text-center">
          <Button 
            size="lg"
            className="bg-primary text-white"
            onClick={() => window.location.href = '/submit'}
          >
            Start Creating <ArrowRight className="ml-2" />
          </Button>
        </section>
      </main>
    </div>
  );
};

export default Explore;