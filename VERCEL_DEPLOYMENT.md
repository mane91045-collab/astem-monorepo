# Vercel Deployment Guide

## Prerequisites
- GitHub account with your repository
- Vercel account (free tier available)
- Node.js 18+ installed locally

---

## Step 1: Push to GitHub

```bash
# Initialize Git if not done
git init

# Add files
git add .

# Commit
git commit -m "Initial commit with Vercel deployment config"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/astem.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Server to Vercel (Backend API)

### Option A: Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Server:**
   ```bash
   cd server
   vercel --prod
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your server project
   - Go to **Settings** → **Environment Variables**
   - Add:
     ```
     PORT=4000
     NODE_ENV=production
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_HOST=your_db_host
     DB_PORT=5432
     DB_NAME=your_db_name
     CORS_ORIGIN=https://your-client-domain.vercel.app
     CLIENT_URL=https://your-client-domain.vercel.app
     ```

4. **Create `server/vercel.json`:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "index.js"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

### Option B: GitHub Integration (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Select `server` folder as the root
5. Add environment variables (see above)
6. Deploy

---

## Step 3: Deploy Client to Vercel (Frontend)

### Using GitHub Integration

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Choose to deploy from root
5. Configure build settings:
   - **Framework**: Vite
   - **Build Command**: `npm run build --prefix client`
   - **Output Directory**: `client/dist`
6. **Add Environment Variable:**
   ```
   VITE_API_BASE_URL=https://your-server-api-url.vercel.app
   ```
   (Get this from your server deployment)
7. Click **Deploy**

---

## Step 4: Connect Client to Server

After both deployments are live:

1. **Get your server API URL** from the Vercel server project (e.g., `https://astem-server.vercel.app`)

2. **Update client environment variable:**
   - In Vercel Dashboard (Client Project)
   - Settings → Environment Variables
   - Update `VITE_API_BASE_URL` to your server URL
   - Redeploy

3. **Test the connection:**
   - Visit your client URL
   - Open browser DevTools → Network tab
   - Check that API calls go to your server domain

---

## Step 5: Update Server CORS

The server automatically reads `CORS_ORIGIN` from environment variables. Ensure it's set correctly in production:

```
CORS_ORIGIN=https://your-client.vercel.app
```

---

## Troubleshooting

### API calls returning 404 or CORS errors
- Check that `VITE_API_BASE_URL` is set correctly in client
- Verify server `CORS_ORIGIN` matches client domain
- Check browser DevTools Network tab for actual API URL being called

### Deployment failures
- Check Vercel deployment logs
- Ensure all environment variables are set
- Verify database connection credentials
- Check that `vercel.json` is in the root of the server folder

### Database connection issues
- Ensure database host is accessible (not localhost)
- Use remote database (e.g., Vercel Postgres, AWS RDS, Railway, Supabase)
- For local development only, use `localhost`

---

## Project Structure for Vercel

```
astem/
├── server/
│   ├── vercel.json          # Vercel server config
│   ├── index.js
│   ├── package.json
│   ├── .env.example
│   ├── .env.local           # Local development only
│   └── ... other files
├── client/
│   ├── .env.local           # Local: VITE_API_BASE_URL=http://localhost:4000
│   ├── .env.example
│   ├── vite.config.js
│   ├── package.json
│   └── ... other files
├── vercel.json              # Root config (for client deployment)
├── .gitignore
├── package.json
└── README.md
```

---

## GitHub Actions (Optional CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build --prefix client
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./client
```

---

## Development vs Production

### Local Development
- Client runs on `http://localhost:5173`
- Server runs on `http://localhost:4000`
- Client proxy redirects `/api` to server

```bash
npm run dev
```

### Production (Vercel)
- Client and server are on different domains
- Client uses `VITE_API_BASE_URL` environment variable
- CORS is configured on server

---

## Redeploy After Changes

### Client Changes
```bash
git add client/
git commit -m "Update client"
git push origin main
# Vercel auto-deploys
```

### Server Changes
```bash
git add server/
git commit -m "Update server"
git push origin main
# Vercel auto-deploys
```

---

## Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Node.js on Vercel](https://vercel.com/docs/concepts/functions/serverless-functions/node-js)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vite Guide](https://vitejs.dev/guide/env-and-modes.html)
