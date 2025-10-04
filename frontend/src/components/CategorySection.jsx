import React from 'react';
import MenuCard from './MenuCard';
import { Badge } from './ui/badge';

const CategorySection = ({ category, onAddToCart }) => {
  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 text-white text-2xl mb-4 shadow-lg">
          {category.icon}
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3">
          {category.name}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {category.description}
        </p>
        <Badge className="mt-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1">
          {category.items.length} Items Available
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {category.items.map((item) => (
          <MenuCard 
            key={item.id} 
            item={item} 
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;