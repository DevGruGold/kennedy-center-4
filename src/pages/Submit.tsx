import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Submit = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.image) {
        throw new Error("Please select an image");
      }

      // Upload image to storage
      const fileExt = formData.image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: imageData, error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(fileName, formData.image);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('artworks')
        .getPublicUrl(fileName);

      setUploadedImageUrl(publicUrl);

      // Check authentication status
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Show dialog for non-authenticated users
        setShowAuthDialog(true);
        return;
      }

      // If authenticated, proceed with artwork creation
      await createArtwork(publicUrl, session.user.id);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was a problem submitting your artwork.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createArtwork = async (imageUrl: string, userId: string) => {
    try {
      const { error: insertError } = await supabase
        .from('artworks')
        .insert({
          title: formData.title,
          description: formData.description,
          image_url: imageUrl,
          creator_id: userId,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: "Your artwork has been submitted successfully.",
      });
      
      navigate("/profile");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was a problem creating your artwork.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    if (uploadedImageUrl) {
      try {
        const response = await fetch(uploadedImageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = formData.title || 'artwork';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Download started",
          description: "Your artwork is being downloaded.",
        });
      } catch (error) {
        toast({
          title: "Download failed",
          description: "There was a problem downloading your artwork.",
          variant: "destructive",
        });
      }
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
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Artwork Image
              </label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Artwork"}
            </Button>
          </form>
        </div>
      </main>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your artwork is ready!</DialogTitle>
            <DialogDescription>
              Your artwork has been uploaded successfully. To mint it as an NFT and manage it in your collection, 
              you'll need to create an account. Alternatively, you can download your artwork directly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleDownload}>
              Download Artwork
            </Button>
            <Button onClick={() => navigate("/login")}>
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Submit;