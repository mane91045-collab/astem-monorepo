# Architecture Diagrams

## Development Environment

```
┌──────────────────────────────────────────────────────────────┐
│                        Your Machine                          │
│                                                              │
│  ┌──────────────────────┐      ┌──────────────────────┐     │
│  │  Client              │      │  Server              │     │
│  │  Port: 5173          │      │  Port: 4000          │     │
│  │  (http://localhost:5173)│   │  (http://localhost:4000) │
│  │                      │      │                      │     │
│  │  React + Vite        │      │  Express + Node.js   │     │
│  │  - App.jsx           │      │  - metroRoutes       │     │
│  │  - Pages             │  ←→  │  - controllers       │     │
│  │  - Components        │      │  - services          │     │
│  │  - apiClient.js      │      │  - database.js       │     │
│  │                      │      │                      │     │
│  │ .env.local:          │      │ .env.local:          │     │
│  │ VITE_API_BASE_URL=   │      │ PORT=4000            │     │
│  │ http://localhost:4000│      │ CORS_ORIGIN=         │     │
│  │                      │      │ http://localhost:5173│     │
│  └──────────────────────┘      └──────────────────────┘     │
│          │                               │                   │
│          │  Vite Proxy                   │                   │
│          ├─ /api → localhost:4000 ←─────┤                   │
│          │                               │                   │
│          └────────────────┬──────────────┘                   │
│                           │                                  │
│  ┌────────────────────────▼──────────────────────┐          │
│  │  PostgreSQL Database (localhost:5432)        │          │
│  │  - Tables and data                           │          │
│  └─────────────────────────────────────────────┘          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Production Environment (Vercel)

```
┌─────────────────────────────────────────────────────────────────┐
│                     INTERNET (Vercel CDN)                       │
│                                                                 │
│  ┌──────────────────────┐         ┌──────────────────────┐    │
│  │  CLIENT              │         │  SERVER              │    │
│  │  https://your-       │         │  https://your-       │    │
│  │  app.vercel.app      │         │  server.vercel.app   │    │
│  │                      │         │                      │    │
│  │  React Build         │    ←→   │  Node.js Runtime     │    │
│  │  - dist/ folder      │         │  - Express API       │    │
│  │  - Static files      │         │  - Routes            │    │
│  │  - apiClient.js      │         │  - Controllers       │    │
│  │                      │         │                      │    │
│  │ Environment Vars:    │         │ Environment Vars:    │    │
│  │ VITE_API_BASE_URL=   │         │ PORT=4000            │    │
│  │ https://your-        │         │ CORS_ORIGIN=         │    │
│  │ server.vercel.app    │         │ https://your-        │    │
│  │                      │         │ app.vercel.app       │    │
│  │                      │         │ DB_HOST=cloud-db     │    │
│  │                      │         │ DB_USER=***          │    │
│  │                      │         │ DB_PASSWORD=***      │    │
│  └──────────────────────┘         └──────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ Network Request
                           ▼
        ┌──────────────────────────────────┐
        │  Cloud Database                  │
        │  (AWS RDS / Railway / Vercel DB) │
        │  - PostgreSQL                    │
        └──────────────────────────────────┘
```

## API Communication Flow

### Local Development
```
Browser Request
  │
  └─ GET http://localhost:5173/
     │
     ├─ React loads App.jsx
     │
     ├─ Component imports apiClient
     │
     └─ apiClient.get('/stations')
        │
        ├─ Reads VITE_API_BASE_URL from .env.local
        │  (Value: http://localhost:4000)
        │
        └─ Makes request to http://localhost:4000/api/stations
           │
           ├─ Server receives request
           ├─ Checks CORS (CORS_ORIGIN=http://localhost:5173) ✅
           ├─ Queries database
           ├─ Returns JSON response
           │
           └─ Response sent back to client
              │
              └─ React updates UI with data
```

### Production (Vercel)
```
Browser Request
  │
  └─ GET https://your-app.vercel.app/
     │
     ├─ React loads App.jsx
     │
     ├─ Component imports apiClient
     │
     └─ apiClient.get('/stations')
        │
        ├─ Reads VITE_API_BASE_URL from Vercel Env Var
        │  (Value: https://your-server.vercel.app)
        │
        └─ Makes request to https://your-server.vercel.app/api/stations
           │
           ├─ Server receives request
           ├─ Checks CORS (CORS_ORIGIN=https://your-app.vercel.app) ✅
           ├─ Queries cloud database
           ├─ Returns JSON response
           │
           └─ Response sent back to client
              │
              └─ React updates UI with data
```

## File Structure

```
astem/
│
├── 📁 client/                     Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 api/
│   │   │   └── apiClient.js       ⭐ Centralized API Client
│   │   ├── 📁 pages/
│   │   │   ├── MetroHeatMap.jsx   ✅ Uses apiClient
│   │   │   ├── EnergyDashboard.jsx
│   │   │   └── ...
│   │   ├── 📁 components/
│   │   │   ├── MapSidebar.jsx     ✅ Uses apiClient
│   │   │   └── ...
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── 📄 vite.config.js          ✅ Updated: Build + Env config
│   ├── 📄 .env.local              Local development env vars
│   ├── 📄 .env.example            Env vars template
│   ├── 📄 package.json
│   └── 📄 index.html
│
├── 📁 server/                     Backend Application
│   ├── 📄 index.js                ✅ Updated: CORS env config
│   ├── 📁 routes/
│   ├── 📁 controllers/
│   ├── 📁 services/
│   ├── 📁 config/
│   │   └── database.js
│   ├── 📄 vercel.json             ⭐ Server deployment config
│   ├── 📄 .env.local              Local development env vars
│   ├── 📄 .env.example            Env vars template
│   └── 📄 package.json
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── 📄 deploy.yml          ⭐ GitHub Actions CI/CD
│
├── 📄 vercel.json                 ⭐ Client deployment config
├── 📄 package.json                ✅ Updated: Build scripts
├── 📄 .gitignore                  ✅ Updated: Ignore .env.local
│
└── 📚 Documentation
    ├── 📄 VERCEL_DEPLOYMENT.md        Full deployment guide
    ├── 📄 DEPLOYMENT_QUICK_START.md   Quick start reference
    ├── 📄 SETUP_CHECKLIST.md          Complete checklist
    ├── 📄 COMMANDS_REFERENCE.md       Common commands
    ├── 📄 PROJECT_SETUP_SUMMARY.md    Setup overview
    └── 📄 ARCHITECTURE.md             This file
```

## Deployment Pipeline

```
┌──────────────────────────────────────────────────────────┐
│  1️⃣  Developer pushes code to GitHub                   │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  2️⃣  GitHub Actions runs (deploy.yml)                  │
│  ├─ Checkout code                                      │
│  ├─ Install dependencies                               │
│  ├─ Build client (npm run build --prefix client)      │
│  └─ Trigger Vercel deployment                         │
└────────────────────┬─────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌──────────────────┐
│  3️⃣  Client     │    │  4️⃣  Server     │
│  Deployment     │    │  Deployment     │
│  ✅ Build       │    │  ✅ Build       │
│  ✅ Test       │    │  ✅ Test       │
│  ✅ Deploy      │    │  ✅ Deploy      │
│                  │    │                  │
│  URL:           │    │  URL:           │
│  your-app.      │    │  your-server.   │
│  vercel.app     │    │  vercel.app     │
└──────────────────┘    └──────────────────┘
        │                         │
        └────────────┬────────────┘
                     │
                     ▼
         ✅ Both services live in production
         API calls work seamlessly
         Users can access the application
```

## Environment Variables Flow

```
┌─────────────────────────────────────────────────────────┐
│           Local Development                            │
│                                                         │
│  client/.env.local                                     │
│  ├─ VITE_API_BASE_URL=http://localhost:4000           │
│  └─ Loaded by Vite at build time                      │
│                                                         │
│  server/.env.local                                     │
│  ├─ PORT=4000                                          │
│  ├─ CORS_ORIGIN=http://localhost:5173                 │
│  ├─ DB_HOST=localhost                                  │
│  └─ Loaded by dotenv at runtime                       │
└─────────────────────────────────────────────────────────┘
            │
            │ Run: npm run dev
            │
            ▼
  Works locally ✅ No issues


┌─────────────────────────────────────────────────────────┐
│        Production (Vercel Dashboard)                    │
│                                                         │
│  Client Project Environment Variables:                 │
│  ├─ VITE_API_BASE_URL=                                 │
│  │  https://your-server.vercel.app                    │
│  └─ Injected during build                              │
│                                                         │
│  Server Project Environment Variables:                 │
│  ├─ PORT=4000                                          │
│  ├─ CORS_ORIGIN=https://your-app.vercel.app          │
│  ├─ DB_HOST=your-cloud-database                       │
│  ├─ DB_USER=your_user                                  │
│  ├─ DB_PASSWORD=***                                    │
│  └─ Set via Vercel Dashboard                           │
└─────────────────────────────────────────────────────────┘
            │
            │ Push to GitHub
            │
            ▼
  Vercel auto-deploys ✅ Both services live
```

## CORS Configuration

```
Request Flow:
┌─────────────────────────┐
│  Browser (Client)       │ https://your-app.vercel.app
│  Sends request to:      │
│  https://your-server.   │
│  vercel.app/api/...     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Server receives request                │
│                                         │
│  Checks:                               │
│  req.headers.origin === CORS_ORIGIN?   │
│                                         │
│  CORS_ORIGIN env var =                │
│  https://your-app.vercel.app ✅       │
│                                         │
│  ✅ Request allowed                    │
│  ✅ Response sent with CORS headers   │
└─────────────────────────────────────────┘
             │
             ▼
┌────────────────────────┐
│  Browser (Client)      │
│  Receives response ✅  │
│  Updates UI with data  │
└────────────────────────┘
```

---

**Architecture Version:** 1.0  
**Last Updated:** May 23, 2024  
**Status:** Production Ready ✅
