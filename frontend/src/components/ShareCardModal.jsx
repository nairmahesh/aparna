import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { X, Heart, Download } from 'lucide-react';

const ShareCardModal = ({ greetingData, isOpen, onClose }) => {
  if (!isOpen || !greetingData) return null;

  const getFinalMessage = () => {
    return greetingData.customMessage || greetingData.selectedMessage || greetingData.message || 'May this Diwali bring endless joy, prosperity, and happiness to your life. Wishing you a festival filled with light, love, and sweet moments!';
  };

  const handleDownloadFromModal = async () => {
    if (!greetingData.selectedArtwork && !greetingData.artworkUrl) {
      alert('Please select an artwork first.');
      return;
    }

    try {
      // Create a new canvas to manually draw the greeting card
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size (standard greeting card dimensions)
      const canvasWidth = 800;
      const canvasHeight = 1000;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Fill background with white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Load and draw the artwork image
      const artworkImg = new Image();
      artworkImg.crossOrigin = 'anonymous';
      
      const artworkUrl = greetingData.selectedArtwork?.url || greetingData.artworkUrl;
      
      await new Promise((resolve, reject) => {
        artworkImg.onload = resolve;
        artworkImg.onerror = () => {
          // If direct loading fails, try fetch approach
          fetch(artworkUrl)
            .then(response => response.blob())
            .then(blob => {
              const reader = new FileReader();
              reader.onload = () => {
                artworkImg.src = reader.result;
              };
              reader.readAsDataURL(blob);
            })
            .catch(reject);
        };
        artworkImg.src = artworkUrl;
        
        // Timeout after 10 seconds
        setTimeout(() => reject(new Error('Image loading timeout')), 10000);
      });

      // Calculate artwork dimensions to fit in the top portion
      const artworkHeight = 400; // Reserve 400px for artwork
      const artworkWidth = canvasWidth - 40; // 20px padding on each side
      
      // Calculate scaling to fit artwork
      const scaleX = artworkWidth / artworkImg.width;
      const scaleY = artworkHeight / artworkImg.height;
      const scale = Math.min(scaleX, scaleY);
      
      const scaledWidth = artworkImg.width * scale;
      const scaledHeight = artworkImg.height * scale;
      
      // Center the artwork
      const artworkX = (canvasWidth - scaledWidth) / 2;
      const artworkY = 20;
      
      // Draw the artwork
      ctx.drawImage(artworkImg, artworkX, artworkY, scaledWidth, scaledHeight);

      // Add text content below the artwork
      const textStartY = artworkY + scaledHeight + 40;
      
      // Set up text styles
      ctx.fillStyle = '#1f2937'; // Dark gray text
      ctx.textAlign = 'left';
      
      // Draw "To:" section
      let currentY = textStartY;
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#ea580c'; // Orange color
      ctx.fillText('To:', 40, currentY);
      
      ctx.font = '24px Arial';
      ctx.fillStyle = '#1f2937';
      ctx.fillText(greetingData.recipientName || '[Recipient Name]', 80, currentY);
      
      // Draw message section with border
      currentY += 50;
      const messageX = 40;
      const messageWidth = canvasWidth - 80;
      
      // Draw left border (orange line)
      ctx.fillStyle = '#fb923c';
      ctx.fillRect(messageX, currentY - 20, 4, 120);
      
      // Draw message text (word wrapped)
      const message = getFinalMessage();
      ctx.font = '20px Arial';
      ctx.fillStyle = '#1f2937';
      const words = message.split(' ');
      const maxWidth = messageWidth - 30;
      let line = '';
      let lineY = currentY;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, messageX + 20, lineY);
          line = words[i] + ' ';
          lineY += 25;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, messageX + 20, lineY);
      
      // Draw "From:" section
      currentY = lineY + 60;
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#ea580c';
      ctx.textAlign = 'right';
      ctx.fillText('From:', canvasWidth - 120, currentY);
      
      ctx.font = '24px Arial';
      ctx.fillStyle = '#1f2937';
      ctx.fillText(greetingData.senderName || '[Your Name]', canvasWidth - 40, currentY);
      
      // Draw footer decoration
      currentY += 60;
      ctx.textAlign = 'center';
      ctx.font = '18px Arial';
      ctx.fillStyle = '#ea580c';
      ctx.fillText('✨ Wishing you joy & prosperity! ✨', canvasWidth / 2, currentY);
      
      currentY += 30;
      ctx.font = '24px Arial';
      ctx.fillText('🪔 ❤️ 🪔', canvasWidth / 2, currentY);

      // Convert canvas to image and download
      const image = canvas.toDataURL('image/png', 1.0);
      
      if (image === 'data:,' || image.length < 1000) {
        throw new Error('Generated image is invalid');
      }
        
      // Create download link
      const link = document.createElement('a');
      link.href = image;
      link.download = `diwali-greeting-${greetingData.recipientName?.replace(/[^a-zA-Z0-9]/g, '') || 'card'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('Card Downloaded Successfully! 🎉');
    } catch (error) {
      console.error('Error generating card:', error);
      alert(`Download Failed: ${error.message}. Please try again.`);
    }
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
            onClick={handleDownloadFromModal}
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