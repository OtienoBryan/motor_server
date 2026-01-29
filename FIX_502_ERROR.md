# Fixing 502 Bad Gateway Error

## Error: `ROUTER_EXTERNAL_TARGET_CONNECTION_ERROR`

This error means **Vercel cannot connect to your backend server** at `http://139.59.2.43:5009`.

## Root Causes

### 1. Backend Not Listening on All Interfaces ❌

**Problem**: Backend is listening on `localhost` (127.0.0.1) which only accepts local connections.

**Solution**: Backend must listen on `0.0.0.0` to accept external connections.

**Check**: Look at your backend startup logs. If you see:
```
🚀 Server running on http://localhost:5009
```

It should be:
```
🚀 Server running on http://0.0.0.0:5009
```

**Fix**: The code has been updated to listen on `0.0.0.0` by default. Set environment variable:
```bash
HOST=0.0.0.0
PORT=5009
```

### 2. Port Mismatch ❌

**Problem**: Backend might be running on port 3001, but Vercel is trying to connect to port 5009.

**Check**: Verify which port your backend is actually using:
```bash
# On your server
netstat -tuln | grep 5009
# or
ss -tuln | grep 5009
```

**Fix**: Ensure backend is running on port 5009:
```bash
PORT=5009 npm start
```

### 3. Firewall Blocking Connections ❌

**Problem**: Firewall is blocking inbound connections on port 5009.

**Check**: Test from external machine:
```bash
# From a different machine/network
curl http://139.59.2.43:5009/api/health
```

**Fix**: Open port 5009 in firewall:
```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 5009/tcp

# CentOS/RHEL (firewalld)
sudo firewall-cmd --add-port=5009/tcp --permanent
sudo firewall-cmd --reload

# iptables
sudo iptables -A INPUT -p tcp --dport 5009 -j ACCEPT
```

### 4. Backend Server Not Running ❌

**Problem**: Backend server is not running or crashed.

**Check**: 
```bash
# Check if process is running
ps aux | grep node
# or
systemctl status your-backend-service
```

**Fix**: Start the backend server:
```bash
cd backend
npm start
# or
pm2 start dist/main.js
# or
systemctl start your-backend-service
```

### 5. Backend Not Publicly Accessible ❌

**Problem**: Server is behind NAT/router and IP `139.59.2.43` is not publicly routable.

**Check**: The IP `139.59.2.43` should be publicly accessible. Test:
```bash
# From external network
ping 139.59.2.43
curl http://139.59.2.43:5009/api/health
```

**Fix**: 
- Ensure server has public IP
- Configure port forwarding if behind router
- Or use a different deployment method (see alternatives below)

## Quick Diagnostic Steps

1. **Check backend is running**:
   ```bash
   curl http://localhost:5009/api/health
   ```

2. **Check backend listens on correct interface**:
   ```bash
   netstat -tuln | grep 5009
   # Should show: 0.0.0.0:5009 (not 127.0.0.1:5009)
   ```

3. **Test from external network**:
   ```bash
   # From different machine
   curl http://139.59.2.43:5009/api/health
   ```

4. **Check firewall**:
   ```bash
   sudo ufw status
   # or
   sudo firewall-cmd --list-all
   ```

5. **Check backend logs**:
   Look for startup message showing host and port.

## Environment Variables

Set these on your backend server:

```bash
# .env file or environment variables
HOST=0.0.0.0          # Listen on all interfaces
PORT=5009             # Match the port in vercel.json
NODE_ENV=production
```

## Updated Code

The backend code has been updated to:
- Listen on `0.0.0.0` by default (accessible from external networks)
- Use port 5009 by default (matching vercel.json)
- Log the correct URL for verification

## After Fixing

1. **Restart backend server**
2. **Verify it's accessible**:
   ```bash
   curl http://139.59.2.43:5009/api/health
   ```
3. **Test from Vercel**: Try logging in again

## Alternative Solutions

If you cannot make the backend publicly accessible:

### Option 1: Use VITE_API_BASE_URL Directly
Set `VITE_API_BASE_URL` in Vercel to point directly to backend (if backend is publicly accessible):
```
VITE_API_BASE_URL=http://139.59.2.43:5009/api
```

Then remove the rewrite from `vercel.json`.

### Option 2: Use a Cloud Proxy/Tunnel
- **Cloudflare Tunnel**: Free, secure tunnel to your backend
- **ngrok**: Quick tunnel for testing
- **VPS with public IP**: Deploy backend on a VPS

### Option 3: Deploy Backend to Vercel
Deploy your NestJS backend to Vercel as serverless functions, then update `vercel.json` to point to the Vercel backend URL.

## Verification Checklist

- [ ] Backend is running
- [ ] Backend listens on `0.0.0.0:5009` (not `localhost`)
- [ ] Port 5009 is open in firewall
- [ ] Backend is accessible from external network
- [ ] `curl http://139.59.2.43:5009/api/health` works
- [ ] Backend logs show correct host and port
- [ ] Environment variables are set correctly
