import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { generateWithGemini } from "@/utils/textGeneration/geminiService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AuthError } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginTip, setLoginTip] = useState<string>("");
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  useEffect(() => {
    // Get a helpful login tip from Gemini
    const getLoginTip = async () => {
      setIsLoadingTip(true);
      try {
        const tip = await generateWithGemini(
          "Give a very short, one-sentence friendly tip about secure login practices. Keep it casual and encouraging, max 100 characters."
        );
        setLoginTip(tip);
      } catch (error) {
        console.error("Error getting login tip:", error);
      } finally {
        setIsLoadingTip(false);
      }
    };
    getLoginTip();
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      console.log("Session:", session);
      
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-4">
          {loginTip && (
            <Alert>
              <AlertDescription>
                {isLoadingTip ? "Getting a helpful tip..." : loginTip}
              </AlertDescription>
            </Alert>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">Please sign in to continue</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;