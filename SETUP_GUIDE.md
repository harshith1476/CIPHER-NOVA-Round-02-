# 🚀 Qwipo AI Platform - Complete Setup Guide

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- ✅ **Node.js** v18+ ([Download](https://nodejs.org/))
- ✅ **Python** 3.10+ ([Download](https://www.python.org/downloads/))
- ✅ **MongoDB** 6.0+ ([Download](https://www.mongodb.com/try/download/community))
- ✅ **Git** ([Download](https://git-scm.com/downloads))

## 🎯 Step-by-Step Installation

### Step 1: Install MongoDB (Windows)

1. Download MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer (Choose "Complete" installation)
3. During installation:
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Run service as Network Service user"
   - ✅ Install MongoDB Compass (GUI tool)

4. Verify installation:
```bash
# Open Command Prompt and run:
mongosh
```

If you see `>` prompt, MongoDB is installed correctly! Type `exit` to quit.

### Step 2: Clone the Project

```bash
# Open Command Prompt or PowerShell
cd Desktop
git clone <your-repo-url>
cd qwipo-ai-platform
```

### Step 3: Backend Setup (Easy Mode)

#### Option A: Using the Batch Script (Recommended for Windows)

```bash
cd backend
run.bat
```

This will automatically:
- Create a virtual environment
- Install all Python dependencies
- Check MongoDB connection
- Start the Flask server

#### Option B: Manual Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

You should see:
```
✓ Connected to MongoDB: qwipo_ai
✓ Database indexes created
* Running on http://0.0.0.0:5000
```

### Step 4: Seed the Database

Open a **NEW** terminal/command prompt:

```bash
cd backend

# On Windows:
seed.bat

# Or manually:
python seed_data.py
```

You'll see:
```
==================================================
Qwipo AI - Database Seeding
==================================================
Clearing database...
✓ Database cleared
Seeding users...
✓ Created 3 users
Seeding 50+ Indian FMCG products...
✓ Created 53 products
Seeding sample orders...
✓ Created 10 sample orders
==================================================
✓ Database seeding completed successfully!
==================================================

Test Credentials:
--------------------------------------------------
Retailer: retailer@test.com / password123
Distributor: distributor@test.com / password123
Admin: admin@test.com / password123
==================================================
```

### Step 5: Frontend Setup

Open another **NEW** terminal/command prompt:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

You should see:
```
VITE v7.1.7  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## 🎉 Access the Application

1. Open your browser
2. Go to: `http://localhost:5173`
3. You should see the Qwipo AI login page!

## 🔐 Login for the First Time

### Try Retailer Account:
- **Email:** retailer@test.com
- **Password:** password123

You should see:
- Beautiful neon-themed dashboard
- Stock monitoring cards
- Voice assistant button (green microphone)
- Bottom navigation

### Try Distributor Account:
- **Email:** distributor@test.com
- **Password:** password123

You should see:
- Product management interface
- Inventory controls
- Order management

### Try Admin Account:
- **Email:** admin@test.com
- **Password:** password123

You should see:
- User management
- Platform analytics
- System settings

## 🎤 Test Voice Assistant

1. Login as any user
2. Click the **green microphone button** (bottom right)
3. Click "Start Voice Command"
4. Say one of these:
   - "Check my stock levels"
   - "Show sales analytics"
   - "What products are low on stock?"

The assistant should respond both visually and with voice!

## 📱 Test on Mobile

### Using Chrome DevTools:
1. Press `F12` to open DevTools
2. Press `Ctrl+Shift+M` to toggle device toolbar
3. Select "iPhone 12 Pro" or any mobile device
4. Test the mobile interface!

### On Real Mobile Device:
1. Find your computer's IP:
   ```bash
   # Windows Command Prompt:
   ipconfig
   # Look for "IPv4 Address"
   ```

2. Make sure phone and computer are on same WiFi

3. On phone browser, go to:
   ```
   http://YOUR_IP:5173
   ```

## 🐛 Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution:**
```bash
# Windows - Start MongoDB service:
net start MongoDB

# Or check if MongoDB is running:
services.msc
# Look for "MongoDB" service and start it
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Windows - Find and kill the process:
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Issue: "npm ERR! code ECONNREFUSED"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules
rm -rf node_modules
# Reinstall
npm install
```

### Issue: Voice Assistant not working
**Solution:**
- Use Chrome or Edge browser (best compatibility)
- Make sure you're on `localhost` or `https://`
- Grant microphone permissions when prompted
- Check browser console for errors (F12)

### Issue: "Module not found" errors
**Backend:**
```bash
cd backend
pip install -r requirements.txt --force-reinstall
```

**Frontend:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Restart Everything

If something goes wrong, restart in this order:

1. **Stop all servers** (Ctrl+C in each terminal)

2. **Restart MongoDB:**
   ```bash
   # Windows:
   net stop MongoDB
   net start MongoDB
   ```

3. **Restart Backend:**
   ```bash
   cd backend
   python app.py
   ```

4. **Restart Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## ✅ Verification Checklist

After setup, verify:

- [ ] MongoDB is running
- [ ] Backend server at `http://localhost:5000` responds
- [ ] Frontend at `http://localhost:5173` loads
- [ ] Can login with test credentials
- [ ] Dashboard loads with data
- [ ] Voice assistant opens
- [ ] Mobile view works in DevTools
- [ ] WebSocket connection shows in console

## 🎓 Next Steps

1. **Explore the Platform:**
   - Test all three user roles
   - Try voice commands
   - Create orders
   - Manage products

2. **Customize:**
   - Update colors in `tailwind.config.js`
   - Add more products via distributor dashboard
   - Modify voice commands in `VoiceAssistant.jsx`

3. **Deploy:**
   - See main README.md for deployment instructions

## 📚 Learning Resources

- **React:** [react.dev](https://react.dev)
- **Flask:** [flask.palletsprojects.com](https://flask.palletsprojects.com)
- **MongoDB:** [mongodb.com/docs](https://mongodb.com/docs)
- **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com)

## 💬 Get Help

If you're stuck:
1. Check the main `README.md`
2. Look at browser console (F12)
3. Check backend terminal for errors
4. Review MongoDB logs

---

**Happy Coding! 🚀**

Need help? Create an issue or contact support@qwipo.ai

