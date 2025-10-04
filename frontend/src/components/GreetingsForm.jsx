import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Heart, Share2, Copy, Download, Sparkles, Send, MessageCircle, Mail, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { relationshipTypes, greetingMessages } from '../data/mock';
import { useToast } from '../hooks/use-toast';

const greetingArtworks = [
  {
    id: 1,
    name: 'Golden Diyas',
    url: 'https://images.unsplash.com/photo-1636619773834-c7e0762ddfe1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxkaXdhbGklMjBsaWdodHN8ZW58MHx8fHwxNzU5NTc0NTc4fDA&ixlib=rb-4.1.0&q=85&w=800&h=600',
    textColor: 'text-white',
    overlayColor: 'bg-black/30',
    category: 'traditional'
  },
  {
    id: 2,
    name: 'Colorful String Lights',
    url: 'https://images.unsplash.com/photo-1557932541-016894d7b7f6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxkaXdhbGklMjBsaWdodHN8ZW58MHx8fHwxNzU5NTc0NTc4fDA&ixlib=rb-4.1.0&q=85&w=800&h=600',
    textColor: 'text-white',
    overlayColor: 'bg-black/40',
    category: 'modern'
  },
  {
    id: 3,
    name: 'Warm Bokeh Lights',
    url: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxkaXdhbGklMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc1OTU3NDU3Mnww&ixlib=rb-4.1.0&q=85&w=800&h=600',
    textColor: 'text-white',
    overlayColor: 'bg-black/40',
    category: 'elegant'
  },
  {
    id: 4,
    name: 'Festive Sparklers',
    url: 'https://images.pexels.com/photos/288478/pexels-photo-288478.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    textColor: 'text-white',
    overlayColor: 'bg-black/50',
    category: 'celebration'
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

  const handleCopyGreeting = () => {
    const fullMessage = `🪔 Happy Diwali! 🪔\n\nDear ${greetingData.recipientName || '[Recipient Name]'},\n\n${getFinalMessage()}\n\nWith love and warm wishes,\n${greetingData.senderName || '[Your Name]'}\n\n✨ Wishing you joy, prosperity & happiness! ✨`;
    navigator.clipboard.writeText(fullMessage);
    toast({
      title: "Copied to Clipboard!",
      description: "Your Diwali greeting has been copied. You can now paste it anywhere.",
    });
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
                  <div className="relative h-24 md:h-32 rounded-lg overflow-hidden group">
                    <img 
                      src={artwork.url} 
                      alt={artwork.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
                    <div className="relative h-24 md:h-32 rounded-lg overflow-hidden group">
                      <img 
                        src={artwork.url} 
                        alt={artwork.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
      </div>
    </div>
  );
};

export default GreetingsForm;