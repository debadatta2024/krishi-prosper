import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingBag, MapPin, Plus, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface Listing {
  id: string;
  cropName: string;
  quantity: number;
  price: number;
  unit: string;
  location: string;
  imageUrl: string;
}

const MarketplaceListing = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('quintal');
  const [location, setLocation] = useState('');

  const detectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          toast.success('Location detected!');
        },
        () => {
          toast.error('Could not detect location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation not supported. Please enter location manually.');
    }
  };

  const createListing = () => {
    if (!cropName || !quantity || !price || !location) {
      toast.error('Please fill all fields');
      return;
    }

    const newListing: Listing = {
      id: Date.now().toString(),
      cropName,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      unit,
      location,
      imageUrl: `https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop`
    };

    setListings([newListing, ...listings]);
    
    // Reset form
    setCropName('');
    setQuantity('');
    setPrice('');
    setLocation('');
    
    toast.success('Listing created successfully!');
  };

  const deleteListing = (id: string) => {
    setListings(listings.filter(l => l.id !== id));
    toast.success('Listing deleted');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-primary" />
          Create Marketplace Listing
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Crop Name</Label>
            <Select value={cropName} onValueChange={setCropName}>
              <SelectTrigger>
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wheat">Wheat</SelectItem>
                <SelectItem value="Rice">Rice</SelectItem>
                <SelectItem value="Cotton">Cotton</SelectItem>
                <SelectItem value="Maize">Maize</SelectItem>
                <SelectItem value="Soybeans">Soybeans</SelectItem>
                <SelectItem value="Tomatoes">Tomatoes</SelectItem>
                <SelectItem value="Potatoes">Potatoes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div>
            <Label>Price per {unit}</Label>
            <Input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <Label>Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quintal">Quintal</SelectItem>
                <SelectItem value="kg">Kilogram</SelectItem>
                <SelectItem value="ton">Ton</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label>Location</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter location or detect"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Button variant="outline" onClick={detectLocation}>
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button onClick={createListing} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Create Listing
        </Button>
      </Card>

      {listings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Your Listings</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {listings.map((listing) => (
              <Card key={listing.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <img
                    src={listing.imageUrl}
                    alt={listing.cropName}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-bold">{listing.cropName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {listing.quantity} {listing.unit}
                    </p>
                    <p className="text-lg font-semibold text-primary">
                      ₹{listing.price}/{listing.unit}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {listing.location}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteListing(listing.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceListing;
