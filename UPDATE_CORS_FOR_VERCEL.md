# Update Backend CORS for Vercel Admin Deployment

After deploying the admin panel to Vercel, you need to update the backend CORS configuration to allow requests from your Vercel deployment URL.

## Current CORS Configuration

Your backend currently only allows local development origins:

```typescript
// backend/src/main.ts
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002', 
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:8080'
];
```

## Required Update

You need to add your Vercel deployment URL(s) to the allowed origins.

### Option 1: Add Specific Vercel URL

If you know your Vercel deployment URL:

```typescript
// backend/src/main.ts
const allowedOrigins = [
  // Development origins
  'http://localhost:3000',
  'http://localhost:3002', 
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:8080',
  
  // Production admin panel (replace with your actual Vercel URL)
  'https://your-admin.vercel.app',
  
  // If you have a custom domain
  'https://admin.yourdomain.com'
];
```

### Option 2: Allow All Vercel Preview Deployments (Recommended)

This allows both production and preview deployments:

```typescript
// backend/src/main.ts
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      // Development origins
      'http://localhost:3000',
      'http://localhost:3002', 
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:8080'
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } 
    // Allow all Vercel deployments
    else if (origin.endsWith('.vercel.app')) {
      callback(null, true);
    }
    // Allow your custom domain (if applicable)
    else if (origin === 'https://admin.yourdomain.com') {
      callback(null, true);
    }
    else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'user-id', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400, // 24 hours
});
```

### Option 3: Use Environment Variables (Most Flexible)

Create environment variables for allowed origins:

```typescript
// backend/src/main.ts
app.enableCors({
  origin: (origin, callback) => {
    // Base allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3002', 
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:8080'
    ];
    
    // Add production origins from environment variables
    if (process.env.ADMIN_URL) {
      allowedOrigins.push(process.env.ADMIN_URL);
    }
    
    if (process.env.CUSTOM_DOMAIN) {
      allowedOrigins.push(process.env.CUSTOM_DOMAIN);
    }
    
    // Allow requests with no origin
    if (!origin) return callback(null, true);
    
    // Check allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } 
    // Allow all Vercel deployments in production
    else if (process.env.NODE_ENV === 'production' && origin.endsWith('.vercel.app')) {
      callback(null, true);
    }
    else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'user-id', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
});
```

Then set environment variables in your backend deployment:
```
ADMIN_URL=https://your-admin.vercel.app
CUSTOM_DOMAIN=https://admin.yourdomain.com
NODE_ENV=production
```

## Steps to Update

1. **Edit the file**: Open `backend/src/main.ts`

2. **Update CORS configuration**: Choose one of the options above

3. **Rebuild the backend** (if necessary):
   ```bash
   cd backend
   npm run build
   ```

4. **Redeploy your backend**: Depending on where your backend is hosted:
   - **Vercel**: Push to GitHub (auto-deploys) or run `vercel --prod`
   - **Railway**: Push to GitHub or deploy via CLI
   - **Render**: Push to GitHub (auto-deploys)
   - **Heroku**: `git push heroku main`
   - **Manual**: Restart your backend service

5. **Test the connection**: 
   - Visit your admin panel
   - Open browser console (F12)
   - Try logging in
   - Check for CORS errors

## Verifying CORS Update

After updating, test the connection:

1. Open your admin panel in browser
2. Open Developer Tools (F12) → Console
3. Try logging in
4. Check for errors:
   - ✅ **No CORS errors**: Configuration is correct
   - ❌ **CORS error**: Check the origin in the error message and ensure it's in allowedOrigins

## Common Issues

### Issue: Still getting CORS errors after update

**Possible causes:**
1. Backend wasn't redeployed after code change
2. Origin URL doesn't match exactly (http vs https, trailing slash, etc.)
3. Browser cached old CORS policy

**Solutions:**
1. Verify backend redeployed successfully
2. Check exact URL in error message and add it to allowedOrigins
3. Clear browser cache or try incognito mode

### Issue: Works in development but not production

**Cause:** Vercel URL not in allowedOrigins

**Solution:** Add your Vercel URL to allowedOrigins or use Option 2/3 above

### Issue: Preview deployments don't work

**Cause:** Each Vercel preview has a unique URL

**Solution:** Use Option 2 to allow all `*.vercel.app` domains

## Security Considerations

### Option 1 (Specific URLs)
- ✅ Most secure
- ✅ Explicit control over allowed origins
- ❌ Need to update for each new deployment
- ❌ Preview deployments won't work

### Option 2 (All Vercel domains)
- ✅ Works with all preview deployments
- ✅ Easy to maintain
- ⚠️ Any Vercel deployment can access your API
- ✓ Acceptable for most internal tools

### Option 3 (Environment variables)
- ✅ Flexible and maintainable
- ✅ Different configs for different environments
- ✅ Easy to update without code changes
- ✅ Recommended for production

## Recommended Approach

For most projects, we recommend **Option 3** (environment variables) for production:

1. Allows specific control over production origins
2. Easy to update without code deployment
3. Different configs for dev/staging/production
4. Can still allow all Vercel domains in production for previews

## Need Help?

If you continue to have CORS issues:

1. Check browser console for exact error message
2. Verify the origin URL in the error matches your Vercel URL
3. Ensure backend was redeployed after changes
4. Test backend directly with curl to verify it's running:
   ```bash
   curl https://your-backend-api.vercel.app/api/health
   ```

## After CORS Update

Once CORS is configured correctly:

1. ✅ Admin panel can login
2. ✅ Dashboard loads data
3. ✅ CRUD operations work
4. ✅ No CORS errors in console

---

**Important:** Always redeploy your backend after making CORS configuration changes!
