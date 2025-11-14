import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

const PriceTrends = () => {
  const [selectedCrop, setSelectedCrop] = useState('wheat');

  const priceData: Record<string, any[]> = {
    wheat: [
      { month: 'Jul', price: 2100 },
      { month: 'Aug', price: 2150 },
      { month: 'Sep', price: 2200 },
      { month: 'Oct', price: 2180 },
      { month: 'Nov', price: 2250 },
      { month: 'Dec', price: 2300 },
      { month: 'Jan', price: 2280 },
      { month: 'Feb', price: 2350 },
      { month: 'Mar', price: 2400 },
      { month: 'Apr', price: 2420 },
      { month: 'May (P)', price: 2480, predicted: true },
      { month: 'Jun (P)', price: 2550, predicted: true }
    ],
    rice: [
      { month: 'Jul', price: 3100 },
      { month: 'Aug', price: 3150 },
      { month: 'Sep', price: 3200 },
      { month: 'Oct', price: 3180 },
      { month: 'Nov', price: 3250 },
      { month: 'Dec', price: 3300 },
      { month: 'Jan', price: 3280 },
      { month: 'Feb', price: 3350 },
      { month: 'Mar', price: 3400 },
      { month: 'Apr', price: 3420 },
      { month: 'May (P)', price: 3380, predicted: true },
      { month: 'Jun (P)', price: 3350, predicted: true }
    ],
    cotton: [
      { month: 'Jul', price: 5100 },
      { month: 'Aug', price: 5200 },
      { month: 'Sep', price: 5350 },
      { month: 'Oct', price: 5280 },
      { month: 'Nov', price: 5450 },
      { month: 'Dec', price: 5500 },
      { month: 'Jan', price: 5480 },
      { month: 'Feb', price: 5550 },
      { month: 'Mar', price: 5600 },
      { month: 'Apr', price: 5620 },
      { month: 'May (P)', price: 5700, predicted: true },
      { month: 'Jun (P)', price: 5800, predicted: true }
    ]
  };

  const data = priceData[selectedCrop];
  const currentPrice = data[9].price;
  const predictedPrice = data[11].price;
  const change = ((predictedPrice - currentPrice) / currentPrice * 100).toFixed(2);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Price Trends
        </h2>

        <div className="mb-6">
          <Label>Select Crop</Label>
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wheat">Wheat</SelectItem>
              <SelectItem value="rice">Rice (Basmati)</SelectItem>
              <SelectItem value="cotton">Cotton</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Current Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Current Price</p>
            <p className="text-2xl font-bold">₹{currentPrice}/quintal</p>
          </div>
          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Predicted (2 months)</p>
            <p className="text-2xl font-bold text-primary">₹{predictedPrice}/quintal</p>
          </div>
          <div className={`p-4 rounded-lg ${parseFloat(change) > 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
            <p className="text-sm text-muted-foreground">Expected Change</p>
            <p className={`text-2xl font-bold ${parseFloat(change) > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change}%
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Price (₹/quintal)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Market Insights */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Market Insights</h4>
          <p className="text-sm">
            {parseFloat(change) > 0 
              ? `${selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} prices have shown an upward trend over the past 90 days. The 2-month prediction suggests continued growth, making it a favorable time for bulk purchases before prices rise further.`
              : `${selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} prices are expected to stabilize or decline slightly. Consider strategic purchasing based on immediate needs.`
            }
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PriceTrends;
