import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  Bell,
  User,
  Menu,
  X,
  MapPin,
  Phone,
  Truck,
  Heart,
  Settings,
  LogOut,
  Package,
  BarChart3,
  Home,
  ChevronDown,
  Globe,
  Shield,
  Award
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfessionalNavbar = ({ activeTab, setActiveTab, onLogout }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'head_retailer': return 'Head Retailer';
      case 'head_distributor': return 'Head Distributor';
      case 'retailer': return 'Retailer';
      case 'distributor': return 'Distributor';
      case 'admin': return 'Administrator';
      default: return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'head_retailer': return 'text-purple-600 bg-purple-100';
      case 'head_distributor': return 'text-blue-600 bg-blue-100';
      case 'retailer': return 'text-green-600 bg-green-100';
      case 'distributor': return 'text-orange-600 bg-orange-100';
      case 'admin': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get user role from localStorage or context
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser.role || 'retailer';

  const getTabsForRole = (role) => {
    const baseTabs = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'products', label: 'Products', icon: Package },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'orders', label: 'Orders', icon: ShoppingCart }
    ];

    if (role === 'admin') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'verification', label: 'Verification', icon: Shield },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'orders', label: 'Orders', icon: ShoppingCart }
      ];
    }

    return baseTabs;
  };

  const tabs = getTabsForRole(userRole);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Deliver to {user?.name || 'Your Location'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Customer Service: +91 9876543210</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span>B2B Marketplace</span>
              <span>•</span>
              <span>Enterprise Solutions</span>
              <span>•</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">Q</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">Qwipo</span>
              <div className="text-xs text-gray-600 -mt-1">AI Marketplace</div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <div className="flex">
                <select className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>All Categories</option>
                  <option>Beverages</option>
                  <option>Snacks</option>
                  <option>Dairy</option>
                  <option>Household</option>
                  <option>Personal Care</option>
                  <option>Food Items</option>
                </select>
                <input
                  type="text"
                  placeholder="Search products, brands, suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-none px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Orders */}
            <div className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-blue-600 cursor-pointer">
              <ShoppingCart className="w-6 h-6" />
              <div className="text-xs">
                <div className="font-medium">Orders</div>
                <div className="text-gray-500">Track & Manage</div>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="relative p-2 text-gray-700 hover:text-blue-600">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500">{getRoleDisplayName(user?.role)}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user?.name}</div>
                          <div className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user?.role)}`}>
                            {getRoleDisplayName(user?.role)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Account Settings</span>
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <Heart className="w-4 h-4" />
                        <span>Wishlist</span>
                      </button>
                      <div className="border-t border-gray-100 my-2"></div>
                      <button 
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-700"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-8 border-t border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 bg-gray-50"
            >
              <div className="py-4 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default ProfessionalNavbar;
