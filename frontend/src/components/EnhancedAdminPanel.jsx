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
  Package, Users, BarChart3, ShoppingCart, TrendingUp,
  Eye, Phone, User, Clock, MapPin, Truck, CreditCard,
  AlertCircle, CheckCircle, XCircle, Calendar, IndianRupee,
  RefreshCw, Search, Filter, Download, Mail, MessageSquare
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const ADMIN_KEY = 'aparna_admin_2025';

const EnhancedAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [visitorAnalytics, setVisitorAnalytics] = useState(null);
  const [customerAnalytics, setCustomerAnalytics] = useState([]);
  const [cartAbandonments, setCartAbandonments] = useState([]);
  const [revenueReport, setRevenueReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Aparna's Business Dashboard
          </h1>
          <p className="text-gray-600">Complete business analytics and order management</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
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
            <TabsTrigger value="abandoned" className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Cart Drops</span>
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
                          <p className="text-sm text-gray-600">{formatCurrency(order.final_amount)}</p>
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
              <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
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

            {/* Order Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filter Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Order Status</Label>
                    <Select 
                      value={orderFilters.status} 
                      onValueChange={(value) => setOrderFilters(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All statuses</SelectItem>
                        {orderStatuses.map(status => (
                          <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Delivery Status</Label>
                    <Select 
                      value={orderFilters.delivery_status} 
                      onValueChange={(value) => setOrderFilters(prev => ({ ...prev, delivery_status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All delivery statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All delivery statuses</SelectItem>
                        {deliveryStatuses.map(status => (
                          <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>From Date</Label>
                    <Input 
                      type="date" 
                      value={orderFilters.date_from}
                      onChange={(e) => setOrderFilters(prev => ({ ...prev, date_from: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>To Date</Label>
                    <Input 
                      type="date" 
                      value={orderFilters.date_to}
                      onChange={(e) => setOrderFilters(prev => ({ ...prev, date_to: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button onClick={loadOrders}>
                    <Search className="w-4 h-4 mr-2" />
                    Apply Filters
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setOrderFilters({ status: '', delivery_status: '', date_from: '', date_to: '' });
                      loadOrders();
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

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
                          <p><strong>Total Amount:</strong> {formatCurrency(order.final_amount)}</p>
                          <p><strong>Items:</strong> {order.items.length} items</p>
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
                              {getStatusBadge(order.delivery_status, 'delivery')}
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs text-gray-500">PAYMENT STATUS</Label>
                            <div className="mt-1">
                              {getStatusBadge(order.payment_status, 'payment')}
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

                          <Select 
                            onValueChange={(value) => updateOrderStatus(order.id, { payment_status: value })}
                            disabled={loading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Update payment status" />
                            </SelectTrigger>
                            <SelectContent>
                              {paymentStatuses.map(status => (
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
                {/* Visitor Metrics */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Visitor Behavior (Last 30 Days)</CardTitle>
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
                              <p className="text-sm text-green-600">New Visitors</p>
                              <p className="text-2xl font-bold text-green-700">{visitorAnalytics.new_visitors}</p>
                            </div>
                            <User className="w-8 h-8 text-green-400" />
                          </div>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-purple-600">Returning Visitors</p>
                              <p className="text-2xl font-bold text-purple-700">{visitorAnalytics.returning_visitors}</p>
                            </div>
                            <RefreshCw className="w-8 h-8 text-purple-400" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <p className="text-sm text-orange-600">Avg Session Duration</p>
                          <p className="text-2xl font-bold text-orange-700">
                            {Math.round(visitorAnalytics.avg_session_duration / 60)}m
                          </p>
                        </div>

                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-600">Pages per Session</p>
                          <p className="text-2xl font-bold text-yellow-700">
                            {visitorAnalytics.pages_per_session.toFixed(1)}
                          </p>
                        </div>

                        <div className="p-4 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-600">Conversion Rate</p>
                          <p className="text-2xl font-bold text-red-700">
                            {visitorAnalytics.conversion_rate.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm">Unique Visitors</span>
                        <span className="font-bold">{visitorAnalytics.unique_visitors}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm">Orders Placed</span>
                        <span className="font-bold text-green-600">{visitorAnalytics.total_orders}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm">Revenue</span>
                        <span className="font-bold text-purple-600">{formatCurrency(visitorAnalytics.total_revenue)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm">Avg Order Value</span>
                        <span className="font-bold">{formatCurrency(visitorAnalytics.avg_order_value)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm">Cart Abandonment</span>
                        <span className="font-bold text-orange-600">{visitorAnalytics.abandoned_carts}</span>
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
              <h2 className="text-2xl font-bold text-gray-800">Customer Analytics</h2>
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
                        <h4 className="font-medium mb-3 text-gray-700">Order Statistics</h4>
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

              {customerAnalytics.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-gray-500 text-lg">No customer data available</p>
                    <p className="text-gray-400">Customer analytics will appear after orders are placed</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Revenue Report */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Revenue Analytics</h2>
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
                {/* Revenue Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Orders</p>
                          <p className="text-3xl font-bold text-blue-600">{revenueReport.summary.total_orders}</p>
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
                          <p className="text-3xl font-bold text-green-600">{formatCurrency(revenueReport.summary.total_revenue)}</p>
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
                          <p className="text-3xl font-bold text-purple-600">{formatCurrency(revenueReport.summary.total_delivery_revenue)}</p>
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
                          <p className="text-3xl font-bold text-orange-600">{formatCurrency(revenueReport.summary.grand_total)}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-orange-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Daily Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {revenueReport.daily_breakdown.map((day) => (
                        <div key={`${day._id.date}-${day._id.status}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{day._id.date}</p>
                            <p className="text-sm text-gray-600 capitalize">{day._id.status.replace('_', ' ')}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{formatCurrency(day.final_amount)}</p>
                            <p className="text-sm text-gray-500">{day.total_orders} orders</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Cart Abandonment */}
          <TabsContent value="abandoned" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Cart Abandonment Recovery</h2>
              <Button onClick={loadCartAbandonments} disabled={loading} variant="outline">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            <div className="grid gap-4">
              {cartAbandonments.map((cart) => (
                <Card key={cart.id}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <h3 className="font-bold text-lg mb-2">
                          {cart.customer_name || 'Anonymous Customer'}
                        </h3>
                        {cart.customer_phone && (
                          <p className="text-sm text-gray-600 flex items-center mb-2">
                            <Phone className="w-3 h-3 mr-1" />
                            {cart.customer_phone}
                          </p>
                        )}
                        {cart.customer_email && (
                          <p className="text-sm text-gray-600 flex items-center mb-2">
                            <Mail className="w-3 h-3 mr-1" />
                            {cart.customer_email}
                          </p>
                        )}
                        
                        <div className="mt-3">
                          <Badge className="bg-orange-100 text-orange-700">
                            Stage: {cart.abandonment_stage}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Cart Details</h4>
                        <p className="text-2xl font-bold text-green-600 mb-2">
                          {formatCurrency(cart.cart_total)}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          {cart.cart_items.length} items in cart
                        </p>
                        
                        <div className="space-y-1">
                          {cart.cart_items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                              {item.product_name} × {item.quantity}
                            </div>
                          ))}
                          {cart.cart_items.length > 3 && (
                            <p className="text-sm text-gray-500">
                              +{cart.cart_items.length - 3} more items
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Recovery Actions</h4>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm">
                            <span className="text-gray-500">Abandoned:</span> {formatDate(cart.abandoned_at)}
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-500">Recovery Attempts:</span> {cart.recovery_attempts}
                          </p>
                        </div>

                        {cart.customer_phone && (
                          <div className="space-y-2">
                            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Send Recovery SMS
                            </Button>
                            <Button size="sm" variant="outline" className="w-full">
                              <Phone className="w-4 h-4 mr-2" />
                              Call Customer
                            </Button>
                          </div>
                        )}
                        
                        {!cart.customer_phone && (
                          <p className="text-sm text-gray-500 italic">
                            No contact info available for recovery
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {cartAbandonments.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-gray-500 text-lg">No cart abandonments found</p>
                    <p className="text-gray-400">Recent cart abandonments will appear here for recovery</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedAdminPanel;