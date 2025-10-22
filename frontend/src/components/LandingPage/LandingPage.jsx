import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Star,
  ArrowRight,
  Search,
  Filter,
  Globe,
  Shield,
  Zap,
  Target,
  Award,
  ChevronDown,
  Menu,
  X,
  Play,
  CheckCircle,
  Sparkles,
  Rocket,
  Lock,
  BarChart3,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Check,
  Send,
  Heart,
  Clock,
  DollarSign,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import axios from 'axios';
import { navigateWithTransition } from '../../utils/navigation';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  useEffect(() => {
    fetchProducts();
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('logout') === 'true' || sessionStorage.getItem('justLoggedOut')) {
      setShowWelcomeBack(true);
      sessionStorage.removeItem('justLoggedOut');
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      setTimeout(() => setShowWelcomeBack(false), 5000);
    }

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    // Auto-rotate features
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(featureInterval);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/all');
      setProducts(response.data?.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(generateMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const generateMockProducts = () => {
    const products = [
      { name: 'Coca-Cola Classic 500ml', brand: 'Coca-Cola', category: 'Beverages', price: 45, image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&h=200&fit=crop', rating: 4.5 },
      { name: 'Pepsi Cola 500ml', brand: 'PepsiCo', category: 'Beverages', price: 42, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&h=200&fit=crop', rating: 4.3 },
      { name: 'Sprite Lemon Lime 500ml', brand: 'Coca-Cola', category: 'Beverages', price: 40, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop', rating: 4.2 },
      { name: 'Tata Tea Gold 250g', brand: 'Tata', category: 'Beverages', price: 180, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop', rating: 4.6 },
      { name: 'Lays Classic Chips 70g', brand: 'PepsiCo', category: 'Snacks', price: 25, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=200&fit=crop', rating: 4.4 },
      { name: 'Parle G Biscuits 200g', brand: 'Parle', category: 'Snacks', price: 35, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=200&fit=crop', rating: 4.7 },
      { name: 'Maggi 2-Minute Noodles 70g', brand: 'Nestle', category: 'Snacks', price: 14, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop', rating: 4.5 },
      { name: 'Cadbury Dairy Milk 40g', brand: 'Mondelez', category: 'Snacks', price: 25, image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=300&h=200&fit=crop', rating: 4.8 },
    ];
    
    return products.map((product, i) => ({
      id: `product_${i}`,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      description: `Premium quality ${product.category.toLowerCase()} from ${product.brand}`,
      image: product.image,
      rating: product.rating || 4.0,
      stock: Math.floor(Math.random() * 100) + 10
    }));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.brand || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];
  const stats = {
    products: products.length || 250,
    brands: [...new Set(products.map(p => p.brand).filter(Boolean))].length || 50,
    retailers: 5000,
    distributors: 2000
  };

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Retailer",
      company: "Metro Stores",
      content: "Qwipo AI has revolutionized our inventory management. The AI recommendations have increased our sales by 40% in just 3 months!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Distributor",
      company: "Prime Distribution",
      content: "The conversational AI makes product discovery so intuitive. Our team efficiency has improved dramatically with real-time insights.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Amit Patel",
      role: "Head Retailer",
      company: "SuperMart Chain",
      content: "The real-time stock predictions and AI insights have given us a competitive edge in the market. Best B2B platform we've used!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Sunita Reddy",
      role: "Distributor",
      company: "Reddy Wholesale",
      content: "Incredible platform! The AI-powered insights helped us reduce wastage by 35% and improve profit margins significantly.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  // Animated counter component
  const AnimatedCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const counterRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            let startTime;
            const animate = (currentTime) => {
              if (!startTime) startTime = currentTime;
              const progress = (currentTime - startTime) / duration;
              
              if (progress < 1) {
                setCount(Math.floor(end * progress));
                requestAnimationFrame(animate);
              } else {
                setCount(end);
              }
            };
            requestAnimationFrame(animate);
          }
        },
        { threshold: 0.5 }
      );

      if (counterRef.current) {
        observer.observe(counterRef.current);
      }

      return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    return <span ref={counterRef}>{count.toLocaleString()}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-x-hidden">
      {/* Welcome Back Message */}
      <AnimatePresence>
        {showWelcomeBack && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 shadow-2xl fixed top-0 w-full z-50"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <p className="font-medium">Successfully logged out. Welcome back to Qwipo AI! ✨</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation - Enhanced with glassmorphism */}
      <nav className={`fixed w-full bg-white/10 backdrop-blur-xl z-40 border-b border-white/20 shadow-2xl transition-all duration-300 ${showWelcomeBack ? 'top-16' : 'top-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <span className="text-3xl font-black text-white bg-clip-text">Qwipo</span>
                <div className="text-xs text-blue-300 font-semibold -mt-1 flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  AI Marketplace
                </div>
              </div>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/90 hover:text-blue-300 transition-colors font-medium flex items-center group">
                <Sparkles className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                Features
              </a>
              <a href="#products" className="text-white/90 hover:text-blue-300 transition-colors font-medium flex items-center group">
                <Package className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                Products
              </a>
              <a href="#testimonials" className="text-white/90 hover:text-blue-300 transition-colors font-medium flex items-center group">
                <Heart className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                Reviews
              </a>
              <motion.button
                onClick={() => navigateWithTransition('/login')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 font-bold overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative">Get Started</span>
                <Rocket className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white bg-white/10 backdrop-blur-md p-2 rounded-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/10 backdrop-blur-xl border-t border-white/20"
            >
              <div className="px-4 py-4 space-y-3">
                <a href="#features" className="block text-white/90 hover:text-blue-300 py-2 font-medium">Features</a>
                <a href="#products" className="block text-white/90 hover:text-blue-300 py-2 font-medium">Products</a>
                <a href="#testimonials" className="block text-white/90 hover:text-blue-300 py-2 font-medium">Reviews</a>
                <button
                  onClick={() => navigateWithTransition('/login')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Completely Redesigned with Particles */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="max-w-7xl mx-auto relative z-10"
        >
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">🚀 India's #1 AI-Powered B2B Marketplace</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>

            {/* Main Heading with Gradient Text */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                QWIPO
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl md:text-4xl lg:text-5xl text-white font-bold mb-6 flex items-center justify-center flex-wrap gap-3"
            >
              <span>Transform Your Business</span>
              <span className="text-blue-400">with AI</span>
              <Zap className="w-10 h-10 text-yellow-400 animate-bounce" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed font-medium"
            >
              Experience the future of B2B commerce with <span className="text-blue-300 font-bold">AI-powered insights</span>, 
              <span className="text-purple-300 font-bold"> intelligent automation</span>, and 
              <span className="text-pink-300 font-bold"> seamless operations</span> that drive growth
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-12"
            >
              {[
                { icon: ShieldCheck, text: 'Secure & Trusted' },
                { icon: Zap, text: 'Lightning Fast' },
                { icon: BarChart3, text: 'AI Analytics' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2">
                  <item.icon className="w-5 h-5 text-blue-300" />
                  <span className="text-white font-medium">{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <motion.button
                onClick={() => navigateWithTransition('/login')}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-2">
                  <Rocket className="w-6 h-6" />
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group border-2 border-white/30 hover:border-white/60 bg-white/10 backdrop-blur-md text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
              >
                <Play className="w-6 h-6" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 flex items-center justify-center gap-8 flex-wrap text-white/60"
            >
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">5000+ Retailers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span className="font-medium">250+ Products</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">4.9/5 Rating</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex flex-col items-center text-white/60"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section - Enhanced with Animation */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Package, label: 'Products', value: stats.products, color: 'from-blue-500 to-blue-600', suffix: '+' },
              { icon: Users, label: 'Retailers', value: stats.retailers, color: 'from-green-500 to-green-600', suffix: '+' },
              { icon: TrendingUp, label: 'Distributors', value: stats.distributors, color: 'from-purple-500 to-purple-600', suffix: '+' },
              { icon: Star, label: 'Brands', value: stats.brands, color: 'from-orange-500 to-orange-600', suffix: '+' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className={`w-20 h-20 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:rotate-12 transition-transform duration-300`}>
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-5xl font-black text-white mb-3">
                    <AnimatedCounter end={stat.value} />
                    {stat.suffix}
                  </h3>
                  <p className="text-white/70 font-semibold text-lg">{stat.label}</p>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Interactive */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-5 h-5 text-blue-300" />
              <span className="text-blue-300 font-semibold">Powerful Features</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Qwipo AI</span>?
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Experience the next generation of B2B commerce with cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'AI-Powered Discovery',
                description: 'Smart product recommendations that understand your business needs and predict demand patterns.',
                color: 'from-blue-500 to-cyan-500',
                stats: '40% Increase',
                delay: 0
              },
              {
                icon: Zap,
                title: 'Lightning Fast Operations',
                description: 'Streamlined workflows with automated inventory management and real-time stock updates.',
                color: 'from-purple-500 to-pink-500',
                stats: '60% Faster',
                delay: 0.1
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Deep insights into market trends, customer behavior, and sales performance metrics.',
                color: 'from-orange-500 to-red-500',
                stats: '99% Accuracy',
                delay: 0.2
              },
              {
                icon: ShieldCheck,
                title: 'Enterprise Security',
                description: 'Bank-level encryption and security protocols to protect your business data.',
                color: 'from-green-500 to-emerald-500',
                stats: '100% Secure',
                delay: 0.3
              },
              {
                icon: MessageCircle,
                title: 'AI Assistant',
                description: 'Conversational AI that guides you through orders, queries, and business decisions.',
                color: 'from-indigo-500 to-blue-500',
                stats: '24/7 Support',
                delay: 0.4
              },
              {
                icon: DollarSign,
                title: 'Smart Pricing',
                description: 'Dynamic pricing algorithms that optimize margins while staying competitive.',
                color: 'from-yellow-500 to-orange-500',
                stats: '25% Profit',
                delay: 0.5
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 h-full hover:bg-white/15 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-white/70 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className={`inline-flex items-center space-x-2 bg-gradient-to-r ${feature.color} rounded-full px-4 py-2 text-sm font-bold text-white`}>
                    <TrendingUp className="w-4 h-4" />
                    <span>{feature.stats}</span>
                  </div>
                </div>
                
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section id="products" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-purple-500/20 backdrop-blur-md border border-purple-500/30 rounded-full px-6 py-2 mb-6">
              <Package className="w-5 h-5 text-purple-300" />
              <span className="text-purple-300 font-semibold">Product Catalog</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
              Explore Our <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Products</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Discover thousands of quality products from trusted brands
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row gap-4 mb-12"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-14 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-14 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
              >
                <option value="all" className="bg-slate-800">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-slate-800">{category}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 pointer-events-none" />
            </div>
          </motion.div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white/10 rounded-3xl p-6 animate-pulse">
                  <div className="bg-white/20 rounded-2xl h-48 mb-4"></div>
                  <div className="bg-white/20 rounded h-4 mb-2"></div>
                  <div className="bg-white/20 rounded h-4 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.slice(0, 12).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 transition-all duration-500 rounded-3xl"></div>
                  
                  <div className="relative z-10">
                    <div className="relative mb-4 overflow-hidden rounded-2xl">
                      <img
                        src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={product.name || 'Product'}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>In Stock</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-blue-400 text-sm mb-1 font-semibold">{product.brand || 'Brand'}</p>
                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                        {product.name || 'Product Name'}
                      </h3>
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating || 4.0) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'
                            }`}
                          />
                        ))}
                        <span className="text-white/60 text-sm ml-2">({(product.rating || 4.0).toFixed(1)})</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-white">₹{product.price || 0}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:shadow-2xl transition-all duration-300"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Package className="w-24 h-24 text-white/30 mx-auto mb-6" />
              <h3 className="text-2xl text-white/60 mb-2 font-bold">No products found</h3>
              <p className="text-white/40">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials Section - Carousel */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-pink-500/20 backdrop-blur-md border border-pink-500/30 rounded-full px-6 py-2 mb-6">
              <Heart className="w-5 h-5 text-pink-300" />
              <span className="text-pink-300 font-semibold">Customer Love</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
              Trusted by <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              See what our partners have to say about their experience
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 relative"
              >
                <div className="absolute top-8 left-8">
                  <svg className="w-16 h-16 text-blue-400/30" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z"/>
                  </svg>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img
                        src={testimonials[currentTestimonial].avatar}
                        alt={testimonials[currentTestimonial].name}
                        className="w-24 h-24 rounded-full border-4 border-white/30 shadow-2xl"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <p className="text-white text-xl italic mb-6 leading-relaxed">
                      "{testimonials[currentTestimonial].content}"
                    </p>
                    
                    <div className="flex items-center justify-center md:justify-start mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>

                    <h4 className="text-white font-bold text-lg">{testimonials[currentTestimonial].name}</h4>
                    <p className="text-blue-300">{testimonials[currentTestimonial].role}</p>
                    <p className="text-white/60">{testimonials[currentTestimonial].company}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full hover:bg-white/20 transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </motion.button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'w-8 bg-blue-500' : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full hover:bg-white/20 transition-all"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
            
            <div className="relative z-10">
              <Mail className="w-16 h-16 text-white mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest updates, product launches, and exclusive offers
              </p>

              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all flex items-center justify-center space-x-2"
                >
                  <span>{subscribed ? 'Subscribed!' : 'Subscribe'}</span>
                  {subscribed ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                </motion.button>
              </form>

              <AnimatePresence>
                {subscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-white font-semibold mt-4 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Thank you for subscribing!</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Rocket className="w-20 h-20 text-blue-400 mx-auto mb-8 animate-bounce" />
            
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
              Ready to <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Transform</span>?
            </h2>
            
            <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join 5000+ retailers and distributors already using Qwipo AI to revolutionize their business operations
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button
                onClick={() => navigateWithTransition('/login')}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-2">
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white/30 hover:border-white/60 bg-white/10 backdrop-blur-md text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Talk to Sales</span>
              </motion.button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-white/60 flex-wrap">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-black/40 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-3xl font-black text-white">Qwipo AI</span>
                  <div className="text-xs text-blue-300">Next-Gen B2B Marketplace</div>
                </div>
              </div>
              <p className="text-white/60 mb-6 max-w-md leading-relaxed">
                Empowering businesses with AI-powered digital tools, seamless logistics, and intelligent automation for the modern marketplace.
              </p>
              <div className="flex space-x-4">
                <a href="https://qwipo.com/" className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl hover:bg-white/20 transition-all">
                  <Globe className="w-5 h-5 text-blue-400" />
                </a>
                <a href="#" className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl hover:bg-white/20 transition-all">
                  <Shield className="w-5 h-5 text-purple-400" />
                </a>
                <a href="#" className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl hover:bg-white/20 transition-all">
                  <Mail className="w-5 h-5 text-pink-400" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Company</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-white/60 hover:text-white transition-colors flex items-center space-x-2"><span>Features</span></a></li>
                <li><a href="#products" className="text-white/60 hover:text-white transition-colors flex items-center space-x-2"><span>Products</span></a></li>
                <li><a href="#testimonials" className="text-white/60 hover:text-white transition-colors flex items-center space-x-2"><span>Testimonials</span></a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors flex items-center space-x-2"><span>Careers</span></a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/60 hover:text-white transition-colors flex items-center space-x-2"><span>Help Center</span></a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors flex items-center space-x-2"><span>Contact Us</span></a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors flex items-center space-x-2"><span>Documentation</span></a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors flex items-center space-x-2"><span>API</span></a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-white/60 text-center md:text-left">
                <p className="font-medium">&copy; 2024 Qwipo AI. All rights reserved.</p>
                <p className="mt-1">Made with <Heart className="w-4 h-4 inline text-red-500 fill-red-500" /> in India</p>
              </div>
              <div className="flex gap-6 text-sm text-white/60">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
