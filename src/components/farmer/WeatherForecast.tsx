import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CloudRain, Cloud, Sun, Wind, Droplets, AlertTriangle } from 'lucide-react';

const WeatherForecast = () => {
  const [region, setRegion] = useState('punjab');
  const [weatherData, setWeatherData] = useState<any>(null);

  const mockWeatherData = {
    punjab: {
      current: {
        temp: 28,
        condition: 'Partly Cloudy',
        humidity: 65,
        wind: 12,
        rainfall: 20
      },
      forecast: [
        { day: 'Today', temp: 28, condition: 'Partly Cloudy', rainfall: 20, icon: 'cloud' },
        { day: 'Tomorrow', temp: 26, condition: 'Light Rain', rainfall: 60, icon: 'rain' },
        { day: 'Day 3', temp: 24, condition: 'Rain', rainfall: 80, icon: 'rain' },
        { day: 'Day 4', temp: 25, condition: 'Cloudy', rainfall: 40, icon: 'cloud' },
        { day: 'Day 5', temp: 27, condition: 'Sunny', rainfall: 10, icon: 'sun' },
        { day: 'Day 6', temp: 29, condition: 'Sunny', rainfall: 5, icon: 'sun' },
        { day: 'Day 7', temp: 30, condition: 'Hot & Sunny', rainfall: 0, icon: 'sun' }
      ],
      alerts: ['Heavy rainfall expected on Day 3. Take precautions for standing crops.'],
      precautions: [
        {
          condition: 'Heavy Rain',
          icon: 'rain',
          actions: [
            'Ensure proper drainage in fields to prevent waterlogging',
            'Harvest mature crops before rain if possible',
            'Cover stored grains and equipment',
            'Check irrigation channels for blockages'
          ]
        },
        {
          condition: 'High Temperature',
          icon: 'sun',
          actions: [
            'Increase irrigation frequency for crops',
            'Apply mulch to retain soil moisture',
            'Monitor for heat stress in plants',
            'Schedule farm work during cooler hours'
          ]
        },
        {
          condition: 'High Humidity',
          icon: 'cloud',
          actions: [
            'Watch for fungal diseases on crops',
            'Ensure good air circulation in storage areas',
            'Apply preventive fungicides if necessary',
            'Delay irrigation if soil is already moist'
          ]
        }
      ]
    }
  };

  useEffect(() => {
    setWeatherData(mockWeatherData[region as keyof typeof mockWeatherData] || mockWeatherData.punjab);
  }, [region]);

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloud': return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rain': return <CloudRain className="w-8 h-8 text-blue-500" />;
      default: return <Sun className="w-8 h-8" />;
    }
  };

  if (!weatherData) return null;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CloudRain className="w-6 h-6 text-primary" />
          Weather Forecast
        </h2>

        <div className="mb-6">
          <Label>Select Region</Label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="punjab">Punjab</SelectItem>
              <SelectItem value="haryana">Haryana</SelectItem>
              <SelectItem value="up">Uttar Pradesh</SelectItem>
            </SelectContent>
          </Select>
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
          <Card className="p-4 mb-6 bg-destructive/10 border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Weather Alert</h4>
                {weatherData.alerts.map((alert: string, index: number) => (
                  <p key={index} className="text-sm">{alert}</p>
                ))}
              </div>
            </div>
          </Card>
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
                <span>{day.rainfall}%</span>
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
