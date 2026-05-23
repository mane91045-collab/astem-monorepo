# Astem - Baku Metro Energy Analytics Platform
## Quick Setup & Deployment Guide

---

## 🚀 Quick Start (Local Development)

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/astem.git
cd astem

# Install all dependencies
npm run install-all
```

### 2. Configure Environment Variables

**Server (`server/.env.local`):**
```env
PORT=4000
NODE_ENV=development
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=baku_metro
CORS_ORIGIN=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

**Client (`client/.env.local`):**
```env
VITE_API_BASE_URL=http://localhost:4000
```

### 3. Start Development Server

```bash
npm run dev
```

This runs:
- **Client**: http://localhost:5173
- **Server**: http://localhost:4000

---

## 🌐 Vercel Deployment (Production)

### Separate Deployments (Recommended)

#### Deploy Server First

1. **Create `server/vercel.json`** (already created)
2. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   cd server
   vercel --prod
   ```
3. **Note the Server URL** (e.g., `https://astem-server.vercel.app`)
4. **Set Environment Variables in Vercel Dashboard:**
   - `CORS_ORIGIN=https://your-client.vercel.app`
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (your production database)

#### Deploy Client

1. **Go to [Vercel Dashboard](https://vercel.com)**
2. **Click "Add New" → "Project"**
3. **Import GitHub Repository**
4. **Configure:**
   - Framework: Vite
   - Build Command: `npm run build --prefix client`
   - Output Directory: `client/dist`
5. **Add Environment Variable:**
   ```
   VITE_API_BASE_URL=https://astem-server.vercel.app
   ```
6. **Deploy**

---

## 📁 File Structure

```
astem/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── apiClient.js   # Centralized API client
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.jsx
│   ├── .env.local            # Local env (ignored in git)
│   ├── .env.example          # Example env
│   ├── vite.config.js        # Vite configuration
│   └── package.json
│
├── server/                    # Express backend
│   ├── index.js             # Main server file
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   ├── .env.local           # Local env (ignored in git)
│   ├── .env.example         # Example env
│   ├── vercel.json          # Vercel deployment config
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions CI/CD
│
├── vercel.json              # Client deployment config
├── VERCEL_DEPLOYMENT.md     # Detailed deployment guide
├── README.md
├── .gitignore
└── package.json
```

---

## 🔄 How Client Fetches from Server

### Local Development
```
Client (http://localhost:5173)
  ↓ Proxy /api → vite.config.js proxy
  ↓
Server (http://localhost:4000)
```

**In Code:**
```javascript
import apiClient from '../api/apiClient';

// Automatically uses http://localhost:4000 (from .env.local)
const response = await apiClient.get('/stations');
```

### Production (Vercel)
```
Client (https://your-app.vercel.app)
  ↓ VITE_API_BASE_URL=https://your-server.vercel.app
  ↓
Server (https://your-server.vercel.app)
```

**In Code:** Same! Environment variable is automatically used.

---

## ✅ Verify Deployment

### Test API Connection

1. Open your deployed client app
2. Open **DevTools → Network tab**
3. Navigate to a page that fetches data (e.g., Metro Map)
4. Check that API calls go to your server domain
5. Look for successful responses (200 status)

### API Health Check

```bash
curl https://your-server.vercel.app/api/health
# Response: { "status": "ok", "timestamp": "..." }
```

---

## 🔑 Environment Variables Needed

### Server (Production)

| Variable | Value | Example |
|----------|-------|---------|
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `production` |
| `DB_HOST` | Database host | `your-db.com` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `***` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `baku_metro` |
| `CORS_ORIGIN` | Client domain | `https://your-app.vercel.app` |
| `CLIENT_URL` | Client URL | `https://your-app.vercel.app` |

### Client (Production)

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_BASE_URL` | Server API URL | `https://your-server.vercel.app` |

---

## 🐛 Troubleshooting

### CORS Errors
- ✅ Check server `CORS_ORIGIN` matches client domain
- ✅ Ensure server is running and accessible
- ✅ Check firewall/security rules

### 404 API Errors
- ✅ Verify `VITE_API_BASE_URL` is correct
- ✅ Check API routes exist on server
- ✅ Look at browser DevTools Network tab

### Database Connection Errors
- ✅ Use remote database, not localhost
- ✅ Verify credentials in environment variables
- ✅ Check database is accessible from Vercel

### Build Failures on Vercel
- ✅ Check build logs in Vercel dashboard
- ✅ Ensure `npm run build --prefix client` works locally
- ✅ Verify all environment variables are set

---

## 📚 Resources

- [Vercel Docs](https://vercel.com/docs)
- [Node.js on Vercel](https://vercel.com/docs/concepts/functions/serverless-functions/node-js)
- [Vite Env Variables](https://vitejs.dev/guide/env-and-modes.html)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## 🎯 Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy server to Vercel
3. ✅ Deploy client to Vercel
4. ✅ Set environment variables
5. ✅ Test API connection
6. ✅ Monitor deployment logs

---

**Happy Deploying! 🚀**
