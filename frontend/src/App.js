import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import MenuCard from './components/MenuCard';
import ProductImageCarousel from './components/ProductImageCarousel';
import OrderForm from './components/OrderForm';
import GreetingsForm from './components/GreetingsForm';
import ReviewsModal from './components/ReviewsModal';
import ShareModal from './components/ShareModal';
import ShareableGreeting from './components/ShareableGreeting';
import FloatingMenuWidget from './components/FloatingMenuWidget';
import LoginPage from './components/LoginPage';
import AdminPanelPage from './components/AdminPanelPage';
import { menuCategories, shopInfo } from './data/mock';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Sparkles, Star, Heart, Gift, ShoppingBag, Settings, ShoppingCart, Phone, Share2, Copy, MessageCircle, Plus, Minus } from 'lucide-react';
import { useToast } from './hooks/use-toast';
import { Toaster } from './components/ui/toaster';

const Home = () => {
  const [cart, setCart] = useState([]);
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'order', 'greetings'
  const [activeFilter, setActiveFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showReviews, setShowReviews] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedShareItem, setSelectedShareItem] = useState(null);
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

  const handleShowReviews = (item) => {
    setSelectedReviewItem(item);
    setShowReviews(true);
  };

  const handleShareProduct = (item) => {
    setSelectedShareItem(item);
    setShowShareModal(true);
  };

  const handleWhatsAppShare = (item) => {
    const productUrl = `${window.location.origin}/?product=${item.id}`;
    const message = `🪔 Check out this delicious ${item.name} from Aparna's Diwali Delights!\n\n${item.description}\n\n💰 Price: ₹${item.price} ${item.unit}\n⭐ Rating: ${item.rating || 'New'} ${item.totalReviews ? `(${item.totalReviews} reviews)` : ''}\n\n🛒 Order now: ${productUrl}\n\n#DiwaliTreats #AparnaDelights`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp Share",
      description: "WhatsApp opened with product details!",
    });
    
    setShowShareModal(false);
  };

  const handleCopyLink = (item) => {
    const productUrl = `${window.location.origin}/?product=${item.id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(productUrl).then(() => {
      toast({
        title: "Link Copied!",
        description: "Product link copied to clipboard. Share it anywhere!",
      });
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = productUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Link Copied!",
        description: "Product link copied to clipboard. Share it anywhere!",
      });
    });
    
    setShowShareModal(false);
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

  const handleIncrementQuantity = (item) => {
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
  };

  const handleDecrementQuantity = (item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else if (existingItem && existingItem.quantity === 1) {
        return prev.filter(cartItem => cartItem.id !== item.id);
      }
      return prev;
    });
  };

  const getItemQuantityInCart = (itemId) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
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

  // Get managed categories from localStorage, fallback to menuCategories
  const getManagedCategories = () => {
    const saved = localStorage.getItem('managedCategories');
    return saved ? JSON.parse(saved) : menuCategories;
  };

  // Get website settings from localStorage, fallback to shopInfo
  const getWebsiteSettings = () => {
    const saved = localStorage.getItem('websiteSettings');
    return saved ? JSON.parse(saved) : {
      name: shopInfo.name,
      tagline: shopInfo.tagline,
      description: shopInfo.description,
      heroTitle: 'Welcome to Festival of Flavors',
      heroSubtitle: 'Discover authentic Diwali sweets and snacks made with traditional recipes',
      contact: shopInfo.contact
    };
  };

  // Get all items from all categories
  const allItems = getManagedCategories().flatMap(category => 
    category.items.map(item => ({ ...item, categoryId: category.id, categoryName: category.name }))
  );

  // Filter and sort items
  const getFilteredItems = () => {
    let filtered = allItems;

    // Hide products that are marked as hidden by admin
    const hiddenProducts = JSON.parse(localStorage.getItem('hiddenProducts') || '[]');
    filtered = filtered.filter(item => !hiddenProducts.includes(item.id));

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
      default:
        return (
          <>
            {/* Hero Section */}
            <section className="relative py-12 md:py-20 px-4 text-center overflow-hidden w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-amber-400/10"></div>
              <div className="relative container mx-auto max-w-4xl w-full">
                <div className="mb-4 md:mb-8">
                  <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-6">
                    <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                      {getWebsiteSettings().heroTitle}
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-700 mb-4 md:mb-8 leading-relaxed max-w-3xl mx-auto">
                    {getWebsiteSettings().heroSubtitle}
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-12">
                  <div className="flex items-center space-x-1 md:space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 md:px-6 md:py-3 shadow-sm">
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-500 fill-current" />
                    <span className="text-gray-700 font-medium text-xs md:text-base">Premium Quality</span>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 md:px-6 md:py-3 shadow-sm">
                    <Heart className="w-4 h-4 md:w-5 md:h-5 text-orange-500 fill-current" />
                    <span className="text-gray-700 font-medium text-xs md:text-base">Made with Love</span>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 md:px-6 md:py-3 shadow-sm">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                    <span className="text-gray-700 font-medium text-xs md:text-base">Fresh Daily</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 w-full max-w-md md:max-w-full mx-auto">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-4 md:px-8 md:py-6 text-sm md:text-lg font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex-1 md:flex-none"
                    onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
                  >
                    <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Menu
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-4 py-4 md:px-8 md:py-6 text-sm md:text-lg font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex-1 md:flex-none"
                    onClick={() => setCurrentView('greetings')}
                  >
                    <Gift className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Send Greetings
                  </Button>
                </div>
              </div>
            </section>

            {/* Menu Section */}
            <main id="menu" className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Clean Header */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Diwali Delights Menu</h2>
                <p className="text-gray-600">Fresh homemade delicacies • {menuCategories.reduce((total, cat) => total + cat.items.length, 0)} items available</p>
              </div>

              {/* E-commerce Style Layout */}
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
                {/* Sidebar Filters */}
                <aside className="w-64 flex-shrink-0 hidden lg:block">
                  <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveFilter('all')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          activeFilter === 'all' 
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        All Items ({menuCategories.reduce((total, cat) => total + cat.items.length, 0)})
                      </button>
                      {getManagedCategories().map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setActiveFilter(category.id)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            activeFilter === category.id
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {category.name.replace(' Collection', '').replace(' Varieties', '').replace(' Delights', '')} ({category.items.length})
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
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        All Prices
                      </button>
                      <button
                        onClick={() => setPriceFilter('under500')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          priceFilter === 'under500'
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        Under ₹500
                      </button>
                      <button
                        onClick={() => setPriceFilter('500to1000')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          priceFilter === '500to1000'
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        ₹500 - ₹1000
                      </button>
                      <button
                        onClick={() => setPriceFilter('above1000')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          priceFilter === 'above1000'
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        Above ₹1000
                      </button>
                    </div>

                    <hr className="my-6" />
                    
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-orange-700 mb-1">✓ Fresh Daily</p>
                      <p className="text-sm font-medium text-orange-700 mb-1">✓ Free Delivery ₹500+</p>
                      <p className="text-sm font-medium text-orange-700">✓ Family Recipes</p>
                    </div>
                  </div>
                </aside>

                {/* Main Product Grid */}
                <div className="flex-1 min-w-0 w-full">
                  {/* Mobile Filter Buttons */}
                  <div className="lg:hidden mb-6">
                    <div className="flex space-x-2 overflow-x-auto pb-2 -mx-2 px-2">
                      <button
                        onClick={() => setActiveFilter('all')}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
                          activeFilter === 'all' 
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        All
                      </button>
                      {getManagedCategories().map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setActiveFilter(category.id)}
                          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
                            activeFilter === category.id
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {category.name.split(' ')[0]}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
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
                                  className="bg-white text-orange-600 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 shadow-xl rounded-full px-6 py-2 font-semibold transform scale-95 group-hover:scale-100 transition-transform"
                                >
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Quick Add
                                </Button>
                              </div>
                            </div>
                            
                            {/* Product Info */}
                            <div className="p-3 sm:p-5">
                              <div className="mb-3">
                                <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1 leading-tight break-words">{item.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                              </div>
                              
                              {/* Price Section */}
                              <div className="mb-3">
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
                              
                              {/* Rating Section */}
                              <div className="mb-4">
                                {item.rating && (
                                  <div 
                                    className="flex items-center justify-center space-x-2 cursor-pointer hover:bg-orange-50 rounded-lg py-2 px-3 transition-colors"
                                    onClick={() => handleShowReviews(item)}
                                  >
                                    <div className="flex space-x-0.5">
                                      {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`text-sm ${
                                          i < Math.floor(item.rating) ? 'text-amber-400' : 'text-gray-300'
                                        }`}>★</span>
                                      ))}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                                    <span className="text-xs text-orange-600 hover:text-orange-700 font-medium">({item.totalReviews} reviews)</span>
                                  </div>
                                )}
                                {!item.rating && (
                                  <p className="text-xs text-center text-gray-400">New Product</p>
                                )}
                              </div>
                              
                              <div className="space-y-3">
                                {getItemQuantityInCart(item.id) === 0 ? (
                                  <Button 
                                    onClick={() => handleAddToCart(item)}
                                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                                  >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Add to Cart
                                  </Button>
                                ) : (
                                  <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl p-2">
                                    <Button
                                      onClick={() => handleDecrementQuantity(item)}
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 rounded-lg hover:bg-white/20 text-white p-0"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                    
                                    <span className="font-semibold px-3">
                                      {getItemQuantityInCart(item.id)}
                                    </span>
                                    
                                    <Button
                                      onClick={() => handleIncrementQuantity(item)}
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 rounded-lg hover:bg-white/20 text-white p-0"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                )}
                                
                                <Button 
                                  onClick={() => handleShareProduct(item)}
                                  variant="outline"
                                  className="w-full border-orange-200 hover:border-orange-300 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 text-orange-600 hover:text-orange-700 py-2.5 rounded-xl text-sm sm:text-base"
                                >
                                  <Heart className="w-4 h-4 mr-1 sm:mr-2" />
                                  <span className="truncate">Share & Recommend</span>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-x-hidden">
      <Header 
        cartCount={cartCount} 
        onCartClick={handleCartClick}
        currentView={currentView}
        onViewChange={setCurrentView}
        websiteSettings={getWebsiteSettings()}
      />
      
      <div className="pt-4">
        {renderContent()}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">{getWebsiteSettings().name}</h3>
            <p className="text-orange-100 mb-4">{getWebsiteSettings().tagline}</p>
            <div className="text-orange-100 space-y-1">
              <p>{getWebsiteSettings().contact.address}</p>
              <p className="flex items-center justify-center space-x-2">
                <Phone className="w-4 h-4 text-white" />
                <a 
                  href={`tel:${getWebsiteSettings().contact.phone}`}
                  className="hover:text-orange-200 transition-colors cursor-pointer"
                >
                  {getWebsiteSettings().contact.phone}
                </a>
              </p>
              <p className="text-sm">FSSAI License: {getWebsiteSettings().contact.fssai}</p>
            </div>
          </div>
          <div className="border-t border-orange-400 pt-6">
            <p className="text-orange-100">
              © 2025 {getWebsiteSettings().name}. Spreading sweetness and joy this Diwali! 🪔
            </p>
            <p className="text-orange-200 text-sm mt-2">
              Powered by{' '}
              <a
                href="https://www.effybiz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-100 hover:text-white font-semibold underline transition-colors"
              >
                effyBiz
              </a>
            </p>
          </div>
        </div>
      </footer>
      
      {/* Reviews Modal */}
      <ReviewsModal
        item={selectedReviewItem}
        isOpen={showReviews}
        onClose={() => setShowReviews(false)}
      />

      {/* Share Modal */}
      <ShareModal
        item={selectedShareItem}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onWhatsAppShare={handleWhatsAppShare}
        onCopyLink={handleCopyLink}
      />
      
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
          <Route path="/greeting/:id" element={<ShareableGreeting />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
        </Routes>

        {/* Floating Menu Widget - Appears on scroll */}
        <FloatingMenuWidget onMenuClick={() => setCurrentView('menu')} />
      </BrowserRouter>
    </div>
  );
}

export default App;