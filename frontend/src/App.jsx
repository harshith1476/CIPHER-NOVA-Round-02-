import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AuthWrapper from './components/Auth/AuthWrapper';
import EnhancedRetailerDashboard from './components/Dashboard/EnhancedRetailerDashboard';
import DistributorDashboard from './components/Dashboard/DistributorDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import VoiceAssistant from './components/VoiceAssistant/VoiceAssistant';
import { motion } from 'framer-motion';
import io from 'socket.io-client';

const AppContent = () => {
  const { user, isAuthenticated } = useAuth();
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
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

      newSocket.on('voice_response', (data) => {
        console.log('Voice response:', data);
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

  if (!isAuthenticated) {
    return <AuthWrapper />;
  }

  // Route based on user role
  const renderDashboard = () => {
    switch (user.role) {
      case 'retailer':
        return <EnhancedRetailerDashboard socket={socket} />;
      case 'distributor':
        return <DistributorDashboard socket={socket} />;
      case 'admin':
        return <AdminDashboard socket={socket} />;
      default:
        return <EnhancedRetailerDashboard socket={socket} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Floating Voice Assistant Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsVoiceOpen(true)}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all duration-300 animate-glow"
      >
        <svg className="w-6 h-6 text-dark-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </motion.button>

      {/* Main Dashboard */}
      {renderDashboard()}

      {/* Voice Assistant Modal */}
      <VoiceAssistant 
        isOpen={isVoiceOpen} 
        onClose={() => setIsVoiceOpen(false)}
        socket={socket}
      />
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