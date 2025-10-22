import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Settings,
  RefreshCw,
  Brain,
  Zap,
  Target,
  Activity,
  Clock,
  DollarSign,
  ChevronDown,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import RealTimeCharts from '../Analytics/RealTimeCharts';
import LiveStockMarket from '../LiveStockMarket/LiveStockMarket';
import LiveStocksAnalytics from '../Analytics/LiveStocksAnalytics';

const EnhancedRetailerDashboard = ({ socket }) => {
  const [activeTab, setActiveTab] = useState('live-market');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [aiPredictions, setAiPredictions] = useState([]);
  const [liveRecommendations, setLiveRecommendations] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const { user, logout } = useAuth();

  // Fetch AI predictions
  const fetchAiPredictions = async () => {
    try {
      const response = await fetch('/api/analytics/ai-predictions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAiPredictions(data.predictions || []);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error fetching AI predictions:', error);
    }
  };

  // Fetch live recommendations
  const fetchLiveRecommendations = async () => {
    try {
      const response = await fetch('/api/analytics/live-recommendations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLiveRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Error fetching live recommendations:', error);
    }
  };

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    fetchDashboardStats();
    fetchAiPredictions();
    fetchLiveRecommendations();

    const interval = setInterval(() => {
      fetchAiPredictions();
      fetchLiveRecommendations();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

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

  const handleRefresh = () => {
    setLoading(true);
    Promise.all([
      fetchDashboardStats(),
      fetchAiPredictions(),
      fetchLiveRecommendations()
    ]).finally(() => {
      setLoading(false);
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'high': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'medium': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'low': return 'text-green-400 bg-green-400/20 border-green-400/30';
      default: return 'text-dark-400 bg-dark-400/20 border-dark-400/30';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const renderHome = () => (
    <div className="space-y-6 pb-20">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-dark-400 text-sm">Here's your retail overview with AI insights</p>
          {lastUpdate && (
            <p className="text-xs text-primary/70 mt-1">
              Last updated: {lastUpdate}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 bg-dark-200 rounded-lg hover:bg-dark-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-dark-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
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
                    <p className="text-white font-medium">{user?.name}</p>
                    <p className="text-dark-400 text-sm">{user?.email}</p>
                    <p className="text-primary text-xs capitalize">{user?.role}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowProfile(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-white hover:bg-dark-300 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </button>
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

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 border border-primary/20"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{dashboardStats.products?.total || 142}</p>
              <p className="text-dark-400 text-sm">Total Products</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4 border border-red-400/20"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{dashboardStats.products?.low_stock || 3}</p>
              <p className="text-dark-400 text-sm">Low Stock</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Predictions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-white">AI Stock Predictions</h3>
          </div>
          <span className="text-primary text-sm flex items-center space-x-1">
            <Activity className="w-4 h-4" />
            <span>Live Forecast</span>
          </span>
        </div>
        
        <div className="space-y-4">
          {aiPredictions.slice(0, 3).map((prediction, index) => (
            <motion.div
              key={prediction.product_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getPriorityColor(prediction.urgency)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(prediction.urgency)}
                    <div>
                      <p className="text-white font-medium">{prediction.product_name}</p>
                      <p className="text-sm opacity-80">
                        {prediction.current_stock} units left • {prediction.days_to_stockout} days to stockout
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{prediction.confidence}% confidence</p>
                  <p className="text-xs opacity-80">{prediction.demand_level}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm opacity-80">{prediction.recommendation}</p>
                <button className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
                  Reorder ({prediction.reorder_quantity})
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Live Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-white">Live Stock Recommendations</h3>
          </div>
          <span className="text-primary text-sm">Real-time</span>
        </div>
        
        <div className="space-y-3">
          {liveRecommendations.slice(0, 2).map((rec, index) => (
            <motion.div
              key={rec.product_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-dark-300/50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getPriorityColor(rec.priority)}`}>
                  {getPriorityIcon(rec.priority)}
                </div>
                <div>
                  <p className="text-white font-medium">{rec.product_name}</p>
                  <p className="text-dark-400 text-sm">{rec.message}</p>
                </div>
              </div>
              <div className="text-right">
                <button className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
                  {rec.action}
                </button>
                <p className="text-xs text-dark-400">
                  ₹{rec.estimated_revenue_impact}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Voice Assistant */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6 text-center border border-primary/20"
      >
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mic className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">AI Voice Assistant</h3>
        <p className="text-dark-400 text-sm mb-4">Say "Hey Qwipo" to get started with AI-powered insights</p>
        <button className="btn-primary w-full">
          Start Voice Command
        </button>
      </motion.div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Products with AI Insights</h1>
        <button className="btn-primary">Add Product</button>
      </div>

      <div className="space-y-4">
        {liveRecommendations.map((item, index) => (
          <motion.div
            key={item.product_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-4 border border-primary/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-dark-300 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-dark-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{item.product_name}</h3>
                  <p className="text-dark-400 text-sm">Stock: {item.current_stock} units</p>
                  <p className="text-xs text-primary">AI: {item.stock_health_percentage}% health</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                  {item.priority}
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
      <LiveStocksAnalytics />
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

  const renderProfile = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={() => setShowProfile(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-200 rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Profile Settings</h2>
          <button
            onClick={() => setShowProfile(false)}
            className="p-2 hover:bg-dark-300 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-dark-400" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Name</label>
            <input
              type="text"
              value={user?.name || ''}
              className="w-full p-3 bg-dark-300 border border-dark-400 rounded-lg text-white focus:border-primary focus:outline-none"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full p-3 bg-dark-300 border border-dark-400 rounded-lg text-white focus:border-primary focus:outline-none"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Role</label>
            <input
              type="text"
              value={user?.role || ''}
              className="w-full p-3 bg-dark-300 border border-dark-400 rounded-lg text-white focus:border-primary focus:outline-none capitalize"
              readOnly
            />
          </div>
          
          <div className="pt-4 border-t border-dark-400">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500/20 text-red-400 hover:bg-red-500/30 p-3 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 inline mr-2" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderLiveMarket = () => (
    <div className="space-y-6 pb-20">
      <LiveStockMarket />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'live-market': return renderLiveMarket();
      case 'home': return renderHome();
      case 'products': return renderProducts();
      case 'analytics': return renderAnalytics();
      case 'orders': return renderOrders();
      default: return renderLiveMarket();
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
            onClick={() => setActiveTab('live-market')}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-300 ${
              activeTab === 'live-market' 
                ? 'text-primary bg-primary/10' 
                : 'text-dark-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-medium">Live Market</span>
          </button>
          
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
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && renderProfile()}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedRetailerDashboard;
