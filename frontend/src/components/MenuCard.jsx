import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ShoppingCart, Star } from 'lucide-react';

const MenuCard = ({ item, onAddToCart, isSpecial = false }) => {
  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
      isSpecial 
        ? 'bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 hover:border-rose-300 shadow-lg' 
        : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:border-orange-300'
    }`}>
      <CardHeader className="pb-3">
        <div className={`aspect-square rounded-lg overflow-hidden mb-3 ${
          isSpecial 
            ? 'bg-gradient-to-br from-rose-100 to-pink-100 ring-2 ring-rose-200' 
            : 'bg-gradient-to-br from-orange-100 to-amber-100'
        }`}>
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {isSpecial && (
            <div className="absolute inset-0 bg-gradient-to-t from-rose-500/20 to-transparent"></div>
          )}
        </div>
        <CardTitle className={`text-lg group-hover:text-orange-700 transition-colors ${
          isSpecial ? 'text-rose-800 font-bold' : 'text-gray-800'
        }`}>
          {item.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{item.description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-orange-600">₹{item.price}</span>
            <span className="text-sm text-gray-500">{item.unit}</span>
          </div>
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Premium
          </Badge>
        </div>
        <Button 
          onClick={() => onAddToCart(item)}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium transition-all duration-200 transform hover:scale-105"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default MenuCard;