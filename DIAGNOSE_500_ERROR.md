# Diagnosing 500 Internal Server Error

## Current Situation

The frontend is successfully reaching Vercel, and Vercel is proxying requests to your backend at `http://139.59.2.43:5009`, but the backend is returning a 500 error.

## Step 1: Check Backend Logs

**This is the most important step!** The backend logs will show exactly what's causing the 500 error.

Look for these log messages in your backend console:
- `❌ [ExceptionFilter] Error caught:` - Shows the full error
- `❌ [AuthController] Login error:` - Shows auth-specific errors
- `❌ [AuthService] Login error:` - Shows service-level errors
- `❌ [JwtService] Error generating token:` - Shows JWT errors

## Step 2: Test Backend Connectivity

### Test 1: Health Check Endpoint
```bash
curl http://139.59.2.43:5009/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123.45,
  "environment": "production"
}
```

### Test 2: Test Proxy Endpoint
```bash
curl http://139.59.2.43:5009/api/test-proxy
```

### Test 3: Direct Login Test
```bash
curl -X POST http://139.59.2.43:5009/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'
```

## Step 3: Common Causes of 500 Errors

### 1. Database Connection Failure
**Symptoms**: Error mentions "Database", "ECONNREFUSED", or "ETIMEDOUT"

**Check**:
- Is the database server running?
- Are database credentials correct in environment variables?
- Can the backend server reach the database?

**Fix**: Check database connection string and ensure database is accessible.

### 2. Missing Environment Variables
**Symptoms**: Error mentions "JWT_SECRET" or undefined variables

**Check**: Ensure these environment variables are set:
- `JWT_SECRET` (or it will use default)
- Database connection variables
- `PORT` (defaults to 3001)

**Fix**: Set all required environment variables.

### 3. Invalid Password Format
**Symptoms**: Error during password comparison

**Check**: Are passwords in the database properly hashed with bcrypt?

**Fix**: Ensure passwords are hashed. The code handles both hashed and unhashed passwords, but hashed is preferred.

### 4. Missing Required Fields
**Symptoms**: Error accessing `staff.password` or `staff.business_email`

**Check**: Do all staff records have:
- `password` field (not null)
- `business_email` field (not null)
- `is_active` field set to 1

**Fix**: Update database records to include all required fields.

### 5. Backend Not Deployed with Latest Changes
**Symptoms**: Error messages don't match expected format

**Check**: Have you deployed the latest backend code with all the error handling improvements?

**Fix**: 
```bash
cd backend
npm run build
# Deploy to your server
```

## Step 4: Enable Detailed Error Logging

The exception filter now includes error details. To see full stack traces, set this environment variable:

```bash
INCLUDE_ERROR_STACK=true
```

Or check the backend logs directly - they always include full error details.

## Step 5: Verify Backend is Accessible from Vercel

Vercel's servers need to reach your backend. Test from an external location:

```bash
# From a different machine/network
curl http://139.59.2.43:5009/api/health
```

If this fails:
- Check firewall rules
- Ensure server binds to `0.0.0.0` not `127.0.0.1`
- Verify port 5009 is open

## Step 6: Check CORS Configuration

Even though we're using a proxy, check backend CORS logs for:
- `✅ [CORS] Allowing origin:` - Should show Vercel domain
- `❌ [CORS] Blocking origin:` - Should NOT appear

## Quick Diagnostic Checklist

- [ ] Backend server is running
- [ ] Backend is accessible from internet (test with curl)
- [ ] Backend logs show the actual error
- [ ] Database is connected and accessible
- [ ] Environment variables are set
- [ ] Latest backend code is deployed
- [ ] Health endpoint returns 200 OK
- [ ] Test proxy endpoint works

## Next Steps

1. **Check backend logs** - This will tell you exactly what's wrong
2. **Test endpoints** - Verify backend is working
3. **Check database** - Ensure it's connected and accessible
4. **Review error details** - The exception filter now includes more details

## Getting Help

If you're still stuck, share:
1. Backend console logs (especially `❌ [ExceptionFilter] Error caught:`)
2. Response from `/api/health` endpoint
3. Response from direct login test
4. Any database connection errors
