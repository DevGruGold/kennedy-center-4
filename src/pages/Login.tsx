import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event); // Add this for debugging
      
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: "Welcome back!",
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
      if (event === 'USER_UPDATED' && !session) {
        toast({
          variant: "destructive",
          title: "Email Verification Required",
          description: "Please check your email and verify your account.",
        });
      }
      if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password Reset",
          description: "Check your email for the password reset link.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                <p className="font-semibold mb-2">Test Mode Enabled</p>
                <p>Email verification is disabled for testing.</p>
                <p>1. Click "Sign Up" to create a new account</p>
                <p>2. Or use any valid email format and password (min 6 chars)</p>
              </div>
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#404040',
                        brandAccent: '#2d2d2d'
                      }
                    }
                  }
                }}
                theme="light"
                providers={[]}
                redirectTo={window.location.origin}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: 'Email',
                      password_label: 'Password',
                      button_label: 'Sign In',
                      loading_button_label: 'Signing in...',
                      social_provider_text: 'Sign in with {{provider}}',
                      link_text: "Don't have an account? Sign up",
                    },
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;