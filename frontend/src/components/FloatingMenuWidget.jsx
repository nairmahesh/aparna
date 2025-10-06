import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Menu, Star, Cookie, ShoppingBag, Utensils, Heart, X } from 'lucide-react';
import { menuCategories } from '../data/mock';

const FloatingMenuWidget = ({ onCategoryClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Get main categories with icons for better UX
  const mainCategories = menuCategories.slice(0, 5).map((category, index) => {
    const icons = [Star, Cookie, ShoppingBag, Utensils, Heart];
    return {
      ...category,
      icon: icons[index % icons.length],
      displayName: category.name.replace(' Collection', '').replace(' Varieties', '').replace(' Delights', '')
    };
  });

  useEffect(() => {
    const handleScroll = () => {
      // Show the widget after scrolling down 300px
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (categoryId) => {
    if (onCategoryClick) {
      onCategoryClick(categoryId);
    }
    setIsExpanded(false); // Close mobile menu after selection
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Mobile View - Expandable Widget */}
      <div className="block md:hidden">
        <div className={`transition-all duration-300 ${isExpanded ? 'mb-3 space-y-2' : ''}`}>
          {isExpanded && (
            <div className="bg-white rounded-2xl shadow-xl p-4 border border-orange-200 min-w-[300px] relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-orange-600 flex items-center">
                  <Menu className="w-5 h-5 mr-2" />
                  Menu Categories
                </h3>
                <Button
                  onClick={() => setIsExpanded(false)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700"
                  title="Close Categories"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {mainCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className="w-full justify-start bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 text-orange-700 border border-orange-200 rounded-lg font-medium py-3 transition-all hover:shadow-md"
                      variant="outline"
                    >
                      <IconComponent className="w-4 h-4 mr-3 text-orange-600" />
                      <div className="text-left">
                        <div className="font-semibold text-orange-800">{category.displayName}</div>
                        <div className="text-xs text-orange-600">{category.description.slice(0, 35)}...</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Main Toggle Button */}
        <Button
          onClick={toggleExpanded}
          className="w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
          title="View Categories"
        >
          <Menu className="w-7 h-7" />
        </Button>
      </div>

      {/* Desktop View - Category Buttons */}
      <div className="hidden md:block">
        {isExpanded && (
          <div className="bg-white rounded-2xl shadow-xl p-5 border border-orange-200 min-w-[380px] relative mb-4">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-orange-600 flex items-center">
              <Menu className="w-5 h-5 mr-2" />
              Menu Categories
            </h3>
            <Button
              onClick={() => setIsExpanded(false)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700"
              title="Close Categories"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {mainCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="justify-start bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 text-orange-700 border border-orange-200 rounded-lg font-medium py-4 px-4 transition-all hover:shadow-lg hover:scale-[1.02]"
                  variant="outline"
                >
                  <IconComponent className="w-5 h-5 mr-4 text-orange-600" />
                  <div className="text-left flex-1">
                    <div className="font-bold text-orange-800 text-base">{category.displayName}</div>
                    <div className="text-sm text-orange-600 mt-1">{category.description.slice(0, 45)}...</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingMenuWidget;