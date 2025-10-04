import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Heart, Share2, Copy, Download, Sparkles, Send } from 'lucide-react';
import { relationshipTypes, greetingMessages } from '../data/mock';
import { useToast } from '../hooks/use-toast';

const GreetingsForm = () => {
  const [greetingData, setGreetingData] = useState({
    recipientName: '',
    senderName: '',
    relationship: '',
    selectedMessage: '',
    customMessage: ''
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
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    setShowPreview(true);
    toast({
      title: "Greeting Created!",
      description: "Your personalized Diwali greeting is ready to share.",
    });
  };

  const handleCopyGreeting = () => {
    navigator.clipboard.writeText(getFinalMessage());
    toast({
      title: "Copied to Clipboard!",
      description: "Your Diwali greeting has been copied. You can now paste it anywhere.",
    });
  };

  const handleShareGreeting = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Diwali Greetings',
        text: getFinalMessage(),
      });
    } else {
      handleCopyGreeting();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
          Create Diwali Greetings
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Send personalized Diwali wishes to your loved ones with our beautiful greeting cards
        </p>
      </div>

      {!showPreview ? (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-700 flex items-center space-x-2">
              <Heart className="w-6 h-6" />
              <span>Create Your Greeting</span>
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

            <Button 
              onClick={handleCreateGreeting}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-6 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create My Greeting
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Greeting Preview */}
          <Card className="border-4 border-gradient-to-r from-orange-400 to-amber-400">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-400 p-1 rounded-lg">
                <div className="bg-white rounded-md p-8 text-center space-y-6">
                  <div className="text-6xl mb-4">🪔</div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
                    Happy Diwali!
                  </h2>
                  <div className="max-w-2xl mx-auto">
                    <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                      {getFinalMessage()}
                    </p>
                  </div>
                  <div className="flex justify-center space-x-4 mt-8">
                    <div className="text-2xl">✨</div>
                    <div className="text-2xl">🎆</div>
                    <div className="text-2xl">🪔</div>
                    <div className="text-2xl">🎇</div>
                    <div className="text-2xl">✨</div>
                  </div>
                  <div className="text-right mt-8">
                    <p className="text-lg font-semibold text-orange-600">
                      From: {greetingData.senderName}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  onClick={handleShareGreeting}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Greeting
                </Button>
                <Button 
                  onClick={handleCopyGreeting}
                  variant="outline"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Text
                </Button>
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
                    customMessage: ''
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