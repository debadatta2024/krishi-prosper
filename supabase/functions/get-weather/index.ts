import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location } = await req.json();
    const apiKey = Deno.env.get('OPENWEATHER_API_KEY');

    if (!apiKey) {
      throw new Error('Weather API key not configured');
    }

    console.log('Fetching weather for location:', location);

    // Fetch current weather
    const currentWeatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location},IN&units=metric&appid=${apiKey}`
    );

    if (!currentWeatherRes.ok) {
      throw new Error('Failed to fetch current weather data');
    }

    const currentWeather = await currentWeatherRes.json();

    // Fetch 7-day forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location},IN&units=metric&appid=${apiKey}`
    );

    if (!forecastRes.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const forecastData = await forecastRes.json();

    // Process current weather
    const current = {
      temp: Math.round(currentWeather.main.temp),
      condition: currentWeather.weather[0].main,
      humidity: currentWeather.main.humidity,
      wind: Math.round(currentWeather.wind.speed * 3.6), // Convert m/s to km/h
      rainfall: currentWeather.clouds.all // Cloud coverage as proxy for rain chance
    };

    // Process 7-day forecast (OpenWeather free tier gives 5 days in 3-hour intervals)
    const dailyForecasts: any[] = [];
    const processedDays = new Set<string>();
    
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!processedDays.has(dayKey) && dailyForecasts.length < 7) {
        processedDays.add(dayKey);
        
        const dayName = dailyForecasts.length === 0 ? 'Today' : 
                       dailyForecasts.length === 1 ? 'Tomorrow' : 
                       `Day ${dailyForecasts.length + 1}`;
        
        const weatherMain = item.weather[0].main.toLowerCase();
        let icon = 'sun';
        if (weatherMain.includes('rain')) icon = 'rain';
        else if (weatherMain.includes('cloud')) icon = 'cloud';
        
        dailyForecasts.push({
          day: dayName,
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main,
          rainfall: item.pop * 100, // Probability of precipitation
          icon: icon
        });
      }
    });

    // Generate alerts based on weather conditions
    const alerts = [];
    const avgRainfall = dailyForecasts.reduce((sum: number, day: any) => sum + day.rainfall, 0) / dailyForecasts.length;
    
    // Warning alerts
    if (dailyForecasts.some((day: any) => day.rainfall > 70)) {
      alerts.push('⚠️ Heavy rainfall expected in the coming days. Take precautions for standing crops.');
    }
    if (current.temp > 35) {
      alerts.push('⚠️ High temperature alert. Ensure adequate irrigation for crops.');
    }
    if (current.humidity > 80) {
      alerts.push('⚠️ High humidity levels. Monitor crops for fungal diseases.');
    }
    
    // Positive alerts when conditions are good
    if (avgRainfall < 20 && current.temp >= 20 && current.temp <= 32) {
      alerts.push('✅ Excellent weather conditions! Crops are safe with minimal rain chances and optimal temperatures.');
    } else if (avgRainfall < 30 && !alerts.some(a => a.includes('⚠️'))) {
      alerts.push('✅ Good weather ahead! Low rainfall expected - ideal for field activities and crop growth.');
    }
    
    if (current.temp >= 22 && current.temp <= 28 && current.humidity >= 40 && current.humidity <= 70) {
      alerts.push('✅ Perfect growing conditions with balanced temperature and humidity levels.');
    }

    // Generate precautions
    const precautions = [
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
    ];

    const weatherData = {
      current,
      forecast: dailyForecasts,
      alerts,
      precautions
    };

    console.log('Weather data processed successfully');

    return new Response(JSON.stringify(weatherData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-weather function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
