import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sprout, ShoppingCart, CloudRain, TrendingUp, Microscope, Calculator } from 'lucide-react';

const farmerImages = [
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1595429167661-ece35e8b93c3?w=1600&auto=format&fit=crop'
];

const Landing = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setTimeout(() => setShowOnboarding(true), 1000);
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % farmerImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const closeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const features = [
    {
      icon: Sprout,
      title: 'Smart Insights',
      description: 'AI-powered crop recommendations, disease detection, and profit calculations'
    },
    {
      icon: ShoppingCart,
      title: 'Marketplace',
      description: 'Direct connection between farmers and buyers with transparent pricing'
    },
    {
      icon: CloudRain,
      title: 'Weather & Price Intelligence',
      description: 'Real-time weather forecasts and market price predictions'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Images */}
        <AnimatePresence mode="wait">
          {farmerImages.map((image, index) => (
            index === currentImageIndex && (
              <motion.div
                key={image}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.4, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${image})`,
                  filter: 'blur(1px)'
                }}
              />
            )
          ))}
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/20 to-background/95" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              Krishi AI
            </h1>
            <p className="text-2xl md:text-3xl text-foreground/80 mb-12">
              Smart Farming & Marketplace
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16"
          >
            <blockquote className="text-3xl md:text-5xl font-serif italic text-foreground">
              "Sow innovation. Reap prosperity."
            </blockquote>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate('/farmer')}
            >
              Get Started as Farmer
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6"
              onClick={() => navigate('/buyer')}
            >
              Browse Marketplace
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Three Pillars of Smart Farming
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeOnboarding}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card p-8 rounded-lg max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4">Welcome to Krishi AI! 🌾</h3>
              <p className="text-muted-foreground mb-6">
                Your AI-powered farming assistant connecting farmers with buyers, 
                providing smart insights, disease detection, and market intelligence.
              </p>
              <Button onClick={closeOnboarding} className="w-full">
                Get Started
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-card py-12 px-4 border-t">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            © 2024 Krishi AI. Empowering farmers with technology.
          </p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
