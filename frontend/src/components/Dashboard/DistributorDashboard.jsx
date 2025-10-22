import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Upload,
  Plus,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Home,
  Settings
} from 'lucide-react';
import axios from 'axios';
import ProfessionalNavbar from '../Layout/ProfessionalNavbar';

const DistributorDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [demandForecast, setDemandForecast] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5000/api/analytics/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setProducts(productsRes.data.products || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryForecast = async (category) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/predictions/demand/${category}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      return response.data.forecast;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      return null;
    }
  };

  const handleBulkUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      // Implement bulk upload endpoint
      await axios.post('http://localhost:5000/api/products/bulk-upload', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Products uploaded successfully!');
      fetchDashboardData();
    } catch (error) {
      console.error('Bulk upload error:', error);
      alert('Failed to upload products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <p className="text-2xl font-bold text-white">{stats.products?.total || 0}</p>
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
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.products?.active || 0}</p>
              <p className="text-dark-400 text-sm">Active</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.products?.low_stock || 0}</p>
              <p className="text-dark-400 text-sm">Low Stock</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">₹{(stats.revenue?.monthly || 0).toLocaleString()}</p>
              <p className="text-dark-400 text-sm">Monthly Revenue</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label className="btn-primary cursor-pointer flex items-center justify-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Bulk Upload</span>
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleBulkUpload}
              className="hidden"
            />
          </label>
          
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
          
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* AI Demand Forecast */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-white">AI Demand Forecast</h3>
          </div>
          <span className="text-xs text-primary">Next 30 Days</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-dark-300/50 rounded-lg p-4">
            <p className="text-dark-400 text-sm mb-1">Predicted Demand</p>
            <p className="text-white font-bold text-2xl">2,450 units</p>
            <p className="text-green-400 text-xs mt-1">↑ 15% from last month</p>
          </div>
          
          <div className="bg-dark-300/50 rounded-lg p-4">
            <p className="text-dark-400 text-sm mb-1">Reorder Alerts</p>
            <p className="text-white font-bold text-2xl">23 products</p>
            <p className="text-yellow-400 text-xs mt-1">⚠️ Require attention</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-dark-200 border border-dark-300 rounded-lg text-white focus:border-primary focus:outline-none"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg text-white focus:border-primary focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="beverages">Beverages</option>
          <option value="snacks">Snacks</option>
          <option value="instant_foods">Instant Foods</option>
          <option value="dairy_products">Dairy</option>
        </select>
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white font-semibold">{product.name}</h3>
                <p className="text-dark-400 text-sm">
                  {product.brand} • {product.category}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-white font-bold">₹{product.price}</span>
                  <span className="text-dark-400 text-sm">Stock: {product.stock}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.stock > product.min_stock * 2
                      ? 'bg-green-500/20 text-green-400'
                      : product.stock > product.min_stock
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {product.stock > product.min_stock * 2 ? 'Healthy' : product.stock > product.min_stock ? 'Low' : 'Critical'}
                  </span>
                </div>
              </div>
              
              <button className="text-primary hover:text-primary/80 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'products':
        return renderProducts();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Navbar */}
      <ProfessionalNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={logout}
      />
      
      <div className="px-4 pt-6 pb-20">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Distributor Dashboard</h1>
          <p className="text-gray-600 text-sm">Manage inventory & forecast demand</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          renderContent()
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="mobile-nav">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'text-primary bg-primary/10'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all ${
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
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'analytics'
                ? 'text-primary bg-primary/10'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-medium">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistributorDashboard;
