import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { 
  Home, 
  Package, 
  BarChart3, 
  ShoppingCart, 
  Mic,
  Bell,
  User,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  LogOut,
  Search,
  Filter,
  RefreshCw,
  Loader2
} from 'lucide-react';

const RetailerDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);

  // Fetch all products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/products/all');
      setProducts(response.data.products || []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.products.map(p => p.category))];
      setCategories(uniqueCategories);
      
      console.log(`✓ Fetched ${response.data.products.length} products from backend`);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch low stock products
  const fetchLowStockProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/low-stock');
      setLowStockProducts(response.data.products || []);
      console.log(`✓ Fetched ${response.data.products.length} low stock products`);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProducts(), fetchLowStockProducts()]);
    setRefreshing(false);
  };

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
    fetchLowStockProducts();
  }, []);

  const getStockStatus = (stock, minStock) => {
    if (stock <= minStock) return 'critical';
    if (stock <= minStock * 1.5) return 'low';
    return 'good';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-400 bg-green-400/20';
      case 'low': return 'text-yellow-400 bg-yellow-400/20';
      case 'critical': return 'text-red-400 bg-red-400/20';
      default: return 'text-dark-400 bg-dark-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'low': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.brand || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate stats from real data
  const stats = {
    totalProducts: products.length,
    lowStock: lowStockProducts.length,
    critical: lowStockProducts.filter(p => getStockStatus(p.stock, p.min_stock) === 'critical').length,
    categories: categories.length
  };

  const renderHome = () => (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
          <p className="text-dark-400 text-sm">Here's your retail overview</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-dark-200 rounded-lg hover:bg-dark-300 transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 text-dark-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-2 bg-dark-200 rounded-lg hover:bg-dark-300 transition-colors">
            <Bell className="w-5 h-5 text-dark-400" />
          </button>
          <button className="p-2 bg-dark-200 rounded-lg hover:bg-dark-300 transition-colors">
            <User className="w-5 h-5 text-dark-400" />
          </button>
          <button 
            onClick={logout}
            className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-lg"
        >
          <p>{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="ml-3 text-white">Loading products...</p>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
                  <p className="text-dark-400 text-sm">Total Products</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.lowStock}</p>
                  <p className="text-dark-400 text-sm">Low Stock</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stock Alerts */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Stock Alerts</h3>
              <span className="text-primary text-sm flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                Real-time
              </span>
            </div>
            <div className="space-y-3">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.slice(0, 5).map((item) => {
                  const status = getStockStatus(item.stock, item.min_stock);
                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-dark-300/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-dark-400 text-sm">{item.stock} units left • Min: {item.min_stock}</p>
                        </div>
                      </div>
                      <button className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
                        Reorder
                      </button>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-medium">All stock levels are good!</p>
                  <p className="text-dark-400 text-sm">No low stock alerts</p>
                </div>
              )}
            </div>
          </div>

          {/* Voice Assistant Quick Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 text-center"
          >
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Voice Assistant</h3>
            <p className="text-dark-400 text-sm mb-4">Say "Hey Qwipo" to get started</p>
            <button className="btn-primary w-full">
              Start Voice Command
            </button>
          </motion.div>
        </>
      )}
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-dark-400 text-sm">{filteredProducts.length} products found</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 bg-dark-200 rounded-lg hover:bg-dark-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 text-dark-400 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-200 border border-dark-300 rounded-lg pl-10 pr-4 py-3 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-dark-200 border border-dark-300 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => {
              const status = getStockStatus(item.stock, item.min_stock);
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-4 hover:bg-dark-300/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-12 h-12 bg-dark-300 rounded-lg flex items-center justify-center"
                        style={{ display: item.image_url ? 'none' : 'flex' }}
                      >
                        <Package className="w-6 h-6 text-dark-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <div className="flex items-center space-x-2 text-sm">
                          <p className="text-dark-400">Stock: {item.stock} {item.unit || 'units'}</p>
                          <span className="text-dark-400">•</span>
                          <p className="text-primary font-semibold">₹{item.price}</p>
                        </div>
                        {item.brand && (
                          <p className="text-dark-400 text-xs">{item.brand}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {status}
                      </span>
                      <button 
                        className="text-primary hover:text-primary/80 transition-colors"
                        title="View Analytics"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-dark-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">No products found</p>
              <p className="text-dark-400 text-sm">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => {
    // Get top products by value
    const topProducts = [...products]
      .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
      .slice(0, 5);

    // Calculate stock analytics
    const goodStock = products.filter(p => getStockStatus(p.stock, p.min_stock) === 'good').length;
    const lowStock = products.filter(p => getStockStatus(p.stock, p.min_stock) === 'low').length;
    const criticalStock = products.filter(p => getStockStatus(p.stock, p.min_stock) === 'critical').length;
    
    const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);

    // Get products sorted by stock level
    const stockLevelProducts = [...products]
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 10);

    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Live Stock Analytics</h1>
            <p className="text-dark-400 text-sm flex items-center mt-1">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
              Real-time data
            </p>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-dark-200 rounded-lg hover:bg-dark-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-dark-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Stock Status Overview */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                Stock Health Overview
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
                >
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-green-400">{goodStock}</p>
                  <p className="text-dark-400 text-sm">Good Stock</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                >
                  <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-yellow-400">{lowStock}</p>
                  <p className="text-dark-400 text-sm">Low Stock</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-red-400">{criticalStock}</p>
                  <p className="text-dark-400 text-sm">Critical</p>
                </motion.div>
              </div>

              {/* Stock Distribution Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white font-medium">Stock Health Distribution</span>
                  <span className="text-dark-400">{products.length} total items</span>
                </div>
                <div className="w-full bg-dark-300 rounded-full h-4 flex overflow-hidden">
                  <div 
                    className="bg-green-500 transition-all duration-500 flex items-center justify-center"
                    style={{ width: `${(goodStock / products.length * 100)}%` }}
                  >
                    {goodStock > 0 && (
                      <span className="text-xs font-bold text-white">{Math.round(goodStock / products.length * 100)}%</span>
                    )}
                  </div>
                  <div 
                    className="bg-yellow-500 transition-all duration-500 flex items-center justify-center"
                    style={{ width: `${(lowStock / products.length * 100)}%` }}
                  >
                    {lowStock > 0 && (
                      <span className="text-xs font-bold text-white">{Math.round(lowStock / products.length * 100)}%</span>
                    )}
                  </div>
                  <div 
                    className="bg-red-500 transition-all duration-500 flex items-center justify-center"
                    style={{ width: `${(criticalStock / products.length * 100)}%` }}
                  >
                    {criticalStock > 0 && (
                      <span className="text-xs font-bold text-white">{Math.round(criticalStock / products.length * 100)}%</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Value Stats */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-dark-400 text-sm">Total Stock Value</p>
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-bold text-white">
                  ₹{totalStockValue.toLocaleString()}
                </p>
                <p className="text-dark-400 text-xs mt-1">{totalStockUnits.toLocaleString()} units</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-dark-400 text-sm">Avg. Stock Value</p>
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-bold text-white">
                  ₹{Math.round(totalStockValue / products.length).toLocaleString()}
                </p>
                <p className="text-dark-400 text-xs mt-1">per product</p>
              </motion.div>
            </div>

            {/* Live Stock Levels - Lowest Stock Products */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
                <span className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                  Lowest Stock Levels
                </span>
                <span className="text-xs text-dark-400 font-normal">Live monitoring</span>
              </h3>
              <div className="space-y-3">
                {stockLevelProducts.map((item, index) => {
                  const status = getStockStatus(item.stock, item.min_stock);
                  const stockPercentage = Math.min((item.stock / (item.min_stock * 2)) * 100, 100);
                  
                  return (
                    <motion.div 
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 bg-dark-300/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(status)}`}>
                            {getStatusIcon(status)}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">{item.name}</p>
                            <p className="text-dark-400 text-xs">{item.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">{item.stock}</p>
                          <p className="text-dark-400 text-xs">/ {item.min_stock} min</p>
                        </div>
                      </div>
                      
                      {/* Stock Level Bar */}
                      <div className="w-full bg-dark-400 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stockPercentage}%` }}
                          transition={{ duration: 1, delay: index * 0.05 }}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            status === 'critical' ? 'bg-red-500' :
                            status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Top Products by Value */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Top Products by Inventory Value
              </h3>
              <div className="space-y-3">
                {topProducts.map((item, index) => (
                  <motion.div 
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-dark-300/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <span className="text-primary font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-dark-400 text-sm">{item.category} • {item.stock} units</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold">₹{(item.price * item.stock).toLocaleString()}</p>
                      <p className="text-dark-400 text-xs">₹{item.price}/unit</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-primary" />
                Category Stock Distribution
              </h3>
              <div className="space-y-4">
                {categories.map((category, index) => {
                  const categoryProducts = products.filter(p => p.category === category);
                  const categoryStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0);
                  const categoryValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
                  const percentage = (categoryProducts.length / products.length * 100).toFixed(1);
                  
                  return (
                    <motion.div 
                      key={category}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{category}</span>
                        <div className="text-right">
                          <p className="text-primary font-bold text-sm">₹{categoryValue.toLocaleString()}</p>
                          <p className="text-dark-400 text-xs">{categoryStock} units</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-dark-300 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.05 }}
                            className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                          />
                        </div>
                        <span className="text-dark-400 text-sm font-medium min-w-[60px] text-right">
                          {categoryProducts.length} ({percentage}%)
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOrders = () => (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-white">Orders</h1>
      <div className="space-y-4">
        {[1, 2, 3].map((order) => (
          <motion.div
            key={order}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Order #{order}</h3>
                <p className="text-dark-400 text-sm">5 items • ₹1,250</p>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                Completed
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return renderHome();
      case 'products': return renderProducts();
      case 'analytics': return renderAnalytics();
      case 'orders': return renderOrders();
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Main Content */}
      <div className="px-4 pt-6">
        {renderContent()}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-300 ${
              activeTab === 'home' 
                ? 'text-primary bg-primary/10' 
                : 'text-dark-400 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('products')}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-300 ${
              activeTab === 'products' 
                ? 'text-primary bg-primary/10' 
                : 'text-dark-400 hover:text-white'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-xs font-medium">Products</span>
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-300 ${
              activeTab === 'analytics' 
                ? 'text-primary bg-primary/10' 
                : 'text-dark-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-medium">Analytics</span>
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-300 ${
              activeTab === 'orders' 
                ? 'text-primary bg-primary/10' 
                : 'text-dark-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-xs font-medium">Orders</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;
