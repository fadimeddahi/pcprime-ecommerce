# OTP & Auth API - 400 Error Debugging Guide

## 🔴 Current Issues

You're seeing 400 Bad Request errors:
```
POST https://pcprimedz.onrender.com/users/register 400 (Bad Request)
POST https://pcprimedz.onrender.com/otp/send 400 (Bad Request)
```

This means the backend is rejecting the request format or data.

---

## 🔍 Debugging Steps

### **Step 1: Check Browser Console**
1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Look for detailed error messages
4. Go to **Network** tab
5. Click on the failed request
6. Check the **Response** tab for error details from server

---

## 📊 What the Backend Expects

Based on your backend code, verify these endpoints exist and work:

### **Registration Endpoint**
```bash
POST /users/register
Content-Type: application/json

{
  "username": "string",
  "email": "user@example.com", 
  "password": "string"
}
```

**Expected Response (200):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 123,
    "username": "john_doe",
    "email": "user@example.com"
  }
}
```

### **Login Endpoint**
```bash
POST /users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "string"
}
```

**Expected Response (200):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 123,
    "username": "john_doe",
    "email": "user@example.com"
  }
}
```

### **OTP Send Endpoint**
```bash
POST /otp/send
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Expected Response (200):**
```json
{
  "message": "OTP sent successfully",
  "email": "user@example.com"
}
```

### **OTP Verify Endpoint**
```bash
POST /otp/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

**Expected Response (200):**
```json
{
  "message": "OTP verified",
  "verified": true,
  "token": "jwt_token_here",
  "user": {
    "id": 123,
    "email": "user@example.com"
  }
}
```

---

## ✅ Frontend Code is Correct

Your frontend code is sending the correct format:

```typescript
// Registration - CORRECT ✅
await authApi.register({
  username: "john_doe",
  email: "user@example.com",
  password: "password123"
})

// Login - CORRECT ✅
await authApi.login({
  email: "user@example.com",
  password: "password123"
})

// OTP Send - CORRECT ✅
await otpApi.sendOTP({
  email: "user@example.com"
})

// OTP Verify - CORRECT ✅
await otpApi.verifyOTP({
  email: "user@example.com",
  code: "123456"
})
```

---

## 🛠️ Common 400 Error Causes

### **1. Backend Endpoint Not Implemented**
- ❌ The `/otp/send`, `/otp/verify` endpoints might not exist on backend
- ✅ **Solution**: Check if OTP endpoints are deployed to `https://pcprimedz.onrender.com`

### **2. Validation Error**
- ❌ Backend expects different field names or format
- ✅ **Solution**: Check backend code for exact field names expected

### **3. Database Connection**
- ❌ Backend can't connect to database
- ✅ **Solution**: Check if backend is running and database is accessible

### **4. CORS Issues**
- ❌ Backend might not allow cross-origin requests
- ✅ **Solution**: Check backend CORS configuration

### **5. Request Body Empty**
- ❌ JSON.stringify() might be failing silently
- ✅ **Solution**: Check Network tab → Request body

---

## 🧪 Test Endpoints with cURL

Test directly to see if backend is working:

```bash
# Test Registration
curl -X POST https://pcprimedz.onrender.com/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123"
  }'

# Test Login
curl -X POST https://pcprimedz.onrender.com/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'

# Test OTP Send
curl -X POST https://pcprimedz.onrender.com/otp/send \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

---

## 📋 Checklist to Fix

- [ ] **Check Backend Logs** - See what error the backend is returning
- [ ] **Verify Endpoints Exist** - Ensure `/otp/send` and `/otp/verify` are deployed
- [ ] **Check Database** - Is the database connected and running?
- [ ] **Test with cURL** - Run the curl commands above to see actual error
- [ ] **Check CORS** - Is backend accepting requests from your frontend?
- [ ] **Review Request Format** - Open Network tab and check what's being sent
- [ ] **Check Backend Code** - Review the Go backend for validation rules
- [ ] **Test with Postman** - Use Postman to test endpoints independently

---

## 🔧 Quick Fixes to Try

### **Option 1: Add More Detailed Error Logging**

The frontend already has console logs added. Run these tests:

1. Open browser console (F12)
2. Click login and enter test email: `test@example.com`
3. Password: `password123`
4. Watch the console output
5. **Report the exact error message** from the Response tab

### **Option 2: Check if Endpoints are Live**

```typescript
// Add this to test if endpoint is reachable
async function testEndpoint() {
  try {
    const response = await fetch('https://pcprimedz.onrender.com/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    });
    console.log('Status:', response.status);
    console.log('Response:', await response.json());
  } catch(e) {
    console.error('Error:', e);
  }
}
testEndpoint();
```

### **Option 3: Verify Backend is Running**

Test a working endpoint first:
```bash
# This should work if backend is running
curl https://pcprimedz.onrender.com/products/all
```

---

## 📝 What to Report to Backend Team

When reporting the 400 error, provide:

1. **Exact endpoint**: `/otp/send` or `/users/register`
2. **Request body sent**: (from Network tab)
3. **Response body received**: (from Network tab → Response)
4. **Backend error message**: (if any)
5. **When it started**: Was it working before?

---

## ✨ Once Backend is Fixed

Once the backend returns 200 instead of 400, everything will work:
- ✅ Login will work
- ✅ Registration will work
- ✅ OTP will send
- ✅ OTP will verify
- ✅ User will be authenticated

---

## 🎯 Immediate Action Items

### **For Backend Developer:**
1. Check if `/otp/send` endpoint is deployed
2. Check if `/otp/verify` endpoint is deployed
3. Review backend logs for 400 error reason
4. Verify request validation is correct
5. Test endpoints with Postman/cURL

### **For Frontend (You):**
1. Open browser Network tab
2. Reproduce the 400 error
3. Check the Response body for error message
4. Share that error message with backend team
5. Once fixed, test the flow again

---

## 🆘 Need Help?

Check the Network Response for the exact backend error, which usually looks like:
```json
{
  "error": "validation failed",
  "details": "email field missing"
}
```

Share that error message for accurate debugging!
