import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Heart } from 'lucide-react';

const ShareableGreeting = () => {
  const { id } = useParams();
  const [greetingData, setGreetingData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      console.log('ShareableGreeting mounted with ID:', id);
      console.log('Current URL:', window.location.href);
      
      // Try to load greeting data from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const recipientName = urlParams.get('to');
      const senderName = urlParams.get('from');
      const message = urlParams.get('message');
      const artworkUrl = urlParams.get('artwork');

      console.log('URL Parameters:', { recipientName, senderName, message, artworkUrl });

      if (recipientName && senderName && message && artworkUrl) {
        const greeting = {
          recipientName: decodeURIComponent(recipientName),
          senderName: decodeURIComponent(senderName),
          message: decodeURIComponent(message),
          artworkUrl: decodeURIComponent(artworkUrl)
        };
        console.log('Parsed greeting data:', greeting);
        setGreetingData(greeting);

        // Update meta tags for sharing
        updateMetaTags(greeting);
      } else {
        console.log('Missing required parameters');
        setError('Missing greeting parameters');
      }
    } catch (err) {
      console.error('Error in ShareableGreeting:', err);
      setError(err.message);
    }
  }, [id]);

  const updateMetaTags = (greeting) => {
    // Update page title
    document.title = `Diwali Greeting from ${greeting.senderName} to ${greeting.recipientName}`;
    
    // Update or create meta tags
    const updateMetaTag = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMetaTag('og:title', `🪔 Diwali Greeting from ${greeting.senderName}`);
    updateMetaTag('og:description', `${greeting.message.substring(0, 100)}...`);
    updateMetaTag('og:image', greeting.artworkUrl);
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:type', 'website');
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', `🪔 Diwali Greeting from ${greeting.senderName}`);
    updateMetaTag('twitter:description', `${greeting.message.substring(0, 100)}...`);
    updateMetaTag('twitter:image', greeting.artworkUrl);
  };

  if (!greetingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading Diwali Greeting...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            🪔 Happy Diwali! 🪔
          </h1>
          <p className="text-gray-600">
            A special greeting from {greetingData.senderName} to {greetingData.recipientName}
          </p>
        </div>

        {/* Greeting Card */}
        <Card className="border-2 border-orange-300 overflow-hidden shadow-xl">
          <CardContent className="p-0">
            {/* Artwork Image - Top Section */}
            <div className="w-full flex justify-center bg-gray-50">
              <img 
                src={greetingData.artworkUrl} 
                alt="Diwali Artwork" 
                className="max-w-full max-h-96 object-contain"
              />
            </div>
            
            {/* Text Section - Bottom Section */}
            <div className="bg-white p-6 space-y-4 min-h-[200px]">
              {/* To Section */}
              <div className="text-left">
                <p className="text-lg font-medium text-gray-700">
                  <span className="text-orange-600 font-bold">To:</span> {greetingData.recipientName}
                </p>
              </div>
              
              {/* Message Section */}
              <div className="border-l-4 border-orange-300 pl-4 my-4">
                <p className="text-gray-800 leading-relaxed text-base">
                  {greetingData.message}
                </p>
              </div>
              
              {/* From Section */}
              <div className="text-right">
                <p className="text-lg font-medium text-gray-700">
                  <span className="text-orange-600 font-bold">From:</span> {greetingData.senderName}
                </p>
              </div>
              
              {/* Footer Decoration */}
              <div className="text-center pt-4 border-t border-orange-200">
                <p className="text-orange-600 font-medium">
                  ✨ Wishing you joy & prosperity! ✨
                </p>
                <div className="flex justify-center items-center space-x-2 mt-2">
                  <span className="text-2xl">🪔</span>
                  <Heart className="w-4 h-4 text-orange-500 fill-current" />
                  <span className="text-2xl">🪔</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Created with ❤️ at Aparna's Diwali Delights
          </p>
          <p className="text-orange-600 text-xs mt-2">
            <a 
              href="/" 
              className="hover:text-orange-700 transition-colors"
            >
              Create your own Diwali greeting →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareableGreeting;