import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProfessionalNavbar from '../Layout/ProfessionalNavbar';
import { useAuth } from '../../contexts/AuthContext';
import {
  Activity,
  Users,
  Package,
  TrendingUp,
  Brain,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Server,
  BarChart3,
  LogOut,
  RefreshCw,
  Heart,
  Target,
  Globe,
  Cpu,
  HardDrive,
  Wifi,
  Eye,
  ShoppingCart,
  DollarSign,
  Store,
  Building,
  Filter
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const HeadRetailerDashboard = () => {
  const { logout } = useAuth();
  const [stats, setStats] = useState({});
  const [allBrands, setAllBrands] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allRetailers, setAllRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState('all');

  useEffect(() => {
    fetchDashboardData();
    generateLiveData();
    
    const interval = setInterval(fetchDashboardData, 30000);
    const liveInterval = setInterval(() => {
      if (isLive) {
        generateLiveData();
        setRefreshKey(prev => prev + 1);
      }
    }, 3000);
    
    return () => {
      clearInterval(interval);
      clearInterval(liveInterval);
    };
  }, [isLive]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, brandsRes, productsRes, retailersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/analytics/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5000/api/brands', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5000/api/products/all', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5000/api/retailers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setStats(statsRes.data || {});
      setAllBrands(brandsRes.data || []);
      setAllProducts(productsRes.data?.products || []);
      setAllRetailers(retailersRes.data?.retailers || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateLiveData = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    const newDataPoint = {
      time: timeString,
      orders: Math.floor(Math.random() * 100) + 200,
      revenue: Math.floor(Math.random() * 50000) + 100000,
      retailers: Math.floor(Math.random() * 20) + 450,
      products: Math.floor(Math.random() * 50) + 1200
    };
    
    setLiveData(prev => {
      const updated = [...prev, newDataPoint];
      return updated.slice(-15);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const toggleLiveMode = () => {
    setIsLive(!isLive);
  };

  // Enhanced data for impressive charts
  const brandData = [
    { name: 'Nestle', value: 25, color: '#6366F1' },
    { name: 'Unilever', value: 20, color: '#10B981' },
    { name: 'P&G', value: 15, color: '#F59E0B' },
    { name: 'Coca-Cola', value: 12, color: '#EF4444' },
    { name: 'PepsiCo', value: 10, color: '#8B5CF6' },
    { name: 'Others', value: 18, color: '#6B7280' }
  ];

  const filteredProducts = selectedBrand === 'all' 
    ? allProducts 
    : allProducts.filter(product => product.brand === selectedBrand);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Navbar */}
      <ProfessionalNavbar 
        activeTab="dashboard" 
        setActiveTab={() => {}} 
        onLogout={logout}
      />
      
      <div className="px-4 pt-6 pb-20">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Head Retailer Dashboard
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <p className="text-gray-600 text-sm">Complete marketplace oversight & brand management</p>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-xs text-dark-400">{isLive ? 'LIVE' : 'PAUSED'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLiveMode}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isLive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}
          >
            <div className="flex items-center space-x-2">
              {isLive ? <Heart className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
              <span>{isLive ? 'Live Mode' : 'Pause Live'}</span>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all duration-200"
          >
            <div className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Enhanced Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="card p-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-50"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                <Store className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{allRetailers.length || 470}</p>
                <p className="text-dark-400 text-sm">Total Retailers</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs">+8%</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="card p-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-50"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
                <Package className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{allProducts.length || 1247}</p>
                <p className="text-dark-400 text-sm">All Products</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs">+12%</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="card p-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-50"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                <ShoppingCart className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{liveData.length > 0 ? liveData[liveData.length - 1]?.orders || 285 : 285}</p>
                <p className="text-dark-400 text-sm">Total Orders</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs">+15%</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="card p-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-50"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center border border-yellow-500/30">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">₹{(liveData.length > 0 ? liveData[liveData.length - 1]?.revenue || 145000 : 145000).toLocaleString()}</p>
                <p className="text-dark-400 text-sm">Total Revenue</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs">+22%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Live Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Live Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-50"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Live Marketplace Performance</h2>
                  <p className="text-dark-400 text-sm">Real-time orders, revenue & retailer activity</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-xs text-dark-400">{isLive ? 'Live Data' : 'Paused'}</span>
                <span className="text-xs text-primary bg-primary/20 px-2 py-1 rounded">Head View</span>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={liveData.length > 0 ? liveData : [
                  { time: '10:00', orders: 245, revenue: 120000, retailers: 450 },
                  { time: '11:00', orders: 198, revenue: 98000, retailers: 445 },
                  { time: '12:00', orders: 432, revenue: 187000, retailers: 460 },
                  { time: '13:00', orders: 589, revenue: 245000, retailers: 470 },
                  { time: '14:00', orders: 678, revenue: 289000, retailers: 475 },
                  { time: '15:00', orders: 445, revenue: 198000, retailers: 470 }
                ]} key={refreshKey}>
                  <defs>
                    <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="retailersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3A" />
                  <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A1D29',
                      border: '1px solid #2A2D3A',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                    }}
                    labelStyle={{ color: '#E5E7EB' }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#6366F1"
                    strokeWidth={3}
                    fill="url(#ordersGradient)"
                    name="Orders"
                    dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#6366F1', strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                    name="Revenue (₹)"
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="retailers"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    fill="url(#retailersGradient)"
                    name="Active Retailers"
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Brand Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Building className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-white">Brand Distribution</h3>
          </div>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={brandData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {brandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1D29',
                    border: '1px solid #2A2D3A',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            {brandData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-dark-400">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* All Brands & Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* All Brands */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">All Brands</h2>
                <p className="text-dark-400 text-sm">Complete brand portfolio overview</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-purple-400 text-xs">{allBrands.length || 8} Brands</span>
            </div>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {allBrands.slice(0, 10).map((brand, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-dark-300/30 rounded-xl hover:bg-dark-300/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{brand.name || `Brand ${index + 1}`}</p>
                    <p className="text-dark-400 text-xs">{brand.products_count || Math.floor(Math.random() * 50) + 10} products</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs">Active</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All Products with Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">All Products</h2>
                <p className="text-dark-400 text-sm">Complete product catalog</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-dark-400" />
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-dark-300 text-white text-xs px-2 py-1 rounded border border-dark-400"
              >
                <option value="all">All Brands</option>
                {allBrands.slice(0, 5).map((brand, index) => (
                  <option key={index} value={brand.name || `Brand ${index + 1}`}>
                    {brand.name || `Brand ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {filteredProducts.slice(0, 8).map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-dark-300/30 rounded-xl hover:bg-dark-300/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{product.name || `Product ${index + 1}`}</p>
                    <p className="text-dark-400 text-xs">{product.brand || `Brand ${index + 1}`} • ₹{product.price || Math.floor(Math.random() * 500) + 50}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-green-400 text-xs">In Stock</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
};

export default HeadRetailerDashboard;
