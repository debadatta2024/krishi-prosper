import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Download, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const ProfitCalculator = () => {
  const [crop, setCrop] = useState('');
  const [area, setArea] = useState('');
  const [seedCost, setSeedCost] = useState('');
  const [fertilizerCost, setFertilizerCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [expectedYield, setExpectedYield] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateProfit = () => {
    if (!crop || !area || !seedCost || !fertilizerCost || !laborCost || !expectedYield || !sellingPrice) {
      toast.error('Please fill all fields');
      return;
    }

    const areaNum = parseFloat(area);
    const totalCost = (parseFloat(seedCost) + parseFloat(fertilizerCost) + parseFloat(laborCost)) * areaNum;
    const totalYield = parseFloat(expectedYield) * areaNum;
    const revenue = totalYield * parseFloat(sellingPrice);
    const profit = revenue - totalCost;
    const roi = (profit / totalCost) * 100;
    const breakEven = totalCost / parseFloat(sellingPrice);

    setResult({
      totalCost: totalCost.toFixed(2),
      revenue: revenue.toFixed(2),
      profit: profit.toFixed(2),
      roi: roi.toFixed(2),
      breakEven: breakEven.toFixed(2),
      totalYield: totalYield.toFixed(2)
    });

    toast.success('Profit calculation complete!');
  };

  const exportToCSV = () => {
    if (!result) return;

    const csv = `Profit Calculator Results
Crop,${crop}
Area (hectares),${area}
Seed Cost (per hectare),${seedCost}
Fertilizer Cost (per hectare),${fertilizerCost}
Labor Cost (per hectare),${laborCost}
Expected Yield (quintals/hectare),${expectedYield}
Selling Price (per quintal),${sellingPrice}

Results
Total Cost,${result.totalCost}
Total Revenue,${result.revenue}
Net Profit,${result.profit}
ROI (%),${result.roi}
Break-even Quantity (quintals),${result.breakEven}
Total Expected Yield (quintals),${result.totalYield}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profit-calculation-${crop}-${Date.now()}.csv`;
    a.click();
    toast.success('Report exported successfully!');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" />
          Profit Calculator
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Crop Name</Label>
            <Select value={crop} onValueChange={setCrop}>
              <SelectTrigger>
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="cotton">Cotton</SelectItem>
                <SelectItem value="maize">Maize</SelectItem>
                <SelectItem value="soybeans">Soybeans</SelectItem>
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

          <div>
            <Label>Seed Cost (₹/hectare)</Label>
            <Input
              type="number"
              placeholder="Enter seed cost"
              value={seedCost}
              onChange={(e) => setSeedCost(e.target.value)}
            />
          </div>

          <div>
            <Label>Fertilizer Cost (₹/hectare)</Label>
            <Input
              type="number"
              placeholder="Enter fertilizer cost"
              value={fertilizerCost}
              onChange={(e) => setFertilizerCost(e.target.value)}
            />
          </div>

          <div>
            <Label>Labor Cost (₹/hectare)</Label>
            <Input
              type="number"
              placeholder="Enter labor cost"
              value={laborCost}
              onChange={(e) => setLaborCost(e.target.value)}
            />
          </div>

          <div>
            <Label>Expected Yield (quintals/hectare)</Label>
            <Input
              type="number"
              placeholder="Enter expected yield"
              value={expectedYield}
              onChange={(e) => setExpectedYield(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label>Selling Price (₹/quintal)</Label>
            <Input
              type="number"
              placeholder="Enter selling price"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculateProfit} className="w-full">
          Calculate Profit
        </Button>
      </Card>

      {result && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Calculation Results</h3>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold">₹{result.totalCost}</p>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">₹{result.revenue}</p>
            </div>

            <div className={`p-4 rounded-lg ${parseFloat(result.profit) > 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <p className={`text-2xl font-bold ${parseFloat(result.profit) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{result.profit}
              </p>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Return on Investment</p>
              <p className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {result.roi}%
              </p>
            </div>

            <div className="bg-secondary/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Break-even Quantity</p>
              <p className="text-2xl font-bold">{result.breakEven} quintals</p>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Yield</p>
              <p className="text-2xl font-bold">{result.totalYield} quintals</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Summary</h4>
            <p className="text-sm">
              {parseFloat(result.profit) > 0 
                ? `Profitable venture! With an ROI of ${result.roi}%, you'll recover your investment and make a profit of ₹${result.profit}.`
                : `Loss warning: This combination may result in a loss of ₹${Math.abs(parseFloat(result.profit))}. Consider reducing costs or increasing selling price.`
              }
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProfitCalculator;
