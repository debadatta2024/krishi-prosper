import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CloudRain, Cloud, Sun, Wind, Droplets, AlertTriangle, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const WeatherForecast = () => {
  const [region, setRegion] = useState('Punjab');
  const [customLocation, setCustomLocation] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWeatherData(region);
  }, []);

  const fetchWeatherData = async (location: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { location }
      });

      if (error) throw error;

      setWeatherData(data);
      toast({
        title: "Weather data updated",
        description: `Showing weather for ${location}`,
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      toast({
        title: "Error fetching weather",
        description: "Failed to load weather data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChange = (value: string) => {
    setRegion(value);
    setCustomLocation('');
    fetchWeatherData(value);
  };

  const handleCustomSearch = () => {
    if (customLocation.trim()) {
      fetchWeatherData(customLocation);
      setRegion('custom');
    }
  };

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloud': return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rain': return <CloudRain className="w-8 h-8 text-blue-500" />;
      default: return <Sun className="w-8 h-8" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading weather data...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No weather data available</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CloudRain className="w-6 h-6 text-primary" />
          Weather Forecast
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Select Region</Label>
            <Select value={region} onValueChange={handleRegionChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Punjab">Punjab</SelectItem>
                <SelectItem value="Haryana">Haryana</SelectItem>
                <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Or Enter Custom Location</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter city name"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCustomSearch()}
              />
              <Button onClick={handleCustomSearch} size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Current Weather */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary/10 to-secondary/10">
          <h3 className="text-xl font-bold mb-4">Current Conditions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Sun className="w-12 h-12 mx-auto mb-2 text-yellow-500" />
              <p className="text-3xl font-bold">{weatherData.current.temp}°C</p>
              <p className="text-sm text-muted-foreground">{weatherData.current.condition}</p>
            </div>
            <div className="text-center">
              <Droplets className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{weatherData.current.humidity}%</p>
              <p className="text-sm text-muted-foreground">Humidity</p>
            </div>
            <div className="text-center">
              <Wind className="w-8 h-8 mx-auto mb-2 text-gray-500" />
              <p className="text-2xl font-bold">{weatherData.current.wind} km/h</p>
              <p className="text-sm text-muted-foreground">Wind Speed</p>
            </div>
            <div className="text-center">
              <CloudRain className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{weatherData.current.rainfall}%</p>
              <p className="text-sm text-muted-foreground">Rain Chance</p>
            </div>
          </div>
        </Card>

        {/* Alerts */}
        {weatherData.alerts && weatherData.alerts.length > 0 && (
          <div className="space-y-3 mb-6">
            {weatherData.alerts.map((alert: string, index: number) => {
              const isPositive = alert.includes('✅');
              const isWarning = alert.includes('⚠️');
              
              return (
                <Card 
                  key={index} 
                  className={`p-4 ${
                    isPositive 
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900' 
                      : isWarning
                      ? 'bg-destructive/10 border-destructive/20'
                      : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isPositive ? (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    ) : isWarning ? (
                      <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
                    ) : (
                      <CloudRain className="w-6 h-6 text-blue-500 flex-shrink-0" />
                    )}
                    <div>
                      <h4 className="font-semibold mb-1">
                        {isPositive ? 'Good News' : isWarning ? 'Weather Alert' : 'Weather Update'}
                      </h4>
                      <p className="text-sm">{alert.replace(/[⚠️✅]/g, '').trim()}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* 7-Day Forecast */}
        <h3 className="text-xl font-bold mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {weatherData.forecast.map((day: any, index: number) => (
            <Card key={index} className="p-4 text-center hover:shadow-lg transition-shadow">
              <p className="font-semibold mb-2">{day.day}</p>
              {getWeatherIcon(day.icon)}
              <p className="text-2xl font-bold my-2">{day.temp}°C</p>
              <p className="text-xs text-muted-foreground mb-1">{day.condition}</p>
              <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                <Droplets className="w-3 h-3" />
                <span>{Math.round(day.rainfall)}%</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Farming Precautions */}
        {weatherData.precautions && (
          <>
            <h3 className="text-xl font-bold mt-8 mb-4">Recommended Precautions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {weatherData.precautions.map((precaution: any, index: number) => (
                <Card key={index} className="p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    {getWeatherIcon(precaution.icon)}
                    <h4 className="font-semibold text-lg">{precaution.condition}</h4>
                  </div>
                  <ul className="space-y-2">
                    {precaution.actions.map((action: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default WeatherForecast;
