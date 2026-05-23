# Troubleshooting Guide

## Common Issues & Solutions

---

## 🔴 API Calls Failing (404, CORS Errors)

### Issue: "Cannot POST /api/stations" or Similar
**Symptoms:**
- Browser console: `404 Not Found`
- Network tab shows request to wrong URL
- API endpoint returns error

**Solutions:**

1. **Check `VITE_API_BASE_URL` is set correctly:**
   ```bash
   # Local development
   cat client/.env.local
   # Should show: VITE_API_BASE_URL=http://localhost:4000
   
   # Production
   # Check Vercel Dashboard → Client Project → Settings → Environment Variables
   # Should show: VITE_API_BASE_URL=https://your-server.vercel.app
   ```

2. **Verify server is running:**
   ```bash
   # Local
   curl http://localhost:4000/api/health
   # Should return: {"status":"ok",...}
   
   # Production
   curl https://your-server.vercel.app/api/health
   ```

3. **Check apiClient is being used:**
   ```javascript
   // ✅ Correct
   import apiClient from '../api/apiClient';
   apiClient.get('/stations')
   
   // ❌ Wrong
   import axios from 'axios';
   axios.get('/api/stations')  // No env var support!
   ```

4. **Verify API endpoint exists:**
   - Check `server/routes/metroRoutes.js` has the endpoint
   - Ensure controller logic is correct
   - Check server logs for errors

---

### Issue: CORS Error - "Access to XMLHttpRequest blocked"
**Symptoms:**
- Console error: `Access to XMLHttpRequest at 'X' from origin 'Y' has been blocked by CORS policy`
- Response headers missing `Access-Control-Allow-Origin`

**Solutions:**

1. **Verify server CORS configuration:**
   ```javascript
   // server/index.js should have:
   const corsOptions = {
     origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization']
   };
   app.use(cors(corsOptions));
   ```

2. **Check CORS_ORIGIN matches exactly:**
   ```bash
   # Local
   CORS_ORIGIN=http://localhost:5173  (no trailing slash)
   
   # Production
   CORS_ORIGIN=https://your-app.vercel.app  (no trailing slash, no /path)
   ```

3. **Verify environment variable is set:**
   ```bash
   # Local: check server/.env.local
   grep CORS_ORIGIN server/.env.local
   
   # Production: Vercel Dashboard → Server Project → Environment Variables
   ```

4. **Check request origin in browser DevTools:**
   - Open DevTools → Network tab
   - Click on API request
   - Check "Request Headers" → "Origin"
   - Ensure it matches CORS_ORIGIN

---

## 🔴 Local Development Issues

### Issue: "Cannot find module apiClient"
**Symptoms:**
- Build error: `Module not found: Can't resolve '../api/apiClient'`
- Component import fails

**Solution:**
Ensure `client/src/api/apiClient.js` exists:
```bash
ls -la client/src/api/
# Should show: apiClient.js exists
```

### Issue: "VITE_API_BASE_URL is undefined"
**Symptoms:**
- Console shows `VITE_API_BASE_URL=undefined`
- API calls go to `undefined/api/...`

**Solutions:**

1. **Check `.env.local` file exists:**
   ```bash
   cat client/.env.local
   # Should have: VITE_API_BASE_URL=http://localhost:4000
   ```

2. **Restart Vite dev server:**
   ```bash
   npm run dev --prefix client
   # Ctrl+C to stop, then restart
   ```

3. **Verify file is not in .gitignore:**
   ```bash
   git check-ignore client/.env.local
   # Should show: .gitignore:4:client/.env.local (it's intentionally ignored)
   # This is correct! .env.local should NOT be committed
   ```

### Issue: Server won't start - "Port 4000 already in use"
**Symptoms:**
- Error: `Port 4000 is already in use`
- Server fails to start

**Solutions:**

```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process -Force

# macOS/Linux
lsof -ti:4000 | xargs kill -9

# Or use different port
PORT=5000 npm run dev --prefix server
```

### Issue: Database connection fails locally
**Symptoms:**
- Error: `Error: connect ECONNREFUSED 127.0.0.1:5432`
- Cannot connect to database

**Solutions:**

1. **Verify PostgreSQL is running:**
   ```bash
   # Windows
   Get-Service postgresql*
   
   # macOS (Homebrew)
   brew services list | grep postgres
   
   # Linux
   sudo service postgresql status
   ```

2. **Check credentials in `.env.local`:**
   ```bash
   cat server/.env.local
   # Verify:
   # DB_HOST=localhost (or your actual host)
   # DB_USER=postgres (your username)
   # DB_PASSWORD=your_password (your password)
   # DB_PORT=5432
   # DB_NAME=baku_metro
   ```

3. **Test database connection manually:**
   ```bash
   psql -h localhost -U postgres -d baku_metro -c "SELECT 1;"
   # Should return: 1 (success)
   ```

---

## 🔴 Vercel Deployment Issues

### Issue: Build fails on Vercel - "npm run build failed"
**Symptoms:**
- Vercel shows red error
- Build log ends with failure message
- Deployed version missing latest changes

**Solutions:**

1. **Check build logs in Vercel:**
   - Go to Vercel Dashboard
   - Select your project
   - Click "Deployments"
   - Find failed deployment
   - Click "View Function Logs"
   - Read error message carefully

2. **Ensure build works locally:**
   ```bash
   cd client
   npm run build
   # If this fails, fix it before pushing to GitHub
   ```

3. **Check all environment variables:**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Ensure all required variables are set
   - Redeploy after adding variables

4. **Common build errors:**
   ```bash
   # Error: Cannot find module 'XXX'
   # Fix: npm install is missing the dependency
   npm install missing-package --prefix client
   
   # Error: VITE_API_BASE_URL is not defined
   # Fix: Add env var in Vercel Dashboard
   
   # Error: Out of memory
   # Fix: Clean node_modules and reinstall
   rm -rf node_modules
   npm install
   ```

### Issue: Client deployed but gets 404 for everything
**Symptoms:**
- Client loads but shows "Cannot GET /"
- Static assets (JS, CSS) return 404

**Solutions:**

1. **Check `vercel.json` exists and is correct:**
   ```json
   {
     "version": 2,
     "buildCommand": "npm run build --prefix client",
     "outputDirectory": "client/dist",
     "env": {
       "VITE_API_BASE_URL": "@vite_api_base_url"
     }
   }
   ```

2. **Verify build command:**
   - Should be: `npm run build --prefix client`
   - Output: Should create `client/dist` folder

3. **Check output directory:**
   - Vercel should serve from `client/dist`
   - Ensure `index.html` exists in dist folder

4. **Redeploy from Git:**
   - Push to GitHub
   - Vercel auto-redeploys

### Issue: Server deployed but returns 404 for API endpoints
**Symptoms:**
- Client shows CORS error or 404
- Server health check works but API endpoints don't

**Solutions:**

1. **Check `server/vercel.json` is correct:**
   ```json
   {
     "version": 2,
     "builds": [{ "src": "index.js", "use": "@vercel/node" }],
     "routes": [{ "src": "/(.*)", "dest": "index.js" }]
   }
   ```

2. **Verify routes exist:**
   - Check `server/routes/metroRoutes.js`
   - Ensure endpoints are registered in `index.js`
   - Check request path matches (case-sensitive!)

3. **Check server logs:**
   - Vercel Dashboard → Server Project → Deployments
   - Click deployment → "View Function Logs"
   - Look for error messages

4. **Test API endpoints directly:**
   ```bash
   curl https://your-server.vercel.app/api/health
   curl https://your-server.vercel.app/api/stations
   
   # Should return data, not 404
   ```

### Issue: API calls work locally but fail in production
**Symptoms:**
- Local dev works fine
- Production throws CORS or network errors
- DevTools shows requests to wrong URL

**Solutions:**

1. **Check `VITE_API_BASE_URL` in production:**
   ```bash
   # View source in browser (F12 → Sources)
   # Look for apiClient.js
   # Check API_BASE_URL value
   
   # Or check Vercel Build Logs
   # Should show: VITE_API_BASE_URL=https://your-server.vercel.app
   ```

2. **Verify both domains are correct:**
   - Client: `https://your-app.vercel.app`
   - Server: `https://your-server.vercel.app`
   - No trailing slashes!

3. **Check CORS_ORIGIN on server:**
   ```bash
   # Vercel Dashboard → Server Project → Environment Variables
   # CORS_ORIGIN must match client domain exactly
   # Example: CORS_ORIGIN=https://your-app.vercel.app
   ```

4. **Clear browser cache:**
   - DevTools → Network tab → "Disable cache" checkbox
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or open in incognito/private mode

### Issue: Database connection fails in production
**Symptoms:**
- Error: `Error connecting to database`
- Health check fails
- API returns 500 errors

**Solutions:**

1. **Check database credentials:**
   - Vercel Dashboard → Server Project → Environment Variables
   - Ensure all DB_* variables are set correctly
   - Check for typos or special characters

2. **Verify database is remote:**
   - Cannot use localhost in Vercel
   - Must use cloud database (AWS RDS, Railway, Supabase, etc.)
   - Get connection string from your database provider

3. **Test database connection:**
   - Use database client to connect directly
   - Verify credentials work outside of Vercel
   - Check if database is accessible from anywhere (firewall)

4. **Check database logs:**
   - Some providers show connection logs
   - Look for failed connection attempts
   - Verify IP whitelisting allows Vercel IPs

---

## 🔴 GitHub Integration Issues

### Issue: Vercel doesn't auto-deploy on GitHub push
**Symptoms:**
- Push to GitHub but Vercel doesn't trigger build
- Manual redeploy works but auto-deploy doesn't

**Solutions:**

1. **Check GitHub integration:**
   - Vercel Dashboard → Project → Settings → Git
   - Should show "Connected to GitHub"
   - Verify correct repo is linked

2. **Check branch setting:**
   - Settings → Git
   - "Production Branch" should be `main`
   - Ensure you're pushing to correct branch

3. **Reconnect if necessary:**
   - Settings → Git → "Disconnect"
   - Reconnect by re-importing project

4. **Check deployment logs:**
   - Vercel Dashboard → Deployments
   - Look for "Pushed from GitHub"
   - If not showing, integration may be broken

### Issue: "Cannot access private repository"
**Symptoms:**
- Vercel shows error: "You don't have access to this repository"
- Cannot import GitHub repo

**Solutions:**

1. **Check GitHub permissions:**
   - Vercel needs permission to access your repo
   - Vercel Dashboard → Settings → Connected Accounts
   - Re-authorize GitHub if needed

2. **Check if repo is private:**
   - Private repos need special setup
   - Ensure Vercel GitHub App is installed for private repos
   - GitHub → Settings → Applications → Vercel → Repository access

---

## 🟡 Performance Issues

### Issue: Slow API responses
**Symptoms:**
- API calls take 5+ seconds to complete
- Network tab shows slow responses

**Solutions:**

1. **Check server performance:**
   ```bash
   curl -w "@curl-format.txt" -o /dev/null -s https://your-server.vercel.app/api/health
   # Shows timing breakdown
   ```

2. **Optimize database queries:**
   - Use indexes for frequently searched columns
   - Avoid N+1 queries
   - Cache results when appropriate

3. **Enable gzip compression:**
   - Already enabled in Express by default
   - Check if client is receiving compressed responses

4. **Use CDN for static assets:**
   - Vercel includes Vercel Edge Network
   - No additional configuration needed

### Issue: Large bundle size
**Symptoms:**
- Client takes long time to load
- DevTools shows large JS bundle

**Solutions:**

1. **Check bundle size:**
   ```bash
   npm run build --prefix client
   ls -lh client/dist/
   ```

2. **Use code splitting:**
   - React Router already does this with lazy loading
   - Check pages load lazily

3. **Remove unused dependencies:**
   ```bash
   npm ls --prefix client
   # Look for unused packages
   npm uninstall package-name --prefix client
   ```

---

## 🟢 Debugging Tips

### Enable Debug Logging

**Client (React):**
```javascript
// In apiClient.js
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add detailed logging
apiClient.interceptors.request.use(request => {
  console.log('Starting Request', {
    url: request.url,
    baseURL: API_BASE_URL,
    method: request.method,
    data: request.data
  });
  return request;
});

apiClient.interceptors.response.use(response => {
  console.log('Response:', {
    status: response.status,
    data: response.data
  });
  return response;
});
```

**Server (Node.js):**
```javascript
// In server/index.js
app.use((req, res, next) => {
  console.log('Incoming Request:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    corsOrigin: process.env.CORS_ORIGIN
  });
  next();
});
```

### Browser DevTools Tips

1. **Network Tab:**
   - Filter by "XHR" to see API requests
   - Click request to see headers and response
   - Check "Origin" and "Access-Control-Allow-Origin"

2. **Console Tab:**
   - Look for error messages
   - Check logged VITE_API_BASE_URL value
   - Look for uncaught exceptions

3. **Application Tab:**
   - Check local storage for any stored tokens
   - Verify environment variables if stored

4. **Sources Tab:**
   - View apiClient.js to verify API_BASE_URL
   - Set breakpoints in API calls for debugging

---

## 📝 Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Express.js Docs](https://expressjs.com)
- [Vite Docs](https://vitejs.dev)
- [Axios Docs](https://axios-http.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [CORS Explanation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Last Updated:** May 23, 2024  
**Version:** 1.0
