import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const Submit = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    email: "",
    artworkUrl: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("https://formsubmit.co/joeyleepcs@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          ...formData,
          _subject: `New Artwork Submission: ${formData.title}`
        })
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your artwork has been submitted successfully."
        });
        setFormData({ title: "", description: "", email: "", artworkUrl: "" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your artwork.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-8 text-center">
            Submit Your Artwork
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Artwork Title
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label htmlFor="artworkUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Artwork URL
              </label>
              <Input
                id="artworkUrl"
                type="url"
                value={formData.artworkUrl}
                onChange={(e) => setFormData({ ...formData, artworkUrl: e.target.value })}
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              Submit Artwork
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Submit;