# Quick Test Instructions

## ⚡ Immediate Actions Required

### 1. Clear Browser Cache & Reload
```
Windows/Linux:  Ctrl + Shift + R
Mac:            Cmd + Shift + R
```

### 2. Close DevTools and Re-open
- Press F12 to open DevTools
- Clear any previous console logs

### 3. Test Login Again
1. Click "Login" button
2. Enter test credentials
3. **Look for these logs in console (in order):**

```
✅ Login response (raw): {...}
✅ Login response keys: ['token', 'uuid', 'username', 'email', 'role']
✅ Login response.uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
✅ Extracted ID from response: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
```

If you see these logs, the UUID extraction is working! ✨

---

## 🔍 What to Look For

### If UUID Found ✅
```
Extracted ID from response: bf1e2bf1-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Using extracted UUID: bf1e2bf1-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Final extracted user data: {id: 'UUID', email: '...', username: '...', user_id: 'UUID'}
```
→ **Next Step:** Proceed to OTP testing

### If UUID NOT Found ❌
```
Extracted ID from response: null
Attempting to extract user_id from JWT token...
Extracted user_id from JWT: null
No UUID found in response or JWT. Using email as identifier for OTP...
```
→ **Action Needed:** Check backend response structure

---

## 🧪 Full Test Flow

### Step 1: Login
1. Click "Login" modal
2. Enter email: `f_meddahi@estin.dz`
3. Enter password: (your password)
4. Click "Login"
5. **Check console for UUID extraction logs**

### Step 2: Send OTP
1. OTP modal appears
2. Email should be pre-filled: `f_meddahi@estin.dz`
3. Click "Send OTP"
4. **Check console:**
   - "Extracted userId from storage: 'UUID'"
   - "Sending OTP with user_id: 'UUID', email: 'f_meddahi@estin.dz'"

### Step 3: Enter OTP Code
1. Check your email for 6-digit code
2. Click on each digit field and enter the code
3. Timer should count down from 10:00
4. Click "Verify"

### Step 4: Verify Success
1. If code is correct, you should see success message
2. Modal closes and you're logged in

---

## 💡 Troubleshooting

### Q: Still seeing old console logs?
**A:** Clear browser cache completely:
- Chrome: Ctrl+Shift+Delete → Clear browsing data → All time
- Firefox: Ctrl+Shift+Delete → Clear Everything
- Safari: Develop → Empty Web Inspector Caches

Then refresh page.

### Q: UUID still showing as email?
**A:** Backend might not be returning `uuid` field. Check:
1. Backend response format
2. Response should have: `{token, uuid, username, email, role}`
3. Not: `{token, user: {id, ...}}`

### Q: OTP not being sent?
**A:** Check console errors:
- 400 Bad Request: Invalid user_id format or user not found
- 403 Forbidden: Auth token issue
- 500 Server Error: Backend issue

---

## 📊 Expected Response Format

Backend login response should look like:
```json
{
  "token": "eyJhbGc...",
  "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "username": "f_meddahi",
  "email": "f_meddahi@estin.dz",
  "role": "user"
}
```

✅ If you see this format, UUID extraction will work!

---

## 🎯 Success Criteria

- ✅ UUID shown in console logs
- ✅ OTP email sent successfully
- ✅ Can enter 6-digit code
- ✅ OTP verification succeeds
- ✅ Logged in successfully
