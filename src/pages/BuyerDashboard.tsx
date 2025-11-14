import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Marketplace from '@/components/buyer/Marketplace';
import Cart from '@/components/buyer/Cart';
import OrderTracking from '@/components/buyer/OrderTracking';
import PriceTrends from '@/components/buyer/PriceTrends';
import { ShoppingCart, Package, TrendingUp, Store } from 'lucide-react';
import { CartProvider } from '@/contexts/CartContext';

const BuyerDashboard = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-primary">Krishi AI - Buyer Dashboard</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="marketplace" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              <TabsTrigger value="marketplace" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                <span className="hidden sm:inline">Marketplace</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Trends</span>
              </TabsTrigger>
              <TabsTrigger value="cart" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="marketplace">
              <Marketplace />
            </TabsContent>

            <TabsContent value="trends">
              <PriceTrends />
            </TabsContent>

            <TabsContent value="cart">
              <Cart />
            </TabsContent>

            <TabsContent value="orders">
              <OrderTracking />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </CartProvider>
  );
};

export default BuyerDashboard;
