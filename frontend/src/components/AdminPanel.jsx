import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  RefreshCw, Search, Filter, Download, Mail, MessageSquare, LogOut, Settings, Copy
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { menuCategories } from '../data/mock';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const ADMIN_KEY = 'aparna_admin_2025';

const AdminPanel = () => {
  const navigate = useNavigate();
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
  const [customContactInfo, setCustomContactInfo] = useState({
    whatsapp_number: '',
    email_id: '',
    mobile_number: ''
  });
  
  // Product Reviews Management State
  const [allProductReviews, setAllProductReviews] = useState([]);
  const [hiddenReviews, setHiddenReviews] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showReviewRequestModal, setShowReviewRequestModal] = useState(false);
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
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedProductAnalytics, setSelectedProductAnalytics] = useState(null);
  const [hiddenProducts, setHiddenProducts] = useState(() => {
    const saved = localStorage.getItem('hiddenProducts');
    return new Set(saved ? JSON.parse(saved) : []);
  });
  
  // Category Management State
  const [managedCategories, setManagedCategories] = useState(() => {
    const saved = localStorage.getItem('managedCategories');
    return saved ? JSON.parse(saved) : menuCategories;
  });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    id: '',
    name: '',
    description: '',
    items: []
  });
  
  // Image Management State
  const [selectedImageProduct, setSelectedImageProduct] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Website Settings State
  const [websiteSettings, setWebsiteSettings] = useState(() => {
    const saved = localStorage.getItem('websiteSettings');
    return saved ? JSON.parse(saved) : {
      name: "Aparna's Diwali Delights",
      tagline: 'Traditional Sweets & Snacks for Your Festival Celebrations',
      description: 'Authentic homemade delicacies crafted with love by Aparna for your Diwali festivities',
      heroTitle: 'Welcome to Festival of Flavors',
      heroSubtitle: 'Discover authentic Diwali sweets and snacks made with traditional recipes',
      contact: {
        phone: '+91 9920632654',
        email: 'aparna.delights@gmail.com',
        address: 'Borivali (W), Mumbai, Maharashtra',
        fssai: '21521058000362'
      }
    };
  });

  // Open image modal when product is selected
  useEffect(() => {
    if (selectedImageProduct) {
      setShowImageModal(true);
    }
  }, [selectedImageProduct]);

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
        loadRevenueReport(),
        loadReviewData()
      ]);
    } catch (error) {
      toast({ title: 'Error loading dashboard data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      // Transform frontend products data to admin panel format
      const transformedProducts = menuCategories.flatMap(category => 
        category.items.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          category: category.name,
          final_price: item.price,
          unit: item.unit,
          status: 'active',
          has_offer: item.price > 1000,
          rating: item.rating || 0,
          total_reviews: item.totalReviews || 0,
          images: item.images || [item.image],
          note_from_aparna: item.rating > 4.5 ? "One of my personal favorites! ❤️" : null
        }))
      );
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
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
      // Fallback to dummy data
      const dummyOrders = [
        {
          id: 'order_001',
          customer_name: 'Priya Sharma',
          customer_phone: '+91 98765 43210',
          customer_address: 'MG Road, Bangalore, Karnataka 560001',
          status: 'confirmed',
          delivery_status: 'delivered',
          payment_status: 'paid',
          final_amount: 2850,
          items: [
            { name: 'Premium Mixed Nuts Chivda', quantity: 2, price: 1200 },
            { name: 'Special Diwali Ladoo Box', quantity: 1, price: 1650 }
          ],
          created_at: '2025-09-28T10:30:00Z',
          delivery_date: '2025-09-30T14:00:00Z',
          dispatched_date: '2025-09-29T08:00:00Z',
          is_repeat_customer: true,
          previous_orders_count: 3
        },
        {
          id: 'order_002', 
          customer_name: 'Rajesh Kumar',
          customer_phone: '+91 87654 32109',
          customer_address: 'Connaught Place, New Delhi 110001',
          status: 'processing',
          delivery_status: 'dispatched',
          payment_status: 'paid',
          final_amount: 1850,
          items: [
            { name: 'Traditional Gujarati Thepla', quantity: 3, price: 900 },
            { name: 'Festive Dry Fruits Mix', quantity: 1, price: 950 }
          ],
          created_at: '2025-10-01T15:45:00Z',
          delivery_date: '2025-10-03T16:00:00Z',
          dispatched_date: '2025-10-02T09:30:00Z',
          is_repeat_customer: false,
          previous_orders_count: 0
        },
        {
          id: 'order_003',
          customer_name: 'Meera Patel',
          customer_phone: '+91 76543 21098', 
          customer_address: 'SG Highway, Ahmedabad, Gujarat 380015',
          status: 'confirmed',
          delivery_status: 'out_for_delivery',
          payment_status: 'paid',
          final_amount: 3200,
          items: [
            { name: 'Authentic Rajasthani Bikaneri Bhujia', quantity: 2, price: 1600 },
            { name: 'Royal Diwali Gift Hamper', quantity: 1, price: 1600 }
          ],
          created_at: '2025-10-02T11:20:00Z',
          delivery_date: '2025-10-04T15:30:00Z',
          is_repeat_customer: true,
          previous_orders_count: 5
        }
      ];
      setOrders(dummyOrders);
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
      // Fallback to dummy data
      const dummyVisitorAnalytics = {
        total_visitors: 2847,
        total_orders: 42,
        conversion_rate: 1.47,
        abandoned_carts: 156,
        new_visitors: 1823,
        returning_visitors: 1024,
        avg_session_duration: 4.2,
        bounce_rate: 32.8,
        peak_hour: '19:00-20:00',
        top_pages: [
          { path: '/', views: 1245, bounce_rate: 25.4 },
          { path: '/products', views: 892, bounce_rate: 18.7 },
          { path: '/greetings', views: 567, bounce_rate: 45.2 }
        ],
        daily_breakdown: [
          { date: '2025-09-28', visitors: 187, orders: 8 },
          { date: '2025-09-29', visitors: 203, orders: 12 },
          { date: '2025-09-30', visitors: 298, orders: 15 },
          { date: '2025-10-01', visitors: 342, orders: 7 }
        ],
        device_breakdown: {
          mobile: 1687,
          desktop: 892,
          tablet: 268
        },
        traffic_sources: {
          direct: 1124,
          social_media: 876,
          search_engines: 623,
          referrals: 224
        }
      };
      setVisitorAnalytics(dummyVisitorAnalytics);
    }
  };

  const loadCustomerAnalytics = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/analytics/customers?admin_key=${ADMIN_KEY}`);
      setCustomerAnalytics(response.data);
    } catch (error) {
      console.error('Error loading customer analytics:', error);
      // Fallback to dummy data
      const dummyCustomerAnalytics = [
        {
          customer_id: 'cust_001',
          customer_name: 'Priya Sharma',
          customer_phone: '+91 98765 43210',
          total_orders: 8,
          total_spent: 18650,
          avg_order_value: 2331.25,
          customer_type: 'returning',
          first_order_date: '2024-10-15T10:30:00Z',
          last_order_date: '2025-09-28T10:30:00Z',
          favorite_category: 'chivda',
          order_history: [
            { date: '2025-09-28', amount: 2850, items: 3 },
            { date: '2025-08-15', amount: 1950, items: 2 },
            { date: '2025-07-22', amount: 3200, items: 4 }
          ],
          lifetime_value_score: 'high'
        },
        {
          customer_id: 'cust_002',
          customer_name: 'Rajesh Kumar',
          customer_phone: '+91 87654 32109',
          total_orders: 1,
          total_spent: 1850,
          avg_order_value: 1850,
          customer_type: 'new',
          first_order_date: '2025-10-01T15:45:00Z',
          last_order_date: '2025-10-01T15:45:00Z',
          favorite_category: 'thepla',
          order_history: [
            { date: '2025-10-01', amount: 1850, items: 4 }
          ],
          lifetime_value_score: 'medium'
        },
        {
          customer_id: 'cust_003',
          customer_name: 'Meera Patel',
          customer_phone: '+91 76543 21098',
          total_orders: 12,
          total_spent: 32400,
          avg_order_value: 2700,
          customer_type: 'returning',
          first_order_date: '2024-08-20T14:20:00Z',
          last_order_date: '2025-10-02T11:20:00Z',
          favorite_category: 'ladoo',
          order_history: [
            { date: '2025-10-02', amount: 3200, items: 3 },
            { date: '2025-09-18', amount: 2850, items: 2 },
            { date: '2025-08-28', amount: 4100, items: 5 }
          ],
          lifetime_value_score: 'high'
        },
        {
          customer_id: 'cust_004',
          customer_name: 'Amit Singh',
          customer_phone: '+91 65432 10987',
          total_orders: 6,
          total_spent: 15300,
          avg_order_value: 2550,
          customer_type: 'returning', 
          first_order_date: '2025-01-12T16:45:00Z',
          last_order_date: '2025-09-25T13:30:00Z',
          favorite_category: 'bhujia',
          order_history: [
            { date: '2025-09-25', amount: 2400, items: 2 },
            { date: '2025-08-10', amount: 3100, items: 3 },
            { date: '2025-06-15', amount: 2200, items: 2 }
          ],
          lifetime_value_score: 'high'
        }
      ];
      setCustomerAnalytics(dummyCustomerAnalytics);
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
      // Fallback to dummy data
      const dummyRevenueReport = {
        summary: {
          total_orders: 42,
          total_revenue: 97850,
          total_delivery_revenue: 1260,
          grand_total: 99110,
          avg_order_value: 2359.29,
          delivery_cost_percentage: 1.27
        },
        daily_breakdown: [
          {
            date: '2025-09-28',
            product_revenue: 14250,
            delivery_revenue: 180,
            total_revenue: 14430,
            orders_count: 8,
            avg_order_value: 1803.75
          },
          {
            date: '2025-09-29',
            product_revenue: 18600,
            delivery_revenue: 240,
            total_revenue: 18840,
            orders_count: 12,
            avg_order_value: 1570
          },
          {
            date: '2025-09-30',
            product_revenue: 26850,
            delivery_revenue: 360,
            total_revenue: 27210,
            orders_count: 15,
            avg_order_value: 1814
          },
          {
            date: '2025-10-01',
            product_revenue: 18750,
            delivery_revenue: 210,
            total_revenue: 18960,
            orders_count: 7,
            avg_order_value: 2708.57
          }
        ],
        category_revenue: [
          { category: 'chivda', revenue: 35200, orders: 18, percentage: 35.98 },
          { category: 'ladoo', revenue: 28650, orders: 12, percentage: 29.29 },
          { category: 'bhujia', revenue: 19800, orders: 8, percentage: 20.23 },
          { category: 'thepla', revenue: 14200, orders: 4, percentage: 14.51 }
        ],
        delivery_metrics: {
          free_delivery_orders: 28,
          paid_delivery_orders: 14,
          avg_delivery_charge: 90,
          delivery_cost_savings: 2520
        },
        profit_analysis: {
          gross_revenue: 99110,
          estimated_costs: 49555,
          estimated_profit: 49555,
          profit_margin: 50.0
        }
      };
      setRevenueReport(dummyRevenueReport);
    }
  };

  const loadReviewData = async () => {
    try {
      await Promise.all([
        loadReviewSummary(),
        loadReviewRequests(),
        loadReviewStats(),
        loadAllProductReviews()
      ]);
    } catch (error) {
      console.error('Error loading review data:', error);
    }
  };

  const loadAllProductReviews = () => {
    try {
      // Extract all reviews from all products
      const allReviews = [];
      menuCategories.forEach(category => {
        category.items.forEach(product => {
          if (product.reviews && product.reviews.length > 0) {
            product.reviews.forEach(review => {
              allReviews.push({
                ...review,
                productId: product.id,
                productName: product.name,
                categoryName: category.name,
                productRating: product.rating,
                visible: true
              });
            });
          }
        });
      });
      
      // Sort by date (newest first)
      allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAllProductReviews(allReviews);
      
      // Load hidden reviews from localStorage
      const hidden = JSON.parse(localStorage.getItem('hiddenReviews') || '[]');
      setHiddenReviews(new Set(hidden));
      
    } catch (error) {
      console.error('Error loading product reviews:', error);
    }
  };

  const handleToggleReviewVisibility = (reviewId, productId) => {
    const reviewKey = `${productId}-${reviewId}`;
    setHiddenReviews(prev => {
      const newHidden = new Set(prev);
      if (newHidden.has(reviewKey)) {
        newHidden.delete(reviewKey);
        toast({
          title: "Review Shown",
          description: "Review is now visible to customers.",
        });
      } else {
        newHidden.add(reviewKey);
        toast({
          title: "Review Hidden",
          description: "Review has been hidden from customers.",
        });
      }
      
      // Save to localStorage
      localStorage.setItem('hiddenReviews', JSON.stringify(Array.from(newHidden)));
      return newHidden;
    });
  };

  const handleDeleteReview = (reviewId, productId, productName) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) {
      return;
    }

    // Update the managed categories to remove this review
    const updatedCategories = managedCategories.map(category => ({
      ...category,
      items: category.items.map(item => 
        item.id === productId 
          ? { ...item, reviews: (item.reviews || []).filter(r => r.id !== reviewId) }
          : item
      )
    }));
    
    setManagedCategories(updatedCategories);
    localStorage.setItem('managedCategories', JSON.stringify(updatedCategories));
    
    // Refresh the reviews display
    loadAllProductReviews();
    
    toast({
      title: "Review Deleted",
      description: `Review has been permanently removed from ${productName}.`,
    });
  };

  const generateProductReviewLink = (productId, productName) => {
    const baseUrl = window.location.origin;
    const reviewUrl = `${baseUrl}/review?product=${productId}`;
    
    const message = `🌟 Hi! How was your experience with ${productName} from Aparna's Diwali Delights?\n\nWe'd love to hear your feedback! Please click the link below to share your review:\n\n👉 ${reviewUrl}\n\nYour feedback helps us serve you better and helps other customers make informed choices.\n\nThank you! 🙏\n\nAparna's Diwali Delights\n📞 ${getWebsiteSettings().contact.phone}`;
    
    return {
      reviewUrl,
      whatsappUrl: `https://wa.me/?text=${encodeURIComponent(message)}`,
      message
    };
  };

  const handleSendProductReviewRequest = (product) => {
    setSelectedProduct(product);
    setShowReviewRequestModal(true);
  };

  const loadReviewSummary = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/reviews/summary?admin_key=${ADMIN_KEY}`);
      setReviewSummary(response.data);
    } catch (error) {
      console.error('Error loading review summary:', error);
    }
  };

  const loadReviewRequests = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/reviews/requests?admin_key=${ADMIN_KEY}&limit=50`);
      setReviewRequests(response.data);
    } catch (error) {
      console.error('Error loading review requests:', error);
    }
  };

  const loadReviewStats = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/reviews/stats?admin_key=${ADMIN_KEY}`);
      setReviewStats(response.data);
    } catch (error) {
      console.error('Error loading review stats:', error);
    }
  };

  const sendReviewRequests = async () => {
    if (selectedOrders.length === 0) {
      toast({ title: 'Please select orders to send review requests', variant: 'destructive' });
      return;
    }

    // Validation for required fields based on method
    if (reviewRequestMethod === 'email' && !customContactInfo.email_id.trim()) {
      toast({ 
        title: 'Email ID Required', 
        description: 'Please enter an email ID for email review requests',
        variant: 'destructive' 
      });
      return;
    }

    try {
      setLoading(true);
      const requestPayload = {
        order_ids: selectedOrders,
        request_method: reviewRequestMethod,
        custom_contact: {}
      };

      // Add custom contact info based on method
      if (reviewRequestMethod === 'whatsapp' && customContactInfo.whatsapp_number.trim()) {
        requestPayload.custom_contact.whatsapp_number = customContactInfo.whatsapp_number.trim();
      }
      if (reviewRequestMethod === 'email' && customContactInfo.email_id.trim()) {
        requestPayload.custom_contact.email_id = customContactInfo.email_id.trim();
      }
      if (reviewRequestMethod === 'sms' && customContactInfo.mobile_number.trim()) {
        requestPayload.custom_contact.mobile_number = customContactInfo.mobile_number.trim();
      }

      const response = await axios.post(`${BACKEND_URL}/admin/reviews/send-requests?admin_key=${ADMIN_KEY}`, requestPayload);
      
      toast({ 
        title: `Review requests sent successfully!`,
        description: `${response.data.requests_sent} requests sent via ${reviewRequestMethod}`
      });
      
      setSelectedOrders([]);
      // Clear custom contact info after successful send
      setCustomContactInfo({
        whatsapp_number: '',
        email_id: '',
        mobile_number: ''
      });
      await loadReviewData();
    } catch (error) {
      toast({ title: 'Error sending review requests', variant: 'destructive' });
    } finally {
      setLoading(false);
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

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    try {
      setLoading(true);
      // Update the product in the local state (since we're using mock data)
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id ? editingProduct : p
      ));
      
      toast({
        title: "Product Updated",
        description: `${editingProduct.name} has been updated successfully.`,
      });
      
      setShowEditModal(false);
      setEditingProduct(null);
    } catch (error) {
      toast({ 
        title: 'Error updating product', 
        variant: 'destructive',
        description: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowAnalytics = (product) => {
    const estimatedOrders = product.total_reviews * 0.8;
    const estimatedRevenue = product.final_price * estimatedOrders;
    const conversionRate = ((product.total_reviews / 100) * 100).toFixed(1); // Mock conversion rate
    
    setSelectedProductAnalytics({
      ...product,
      analytics: {
        estimatedOrders: Math.round(estimatedOrders),
        estimatedRevenue: Math.round(estimatedRevenue),
        conversionRate: conversionRate,
        viewsLastMonth: Math.round(estimatedOrders * 5), // Mock views
        wishlistAdds: Math.round(estimatedOrders * 0.3), // Mock wishlist
        returningCustomers: Math.round(estimatedOrders * 0.4), // Mock returning customers
        averageOrderValue: product.final_price,
        profitMargin: ((product.final_price * 0.6) / product.final_price * 100).toFixed(1) // Mock 60% cost
      }
    });
    setShowAnalyticsModal(true);
  };

  const handleToggleProductVisibility = (productId) => {
    setHiddenProducts(prev => {
      const newHidden = new Set(prev);
      if (newHidden.has(productId)) {
        newHidden.delete(productId);
        toast({
          title: "Product Shown",
          description: "Product is now visible to customers.",
        });
      } else {
        newHidden.add(productId);
        toast({
          title: "Product Hidden",
          description: "Product is now hidden from customers.",
        });
      }
      
      // Save to localStorage so frontend can access it
      const hiddenArray = Array.from(newHidden);
      localStorage.setItem('hiddenProducts', JSON.stringify(hiddenArray));
      
      return newHidden;
    });
  };

  const handleDeleteProduct = (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({
        title: "Product Deleted",
        description: `${productName} has been removed successfully.`,
      });
    }
  };

  // Category Management Functions
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Category name required",
        variant: "destructive"
      });
      return;
    }

    const categoryId = newCategory.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const category = {
      ...newCategory,
      id: categoryId
    };

    const updatedCategories = [...managedCategories, category];
    setManagedCategories(updatedCategories);
    localStorage.setItem('managedCategories', JSON.stringify(updatedCategories));
    
    toast({
      title: "Category Added",
      description: `${newCategory.name} has been added successfully.`,
    });

    setNewCategory({ id: '', name: '', description: '', items: [] });
    setShowAddCategory(false);
  };

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
    setShowEditCategoryModal(true);
  };

  const handleUpdateCategory = () => {
    const updatedCategories = managedCategories.map(cat =>
      cat.id === editingCategory.id ? editingCategory : cat
    );
    
    setManagedCategories(updatedCategories);
    localStorage.setItem('managedCategories', JSON.stringify(updatedCategories));
    
    toast({
      title: "Category Updated",
      description: `${editingCategory.name} has been updated successfully.`,
    });

    setShowEditCategoryModal(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId, categoryName) => {
    const category = managedCategories.find(c => c.id === categoryId);
    const productCount = category?.items?.length || 0;
    
    if (productCount > 0) {
      if (!window.confirm(`This category contains ${productCount} products. Deleting it will also remove all products. Are you sure?`)) {
        return;
      }
    }

    const updatedCategories = managedCategories.filter(c => c.id !== categoryId);
    setManagedCategories(updatedCategories);
    localStorage.setItem('managedCategories', JSON.stringify(updatedCategories));
    
    // Also update products to remove any from this category
    setProducts(prev => prev.filter(p => p.category !== categoryName));
    
    toast({
      title: "Category Deleted",
      description: `${categoryName} has been removed successfully.`,
    });
  };

  // Image Management Functions
  const handleAddImageToProduct = async (file) => {
    try {
      setUploadingImage(true);
      
      // For demo purposes, create a URL from the file
      const imageUrl = URL.createObjectURL(file);
      
      // Update the product in the products array
      setProducts(prev => prev.map(p => 
        p.id === selectedImageProduct.id 
          ? { ...p, images: [...(p.images || []), imageUrl] }
          : p
      ));
      
      // Update managedCategories as well to keep data in sync
      const updatedCategories = managedCategories.map(category => ({
        ...category,
        items: category.items.map(item => 
          item.id === selectedImageProduct.id 
            ? { ...item, images: [...(item.images || [item.image].filter(Boolean)), imageUrl] }
            : item
        )
      }));
      
      setManagedCategories(updatedCategories);
      localStorage.setItem('managedCategories', JSON.stringify(updatedCategories));
      
      // Update selectedImageProduct to reflect new images
      setSelectedImageProduct(prev => ({
        ...prev,
        images: [...(prev.images || []), imageUrl]
      }));
      
      toast({
        title: "Image Added",
        description: "Image has been added to the product successfully.",
      });
      
    } catch (error) {
      toast({
        title: "Error adding image",
        variant: "destructive",
        description: error.message
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImageFromProduct = (imageIndex) => {
    // Update products array
    setProducts(prev => prev.map(p => 
      p.id === selectedImageProduct.id 
        ? { ...p, images: p.images.filter((_, index) => index !== imageIndex) }
        : p
    ));
    
    // Update managedCategories
    const updatedCategories = managedCategories.map(category => ({
      ...category,
      items: category.items.map(item => 
        item.id === selectedImageProduct.id 
          ? { ...item, images: (item.images || []).filter((_, index) => index !== imageIndex) }
          : item
      )
    }));
    
    setManagedCategories(updatedCategories);
    localStorage.setItem('managedCategories', JSON.stringify(updatedCategories));
    
    // Update selectedImageProduct
    setSelectedImageProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== imageIndex)
    }));
    
    toast({
      title: "Image Removed",
      description: "Image has been removed from the product.",
    });
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImageProduct(null);
  };

  // Website Settings Functions
  const handleSaveWebsiteSettings = () => {
    localStorage.setItem('websiteSettings', JSON.stringify(websiteSettings));
    
    toast({
      title: "Settings Saved",
      description: "Website settings have been updated successfully!",
    });
  };

  const handleResetWebsiteSettings = () => {
    const defaultSettings = {
      name: "Aparna's Diwali Delights",
      tagline: 'Traditional Sweets & Snacks for Your Festival Celebrations',
      description: 'Authentic homemade delicacies crafted with love by Aparna for your Diwali festivities',
      heroTitle: 'Welcome to Festival of Flavors',
      heroSubtitle: 'Discover authentic Diwali sweets and snacks made with traditional recipes',
      contact: {
        phone: '+91 9920632654',
        email: 'aparna.delights@gmail.com',
        address: 'Borivali (W), Mumbai, Maharashtra',
        fssai: '21521058000362'
      }
    };
    
    setWebsiteSettings(defaultSettings);
    localStorage.setItem('websiteSettings', JSON.stringify(defaultSettings));
    
    toast({
      title: "Settings Reset",
      description: "Website settings have been reset to defaults.",
    });
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

  const calculateOfferPrice = () => {
    if (newProduct.discount_percentage && newProduct.base_price) {
      return Math.round(newProduct.base_price * (1 - newProduct.discount_percentage / 100));
    }
    return newProduct.offer_price || newProduct.base_price || 0;
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
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
              Aparna's Admin Panel
            </h1>
            <p className="text-gray-600">Manage your Diwali Delights business</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9 mb-8">
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
            <TabsTrigger value="reviews" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
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
            {/* Header with Add Product Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Products Analytics & Management</h2>
              <Button 
                onClick={() => setShowAddProduct(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </div>

            {/* Products Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                    </div>
                    <Package className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Categories</p>
                      <p className="text-2xl font-bold text-green-600">{new Set(products.map(p => p.category)).size}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {(products.filter(p => p.rating > 0).reduce((acc, p) => acc + p.rating, 0) / products.filter(p => p.rating > 0).length || 0).toFixed(1)}⭐
                      </p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-amber-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Est. Revenue</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ₹{Math.round(products.reduce((acc, p) => acc + (p.final_price * (p.total_reviews * 0.8)), 0)).toLocaleString()}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Analytics Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Product Performance Analytics</span>
                  <Button onClick={loadProducts} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Product</th>
                        <th className="text-left py-3 px-2">Images</th>
                        <th className="text-left py-3 px-2">Category</th>
                        <th className="text-left py-3 px-2">Price</th>
                        <th className="text-left py-3 px-2">Rating</th>
                        <th className="text-left py-3 px-2">Orders</th>
                        <th className="text-left py-3 px-2">Revenue</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => {
                        const estimatedOrders = product.total_reviews * 0.8; // Estimate orders from reviews
                        const estimatedRevenue = product.final_price * estimatedOrders;
                        
                        return (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2">
                              <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.unit}</p>
                                {product.note_from_aparna && (
                                  <p className="text-xs text-orange-600 italic mt-1">⭐ Aparna's Pick</p>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center space-x-2">
                                {product.images && product.images.length > 0 ? (
                                  <>
                                    <img 
                                      src={product.images[0]} 
                                      alt={product.name}
                                      className="w-12 h-12 object-cover rounded-lg border"
                                      onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop';
                                      }}
                                    />
                                    <div>
                                      <p className="text-xs font-medium">{product.images.length} image{product.images.length > 1 ? 's' : ''}</p>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
                                        onClick={() => setSelectedImageProduct(product)}
                                      >
                                        Manage
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                      <Image className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs text-orange-600 hover:text-orange-700 p-0 h-auto"
                                      onClick={() => setSelectedImageProduct(product)}
                                    >
                                      Add Images
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                            </td>
                            <td className="py-3 px-2">
                              <div>
                                <p className="font-semibold text-gray-900">₹{product.final_price}</p>
                                {product.has_offer && (
                                  <Badge className="bg-green-100 text-green-700 text-xs mt-1">
                                    OFFER
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center space-x-1">
                                <span className="font-medium">{product.rating || 'New'}</span>
                                {product.rating && (
                                  <>
                                    <span className="text-amber-400">★</span>
                                    <span className="text-xs text-gray-500">({product.total_reviews})</span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <div>
                                <p className="font-medium">{Math.round(estimatedOrders)}</p>
                                <p className="text-xs text-gray-500">Est. orders</p>
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <div>
                                <p className="font-semibold text-green-600">₹{Math.round(estimatedRevenue).toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Est. revenue</p>
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <Badge 
                                className={
                                  product.status === 'active' ? 'bg-green-100 text-green-800' :
                                  product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                  'bg-red-100 text-red-800'
                                }
                              >
                                {product.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex flex-col space-y-1">
                                <div className="flex space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    title="View Analytics"
                                    onClick={() => handleShowAnalytics(product)}
                                  >
                                    <BarChart3 className="w-4 h-4 text-blue-600" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    title="Edit Product"
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    <Edit className="w-4 h-4 text-gray-600" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    title="Delete Product"
                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`text-xs ${hiddenProducts.has(product.id) ? 'text-red-600' : 'text-green-600'}`}
                                  onClick={() => handleToggleProductVisibility(product.id)}
                                  title={hiddenProducts.has(product.id) ? "Show Product" : "Hide Product"}
                                >
                                  {hiddenProducts.has(product.id) ? '👁️‍🗨️ Show' : '🔍 Hide'}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {products.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>No products found</p>
                    <p className="text-xs">Add your first product to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Performing Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Top Revenue Generators</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products
                      .sort((a, b) => ((b.final_price * (b.total_reviews * 0.8)) - (a.final_price * (a.total_reviews * 0.8))))
                      .slice(0, 5)
                      .map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-gray-600">{product.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">₹{Math.round(product.final_price * (product.total_reviews * 0.8)).toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{product.rating}⭐ ({product.total_reviews} orders)</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Highest Rated Products</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products
                      .filter(p => p.rating > 0)
                      .sort((a, b) => b.rating - a.rating)
                      .slice(0, 5)
                      .map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-gray-600">{product.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-amber-600">{product.rating}⭐</p>
                            <p className="text-xs text-gray-500">({product.total_reviews} reviews)</p>
                          </div>
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
          {/* Reviews Management */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Reviews & Feedback Management</h2>
              <Button onClick={loadReviewData} disabled={loading} variant="outline">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Reviews Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                      <p className="text-2xl font-bold text-blue-600">{allProductReviews.length}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Visible Reviews</p>
                      <p className="text-2xl font-bold text-green-600">
                        {allProductReviews.filter(review => !hiddenReviews.has(`${review.productId}-${review.id}`)).length}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Hidden Reviews</p>
                      <p className="text-2xl font-bold text-yellow-600">{hiddenReviews.size}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Rating</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {allProductReviews.length > 0 ? 
                          (allProductReviews.reduce((sum, r) => sum + r.rating, 0) / allProductReviews.length).toFixed(1) : '0'
                        }⭐
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Review Requests - New Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Send Product Review Requests</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {products.slice(0, 9).map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-xs text-gray-500">{product.category}</p>
                          <p className="text-xs text-orange-600">₹{product.final_price} {product.unit}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {product.rating || 'New'}⭐
                        </Badge>
                      </div>
                      <Button
                        onClick={() => handleSendProductReviewRequest(product)}
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-xs"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Send Review Request
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">Click on any product to generate review request links</p>
                </div>
              </CardContent>
            </Card>

            {/* All Product Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>All Product Reviews</span>
                  </span>
                  <Badge variant="secondary">{allProductReviews.length} reviews</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {allProductReviews.map((review) => {
                    const reviewKey = `${review.productId}-${review.id}`;
                    const isHidden = hiddenReviews.has(reviewKey);
                    
                    return (
                      <div key={reviewKey} className={`border rounded-lg p-4 ${isHidden ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-sm">{review.productName}</h4>
                              <Badge variant="outline" className="text-xs">
                                {review.categoryName}
                              </Badge>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`text-xs ${
                                    i < review.rating ? 'text-amber-400' : 'text-gray-300'
                                  }`}>★</span>
                                ))}
                              </div>
                            </div>
                            <p className="font-medium text-sm text-gray-700">{review.customerName}</p>
                            <p className="text-xs text-gray-500 mb-2">{new Date(review.date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-700 italic">"{review.comment}"</p>
                            {isHidden && (
                              <p className="text-xs text-red-600 mt-2 font-medium">⚠️ Hidden from customers</p>
                            )}
                          </div>
                          
                          <div className="flex flex-col space-y-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleReviewVisibility(review.id, review.productId)}
                              className={`text-xs ${isHidden ? 'text-green-600 hover:text-green-700' : 'text-yellow-600 hover:text-yellow-700'}`}
                            >
                              {isHidden ? (
                                <>
                                  <Eye className="w-3 h-3 mr-1" />
                                  Show
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Hide
                                </>
                              )}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReview(review.id, review.productId, review.productName)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {allProductReviews.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>No reviews found</p>
                      <p className="text-xs">Reviews will appear here as customers leave feedback</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Management */}
          <TabsContent value="categories" className="space-y-6">
            {/* Header with Add Category Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Categories Management</h2>
              <Button 
                onClick={() => setShowAddCategory(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Category
              </Button>
            </div>

            {/* Categories Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Categories</p>
                      <p className="text-2xl font-bold text-blue-600">{managedCategories.length}</p>
                    </div>
                    <Package className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-green-600">
                        {managedCategories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0)}
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Products/Category</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {Math.round(managedCategories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0) / managedCategories.length || 0)}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Categories List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Categories Overview</span>
                  <Badge variant="secondary">{managedCategories.length} categories</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {managedCategories.map((category) => (
                    <div key={category.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                          <div className="flex items-center space-x-4 mt-3">
                            <Badge variant="outline" className="text-xs">
                              ID: {category.id}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              {category.items?.length || 0} products
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                            title="Edit Category"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id, category.name)}
                            title="Delete Category"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Show some products from this category */}
                      {category.items && category.items.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs font-medium text-gray-500 mb-2">Sample Products:</p>
                          <div className="flex flex-wrap gap-2">
                            {category.items.slice(0, 3).map((item) => (
                              <Badge key={item.id} variant="secondary" className="text-xs">
                                {item.name}
                              </Badge>
                            ))}
                            {category.items.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{category.items.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {managedCategories.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>No categories found</p>
                      <p className="text-xs">Add your first category to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Website Settings */}
          <TabsContent value="settings" className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Website Settings</h2>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleResetWebsiteSettings}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button 
                  onClick={handleSaveWebsiteSettings}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Branding Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Branding & Identity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="website-name">Website Name</Label>
                    <Input
                      id="website-name"
                      value={websiteSettings.name}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your Business Name"
                    />
                    <p className="text-xs text-gray-500 mt-1">This appears in the header and throughout the site</p>
                  </div>

                  <div>
                    <Label htmlFor="website-tagline">Tagline</Label>
                    <Input
                      id="website-tagline"
                      value={websiteSettings.tagline}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="Your business tagline"
                    />
                    <p className="text-xs text-gray-500 mt-1">Short catchy phrase describing your business</p>
                  </div>

                  <div>
                    <Label htmlFor="website-description">Description</Label>
                    <Textarea
                      id="website-description"
                      value={websiteSettings.description}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your business"
                      className="min-h-20"
                    />
                    <p className="text-xs text-gray-500 mt-1">Detailed description for footer and about section</p>
                  </div>
                </CardContent>
              </Card>

              {/* Hero Section Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Hero Banner Content</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="hero-title">Hero Title</Label>
                    <Input
                      id="hero-title"
                      value={websiteSettings.heroTitle}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, heroTitle: e.target.value }))}
                      placeholder="Main banner title"
                    />
                    <p className="text-xs text-gray-500 mt-1">Large title text shown on homepage hero section</p>
                  </div>

                  <div>
                    <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                    <Textarea
                      id="hero-subtitle"
                      value={websiteSettings.heroSubtitle}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                      placeholder="Supporting text for hero section"
                      className="min-h-16"
                    />
                    <p className="text-xs text-gray-500 mt-1">Supporting text below the main title</p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-orange-800 mb-2">🎨 Preview:</h5>
                    <div className="bg-white p-4 rounded border">
                      <h3 className="text-lg font-bold text-gray-900">{websiteSettings.heroTitle}</h3>
                      <p className="text-sm text-gray-600 mt-1">{websiteSettings.heroSubtitle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contact-phone">Phone Number</Label>
                    <Input
                      id="contact-phone"
                      value={websiteSettings.contact.phone}
                      onChange={(e) => setWebsiteSettings(prev => ({ 
                        ...prev, 
                        contact: { ...prev.contact, phone: e.target.value }
                      }))}
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-email">Email Address</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={websiteSettings.contact.email}
                      onChange={(e) => setWebsiteSettings(prev => ({ 
                        ...prev, 
                        contact: { ...prev.contact, email: e.target.value }
                      }))}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-address">Address</Label>
                    <Textarea
                      id="contact-address"
                      value={websiteSettings.contact.address}
                      onChange={(e) => setWebsiteSettings(prev => ({ 
                        ...prev, 
                        contact: { ...prev.contact, address: e.target.value }
                      }))}
                      placeholder="Your business address"
                      className="min-h-16"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-fssai">FSSAI Number</Label>
                    <Input
                      id="contact-fssai"
                      value={websiteSettings.contact.fssai}
                      onChange={(e) => setWebsiteSettings(prev => ({ 
                        ...prev, 
                        contact: { ...prev.contact, fssai: e.target.value }
                      }))}
                      placeholder="FSSAI License Number"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      onClick={handleSaveWebsiteSettings}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Save All Changes
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        const newWindow = window.open('/', '_blank');
                        if (newWindow) newWindow.focus();
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Website
                    </Button>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-blue-800 mb-2">💡 Tips:</h5>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Save changes to see them on the website</li>
                      <li>• Keep titles concise and engaging</li>
                      <li>• Update contact info if you move or change numbers</li>
                      <li>• Use preview to check how changes look</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Product</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAddProduct(false)}>
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
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
                    <Label htmlFor="base_price">Base Price (₹)</Label>
                    <Input
                      id="base_price"
                      type="number"
                      value={newProduct.base_price}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, base_price: parseFloat(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      max="100"
                      value={newProduct.discount_percentage}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, discount_percentage: parseFloat(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Offer Price (₹)</Label>
                    <Input
                      value={calculateOfferPrice()}
                      disabled
                      className="bg-gray-50"
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
                      id="product-images"
                    />
                    <label htmlFor="product-images" className="cursor-pointer">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600 mt-2">Click to upload images</p>
                      </div>
                    </label>
                    
                    {/* Display uploaded images */}
                    {newProduct.images && newProduct.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {newProduct.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img src={image} alt={`Product ${index + 1}`} className="w-full h-16 object-cover rounded" />
                            <button
                              onClick={() => {
                                setNewProduct(prev => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== index)
                                }));
                              }}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    onClick={handleCreateProduct}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Product
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddProduct(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditModal && editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit Product: {editingProduct.name}</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Product Name</Label>
                    <Input
                      id="edit-name"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Category</Label>
                    <Input
                      id="edit-category"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-price">Price (₹)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={editingProduct.final_price}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, final_price: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-unit">Unit</Label>
                    <Input
                      id="edit-unit"
                      value={editingProduct.unit}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, unit: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-note">Personal Note from Aparna</Label>
                  <Textarea
                    id="edit-note"
                    value={editingProduct.note_from_aparna || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, note_from_aparna: e.target.value }))}
                    placeholder="Add a personal touch..."
                    className="min-h-16"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingProduct.status}
                    onValueChange={(value) => setEditingProduct(prev => ({ ...prev, status: value }))}
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

                <div className="flex space-x-2 pt-4">
                  <Button 
                    onClick={handleUpdateProduct}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Update Product
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowEditModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Modal */}
        {showAnalyticsModal && selectedProductAnalytics && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Analytics: {selectedProductAnalytics.name}</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAnalyticsModal(false)}>
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Est. Orders</p>
                        <p className="text-2xl font-bold text-blue-600">{selectedProductAnalytics.analytics.estimatedOrders}</p>
                      </div>
                      <ShoppingCart className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Est. Revenue</p>
                        <p className="text-2xl font-bold text-green-600">₹{selectedProductAnalytics.analytics.estimatedRevenue.toLocaleString()}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                        <p className="text-2xl font-bold text-orange-600">{selectedProductAnalytics.analytics.conversionRate}%</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-orange-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Views (Last Month)</span>
                        <span className="font-semibold">{selectedProductAnalytics.analytics.viewsLastMonth}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Wishlist Adds</span>
                        <span className="font-semibold">{selectedProductAnalytics.analytics.wishlistAdds}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Returning Customers</span>
                        <span className="font-semibold">{selectedProductAnalytics.analytics.returningCustomers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Order Value</span>
                        <span className="font-semibold">₹{selectedProductAnalytics.analytics.averageOrderValue}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Rating</span>
                        <span className="font-semibold">{selectedProductAnalytics.rating}⭐ ({selectedProductAnalytics.total_reviews} reviews)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Profit Margin</span>
                        <span className="font-semibold text-green-600">{selectedProductAnalytics.analytics.profitMargin}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status</span>
                        <Badge className={selectedProductAnalytics.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {selectedProductAnalytics.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Visibility</span>
                        <Badge className={hiddenProducts.has(selectedProductAnalytics.id) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                          {hiddenProducts.has(selectedProductAnalytics.id) ? 'Hidden' : 'Visible'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAnalyticsModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add Category Modal */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Category</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAddCategory(false)}>
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Premium Sweets"
                  />
                </div>

                <div>
                  <Label htmlFor="category-description">Description</Label>
                  <Textarea
                    id="category-description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this category..."
                    className="min-h-20"
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    onClick={handleAddCategory}
                    disabled={!newCategory.name.trim()}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddCategory(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {showEditCategoryModal && editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit Category: {editingCategory.name}</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowEditCategoryModal(false)}>
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-category-name">Category Name</Label>
                  <Input
                    id="edit-category-name"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-category-description">Description</Label>
                  <Textarea
                    id="edit-category-description"
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-20"
                  />
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600 mb-1">Category ID: <code>{editingCategory.id}</code></p>
                  <p className="text-sm text-gray-600">Products: {editingCategory.items?.length || 0}</p>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    onClick={handleUpdateCategory}
                    disabled={!editingCategory.name.trim()}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Update Category
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowEditCategoryModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Management Modal */}
        {showImageModal && selectedImageProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Manage Images: {selectedImageProduct.name}</h3>
                <Button variant="ghost" size="sm" onClick={handleCloseImageModal}>
                  ×
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Current Images */}
                <div>
                  <h4 className="text-md font-medium mb-3">Current Images ({selectedImageProduct.images?.length || 0})</h4>
                  {selectedImageProduct.images && selectedImageProduct.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedImageProduct.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`${selectedImageProduct.name} - ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border shadow-sm"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white"
                              onClick={() => handleRemoveImageFromProduct(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            #{index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      <Image className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>No images added yet</p>
                      <p className="text-xs">Add images to showcase this product</p>
                    </div>
                  )}
                </div>

                {/* Add New Images */}
                <div>
                  <h4 className="text-md font-medium mb-3">Add New Images</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        Array.from(e.target.files).forEach(file => {
                          handleAddImageToProduct(file);
                        });
                        e.target.value = '';
                      }}
                      className="hidden"
                      id="add-product-images"
                      disabled={uploadingImage}
                    />
                    <label htmlFor="add-product-images" className="cursor-pointer">
                      <div className="text-center">
                        {uploadingImage ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-orange-600">Uploading...</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Click to upload images</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB each</p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">💡 Image Tips:</h5>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• First image will be used as the main product image</li>
                    <li>• Use high-quality images (minimum 400x300 pixels)</li>
                    <li>• Show the product from different angles</li>
                    <li>• Keep file sizes reasonable for faster loading</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleCloseImageModal}
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Review Request Modal */}
        {showReviewRequestModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Generate Review Request: {selectedProduct.name}</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowReviewRequestModal(false)}>
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Product Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">{selectedProduct.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">{selectedProduct.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-orange-600 font-medium">₹{selectedProduct.final_price} {selectedProduct.unit}</span>
                    <span className="text-gray-500">{selectedProduct.category}</span>
                    {selectedProduct.rating && (
                      <span className="text-amber-600">{selectedProduct.rating}⭐</span>
                    )}
                  </div>
                </div>

                {/* Review Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">WhatsApp Review Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-gray-600 mb-3">Send via WhatsApp with review link</p>
                      <Button
                        onClick={() => {
                          const { whatsappUrl } = generateProductReviewLink(selectedProduct.id, selectedProduct.name);
                          window.open(whatsappUrl, '_blank');
                          toast({ title: "WhatsApp opened with review request!" });
                        }}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Open WhatsApp
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Copy Review Link</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-gray-600 mb-3">Copy link to share anywhere</p>
                      <Button
                        onClick={() => {
                          const { reviewUrl } = generateProductReviewLink(selectedProduct.id, selectedProduct.name);
                          navigator.clipboard.writeText(reviewUrl);
                          toast({ title: "Review link copied to clipboard!" });
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Message Preview */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">📱 Message Preview:</h5>
                  <div className="bg-white p-3 rounded border text-sm">
                    <p>🌟 Hi! How was your experience with <strong>{selectedProduct.name}</strong> from Aparna's Diwali Delights?</p>
                    <br />
                    <p>We'd love to hear your feedback! Please click the link below to share your review:</p>
                    <br />
                    <p className="text-blue-600">👉 {generateProductReviewLink(selectedProduct.id, selectedProduct.name).reviewUrl}</p>
                    <br />
                    <p className="text-xs text-gray-600">Your feedback helps us serve you better and helps other customers make informed choices.</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowReviewRequestModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;