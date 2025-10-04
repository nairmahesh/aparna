import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, X, User, Calendar } from 'lucide-react';

const ReviewsModal = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    item.reviews?.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-orange-700">{item.name} - Reviews</CardTitle>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center space-x-1">
                  {renderStars(Math.floor(item.rating))}
                </div>
                <span className="text-lg font-bold text-gray-800">{item.rating}</span>
                <span className="text-sm text-gray-600">({item.totalReviews} reviews)</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full hover:bg-orange-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 max-h-[60vh] overflow-y-auto">
          {/* Rating Distribution */}
          <div className="p-6 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-8">{rating} ★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                      style={{
                        width: `${item.totalReviews > 0 ? (ratingDistribution[rating] / item.totalReviews) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{ratingDistribution[rating]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Customer Reviews</h3>
            {item.reviews?.map((review) => (
              <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-800">{review.customerName}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {review.rating}/5
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {(!item.reviews || item.reviews.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No reviews available for this product yet.</p>
                <p className="text-sm mt-1">Be the first to leave a review!</p>
              </div>
            )}
          </div>
        </CardContent>

        <div className="p-4 border-t bg-gray-50">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            Close Reviews
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ReviewsModal;