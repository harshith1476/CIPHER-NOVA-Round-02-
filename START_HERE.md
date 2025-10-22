# 🚀 START HERE - Qwipo AI Platform

## ⚡ Quick Start (5 Minutes)

### Step 1️⃣: Install MongoDB
If you don't have MongoDB installed:
1. Download from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run as a service automatically

### Step 2️⃣: Start Backend

Open **Command Prompt** or **PowerShell**:

```bash
cd c:\Users\vemul\desktop\qwipo-ai-platform\backend
pip install -r requirements.txt
python seed_data.py
python app.py
```

Wait for: `✓ Connected to MongoDB: qwipo_ai`

### Step 3️⃣: Start Frontend

Open a **NEW** Command Prompt:

```bash
cd c:\Users\vemul\desktop\qwipo-ai-platform\frontend
npm install
npm run dev
```

Wait for: `Local: http://localhost:5173/`

### Step 4️⃣: Open Browser

Go to: **http://localhost:5173**

Login with:
- **Email:** retailer@test.com
- **Password:** password123

## 🎉 That's It!

You should now see the beautiful Qwipo AI dashboard!

---

## 🎯 What to Try First

### 1. Explore the Retailer Dashboard
- Check out the stock monitoring cards
- See the low stock alerts
- Browse through products

### 2. Try the Voice Assistant
- Click the **green microphone button** (bottom right)
- Click "Start Voice Command"
- Say: **"Check my stock levels"**
- The AI will respond with voice and text!

### 3. Test Different User Roles

**Distributor Account:**
- Logout (if there's a logout button, or just login again)
- Email: distributor@test.com
- Password: password123
- See product management features

**Admin Account:**
- Email: admin@test.com
- Password: password123
- See platform administration

### 4. Test on Mobile
- Press **F12** in browser
- Press **Ctrl+Shift+M** 
- Select "iPhone 12 Pro"
- See the beautiful mobile interface!

---

## 📱 Features to Explore

✅ **Bottom Navigation** (on mobile)  
✅ **Voice Commands** - Try: "Show sales analytics"  
✅ **Real-time Updates** - Watch the live stock indicators  
✅ **Touch-Friendly** - All buttons are easy to tap  
✅ **Beautiful Animations** - Smooth transitions everywhere  
✅ **Dark Theme** - Easy on the eyes with neon accents  

---

## 🆘 Having Issues?

### "Can't connect to database"
```bash
# Start MongoDB:
net start MongoDB
```

### "Port already in use"
```bash
# Kill the process:
# Find the PID using port 5000 or 5173
netstat -ano | findstr :5000
# Kill it:
taskkill /PID <number> /F
```

### "Module not found"
```bash
# Backend:
cd backend
pip install -r requirements.txt

# Frontend:
cd frontend
npm install
```

---

## 📚 More Information

- **Full Setup Guide:** See `SETUP_GUIDE.md`
- **Complete Documentation:** See `README.md`
- **Project Status:** See `PROJECT_STATUS.md`

---

## 🎯 Test Credentials

| Role        | Email                    | Password    |
|-------------|--------------------------|-------------|
| Retailer    | retailer@test.com       | password123 |
| Distributor | distributor@test.com    | password123 |
| Admin       | admin@test.com          | password123 |

---

## ✨ Key Features

🎤 **Voice Assistant** - Talk to Qwipo AI  
📱 **Mobile First** - Perfect on phones  
⚡ **Real-time** - Live updates via WebSocket  
🌟 **Beautiful UI** - Neon dark theme  
🛍️ **50+ Products** - Indian FMCG items  
👥 **3 Dashboards** - Retailer, Distributor, Admin  

---

## 🚀 Quick Commands Reference

### Voice Commands to Try:
- "Check my stock levels"
- "Show sales analytics"
- "What products are low on stock?"
- "Generate sales report"
- "Show this week's revenue"

### Backend Commands:
```bash
python app.py          # Start server
python seed_data.py    # Reseed database
```

### Frontend Commands:
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🎉 Enjoy Qwipo AI!

The platform is fully functional and ready to use. Explore all the features and have fun!

**Questions?** Check the documentation files or create an issue.

---

**Made with ❤️ for Indian Retailers**

