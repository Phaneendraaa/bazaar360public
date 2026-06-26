'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Loader2,
  Lock,
  LogOut,
  ShoppingBag,
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Download,
  Upload,
  Star,
  PlusCircle,
  X,
  FileCheck
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'reviews'>('orders');

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // Products State
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  
  // Product Form Fields
  const [productTitle, setProductTitle] = useState('');
  const [productSKU, setProductSKU] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productOriginalPrice, setProductOriginalPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productTags, setProductTags] = useState('');
  const [productIsFeatured, setProductIsFeatured] = useState(false);
  const [productStatus, setProductStatus] = useState('ACTIVE');
  const [productDescription, setProductDescription] = useState('');
  const [productImages, setProductImages] = useState<string[]>([]);
  const [productVideo, setProductVideo] = useState('');
  const [productFormError, setProductFormError] = useState('');
  const [productFormSubmitting, setProductFormSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reviews State
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewProductSlug, setReviewProductSlug] = useState('');
  
  // Review Form Fields
  const [reviewCustomerName, setReviewCustomerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewFormSubmitting, setReviewFormSubmitting] = useState(false);
  const [reviewFormError, setReviewFormError] = useState('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [reviewUploading, setReviewUploading] = useState(false);
  const reviewFileInputRef = useRef<HTMLInputElement>(null);

  // Check authentication on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        // Try fetching orders to verify if we are authenticated
        const res = await fetch('/api/orders');
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (e) {
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch Orders
  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (orderSearch) queryParams.set('search', orderSearch);
      if (orderStatusFilter) queryParams.set('status', orderStatusFilter);

      const res = await fetch(`/api/orders?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch Products
  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setProductsLoading(false);
    }
  };

  // Trigger loads on Tab Change or Auth status
  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === 'orders') {
      loadOrders();
    } else if (activeTab === 'products') {
      loadProducts();
    } else if (activeTab === 'reviews') {
      loadProducts(); // Load products to select in reviews tab
    }
  }, [isAuthenticated, activeTab, orderSearch, orderStatusFilter]);

  // Load reviews when reviewProductSlug changes
  useEffect(() => {
    if (!reviewProductSlug) {
      setReviews([]);
      return;
    }
    async function loadReviews() {
      setReviewsLoading(true);
      try {
        const res = await fetch(`/api/reviews?productSlug=${reviewProductSlug}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (e) {
        console.error('Failed to load reviews:', e);
      } finally {
        setReviewsLoading(false);
      }
    }
    loadReviews();
  }, [reviewProductSlug]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) {
      setLoginError('Both username and password are required.');
      return;
    }

    setLoginSubmitting(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        loadOrders();
      } else {
        setLoginError(data.error || 'Authentication failed.');
      }
    } catch (err) {
      setLoginError('Network error. Please try again.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setUsernameInput('');
      setPasswordInput('');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setStatusUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Refresh orders list
        loadOrders();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update order status');
      }
    } catch (e) {
      console.error(e);
      alert('Network error occurred.');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Export filtered orders to CSV
  const handleExportCSV = () => {
    if (orders.length === 0) return;

    const headers = [
      'Order Number',
      'Date Time',
      'Customer Name',
      'Mobile Number',
      'Alternate Mobile',
      'Address',
      'Product Name',
      'Quantity',
      'Price',
      'Total Amount',
      'Status',
      'Notes'
    ];

    const csvRows = [headers.join(',')];

    for (const order of orders) {
      const formattedDate = new Date(order.createdAt).toLocaleString();
      const addressString = `"${order.houseNumber}, ${order.street}, ${order.landmark || ''}, ${order.city}, ${order.state} - ${order.pinCode}"`.replace(/\n/g, ' ');
      
      const row = [
        order.orderNumber,
        `"${formattedDate}"`,
        `"${order.customerName.replace(/"/g, '""')}"`,
        order.phoneNumber,
        order.alternateNumber || '-',
        addressString,
        `"${order.productName.replace(/"/g, '""')}"`,
        order.quantity,
        order.price,
        order.totalAmount,
        order.status,
        `"${(order.notes || '').replace(/"/g, '""')}"`
      ];

      csvRows.push(row.join(','));
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvRows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `bazaar360_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // File upload trigger
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setProductFormError('');
    
    // Upload files sequentially
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            if (file.type.startsWith('video/')) {
              setProductVideo(result.url);
            } else {
              setProductImages((prev) => [...prev, result.url]);
            }
          }
        } else {
          const err = await res.json();
          setProductFormError(err.error || `Failed to upload file ${file.name}`);
        }
      } catch (err) {
        setProductFormError('Error uploading files.');
      }
    }
  };

  // Handle Review Image Uploads
  const handleReviewImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setReviewFormError('');
    setReviewUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            setReviewImages((prev) => [...prev, result.url]);
          }
        } else {
          const err = await res.json();
          setReviewFormError(err.error || `Failed to upload file ${file.name}`);
        }
      } catch (err) {
        setReviewFormError('Error uploading files.');
      }
    }
    setReviewUploading(false);
  };

  // Open Add Product Modal
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductTitle('');
    setProductSKU('');
    setProductPrice('');
    setProductOriginalPrice('');
    setProductStock('');
    setProductTags('');
    setProductIsFeatured(false);
    setProductStatus('ACTIVE');
    setProductDescription('');
    setProductImages([]);
    setProductVideo('');
    setProductFormError('');
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const openEditProductModal = (product: any) => {
    setEditingProduct(product);
    setProductTitle(product.title);
    setProductSKU(product.SKU);
    setProductPrice(product.price.toString());
    setProductOriginalPrice(product.originalPrice ? product.originalPrice.toString() : '');
    setProductStock(product.stockQuantity.toString());
    
    let tagsStr = '';
    try {
      const parsedTags = Array.isArray(product.tags) ? product.tags : JSON.parse(product.tags);
      tagsStr = parsedTags.join(', ');
    } catch (e) {
      tagsStr = '';
    }
    setProductTags(tagsStr);
    setProductIsFeatured(product.isFeatured);
    setProductStatus(product.status);
    setProductDescription(product.description);
    
    let imgs: string[] = [];
    try {
      imgs = Array.isArray(product.images) ? product.images : JSON.parse(product.images);
    } catch (e) {
      imgs = [];
    }
    setProductImages(imgs);
    setProductVideo(product.video || '');
    setProductFormError('');
    setIsProductModalOpen(true);
  };

  // Product submission
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productTitle || !productSKU || !productPrice || !productDescription) {
      setProductFormError('Title, SKU, Price, and Description are required.');
      return;
    }

    setProductFormSubmitting(true);
    setProductFormError('');

    const formattedTags = productTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: productTitle,
      SKU: productSKU,
      price: parseFloat(productPrice),
      originalPrice: productOriginalPrice ? parseFloat(productOriginalPrice) : null,
      stockQuantity: parseInt(productStock) || 0,
      tags: formattedTags,
      isFeatured: productIsFeatured,
      status: productStatus,
      description: productDescription,
      images: productImages,
      video: productVideo || null,
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setIsProductModalOpen(false);
        loadProducts();
      } else {
        const err = await res.json();
        setProductFormError(err.error || 'Failed to save product.');
      }
    } catch (err) {
      setProductFormError('Network connection error.');
    } finally {
      setProductFormSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        loadProducts();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete product.');
      }
    } catch (e) {
      alert('Network error.');
    }
  };

  // Submit Review
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewProductSlug || !reviewCustomerName || !reviewComment) {
      setReviewFormError('All fields are required.');
      return;
    }

    setReviewFormSubmitting(true);
    setReviewFormError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug: reviewProductSlug,
          customerName: reviewCustomerName,
          rating: reviewRating,
          comment: reviewComment,
          images: reviewImages,
        }),
      });

      if (res.ok) {
        setReviewCustomerName('');
        setReviewComment('');
        setReviewRating(5);
        setReviewImages([]);
        // Refresh reviews list
        const updated = await fetch(`/api/reviews?productSlug=${reviewProductSlug}`).then((r) => r.json());
        setReviews(updated);
      } else {
        const err = await res.json();
        setReviewFormError(err.error || 'Failed to add review.');
      }
    } catch (err) {
      setReviewFormError('Connection error.');
    } finally {
      setReviewFormSubmitting(false);
    }
  };

  // Delete Review
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Refresh reviews list
        const updated = await fetch(`/api/reviews?productSlug=${reviewProductSlug}`).then((r) => r.json());
        setReviews(updated);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete review.');
      }
    } catch (e) {
      alert('Error connecting.');
    }
  };

  // Helper to parse images inside product row
  const getProductImage = (prod: any) => {
    try {
      const imgs = Array.isArray(prod.images) ? prod.images : JSON.parse(prod.images);
      return imgs[0] || '';
    } catch (e) {
      return '';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-slate-400">Verifying session...</p>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-slate-50/50 py-16 px-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 p-8 shadow-md">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-5">
              <Lock className="h-5 w-5" />
            </div>
            
            <h1 className="text-xl font-extrabold text-slate-900 text-center sm:text-2xl">
              Admin Portal Login
            </h1>
            <p className="mt-1.5 text-xs text-slate-400 text-center leading-normal">
              Enter your credentials to access order management and inventory controls.
            </p>

            {loginError && (
              <div className="mt-5 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Username</label>
                <input
                  type="text"
                  placeholder="admin"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 disabled:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                {loginSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Login</span>
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ADMIN PORTAL LOGGED IN SCREEN
  return (
    <>
      <Navbar />

      <main className="flex-grow bg-slate-50/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Panel */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-slate-400 mt-1">Manage incoming orders, configure products, and add reviews.</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors self-start sm:self-center"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 mb-6 gap-2 overflow-x-auto whitespace-nowrap pb-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold border-b-2 transition-all shrink-0 ${
                activeTab === 'orders'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Orders ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold border-b-2 transition-all shrink-0 ${
                activeTab === 'products'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Products ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold border-b-2 transition-all shrink-0 ${
                activeTab === 'reviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Star className="h-4 w-4" />
              <span>Reviews</span>
            </button>
          </div>

          {/* ======================================================== */}
          {/* ORDERS TAB */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Filter controls */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:max-w-xl">
                  {/* Search orders */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search orders (name, phone, order #)..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  {/* Status Dropdown Filter */}
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                {/* CSV download button */}
                <button
                  onClick={handleExportCSV}
                  disabled={orders.length === 0}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 disabled:bg-slate-200 disabled:shadow-none transition-colors w-full sm:w-auto"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Orders table list */}
              {ordersLoading ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="text-xs text-slate-400">Loading incoming orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <>
                  {/* Desktop view table */}
                  <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm text-slate-500">
                      <thead className="bg-slate-50/70 text-slate-700 border-b border-slate-100">
                        <tr>
                          <th className="px-5 py-3.5 font-bold">Order Details</th>
                          <th className="px-5 py-3.5 font-bold">Customer Info</th>
                          <th className="px-5 py-3.5 font-bold">Address</th>
                          <th className="px-5 py-3.5 font-bold">Product Summary</th>
                          <th className="px-5 py-3.5 font-bold">Amount</th>
                          <th className="px-5 py-3.5 font-bold">Status Update</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span className="font-bold text-blue-600 block">{order.orderNumber}</span>
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                {new Date(order.createdAt).toLocaleString()}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-semibold text-slate-800 block">{order.customerName}</span>
                              <span className="text-xs text-slate-500 block mt-0.5">{order.phoneNumber}</span>
                              {order.alternateNumber && (
                                <span className="text-[10px] text-slate-400 block mt-0.5">Alt: {order.alternateNumber}</span>
                              )}
                            </td>
                            <td className="px-5 py-4 max-w-[200px]">
                              <p className="text-xs leading-normal text-slate-600">
                                {order.houseNumber}, {order.street}
                                {order.landmark && `, Near ${order.landmark}`}
                                <span className="block font-medium text-slate-800">
                                  {order.city}, {order.state} - {order.pinCode}
                                </span>
                              </p>
                              {order.notes && (
                                <span className="block mt-1 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded leading-normal">
                                  Note: {order.notes}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-semibold text-slate-800 line-clamp-1">{order.productName}</span>
                              <span className="text-xs text-slate-400 mt-0.5 block">
                                Qty: <span className="font-bold text-slate-600">{order.quantity}</span> @ ₹{order.price.toLocaleString('en-IN')}
                              </span>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span className="font-bold text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                              <span className="text-[10px] text-emerald-600 block mt-0.5 font-bold uppercase">COD</span>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                disabled={statusUpdatingId === order.id}
                                className={`rounded-lg border px-2.5 py-1 text-xs font-bold focus:outline-none ${
                                  order.status === 'PENDING' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                                  order.status === 'CONFIRMED' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                                  order.status === 'SHIPPED' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' :
                                  order.status === 'DELIVERED' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                                  'border-red-200 bg-red-50 text-red-700'
                                }`}
                              >
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>
                              {statusUpdatingId === order.id && (
                                <Loader2 className="inline ml-1.5 h-3.5 w-3.5 animate-spin text-blue-600" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile view cards */}
                  <div className="block md:hidden space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                          <div>
                            <span className="font-bold text-blue-600 text-sm">{order.orderNumber}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {new Date(order.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              disabled={statusUpdatingId === order.id}
                              className={`rounded-lg border px-2 py-0.5 text-xs font-bold focus:outline-none ${
                                order.status === 'PENDING' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                                order.status === 'CONFIRMED' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                                order.status === 'SHIPPED' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' :
                                order.status === 'DELIVERED' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                                'border-red-200 bg-red-50 text-red-700'
                              }`}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="CONFIRMED">Confirmed</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                            {statusUpdatingId === order.id && (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Customer Info</span>
                            <span className="font-semibold text-slate-800 block">{order.customerName}</span>
                            <span className="text-slate-500 block">{order.phoneNumber}</span>
                            {order.alternateNumber && (
                              <span className="text-slate-400 block text-[10px]">Alt: {order.alternateNumber}</span>
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Amount</span>
                            <span className="font-bold text-slate-900 block mt-0.5">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                            <span className="text-emerald-600 font-bold uppercase block text-[9px] mt-0.5">COD</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Product Summary</span>
                          <span className="font-semibold text-slate-800 text-xs block mt-0.5">{order.productName}</span>
                          <span className="text-xs text-slate-400 block">
                            Qty: <span className="font-bold text-slate-600">{order.quantity}</span> @ ₹{order.price.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Address</span>
                          <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                            {order.houseNumber}, {order.street}
                            {order.landmark && `, Near ${order.landmark}`}
                            <span className="block font-medium text-slate-800">
                              {order.city}, {order.state} - {order.pinCode}
                            </span>
                          </p>
                          {order.notes && (
                            <span className="block mt-1.5 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded leading-normal">
                              Note: {order.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-white shadow-sm">
                  <p className="text-sm font-bold text-slate-500">No orders found</p>
                  <p className="text-xs text-slate-400 mt-0.5">Orders submitted by shoppers will show up instantly here.</p>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* PRODUCTS TAB */}
          {/* ======================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Product header row with Add button */}
              <div className="flex justify-between items-center bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Products Catalog</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage details, stock inventory, prices, and status.</p>
                </div>
                
                <button
                  onClick={openAddProductModal}
                  className="flex items-center justify-center gap-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Products list table */}
              {productsLoading ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="text-xs text-slate-400">Loading catalog...</p>
                </div>
              ) : products.length > 0 ? (
                <>
                  {/* Desktop view table */}
                  <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm text-slate-500">
                      <thead className="bg-slate-50/70 text-slate-700 border-b border-slate-100">
                        <tr>
                          <th className="px-5 py-3.5 font-bold">Image</th>
                          <th className="px-5 py-3.5 font-bold">Product Details</th>
                          <th className="px-5 py-3.5 font-bold">SKU</th>
                          <th className="px-5 py-3.5 font-bold">Price</th>
                          <th className="px-5 py-3.5 font-bold">Stock</th>
                          <th className="px-5 py-3.5 font-bold">Status</th>
                          <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((prod) => (
                          <tr key={prod.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                            <td className="px-5 py-4 whitespace-nowrap">
                              <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-50 border border-slate-100">
                                {getProductImage(prod) ? (
                                  <img
                                    src={getProductImage(prod)}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400">No Image</div>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-semibold text-slate-800 block line-clamp-1 max-w-[250px]">{prod.title}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">slug: {prod.slug}</span>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-700">
                              {prod.SKU}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span className="font-bold text-slate-900">₹{prod.price.toLocaleString('en-IN')}</span>
                              {prod.originalPrice && (
                                <span className="text-xs text-slate-400 line-through block mt-0.5">
                                  ₹{prod.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span className={`font-bold ${prod.stockQuantity <= 0 ? 'text-red-600' : prod.stockQuantity <= 10 ? 'text-amber-600' : 'text-slate-700'}`}>
                                {prod.stockQuantity}
                              </span>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                prod.status === 'ACTIVE'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {prod.status}
                              </span>
                              {prod.isFeatured && (
                                <span className="ml-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase">
                                  Featured
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-right space-x-2">
                              <button
                                onClick={() => openEditProductModal(prod)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                                title="Edit Product"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile view cards for products */}
                  <div className="block md:hidden space-y-4">
                    {products.map((prod) => (
                      <div key={prod.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex gap-4 items-start">
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                          {getProductImage(prod) ? (
                            <img
                              src={getProductImage(prod)}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400">No Image</div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-semibold text-slate-800 block text-sm truncate">{prod.title}</span>
                              <span className="text-[10px] text-slate-400 block">sku: {prod.SKU}</span>
                            </div>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${
                              prod.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {prod.status}
                            </span>
                          </div>

                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-slate-900 text-sm">₹{prod.price.toLocaleString('en-IN')}</span>
                            {prod.originalPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                ₹{prod.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-50 pt-2 mt-2">
                            <span className="text-xs text-slate-500">
                              Stock: <span className={`font-bold ${prod.stockQuantity <= 0 ? 'text-red-600' : prod.stockQuantity <= 10 ? 'text-amber-600' : 'text-slate-700'}`}>{prod.stockQuantity}</span>
                            </span>
                            <div className="space-x-1.5">
                              <button
                                onClick={() => openEditProductModal(prod)}
                                className="inline-flex h-8 px-2.5 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                              >
                                <Edit className="h-3.5 w-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-white shadow-sm">
                  <p className="text-sm font-bold text-slate-500">No products configured</p>
                  <button
                    onClick={openAddProductModal}
                    className="mt-4 rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                  >
                    Add Your First Product
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* REVIEWS TAB */}
          {/* ======================================================== */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              
              {/* Review submit form */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm h-fit">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-5">
                  Add Product Review
                </h3>

                {reviewFormError && (
                  <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">
                    {reviewFormError}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Select product */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Product</label>
                    <select
                      value={reviewProductSlug}
                      onChange={(e) => setReviewProductSlug(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select a Product...</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.slug}>
                          {p.title} ({p.SKU})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Customer Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Customer Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah J."
                      value={reviewCustomerName}
                      onChange={(e) => setReviewCustomerName(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Rating Stars */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Rating Stars</label>
                    <div className="flex gap-1.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setReviewRating(stars)}
                          className="hover:scale-115 transition-transform"
                        >
                          <Star className={`h-6 w-6 ${stars <= reviewRating ? 'fill-current' : 'text-slate-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Review Comments</label>
                    <textarea
                      rows={4}
                      placeholder="Write review commentary..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Multiple File Upload for Reviews */}
                  <div className="border border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50/50 flex flex-col gap-3">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Review Photos</label>
                    
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => reviewFileInputRef.current?.click()}
                        disabled={reviewUploading}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                      >
                        {reviewUploading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                        ) : (
                          <Upload className="h-3.5 w-3.5" />
                        )}
                        <span>Upload Photos</span>
                      </button>
                      <input
                        type="file"
                        ref={reviewFileInputRef}
                        multiple
                        accept="image/*"
                        onChange={handleReviewImagesUpload}
                        className="hidden"
                      />
                      <span className="text-[10px] text-slate-400">Add custom images for this review</span>
                    </div>

                    {/* Uploaded images thumbnails */}
                    {reviewImages.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {reviewImages.map((img, idx) => (
                          <div key={idx} className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm shrink-0 group/img">
                            <img src={img} alt="" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setReviewImages((prev) => prev.filter((_, i) => i !== idx))}
                              className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={reviewFormSubmitting}
                    className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 disabled:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {reviewFormSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>Submit Review</span>
                  </button>
                </form>
              </div>

              {/* Reviews list panel */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">
                  Existing Product Reviews
                </h3>

                {reviewProductSlug ? (
                  reviewsLoading ? (
                    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <p className="text-xs text-slate-400">Loading reviews...</p>
                    </div>
                  ) : reviews.length > 0 ? (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="rounded-xl border border-slate-100 p-4 shadow-sm relative group">
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Review"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          
                          <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`}
                              />
                            ))}
                          </div>
                          <h5 className="font-bold text-slate-800 text-sm">{rev.customerName}</h5>
                          <p className="mt-1 text-xs text-slate-500 leading-normal">{rev.comment}</p>
                          
                          {/* Render review images if any */}
                          {rev.images && (() => {
                            let parsedImages: string[] = [];
                            try {
                              parsedImages = Array.isArray(rev.images)
                                ? rev.images
                                : JSON.parse(rev.images as string);
                            } catch (e) {}

                            return parsedImages.length > 0 ? (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {parsedImages.map((imgUrl, imgIdx) => (
                                  <div key={imgIdx} className="relative h-12 w-12 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 shrink-0">
                                    <img
                                      src={imgUrl}
                                      alt=""
                                      className="h-full w-full object-cover cursor-pointer"
                                      onClick={() => window.open(imgUrl, '_blank')}
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : null;
                          })()}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl bg-slate-50/50 text-slate-400 text-center border border-dashed border-slate-200 p-4">
                      <p className="text-xs font-bold">No reviews found for this product.</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Use the left form to manually add reviews.</p>
                    </div>
                  )
                ) : (
                  <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl bg-slate-50/50 text-slate-400 text-center border border-dashed border-slate-200 p-4">
                    <p className="text-xs font-bold">Select a product from the left dropdown to view reviews.</p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </main>

      {/* ======================================================== */}
      {/* ADD / EDIT PRODUCT SLIDE-OUT MODAL */}
      {/* ======================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-[1px] p-0 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProduct ? `Edit Catalog Details: ${editingProduct.SKU}` : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {productFormError && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 shrink-0">
                {productFormError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleProductSubmit} className="space-y-4.5 flex-1 pr-1 pb-10">
              
              {/* Product Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. Wireless Noise Cancelling Headset"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* SKU */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">SKU Code</label>
                  <input
                    type="text"
                    placeholder="e.g. WCH-ANC-BLK"
                    value={productSKU}
                    onChange={(e) => setProductSKU(e.target.value)}
                    disabled={!!editingProduct} // Cannot modify SKU once created to maintain relations
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
                
                {/* Stock Quantity */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stock Inventory</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Selling Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Selling Price (₹)</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="1499"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                {/* Original Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Original Price (₹) <span className="text-[9px] text-slate-400 italic">(Optional)</span></label>
                  <input
                    type="number"
                    step="1"
                    placeholder="2999"
                    value={productOriginalPrice}
                    onChange={(e) => setProductOriginalPrice(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Multiple File Upload & Galleries */}
              <div className="border border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Media Files</label>
                
                {/* Files Uploader Trigger */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Image/Video</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="text-[10px] text-slate-400">Upload multiple photos or a video</span>
                </div>

                {/* Uploaded images thumbnails checklist */}
                {productImages.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {productImages.map((img, idx) => (
                      <div key={idx} className="relative h-14 w-14 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm shrink-0 group/img">
                        <img src={img} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setProductImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Product video source */}
                {productVideo && (
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs bg-white rounded-xl border border-slate-200 p-2.5">
                    <span className="text-slate-600 truncate font-semibold">Video: {productVideo}</span>
                    <button
                      type="button"
                      onClick={() => setProductVideo('')}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Manual URL entry fallback */}
              <div className="grid grid-cols-2 gap-4">
                {/* Status selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</label>
                  <select
                    value={productStatus}
                    onChange={(e) => setProductStatus(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>

                {/* Tags */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tags <span className="text-[9px] text-slate-400 italic">(Comma separated)</span></label>
                  <input
                    type="text"
                    placeholder="electronics, charger"
                    value={productTags}
                    onChange={(e) => setProductTags(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Is Featured checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={productIsFeatured}
                    onChange={(e) => setProductIsFeatured(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Featured Product (Shows up front)</span>
                </label>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Formatted Description</label>
                <textarea
                  rows={8}
                  placeholder={`Write detailed description...\n\nHighlights:\n- Highlight 1\n- Highlight 2\n\nSpecifications:\n- Spec 1: Value 1\n- Spec 2: Value 2`}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none font-mono text-xs leading-normal resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 rounded-full border border-slate-200 bg-white py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={productFormSubmitting}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-blue-600 py-3 text-center text-sm font-bold text-white shadow-md hover:bg-blue-700 disabled:bg-slate-200 cursor-pointer"
                >
                  {productFormSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{editingProduct ? 'Save Changes' : 'Publish Product'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
