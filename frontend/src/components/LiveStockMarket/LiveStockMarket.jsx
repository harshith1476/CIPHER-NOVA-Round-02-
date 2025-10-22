import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Brain,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Filter,
  Search,
  BarChart3,
  LineChart,
  PieChart,
  DollarSign,
  Package,
  Clock,
  Eye,
  Star
} from 'lucide-react';

const LiveStockMarket = () => {
  const [stockData, setStockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('trend');
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [favorites, setFavorites] = useState(new Set());

  // Fetch stock data
  const fetchStockData = useCallback(async () => {
    try {
      const response = await fetch('/api/analytics/live-stocks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStockData(data.stocks || []);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  }, []);

  // Auto-refresh every 5 seconds when live mode is on for super fast updates
  useEffect(() => {
    fetchStockData();
    
    if (isLive) {
      const interval = setInterval(fetchStockData, 5000); // 5 seconds
      return () => clearInterval(interval);
    }
  }, [isLive, fetchStockData]);

  // Filter and sort data
  useEffect(() => {
    let filtered = [...stockData];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'trend':
          return b.trend_percentage - a.trend_percentage;
        case 'price':
          return b.price - a.price;
        case 'stock':
          return b.stock - a.stock;
        case 'demand':
          const demandOrder = { 'Very High': 4, 'High': 3, 'Moderate': 2, 'Low': 1 };
          return demandOrder[b.demand_level] - demandOrder[a.demand_level];
        default:
          return 0;
      }
    });

    setFilteredData(filtered);
  }, [stockData, selectedCategory, searchTerm, sortBy]);

  // Get unique categories
  const categories = ['all', ...new Set(stockData.map(item => item.category))];

  // Toggle favorite
  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  // Get trend color and icon
  const getTrendStyle = (trend, percentage) => {
    if (trend === 'up') {
      return {
        color: 'text-green-400',
        bgColor: 'bg-green-400/20',
        borderColor: 'border-green-400/30',
        icon: <TrendingUp className="w-4 h-4" />
      };
    } else if (trend === 'down') {
      return {
        color: 'text-red-400',
        bgColor: 'bg-red-400/20',
        borderColor: 'border-red-400/30',
        icon: <TrendingDown className="w-4 h-4" />
      };
    } else {
      return {
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/20',
        borderColor: 'border-blue-400/30',
        icon: <Activity className="w-4 h-4" />
      };
    }
  };

  // Get stock status
  const getStockStatus = (stock, minStock) => {
    if (stock <= minStock) return { status: 'critical', color: 'text-red-400', bgColor: 'bg-red-400/20' };
    if (stock <= minStock * 1.5) return { status: 'low', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' };
    if (stock <= minStock * 2) return { status: 'medium', color: 'text-blue-400', bgColor: 'bg-blue-400/20' };
    return { status: 'good', color: 'text-green-400', bgColor: 'bg-green-400/20' };
  };

  // Get demand color
  const getDemandColor = (demand) => {
    switch (demand) {
      case 'Very High': return 'text-red-400 bg-red-400/20';
      case 'High': return 'text-orange-400 bg-orange-400/20';
      case 'Moderate': return 'text-blue-400 bg-blue-400/20';
      case 'Low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Live Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-primary animate-pulse" />
            <h1 className="text-2xl font-bold text-white">Live Stock Market</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span className={`text-sm ${isLive ? 'text-green-400' : 'text-gray-400'}`}>
              {isLive ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-dark-400">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isLive 
                ? 'bg-green-400/20 text-green-400 border border-green-400/30' 
                : 'bg-gray-400/20 text-gray-400 border border-gray-400/30'
            }`}
          >
            {isLive ? 'Stop Live' : 'Start Live'}
          </button>
          <button
            onClick={fetchStockData}
            className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 border border-green-400/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-400">
                {stockData.filter(item => item.trend === 'up').length}
              </p>
              <p className="text-dark-400 text-sm">Rising Stocks</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4 border border-red-400/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-400">
                {stockData.filter(item => item.trend === 'down').length}
              </p>
              <p className="text-dark-400 text-sm">Falling Stocks</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4 border border-yellow-400/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {stockData.filter(item => item.stock <= item.min_stock).length}
              </p>
              <p className="text-dark-400 text-sm">Low Stock</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-4 border border-primary/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                {stockData.filter(item => item.demand_level === 'Very High').length}
              </p>
              <p className="text-dark-400 text-sm">High Demand</p>
            </div>
            <Target className="w-8 h-8 text-primary" />
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-300 border border-dark-400 rounded-lg text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-dark-300 border border-dark-400 rounded-lg text-white focus:border-primary focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.slice(1).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-dark-300 border border-dark-400 rounded-lg text-white focus:border-primary focus:outline-none"
          >
            <option value="trend">Sort by Trend</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
            <option value="demand">Sort by Demand</option>
          </select>
        </div>
      </motion.div>

      {/* Stock Market Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-400">
                <th className="text-left py-3 px-4 text-dark-400 font-medium">Product</th>
                <th className="text-left py-3 px-4 text-dark-400 font-medium">Category</th>
                <th className="text-right py-3 px-4 text-dark-400 font-medium">Price</th>
                <th className="text-right py-3 px-4 text-dark-400 font-medium">Stock</th>
                <th className="text-center py-3 px-4 text-dark-400 font-medium">Trend</th>
                <th className="text-center py-3 px-4 text-dark-400 font-medium">Demand</th>
                <th className="text-center py-3 px-4 text-dark-400 font-medium">AI Score</th>
                <th className="text-center py-3 px-4 text-dark-400 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredData.slice(0, 50).map((item, index) => {
                  const trendStyle = getTrendStyle(item.trend, item.trend_percentage);
                  const stockStatus = getStockStatus(item.stock, item.min_stock);
                  const demandColor = getDemandColor(item.demand_level);
                  
                  return (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-dark-300/50 hover:bg-dark-300/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleFavorite(item._id)}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                          >
                            <Star 
                              className={`w-4 h-4 ${favorites.has(item._id) ? 'fill-current' : ''}`} 
                            />
                          </button>
                          <div>
                            <p className="text-white font-medium">{item.name}</p>
                            <p className="text-dark-400 text-sm">{item.brand}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <span className="text-dark-400">{item.category}</span>
                      </td>
                      
                      <td className="py-4 px-4 text-right">
                        <p className="text-white font-medium">₹{item.price.toLocaleString()}</p>
                      </td>
                      
                      <td className="py-4 px-4 text-right">
                        <div className="flex flex-col items-end">
                          <p className="text-white">{item.stock}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.bgColor} ${stockStatus.color}`}>
                            {stockStatus.status}
                          </span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {trendStyle.icon}
                          <span className={`text-sm font-medium ${trendStyle.color}`}>
                            {item.trend_percentage}%
                          </span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${demandColor}`}>
                          {item.demand_level}
                        </span>
                      </td>
                      
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Brain className="w-4 h-4 text-primary" />
                          <span className="text-primary font-medium">
                            {item.ai_confidence}%
                          </span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4 text-center">
                        <button className="text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                          {item.stock <= item.min_stock ? 'Reorder Now' : 'Monitor'}
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* AI Insights Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-6 border border-primary/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary animate-pulse" />
            <h3 className="text-lg font-semibold text-white">AI Market Insights</h3>
          </div>
          <Zap className="w-5 h-5 text-primary" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-dark-300/30 rounded-lg">
            <h4 className="text-white font-medium mb-2">Top Performers</h4>
            <p className="text-dark-400 text-sm">
              {stockData.filter(item => item.trend === 'up').length} products showing positive trends with average {stockData.filter(item => item.trend === 'up').reduce((acc, item) => acc + item.trend_percentage, 0) / Math.max(1, stockData.filter(item => item.trend === 'up').length).toFixed(1)}% growth.
            </p>
          </div>
          
          <div className="p-4 bg-dark-300/30 rounded-lg">
            <h4 className="text-white font-medium mb-2">Critical Alerts</h4>
            <p className="text-dark-400 text-sm">
              {stockData.filter(item => item.stock <= item.min_stock).length} products require immediate restocking to prevent stockouts.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveStockMarket;
