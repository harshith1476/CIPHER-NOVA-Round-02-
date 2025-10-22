import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Smartphone, User, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Mobile-optimized header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
            <Smartphone className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to Qwipo AI</h1>
          <p className="text-dark-400 text-sm">Sign in to your retail account</p>
        </div>

        {/* Mobile-optimized form */}
        <div className="glass rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-dark-400">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-dark-200 border border-dark-300 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-dark-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-dark-200 border border-dark-300 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-white transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-dark-100 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Mobile-optimized footer */}
          <div className="mt-6 text-center">
            <p className="text-dark-400 text-sm">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-300"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Mobile-specific features */}
        <div className="mt-6 text-center">
          <p className="text-dark-500 text-xs">
            Optimized for mobile devices • Touch-friendly interface
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
