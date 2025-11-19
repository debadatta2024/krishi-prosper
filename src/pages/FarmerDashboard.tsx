import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import CropRecommendation from '@/components/farmer/CropRecommendation';
import DiseaseDetector from '@/components/farmer/DiseaseDetector';
import PricePrediction from '@/components/farmer/PricePrediction';
import WeatherForecast from '@/components/farmer/WeatherForecast';
import ProfitCalculator from '@/components/farmer/ProfitCalculator';
import MarketplaceListing from '@/components/farmer/MarketplaceListing';
import VoiceAssistant from '@/components/VoiceAssistant';
import { useAuth } from '@/hooks/useAuth';
import { Sprout, Activity, TrendingUp, CloudRain, Calculator, ShoppingBag, LogOut } from 'lucide-react';

const FarmerDashboard = () => {
  const { isLoading, signOut } = useAuth("farmer");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Krishi AI - Farmer Dashboard</h1>
            <div className="flex items-center gap-2">
              <VoiceAssistant userType="farmer" />
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="crops" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="crops" className="flex items-center gap-2">
              <Sprout className="w-4 h-4" />
              <span className="hidden sm:inline">Crops</span>
            </TabsTrigger>
            <TabsTrigger value="disease" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Disease</span>
            </TabsTrigger>
            <TabsTrigger value="price" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Price</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <CloudRain className="w-4 h-4" />
              <span className="hidden sm:inline">Weather</span>
            </TabsTrigger>
            <TabsTrigger value="profit" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Profit</span>
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Sell</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crops">
            <CropRecommendation />
          </TabsContent>

          <TabsContent value="disease">
            <DiseaseDetector />
          </TabsContent>

          <TabsContent value="price">
            <PricePrediction />
          </TabsContent>

          <TabsContent value="weather">
            <WeatherForecast />
          </TabsContent>

          <TabsContent value="profit">
            <ProfitCalculator />
          </TabsContent>

          <TabsContent value="marketplace">
            <MarketplaceListing />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FarmerDashboard;
