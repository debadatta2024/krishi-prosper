import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sprout, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface CropSuggestion {
  crop: string;
  score: number;
  yieldEstimate: string;
  profitEstimate: string;
  reasoning: string;
}

const CropRecommendation = () => {
  const [soilType, setSoilType] = useState('');
  const [region, setRegion] = useState('');
  const [season, setSeason] = useState('');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<CropSuggestion[]>([]);

  const mockRecommendations: Record<string, CropSuggestion[]> = {
    'loamy-punjab-kharif': [
      {
        crop: 'Rice (Basmati)',
        score: 95,
        yieldEstimate: '40-45 quintals/hectare',
        profitEstimate: '₹60,000-80,000/hectare',
        reasoning: 'Excellent water availability and suitable temperature. Basmati commands premium prices in Punjab markets.'
      },
      {
        crop: 'Cotton',
        score: 88,
        yieldEstimate: '25-30 quintals/hectare',
        profitEstimate: '₹50,000-70,000/hectare',
        reasoning: 'High demand in textile industry. Good resistance to pests in this region during Kharif season.'
      }
    ],
    'default': [
      {
        crop: 'Wheat',
        score: 92,
        yieldEstimate: '35-40 quintals/hectare',
        profitEstimate: '₹45,000-60,000/hectare',
        reasoning: 'Suitable for your soil type and climate. High market demand with stable prices.'
      },
      {
        crop: 'Maize',
        score: 85,
        yieldEstimate: '30-35 quintals/hectare',
        profitEstimate: '₹40,000-55,000/hectare',
        reasoning: 'Good adaptability to various soil conditions. Growing demand for animal feed and food industry.'
      },
      {
        crop: 'Soybeans',
        score: 80,
        yieldEstimate: '20-25 quintals/hectare',
        profitEstimate: '₹35,000-50,000/hectare',
        reasoning: 'Nitrogen-fixing crop that improves soil health. Strong export market opportunities.'
      }
    ]
  };

  const handleSuggestCrops = () => {
    if (!soilType || !region || !season || !area) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const key = `${soilType}-${region}-${season}`;
      const recommendations = mockRecommendations[key] || mockRecommendations['default'];
      setSuggestions(recommendations);
      setLoading(false);
      toast.success('Crop recommendations generated!');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Sprout className="w-6 h-6 text-primary" />
          Crop Recommendation System
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Soil Type</Label>
            <Select value={soilType} onValueChange={setSoilType}>
              <SelectTrigger>
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loamy">Loamy</SelectItem>
                <SelectItem value="clay">Clay</SelectItem>
                <SelectItem value="sandy">Sandy</SelectItem>
                <SelectItem value="silt">Silt</SelectItem>
                <SelectItem value="black">Black</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="punjab">Punjab</SelectItem>
                <SelectItem value="haryana">Haryana</SelectItem>
                <SelectItem value="up">Uttar Pradesh</SelectItem>
                <SelectItem value="mp">Madhya Pradesh</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Season</Label>
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger>
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                <SelectItem value="zaid">Zaid (Summer)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Area (Hectares)</Label>
            <Input
              type="number"
              placeholder="Enter area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={handleSuggestCrops} disabled={loading} className="w-full">
          {loading ? 'Analyzing...' : 'Suggest Crops'}
        </Button>
      </Card>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Recommended Crops</h3>
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold">{suggestion.crop}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Score: {suggestion.score}/100
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-accent/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Expected Yield</p>
                  <p className="font-semibold">{suggestion.yieldEstimate}</p>
                </div>
                <div className="bg-secondary/20 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Profit Estimate</p>
                  <p className="font-semibold text-primary">{suggestion.profitEstimate}</p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">Why this crop?</p>
                <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropRecommendation;
