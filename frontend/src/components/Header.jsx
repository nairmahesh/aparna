import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, Sparkles, Phone, Mail } from 'lucide-react';
import { shopInfo } from '../data/mock';

const Header = ({ cartCount, onCartClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-100 shadow-sm">
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{shopInfo.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{shopInfo.contact.email}</span>
              </div>
            </div>
            <div className="hidden md:block">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-4 h-4" />
                <span>Free Delivery on Orders Above ₹500</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                🪔
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  {shopInfo.name}
                </h1>
                <p className="text-sm text-gray-600">{shopInfo.tagline}</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={onCartClick}
            variant="outline" 
            className="relative border-orange-200 hover:border-orange-300 hover:bg-orange-50"
          >
            <ShoppingCart className="w-5 h-5 mr-2 text-orange-600" />
            <span className="text-orange-600">Cart</span>
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs flex items-center justify-center">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;