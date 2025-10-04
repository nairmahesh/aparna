import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import MenuCard from './components/MenuCard';
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
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'order', 'greetings', 'admin'
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
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
      case 'admin':
        return isAdminLoggedIn ? (
          <AdminPanel />
        ) : (
          <AdminLogin onLogin={setIsAdminLoggedIn} />
        );
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
                  Aparna's Diwali Collection
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
                  Fresh homemade delicacies crafted with love - each recipe passed down through generations
                </p>
                <div className="flex justify-center space-x-4 mb-8">
                  <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                    <span className="text-green-600 text-sm font-medium">✓ Made Fresh Daily</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full">
                    <span className="text-orange-600 text-sm font-medium">🏆 Family Recipes</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
                    <span className="text-blue-600 text-sm font-medium">📦 Free Delivery ₹500+</span>
                  </div>
                </div>
              </div>

              {/* Quick Category Overview */}
              <section className="mb-16">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-6">Browse Our Complete Collection</h3>
                  <p className="text-gray-600 mb-8">Click on any category to see all available varieties</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
                    {menuCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          document.getElementById(category.id).scrollIntoView({ behavior: 'smooth' });
                          // Trigger the category grid highlight
                          setTimeout(() => {
                            const categoryGrid = document.getElementById(`${category.id}-grid`);
                            if (categoryGrid) {
                              categoryGrid.classList.add('ring-4', 'ring-orange-300', 'ring-opacity-50');
                              setTimeout(() => {
                                categoryGrid.classList.remove('ring-4', 'ring-orange-300', 'ring-opacity-50');
                              }, 2000);
                            }
                          }, 500);
                        }}
                        className="bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 p-6 rounded-xl border-2 border-orange-200 hover:border-orange-300 transition-all transform hover:scale-105 group"
                      >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                        <h4 className="font-bold text-orange-700 mb-2">{category.name}</h4>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{category.description}</p>
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          View All {category.items.length} Items →
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200 max-w-2xl mx-auto">
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      🎁 <span className="text-orange-600">Perfect for Diwali:</span> Mix & match from different categories!
                    </p>
                    <p className="text-sm text-gray-600">Create your own custom hamper with varieties from each section</p>
                  </div>
                </div>
              </section>

              {/* Full Menu Categories with better spacing and cross-selling */}
              {menuCategories.map((category, index) => (
                <div key={category.id} id={category.id}>
                  <CategorySection 
                    category={category} 
                    onAddToCart={handleAddToCart}
                  />
                  
                  {/* Add cross-selling suggestions between sections */}
                  {index < menuCategories.length - 1 && (
                    <div className="my-12 text-center">
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200 max-w-2xl mx-auto">
                        <p className="text-lg font-medium text-amber-700 mb-2">
                          💡 <span className="text-gray-700">Aparna's Tip:</span> {category.name} pairs perfectly with items from our next section!
                        </p>
                        <p className="text-sm text-gray-600">Create the perfect festival mix for your family & friends</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Order Motivation Section */}
              <section className="mt-16 text-center">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-8 rounded-2xl shadow-2xl">
                  <h3 className="text-3xl font-bold mb-4">Ready to Make This Diwali Special? 🪔</h3>
                  <p className="text-xl mb-6 opacity-90">
                    Join 500+ happy families who trust Aparna's homemade delicacies for their celebrations
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-2xl mb-2">⚡</div>
                      <p className="font-semibold">Same Day Delivery</p>
                      <p className="text-sm opacity-80">Order by 2 PM</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-2xl mb-2">💝</div>
                      <p className="font-semibold">Perfect Packaging</p>
                      <p className="text-sm opacity-80">Gift-ready presentation</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-2xl mb-2">🏆</div>
                      <p className="font-semibold">100% Fresh Guarantee</p>
                      <p className="text-sm opacity-80">Made with love, delivered fresh</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleCartClick}
                    className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-bold rounded-full shadow-lg"
                  >
                    {cartCount > 0 ? `View My Cart (${cartCount} items)` : 'Start Your Order'} →
                  </Button>
                </div>
              </section>
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