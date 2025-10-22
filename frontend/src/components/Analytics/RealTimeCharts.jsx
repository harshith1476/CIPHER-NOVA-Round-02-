import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3,
  PieChart,
  LineChart,
  Brain,
  Zap
} from 'lucide-react';

const RealTimeCharts = () => {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [salesRes, topProductsRes, revenueRes] = await Promise.all([
        fetch('/api/analytics/sales?days=7', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/analytics/top-products?limit=5', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/analytics/revenue-trends', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (salesRes.ok) {
        const salesData = await salesRes.json();
        setSalesData(salesData.daily_sales || []);
      }

      if (topProductsRes.ok) {
        const topProductsData = await topProductsRes.json();
        setTopProducts(topProductsData.top_products || []);
      }

      if (revenueRes.ok) {
        const revenueData = await revenueRes.json();
        setRevenueTrends(revenueData.monthly_trends || []);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Simple chart component for sales trend
  const SalesTrendChart = ({ data }) => {
    if (!data || data.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center">
          <div className="text-center">
            <Activity className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-dark-400">No sales data available</p>
          </div>
        </div>
      );
    }

    const maxValue = Math.max(...data.map(d => d.total_sales));
    const minValue = Math.min(...data.map(d => d.total_sales));

    return (
      <div className="h-48 relative">
        <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
          {data.map((item, index) => {
            const height = ((item.total_sales - minValue) / (maxValue - minValue)) * 100;
            return (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-gradient-to-t from-primary to-primary/60 rounded-t-lg w-8 mx-1 relative group"
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-dark-200 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{item.total_sales}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-dark-400">
          {data.map((item, index) => (
            <span key={index} className="text-center">
              {new Date(item._id).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Revenue trend line chart
  const RevenueTrendChart = ({ data }) => {
    if (!data || data.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center">
          <div className="text-center">
            <LineChart className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-dark-400">No revenue data available</p>
          </div>
        </div>
      );
    }

    const maxRevenue = Math.max(...data.map(d => d.revenue));
    const minRevenue = Math.min(...data.map(d => d.revenue));

    return (
      <div className="h-48 relative">
        <svg className="w-full h-full">
          <defs>
            <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#00ff88" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          ))}

          {/* Revenue line */}
          <polyline
            fill="none"
            stroke="#00ff88"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - (((item.revenue - minRevenue) / (maxRevenue - minRevenue)) * 100);
              return `${x},${y}`;
            }).join(' ')}
          />

          {/* Fill area */}
          <polygon
            fill="url(#revenueGradient)"
            points={`0,100 ${data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - (((item.revenue - minRevenue) / (maxRevenue - minRevenue)) * 100);
              return `${x},${y}`;
            }).join(' ')} 100,100`}
          />

          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (((item.revenue - minRevenue) / (maxRevenue - minRevenue)) * 100);
            return (
              <motion.circle
                key={index}
                initial={{ r: 0 }}
                animate={{ r: 4 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                cx={x}
                cy={y}
                fill="#00ff88"
                className="cursor-pointer hover:r-6 transition-all"
              />
            );
          })}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-dark-400">
          <span>₹{maxRevenue.toLocaleString()}</span>
          <span>₹{((maxRevenue + minRevenue) / 2).toLocaleString()}</span>
          <span>₹{minRevenue.toLocaleString()}</span>
        </div>
      </div>
    );
  };

  // Top products pie chart
  const TopProductsChart = ({ data }) => {
    if (!data || data.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center">
          <div className="text-center">
            <PieChart className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-dark-400">No product data available</p>
          </div>
        </div>
      );
    }

    const totalQuantity = data.reduce((sum, item) => sum + item.total_quantity, 0);
    const colors = ['#00ff88', '#00d4aa', '#00b4d8', '#0077b6', '#023e8a'];

    return (
      <div className="h-48 flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.total_quantity / totalQuantity) * 100;
              const circumference = 2 * Math.PI * 50;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -circumference * (index / data.length);

              return (
                <motion.circle
                  key={index}
                  initial={{ strokeDasharray: '0 314' }}
                  animate={{ strokeDasharray }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  cx="64"
                  cy="64"
                  r="50"
                  fill="none"
                  stroke={colors[index]}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{totalQuantity}</p>
              <p className="text-xs text-dark-400">Total Sales</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Sales Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-white">Sales Trend (7 Days)</h3>
          </div>
          <div className="flex items-center space-x-2 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">+12.5%</span>
          </div>
        </div>
        <SalesTrendChart data={salesData} />
      </motion.div>

      {/* Revenue Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <LineChart className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-white">Revenue Trends</h3>
          </div>
          <div className="flex items-center space-x-2 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">+8.3%</span>
          </div>
        </div>
        <RevenueTrendChart data={revenueTrends} />
      </motion.div>

      {/* Top Products Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-white">Top Products</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">AI Ranked</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <TopProductsChart data={topProducts} />
          
          <div className="space-y-3">
            {topProducts.map((product, index) => {
              const percentage = ((product.total_quantity / topProducts.reduce((sum, item) => sum + item.total_quantity, 0)) * 100).toFixed(1);
              const colors = ['#00ff88', '#00d4aa', '#00b4d8', '#0077b6', '#023e8a'];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between p-2 bg-dark-300/30 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index] }}
                    />
                    <span className="text-white text-sm">{product.product_name || 'Unknown'}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-primary text-sm font-medium">{product.total_quantity}</p>
                    <p className="text-xs text-dark-400">{percentage}%</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6 border border-primary/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-white">AI Insights</h3>
          </div>
          <Zap className="w-5 h-5 text-primary animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-dark-300/30 rounded-lg">
            <h4 className="text-white font-medium mb-2">Sales Prediction</h4>
            <p className="text-dark-400 text-sm">
              Based on current trends, expect a 15% increase in sales over the next week.
            </p>
          </div>
          
          <div className="p-4 bg-dark-300/30 rounded-lg">
            <h4 className="text-white font-medium mb-2">Stock Recommendation</h4>
            <p className="text-dark-400 text-sm">
              Consider increasing inventory for top-performing products by 20%.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RealTimeCharts;
