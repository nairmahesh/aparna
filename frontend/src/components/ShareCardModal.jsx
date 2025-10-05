import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { X, Heart, Download } from 'lucide-react';

const ShareCardModal = ({ greetingData, isOpen, onClose, onDownload }) => {
  if (!isOpen || !greetingData) return null;

  const getFinalMessage = () => {
    return greetingData.customMessage || greetingData.selectedMessage || greetingData.message || 'May this Diwali bring endless joy, prosperity, and happiness to your life. Wishing you a festival filled with light, love, and sweet moments!';
  };

  const handleCopyLink = async () => {
    const currentUrl = window.location.origin;
    const shareText = `🪔 Happy Diwali! 🪔\n\nDear ${greetingData.recipientName},\n\n${getFinalMessage()}\n\nWith love and warm wishes,\n${greetingData.senderName}\n\n✨ Wishing you joy, prosperity & happiness! ✨\n\nView this greeting at: ${currentUrl}`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      // You could add a toast here if needed
    } catch (err) {
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const handleWhatsAppShare = () => {
    const shareText = `🪔 *Happy Diwali!* 🪔\n\n*Dear ${greetingData.recipientName},*\n\n${getFinalMessage()}\n\n*With love and warm wishes,*\n*${greetingData.senderName}*\n\n✨ _Wishing you joy, prosperity & happiness!_ ✨`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            🪔 Your Diwali Greeting 🪔
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Greeting Card */}
        <div className="p-6">
          <Card className="border-2 border-orange-300 overflow-hidden shadow-lg">
            <CardContent className="p-0">
              {/* Artwork Image - Top Section */}
              <div className="w-full flex justify-center bg-gray-50">
                <img 
                  src={greetingData.selectedArtwork?.url || greetingData.artworkUrl} 
                  alt="Diwali Artwork" 
                  className="max-w-full max-h-80 object-contain"
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
                    {getFinalMessage()}
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
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t bg-gray-50 grid grid-cols-3 gap-3">
          <Button
            onClick={onDownload}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          
          <Button
            onClick={handleWhatsAppShare}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            WhatsApp
          </Button>
          
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            Copy Text
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareCardModal;