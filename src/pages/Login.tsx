import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { generateWithGemini } from "@/utils/textGeneration/geminiService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError } from "@supabase/supabase-js";
import type { AuthChangeEvent } from "@supabase/supabase-js";

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
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
      // Handle other auth events
      if (event === 'USER_DELETED' || event === 'TOKEN_REFRESHED') {
        console.log('Auth event occurred:', event);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error("Google sign in error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        console.log("Google sign in initiated:", data);
      }
    } catch (err) {
      console.error("Unexpected error during sign in:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

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
                <p className="text-gray-600">Sign in to continue</p>
              </div>
              <Button 
                className="w-full flex items-center justify-center space-x-2"
                onClick={handleGoogleSignIn}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;