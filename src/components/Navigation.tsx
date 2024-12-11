import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="font-heading text-2xl font-bold text-primary">
            Kennedy Center Digital Art
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/explore")}
            className="text-primary hover:text-primary/80"
          >
            Explore
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/submit")}
            className="text-primary hover:text-primary/80"
          >
            Submit Artwork
          </Button>
          <Button
            variant="default"
            onClick={() => navigate("/login")}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
};