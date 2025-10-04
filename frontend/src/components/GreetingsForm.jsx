import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Heart, Share2, Copy, Download, Sparkles, Send, Palette, MessageCircle, Mail, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { relationshipTypes, greetingMessages } from '../data/mock';
import { useToast } from '../hooks/use-toast';

const greetingTemplates = [
  {
    id: 1,
    name: 'Classic Elegance',
    description: 'Traditional layout with elegant styling',
    preview: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=300&h=200&fit=crop',
    layout: 'classic'
  },
  {
    id: 2,
    name: 'Modern Festive',
    description: 'Contemporary design with vibrant colors',
    preview: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    layout: 'modern'
  },
  {
    id: 3,
    name: 'Traditional Heritage',
    description: 'Ancient motifs with cultural elements',
    preview: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=200&fit=crop',
    layout: 'traditional'
  },
  {
    id: 4,
    name: 'Minimalist Chic',
    description: 'Clean and simple design',
    preview: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    layout: 'minimalist'
  }
];

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
    selectedBackground: greetingBackgrounds[0],
    selectedTemplate: greetingTemplates[0]
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

  const renderTemplateLayout = () => {
    const templateType = greetingData.selectedTemplate.layout;
    
    switch (templateType) {
      case 'modern':
        return (
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* Modern Header */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-400/90 to-amber-400/90 rounded-3xl p-4 mb-4 backdrop-blur-sm">
                <h2 className="text-4xl font-bold text-white mb-2 font-sans">
                  🪔 HAPPY DIWALI 🪔
                </h2>
                <div className="flex justify-center space-x-2">
                  <span className="text-lg animate-pulse">✨</span>
                  <span className="text-lg animate-bounce">🎆</span>
                  <span className="text-lg animate-pulse">✨</span>
                </div>
              </div>
            </div>

            {/* Modern Content */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div className="bg-white/95 rounded-2xl p-6 shadow-2xl border-l-4 border-orange-400">
                <div className="mb-3">
                  <Badge className="bg-gradient-to-r from-orange-400 to-amber-400 text-white px-3 py-1">
                    TO: {greetingData.recipientName || 'Dear Friend'}
                  </Badge>
                </div>
                <p className="text-gray-700 text-center font-medium leading-relaxed">
                  {getFinalMessage()}
                </p>
              </div>
              
              <div className="text-right">
                <div className="bg-gradient-to-r from-amber-400/95 to-orange-400/95 rounded-xl p-3 inline-block">
                  <span className="text-white font-bold">
                    — {greetingData.senderName || 'Your Name'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-400/80 to-amber-400/80 rounded-full px-6 py-2">
                <span className="text-white text-sm font-bold">Joy • Prosperity • Happiness ✨</span>
              </div>
            </div>
          </div>
        );

      case 'traditional':
        return (
          <div className="absolute inset-0 flex flex-col justify-between p-8">
            {/* Traditional Header with ornate design */}
            <div className="text-center">
              <div className="border-4 border-double border-orange-300 bg-gradient-to-r from-orange-50/90 to-amber-50/90 rounded-lg p-4 mb-4 backdrop-blur-sm">
                <div className="text-4xl mb-2">🕉️</div>
                <h2 className={`text-3xl font-bold ${greetingData.selectedBackground.textColor} font-serif`}>
                  शुभ दीपावली
                </h2>
                <p className={`text-lg ${greetingData.selectedBackground.textColor} font-serif`}>
                  Happy Diwali
                </p>
                <div className="flex justify-center space-x-3 mt-2">
                  <span className="text-xl">🪔</span>
                  <span className="text-xl">🪔</span>
                  <span className="text-xl">🪔</span>
                </div>
              </div>
            </div>

            {/* Traditional Content with ornate borders */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="bg-gradient-to-br from-orange-50/95 to-amber-50/95 backdrop-blur-sm rounded-lg p-6 border-4 border-double border-orange-300 shadow-2xl">
                <div className="text-center mb-4">
                  <div className="inline-block bg-gradient-to-r from-orange-200 to-amber-200 px-4 py-2 rounded-full">
                    <span className="text-orange-800 font-bold font-serif">
                      प्रिय {greetingData.recipientName || 'मित्र'}
                    </span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-3 -top-2 text-orange-400 text-3xl font-serif">❝</div>
                  <p className="text-gray-700 text-center font-serif leading-relaxed px-4 italic">
                    {getFinalMessage()}
                  </p>
                  <div className="absolute -right-3 -bottom-2 text-orange-400 text-3xl font-serif">❞</div>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <div className="bg-gradient-to-r from-amber-100/90 to-orange-100/90 rounded-lg p-3 inline-block border-2 border-orange-300">
                  <span className="text-orange-800 font-bold font-serif">
                    {greetingData.senderName || 'Your Name'} के द्वारा
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex justify-center space-x-4">
                <span className="text-2xl animate-pulse">🪔</span>
                <span className="text-2xl">🕉️</span>
                <span className="text-2xl animate-pulse">🪔</span>
              </div>
            </div>
          </div>
        );

      case 'minimalist':
        return (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-8">
            {/* Minimalist Design */}
            <div className="text-center space-y-8 max-w-md">
              <div className="space-y-4">
                <div className="text-6xl">🪔</div>
                <h2 className={`text-2xl font-light ${greetingData.selectedBackground.textColor}`}>
                  Happy Diwali
                </h2>
                <div className="w-16 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto"></div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className={`text-sm ${greetingData.selectedBackground.textColor} opacity-75`}>TO</p>
                  <p className={`text-xl font-medium ${greetingData.selectedBackground.textColor}`}>
                    {greetingData.recipientName || 'Dear Friend'}
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <p className={`${greetingData.selectedBackground.textColor} text-center leading-relaxed`}>
                    {getFinalMessage()}
                  </p>
                </div>
                
                <div>
                  <p className={`text-sm ${greetingData.selectedBackground.textColor} opacity-75`}>FROM</p>
                  <p className={`text-lg font-medium ${greetingData.selectedBackground.textColor}`}>
                    {greetingData.senderName || 'Your Name'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="w-8 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto"></div>
                <p className={`text-xs ${greetingData.selectedBackground.textColor} opacity-75`}>
                  Joy • Prosperity • Happiness
                </p>
              </div>
            </div>
          </div>
        );

      default: // classic
        return (
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
                      {greetingData.recipientName || 'Dear [Recipient Name]'}
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
                      {greetingData.senderName || 'From [Your Name]'}
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
        );
    }
  };

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

      {/* Template Selection */}
      <Card className="border-orange-200 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-orange-700 flex items-center justify-center space-x-2">
            <Sparkles className="w-6 h-6" />
            <span>Choose Your Template</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {greetingTemplates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  greetingData.selectedTemplate.id === template.id 
                    ? 'border-orange-500 ring-4 ring-orange-200 shadow-2xl scale-105' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => setGreetingData(prev => ({ ...prev, selectedTemplate: template }))}
              >
                <CardContent className="p-3">
                  <div className="relative h-32 rounded-lg overflow-hidden group mb-3">
                    <img 
                      src={template.preview} 
                      alt={template.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="text-center">
                        {greetingData.selectedTemplate.id === template.id && (
                          <div className="bg-white/90 rounded-full px-3 py-1">
                            <span className="text-orange-600 text-xs font-bold">✓ Selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {greetingData.selectedTemplate.id === template.id && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-gray-800 text-sm">{template.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Preview - Left Side */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Live Preview</h3>
          {/* Greeting Card Preview */}
          <div className="relative">
            {/* Decorative elements around the card */}
            <div className="absolute -top-4 -left-4 text-4xl animate-pulse">✨</div>
            <div className="absolute -top-4 -right-4 text-4xl animate-pulse">🪔</div>
            <div className="absolute -bottom-4 -left-4 text-4xl animate-pulse">🎊</div>
            <div className="absolute -bottom-4 -right-4 text-4xl animate-pulse">🎆</div>
            
            <Card className="border-4 border-gradient-to-r from-orange-400 to-amber-400 overflow-hidden shadow-2xl transform transition-all duration-300">
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
                  
                  {/* Content Overlay - Template Based */}
                  {renderTemplateLayout()}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sharing Options - Always visible when names are filled */}
          {greetingData.recipientName && greetingData.senderName && (
            <Card className="mt-6 border-orange-200">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Share Your Greeting</h4>
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={handleShareWhatsApp}
                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center"
                    title="Share on WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                  
                  <Button 
                    onClick={handleShareSMS}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center"
                    title="Share via SMS"
                  >
                    <Phone className="w-5 h-5" />
                  </Button>
                  
                  <Button 
                    onClick={handleShareEmail}
                    className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center"
                    title="Share via Email"
                  >
                    <Mail className="w-5 h-5" />
                  </Button>
                  
                  <Button 
                    onClick={handleCopyGreeting}
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 p-3 rounded-full w-12 h-12 flex items-center justify-center"
                    title="Copy to Clipboard"
                  >
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Personalization Form - Right Side */}
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
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-2 rounded-full">
                    <Palette className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-orange-700">Choose Your Perfect Background</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {greetingBackgrounds.map((bg) => (
                    <Card 
                      key={bg.id} 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                        greetingData.selectedBackground.id === bg.id 
                          ? 'border-orange-500 ring-4 ring-orange-200 shadow-2xl scale-105' 
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                      onClick={() => setGreetingData(prev => ({ ...prev, selectedBackground: bg }))}
                    >
                      <CardContent className="p-3">
                        <div className="relative h-24 rounded-lg overflow-hidden group">
                          <img 
                            src={bg.url} 
                            alt={bg.name} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className={`absolute inset-0 ${bg.overlayColor} flex items-center justify-center transition-opacity duration-300`}>
                            <div className="text-center">
                              <span className={`text-sm font-bold ${bg.textColor} drop-shadow-lg`}>
                                {bg.name}
                              </span>
                              {greetingData.selectedBackground.id === bg.id && (
                                <div className="mt-2">
                                  <div className="inline-block bg-white/90 rounded-full px-3 py-1">
                                    <span className="text-orange-600 text-xs font-bold">✓ Selected</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          {greetingData.selectedBackground.id === bg.id && (
                            <div className="absolute top-2 right-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GreetingsForm;