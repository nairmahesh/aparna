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
            <>
              {/* Menu Button */}
              <Button
                onClick={handleMenuClick}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                title="View Menu"
              >
                <Menu className="w-6 h-6" />
              </Button>
              
              {/* Scroll to Top Button */}
              <Button
                onClick={scrollToTop}
                variant="outline"
                className="w-14 h-14 rounded-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 shadow-lg hover:shadow-xl transition-all flex items-center justify-center bg-white"
                title="Scroll to Top"
              >
                <ChevronUp className="w-6 h-6" />
              </Button>
            </>
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

      {/* Desktop View - Side by Side Buttons */}
      <div className="hidden md:flex space-x-3">
        {/* Menu Button */}
        <Button
          onClick={handleMenuClick}
          className="h-14 px-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
          title="View Menu"
        >
          <Menu className="w-5 h-5" />
          <span className="font-semibold">Menu</span>
        </Button>
        
        {/* Scroll to Top Button */}
        <Button
          onClick={scrollToTop}
          variant="outline"
          className="w-14 h-14 rounded-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 shadow-lg hover:shadow-xl transition-all flex items-center justify-center bg-white"
          title="Scroll to Top"
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default FloatingMenuWidget;