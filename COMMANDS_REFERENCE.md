# 🚀 Commands Quick Reference

## Local Development

```bash
# Install all dependencies
npm run install-all

# Start development (both client & server)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Server Commands

```bash
# Start development (from server directory)
npm run dev

# Start production
npm start

# Build for production
npm run build
```

---

## Client Commands

```bash
# Start development (from client directory)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Vercel Deployment

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy server to Vercel
cd server && vercel --prod

# Deploy client to Vercel
cd .. && vercel --prod

# Deploy specific environment
vercel --prod --env VITE_API_BASE_URL=https://your-server.vercel.app
```

---

## GitHub

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/astem.git
git branch -M main
git push -u origin main

# Push changes
git add .
git commit -m "Your message"
git push origin main

# Clone repository
git clone https://github.com/USERNAME/astem.git
cd astem
npm run install-all
```

---

## Environment Variables

```bash
# Check local development environment
cat client/.env.local      # Should have VITE_API_BASE_URL
cat server/.env.local      # Should have DB config and CORS_ORIGIN

# Never commit these files - they're in .gitignore
# Use .env.example as template
```

---

## Testing API Connection

```bash
# Test local server
curl http://localhost:4000/api/health

# Test production server
curl https://your-server.vercel.app/api/health

# Test with more details
curl -v https://your-server.vercel.app/api/health
```

---

## Debugging

```bash
# View server logs
npm run dev --prefix server

# View client logs (open browser DevTools)
# F12 → Console tab

# View Vercel logs
# Go to Vercel Dashboard → Your Project → Deployments → Logs

# View GitHub Actions logs
# GitHub → Repository → Actions → Your Workflow → Run
```

---

## Useful URLs

| Service | Local | Production |
|---------|-------|------------|
| Client | http://localhost:5173 | https://your-app.vercel.app |
| Server API | http://localhost:4000 | https://your-server.vercel.app |
| Server Health | http://localhost:4000/api/health | https://your-server.vercel.app/api/health |
| Vercel Dashboard | - | https://vercel.com/dashboard |
| GitHub Repo | - | https://github.com/USERNAME/astem |

---

## Project Ports

- **Client**: 5173 (Vite)
- **Server**: 4000 (Express)
- **Database**: 5432 (PostgreSQL)

---

## File Locations

```
.env files (Local Only - NOT in Git):
  client/.env.local
  server/.env.local

Configuration files (In Git):
  vercel.json                    (root)
  server/vercel.json
  client/vite.config.js
  .github/workflows/deploy.yml

API Client:
  client/src/api/apiClient.js
```

---

## Troubleshooting Commands

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -r node_modules
npm install

# Kill process on port
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process

# Linux/Mac:
lsof -ti:4000 | xargs kill -9

# Check if ports are in use
netstat -ano | findstr :4000  # Windows
lsof -i :4000                # Mac/Linux
```

---

## Environment Variables Summary

### Required for Production

**Server:**
- DATABASE URL or (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
- CORS_ORIGIN (your client URL)
- NODE_ENV=production

**Client:**
- VITE_API_BASE_URL (your server URL)

### Optional
- PORT (defaults to 4000)
- DB_PORT (defaults to 5432)

---

## Git Workflow

```bash
# Create new branch for features
git checkout -b feature/my-feature

# Commit changes
git add .
git commit -m "Add feature: my-feature"

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request on GitHub
# Merge to main when ready
```

---

## Performance Tips

```bash
# Build optimized for production
npm run build --prefix client

# Use production database
# Avoid localhost database in production

# Enable caching
# In vite.config.js - already configured

# Check bundle size
npm run build --prefix client
# Check dist/ folder size
```

---

## Important Notes

⚠️ **NEVER commit `.env` files** - They contain secrets!
⚠️ **Use `.env.example`** as template for team members
⚠️ **Environment variables in Vercel** are set via Dashboard
⚠️ **Database credentials** should use strong passwords in production
⚠️ **CORS_ORIGIN** must match exactly (with protocol and domain)

---

## Helpful Links

- [Vercel Docs](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios Documentation](https://axios-http.com)
- [Express.js Docs](https://expressjs.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

---

**Last Updated:** May 23, 2024
**Version:** 1.0
