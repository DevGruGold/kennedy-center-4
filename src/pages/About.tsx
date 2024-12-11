import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-8 text-center">
            About the Platform
          </h1>
          
          <div className="prose prose-lg mx-auto">
            <p className="text-gray-600 mb-6">
              The Kennedy Center Digital Art Platform is a groundbreaking initiative that bridges the gap between traditional arts institutions and the digital art world. We provide artists with the opportunity to showcase their digital creations, mint NFTs, and receive institutional funding support.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-heading text-xl font-semibold mb-4">For Artists</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>Submit digital artwork</li>
                  <li>Mint NFTs</li>
                  <li>Receive institutional funding</li>
                  <li>Join a prestigious community</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-heading text-xl font-semibold mb-4">Our Mission</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>Support digital artists</li>
                  <li>Advance digital art</li>
                  <li>Bridge traditional and digital art</li>
                  <li>Foster innovation</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center">
              <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90">
                Start Creating
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;