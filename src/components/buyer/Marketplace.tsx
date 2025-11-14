import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, ShoppingCart, Search, Filter } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface Product {
  id: string;
  cropName: string;
  price: number;
  quantity: number;
  unit: string;
  farmerId: string;
  farmerName: string;
  location: string;
  distance: number;
  organic: boolean;
  verified: boolean;
  imageUrl: string;
}

const Marketplace = () => {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [cropFilter, setCropFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const mockProducts: Product[] = [
    {
      id: '1',
      cropName: 'Wheat',
      price: 2400,
      quantity: 100,
      unit: 'quintal',
      farmerId: 'f1',
      farmerName: 'Rajesh Kumar',
      location: 'Punjab',
      distance: 12,
      organic: false,
      verified: true,
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop'
    },
    {
      id: '2',
      cropName: 'Rice (Basmati)',
      price: 3500,
      quantity: 50,
      unit: 'quintal',
      farmerId: 'f2',
      farmerName: 'Suresh Patel',
      location: 'Haryana',
      distance: 25,
      organic: true,
      verified: true,
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop'
    },
    {
      id: '3',
      cropName: 'Tomatoes',
      price: 800,
      quantity: 200,
      unit: 'kg',
      farmerId: 'f3',
      farmerName: 'Amit Singh',
      location: 'Punjab',
      distance: 8,
      organic: true,
      verified: true,
      imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&auto=format&fit=crop'
    },
    {
      id: '4',
      cropName: 'Cotton',
      price: 5500,
      quantity: 75,
      unit: 'quintal',
      farmerId: 'f4',
      farmerName: 'Vijay Sharma',
      location: 'Maharashtra',
      distance: 150,
      organic: false,
      verified: true,
      imageUrl: 'https://images.unsplash.com/photo-1615485290024-3f2c0ce5eb46?w=400&auto=format&fit=crop'
    }
  ];

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = regionFilter === 'all' || product.location === regionFilter;
    const matchesCrop = cropFilter === 'all' || product.cropName.toLowerCase().includes(cropFilter.toLowerCase());
    
    return matchesSearch && matchesRegion && matchesCrop;
  });

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      cropName: product.cropName,
      price: product.price,
      quantity: 1,
      unit: product.unit,
      farmerId: product.farmerId,
      farmerName: product.farmerName
    });
    toast.success(`${product.cropName} added to cart!`);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Browse Marketplace</h2>
        
        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search crops or farmers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="Punjab">Punjab</SelectItem>
              <SelectItem value="Haryana">Haryana</SelectItem>
              <SelectItem value="Maharashtra">Maharashtra</SelectItem>
            </SelectContent>
          </Select>

          <Select value={cropFilter} onValueChange={setCropFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Crops" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              <SelectItem value="wheat">Wheat</SelectItem>
              <SelectItem value="rice">Rice</SelectItem>
              <SelectItem value="cotton">Cotton</SelectItem>
              <SelectItem value="tomatoes">Tomatoes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={product.imageUrl}
              alt={product.cropName}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold">{product.cropName}</h3>
                  <p className="text-sm text-muted-foreground">{product.farmerName}</p>
                </div>
                <div className="flex gap-1">
                  {product.verified && (
                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                  )}
                  {product.organic && (
                    <Badge variant="outline" className="text-xs">Organic</Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <MapPin className="w-3 h-3" />
                <span>{product.location} • {product.distance} km away</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-primary">₹{product.price}</p>
                  <p className="text-xs text-muted-foreground">per {product.unit}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.quantity} {product.unit} available
                </p>
              </div>

              <Button 
                onClick={() => handleAddToCart(product)}
                className="w-full"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
