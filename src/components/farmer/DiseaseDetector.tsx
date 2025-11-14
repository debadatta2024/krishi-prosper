import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Upload, Camera, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DetectionResult {
  disease: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  treatments: string[];
}

const DiseaseDetector = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockResults: DetectionResult[] = [
    {
      disease: 'Leaf Blight',
      confidence: 92,
      severity: 'high',
      treatments: [
        'Remove and destroy infected plant parts immediately',
        'Apply copper-based fungicide (Copper Oxychloride 50% WP @ 3g/liter)',
        'Improve air circulation by proper spacing',
        'Avoid overhead irrigation',
        'Apply organic neem oil spray as preventive measure'
      ]
    },
    {
      disease: 'Healthy',
      confidence: 95,
      severity: 'low',
      treatments: [
        'Continue regular monitoring',
        'Maintain proper watering schedule',
        'Ensure adequate nutrition',
        'Keep area weed-free'
      ]
    }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetect = () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }

    setDetecting(true);
    
    // Simulate API call
    setTimeout(() => {
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(randomResult);
      setDetecting(false);
      toast.success('Disease detection complete!');
    }, 1500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-orange-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          Plant Disease Detector
        </h2>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            {selectedImage ? (
              <div className="space-y-4">
                <img src={selectedImage} alt="Uploaded" className="max-h-64 mx-auto rounded-lg" />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Change Image
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center gap-4">
                  <Upload className="w-12 h-12 text-muted-foreground" />
                  <Camera className="w-12 h-12 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Drag and drop an image or click to upload
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  Choose Image
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <Button 
            onClick={handleDetect} 
            disabled={!selectedImage || detecting}
            className="w-full"
          >
            {detecting ? 'Detecting...' : 'Detect Disease'}
          </Button>
        </div>
      </Card>

      {result && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            {result.disease === 'Healthy' ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-destructive" />
            )}
            <div>
              <h3 className="text-2xl font-bold">{result.disease}</h3>
              <div className="flex items-center gap-4 text-sm">
                <span>Confidence: {result.confidence}%</span>
                <span className={getSeverityColor(result.severity)}>
                  Severity: {result.severity.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              Recommended Treatment Steps:
            </h4>
            <ol className="space-y-2">
              {result.treatments.map((treatment, index) => (
                <li key={index} className="flex gap-3">
                  <span className="font-semibold text-primary">{index + 1}.</span>
                  <span>{treatment}</span>
                </li>
              ))}
            </ol>
          </div>

          {result.disease !== 'Healthy' && (
            <div className="mt-4">
              <Button variant="secondary" className="w-full">
                Buy Recommended Pesticides from Marketplace
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default DiseaseDetector;
