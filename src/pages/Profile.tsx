import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4" />
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">
              Artist Profile
            </h1>
            <p className="text-gray-600">Connect your wallet to view your profile</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="font-heading text-xl font-semibold">Submitted Artworks</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">No artworks submitted yet</p>
                <Button className="mt-4" variant="outline">
                  Submit New Artwork
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h2 className="font-heading text-xl font-semibold">Funding Status</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Connect wallet to view funding status</p>
                <Button className="mt-4" variant="outline">
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;