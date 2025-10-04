import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const ImageWithFallback = ({ 
  src, 
  alt, 
  className = "", 
  fallbackClassName = "", 
  onError = null 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    if (onError) {
      onError();
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (imageError) {
    return (
      <div className={`bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center ${fallbackClassName || className}`}>
        <Heart className="w-8 h-8 text-orange-600" />
      </div>
    );
  }

  return (
    <>
      {!imageLoaded && (
        <div className={`bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse ${className}`}></div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${!imageLoaded ? 'hidden' : ''}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        crossOrigin="anonymous"
      />
    </>
  );
};

export default ImageWithFallback;