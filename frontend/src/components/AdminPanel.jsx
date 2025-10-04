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
  Package, Image, IndianRupee, Percent, Phone, User,
  TrendingUp, Clock, MapPin, Truck, CreditCard,
  AlertCircle, CheckCircle, XCircle, Calendar,
  RefreshCw, Search, Filter, Download, Mail, MessageSquare
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const ADMIN_KEY = 'aparna_admin_2025';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [linkAnalytics, setLinkAnalytics] = useState([]);
  const [orders, setOrders] = useState([]);
  const [visitorAnalytics, setVisitorAnalytics] = useState(null);
  const [customerAnalytics, setCustomerAnalytics] = useState([]);
  const [cartAbandonments, setCartAbandonments] = useState([]);
  const [revenueReport, setRevenueReport] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Review Management State
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviewRequests, setReviewRequests] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [reviewRequestMethod, setReviewRequestMethod] = useState('whatsapp');
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
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
    { value: 'sweets', label: 'Karanji' },
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

  // Order filters
  const [orderFilters, setOrderFilters] = useState({
    status: '',
    delivery_status: '',
    date_from: '',
    date_to: ''
  });

  const orderStatuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'preparing', label: 'Preparing', color: 'bg-orange-100 text-orange-800' },
    { value: 'ready', label: 'Ready', color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  const deliveryStatuses = [
    { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
    { value: 'dispatched', label: 'Dispatched', color: 'bg-blue-100 text-blue-800' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-orange-100 text-orange-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' }
  ];

  const paymentStatuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
    { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
    { value: 'refunded', label: 'Refunded', color: 'bg-purple-100 text-purple-800' }
  ];

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadProducts(),
        loadContacts(),
        loadAnalytics(),
        loadOrders(),
        loadVisitorAnalytics(),
        loadCustomerAnalytics(),
        loadCartAbandonments(),
        loadRevenueReport()
      ]);
    } catch (error) {
      toast({ title: 'Error loading dashboard data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

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
      console.error('Error loading analytics:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const params = new URLSearchParams({ admin_key: ADMIN_KEY });
      if (orderFilters.status) params.append('status', orderFilters.status);
      if (orderFilters.delivery_status) params.append('delivery_status', orderFilters.delivery_status);
      if (orderFilters.date_from) params.append('date_from', orderFilters.date_from);
      if (orderFilters.date_to) params.append('date_to', orderFilters.date_to);
      
      const response = await axios.get(`${BACKEND_URL}/admin/orders?${params}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadVisitorAnalytics = async () => {
    try {
      const params = new URLSearchParams({
        admin_key: ADMIN_KEY,
        date_from: dateRange.from,
        date_to: dateRange.to
      });
      const response = await axios.get(`${BACKEND_URL}/admin/analytics/visitors?${params}`);
      setVisitorAnalytics(response.data);
    } catch (error) {
      console.error('Error loading visitor analytics:', error);
    }
  };

  const loadCustomerAnalytics = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/analytics/customers?admin_key=${ADMIN_KEY}`);
      setCustomerAnalytics(response.data);
    } catch (error) {
      console.error('Error loading customer analytics:', error);
    }
  };

  const loadCartAbandonments = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/analytics/cart-abandonment?admin_key=${ADMIN_KEY}`);
      setCartAbandonments(response.data);
    } catch (error) {
      console.error('Error loading cart abandonments:', error);
    }
  };

  const loadRevenueReport = async () => {
    try {
      const params = new URLSearchParams({
        admin_key: ADMIN_KEY,
        date_from: dateRange.from,
        date_to: dateRange.to
      });
      const response = await axios.get(`${BACKEND_URL}/admin/analytics/revenue-report?${params}`);
      setRevenueReport(response.data);
    } catch (error) {
      console.error('Error loading revenue report:', error);
    }
  };

  const updateOrderStatus = async (orderId, updates) => {
    try {
      setLoading(true);
      await axios.put(
        `${BACKEND_URL}/admin/orders/${orderId}?admin_key=${ADMIN_KEY}`,
        updates
      );
      toast({ title: 'Order updated successfully!' });
      await loadOrders();
    } catch (error) {
      toast({ title: 'Error updating order', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN');
  };

  const getStatusBadge = (status, type = 'order') => {
    const statusConfig = type === 'order' ? orderStatuses : 
                       type === 'delivery' ? deliveryStatuses : paymentStatuses;
    const config = statusConfig.find(s => s.value === status);
    
    if (!config) return <Badge variant="secondary">{status}</Badge>;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
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

  // Handle contact search and filtering
  const handleContactSearch = (query) => {
    setContactSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredContacts([]);
      setShowContactSuggestions(false);
      setShowAddContactOption(false);
      setSelectedContact('');
      return;
    }
    
    // Filter existing contacts
    const matches = contacts.filter(contact =>
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      contact.phone.includes(query)
    );
    
    setFilteredContacts(matches);
    setShowContactSuggestions(matches.length > 0);
    
    // Show "Add new contact" option if no exact match found
    const exactMatch = contacts.find(contact => 
      contact.name.toLowerCase() === query.toLowerCase()
    );
    setShowAddContactOption(!exactMatch && query.trim().length > 2);
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact.id);
    setContactSearchQuery(contact.name);
    setShowContactSuggestions(false);
    setShowAddContactOption(false);
  };

  const handleQuickAddContact = async (name) => {
    try {
      setLoading(true);
      
      // Simple contact creation with just name (phone will be required)
      const phoneNumber = prompt(`Please enter phone number for ${name}:`);
      if (!phoneNumber) {
        setLoading(false);
        return;
      }
      
      const newContactData = {
        name: name.trim(),
        phone: phoneNumber.trim(),
        email: '',
        relationship: 'customer',
        notes: 'Added via personalized link creation'
      };
      
      const response = await axios.post(
        `${BACKEND_URL}/admin/contacts?admin_key=${ADMIN_KEY}`,
        newContactData
      );
      
      // Update contacts list
      const updatedContacts = [...contacts, response.data];
      setContacts(updatedContacts);
      
      // Select the newly created contact
      setSelectedContact(response.data.id);
      setContactSearchQuery(response.data.name);
      setShowAddContactOption(false);
      
      toast({ 
        title: 'Contact added successfully!', 
        description: `${response.data.name} has been added to your contacts` 
      });
      
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
      setContactSearchQuery('');
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
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="visitors" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Visitors</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Customers</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Revenue</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Products</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Business Overview</h2>
              <Button onClick={loadDashboardData} disabled={loading} variant="outline">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Key Metrics Cards */}
            {visitorAnalytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                        <p className="text-3xl font-bold text-blue-600">{visitorAnalytics.total_visitors}</p>
                        <p className="text-xs text-gray-500">Last 30 days</p>
                      </div>
                      <Eye className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                        <p className="text-3xl font-bold text-green-600">{visitorAnalytics.total_orders}</p>
                        <p className="text-xs text-gray-500">{visitorAnalytics.conversion_rate.toFixed(2)}% conversion</p>
                      </div>
                      <ShoppingCart className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-3xl font-bold text-purple-600">{formatCurrency(visitorAnalytics.total_revenue)}</p>
                        <p className="text-xs text-gray-500">Avg: {formatCurrency(visitorAnalytics.avg_order_value)}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Cart Drops</p>
                        <p className="text-3xl font-bold text-orange-600">{visitorAnalytics.abandoned_carts}</p>
                        <p className="text-xs text-gray-500">Recovery opportunities</p>
                      </div>
                      <AlertCircle className="w-8 h-8 text-orange-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Orders and Top Customers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-gray-600">{formatCurrency(order.final_amount || order.total_amount)}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customerAnalytics.slice(0, 5).map((customer, idx) => (
                      <div key={customer.customer_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-medium">{customer.customer_name}</p>
                            <p className="text-sm text-gray-600">{customer.total_orders} orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(customer.total_spent)}</p>
                          <p className="text-xs text-gray-500">Total spent</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Management */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">All Orders & Customer Analytics</h2>
              <div className="flex space-x-2">
                <Button onClick={loadOrders} disabled={loading} variant="outline">
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Orders List */}
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Customer & Order Info */}
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{order.customer_name}</h3>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {order.customer_phone}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <p><strong>Order ID:</strong> #{order.id.slice(-8)}</p>
                          <p><strong>Total Amount:</strong> {formatCurrency(order.final_amount || order.total_amount)}</p>
                          <p><strong>Items:</strong> {order.items?.length || 0} items</p>
                          <p className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {order.customer_address}
                          </p>
                        </div>

                        {order.is_repeat_customer && (
                          <Badge className="mt-2 bg-purple-100 text-purple-700">
                            Repeat Customer ({order.previous_orders_count} orders)
                          </Badge>
                        )}
                      </div>

                      {/* Status & Dates */}
                      <div>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-gray-500">ORDER STATUS</Label>
                            <div className="mt-1">
                              {getStatusBadge(order.status)}
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs text-gray-500">DELIVERY STATUS</Label>
                            <div className="mt-1">
                              {getStatusBadge(order.delivery_status || 'pending', 'delivery')}
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs text-gray-500">PAYMENT STATUS</Label>
                            <div className="mt-1">
                              {getStatusBadge(order.payment_status || 'pending', 'payment')}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="space-y-2 text-sm">
                            <p className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              <strong>Ordered:</strong> {formatDate(order.created_at)}
                            </p>
                            <p className="flex items-center">
                              <Truck className="w-3 h-3 mr-1" />
                              <strong>Delivery:</strong> {formatDate(order.delivery_date)}
                            </p>
                            {order.dispatched_date && (
                              <p className="flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                <strong>Dispatched:</strong> {formatDate(order.dispatched_date)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div>
                        <h4 className="font-medium mb-3">Quick Actions</h4>
                        <div className="space-y-2">
                          <Select 
                            onValueChange={(value) => updateOrderStatus(order.id, { status: value })}
                            disabled={loading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Update order status" />
                            </SelectTrigger>
                            <SelectContent>
                              {orderStatuses.map(status => (
                                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select 
                            onValueChange={(value) => updateOrderStatus(order.id, { delivery_status: value })}
                            disabled={loading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Update delivery status" />
                            </SelectTrigger>
                            <SelectContent>
                              {deliveryStatuses.map(status => (
                                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <div className="flex space-x-2 pt-2">
                            <Button size="sm" variant="outline">
                              <Phone className="w-4 h-4 mr-1" />
                              Call
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              SMS
                            </Button>
                          </div>
                        </div>

                        {/* Order Items */}
                        {order.items && order.items.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <h5 className="font-medium text-sm mb-2">Order Items:</h5>
                            <div className="space-y-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                                  <div className="flex justify-between">
                                    <span>{item.product_name}</span>
                                    <span>{formatCurrency(item.price * item.quantity)}</span>
                                  </div>
                                  <div className="text-gray-500">
                                    {item.quantity} × {formatCurrency(item.price)} {item.unit}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm"><strong>Customer Notes:</strong> {order.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {orders.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-gray-500 text-lg">No orders found</p>
                    <p className="text-gray-400">Orders will appear here once customers start placing them</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Visitor Analytics */}
          <TabsContent value="visitors" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Visitor Analytics</h2>
              <Button onClick={loadVisitorAnalytics} disabled={loading} variant="outline">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {visitorAnalytics && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Visitor Behavior & Conversion Funnel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-blue-600">Total Visitors</p>
                              <p className="text-2xl font-bold text-blue-700">{visitorAnalytics.total_visitors}</p>
                            </div>
                            <Eye className="w-8 h-8 text-blue-400" />
                          </div>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-green-600">Converted to Orders</p>
                              <p className="text-2xl font-bold text-green-700">{visitorAnalytics.total_orders}</p>
                              <p className="text-xs text-green-600">{visitorAnalytics.conversion_rate.toFixed(2)}% conversion rate</p>
                            </div>
                            <ShoppingCart className="w-8 h-8 text-green-400" />
                          </div>
                        </div>

                        <div className="p-4 bg-red-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-red-600">Drop-offs (Cart Abandonment)</p>
                              <p className="text-2xl font-bold text-red-700">{visitorAnalytics.abandoned_carts}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-red-400" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-600">New vs Returning</p>
                          <p className="text-lg font-bold text-purple-700">
                            {visitorAnalytics.new_visitors} New | {visitorAnalytics.returning_visitors} Returning
                          </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
                          <p className="text-sm text-orange-600">Avg Session Duration</p>
                          <p className="text-lg font-bold text-orange-700">
                            {Math.round(visitorAnalytics.avg_session_duration / 60)}m {Math.round(visitorAnalytics.avg_session_duration % 60)}s
                          </p>
                        </div>

                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-600">Pages per Session</p>
                          <p className="text-lg font-bold text-yellow-700">
                            {visitorAnalytics.pages_per_session.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm">Total Revenue</span>
                        <span className="font-bold text-green-600">{formatCurrency(visitorAnalytics.total_revenue)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm">Avg Order Value</span>
                        <span className="font-bold">{formatCurrency(visitorAnalytics.avg_order_value)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm">Revenue per Visitor</span>
                        <span className="font-bold text-purple-600">
                          {formatCurrency(visitorAnalytics.total_revenue / visitorAnalytics.total_visitors)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Customer Analytics */}
          <TabsContent value="customers" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Customer Details & Purchase History</h2>
              <Button onClick={loadCustomerAnalytics} disabled={loading} variant="outline">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            <div className="grid gap-4">
              {customerAnalytics.map((customer) => (
                <Card key={customer.customer_id}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{customer.customer_name}</h3>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {customer.customer_phone}
                            </p>
                          </div>
                        </div>
                        
                        <Badge className={customer.customer_type === 'returning' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                          {customer.customer_type === 'returning' ? 'Returning Customer' : 'New Customer'}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3 text-gray-700">Purchase Statistics</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total Orders:</span>
                            <span className="font-bold">{customer.total_orders}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Spent:</span>
                            <span className="font-bold text-green-600">{formatCurrency(customer.total_spent)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Avg Order Value:</span>
                            <span className="font-bold">{formatCurrency(customer.avg_order_value)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3 text-gray-700">Timeline</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">First Order:</span>
                            <p className="font-medium">{customer.first_order_date ? new Date(customer.first_order_date).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Last Order:</span>
                            <p className="font-medium">{customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          {customer.avg_time_between_orders && (
                            <div>
                              <span className="text-gray-500">Avg Gap:</span>
                              <p className="font-medium">{Math.round(customer.avg_time_between_orders)} days</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3 text-gray-700">Actions</h4>
                        <div className="space-y-2">
                          <Button size="sm" variant="outline" className="w-full">
                            <Phone className="w-4 h-4 mr-2" />
                            Call Customer
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Message
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Offer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Revenue Report */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Revenue Analytics & Delivery Costs</h2>
              <div className="flex space-x-2">
                <Button onClick={loadRevenueReport} disabled={loading} variant="outline">
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {revenueReport && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Orders</p>
                          <p className="text-3xl font-bold text-blue-600">{revenueReport.summary?.total_orders || 0}</p>
                        </div>
                        <ShoppingCart className="w-8 h-8 text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Product Revenue</p>
                          <p className="text-3xl font-bold text-green-600">{formatCurrency(revenueReport.summary?.total_revenue || 0)}</p>
                        </div>
                        <IndianRupee className="w-8 h-8 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Delivery Revenue</p>
                          <p className="text-3xl font-bold text-purple-600">{formatCurrency(revenueReport.summary?.total_delivery_revenue || 0)}</p>
                        </div>
                        <Truck className="w-8 h-8 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Grand Total</p>
                          <p className="text-3xl font-bold text-orange-600">{formatCurrency(revenueReport.summary?.grand_total || 0)}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-orange-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

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
                      <div key={contact.id} className="border rounded-lg p-3 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50">
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
                  <div className="relative">
                    <Label htmlFor="contact-search">To: Search or Add Contact *</Label>
                    <Input
                      id="contact-search"
                      value={contactSearchQuery}
                      onChange={(e) => handleContactSearch(e.target.value)}
                      placeholder="Type contact name to search or add new..."
                      className="border-orange-200 focus:border-orange-400"
                      onFocus={() => {
                        if (contactSearchQuery && filteredContacts.length > 0) {
                          setShowContactSuggestions(true);
                        }
                      }}
                      onBlur={() => {
                        // Delay hiding to allow click on suggestions
                        setTimeout(() => {
                          setShowContactSuggestions(false);
                          setShowAddContactOption(false);
                        }, 200);
                      }}
                    />
                    
                    {/* Contact Suggestions Dropdown */}
                    {(showContactSuggestions || showAddContactOption) && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-orange-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                        {/* Existing contacts */}
                        {filteredContacts.map(contact => (
                          <div
                            key={contact.id}
                            className="p-3 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 cursor-pointer border-b last:border-b-0"
                            onClick={() => handleSelectContact(contact)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-800">{contact.name}</p>
                                <p className="text-sm text-gray-500 flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {contact.phone}
                                </p>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {relationships.find(r => r.value === contact.relationship)?.label}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        
                        {/* Add new contact option */}
                        {showAddContactOption && (
                          <div
                            className="p-3 hover:bg-green-50 cursor-pointer border-t border-green-200 bg-green-25"
                            onClick={() => handleQuickAddContact(contactSearchQuery)}
                          >
                            <div className="flex items-center space-x-2">
                              <Plus className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="font-medium text-green-700">
                                  Add "{contactSearchQuery}" as new contact
                                </p>
                                <p className="text-xs text-green-600">
                                  Click to add this person to your contact list
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* No results */}
                        {!showContactSuggestions && !showAddContactOption && contactSearchQuery && (
                          <div className="p-3 text-center text-gray-500">
                            <p>No contacts found</p>
                            <p className="text-xs">Try typing at least 3 characters to add new contact</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {selectedContact && (
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border-2 border-orange-200 shadow-sm">
                      {(() => {
                        const contact = contacts.find(c => c.id === selectedContact);
                        return contact ? (
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <p className="font-medium text-orange-700">Ready to send to:</p>
                            </div>
                            <div className="ml-10">
                              <p className="text-xl font-bold text-gray-800">{contact.name}</p>
                              <p className="text-sm text-gray-600 flex items-center mb-2">
                                <Phone className="w-3 h-3 mr-1" />
                                {contact.phone}
                              </p>
                              <div className="flex items-center space-x-2">
                                <Badge className="bg-gradient-to-r from-orange-200 to-amber-200 text-orange-700">
                                  {relationships.find(r => r.value === contact.relationship)?.label}
                                </Badge>
                                {contact.last_contacted && (
                                  <Badge variant="outline" className="text-xs">
                                    Last contacted: {new Date(contact.last_contacted).toLocaleDateString()}
                                  </Badge>
                                )}
                              </div>
                            </div>
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
                            className="text-left h-auto p-3 border-orange-200 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50"
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