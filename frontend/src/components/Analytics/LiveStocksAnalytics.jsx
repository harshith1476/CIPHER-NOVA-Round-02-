import React, { useState, useEffect } from 'react';
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
  BarChart3,
  LineChart,
  PieChart,
  DollarSign,
  Package,
  Clock,
  Eye,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

// Smooth Number Transition Component
const SmoothNumber = ({ value, className = "" }) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);
  
  return (
    <motion.span
      key={value}
      initial={{ scale: 1.1, opacity: 0.7 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {displayValue}
    </motion.span>
  );
};

const LiveStocksAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    stockForecast: [],
    productCards: [],
    marketSummary: {},
    liveUpdates: true
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  // Generate realistic 7-day stock forecast data with live variations
  const generateStockForecast = (productName, currentStock, trend) => {
    const forecast = [];
    let stock = currentStock;
    
    for (let day = 1; day <= 7; day++) {
      let change;
      if (trend === 'declining') {
        change = Math.random() * -8 + Math.random() * -3; // -3 to -11 per day
      } else if (trend === 'critical') {
        change = Math.random() * -12 + Math.random() * -5; // -5 to -17 per day
      } else if (trend === 'stable') {
        change = (Math.random() - 0.5) * 4; // -2 to +2 per day
      } else {
        change = Math.random() * 6 + Math.random() * 2; // +2 to +8 per day
      }
      
      // Add live variation every 5 seconds
      const liveVariation = (Math.random() - 0.5) * 2; // ±1 unit variation
      stock = Math.max(0, stock + change + liveVariation);
      
      forecast.push({
        day: day,
        stock: Math.round(stock),
        date: new Date(Date.now() + (day - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      });
    }
    
    return forecast;
  };

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    setIsUpdating(true);
    try {
      // Simulate API call with realistic data that changes every 5 seconds
      const currentTime = Date.now();
      const liveVariation = Math.sin(currentTime / 2000) * 0.5; // Faster, more visible variation
      const randomVariation = (Math.random() - 0.5) * 0.4; // Much more noticeable changes
      const timeBasedVariation = Math.sin(currentTime / 3000) * 0.3; // Additional time-based changes
      
      const mockData = {
        stockForecast: generateStockForecast('Maggi Noodles', 42, 'declining'),
        productCards: [
          {
            id: 1,
            name: 'Maggi Noodles',
            status: 'Declining',
            currentStock: Math.max(1, Math.round(42 + liveVariation * 12 + randomVariation * 8 + timeBasedVariation * 6)),
            prediction: Math.max(0, Math.round(25 + liveVariation * 10 + randomVariation * 6 + timeBasedVariation * 4)),
            aiConfidence: Math.max(70, Math.min(99, 89.63 + liveVariation * 6 + randomVariation * 4 + timeBasedVariation * 2)),
            demandLevel: 'high',
            recommendation: 'Reorder in 2 days',
            trend: 'down',
            trendPercentage: -8.5 + liveVariation * 1,
            price: 12.0,
            category: 'Noodles & Pasta',
            supplier: 'Nestle'
          },
          {
            id: 2,
            name: 'Coca Cola',
            status: 'Critical',
            currentStock: Math.max(1, Math.round(12 + liveVariation * 8 + randomVariation * 5 + timeBasedVariation * 3)),
            prediction: Math.max(0, Math.round(liveVariation * 6 + randomVariation * 4 + timeBasedVariation * 2)),
            aiConfidence: Math.max(85, Math.min(99, 95.96 + liveVariation * 4 + randomVariation * 3 + timeBasedVariation * 2)),
            demandLevel: 'very high',
            recommendation: 'Urgent reorder needed',
            trend: 'down',
            trendPercentage: -15.2 + liveVariation * 2,
            price: 35.0,
            category: 'Beverages',
            supplier: 'Coca Cola'
          },
          {
            id: 3,
            name: 'Lays Chips',
            status: 'Stable',
            currentStock: Math.max(1, Math.round(74 + liveVariation * 10 + randomVariation * 6 + timeBasedVariation * 4)),
            prediction: Math.max(0, Math.round(62 + liveVariation * 8 + randomVariation * 5 + timeBasedVariation * 3)),
            aiConfidence: Math.max(80, Math.min(95, 87.50 + liveVariation * 4 + randomVariation * 3 + timeBasedVariation * 2)),
            demandLevel: 'moderate',
            recommendation: 'Monitor closely',
            trend: 'stable',
            trendPercentage: 1.2 + liveVariation * 0.8,
            price: 10.0,
            category: 'Snacks & Chips',
            supplier: 'PepsiCo'
          },
          {
            id: 4,
            name: 'Parle-G Biscuits',
            status: 'Critical',
            currentStock: Math.max(1, Math.round(4 + liveVariation * 6 + randomVariation * 4 + timeBasedVariation * 2)),
            prediction: Math.max(0, Math.round(liveVariation * 4 + randomVariation * 3 + timeBasedVariation * 1.5)),
            aiConfidence: Math.max(90, Math.min(99, 97.08 + liveVariation * 3 + randomVariation * 2.5 + timeBasedVariation * 1.5)),
            demandLevel: 'very high',
            recommendation: 'Immediate reorder',
            trend: 'down',
            trendPercentage: -22.8 + liveVariation * 1.5,
            price: 5.0,
            category: 'Snacks & Chips',
            supplier: 'Parle'
          }
        ],
        marketSummary: {
          totalProducts: 152,
          criticalStocks: Math.max(0, Math.round(28 + liveVariation * 8 + randomVariation * 6 + timeBasedVariation * 4)),
          decliningStocks: Math.max(0, Math.round(45 + liveVariation * 12 + randomVariation * 8 + timeBasedVariation * 5)),
          stableStocks: Math.max(0, Math.round(67 + liveVariation * 15 + randomVariation * 10 + timeBasedVariation * 6)),
          risingStocks: Math.max(0, Math.round(12 + liveVariation * 6 + randomVariation * 4 + timeBasedVariation * 3)),
          totalRevenue: Math.max(0, Math.round(245000 + liveVariation * 20000 + randomVariation * 10000 + timeBasedVariation * 5000)),
          revenueChange: 12.5 + liveVariation * 6 + randomVariation * 4 + timeBasedVariation * 3
        }
      };

      setAnalyticsData(mockData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setTimeout(() => setIsUpdating(false), 500); // Show updating for 500ms
    }
  };

  // Auto-refresh every 5 seconds for super fast live updates
  useEffect(() => {
    fetchAnalyticsData();
    
    // Always set up the interval for automatic updates
    const interval = setInterval(() => {
      fetchAnalyticsData();
    }, 5000); // 5 seconds
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only once

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'critical': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'declining': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'stable': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'rising': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'declining': return <TrendingDown className="w-4 h-4" />;
      case 'stable': return <Minus className="w-4 h-4" />;
      case 'rising': return <TrendingUp className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Get demand color
  const getDemandColor = (demand) => {
    switch (demand.toLowerCase()) {
      case 'very high': return 'text-red-400 bg-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/20';
      case 'moderate': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Render 7-Day Stock Forecast Chart - EXACT MATCH TO REFERENCE
  const renderStockForecast = () => {
    const data = analyticsData.stockForecast;
    if (!data || data.length === 0) return null;

    const maxStock = Math.max(...data.map(d => d.stock));
    const minStock = Math.min(...data.map(d => d.stock));
    const range = maxStock - minStock || 1;

    return (
      <div className="h-80 relative bg-dark-800 rounded-lg p-4">
        <svg className="w-full h-full" viewBox="0 0 800 300">
          <defs>
            <linearGradient id="stockGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#00d4aa" stopOpacity="0.3"/>
            </linearGradient>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          
          {/* Background grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Grid lines - exact match to reference */}
          {[0, 15, 30, 45, 60].map((value, index) => {
            const y = ((60 - value) / 60) * 280 + 10;
            return (
              <line
                key={value}
                x1="60"
                y1={y}
                x2="740"
                y2={y}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            );
          })}

          {/* Y-axis labels - exact positioning */}
          {[0, 15, 30, 45, 60].map((value, index) => {
            const y = ((60 - value) / 60) * 280 + 10;
            return (
              <text
                key={value}
                x="40"
                y={y + 5}
                fill="rgba(255,255,255,0.7)"
                fontSize="12"
                textAnchor="end"
              >
                {value}
              </text>
            );
          })}

          {/* X-axis labels */}
          {data.map((point, index) => {
            const x = 60 + (index / (data.length - 1)) * 680;
            return (
              <text
                key={index}
                x={x}
                y="295"
                fill="rgba(255,255,255,0.7)"
                fontSize="12"
                textAnchor="middle"
              >
                Day {point.day}
              </text>
            );
          })}

          {/* Stock forecast line - EXACT green color and style */}
          <polyline
            fill="none"
            stroke="#00ff88"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={data.map((point, index) => {
              const x = 60 + (index / (data.length - 1)) * 680;
              const y = ((60 - point.stock) / 60) * 280 + 10;
              return `${x},${y}`;
            }).join(' ')}
          />

          {/* Fill area - exact gradient */}
          <polygon
            fill="url(#stockGradient)"
            points={`60,290 ${data.map((point, index) => {
              const x = 60 + (index / (data.length - 1)) * 680;
              const y = ((60 - point.stock) / 60) * 280 + 10;
              return `${x},${y}`;
            }).join(' ')} 740,290`}
          />

          {/* Data points with glow effect */}
          {data.map((point, index) => {
            const x = 60 + (index / (data.length - 1)) * 680;
            const y = ((60 - point.stock) / 60) * 280 + 10;
            return (
              <g key={index}>
                <motion.circle
                  initial={{ r: 0 }}
                  animate={{ r: 6 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  cx={x}
                  cy={y}
                  fill="#00ff88"
                  className="cursor-pointer"
                  style={{ filter: 'drop-shadow(0 0 8px #00ff88)' }}
                />
                <motion.circle
                  initial={{ r: 0 }}
                  animate={{ r: 3 }}
                  transition={{ delay: index * 0.2 + 0.1, duration: 0.3 }}
                  cx={x}
                  cy={y}
                  fill="#ffffff"
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Live Indicator - EXACT MATCH TO REFERENCE */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-primary animate-pulse" />
            <h1 className="text-3xl font-bold text-white">Live Stocks Analytics</h1>
          </div>
          <div className="flex items-center space-x-2 bg-green-400/20 px-3 py-1.5 rounded-full border border-green-400/30">
            <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-yellow-400 animate-spin' : 'bg-green-400 animate-pulse'}`} />
            <span className="text-sm text-green-400 font-medium">LIVE</span>
            <span className="text-xs text-green-300">
              {isUpdating ? '(Updating...)' : '(5s updates)'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-dark-400 font-medium">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchAnalyticsData}
            className="p-3 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 transition-all hover-lift"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Market Overview Cards - EXACT MATCH TO REFERENCE */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 border border-red-400/30 hover-lift"
        >
          <div className="flex items-center justify-between">
            <div>
              <SmoothNumber value={analyticsData.marketSummary?.criticalStocks || 28} className="text-4xl font-bold text-red-400" />
              <p className="text-dark-400 text-sm font-medium">Critical Stocks</p>
            </div>
            <div className="pulse-ring">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 border border-yellow-400/30 hover-lift"
        >
          <div className="flex items-center justify-between">
            <div>
              <SmoothNumber value={analyticsData.marketSummary?.decliningStocks || 45} className="text-4xl font-bold text-yellow-400" />
              <p className="text-dark-400 text-sm font-medium">Declining</p>
            </div>
            <div className="pulse-ring">
              <TrendingDown className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 border border-green-400/30 hover-lift"
        >
          <div className="flex items-center justify-between">
            <div>
              <SmoothNumber value={analyticsData.marketSummary?.stableStocks || 67} className="text-4xl font-bold text-green-400" />
              <p className="text-dark-400 text-sm font-medium">Stable</p>
            </div>
            <div className="pulse-ring">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 border border-primary/30 hover-lift"
        >
          <div className="flex items-center justify-between">
            <div>
              <SmoothNumber value={`₹${(analyticsData.marketSummary?.totalRevenue || 245000).toLocaleString()}`} className="text-4xl font-bold text-primary" />
              <p className="text-dark-400 text-sm font-medium">Total Revenue</p>
            </div>
            <div className="pulse-ring">
              <DollarSign className="w-10 h-10 text-primary" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 7-Day Stock Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 cyber-grid hover-lift"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <LineChart className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-white">7-Day Stock Forecast</h3>
          </div>
          <div className="flex items-center space-x-2 bg-primary/20 px-3 py-1.5 rounded-full border border-primary/30">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">AI Prediction Model</span>
          </div>
        </div>
        {renderStockForecast()}
      </motion.div>

      {/* Product Cards Grid - EXACT MATCH TO REFERENCE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analyticsData.productCards?.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className={`glass-card p-6 border ${getStatusColor(product.status)} hover-lift cursor-pointer`}
            onClick={() => setSelectedProduct(product)}
          >
            {/* Header with status icon and product info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(product.status)}`}>
                  {getStatusIcon(product.status)}
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">{product.name}</h4>
                  <p className="text-dark-400 text-sm">{product.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-xl">₹{product.price}</p>
                <p className="text-xs text-dark-400">{product.supplier}</p>
              </div>
            </div>

            {/* Product details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-dark-400 text-sm font-medium">Current Stock</span>
                <SmoothNumber value={`${product.currentStock} units`} className="text-white font-bold text-lg" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-dark-400 text-sm font-medium">7-Day Prediction</span>
                <SmoothNumber value={`${product.prediction} units`} className="text-white font-bold text-lg" />
              </div>

              {/* AI Confidence with exact progress bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-dark-400 text-sm font-medium">AI Confidence</span>
                  <SmoothNumber value={`${product.aiConfidence.toFixed(2)}%`} className="text-primary font-bold text-lg" />
                </div>
                <div className="w-full bg-dark-300 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${product.aiConfidence}%` }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 1.5 }}
                    className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 h-3 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </motion.div>
                </div>
              </div>

              {/* Demand Level with exact styling */}
              <div className="flex items-center justify-between">
                <span className="text-dark-400 text-sm font-medium">Demand Level</span>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${getDemandColor(product.demandLevel)} border border-current/20`}>
                  {product.demandLevel}
                </span>
              </div>

              {/* Recommendation with exact styling */}
              <div className="flex items-center justify-between pt-4 border-t border-dark-400/50">
                <span className="text-dark-400 text-sm font-medium">Recommendation</span>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-green-400 text-sm font-bold">{product.recommendation}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Insights Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card p-6 border border-primary/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary animate-pulse" />
            <h3 className="text-lg font-semibold text-white">AI Market Insights</h3>
          </div>
          <Zap className="w-5 h-5 text-primary" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-dark-300/30 rounded-lg">
            <h4 className="text-white font-medium mb-2">Critical Alert</h4>
            <p className="text-dark-400 text-sm">
              {analyticsData.marketSummary?.criticalStocks || 28} products require immediate attention to prevent stockouts.
            </p>
          </div>
          
          <div className="p-4 bg-dark-300/30 rounded-lg">
            <h4 className="text-white font-medium mb-2">Revenue Trend</h4>
            <p className="text-dark-400 text-sm">
              Total revenue showing {analyticsData.marketSummary?.revenueChange || 12.5}% growth with AI-optimized inventory management.
            </p>
          </div>
          
          <div className="p-4 bg-dark-300/30 rounded-lg">
            <h4 className="text-white font-medium mb-2">AI Recommendations</h4>
            <p className="text-dark-400 text-sm">
              AI suggests reordering {analyticsData.marketSummary?.criticalStocks || 28} products within 48 hours for optimal stock levels.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveStocksAnalytics;
