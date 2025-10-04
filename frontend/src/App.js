import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import OrderForm from './components/OrderForm';
import GreetingsForm from './components/GreetingsForm';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { menuCategories, shopInfo } from './data/mock';
import { Button } from './components/ui/button';
import { Sparkles, Star, Heart, Gift, ShoppingBag, Settings } from 'lucide-react';
import { useToast } from './hooks/use-toast';
import { Toaster } from './components/ui/toaster';

const Home = () => {
  const [cart, setCart] = useState([]);
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'order', 'greetings'
  const { toast } = useToast();

  const handleAddToCart = (item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to Cart!",
      description: `${item.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  const handleUpdateCart = (itemId, newQuantity) => {
    setCart(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
      duration: 2000,
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCartClick = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Add some delicious items to your cart first!",
        duration: 2000,
      });
    } else {
      setCurrentView('order');
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderContent = () => {
    switch (currentView) {
      case 'order':
        return (
          <OrderForm 
            cart={cart}
            onUpdateCart={handleUpdateCart}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />
        );
      case 'greetings':
        return <GreetingsForm />;
      default:
        return (
          <>
            {/* Hero Section */}
            <section className="relative py-20 px-4 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-amber-400/10"></div>
              <div className="relative container mx-auto max-w-4xl">
                <div className="mb-8">
                  <h1 className="text-6xl md:text-7xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                      Festival of
                    </span>
                    <br />
                    <span className="text-gray-800">Lights & Flavors</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
                    {shopInfo.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
                    <Star className="w-5 h-5 text-amber-500 fill-current" />
                    <span className="text-gray-700 font-medium">Premium Quality</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                    <span className="text-gray-700 font-medium">Made with Love</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 font-medium">Fresh Daily</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-6 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Explore Our Menu
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 px-8 py-6 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    onClick={() => setCurrentView('greetings')}
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    Send Greetings
                  </Button>
                </div>
              </div>
            </section>

            {/* Menu Section */}
            <main id="menu" className="container mx-auto px-4 py-16">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
                  Festival Menu
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Choose from our wide selection of traditional sweets and savory snacks
                </p>
              </div>
              
              {menuCategories.map((category) => (
                <CategorySection 
                  key={category.id} 
                  category={category} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </main>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Header 
        cartCount={cartCount} 
        onCartClick={handleCartClick}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <div className="pt-4">
        {renderContent()}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">{shopInfo.name}</h3>
            <p className="text-orange-100 mb-4">{shopInfo.tagline}</p>
            <div className="text-orange-100 space-y-1">
              <p>{shopInfo.contact.address}</p>
              <p>📞 {shopInfo.contact.phone}</p>
              <p className="text-sm">FSSAI License: {shopInfo.contact.fssai}</p>
            </div>
          </div>
          <div className="border-t border-orange-400 pt-6">
            <p className="text-orange-100">
              © 2024 {shopInfo.name}. Spreading sweetness and joy this Diwali! 🪔
            </p>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;