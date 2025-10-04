import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, Sparkles, Phone, Mail, Gift, Menu } from 'lucide-react';
import { shopInfo } from '../data/mock';

const Header = ({ cartCount, onCartClick, currentView, onViewChange }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-100 shadow-sm">
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-1 md:py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs md:text-sm space-y-1 md:space-y-0">
            <div className="flex items-center space-x-3 md:space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-3 h-3 md:w-4 md:h-4" />
                <a 
                  href={`tel:${shopInfo.contact.phone}`}
                  className="hover:text-orange-200 transition-colors cursor-pointer"
                >
                  {shopInfo.contact.phone}
                </a>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <span>FSSAI: {shopInfo.contact.fssai}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              <span>Free Delivery on Orders Above ₹500</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-2 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center text-white text-lg md:text-xl font-bold shadow-lg cursor-pointer"
                   onClick={() => {
                     onViewChange('menu');
                     window.scrollTo({ top: 0, behavior: 'smooth' });
                   }}>
                🪔
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent cursor-pointer"
                    onClick={() => {
                      onViewChange('menu');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}>
                  {shopInfo.name}
                </h1>
                <p className="text-xs md:text-sm text-gray-600 hidden sm:block">{shopInfo.tagline}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant={currentView === 'menu' ? 'default' : 'ghost'}
              onClick={() => {
                onViewChange('menu');
                // Scroll to menu section after a brief delay to ensure content is loaded
                setTimeout(() => {
                  const menuElement = document.getElementById('menu');
                  if (menuElement) {
                    menuElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className={currentView === 'menu' 
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
                : 'text-orange-600 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50'}
            >
              <Menu className="w-4 h-4 mr-2" />
              Menu
            </Button>
            <Button 
              variant={currentView === 'greetings' ? 'default' : 'ghost'}
              onClick={() => onViewChange('greetings')}
              className={currentView === 'greetings' 
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
                : 'text-orange-600 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50'}
            >
              <Gift className="w-4 h-4 mr-2" />
              Send Greetings
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Cart Button */}
            <Button 
              onClick={onCartClick}
              variant="outline" 
              className="relative border-orange-200 hover:border-orange-300 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50"
            >
              <ShoppingCart className="w-5 h-5 md:mr-2 text-orange-600" />
              <span className="hidden md:inline text-orange-600">Cart</span>
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs flex items-center justify-center">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-center space-x-4 mt-4">
          <Button 
            variant={currentView === 'menu' ? 'default' : 'ghost'}
            onClick={() => {
              onViewChange('menu');
              // Scroll to menu section after a brief delay to ensure content is loaded
              setTimeout(() => {
                const menuElement = document.getElementById('menu');
                if (menuElement) {
                  menuElement.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
            className={currentView === 'menu' 
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
              : 'text-orange-600 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50'}
            size="sm"
          >
            <Menu className="w-4 h-4 mr-2" />
            Menu
          </Button>
          <Button 
            variant={currentView === 'greetings' ? 'default' : 'ghost'}
            onClick={() => onViewChange('greetings')}
            className={currentView === 'greetings' 
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
              : 'text-orange-600 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50'}
            size="sm"
          >
            <Gift className="w-4 h-4 mr-2" />
            Greetings
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;