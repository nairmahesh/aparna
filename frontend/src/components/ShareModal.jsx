import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { X, Share2, MessageCircle, Copy, Heart } from 'lucide-react';

const ShareModal = ({ item, isOpen, onClose, onWhatsAppShare, onCopyLink }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-orange-500" />
            Share & Recommend
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Product Info */}
          <div className="text-center border-b pb-4">
            {item.images && item.images.length > 0 ? (
              <img 
                src={item.images[0]} 
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl mx-auto mb-3 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-200 rounded-xl mx-auto mb-3 shadow-lg flex items-center justify-center">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
            )}
            <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
            <p className="text-orange-600 font-bold">₹{item.price} {item.unit}</p>
            {item.rating && (
              <p className="text-sm text-gray-600">⭐ {item.rating} ({item.totalReviews} reviews)</p>
            )}
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <Button
              onClick={() => onWhatsAppShare(item)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Share on WhatsApp</span>
            </Button>
            
            <Button
              onClick={() => onCopyLink(item)}
              variant="outline"
              className="w-full border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-600 hover:text-orange-700 font-semibold py-3 rounded-xl flex items-center justify-center space-x-2"
            >
              <Copy className="w-5 h-5" />
              <span>Copy Link</span>
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center text-sm text-gray-500 pt-2">
            <p>Help your friends discover delicious Diwali treats! 🪔</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareModal;