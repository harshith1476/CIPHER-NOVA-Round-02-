import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  CheckCircle
} from 'lucide-react';

const RetailerDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

  const stockData = [
    { id: 1, name: 'Maggi Noodles', stock: 45, minStock: 20, status: 'good' },
    { id: 2, name: 'Coca Cola', stock: 12, minStock: 15, status: 'low' },
    { id: 3, name: 'Lays Chips', stock: 78, minStock: 25, status: 'good' },
    { id: 4, name: 'Parle-G Biscuits', stock: 8, minStock: 30, status: 'critical' },
  ];

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

  const renderHome = () => (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
          <p className="text-dark-400 text-sm">Here's your retail overview</p>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 bg-dark-200 rounded-lg hover:bg-dark-300 transition-colors">
            <Bell className="w-5 h-5 text-dark-400" />
          </button>
          <button className="p-2 bg-dark-200 rounded-lg hover:bg-dark-300 transition-colors">
            <User className="w-5 h-5 text-dark-400" />
          </button>
        </div>
      </div>

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
              <p className="text-2xl font-bold text-white">142</p>
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
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-dark-400 text-sm">Low Stock</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stock Alerts */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Stock Alerts</h3>
          <span className="text-primary text-sm">Real-time</span>
        </div>
        <div className="space-y-3">
          {stockData.filter(item => item.status !== 'good').map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 bg-dark-300/50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                </div>
                <div>
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-dark-400 text-sm">{item.stock} units left</p>
                </div>
              </div>
              <button className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
                Reorder
              </button>
            </motion.div>
          ))}
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
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <button className="btn-primary">Add Product</button>
      </div>

      <div className="space-y-4">
        {stockData.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-dark-300 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-dark-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{item.name}</h3>
                  <p className="text-dark-400 text-sm">Stock: {item.stock} units</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <button className="text-primary hover:text-primary/80 transition-colors">
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-white">Analytics</h1>
      <div className="grid grid-cols-1 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Sales Overview</h3>
          <div className="h-64 bg-dark-300/50 rounded-lg flex items-center justify-center">
            <p className="text-dark-400">Chart placeholder</p>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Products</h3>
          <div className="space-y-3">
            {stockData.slice(0, 3).map((item, index) => (
              <div key={item.id} className="flex items-center justify-between">
                <span className="text-white">{item.name}</span>
                <span className="text-primary font-medium">#{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

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
