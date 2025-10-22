import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Package, 
  TrendingUp, 
  Activity,
  UserCheck,
  ShoppingBag,
  DollarSign,
  Settings,
  Shield,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const stats = {
    totalUsers: 142,
    activeRetailers: 98,
    activeDistributors: 24,
    totalOrders: 1250,
    totalRevenue: 5450000,
    platformHealth: 98.5
  };

  const recentUsers = [
    { id: 1, name: 'Rajesh Kumar', role: 'retailer', status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'Priya Sharma', role: 'distributor', status: 'active', joined: '2024-01-14' },
    { id: 3, name: 'Amit Patel', role: 'retailer', status: 'active', joined: '2024-01-13' },
  ];

  const renderOverview = () => (
    <div className="space-y-6 pb-20">
      {/* Platform Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              <p className="text-dark-400 text-xs">Total Users</p>
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
              <ShoppingBag className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
              <p className="text-dark-400 text-xs">Total Orders</p>
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
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
              <p className="text-dark-400 text-xs">Revenue</p>
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
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.platformHealth}%</p>
              <p className="text-dark-400 text-xs">Health</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* User Distribution */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-white mb-4">User Distribution</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-white font-medium">Retailers</p>
                <p className="text-dark-400 text-sm">{stats.activeRetailers} active</p>
              </div>
            </div>
            <span className="text-primary font-semibold">{((stats.activeRetailers / stats.totalUsers) * 100).toFixed(0)}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-white font-medium">Distributors</p>
                <p className="text-dark-400 text-sm">{stats.activeDistributors} active</p>
              </div>
            </div>
            <span className="text-secondary font-semibold">{((stats.activeDistributors / stats.totalUsers) * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Platform Health */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Platform Health</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-dark-400 text-sm">System Status</span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Healthy</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-dark-400 text-sm">Database</span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Connected</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-dark-400 text-sm">API Status</span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Online</span>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Users</h3>
          <button 
            onClick={() => setActiveTab('users')}
            className="text-primary text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-dark-300/50 rounded-lg">
              <div>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-dark-400 text-sm capitalize">{user.role} • {user.joined}</p>
              </div>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                {user.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-white">User Management</h1>
      
      {/* User Tabs */}
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
        <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium whitespace-nowrap">
          All Users
        </button>
        <button className="px-4 py-2 bg-dark-200 text-dark-400 rounded-lg text-sm font-medium whitespace-nowrap">
          Retailers
        </button>
        <button className="px-4 py-2 bg-dark-200 text-dark-400 rounded-lg text-sm font-medium whitespace-nowrap">
          Distributors
        </button>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {recentUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-medium">{user.name}</h3>
                <p className="text-dark-400 text-sm capitalize">{user.role}</p>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                {user.status}
              </span>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium">
                View Details
              </button>
              <button className="flex-1 py-2 bg-dark-300 text-dark-400 rounded-lg text-sm font-medium">
                Deactivate
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
      
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Maintenance Mode</p>
              <p className="text-dark-400 text-sm">Enable system maintenance</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" className="opacity-0 w-0 h-0" />
              <span className="absolute cursor-pointer inset-0 bg-dark-300 rounded-full transition-all duration-300"></span>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">User Registration</p>
              <p className="text-dark-400 text-sm">Allow new user signups</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" checked className="opacity-0 w-0 h-0" />
              <span className="absolute cursor-pointer inset-0 bg-primary rounded-full transition-all duration-300"></span>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-dark-400 text-sm">Send system notifications</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" checked className="opacity-0 w-0 h-0" />
              <span className="absolute cursor-pointer inset-0 bg-primary rounded-full transition-all duration-300"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Security</h3>
        <div className="space-y-3">
          <button className="w-full py-3 bg-primary/20 text-primary rounded-lg font-medium flex items-center justify-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Audit</span>
          </button>
          <button className="w-full py-3 bg-red-500/20 text-red-400 rounded-lg font-medium flex items-center justify-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>View System Logs</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'users': return renderUsers();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Header */}
      <div className="p-4 border-b border-dark-300">
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-dark-400 text-sm">Manage platform and users</p>
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
            <Activity className="w-5 h-5" />
            <span className="text-xs font-medium">Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'users' ? 'text-primary bg-primary/10' : 'text-dark-400'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">Users</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'settings' ? 'text-primary bg-primary/10' : 'text-dark-400'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

