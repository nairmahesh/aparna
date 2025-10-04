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
  const [activeFilter, setActiveFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
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
            <main id="menu" className="container mx-auto px-4 py-8">
              {/* Clean Header */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Diwali Delights Menu</h2>
                <p className="text-gray-600">Fresh homemade delicacies • {menuCategories.reduce((total, cat) => total + cat.items.length, 0)} items available</p>
              </div>

              {/* E-commerce Style Layout */}
              <div className="flex gap-8">
                {/* Sidebar Filters */}
                <aside className="w-64 flex-shrink-0 hidden lg:block">
                  <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveFilter('all')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          activeFilter === 'all' 
                            ? 'bg-orange-500 text-white' 
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        All Items ({menuCategories.reduce((total, cat) => total + cat.items.length, 0)})
                      </button>
                      {menuCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setActiveFilter(category.id)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            activeFilter === category.id
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {category.icon} {category.name.replace(' Collection', '').replace(' Varieties', '').replace(' Delights', '')} ({category.items.length})
                        </button>
                      ))}
                    </div>

                    <hr className="my-6" />
                    
                    <h4 className="font-semibold text-gray-800 mb-3">Price Range</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setPriceFilter('all')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          priceFilter === 'all' 
                            ? 'bg-orange-500 text-white' 
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        All Prices
                      </button>
                      <button
                        onClick={() => setPriceFilter('under500')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          priceFilter === 'under500'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        Under ₹500
                      </button>
                      <button
                        onClick={() => setPriceFilter('500to1000')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          priceFilter === '500to1000'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        ₹500 - ₹1000
                      </button>
                      <button
                        onClick={() => setPriceFilter('above1000')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          priceFilter === 'above1000'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        Above ₹1000
                      </button>
                    </div>

                    <hr className="my-6" />
                    
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-orange-700 mb-1">✓ Fresh Daily</p>
                      <p className="text-sm font-medium text-orange-700 mb-1">✓ Free Delivery ₹500+</p>
                      <p className="text-sm font-medium text-orange-700">✓ Family Recipes</p>
                    </div>
                  </div>
                </aside>

                {/* Main Product Grid */}
                <div className="flex-1">
                  {/* Mobile Filter Buttons */}
                  <div className="lg:hidden mb-6">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      <button
                        onClick={() => setActiveFilter('all')}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
                          activeFilter === 'all' 
                            ? 'bg-orange-500 text-white' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        All
                      </button>
                      {menuCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setActiveFilter(category.id)}
                          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
                            activeFilter === category.id
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {category.icon} {category.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Results Header */}
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">
                      Showing {getFilteredItems().length} items
                      {activeFilter !== 'all' && (
                        <span className="ml-2">
                          in {menuCategories.find(cat => cat.id === activeFilter)?.name}
                        </span>
                      )}
                    </p>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>

                  {/* Product Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {getFilteredItems().map((item) => (
                      <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200 hover:border-orange-300">
                        <CardContent className="p-0">
                          {/* Product Image */}
                          <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          
                          {/* Product Info */}
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{item.name}</h3>
                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                            
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
                                <span className="text-sm text-gray-500 ml-1">{item.unit}</span>
                              </div>
                              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                Fresh
                              </Badge>
                            </div>
                            
                            <Button 
                              onClick={() => handleAddToCart(item)}
                              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {getFilteredItems().length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No items found matching your filters</p>
                      <Button 
                        onClick={() => {
                          setActiveFilter('all');
                          setPriceFilter('all');
                        }}
                        variant="outline" 
                        className="mt-4"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
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