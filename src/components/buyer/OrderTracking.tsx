import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, CheckCircle, Truck, MapPin, Clock } from 'lucide-react';

interface Order {
  id: string;
  items: any[];
  total: number;
  status: 'Processing' | 'Dispatched' | 'In Transit' | 'Delivered';
  date: string;
}

const OrderTracking = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-500/10 text-yellow-700';
      case 'Dispatched': return 'bg-blue-500/10 text-blue-700';
      case 'In Transit': return 'bg-purple-500/10 text-purple-700';
      case 'Delivered': return 'bg-green-500/10 text-green-700';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing': return <Clock className="w-5 h-5" />;
      case 'Dispatched': return <Package className="w-5 h-5" />;
      case 'In Transit': return <Truck className="w-5 h-5" />;
      case 'Delivered': return <CheckCircle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const advanceStatus = (orderId: string) => {
    const statusFlow = ['Processing', 'Dispatched', 'In Transit', 'Delivered'];
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.map((order) => {
        if (order.id === orderId) {
          const currentIndex = statusFlow.indexOf(order.status);
          const nextStatus = statusFlow[Math.min(currentIndex + 1, statusFlow.length - 1)];
          return { ...order, status: nextStatus as Order['status'] };
        }
        return order;
      });
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });
  };

  const getEstimatedDelivery = (status: string) => {
    const daysMap = {
      'Processing': '3-4 days',
      'Dispatched': '2-3 days',
      'In Transit': '1-2 days',
      'Delivered': 'Delivered'
    };
    return daysMap[status as keyof typeof daysMap];
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-primary" />
          Order Tracking
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-1">Order {order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-2">{order.status}</span>
                  </Badge>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.cropName} ({item.quantity} {item.unit})</span>
                        <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-sm">Estimated Delivery</span>
                    </div>
                    <span className="text-sm font-semibold">{getEstimatedDelivery(order.status)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    {['Processing', 'Dispatched', 'In Transit', 'Delivered'].map((step, index) => (
                      <div key={step} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            ['Processing', 'Dispatched', 'In Transit', 'Delivered'].indexOf(order.status) >= index
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="text-xs mt-1 text-center">{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="relative h-2 bg-muted rounded-full">
                    <div
                      className="absolute h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${(['Processing', 'Dispatched', 'In Transit', 'Delivered'].indexOf(order.status) / 3) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* Demo: Advance Status Button */}
                {order.status !== 'Delivered' && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => advanceStatus(order.id)}
                  >
                    Advance Status (Demo)
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default OrderTracking;
