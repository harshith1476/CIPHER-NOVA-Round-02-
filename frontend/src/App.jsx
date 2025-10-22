import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthWrapper from './components/Auth/AuthWrapper';
import LandingPage from './components/LandingPage/LandingPage';
import RetailerDashboard from './components/Dashboard/RetailerDashboard';
import DistributorDashboard from './components/Dashboard/DistributorDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import HeadRetailerDashboard from './components/Dashboard/HeadRetailerDashboard';
import HeadDistributorDashboard from './components/Dashboard/HeadDistributorDashboard';
import { motion } from 'framer-motion';
import io from 'socket.io-client';

const AppContent = () => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket'],
        autoConnect: true,
      });

      newSocket.on('connect', () => {
        console.log('✓ Connected to WebSocket');
        newSocket.emit('join_room', { room: `user_${user.user_id || user.id}` });
      });

      newSocket.on('status', (data) => {
        console.log('WebSocket status:', data);
      });

      newSocket.on('stock_update', (data) => {
        console.log('Stock update received:', data);
        // Handle real-time stock updates
      });


      newSocket.on('disconnect', () => {
        console.log('✗ Disconnected from WebSocket');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  // Route based on user role
  const renderDashboard = () => {
    switch (user.role) {
      case 'retailer':
        return <RetailerDashboard socket={socket} />;
      case 'distributor':
        return <DistributorDashboard socket={socket} />;
      case 'admin':
        return <AdminDashboard socket={socket} />;
      case 'head_retailer':
        return <HeadRetailerDashboard socket={socket} />;
      case 'head_distributor':
        return <HeadDistributorDashboard socket={socket} />;
      default:
        return <RetailerDashboard socket={socket} />;
    }
  };

  // Show landing page if not authenticated, otherwise show dashboard
  if (!isAuthenticated) {
    // Check if we're on login page
    console.log('Not authenticated, current pathname:', window.location.pathname);
    if (window.location.pathname === '/login') {
      console.log('Showing AuthWrapper for /login');
      return <AuthWrapper />;
    }
    console.log('Showing LandingPage for path:', window.location.pathname);
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Dashboard */}
      {renderDashboard()}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;