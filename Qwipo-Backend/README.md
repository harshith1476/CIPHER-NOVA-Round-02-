# 🚀 Qwipo AI Platform - Backend

**Flask Backend Server with MongoDB Database**

---

## 📋 **Requirements**

- **Python 3.10+**
- **MongoDB** (local or cloud)
- **pip** package manager

---

## 🛠️ **Installation & Setup**

### **Step 1: Install Dependencies**
```bash
pip install -r requirements.txt
```

### **Step 2: Start MongoDB**
Make sure MongoDB is running on your system:
- **Windows:** MongoDB should start automatically as a service
- **Manual start:** Run `mongod` in terminal

### **Step 3: Seed Database**
```bash
python seed_comprehensive_data.py
```
This creates:
- 990 products
- 500 retailers
- 200 distributors
- 50,000 orders
- Test accounts with working credentials

### **Step 4: Start Server**
```bash
python app.py
```
Server runs on: **http://localhost:5000**

---

## 🔑 **Test Credentials**

### **Admin**
```
Email: admin@qwipo.ai
Password: admin123
```

### **Head Accounts**
```
Head Retailer: head.retailer@qwipo.ai / headretailer123
Head Distributor: head.distributor@qwipo.ai / headdistributor123
```

### **Business Accounts**
```
Retailers:
- retailer1@example.com / password123
- retailer2@example.com / password123

Distributors:
- distributor1@example.com / password123
- distributor2@example.com / password123
```

---

## 📁 **Project Structure**

```
Qwipo-Backend/
├── app.py                          # Main Flask application
├── requirements.txt                # Python dependencies
├── seed_comprehensive_data.py      # Database seeder
├── run.bat                         # Windows startup script
├── Dockerfile                      # Docker configuration
├── README.md                       # This file
└── app/                           # Application code
    ├── __init__.py
    ├── routes/                    # API endpoints
    │   ├── auth.py               # Authentication
    │   ├── products.py           # Product management
    │   ├── orders.py             # Order management
    │   ├── analytics.py          # Analytics & reporting
    │   ├── admin_verification.py # Admin verification
    │   ├── cart_orders.py        # Cart & orders
    │   └── head_routes.py        # Head role routes
    └── utils/                    # Utility functions
        ├── auth.py               # Authentication utilities
        ├── database.py           # Database connection
        └── redis_cache.py        # Redis caching
```

---

## 🌐 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### **Products**
- `GET /api/products/all` - Get all products (public)
- `GET /api/products` - Get products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Distributor)
- `PUT /api/products/:id` - Update product (Distributor)
- `DELETE /api/products/:id` - Delete product (Distributor)

### **Orders**
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status

### **Analytics**
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/sales` - Sales analytics

### **Admin**
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/verify/:id` - Verify retailer

---

## 🔧 **Configuration**

### **Environment Variables**
Create `.env` file:
```env
SECRET_KEY=qwipo-ai-secret-key-2024-super-secure
MONGO_URI=mongodb://localhost:27017/qwipo_ai
JWT_SECRET=qwipo-jwt-secret-2024
JWT_EXPIRATION=86400
PORT=5000
FLASK_ENV=development
```

### **Database Connection**
Default MongoDB URI: `mongodb://localhost:27017/qwipo_ai`

---

## 🚀 **Quick Start**

### **Windows (Easy)**
```bash
# Double-click run.bat or run:
run.bat
```

### **Manual Start**
```bash
# Install dependencies
pip install -r requirements.txt

# Seed database
python seed_comprehensive_data.py

# Start server
python app.py
```

---

## 📊 **Database Schema**

### **Users Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  role: "retailer" | "distributor" | "admin" | "head_retailer" | "head_distributor",
  company_name: String,
  phone: String,
  address: String,
  created_at: DateTime,
  updated_at: DateTime,
  is_active: Boolean,
  status: "approved" | "pending_approval" | "rejected"
}
```

### **Products Collection**
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

### **Orders Collection**
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
  created_at: DateTime,
  updated_at: DateTime
}
```

---

## 🔐 **Security Features**

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt for password security
- **Role-based Access** - Different permissions per role
- **Input Validation** - Request data validation
- **CORS Enabled** - Cross-origin requests allowed

---

## 🐛 **Troubleshooting**

### **MongoDB Connection Failed**
1. Check if MongoDB is running: `mongosh`
2. Verify connection string in `.env`
3. Check MongoDB service status

### **Port 5000 Already in Use**
```bash
# Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### **Module Not Found**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

---

## 📈 **Performance**

- **Database Indexing** - Optimized queries
- **Connection Pooling** - Efficient database connections
- **Caching** - Redis cache for better performance
- **Error Handling** - Comprehensive error management

---

## 🚀 **Production Deployment**

### **Docker**
```bash
docker build -t qwipo-backend .
docker run -p 5000:5000 qwipo-backend
```

### **Environment Setup**
- Set production environment variables
- Use MongoDB Atlas for cloud database
- Configure reverse proxy (nginx)
- Enable HTTPS

---

**Backend Status: ✅ Production Ready**

*Last Updated: October 10, 2025*
