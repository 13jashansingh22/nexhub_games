# 🔐 STEP 2: Authentication Quick Test Guide

## ⚡ Quick Start Testing

### 1. **Start the Server**
```bash
cd backend
npm run dev
```

Expected output:
```
📡 Server running on: http://localhost:5000
🌍 Environment: development
📊 Database: Connected ✅
```

---

### 2. **Seed Test Data** (Optional)
```bash
npm run seed
```

This creates 4 test users with sample posts and follow relationships.

---

### 3. **Test Endpoints** (Choose one method)

#### **Method A: Using cURL** (Command line)

**Register New User:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "testuser@example.com",
    "password": "TestPassword123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123"
  }'
```

**Get Profile** (Replace TOKEN with token from login response):
```bash
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer eyJhbGc..."
```

---

#### **Method B: Using Postman**

1. **Download Postman:** https://www.postman.com/downloads/

2. **Create new request:**
   - Method: POST
   - URL: `http://localhost:5000/api/v1/auth/register`
   - Body → raw → JSON
   - Paste:
   ```json
   {
     "username": "testuser123",
     "email": "testuser@example.com",
     "password": "TestPassword123",
     "firstName": "Test",
     "lastName": "User"
   }
   ```
   - Click **Send**

3. **Login Request:**
   - Method: POST
   - URL: `http://localhost:5000/api/v1/auth/login`
   - Body:
   ```json
   {
     "email": "testuser@example.com",
     "password": "TestPassword123"
   }
   ```
   - Click **Send**

4. **Copy the accessToken** from response
   - Create new request
   - Method: GET
   - URL: `http://localhost:5000/api/v1/auth/profile`
   - Headers → Add:
     - Key: `Authorization`
     - Value: `Bearer <paste-token-here>`
   - Click **Send**

---

#### **Method C: Using VS Code REST Client Extension**

1. **Install Extension:**
   - Open VS Code
   - Click Extensions (Ctrl+Shift+X)
   - Search "REST Client"
   - Click Install

2. **Create file:** `test.http` (in backend folder)

3. **Paste this:**
```http
### Register User
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "username": "testuser123",
  "email": "testuser@example.com",
  "password": "TestPassword123",
  "firstName": "Test",
  "lastName": "User"
}

### Login
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "TestPassword123"
}

### Get Profile (replace TOKEN)
GET http://localhost:5000/api/v1/auth/profile
Authorization: Bearer TOKEN_HERE
```

4. **Click "Send Request"** above each test

---

## 🧪 All Test Cases

### Test Case 1: Register with Valid Data ✅
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```
**Expected:** 201 Created, tokens returned

---

### Test Case 2: Register with Existing Email ❌
```json
{
  "username": "different_user",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
**Expected:** 409 Conflict, "Email already registered"

---

### Test Case 3: Register with Weak Password ❌
```json
{
  "username": "test_user",
  "email": "test@example.com",
  "password": "weak"
}
```
**Expected:** 400 Bad Request, validation errors

---

### Test Case 4: Login with Valid Credentials ✅
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
**Expected:** 200 OK, tokens and user data

---

### Test Case 5: Login with Wrong Password ❌
```json
{
  "email": "john@example.com",
  "password": "WrongPassword123"
}
```
**Expected:** 401 Unauthorized, "Invalid email or password"

---

### Test Case 6: Get Profile Without Token ❌
**Headers:** (no Authorization header)

**Expected:** 401 Unauthorized, "No authentication token provided"

---

### Test Case 7: Update Profile ✅
**Method:** PUT
**URL:** `/api/v1/auth/profile`
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "bio": "I love NexMeet!",
  "location": "San Francisco",
  "website": "https://johndoe.com"
}
```
**Expected:** 200 OK, updated user data

---

### Test Case 8: Change Password ✅
**Method:** POST
**URL:** `/api/v1/auth/change-password`
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "currentPassword": "SecurePass123",
  "newPassword": "NewPassword456"
}
```
**Expected:** 200 OK, "Password changed successfully"

---

### Test Case 9: Forgot Password ✅
**Method:** POST
**URL:** `/api/v1/auth/forgot-password`
**Body:**
```json
{
  "email": "john@example.com"
}
```
**Expected:** 200 OK, "Check your email for reset link"

---

### Test Case 10: Google OAuth Login ✅
**Method:** POST
**URL:** `/api/v1/auth/google`
**Body:**
```json
{
  "googleId": "110123456789",
  "email": "user@gmail.com",
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/..."
}
```
**Expected:** 200 OK, new/existing user with tokens

---

## 📊 Seed Data Test Users

If you ran `npm run seed`, use these to test:

```
User 1:
- Email: alex@example.com
- Username: alex_developer
- Password: TestPassword123
- Points: 1500, Level: 5

User 2:
- Email: sarah@example.com
- Username: sarah_gamer
- Password: TestPassword123
- Points: 3200, Level: 8

User 3:
- Email: mike@example.com
- Username: mike_creative
- Password: TestPassword123
- Points: 2100, Level: 6

User 4:
- Email: lisa@example.com
- Username: lisa_explorer
- Password: TestPassword123
- Points: 2800, Level: 7
```

---

## 🔍 Response Examples

### Successful Registration
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "points": 0,
      "level": 1,
      "isVerified": false,
      "followers": [],
      "following": []
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "message": "Please verify your email to unlock all features"
  }
}
```

### Successful Login
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "username": "john_doe",
      "email": "john@example.com",
      "points": 150,
      "level": 2,
      "badges": ["first_post"],
      "followers": ["user_2"],
      "following": ["user_3"]
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### Validation Error
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address",
      "value": "invalid-email"
    },
    {
      "field": "password",
      "message": "Password must contain at least one uppercase letter",
      "value": "testpassword123"
    }
  ]
}
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 - "No auth token" | Add `Authorization: Bearer <token>` header |
| 409 - "Email already exists" | Use different email or login instead |
| Connection refused | Make sure server is running: `npm run dev` |
| 400 - Validation error | Check password requirements (6+ chars, uppercase, number) |
| MongoDB error | Check `.env` MONGODB_URI is correct |

---

## 📊 Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/register` | ❌ | Create account |
| POST | `/login` | ❌ | Get tokens |
| POST | `/refresh` | ❌ | New access token |
| POST | `/forgot-password` | ❌ | Reset flow |
| POST | `/reset-password` | ❌ | Complete reset |
| POST | `/verify-email` | ❌ | Verify email |
| POST | `/google` | ❌ | OAuth login |
| GET | `/profile` | ✅ | Get user data |
| PUT | `/profile` | ✅ | Update profile |
| POST | `/change-password` | ✅ | Change pwd |
| POST | `/send-verification-email` | ✅ | Resend email |
| POST | `/logout` | ✅ | Logout |

---

## ✨ Testing Completed

When all tests pass, you've verified:
- ✅ User registration works
- ✅ Login authentication works
- ✅ JWT tokens generated
- ✅ Protected routes secure
- ✅ Password validation
- ✅ Email verification ready
- ✅ Profile management works

---

**All STEP 2 Features Working!** ✅

Ready for STEP 3? Reply with **"next"**
