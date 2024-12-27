import { Card, CardContent } from "@/components/ui/card";
import { Music, Image, Video, Bot, Award, ArrowRight } from "lucide-react";

export const NFTCreationGuide = () => {
  const artTypes = [
    {
      icon: Music,
      title: "Music",
      description: "Upload your original songs, beats, or compositions. Each track becomes a unique digital asset."
    },
    {
      icon: Image,
      title: "Photography",
      description: "Share your photographs and digital art. Each piece gets its own certificate of authenticity."
    },
    {
      icon: Video,
      title: "Videos",
      description: "From short films to animations, make your video content truly unique and verifiable."
    },
    {
      icon: Bot,
      title: "AI Creations",
      description: "Turn your AI-generated art into certified digital assets with clear ownership records."
    }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-6">Create Your Digital Legacy</h2>
      <p className="text-lg text-center text-gray-600 mb-8">
        Transform your creative work into authenticated digital assets with our NFT platform
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {artTypes.map((type, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <type.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
              <p className="text-gray-600">{type.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border-none">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-6">
            <Award className="w-16 h-16 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-center mb-4">
            Your NFT: A Digital Certificate of Authenticity
          </h3>
          <div className="space-y-4 max-w-2xl mx-auto text-center">
            <p className="text-gray-600">
              Think of an NFT as a digital certificate of authenticity for your artwork. 
              When you upload your creation, we generate a unique token that:
            </p>
            <ul className="space-y-3 text-left list-none">
              {[
                "Proves you're the original creator",
                "Records the artwork's creation date and history",
                "Enables secure transfer of ownership when sold",
                "Ensures you receive royalties from future sales",
                "Creates a permanent link between you and your work"
              ].map((point, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};