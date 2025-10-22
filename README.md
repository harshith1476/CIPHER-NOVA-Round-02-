# 🚀 Qwipo AI - Voice-First Retail Intelligence Platform

[![Mobile First](https://img.shields.io/badge/Mobile-First-00ff88)](https://github.com)
[![React](https://img.shields.io/badge/React-19.1-61dafb)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000)](https://flask.palletsprojects.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248)](https://www.mongodb.com/)

A cutting-edge AI-powered retail intelligence platform with voice-first interaction, real-time inventory management, and mobile-responsive design. Built specifically for the Indian retail market with support for 50+ FMCG products.

## ✨ Features

### 🎤 Voice-First Intelligence
- **"Hey Qwipo"** wake word detection
- Natural language voice commands
- Mobile-optimized voice interface
- Real-time speech-to-text conversion
- Multi-language support (focusing on Indian languages)

### 📱 Mobile-First Design
- Responsive breakpoints: 320px to 1440px+
- Touch-optimized interfaces (44px minimum touch targets)
- Swipe gestures for navigation
- Bottom navigation for mobile
- Progressive Web App (PWA) ready

### 🏪 Role-Based Dashboards

#### Retailer Dashboard
- Real-time stock monitoring with color-coded alerts
- AI-powered product recommendations
- Voice-activated order management
- Sales analytics and insights
- Low stock notifications

#### Distributor Dashboard
- Product inventory management (CRUD operations)
- Order fulfillment tracking
- Retailer network management
- Sales performance analytics
- Bulk product updates

#### Admin Dashboard
- User management (Retailers & Distributors)
- Platform analytics and health monitoring
- System configuration
- Security audit logs
- Revenue tracking

### 🔄 Real-Time Features
- WebSocket-powered live updates
- Stock level synchronization every 5 seconds
- Push notifications for critical alerts
- Live order status tracking
- Real-time voice command processing

### 🎨 Modern UI/UX
- **Neon Dark Theme**
  - Primary: #00ff88 (Neon Green)
  - Secondary: #0088ff (Neon Blue)
  - Accent: #ff0088 (Neon Pink)
- Glassmorphism effects
- Smooth animations with Framer Motion
- Accessibility-first design

## 🛠️ Tech Stack

### Frontend
- **React 19.1** - UI Framework
- **Vite 7.1** - Build tool and dev server
- **Tailwind CSS 4.1** - Utility-first CSS
- **Framer Motion 12** - Animation library
- **Socket.IO Client 4.8** - Real-time communication
- **Web Speech API** - Voice recognition
- **Recharts 3.2** - Data visualization
- **Lucide React** - Icon library

### Backend
- **Flask 3.0** - Python web framework
- **Flask-SocketIO 5.3** - WebSocket support
- **PyMongo 4.6** - MongoDB driver
- **PyJWT 2.8** - JWT authentication
- **Bcrypt 4.1** - Password hashing
- **Flask-CORS 4.0** - Cross-origin support

### Database
- **MongoDB** - NoSQL database for flexible data models

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **MongoDB** (v6.0 or higher)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/qwipo-ai-platform.git
cd qwipo-ai-platform
```

### 2. Backend Setup

#### Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory (already created):

```env
SECRET_KEY=qwipo-ai-secret-key-2024-super-secure
MONGO_URI=mongodb://localhost:27017/qwipo_ai
JWT_SECRET=qwipo-jwt-secret-2024
JWT_EXPIRATION=86400
PORT=5000
FLASK_ENV=development
```

#### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows (if MongoDB is installed as a service)
net start MongoDB

# On macOS
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

#### Seed the Database

Populate the database with sample data (50+ Indian FMCG products):

```bash
python seed_data.py
```

This will create:
- 3 test users (Retailer, Distributor, Admin)
- 50+ Indian FMCG products
- Sample orders
- Stock history

#### Start the Backend Server

```bash
python app.py
```

The backend will be available at `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../frontend
npm install
```

#### Start the Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔐 Test Credentials

After seeding the database, you can log in with these credentials:

### Retailer Account
- **Email:** `retailer@test.com`
- **Password:** `password123`
- **Features:** Stock monitoring, Voice assistant, Order management

### Distributor Account
- **Email:** `distributor@test.com`
- **Password:** `password123`
- **Features:** Product management, Order fulfillment, Analytics

### Admin Account
- **Email:** `admin@test.com`
- **Password:** `password123`
- **Features:** User management, System settings, Platform analytics

## 📱 Mobile Testing

### Desktop Browser (Chrome/Firefox)
1. Open DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select a mobile device (iPhone 12, Samsung Galaxy S21, etc.)
4. Test touch interactions and responsive layout

### Actual Mobile Device
1. Find your computer's local IP address
2. Access `http://YOUR_IP:5173` on your mobile device
3. Ensure both devices are on the same network

### PWA Installation
1. Visit the site on mobile
2. Look for "Add to Home Screen" prompt
3. Install for native app-like experience

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Distributor)
- `PUT /api/products/:id` - Update product (Distributor)
- `DELETE /api/products/:id` - Delete product (Distributor)
- `GET /api/products/categories` - Get categories
- `GET /api/products/low-stock` - Get low stock items

### Orders
- `GET /api/orders` - Get orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/stats` - Get order statistics

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/sales` - Sales analytics
- `GET /api/analytics/top-products` - Top selling products
- `GET /api/analytics/stock-alerts` - Stock alerts
- `GET /api/analytics/revenue-trends` - Revenue trends

### WebSocket Events
- `connect` - Client connection
- `disconnect` - Client disconnection
- `join_room` - Join user-specific room
- `voice_command` - Send voice command
- `voice_response` - Receive voice response
- `stock_update_request` - Request stock updates
- `stock_update` - Receive stock updates

## 🗂️ Project Structure

```
qwipo-ai-platform/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── AuthWrapper.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── RetailerDashboard.jsx
│   │   │   │   ├── DistributorDashboard.jsx
│   │   │   │   └── AdminDashboard.jsx
│   │   │   └── VoiceAssistant/
│   │   │       └── VoiceAssistant.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── products.py
│   │   │   ├── orders.py
│   │   │   └── analytics.py
│   │   └── utils/
│   │       ├── database.py
│   │       └── auth.py
│   ├── app.py
│   ├── seed_data.py
│   ├── requirements.txt
│   └── .env
└── README.md
```

## 🎤 Voice Commands Examples

Try these voice commands with the Qwipo AI assistant:

- "Check my stock levels"
- "Show low stock items"
- "What are my top selling products?"
- "Generate sales report"
- "Place a new order"
- "Show this week's revenue"
- "Recommend products to reorder"
- "Display analytics"

## 🔧 Development

### Frontend Development

```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Development

```bash
cd backend
python app.py    # Start Flask server (auto-reload enabled)
```

### Database Management

```bash
# Access MongoDB shell
mongosh

# Use Qwipo database
use qwipo_ai

# View collections
show collections

# Query users
db.users.find()

# Query products
db.products.find()

# Clear database
python seed_data.py  # Includes clear database option
```

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "retailer" | "distributor" | "admin",
  company_name: String,
  phone: String,
  address: String,
  created_at: DateTime,
  updated_at: DateTime,
  is_active: Boolean,
  mobile_device: Boolean
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  brand: String,
  price: Number,
  mrp: Number,
  stock: Number,
  min_stock: Number,
  unit: String,
  image_url: String,
  distributor_id: String,
  is_active: Boolean,
  created_at: DateTime,
  updated_at: DateTime
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  retailer_id: String,
  items: [{
    product_id: String,
    product_name: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  total_amount: Number,
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
  delivery_address: String,
  notes: String,
  created_at: DateTime,
  updated_at: DateTime,
  mobile_order: Boolean
}
```

## 🌟 Key Features Implementation

### 1. Voice Assistant
The voice assistant uses the Web Speech API for speech recognition and synthesis:
- Continuous listening mode
- Real-time transcript display
- Natural language processing
- Context-aware responses

### 2. Real-Time Updates
WebSocket integration provides live updates:
- Stock level changes
- Order status updates
- System notifications
- Multi-user synchronization

### 3. Mobile Optimization
- Touch-friendly UI components
- Responsive grid layouts
- Bottom navigation for mobile
- Swipe gestures support
- Optimized for slow networks

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Restart MongoDB service
# Windows
net stop MongoDB
net start MongoDB

# macOS
brew services restart mongodb-community

# Linux
sudo systemctl restart mongod
```

### Voice Assistant Not Working
- Ensure you're using HTTPS or localhost
- Check browser console for errors
- Grant microphone permissions
- Test with Chrome/Edge (best compatibility)

### Port Already in Use
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Upload dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Add Procfile:
web: python app.py
```

### Database (MongoDB Atlas)
1. Create cluster at mongodb.com/cloud/atlas
2. Update MONGO_URI in .env
3. Whitelist IP addresses

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@qwipo.ai or join our Slack channel.

## 🙏 Acknowledgments

- React Team for the amazing framework
- Flask community for the robust backend tools
- MongoDB for the flexible database
- All contributors and testers

---

**Built with ❤️ for the Indian Retail Market**

*Qwipo AI - Empowering Retailers with Voice-First Intelligence*

#   C I P H E R - N O V A - R o u n d - 0 2 -  
 