import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import { menuCategories } from '../data/mock';

const FloatingMenuWidget = ({ onCategoryClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Get main categories for the widget
  const mainCategories = menuCategories.slice(0, 5); // First 5 categories

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
            <div className="bg-white rounded-2xl shadow-xl p-4 border border-orange-200 min-w-[280px]">
              <h3 className="text-lg font-bold text-orange-600 mb-3 text-center">Menu Categories</h3>
              <div className="space-y-2">
                {mainCategories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className="w-full justify-start bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 text-orange-700 border border-orange-200 rounded-lg text-sm font-medium"
                    variant="outline"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Main Toggle Button */}
        <Button
          onClick={toggleExpanded}
          className={`w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center ${
            isExpanded 
              ? 'bg-gray-600 hover:bg-gray-700 text-white' 
              : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
          }`}
          title={isExpanded ? "Close Menu" : "Quick Actions"}
        >
          {isExpanded ? (
            <div className="w-6 h-6 relative">
              <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-white rotate-45 transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-white -rotate-45 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </Button>
      </div>

      {/* Desktop View - Category Buttons */}
      <div className="hidden md:block">
        <div className="bg-white rounded-2xl shadow-xl p-4 border border-orange-200 min-w-[320px]">
          <h3 className="text-lg font-bold text-orange-600 mb-4 text-center flex items-center justify-center">
            <Menu className="w-5 h-5 mr-2" />
            Menu Categories
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {mainCategories.map((category) => (
              <Button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="justify-start bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 text-orange-700 border border-orange-200 rounded-lg font-medium transition-all hover:shadow-md"
                variant="outline"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingMenuWidget;