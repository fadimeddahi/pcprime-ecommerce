# Network Tab Debugging - Step by Step

## 🎯 How to Find the Exact Error

### **Step 1: Open Developer Tools**
- Windows/Linux: Press `F12`
- Mac: Press `Cmd + Option + I`

### **Step 2: Go to Network Tab**
- Click the **Network** tab at the top

### **Step 3: Reproduce the Error**
1. Clear existing network requests (click the trash icon)
2. Click "Login" button on your website
3. Enter test data:
   - Email: `test@example.com`
   - Password: `password123`
4. Click "SE CONNECTER"

### **Step 4: Find Failed Request**
- Look for a red request that says **400**
- It will be labeled `/users/register` or `/otp/send`

### **Step 5: Click on Failed Request**
- You'll see request details on the right

---

## 📍 What to Look For

### **In the Headers Tab:**
```
POST /users/register HTTP/1.1
Host: pcprimedz.onrender.com
Content-Type: application/json
```

### **In the Request Tab (or Request Body):**
You should see what was sent:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**COPY THIS** - It's important for debugging!

### **In the Response Tab:**
Look for the error message. Common responses:

**Example 1 - Validation Error:**
```json
{
  "error": "validation failed",
  "message": "email is required"
}
```

**Example 2 - Field Name Error:**
```json
{
  "error": "unknown field: username"
}
```

**Example 3 - Database Error:**
```json
{
  "error": "database connection failed"
}
```

**Example 4 - Backend Not Ready:**
```
<html>500 Internal Server Error</html>
```

---

## 🔍 Analyzing Different 400 Errors

### **Scenario 1: Backend Endpoint Doesn't Exist**
**Symptom:** 404 error (not found)
```
GET /otp/send 404 Not Found
```
**Solution:** Endpoint needs to be implemented on backend

---

### **Scenario 2: Request Body Format Wrong**
**Symptom:** 400 Bad Request
**Response:**
```json
{
  "error": "invalid request body",
  "details": "json parse error"
}
```
**Solution:** Check field names match backend expectations

---

### **Scenario 3: Missing Required Fields**
**Symptom:** 400 Bad Request
**Response:**
```json
{
  "error": "validation error",
  "message": "email field is required"
}
```
**Solution:** Make sure all required fields are sent

---

### **Scenario 4: Email Already Exists**
**Symptom:** 400 Bad Request
**Response:**
```json
{
  "error": "email already registered"
}
```
**Solution:** Use a different email or clear backend database

---

### **Scenario 5: Backend Not Running**
**Symptom:** Timeout or CORS error
**Response:**
```
Failed to fetch - CORS policy
```
**Solution:** Backend server needs to be started

---

## 📋 Copy-Paste Error Report Template

Once you see the error, prepare this information:

```
ENDPOINT: /users/register (or /otp/send)
HTTP STATUS: 400
REQUEST BODY:
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

RESPONSE BODY:
{
  "error": [PASTE THE EXACT ERROR HERE]
}

RESPONSE HEADERS:
Content-Type: [PASTE HERE]
```

---

## 🎬 Real Example Walkthrough

### **What You'll See:**

**Network Tab View:**
```
Name                Method  Status  Type
↓ users/register    POST    400     xhr
  otp/send          POST    400     xhr
```

**Click on users/register:**
```
┌─────────────────────────────────────┐
│ Headers | Payload | Response | ...  │
└─────────────────────────────────────┘

Payload Tab Shows:
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

Response Tab Shows:
{
  "error": "validation failed: username must be at least 3 characters"
}
```

---

## ✅ What Success Looks Like

When the endpoint works, you'll see:
```
Name                Method  Status  Type
users/register      POST    200     xhr
```

And in the Response tab:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

---

## 🔧 Enable Console Logging

The frontend now logs errors. Open the **Console** tab to see:

```
API Error [400] /users/register:
{
  status: 400,
  statusText: "Bad Request",
  body: '{"username":"testuser",...}',
  response: { error: "validation failed", ... }
}
```

---

## 📸 Screenshots to Share

When reporting the issue, share:
1. **Network tab** - Showing the 400 error
2. **Payload tab** - Showing what was sent
3. **Response tab** - Showing the error message
4. **Console tab** - Showing logged errors

This helps backend team identify the issue quickly!

---

## 🆘 Still Stuck?

1. **Share the Response body** from the 400 error
2. **Check backend logs** - Backend should log what's wrong
3. **Test with Postman** - Send same request directly to see error
4. **Ask backend team** - They can check server logs

Most 400 errors are validation errors that the backend log will explain!
