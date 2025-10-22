import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  TrendingUp, 
  Users, 
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  LogOut,
  User,
  ChevronDown,
  Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DistributorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
    }
  };

  // Mock data - would come from API
  const stats = {
    totalProducts: 142,
    activeOrders: 28,
    totalRetailers: 45,
    monthlyRevenue: 450000
  };

  const mockProducts = [
    { id: 1, name: 'Maggi Noodles', category: 'Noodles', stock: 150, price: 12, status: 'active' },
    { id: 2, name: 'Coca Cola', category: 'Beverages', stock: 200, price: 35, status: 'active' },
    { id: 3, name: 'Lays Chips', category: 'Snacks', stock: 180, price: 10, status: 'active' },
  ];

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  const renderOverview = () => (
    <div className="space-y-6 pb-20">
      {/* Stats Grid */}
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
              <p className="text-dark-400 text-xs">Products</p>
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
            <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.activeOrders}</p>
              <p className="text-dark-400 text-xs">Orders</p>
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
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalRetailers}</p>
              <p className="text-dark-400 text-xs">Retailers</p>
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
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">₹{(stats.monthlyRevenue / 1000).toFixed(0)}K</p>
              <p className="text-dark-400 text-xs">Revenue</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center space-x-2 p-3 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Add Product</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30 transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">View Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Products */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Products</h3>
          <button 
            onClick={() => setActiveTab('products')}
            className="text-primary text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-dark-300/50 rounded-lg">
              <div>
                <p className="text-white font-medium">{product.name}</p>
                <p className="text-dark-400 text-sm">{product.category} • Stock: {product.stock}</p>
              </div>
              <div className="text-right">
                <p className="text-primary font-semibold">₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 bg-dark-200 border border-dark-300 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button className="p-3 bg-dark-200 rounded-lg hover:bg-dark-300 transition-colors">
          <Filter className="w-5 h-5 text-dark-400" />
        </button>
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-medium">{product.name}</h3>
                <p className="text-dark-400 text-sm">{product.category}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-dark-400">Stock</p>
                <p className="text-white font-medium">{product.stock} units</p>
              </div>
              <div>
                <p className="text-dark-400">Price</p>
                <p className="text-primary font-semibold">₹{product.price}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-white">Orders</h1>
      <div className="card p-6 text-center">
        <p className="text-dark-400">Order management coming soon...</p>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-white">Analytics</h1>
      <div className="card p-6 text-center">
        <p className="text-dark-400">Advanced analytics coming soon...</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'products': return renderProducts();
      case 'orders': return renderOrders();
      case 'analytics': return renderAnalytics();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Header */}
      <div className="p-4 border-b border-dark-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Distributor Dashboard</h1>
            <p className="text-dark-400 text-sm">Manage your inventory and orders</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-dark-200 rounded-lg hover:bg-dark-300 transition-colors">
              <Bell className="w-5 h-5 text-dark-400" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 bg-dark-200 rounded-lg hover:bg-dark-300 transition-colors flex items-center space-x-2"
              >
                <User className="w-5 h-5 text-dark-400" />
                <ChevronDown className="w-4 h-4 text-dark-400" />
              </button>
              
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-dark-200 rounded-lg shadow-lg border border-dark-300 z-50"
                  >
                    <div className="p-3 border-b border-dark-300">
                      <p className="text-white font-medium">{user?.name || 'Distributor'}</p>
                      <p className="text-dark-400 text-sm">{user?.email}</p>
                      <p className="text-primary text-xs capitalize">{user?.role}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pt-6">
        {renderContent()}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'overview' ? 'text-primary bg-primary/10' : 'text-dark-400'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-medium">Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'products' ? 'text-primary bg-primary/10' : 'text-dark-400'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-xs font-medium">Products</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'orders' ? 'text-primary bg-primary/10' : 'text-dark-400'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-medium">Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'analytics' ? 'text-primary bg-primary/10' : 'text-dark-400'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-medium">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistributorDashboard;

