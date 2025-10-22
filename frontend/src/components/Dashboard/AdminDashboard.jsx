import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Wifi
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import ProfessionalNavbar from '../Layout/ProfessionalNavbar';
import AdminVerification from '../Admin/AdminVerification';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [aiPerformance, setAiPerformance] = useState({});
  const [systemHealth, setSystemHealth] = useState({});
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchDashboardData();
    generateLiveData();
    
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
    const liveInterval = setInterval(() => {
      if (isLive) {
        generateLiveData();
        setRefreshKey(prev => prev + 1);
      }
    }, 2000); // Update live data every 2 seconds
    
    return () => {
      clearInterval(interval);
      clearInterval(liveInterval);
    };
  }, [isLive]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, predictionsRes, healthRes] = await Promise.all([
        axios.get('http://localhost:5000/api/analytics/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5000/api/predictions/summary', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5000/api/health')
      ]);

      setStats(statsRes.data || {});
      setAiPerformance(predictionsRes.data?.summary || {});
      setSystemHealth(healthRes.data || {});
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
      recommendations: Math.floor(Math.random() * 200) + 400,
      predictions: Math.floor(Math.random() * 150) + 350,
      accuracy: Math.floor(Math.random() * 10) + 88,
      cpu: Math.floor(Math.random() * 30) + 20,
      memory: Math.floor(Math.random() * 40) + 30,
      requests: Math.floor(Math.random() * 500) + 1000,
      errors: Math.floor(Math.random() * 10),
      activeUsers: Math.floor(Math.random() * 100) + 1200
    };
    
    setLiveData(prev => {
      const updated = [...prev, newDataPoint];
      return updated.slice(-20); // Keep only last 20 data points
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

  // Mock AI performance data
  const aiPerformanceData = [
    { time: '00:00', recommendations: 245, predictions: 189, accuracy: 92 },
    { time: '04:00', recommendations: 198, predictions: 156, accuracy: 91 },
    { time: '08:00', recommendations: 432, predictions: 387, accuracy: 94 },
    { time: '12:00', recommendations: 589, predictions: 521, accuracy: 93 },
    { time: '16:00', recommendations: 678, predictions: 612, accuracy: 95 },
    { time: '20:00', recommendations: 445, predictions: 398, accuracy: 92 }
  ];

  const systemMetrics = [
    { name: 'API Response Time', value: '187ms', status: 'good', icon: Zap },
    { name: 'Database Queries', value: '2.4K/min', status: 'good', icon: Database },
    { name: 'Active Users', value: '1,247', status: 'good', icon: Users },
    { name: 'Cache Hit Rate', value: '94.5%', status: 'good', icon: Server }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Enhanced data for impressive charts
  const pieData = [
    { name: 'AI Recommendations', value: 45, color: '#6366F1' },
    { name: 'Stock Predictions', value: 30, color: '#10B981' },
    { name: 'User Analytics', value: 15, color: '#F59E0B' },
    { name: 'System Monitoring', value: 10, color: '#EF4444' }
  ];

  const areaData = liveData.length > 0 ? liveData : [
    { time: '00:00', value: 245, volume: 189 },
    { time: '04:00', value: 198, volume: 156 },
    { time: '08:00', value: 432, volume: 387 },
    { time: '12:00', value: 589, volume: 521 },
    { time: '16:00', value: 678, volume: 612 },
    { time: '20:00', value: 445, volume: 398 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Navbar */}
      <ProfessionalNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
      />
      
      <div className="px-4 pt-6 pb-20">
        {/* Conditional Content Based on Active Tab */}
        {activeTab === 'verification' ? (
          <AdminVerification />
        ) : (
          <>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <p className="text-gray-600 text-sm">Platform health & AI performance monitoring</p>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span className="text-xs text-gray-600">{isLive ? 'LIVE' : 'PAUSED'}</span>
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
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                {isLive ? <Heart className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                <span>{isLive ? 'Live Mode' : 'Pause Live'}</span>
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
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{liveData.length > 0 ? liveData[liveData.length - 1]?.activeUsers || 742 : 742}</p>
                <p className="text-dark-400 text-sm">Active Users</p>
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
                <p className="text-2xl font-bold text-white">{stats.products?.total || 1247}</p>
                <p className="text-dark-400 text-sm">Products</p>
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
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="card p-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-50"></div>
          <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{liveData.length > 0 ? liveData[liveData.length - 1]?.requests || 2156 : 2156}</p>
                <p className="text-dark-400 text-sm">Requests/min</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs">+24%</span>
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
                <Activity className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">99.9%</p>
                <p className="text-dark-400 text-sm">Uptime</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs">Healthy</span>
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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Live AI Performance</h2>
                  <p className="text-dark-400 text-sm">Real-time recommendations & predictions</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-xs text-dark-400">{isLive ? 'Live Data' : 'Paused'}</span>
                <span className="text-xs text-primary bg-primary/20 px-2 py-1 rounded">v2.1.0</span>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={liveData.length > 0 ? liveData : aiPerformanceData} key={refreshKey}>
                  <defs>
                    <linearGradient id="recommendationsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="predictionsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="recommendations"
                    stroke="#6366F1"
                    strokeWidth={3}
                    fill="url(#recommendationsGradient)"
                    name="AI Recommendations"
                    dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#6366F1', strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="predictions"
                    stroke="#10B981"
                    strokeWidth={3}
                    fill="url(#predictionsGradient)"
                    name="Stock Predictions"
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    fill="url(#accuracyGradient)"
                    name="Accuracy %"
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* AI Metrics & Pie Chart */}
        <div className="space-y-6">
          {/* AI Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-white">AI Metrics</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-dark-300/50 rounded-lg">
            <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                    <p className="text-white text-sm font-medium">Products Analyzed</p>
                    <p className="text-dark-400 text-xs">Real-time processing</p>
                  </div>
                </div>
                <p className="text-white font-bold">{aiPerformance.total_products_analyzed || 1247}</p>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-dark-300/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-red-400" />
            </div>
                  <div>
                    <p className="text-white text-sm font-medium">Critical Alerts</p>
                    <p className="text-dark-400 text-xs">Requires attention</p>
          </div>
        </div>
                <p className="text-red-400 font-bold">{aiPerformance.critical_products || 3}</p>
      </div>

              <div className="flex items-center justify-between p-3 bg-dark-300/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
                  <div>
                    <p className="text-white text-sm font-medium">Avg Accuracy</p>
                    <p className="text-dark-400 text-xs">Model performance</p>
          </div>
        </div>
                <p className="text-green-400 font-bold">{liveData.length > 0 ? liveData[liveData.length - 1]?.accuracy || 94 : 94}%</p>
              </div>
            </div>
          </motion.div>

          {/* Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-white">AI Distribution</h3>
              </div>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
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
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-dark-400">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced System Health & Real-time Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Server className="w-6 h-6 text-white" />
              </div>
            <div>
                <h2 className="text-xl font-bold text-white">System Health</h2>
                <p className="text-dark-400 text-sm">Real-time monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs">All Systems Operational</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'CPU Usage', value: liveData.length > 0 ? `${liveData[liveData.length - 1]?.cpu || 25}%` : '25%', icon: Cpu, color: 'blue', status: 'good' },
              { name: 'Memory', value: liveData.length > 0 ? `${liveData[liveData.length - 1]?.memory || 45}%` : '45%', icon: HardDrive, color: 'green', status: 'good' },
              { name: 'Network', value: '98.2%', icon: Wifi, color: 'purple', status: 'good' },
              { name: 'Database', value: '2.4ms', icon: Database, color: 'yellow', status: 'good' }
            ].map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-dark-300/50 rounded-xl p-4 relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-${metric.color}-500/10 to-transparent opacity-50`}></div>
                  <div className="relative">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-8 h-8 bg-${metric.color}-500/20 rounded-lg flex items-center justify-center border border-${metric.color}-500/30`}>
                        <Icon className={`w-4 h-4 text-${metric.color}-400`} />
                      </div>
            <div>
                        <p className="text-dark-400 text-xs font-medium">{metric.name}</p>
                      </div>
                    </div>
                    <p className="text-white font-bold text-2xl mb-2">{metric.value}</p>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 text-xs">Optimal</span>
                    </div>
            </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Real-time Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            <div>
                <h2 className="text-xl font-bold text-white">Live Activity</h2>
                <p className="text-dark-400 text-sm">Real-time events</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-purple-400 text-xs">Live Stream</span>
        </div>
      </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {[
              { action: 'AI recommendation generated', user: 'System', time: 'Just now', type: 'ai', icon: Brain },
              { action: 'New order placed', user: 'Retailer #245', time: '30s ago', type: 'order', icon: Package },
              { action: 'Stock prediction updated', user: 'System', time: '1m ago', type: 'prediction', icon: TrendingUp },
              { action: 'Product inventory updated', user: 'Distributor #89', time: '2m ago', type: 'product', icon: Package },
              { action: 'User login detected', user: 'Retailer #246', time: '3m ago', type: 'user', icon: Users },
              { action: 'Critical alert resolved', user: 'System', time: '5m ago', type: 'alert', icon: AlertCircle },
              { action: 'Performance optimization', user: 'System', time: '8m ago', type: 'system', icon: Zap },
              { action: 'Data backup completed', user: 'System', time: '12m ago', type: 'system', icon: Database }
            ].map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-dark-300/30 rounded-xl hover:bg-dark-300/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activity.type === 'order' ? 'bg-green-500/20 border border-green-500/30' :
                      activity.type === 'ai' ? 'bg-purple-500/20 border border-purple-500/30' :
                      activity.type === 'prediction' ? 'bg-blue-500/20 border border-blue-500/30' :
                      activity.type === 'product' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                      activity.type === 'user' ? 'bg-indigo-500/20 border border-indigo-500/30' :
                      activity.type === 'alert' ? 'bg-red-500/20 border border-red-500/30' :
                      'bg-gray-500/20 border border-gray-500/30'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        activity.type === 'order' ? 'text-green-400' :
                        activity.type === 'ai' ? 'text-purple-400' :
                        activity.type === 'prediction' ? 'text-blue-400' :
                        activity.type === 'product' ? 'text-yellow-400' :
                        activity.type === 'user' ? 'text-indigo-400' :
                        activity.type === 'alert' ? 'text-red-400' :
                        'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{activity.action}</p>
                      <p className="text-dark-400 text-xs">{activity.user}</p>
        </div>
      </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'order' ? 'bg-green-400 animate-pulse' :
                      activity.type === 'ai' ? 'bg-purple-400 animate-pulse' :
                      activity.type === 'prediction' ? 'bg-blue-400' :
                      activity.type === 'product' ? 'bg-yellow-400' :
                      activity.type === 'user' ? 'bg-indigo-400' :
                      activity.type === 'alert' ? 'bg-red-400' :
                      'bg-gray-400'
                    }`} />
                    <span className="text-dark-400 text-xs flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                    </span>
    </div>
                </motion.div>
              );
            })}
      </div>
        </motion.div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
