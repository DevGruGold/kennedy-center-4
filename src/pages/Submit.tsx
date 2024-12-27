import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SubmissionSuccessDialog } from "@/components/SubmissionSuccessDialog";

const Submit = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
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

      // Create artwork record anonymously
      const { data: artwork, error: artworkError } = await supabase
        .from('artworks')
        .insert({
          title: formData.title,
          description: formData.description,
          image_url: publicUrl,
        })
        .select()
        .single();

      if (artworkError) throw artworkError;

      // Mint token for the artwork
      const { data: token, error: tokenError } = await supabase.functions.invoke('mint-token', {
        body: { artworkId: artwork.id }
      });

      if (tokenError) throw tokenError;

      // Show success dialog
      setShowSuccessDialog(true);

      toast({
        title: "Success!",
        description: "Your artwork has been submitted anonymously. Keep your smart contract receipt safe to prove ownership later!",
      });
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
          description: "Save your artwork and smart contract receipt to prove your ownership later!",
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
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4 text-center">
            Submit Your Artwork
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Submit your artwork anonymously. You'll receive a smart contract receipt that you can use later to verify your ownership.
          </p>
          
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
              {isLoading ? "Submitting..." : "Submit Artwork Anonymously"}
            </Button>
          </form>
        </div>
      </main>

      <SubmissionSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        imageUrl={uploadedImageUrl}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default Submit;