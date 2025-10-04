import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Plus, Upload, Edit, Trash2, Users, MessageCircle, 
  BarChart3, Eye, ShoppingCart, Link, Send,
  Package, Image, IndianRupee, Percent, Phone
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const ADMIN_KEY = 'aparna_admin_2025';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [linkAnalytics, setLinkAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Product Management State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'chivda',
    images: [],
    description: '',
    note_from_aparna: '',
    base_price: 0,
    discount_percentage: null,
    offer_price: null,
    unit: 'per kg',
    status: 'active'
  });

  // Contact Management State
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: 'friend',
    notes: ''
  });

  // Personalized Link State
  const [selectedContact, setSelectedContact] = useState('');
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [showContactSuggestions, setShowContactSuggestions] = useState(false);
  const [showAddContactOption, setShowAddContactOption] = useState(false);
  const [messageTemplate, setMessageTemplate] = useState('');
  const [personalizedLinks, setPersonalizedLinks] = useState([]);

  const categories = [
    { value: 'chivda', label: 'Chivda Collection' },
    { value: 'chakli', label: 'Chakli Varieties' },
    { value: 'savory', label: 'Savory Delights' },
    { value: 'sweets', label: 'Festival Sweets' },
    { value: 'laddus', label: 'Laddu Collection' }
  ];

  const relationships = [
    { value: 'friend', label: 'Friend' },
    { value: 'family', label: 'Family' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'customer', label: 'Regular Customer' },
    { value: 'neighbor', label: 'Neighbor' }
  ];

  const messageTemplates = [
    {
      name: 'Diwali Special Offer',
      message: 'Hi {name}! 🪔 Aparna here! Special Diwali treats are ready! Fresh homemade delights with love. Check out our festive menu: {link} ✨'
    },
    {
      name: 'Personal Recommendation',
      message: 'Dear {name}, I\'ve prepared some special items just for you this Diwali! Take a look at what I\'ve made with extra love: {link} 🎊'
    },
    {
      name: 'New Items Alert',
      message: 'Hello {name}! 🌟 I\'ve added some new delicious items to my Diwali collection. I know you\'ll love them! {link}'
    }
  ];

  // Load data on component mount
  useEffect(() => {
    loadProducts();
    loadContacts();
    loadAnalytics();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/products?admin_key=${ADMIN_KEY}`);
      setProducts(response.data);
    } catch (error) {
      toast({ title: 'Error loading products', variant: 'destructive' });
    }
  };

  const loadContacts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/contacts?admin_key=${ADMIN_KEY}`);
      setContacts(response.data);
    } catch (error) {
      toast({ title: 'Error loading contacts', variant: 'destructive' });
    }
  };

  const loadAnalytics = async () => {
    try {
      const [summaryRes, linksRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/admin/analytics/summary?admin_key=${ADMIN_KEY}`),
        axios.get(`${BACKEND_URL}/admin/analytics/links?admin_key=${ADMIN_KEY}`)
      ]);
      setAnalytics(summaryRes.data);
      setLinkAnalytics(linksRes.data);
    } catch (error) {
      toast({ title: 'Error loading analytics', variant: 'destructive' });
    }
  };

  const handleCreateProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/admin/products?admin_key=${ADMIN_KEY}`,
        newProduct
      );
      
      setProducts([...products, response.data]);
      setNewProduct({
        name: '',
        category: 'chivda',
        images: [],
        description: '',
        note_from_aparna: '',
        base_price: 0,
        discount_percentage: null,
        offer_price: null,
        unit: 'per kg',
        status: 'active'
      });
      
      toast({ title: 'Product created successfully!', description: `${response.data.name} added to menu` });
    } catch (error) {
      toast({ title: 'Error creating product', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/admin/contacts?admin_key=${ADMIN_KEY}`,
        newContact
      );
      
      setContacts([...contacts, response.data]);
      setNewContact({
        name: '',
        phone: '',
        email: '',
        relationship: 'friend',
        notes: ''
      });
      
      toast({ title: 'Contact added successfully!', description: `${response.data.name} added to contacts` });
    } catch (error) {
      toast({ title: 'Error adding contact', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendPersonalizedMessage = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/admin/send-personalized-message?admin_key=${ADMIN_KEY}`,
        null,
        {
          params: {
            contact_id: selectedContact,
            message_template: messageTemplate
          }
        }
      );
      
      toast({ 
        title: 'Personalized message ready!', 
        description: `Message prepared for ${response.data.contact_name}` 
      });
      
      // Add to personalized links
      setPersonalizedLinks([...personalizedLinks, response.data]);
      setSelectedContact('');
      setMessageTemplate('');
      loadAnalytics(); // Refresh analytics
      
    } catch (error) {
      toast({ title: 'Error creating personalized message', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        `${BACKEND_URL}/admin/upload-image?admin_key=${ADMIN_KEY}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      const imageUrl = response.data.image_url;
      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
      
      toast({ title: 'Image uploaded successfully!' });
    } catch (error) {
      toast({ title: 'Error uploading image', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Aparna's Admin Panel
          </h1>
          <p className="text-gray-600">Manage your Diwali Delights business</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="personalized" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Personalized Links</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add New Product */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Add New Product</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Special Besan Laddu"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your delicious product..."
                      className="min-h-20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="note">Personal Note from Aparna</Label>
                    <Textarea
                      id="note"
                      value={newProduct.note_from_aparna}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, note_from_aparna: e.target.value }))}
                      placeholder="Add a personal touch..."
                      className="min-h-16"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Base Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.base_price}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, base_price: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount">Discount (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        value={newProduct.discount_percentage || ''}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, discount_percentage: e.target.value ? parseFloat(e.target.value) : null }))}
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <Label htmlFor="offer">Offer Price (₹)</Label>
                      <Input
                        id="offer"
                        type="number"
                        value={newProduct.offer_price || ''}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, offer_price: e.target.value ? parseFloat(e.target.value) : null }))}
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Select
                        value={newProduct.unit}
                        onValueChange={(value) => setNewProduct(prev => ({ ...prev, unit: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="per kg">per kg</SelectItem>
                          <SelectItem value="per piece">per piece</SelectItem>
                          <SelectItem value="per box">per box</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newProduct.status}
                        onValueChange={(value) => setNewProduct(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Product Images</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          Array.from(e.target.files).forEach(file => {
                            handleImageUpload(file);
                          });
                        }}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer flex items-center justify-center space-x-2">
                        <Upload className="w-5 h-5" />
                        <span>Upload Images</span>
                      </label>
                      
                      {newProduct.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {newProduct.images.map((img, idx) => (
                            <div key={idx} className="relative">
                              <img src={`${BACKEND_URL}${img}`} alt={`Product ${idx + 1}`} className="w-full h-20 object-cover rounded" />
                              <button
                                onClick={() => setNewProduct(prev => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== idx)
                                }))}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateProduct}
                    disabled={loading || !newProduct.name || !newProduct.base_price}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {loading ? 'Creating...' : 'Add Product'}
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Current Products ({products.length})</span>
                    <Button variant="outline" onClick={loadProducts}>
                      Refresh
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {products.map((product) => (
                      <div key={product.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-gray-600">{product.category}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="font-bold text-orange-600">₹{product.final_price}</span>
                              <span className="text-sm text-gray-500">{product.unit}</span>
                              {product.has_offer && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  OFFER
                                </Badge>
                              )}
                              <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                                {product.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {product.note_from_aparna && (
                          <div className="mt-2 p-2 bg-orange-50 rounded text-sm italic">
                            "{product.note_from_aparna}" - Aparna
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add New Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Add New Contact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name">Name *</Label>
                      <Input
                        id="contact-name"
                        value={newContact.name}
                        onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Contact name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-phone">Phone Number *</Label>
                      <Input
                        id="contact-phone"
                        value={newContact.phone}
                        onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-email">Email (Optional)</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={newContact.email}
                        onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-relationship">Relationship</Label>
                      <Select
                        value={newContact.relationship}
                        onValueChange={(value) => setNewContact(prev => ({ ...prev, relationship: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {relationships.map(rel => (
                            <SelectItem key={rel.value} value={rel.value}>{rel.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contact-notes">Notes (Optional)</Label>
                    <Textarea
                      id="contact-notes"
                      value={newContact.notes}
                      onChange={(e) => setNewContact(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional notes about this contact..."
                      className="min-h-16"
                    />
                  </div>

                  <Button
                    onClick={handleCreateContact}
                    disabled={loading || !newContact.name || !newContact.phone}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {loading ? 'Adding...' : 'Add Contact'}
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>My Contacts ({contacts.length})</span>
                    <Button variant="outline" onClick={loadContacts}>
                      <Phone className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="border rounded-lg p-3 hover:bg-orange-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{contact.name}</h4>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {contact.phone}
                            </p>
                            {contact.email && (
                              <p className="text-sm text-gray-500">{contact.email}</p>
                            )}
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {relationships.find(r => r.value === contact.relationship)?.label}
                              </Badge>
                              {contact.last_contacted && (
                                <span className="text-xs text-gray-400">
                                  Last contacted: {new Date(contact.last_contacted).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedContact(contact.id);
                                setActiveTab('personalized');
                              }}
                              className="text-green-600"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {contact.notes && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            {contact.notes}
                          </div>
                        )}
                      </div>
                    ))}
                    {contacts.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>No contacts added yet</p>
                        <p className="text-sm">Add your first contact to start sending personalized links</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="personalized" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Send Personalized Message */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Send Personalized Link</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="select-contact">To: Select Contact *</Label>
                    <Select
                      value={selectedContact}
                      onValueChange={setSelectedContact}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a contact to send message" />
                      </SelectTrigger>
                      <SelectContent>
                        {contacts.map(contact => (
                          <SelectItem key={contact.id} value={contact.id}>
                            <div className="flex items-center space-x-2">
                              <span>{contact.name}</span>
                              <span className="text-sm text-gray-500">({contact.phone})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedContact && (
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      {(() => {
                        const contact = contacts.find(c => c.id === selectedContact);
                        return contact ? (
                          <div>
                            <p className="font-medium text-orange-700">Sending to:</p>
                            <p className="text-lg font-semibold">{contact.name}</p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {contact.phone}
                            </p>
                            <Badge className="mt-1 bg-orange-200 text-orange-700">
                              {relationships.find(r => r.value === contact.relationship)?.label}
                            </Badge>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="message-template">Message Template</Label>
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 gap-2">
                        {messageTemplates.map((template, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            onClick={() => setMessageTemplate(template.message)}
                            className="text-left h-auto p-3 border-orange-200 hover:bg-orange-50"
                          >
                            <div>
                              <p className="font-medium text-sm">{template.name}</p>
                              <p className="text-xs text-gray-600 mt-1">{template.message.substring(0, 100)}...</p>
                            </div>
                          </Button>
                        ))}
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor="custom-message">Or write custom message:</Label>
                        <Textarea
                          id="custom-message"
                          value={messageTemplate}
                          onChange={(e) => setMessageTemplate(e.target.value)}
                          placeholder="Hi {name}! I have some special Diwali treats for you. Check them out: {link}"
                          className="min-h-24"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Use {'{name}'} for contact name and {'{link}'} for personalized link
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSendPersonalizedMessage}
                    disabled={loading || !selectedContact || !messageTemplate}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? 'Creating Link...' : 'Generate Personalized Link'}
                  </Button>
                  
                  {personalizedLinks.length > 0 && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-700 mb-2">Ready to Send!</h4>
                      <div className="space-y-2">
                        {personalizedLinks.slice(-3).map((link, idx) => (
                          <div key={idx} className="text-sm">
                            <p><strong>To:</strong> {link.contact_name} ({link.contact_phone})</p>
                            <p className="text-green-600 break-all">{link.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Personalized Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Links</span>
                    <Button variant="outline" onClick={loadAnalytics}>
                      <Link className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {linkAnalytics.slice(0, 10).map((analytics) => (
                      <div key={analytics.link_id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold">{analytics.contact_name}</h4>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {analytics.contact_phone}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span className="text-xs">{analytics.total_opens} opens</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ShoppingCart className="w-3 h-3" />
                                <span className="text-xs">{analytics.items_added_to_cart} items</span>
                              </div>
                              {analytics.order_placed && (
                                <Badge className="text-xs bg-green-100 text-green-700">
                                  ORDER PLACED ✓
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={analytics.link_status === 'active' ? 'default' : 'secondary'}>
                              {analytics.link_status}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(analytics.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {linkAnalytics.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Link className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>No personalized links yet</p>
                        <p className="text-sm">Create your first personalized link to start tracking</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Overview */}
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Products</p>
                        <p className="text-3xl font-bold text-orange-600">{products.length}</p>
                      </div>
                      <Package className="w-8 h-8 text-orange-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                        <p className="text-3xl font-bold text-blue-600">{analytics.total_contacts}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Personalized Links</p>
                        <p className="text-3xl font-bold text-green-600">{analytics.total_personalized_links}</p>
                      </div>
                      <Link className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Events</p>
                        <p className="text-3xl font-bold text-purple-600">{analytics.total_tracking_events}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Link Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Link Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {linkAnalytics.slice(0, 5).map((analytics) => (
                      <div key={analytics.link_id} className="border-b pb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{analytics.contact_name}</h4>
                          <Badge className={analytics.order_placed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {analytics.order_placed ? 'CONVERTED' : 'NO ORDER'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Opens</p>
                            <p className="font-semibold flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {analytics.total_opens}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Cart Adds</p>
                            <p className="font-semibold flex items-center">
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              {analytics.items_added_to_cart}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Checkout</p>
                            <p className="font-semibold">
                              {analytics.checkout_started ? '✅ Yes' : '❌ No'}
                            </p>
                          </div>
                        </div>
                        
                        {analytics.pages_viewed.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">Pages viewed: {analytics.pages_viewed.length}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {linkAnalytics.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>No analytics data yet</p>
                        <p className="text-sm">Send some personalized links to see performance data</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Recent Activity (30 days)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-600">New Links Created</p>
                          <p className="text-2xl font-bold text-blue-700">{analytics.recent_links_30_days}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-600">Total Events</p>
                          <p className="text-2xl font-bold text-green-700">{analytics.recent_events_30_days}</p>
                        </div>
                      </div>

                      {/* Top Performing Links */}
                      <div>
                        <h4 className="font-medium mb-3">Top Performing Contacts</h4>
                        <div className="space-y-2">
                          {linkAnalytics
                            .sort((a, b) => b.total_opens - a.total_opens)
                            .slice(0, 5)
                            .map((analytics, idx) => (
                              <div key={analytics.link_id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center space-x-3">
                                  <Badge className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                    {idx + 1}
                                  </Badge>
                                  <span className="font-medium">{analytics.contact_name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500">{analytics.total_opens} opens</span>
                                  {analytics.order_placed && <span className="text-green-600">💰</span>}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 border-t pt-4">
                        Last updated: {analytics.last_updated ? new Date(analytics.last_updated).toLocaleString() : 'Never'}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;