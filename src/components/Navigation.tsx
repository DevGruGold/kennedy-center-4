import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const Navigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 
            onClick={() => navigate("/")}
            className="font-heading text-2xl font-bold text-primary cursor-pointer"
          >
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
          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/profile")}
                className="text-primary hover:text-primary/80"
              >
                Profile
              </Button>
              <Button
                variant="default"
                onClick={handleLogout}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              onClick={() => navigate("/login")}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};