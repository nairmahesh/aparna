import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Heart, Share2, Copy, Download, Sparkles, Send, MessageCircle, Mail, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import html2canvas from 'html2canvas';
import { relationshipTypes, greetingMessages } from '../data/mock';
import { useToast } from '../hooks/use-toast';

const greetingArtworks = [
  {
    id: 1,
    name: 'Traditional Diwali Design',
    url: 'https://customer-assets.emergentagent.com/job_visual-preview-10/artifacts/attdwhwf_image.png',
    textColor: 'text-white',
    overlayColor: 'bg-black/30',
    category: 'traditional'
  },
  {
    id: 2,
    name: 'Sparkling Diwali',
    url: 'https://customer-assets.emergentagent.com/job_visual-preview-10/artifacts/7rgp6pgp_image.png',
    textColor: 'text-white',
    overlayColor: 'bg-black/20',
    category: 'traditional'
  },
  {
    id: 3,
    name: 'Golden Diyas',
    url: 'https://images.unsplash.com/photo-1636619773834-c7e0762ddfe1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxkaXdhbGklMjBsaWdodHN8ZW58MHx8fHwxNzU5NTc0NTc4fDA&ixlib=rb-4.1.0&q=85&w=800&h=600',
    textColor: 'text-white',
    overlayColor: 'bg-black/30',
    category: 'traditional'
  },
  {
    id: 4,
    name: 'Traditional Template',
    url: 'https://customer-assets.emergentagent.com/job_visual-preview-10/artifacts/n8ssbdc3_image.png',
    textColor: 'text-purple-800',
    overlayColor: 'bg-transparent',
    category: 'traditional',
    isTemplate: true
  },
  {
    id: 5,
    name: 'Palace Rangoli',
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    textColor: 'text-white',
    overlayColor: 'bg-black/35',
    category: 'traditional'
  },
  {
    id: 6,
    name: 'Marigold Flowers',
    url: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=800&h=600&fit=crop',
    textColor: 'text-white',
    overlayColor: 'bg-black/30',
    category: 'nature'
  },
  {
    id: 7,
    name: 'Fireworks Night',
    url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop',
    textColor: 'text-white',
    overlayColor: 'bg-black/45',
    category: 'celebration'
  },
  {
    id: 8,
    name: 'Elegant Candles',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&h=600&fit=crop',
    textColor: 'text-white',
    overlayColor: 'bg-black/40',
    category: 'elegant'
  },
  {
    id: 9,
    name: 'Golden Mandala',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=600&fit=crop',
    textColor: 'text-white',
    overlayColor: 'bg-black/35',
    category: 'traditional'
  },
  {
    id: 10,
    name: 'Lotus Petals',
    url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&h=600&fit=crop',
    textColor: 'text-white',
    overlayColor: 'bg-black/30',
    category: 'nature'
  },
  {
    id: 11,
    name: 'Peacock Feathers',
    url: 'https://images.unsplash.com/photo-1517137685593-78935a695925?w=800&h=600&fit=crop',
    textColor: 'text-white',
    overlayColor: 'bg-black/40',
    category: 'nature'
  },
  {
    id: 12,
    name: 'Glowing Lanterns',
    url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c89a?w=800&h=600&fit=crop',
    textColor: 'text-white',
    overlayColor: 'bg-black/35',
    category: 'modern'
  }
];

const GreetingsForm = () => {
  const [greetingData, setGreetingData] = useState({
    recipientName: '',
    senderName: '',
    relationship: '',
    selectedMessage: '',
    customMessage: '',
    selectedArtwork: greetingArtworks[0]
  });
  const [showMoreArtworks, setShowMoreArtworks] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const greetingCardRef = useRef(null);

  const handleRelationshipChange = (relationship) => {
    setGreetingData(prev => ({
      ...prev,
      relationship,
      selectedMessage: greetingMessages[relationship]?.[0] || '',
      customMessage: ''
    }));
  };

  const handleMessageSelect = (message) => {
    setGreetingData(prev => ({ ...prev, selectedMessage: message, customMessage: '' }));
  };

  const getFinalMessage = () => {
    const message = greetingData.customMessage || greetingData.selectedMessage;
    return message || 'May this Diwali bring endless joy, prosperity, and happiness to your life. Wishing you a festival filled with light, love, and sweet moments!';
  };

  // Check if greeting details are filled
  const isGreetingDetailsComplete = () => {
    return greetingData.recipientName && 
           greetingData.senderName && 
           (greetingData.customMessage || greetingData.selectedMessage);
  };

  const handleCreateGreeting = () => {
    if (!greetingData.recipientName || !greetingData.senderName || !greetingData.relationship) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate sharing options.",
        variant: "destructive"
      });
      return;
    }
    setShowPreview(true);
    toast({
      title: "Ready to Share!",
      description: "Your personalized Diwali greeting is ready to share with your loved ones.",
    });
  };

  const handleCopyGreeting = async () => {
    const fullMessage = `🪔 Happy Diwali! 🪔\n\nDear ${greetingData.recipientName || '[Recipient Name]'},\n\n${getFinalMessage()}\n\nWith love and warm wishes,\n${greetingData.senderName || '[Your Name]'}\n\n✨ Wishing you joy, prosperity & happiness! ✨`;
    
    try {
      // Try modern Clipboard API first
      await navigator.clipboard.writeText(fullMessage);
      toast({
        title: "Copied to Clipboard!",
        description: "Your Diwali greeting has been copied. You can now paste it anywhere.",
      });
    } catch (err) {
      // Fallback to older method if Clipboard API is blocked
      try {
        const textArea = document.createElement('textarea');
        textArea.value = fullMessage;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        toast({
          title: "Copied to Clipboard!",
          description: "Your Diwali greeting has been copied. You can now paste it anywhere.",
        });
      } catch (fallbackErr) {
        // If both methods fail, show the text to copy manually
        toast({
          title: "Copy Failed",
          description: "Please copy the text from the preview manually.",
          variant: "destructive"
        });
      }
    }
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(`🪔 *Happy Diwali!* 🪔\n\n*Dear ${greetingData.recipientName || '[Recipient Name]'},*\n\n${getFinalMessage()}\n\n*With love and warm wishes,*\n*${greetingData.senderName || '[Your Name]'}*\n\n✨ _Wishing you joy, prosperity & happiness!_ ✨`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareSMS = () => {
    const message = encodeURIComponent(`🪔 Happy Diwali! 🪔\n\nDear ${greetingData.recipientName || '[Recipient Name]'},\n\n${getFinalMessage()}\n\nWith love,\n${greetingData.senderName || '[Your Name]'}`);
    const smsUrl = `sms:?body=${message}`;
    window.location.href = smsUrl;
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('🪔 Happy Diwali Greetings! 🪔');
    const body = encodeURIComponent(`Dear ${greetingData.recipientName || '[Recipient Name]'},\n\n${getFinalMessage()}\n\nWishing you joy, prosperity & happiness this Diwali!\n\nWith love,\n${greetingData.senderName || '[Your Name]'}\n\n✨🪔✨`);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
  };

  const handleDownloadCard = async () => {
    if (greetingCardRef.current) {
      try {
        toast({
          title: "Generating Card...",
          description: "Please wait while we create your greeting card image.",
        });

        const canvas = await html2canvas(greetingCardRef.current, {
          useCORS: true,
          scale: 3, // High quality for crisp image
          backgroundColor: '#ffffff',
          allowTaint: false,
          foreignObjectRendering: true,
          logging: false
        });

        const image = canvas.toDataURL('image/png', 1.0);
        
        // Create download link
        const link = document.createElement('a');
        link.href = image;
        link.download = `diwali-greeting-${greetingData.recipientName || 'card'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "Card Downloaded! 🎉",
          description: "Your greeting card has been saved. You can now share it via WhatsApp or any platform!",
        });
      } catch (error) {
        console.error('Error generating card:', error);
        toast({
          title: "Download Failed",
          description: "Sorry, we couldn't generate your card. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleShareWhatsAppWithCard = () => {
    toast({
      title: "Download Card First! 📱",
      description: "Click 'Download Card' button, then share the downloaded image via WhatsApp for the complete visual greeting!",
      duration: 5000
    });
    
    // Still provide text option
    setTimeout(() => {
      const message = encodeURIComponent(`🪔 *Happy Diwali!* 🪔\n\n*Dear ${greetingData.recipientName || '[Recipient Name]'},*\n\n${getFinalMessage()}\n\n*With love and warm wishes,*\n*${greetingData.senderName || '[Your Name]'}*\n\n✨ _Wishing you joy, prosperity & happiness!_ ✨\n\n💌 _I've created a beautiful greeting card for you! Please check the downloaded image._`);
      const whatsappUrl = `https://wa.me/?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }, 1000);
  };

  // Template rendering function removed - now using simple artwork selection

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
          Create Diwali Greetings
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Send personalized Diwali wishes to your loved ones with our beautiful greeting cards
        </p>
      </div>

      {/* Artwork Selection */}
      <Card className="border-orange-200 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-orange-700 flex items-center justify-center space-x-2">
            <Sparkles className="w-6 h-6" />
            <span>Select Artwork</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Show first 4 artworks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {greetingArtworks.slice(0, 4).map((artwork) => (
              <Card 
                key={artwork.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  greetingData.selectedArtwork.id === artwork.id 
                    ? 'border-orange-500 ring-4 ring-orange-200 shadow-2xl scale-105' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => setGreetingData(prev => ({ ...prev, selectedArtwork: artwork }))}
              >
                <CardContent className="p-2">
                  <div className="relative aspect-square rounded-lg overflow-hidden group bg-gray-100">
                    <img 
                      src={artwork.url} 
                      alt={artwork.name} 
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 ${artwork.overlayColor} flex items-center justify-center`}>
                      {greetingData.selectedArtwork.id === artwork.id && (
                        <div className="absolute top-1 right-1">
                          <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <h4 className="font-medium text-gray-800 text-xs">{artwork.name}</h4>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Show More/Less Button */}
          <div className="text-center">
            <Button
              onClick={() => setShowMoreArtworks(!showMoreArtworks)}
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50"
            >
              {showMoreArtworks ? 'Show Less' : 'Show More Artworks'}
              <span className="ml-1">{showMoreArtworks ? '↑' : '↓'}</span>
            </Button>
          </div>

          {/* Additional artworks - collapsible */}
          {showMoreArtworks && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 animate-in slide-in-from-top duration-300">
              {greetingArtworks.slice(4).map((artwork) => (
                <Card 
                  key={artwork.id} 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                    greetingData.selectedArtwork.id === artwork.id 
                      ? 'border-orange-500 ring-4 ring-orange-200 shadow-2xl scale-105' 
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => setGreetingData(prev => ({ ...prev, selectedArtwork: artwork }))}
                >
                  <CardContent className="p-2">
                    <div className="relative aspect-square rounded-lg overflow-hidden group bg-gray-100">
                      <img 
                        src={artwork.url} 
                        alt={artwork.name} 
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 ${artwork.overlayColor} flex items-center justify-center`}>
                        {greetingData.selectedArtwork.id === artwork.id && (
                          <div className="absolute top-1 right-1">
                            <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <h4 className="font-medium text-gray-800 text-xs">{artwork.name}</h4>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personalization Form - Left Side */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Personalize Your Greeting</h3>
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-xl text-orange-700 flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Fill Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">Recipient Name *</Label>
                  <Input
                    id="recipientName"
                    value={greetingData.recipientName}
                    onChange={(e) => setGreetingData(prev => ({ ...prev, recipientName: e.target.value }))}
                    placeholder="Who are you sending this to?"
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderName">Your Name *</Label>
                  <Input
                    id="senderName"
                    value={greetingData.senderName}
                    onChange={(e) => setGreetingData(prev => ({ ...prev, senderName: e.target.value }))}
                    placeholder="Your name"
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Relationship *</Label>
                <Select value={greetingData.relationship} onValueChange={handleRelationshipChange}>
                  <SelectTrigger className="border-orange-200 focus:border-orange-400">
                    <SelectValue placeholder="Select your relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center space-x-2">
                          <span>{type.icon}</span>
                          <span>{type.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {greetingData.relationship && (
                <div className="space-y-4">
                  <Label>Choose a Message Template</Label>
                  <div className="grid gap-3">
                    {greetingMessages[greetingData.relationship]?.map((message, index) => (
                      <Card 
                        key={index} 
                        className={`cursor-pointer transition-all hover:border-orange-300 ${
                          greetingData.selectedMessage === message 
                            ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50' 
                            : 'border-gray-200'
                        }`}
                        onClick={() => handleMessageSelect(message)}
                      >
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-700">{message}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="customMessage">Or Write Your Custom Message</Label>
                <Textarea
                  id="customMessage"
                  value={greetingData.customMessage}
                  onChange={(e) => setGreetingData(prev => ({ ...prev, customMessage: e.target.value }))}
                  placeholder="Write your personalized Diwali message here..."
                  className="border-orange-200 focus:border-orange-400 min-h-24"
                />
              </div>

              {/* Background selection removed - now using artwork selection above */}
            </CardContent>
          </Card>
        </div>

        {/* Live Preview and Share - Right Side */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Live Preview</h3>
          {/* Greeting Card Preview */}
          <div className="w-full max-h-[800px] overflow-y-auto">
            <Card className="border-2 border-orange-300 overflow-hidden shadow-lg w-full">
              <CardContent className="p-0">
                {/* Artwork Image - Top Section */}
                <div className="w-full flex justify-center bg-gray-50">
                  <img 
                    src={greetingData.selectedArtwork.url} 
                    alt="Diwali Artwork" 
                    className="max-w-full max-h-80 object-contain"
                  />
                </div>
                
                {/* Text Section - Bottom Section */}
                <div className="bg-white p-6 space-y-4 min-h-[200px]">
                  {/* To Section */}
                  <div>
                    <p className="text-orange-600 text-sm font-medium mb-1">To,</p>
                    <p className="text-lg font-bold text-gray-800 font-serif">
                      {greetingData.recipientName || '[Recipient Name]'}
                    </p>
                  </div>
                  
                  {/* Message Section */}
                  <div className="border-l-4 border-orange-400 pl-4 py-2">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                      {getFinalMessage()}
                    </p>
                  </div>

                  {/* From Section */}
                  <div className="text-right">
                    <p className="text-orange-600 text-sm font-medium mb-1">From,</p>
                    <p className="text-lg font-bold text-gray-800 font-serif">
                      {greetingData.senderName || '[Your Name]'}
                    </p>
                  </div>

                  {/* Footer decoration */}
                  <div className="text-center pt-4 border-t border-orange-100">
                    <div className="flex justify-center space-x-4 mb-2">
                      <span className="text-xl">🎊</span>
                      <span className="text-xl">🪔</span>
                      <span className="text-xl">🎊</span>
                    </div>
                    <p className="text-xs text-orange-600 font-medium">
                      Wishing you joy & prosperity! ✨
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Share Options - Conditional Visibility */}
          <Card className="mt-6 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
            <CardContent className="p-6">
              <h4 className="text-xl font-bold text-orange-700 mb-2 text-center flex items-center justify-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>Share Your Greeting</span>
              </h4>
              
              {isGreetingDetailsComplete() ? (
                <>
                  <p className="text-gray-600 text-sm text-center mb-4">
                    Choose how you'd like to share your personalized Diwali greeting
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={handleShareWhatsApp}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-xl flex flex-col items-center space-y-2 h-auto"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-xs font-medium">WhatsApp</span>
                    </Button>
                    
                    <Button 
                      onClick={handleShareSMS}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-xl flex flex-col items-center space-y-2 h-auto"
                      title="Share via SMS"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="text-xs font-medium">SMS</span>
                    </Button>
                    
                    <Button 
                      onClick={handleShareEmail}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-3 rounded-xl flex flex-col items-center space-y-2 h-auto"
                      title="Share via Email"
                    >
                      <Mail className="w-5 h-5" />
                      <span className="text-xs font-medium">Email</span>
                    </Button>
                    
                    <Button 
                      onClick={handleCopyGreeting}
                      variant="outline"
                      className="border-orange-300 text-orange-600 hover:bg-gradient-to-br hover:from-orange-100 hover:to-amber-100 p-3 rounded-xl flex flex-col items-center space-y-2 h-auto"
                      title="Copy to Clipboard"
                    >
                      <Copy className="w-5 h-5" />
                      <span className="text-xs font-medium">Copy</span>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm mb-3">
                    📝 Fill in all the greeting details to enable sharing options
                  </p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>✓ Recipient Name {greetingData.recipientName ? '✅' : '❌'}</p>
                    <p>✓ Your Name {greetingData.senderName ? '✅' : '❌'}</p>
                    <p>✓ Message {(greetingData.customMessage || greetingData.selectedMessage) ? '✅' : '❌'}</p>
                  </div>
                </div>
              )}
              
              {(!greetingData.recipientName || !greetingData.senderName) && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm text-center">
                    💡 Fill in recipient and sender names to personalize your greeting!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GreetingsForm;