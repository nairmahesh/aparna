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
const ADMIN_KEY = 'aparna_admin_2024';

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

          {/* Contacts Tab - I'll continue with this in the next part */}
          <TabsContent value="contacts" className="space-y-6">
            {/* Contact management interface will go here */}
            <div className="text-center py-8">
              <p className="text-gray-500">Contact management interface - Implementation continues...</p>
            </div>
          </TabsContent>

          <TabsContent value="personalized" className="space-y-6">
            {/* Personalized links interface will go here */}
            <div className="text-center py-8">
              <p className="text-gray-500">Personalized links interface - Implementation continues...</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics dashboard will go here */}
            <div className="text-center py-8">
              <p className="text-gray-500">Analytics dashboard - Implementation continues...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;