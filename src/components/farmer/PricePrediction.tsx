import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

const PricePrediction = () => {
  const [crop, setCrop] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>(null);

  const mockPriceData = {
    wheat: [
      { date: 'Jan 1', price: 2200, predicted: null },
      { date: 'Jan 8', price: 2250, predicted: null },
      { date: 'Jan 15', price: 2180, predicted: null },
      { date: 'Jan 22', price: 2300, predicted: null },
      { date: 'Jan 29', price: 2350, predicted: null },
      { date: 'Feb 5', price: 2280, predicted: null },
      { date: 'Feb 12', price: 2400, predicted: null },
      { date: 'Today', price: 2420, predicted: 2420 },
      { date: 'Next 7d', price: null, predicted: 2480, low: 2430, high: 2530 },
      { date: 'Next 14d', price: null, predicted: 2550, low: 2480, high: 2620 }
    ],
    rice: [
      { date: 'Jan 1', price: 3200, predicted: null },
      { date: 'Jan 8', price: 3250, predicted: null },
      { date: 'Jan 15', price: 3180, predicted: null },
      { date: 'Jan 22', price: 3300, predicted: null },
      { date: 'Jan 29', price: 3350, predicted: null },
      { date: 'Feb 5', price: 3280, predicted: null },
      { date: 'Feb 12', price: 3400, predicted: null },
      { date: 'Today', price: 3420, predicted: 3420 },
      { date: 'Next 7d', price: null, predicted: 3380, low: 3330, high: 3430 },
      { date: 'Next 14d', price: null, predicted: 3350, low: 3280, high: 3420 }
    ]
  };

  const handlePredict = () => {
    if (!crop || !region) {
      toast.error('Please select crop and region');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const data = mockPriceData[crop as keyof typeof mockPriceData] || mockPriceData.wheat;
      setPriceData(data);
      
      const currentPrice = data[7].price;
      const predictedPrice = data[9].predicted;
      const change = ((predictedPrice - currentPrice) / currentPrice * 100).toFixed(2);
      
      setPrediction({
        current: currentPrice,
        predicted: predictedPrice,
        change: parseFloat(change),
        trend: parseFloat(change) > 0 ? 'up' : 'down'
      });
      
      setLoading(false);
      toast.success('Price prediction generated!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Price Prediction
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Select Crop</Label>
            <Select value={crop} onValueChange={setCrop}>
              <SelectTrigger>
                <SelectValue placeholder="Choose crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="rice">Rice (Basmati)</SelectItem>
                <SelectItem value="cotton">Cotton</SelectItem>
                <SelectItem value="maize">Maize</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Select Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Choose region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="punjab">Punjab</SelectItem>
                <SelectItem value="haryana">Haryana</SelectItem>
                <SelectItem value="up">Uttar Pradesh</SelectItem>
                <SelectItem value="mp">Madhya Pradesh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handlePredict} disabled={loading} className="w-full">
          {loading ? 'Analyzing...' : 'Predict Price'}
        </Button>
      </Card>

      {priceData.length > 0 && prediction && (
        <>
          <Card className="p-6">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-accent/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-2xl font-bold">₹{prediction.current}/quintal</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Predicted (14 days)</p>
                <p className="text-2xl font-bold text-primary">₹{prediction.predicted}/quintal</p>
              </div>
              <div className={`p-4 rounded-lg ${prediction.trend === 'up' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                <p className="text-sm text-muted-foreground">Expected Change</p>
                <p className={`text-2xl font-bold flex items-center gap-2 ${prediction.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {prediction.trend === 'up' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                  {Math.abs(prediction.change)}%
                </p>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="hsl(var(--secondary))" 
                    fill="hsl(var(--secondary))"
                    fillOpacity={0.2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Market Analysis:</strong> {prediction.trend === 'up' 
                  ? `Prices are expected to rise due to increased demand and favorable market conditions. Consider holding your harvest for better prices.`
                  : `Prices may decline due to excess supply. Consider selling sooner or exploring value-added products.`
                }
              </p>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default PricePrediction;
