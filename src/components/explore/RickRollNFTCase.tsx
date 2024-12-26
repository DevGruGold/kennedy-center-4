import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Shield, Share2 } from "lucide-react";

export const RickRollNFTCase = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "Direct Revenue",
      description: "Instead of just YouTube ad revenue, Rick could earn from direct NFT sales and ongoing royalties from secondary market trades."
    },
    {
      icon: TrendingUp,
      title: "Value Appreciation",
      description: "As one of the internet's most iconic memes, the original 'Never Gonna Give You Up' NFT could appreciate significantly in value."
    },
    {
      icon: Shield,
      title: "Authenticity",
      description: "NFT verification would establish the original video as a certified digital artifact, distinguishing it from countless copies."
    },
    {
      icon: Share2,
      title: "Community Engagement",
      description: "NFT holders could get exclusive access to Rick Astley content or virtual meet-and-greets."
    }
  ];

  return (
    <section className="mb-16 bg-secondary/10 p-8 rounded-xl">
      <h2 className="text-3xl font-bold text-center mb-6">The Rick Roll NFT Case Study</h2>
      <p className="text-lg text-center text-gray-600 mb-8">
        How NFTs could transform the iconic "Never Gonna Give You Up" meme into a valuable digital asset
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <benefit.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center text-gray-600">
        <p className="italic">
          "Never gonna give you up, never gonna let you down, never gonna run around and desert you... 
          but I might sell you as an NFT!" - Imaginary Rick Astley, 2024
        </p>
      </div>
    </section>
  );
};