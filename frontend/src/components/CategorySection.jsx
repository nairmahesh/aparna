import React from 'react';
import MenuCard from './MenuCard';
import { Badge } from './ui/badge';

const CategorySection = ({ category, onAddToCart }) => {
  // Add some personality and gentle nudges for each category
  const getCategoryMessage = (categoryId) => {
    const messages = {
      chivda: {
        aparnasNote: "These are my signature recipes! The Corn Chivda with dry fruits is everyone's favorite for gifting.",
        buyingTip: "💡 Pro tip: Mix 2-3 varieties for the perfect snack hamper!"
      },
      chakli: {
        aparnasNote: "Made fresh every morning using my mother's traditional technique - each spiral is hand-crafted!",
        buyingTip: "🌟 Perfect with evening tea or as a crunchy addition to your gift boxes"
      },
      savory: {
        aparnasNote: "These classic snacks never go out of style. My Mathri recipe has been in our family for generations!",
        buyingTip: "✨ Great for mixing with other items - customers love creating their own variety boxes"
      },
      sweets: {
        aparnasNote: "Fresh Gujjia made this morning! I prepare the khoya filling with extra love and dry fruits.",
        buyingTip: "🎁 Perfect for gifting - beautifully presented in festival packaging"
      },
      laddus: {
        aparnasNote: "My Besan Laddus are made with pure ghee and roasted gram flour - the aroma fills the whole kitchen!",
        buyingTip: "💝 Traditional favorites that bring back childhood memories for everyone"
      }
    };
    return messages[categoryId] || { aparnasNote: "", buyingTip: "" };
  };

  const categoryPersonality = getCategoryMessage(category.id);

  return (
    <section className="mb-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 text-white text-3xl mb-6 shadow-xl">
          {category.icon}
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
          {category.name}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
          {category.description}
        </p>
        
        {/* Aparna's Personal Note */}
        {categoryPersonality.aparnasNote && (
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200 rounded-2xl p-6 max-w-3xl mx-auto mb-4">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">👩‍🍳</span>
              </div>
              <span className="font-semibold text-rose-700">Aparna says:</span>
            </div>
            <p className="text-gray-700 italic leading-relaxed">"{categoryPersonality.aparnasNote}"</p>
          </div>
        )}
        
        <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
          <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 text-sm">
            {category.items.length} Varieties Available
          </Badge>
          
          {categoryPersonality.buyingTip && (
            <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-full">
              <span className="text-blue-700 text-sm font-medium">{categoryPersonality.buyingTip}</span>
            </div>
          )}
          
          <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-full">
            <span className="text-green-700 text-sm font-medium">✓ Made Fresh Today</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {category.items.map((item, index) => {
          // Add special highlighting for certain items
          const isPopular = index === 0; // First item in each category
          const hasOffer = item.price > 800; // Higher priced items might have offers
          
          return (
            <div key={item.id} className="relative">
              {isPopular && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                  Most Popular ⭐
                </div>
              )}
              {hasOffer && !isPopular && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                  Great Value 💰
                </div>
              )}
              <MenuCard 
                item={item} 
                onAddToCart={onAddToCart}
                isSpecial={isPopular}
              />
            </div>
          );
        })}
      </div>
      
      {/* Category-specific call-to-action */}
      <div className="text-center mt-8">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 max-w-lg mx-auto">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-orange-600">Popular combo:</span> Order 2+ items from this section for variety!
          </p>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;