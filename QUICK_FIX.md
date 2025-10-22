# 🔧 Quick Fix Guide

## Issues Found & Solutions

### ❌ **Problem 1: MongoDB Not Running**

**Error:** `No connection could be made because the target machine actively refused it`

**Solution:**

```bash
# Option 1: Start MongoDB Service (Windows)
net start MongoDB

# Option 2: If MongoDB not installed as service, start manually
# Go to MongoDB installation folder (usually C:\Program Files\MongoDB\Server\7.0\bin\)
mongod

# Option 3: Check if MongoDB is running
mongosh
```

If MongoDB is not installed:
1. Download: https://www.mongodb.com/try/download/community
2. Install with "Install MongoDB as a Service" checked
3. MongoDB will auto-start

---

### ❌ **Problem 2: Frontend Dependency Issues**

**Error:** Tailwind CSS PostCSS plugin error

**Solution:**

```bash
cd frontend

# Remove old dependencies
rm -rf node_modules package-lock.json

# Install fresh dependencies (this will work now with updated package.json)
npm install

# Start dev server
npm run dev
```

---

## ✅ **Complete Step-by-Step Fix**

### **Step 1: Start MongoDB**

**Windows:**
```bash
# Open Command Prompt as Administrator
net start MongoDB
```

**Verify it's running:**
```bash
mongosh
# You should see: "test>"
# Type: exit
```

---

### **Step 2: Fix Frontend**

```bash
cd c:\Users\vemul\desktop\qwipo-ai-platform\frontend

# Clean install
npm install

# Start dev server
npm run dev
```

---

### **Step 3: Seed Database**

**New terminal:**
```bash
cd c:\Users\vemul\desktop\qwipo-ai-platform\backend

# Seed the database (MongoDB must be running!)
python seed_data.py
```

You should see:
```
✓ Database seeding completed successfully!
```

---

### **Step 4: Start Backend**

**Same terminal:**
```bash
python app.py
```

You should see:
```
✓ Connected to MongoDB: qwipo_ai
✓ Database indexes created
* Running on http://0.0.0.0:5000
```

---

### **Step 5: Open Browser**

Go to: **http://localhost:5173**

Login:
- Email: `retailer@test.com`
- Password: `password123`

---

## 🆘 **Still Having Issues?**

### **MongoDB Won't Start?**

**Check if MongoDB is installed:**
```bash
mongod --version
```

**If not installed:**
1. Download from: https://www.mongodb.com/try/download/community
2. Choose "Complete" installation
3. Check "Install MongoDB as a Service"
4. Install MongoDB Compass (GUI tool)
5. Restart computer

---

### **Frontend Still Has Errors?**

**Try clean reinstall:**
```bash
cd frontend

# Delete everything
rm -rf node_modules
rm package-lock.json

# Fresh install
npm cache clean --force
npm install

# Should work now!
npm run dev
```

---

### **Backend Connection Error?**

**Verify MongoDB is accessible:**
```bash
# Test connection
mongosh

# If it connects, type:
show dbs
exit

# Then try backend again
cd backend
python app.py
```

---

## ✅ **Verification Checklist**

After fixes, you should have:

- [ ] MongoDB running (`net start MongoDB`)
- [ ] MongoDB accessible (`mongosh` works)
- [ ] Frontend dependencies installed (`npm install` completed)
- [ ] Frontend running (`npm run dev` on port 5173)
- [ ] Database seeded (`python seed_data.py` completed)
- [ ] Backend running (`python app.py` on port 5000)
- [ ] Browser shows login page at `http://localhost:5173`
- [ ] Can login successfully

---

## 🎯 **Expected Terminal Output**

### **Frontend Terminal:**
```
VITE v7.1.7  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

### **Backend Terminal:**
```
✓ Connected to MongoDB: qwipo_ai
✓ Database indexes created
* Running on http://0.0.0.0:5000
* Restarting with stat
✓ Connected to MongoDB: qwipo_ai
✓ Database indexes created
* Debugger is active!
(12345) wsgi starting up on http://0.0.0.0:5000
```

### **Seed Data Terminal:**
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
```

---

## 📞 **Quick Commands Reference**

```bash
# Start MongoDB
net start MongoDB

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
python seed_data.py
python app.py

# Check MongoDB
mongosh
show dbs
exit
```

---

**Everything should work now! 🚀**

If you still have issues, the problem is likely:
1. MongoDB not installed
2. Port 27017 blocked by firewall
3. MongoDB service not starting

Check Windows Services (services.msc) for "MongoDB" service.

