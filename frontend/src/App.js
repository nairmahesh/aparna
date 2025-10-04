import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import MenuCard from './components/MenuCard';
import ProductImageCarousel from './components/ProductImageCarousel';
import OrderForm from './components/OrderForm';
import GreetingsForm from './components/GreetingsForm';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import EnhancedAdminPanel from './components/EnhancedAdminPanel';
import { menuCategories, shopInfo } from './data/mock';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Sparkles, Star, Heart, Gift, ShoppingBag, Settings, ShoppingCart } from 'lucide-react';
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

  // Get all items from all categories
  const allItems = menuCategories.flatMap(category => 
    category.items.map(item => ({ ...item, categoryId: category.id, categoryName: category.name }))
  );

  // Filter and sort items
  const getFilteredItems = () => {
    let filtered = allItems;

    // Category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.categoryId === activeFilter);
    }

    // Price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter(item => {
        switch (priceFilter) {
          case 'under500':
            return item.price < 500;
          case '500to1000':
            return item.price >= 500 && item.price <= 1000;
          case 'above1000':
            return item.price > 1000;
          default:
            return true;
        }
      });
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
          // Simple popularity based on category order and item order
          return a.id.localeCompare(b.id);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  };

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
                    {getFilteredItems().map((item, index) => (
                      <div key={item.id} className="group relative">
                        {/* Special Badges */}
                        {index === 0 && (
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                            🔥 Popular
                          </div>
                        )}
                        {item.price < 100 && (
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                            ₹ Great Deal
                          </div>
                        )}
                        
                        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white rounded-2xl">
                          <CardContent className="p-0">
                            {/* Product Image Carousel */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
                              <ProductImageCarousel images={item.images || [item.image]} productName={item.name} />
                              
                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              
                              {/* Fresh Badge */}
                              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-green-600 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                ✓ Fresh Today
                              </div>
                              
                              {/* Quick Add Button (appears on hover) */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <Button 
                                  onClick={() => handleAddToCart(item)}
                                  className="bg-white text-orange-600 hover:bg-orange-50 shadow-xl rounded-full px-6 py-2 font-semibold transform scale-95 group-hover:scale-100 transition-transform"
                                >
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Quick Add
                                </Button>
                              </div>
                            </div>
                            
                            {/* Product Info */}
                            <div className="p-5">
                              <div className="mb-3">
                                <h3 className="font-bold text-gray-800 text-lg mb-1 leading-tight">{item.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                              </div>
                              
                              <div className="flex items-end justify-between mb-4">
                                <div>
                                  <div className="flex items-baseline space-x-1">
                                    <span className="text-2xl font-bold text-gray-900">₹{item.price}</span>
                                    <span className="text-sm text-gray-500 font-medium">{item.unit}</span>
                                  </div>
                                  {item.price > 1000 && (
                                    <div className="flex items-center mt-1">
                                      <span className="text-xs text-gray-400 line-through mr-2">₹{Math.floor(item.price * 1.2)}</span>
                                      <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded">Save ₹{Math.floor(item.price * 0.2)}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Rating Stars */}
                                <div className="text-right">
                                  <div className="flex items-center space-x-1 mb-1">
                                    <div className="flex space-x-0.5">
                                      {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-amber-400 text-sm">★</span>
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500">4.8 (120+ reviews)</p>
                                </div>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button 
                                  onClick={() => handleAddToCart(item)}
                                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                                >
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Add to Cart
                                </Button>
                                <Button 
                                  variant="outline"
                                  className="px-3 py-2.5 border-orange-200 hover:border-orange-300 hover:bg-orange-50 rounded-xl"
                                >
                                  <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
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
              © 2025 {shopInfo.name}. Spreading sweetness and joy this Diwali! 🪔
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