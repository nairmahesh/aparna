import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Heart, Share2, Copy, Download, Sparkles, Send, Palette } from 'lucide-react';
import { relationshipTypes, greetingMessages } from '../data/mock';
import { useToast } from '../hooks/use-toast';

const greetingBackgrounds = [
  {
    id: 1,
    name: 'Colorful String Lights',
    url: 'https://images.unsplash.com/photo-1557932541-016894d7b7f6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxkaXdhbGklMjBsaWdodHN8ZW58MHx8fHwxNzU5NTc0NTc4fDA&ixlib=rb-4.1.0&q=85&w=800&h=600',
    textColor: 'text-white',
    overlayColor: 'bg-black/40'
  },
  {
    id: 2,
    name: 'Traditional Diyas',
    url: 'https://images.unsplash.com/photo-1636619773834-c7e0762ddfe1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxkaXdhbGklMjBsaWdodHN8ZW58MHx8fHwxNzU5NTc0NTc4fDA&ixlib=rb-4.1.0&q=85&w=800&h=600',
    textColor: 'text-white',
    overlayColor: 'bg-black/30'
  },
  {
    id: 3,
    name: 'Warm Bokeh Lights',
    url: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxkaXdhbGklMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc1OTU3NDU3Mnww&ixlib=rb-4.1.0&q=85&w=800&h=600',
    textColor: 'text-white',
    overlayColor: 'bg-black/40'
  },
  {
    id: 4,
    name: 'Festive Sparklers',
    url: 'https://images.pexels.com/photos/288478/pexels-photo-288478.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    textColor: 'text-white',
    overlayColor: 'bg-black/50'
  }
];

const GreetingsForm = () => {
  const [greetingData, setGreetingData] = useState({
    recipientName: '',
    senderName: '',
    relationship: '',
    selectedMessage: '',
    customMessage: '',
    selectedBackground: greetingBackgrounds[0]
  });
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
    return message
      .replace(/\[Recipient\]/g, greetingData.recipientName || '[Recipient Name]')
      .replace(/\[Sender\]/g, greetingData.senderName || '[Your Name]');
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
    navigator.clipboard.writeText(getFinalMessage());
    toast({
      title: "Copied to Clipboard!",
      description: "Your Diwali greeting has been copied. You can now paste it anywhere.",
    });
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(`🪔 *Happy Diwali!* 🪔\n\n*To: ${greetingData.recipientName}*\n\n${getFinalMessage()}\n\n*From: ${greetingData.senderName}*\n\n✨ Wishing you joy, prosperity & happiness! ✨`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleShareSMS = () => {
    const message = encodeURIComponent(`Happy Diwali!\n\nTo: ${greetingData.recipientName}\n\n${getFinalMessage()}\n\nFrom: ${greetingData.senderName}`);
    window.open(`sms:?body=${message}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('🪔 Happy Diwali Greetings! 🪔');
    const body = encodeURIComponent(`Dear ${greetingData.recipientName},\n\n${getFinalMessage()}\n\nWishing you joy, prosperity & happiness this Diwali!\n\nWith love,\n${greetingData.senderName}\n\n✨🪔✨`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
          Create Diwali Greetings
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Send personalized Diwali wishes to your loved ones with our beautiful greeting cards
        </p>
      </div>

      {/* Greeting Card Preview - Always Visible */}
      <div className="relative">
        {/* Decorative elements around the card */}
        <div className="absolute -top-4 -left-4 text-4xl animate-pulse">✨</div>
        <div className="absolute -top-4 -right-4 text-4xl animate-pulse">🪔</div>
        <div className="absolute -bottom-4 -left-4 text-4xl animate-pulse">🎊</div>
        <div className="absolute -bottom-4 -right-4 text-4xl animate-pulse">🎆</div>
        
        <Card className="border-4 border-gradient-to-r from-orange-400 to-amber-400 overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
          <CardContent className="p-0">
            <div className="relative h-96 md:h-[500px]">
              {/* Background Image */}
              <img 
                src={greetingData.selectedBackground.url} 
                alt="Diwali Background" 
                className="w-full h-full object-cover"
              />
              
              {/* Decorative border overlay */}
              <div className="absolute inset-0 border-8 border-gradient-to-r from-orange-300/30 to-amber-300/30 rounded-lg"></div>
              
              {/* Overlay for better text readability */}
              <div className={`absolute inset-0 ${greetingData.selectedBackground.overlayColor}`}></div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-8">
                {/* Header with enhanced styling */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="text-5xl md:text-6xl mb-4 animate-bounce">🪔</div>
                    <div className="absolute -top-2 -left-8 text-2xl animate-pulse">✨</div>
                    <div className="absolute -top-2 -right-8 text-2xl animate-pulse">✨</div>
                  </div>
                  <h2 className={`text-3xl md:text-4xl font-bold ${greetingData.selectedBackground.textColor} mb-2 drop-shadow-2xl font-serif`}>
                    🌟 Happy Diwali! 🌟
                  </h2>
                  <div className="flex justify-center space-x-3 mb-6">
                    <span className="text-2xl animate-pulse">✨</span>
                    <span className="text-2xl animate-pulse">🎆</span>
                    <span className="text-2xl animate-pulse">🎇</span>
                    <span className="text-2xl animate-pulse">✨</span>
                  </div>
                </div>

                {/* Main Content with enhanced design */}
                <div className="flex-1 flex flex-col justify-center">
                  {/* To Section */}
                  <div className="bg-gradient-to-br from-white/95 to-orange-50/95 backdrop-blur-sm rounded-2xl p-6 mb-4 shadow-2xl border-2 border-orange-200/50">
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-bold">TO</span>
                        </div>
                        <p className="text-xl font-bold text-gray-800 font-serif">
                          {greetingData.recipientName || '[Recipient Name]'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Message with enhanced styling */}
                    <div className="mb-4 relative">
                      <div className="absolute -left-2 -top-2 text-orange-400 text-2xl">"</div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-center italic font-medium px-4">
                        {getFinalMessage()}
                      </p>
                      <div className="absolute -right-2 -bottom-2 text-orange-400 text-2xl">"</div>
                    </div>
                  </div>

                  {/* From Section with enhanced design */}
                  <div className="text-right">
                    <div className="bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-sm rounded-2xl p-4 inline-block shadow-2xl border-2 border-amber-200/50">
                      <div className="flex items-center justify-end">
                        <p className="text-lg font-bold text-gray-800 mr-3 font-serif">
                          {greetingData.senderName || '[Your Name]'}
                        </p>
                        <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">FROM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Decoration with enhanced effects */}
                <div className="text-center">
                  <div className="flex justify-center space-x-6">
                    <span className="text-3xl animate-pulse">🎊</span>
                    <span className="text-3xl animate-bounce">🪔</span>
                    <span className="text-3xl animate-pulse">🎊</span>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="inline-block bg-gradient-to-r from-orange-400/80 to-amber-400/80 px-4 py-2 rounded-full">
                      <span className={`text-sm font-semibold ${greetingData.selectedBackground.textColor} drop-shadow-lg`}>
                        Wishing you joy, prosperity & happiness! ✨
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personalization Options */}
      {!showPreview ? (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-700 flex items-center space-x-2">
              <Heart className="w-6 h-6" />
              <span>Personalize Your Greeting</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          ? 'border-orange-500 bg-orange-50' 
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
              <p className="text-xs text-gray-500">
                Tip: You can use [Recipient] and [Sender] as placeholders for names
              </p>
            </div>

            <div className="space-y-4">
              <Label className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>Choose Background Design</span>
              </Label>
              <div className="grid grid-cols-2 gap-4">
                {greetingBackgrounds.map((bg) => (
                  <Card 
                    key={bg.id} 
                    className={`cursor-pointer transition-all hover:border-orange-300 ${
                      greetingData.selectedBackground.id === bg.id 
                        ? 'border-orange-500 ring-2 ring-orange-200' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => setGreetingData(prev => ({ ...prev, selectedBackground: bg }))}
                  >
                    <CardContent className="p-2">
                      <div className="relative h-24 rounded-md overflow-hidden">
                        <img 
                          src={bg.url} 
                          alt={bg.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute inset-0 ${bg.overlayColor} flex items-center justify-center`}>
                          <span className={`text-xs font-medium ${bg.textColor}`}>
                            {bg.name}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleCreateGreeting}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-6 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Sharing Options
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  onClick={handleShareWhatsApp}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium"
                >
                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-2 bg-white rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">📱</span>
                    </div>
                    WhatsApp
                  </div>
                </Button>
                
                <Button 
                  onClick={handleShareSMS}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium"
                >
                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-2 bg-white rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">💬</span>
                    </div>
                    SMS
                  </div>
                </Button>
                
                <Button 
                  onClick={handleShareEmail}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium"
                >
                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-2 bg-white rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-xs font-bold">📧</span>
                    </div>
                    Email
                  </div>
                </Button>
                
                <Button 
                  onClick={handleCopyGreeting}
                  variant="outline"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50 font-medium"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Text
                </Button>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button 
                  onClick={() => setShowPreview(false)}
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  ← Edit Greeting
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Create Another Greeting */}
          <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-orange-700 mb-4">Want to create more greetings?</h3>
              <Button 
                onClick={() => {
                  setGreetingData({
                    recipientName: '',
                    senderName: greetingData.senderName, // Keep sender name
                    relationship: '',
                    selectedMessage: '',
                    customMessage: '',
                    selectedBackground: greetingData.selectedBackground // Keep selected background
                  });
                  setShowPreview(false);
                }}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Create Another Greeting
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GreetingsForm;