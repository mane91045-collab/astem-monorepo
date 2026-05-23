# ✅ Vercel Deployment Setup - Complete Checklist

## Changes Made to Your Project

### 1. **API Client Abstraction** ✅
- Created `client/src/api/apiClient.js` - centralized API client
- Uses `VITE_API_BASE_URL` environment variable
- Handles CORS and error intercepting automatically
- Updated `MetroHeatMap.jsx` to use apiClient
- Updated `MapSidebar.jsx` to use apiClient

### 2. **Environment Variables** ✅
- Created `client/.env.example` - template for client env vars
- Created `client/.env.local` - local development config
- Created `server/.env.example` - template for server env vars
- Created `server/.env.local` - local development config
- Updated `.gitignore` to exclude `.env.local` files

### 3. **Server Configuration** ✅
- Updated `server/index.js` - CORS uses environment variables
- Created `server/vercel.json` - Vercel deployment config
- Server reads `CORS_ORIGIN` from environment

### 4. **Client Configuration** ✅
- Updated `client/vite.config.js` - proxy and build optimization
- Supports `VITE_API_BASE_URL` environment variable
- Proxy works for local dev, env vars work for production

### 5. **Root Configuration** ✅
- Created `vercel.json` - deployment config for client
- Updated `package.json` - added build and deploy scripts
- Created `.github/workflows/deploy.yml` - GitHub Actions CI/CD

### 6. **Documentation** ✅
- Created `VERCEL_DEPLOYMENT.md` - detailed deployment guide
- Created `DEPLOYMENT_QUICK_START.md` - quick reference guide

---

## 🚀 Deployment Steps

### Phase 1: Prepare Your Repository

```bash
# Navigate to your project
cd c:\Users\Ethane Lebis\Documents\Astem

# Initialize Git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Add Vercel deployment configuration with environment variables"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/astem.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### Phase 2: Deploy Server to Vercel

#### Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to server directory
cd server

# Deploy to Vercel (this will guide you through setup)
vercel --prod
```

**During deployment:**
- You'll be asked to link to GitHub account
- Select your GitHub repo
- Vercel will auto-detect it's a Node.js project

**After deployment:**
- Copy your server URL (e.g., `https://astem-server.vercel.app`)
- Go to Vercel Dashboard → Your Server Project → Settings
- Add Environment Variables:
  ```
  PORT=4000
  NODE_ENV=production
  DB_HOST=<your-database-host>
  DB_USER=<your-database-user>
  DB_PASSWORD=<your-database-password>
  DB_PORT=5432
  DB_NAME=<your-database-name>
  CORS_ORIGIN=https://your-client.vercel.app
  CLIENT_URL=https://your-client.vercel.app
  ```

---

### Phase 3: Deploy Client to Vercel

#### Using Vercel Dashboard (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "Add New"** → **"Project"**
3. **Import your GitHub repository** (`astem`)
4. **Configure Project Settings:**
   - Framework: `Vite`
   - Build Command: `npm run build --prefix client`
   - Output Directory: `client/dist`
   - Install Command: `npm install`
   - Root Directory: (leave blank or `/`)

5. **Add Environment Variables:**
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-server.vercel.app` (from Phase 2)
   - Environment: Production

6. **Click "Deploy"** and wait for build to complete

---

### Phase 4: Connect Client to Server

1. **Get Server URL** from your Vercel server deployment
2. **Update Client Environment Variable:**
   - In Vercel Dashboard (Client Project)
   - Settings → Environment Variables
   - Update `VITE_API_BASE_URL` value
   - Click "Save"
3. **Redeploy Client:**
   - Deployments tab
   - Click the latest deployment
   - Click "Redeploy"

---

## 🔍 Verify Everything Works

### 1. Test Local Development First

```bash
cd c:\Users\Ethane Lebis\Documents\Astem

# Ensure .env files are set up
# client/.env.local should have: VITE_API_BASE_URL=http://localhost:4000
# server/.env.local should have: CORS_ORIGIN=http://localhost:5173

# Start development
npm run dev

# Visit http://localhost:5173 and test features
```

### 2. Test Production Deployment

```bash
# Open your deployed client
https://your-client.vercel.app

# Open DevTools (F12) → Network tab
# Navigate to a page that fetches data (Metro Map)
# Check that API requests go to your server URL
# Verify responses are successful (status 200)
```

### 3. Test API Health

```bash
# From terminal or Postman
curl https://your-server.vercel.app/api/health

# Should return:
# {"status":"ok","timestamp":"2024-05-23T..."}
```

---

## 📋 Environment Variables Checklist

### Server Production (.env on Vercel)
- [ ] `PORT=4000`
- [ ] `NODE_ENV=production`
- [ ] `DB_HOST=` (production database)
- [ ] `DB_USER=` (production database user)
- [ ] `DB_PASSWORD=` (production database password)
- [ ] `DB_PORT=5432`
- [ ] `DB_NAME=` (production database name)
- [ ] `CORS_ORIGIN=https://your-client.vercel.app`
- [ ] `CLIENT_URL=https://your-client.vercel.app`

### Client Production (.env on Vercel)
- [ ] `VITE_API_BASE_URL=https://your-server.vercel.app`

### Server Local (server/.env.local - NOT committed)
- [ ] `PORT=4000`
- [ ] `NODE_ENV=development`
- [ ] `DB_HOST=localhost` (or your local DB)
- [ ] `DB_USER=` (your local DB user)
- [ ] `DB_PASSWORD=` (your local DB password)
- [ ] `DB_PORT=5432`
- [ ] `DB_NAME=` (your local DB name)
- [ ] `CORS_ORIGIN=http://localhost:5173`
- [ ] `CLIENT_URL=http://localhost:5173`

### Client Local (client/.env.local - NOT committed)
- [ ] `VITE_API_BASE_URL=http://localhost:4000`

---

## 🆘 Common Issues & Solutions

### Issue: "Cannot POST /api/stations"
**Solution:** Check that `VITE_API_BASE_URL` is set correctly and server is running.

### Issue: CORS error in browser console
**Solution:** Verify server `CORS_ORIGIN` matches your client domain exactly.

### Issue: 404 when calling API
**Solution:** Check API endpoint exists on server and `VITE_API_BASE_URL` is correct.

### Issue: Build fails on Vercel
**Solution:** 
1. Check build logs in Vercel dashboard
2. Ensure `npm run build --prefix client` works locally
3. Verify all environment variables are set in Vercel

### Issue: Database connection error
**Solution:**
1. Use a remote database (not localhost)
2. Verify credentials in environment variables
3. Check database is accessible from Vercel servers

---

## 📁 Files Created/Modified

### New Files Created:
- `client/src/api/apiClient.js` - Centralized API client
- `client/.env.local` - Client environment (local)
- `client/.env.example` - Client environment template
- `server/.env.local` - Server environment (local)
- `server/.env.example` - Server environment template
- `server/vercel.json` - Server deployment config
- `vercel.json` - Client deployment config
- `.github/workflows/deploy.yml` - GitHub Actions CI/CD
- `VERCEL_DEPLOYMENT.md` - Detailed deployment guide
- `DEPLOYMENT_QUICK_START.md` - Quick start guide

### Files Modified:
- `server/index.js` - CORS configuration
- `client/vite.config.js` - Build and proxy configuration
- `client/src/pages/MetroHeatMap.jsx` - Use apiClient
- `client/src/components/MapSidebar.jsx` - Use apiClient
- `package.json` - Added build scripts
- `.gitignore` - Updated with env files

---

## 🎯 How It Works

### Local Development
```
Your Machine
├── Client (http://localhost:5173)
│   └── Vite proxy redirects /api → http://localhost:4000
├── Server (http://localhost:4000)
│   └── Serves API endpoints
└── Database (localhost:5432)
    └── Stores data
```

### Production (Vercel)
```
Internet
├── Client (https://your-app.vercel.app)
│   ├── Reads VITE_API_BASE_URL env var
│   └── Makes requests to https://your-server.vercel.app/api
├── Server (https://your-server.vercel.app)
│   ├── Reads CORS_ORIGIN env var
│   └── Connects to production database
└── Database (cloud provider)
    └── Stores data
```

---

## ✨ Key Features Implemented

✅ **Environment-based API URLs** - Works in dev and prod
✅ **CORS properly configured** - Server accepts requests from client
✅ **Centralized API client** - Single point for API requests
✅ **Vercel-ready configs** - Both client and server configured
✅ **GitHub Integration** - Auto-deploy on push
✅ **CI/CD Pipeline** - GitHub Actions workflow included
✅ **Production Database** - Uses env vars for secure credentials

---

## 📚 Reference Documents

1. **VERCEL_DEPLOYMENT.md** - Complete deployment guide (step-by-step)
2. **DEPLOYMENT_QUICK_START.md** - Quick reference guide
3. **This file** - Setup checklist and overview

---

## 🚀 You're Ready!

Your project is now configured for Vercel deployment with:
- ✅ Environment-based configuration
- ✅ Client-server communication ready for production
- ✅ CORS properly configured
- ✅ GitHub integration ready
- ✅ Automated CI/CD (optional)

**Next: Follow the deployment steps above to go live!**

---

**Last Updated:** May 23, 2024
**Vercel Deployment Status:** Ready ✅
