import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarDays, QrCode, Package, MapPin, Phone, User, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { shopInfo } from '../data/mock';
import { useToast } from '../hooks/use-toast';

const OrderForm = ({ cart, onUpdateCart, onRemoveItem, onClearCart }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryDate: null
  });
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      onRemoveItem(itemId);
    } else {
      onUpdateCart(itemId, newQuantity);
    }
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.deliveryDate) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields before proceeding to payment.",
        variant: "destructive"
      });
      return;
    }
    setShowPayment(true);
    toast({
      title: "Order Details Confirmed!",
      description: "Please complete the payment using the QR code below.",
    });
  };

  const handleConfirmOrder = () => {
    toast({
      title: "Order Placed Successfully!",
      description: `Thank you ${customerInfo.name}! Your order will be delivered on ${format(customerInfo.deliveryDate, 'PPP')}. We'll contact you on ${customerInfo.phone} for confirmation.`,
    });
    // Reset form
    setCustomerInfo({ name: '', phone: '', address: '', deliveryDate: null });
    setShowPayment(false);
    onClearCart();
  };

  if (cart.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-orange-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
          <p className="text-gray-600">Add some delicious items from our menu to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Cart Summary */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-2xl text-orange-700">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-600">₹{item.price} {item.unit}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="ml-4 text-right">
                  <p className="font-bold text-lg text-orange-600">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold text-orange-700">
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information Form */}
      {!showPayment ? (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-700">Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Full Name *</span>
                  </Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Phone Number *</span>
                  </Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                    required
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Delivery Address *</span>
                </Label>
                <Textarea
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter complete delivery address with landmark"
                  required
                  className="border-orange-200 focus:border-orange-400 min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>Expected Delivery Date *</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-orange-200 hover:border-orange-400",
                        !customerInfo.deliveryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {customerInfo.deliveryDate ? format(customerInfo.deliveryDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={customerInfo.deliveryDate}
                      onSelect={(date) => setCustomerInfo(prev => ({ ...prev, deliveryDate: date }))}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-6 text-lg"
              >
                Proceed to Payment
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* Payment Section */
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-700 flex items-center space-x-2">
              <QrCode className="w-6 h-6" />
              <span>Payment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Scan QR Code to Pay</h3>
              <div className="w-80 h-80 mx-auto bg-white border-4 border-orange-200 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                <img 
                  src="https://customer-assets.emergentagent.com/job_festival-bites/artifacts/f4rxj1dy_WhatsApp%20Image%202025-10-04%20at%204.16.27%20PM.jpeg"
                  alt="Aparna's Payment QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center mb-4">
                <Badge className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 mb-3">
                  ₹{totalAmount}
                </Badge>
                <div className="bg-white/80 rounded-lg p-4 mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Alternative Payment Methods:</p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      📱 <strong>GPay/PhonePe/Paytm:</strong> <a 
                        href={`tel:${shopInfo.contact.phone}`}
                        className="text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                      >
                        {shopInfo.contact.phone}
                      </a>
                    </p>
                    <p className="text-xs text-gray-500">
                      You can also send payment directly to this number
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-left bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Order Details:</h4>
                <p><strong>Customer:</strong> {customerInfo.name}</p>
                <p><strong>Phone:</strong> {customerInfo.phone}</p>
                <p><strong>Delivery Date:</strong> {format(customerInfo.deliveryDate, 'PPP')}</p>
                <p><strong>Address:</strong> {customerInfo.address}</p>
              </div>
              
              <div className="text-sm text-gray-600 bg-amber-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Payment Options:</p>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-orange-700 mb-1">Option 1: QR Code Payment</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Scan the QR code above using any UPI app</li>
                      <li>Enter amount: ₹{totalAmount}</li>
                      <li>Complete the payment</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-orange-700 mb-1">Option 2: Direct UPI Payment</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Open GPay/PhonePe/Paytm</li>
                      <li>Send ₹{totalAmount} to: <a 
                        href={`tel:${shopInfo.contact.phone}`}
                        className="text-orange-600 hover:text-orange-700 transition-colors cursor-pointer font-medium"
                      >
                        {shopInfo.contact.phone}
                      </a></li>
                      <li>Add note: "Diwali Order - [Your Name]"</li>
                    </ul>
                  </div>
                  <p className="text-center font-medium text-green-700 mt-3">
                    Click "Order Placed" after successful payment
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleConfirmOrder}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 text-lg"
              >
                ✓ Order Placed (Confirm Payment)
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setShowPayment(false)}
                className="w-full border-orange-300 text-orange-600 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50"
              >
                ← Back to Edit Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Business Info */}
      <Card className="bg-gradient-to-r from-orange-600 to-amber-600 text-white border-0">
        <CardContent className="py-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold">{shopInfo.name}</h3>
            <p>{shopInfo.contact.address}</p>
            <p>📞 {shopInfo.contact.phone}</p>
            <p className="text-sm">FSSAI License: {shopInfo.contact.fssai}</p>
            <div className="flex justify-center space-x-4 text-sm mt-4">
              <Badge className="bg-white/20 text-white">Fresh Daily</Badge>
              <Badge className="bg-white/20 text-white">Home Delivery</Badge>
              <Badge className="bg-white/20 text-white">Quality Assured</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderForm;