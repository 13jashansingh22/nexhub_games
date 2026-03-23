# 📚 NexMeet API Documentation - STEP 1 Complete

## Overview

This document outlines the complete API structure for NexMeet. **STEP 1** focuses on backend setup, database configuration, and foundation. Actual endpoint implementations begin in **STEP 2**.

---

## API Base URL

```
Development: http://localhost:5000/api/v1
Production: https://api.nexmeet.com/api/v1
```

---

## Response Format

All API responses follow this standard format:

### Success Response (2xx)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response payload
  }
}
```

### Error Response (4xx, 5xx)
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Error description",
  "details": {} // Only in development
}
```

---

## Authentication

### JWT Token

Tokens are sent in the `Authorization` header:

```
Authorization: Bearer <token>
```

**Token Structure:**
```javascript
{
  userId: "user_id",
  role: "user|moderator|admin",
  iat: 1234567890
}
```

**Token Expiry:** 7 days (configurable)

---

## Available Endpoints (Coming Soon)

### 🔐 Authentication
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | ⏳ STEP 2 | Register new user |
| POST | `/auth/login` | ⏳ STEP 2 | Authenticate user |
| POST | `/auth/logout` | ⏳ STEP 2 | Logout user |
| POST | `/auth/refresh` | ⏳ STEP 2 | Refresh token |
| POST | `/auth/google` | ⏳ STEP 2 | Google OAuth |
| POST | `/auth/verify-email` | ⏳ STEP 2 | Verify email |
| POST | `/auth/forgot-password` | ⏳ STEP 2 | Request password reset |
| POST | `/auth/reset-password` | ⏳ STEP 2 | Reset password |

### 📝 Posts/Feed
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/posts` | ⏳ STEP 3 | Get feed |
| POST | `/posts` | ⏳ STEP 3 | Create post |
| GET | `/posts/:id` | ⏳ STEP 3 | Get single post |
| PUT | `/posts/:id` | ⏳ STEP 3 | Update post |
| DELETE | `/posts/:id` | ⏳ STEP 3 | Delete post |
| POST | `/posts/:id/like` | ⏳ STEP 3 | Like post |
| DELETE | `/posts/:id/like` | ⏳ STEP 3 | Unlike post |
| GET | `/posts/:id/comments` | ⏳ STEP 3 | Get comments |
| POST | `/posts/:id/comments` | ⏳ STEP 3 | Add comment |
| POST | `/posts/:id/share` | ⏳ STEP 3 | Share post |

### 💬 Comments
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| PUT | `/comments/:id` | ⏳ STEP 3 | Edit comment |
| DELETE | `/comments/:id` | ⏳ STEP 3 | Delete comment |
| POST | `/comments/:id/like` | ⏳ STEP 3 | Like comment |
| DELETE | `/comments/:id/like` | ⏳ STEP 3 | Unlike comment |
| POST | `/comments/:id/reply` | ⏳ STEP 3 | Reply to comment |

### 👥 Users
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/users/:id` | ⏳ STEP 2/3 | Get user profile |
| PUT | `/users/:id` | ⏳ STEP 2/3 | Update profile |
| GET | `/users/:id/posts` | ⏳ STEP 3 | Get user posts |
| GET | `/users/:id/followers` | ⏳ STEP 3 | Get followers |
| GET | `/users/:id/following` | ⏳ STEP 3 | Get following |
| POST | `/users/:id/follow` | ⏳ STEP 3 | Follow user |
| DELETE | `/users/:id/follow` | ⏳ STEP 3 | Unfollow user |
| GET | `/users/search` | ⏳ STEP 3 | Search users |
| GET | `/users/:id/suggestions` | ⏳ STEP 3 | Get follow suggestions |

### 🎮 Games
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/games` | ✅ STEP 4A | List all games |
| GET | `/games/:slug` | ✅ STEP 4A | Get game info |
| POST | `/games/:slug/start` | ✅ STEP 4A | Start game session |
| POST | `/games/:slug/submit-score` | ✅ STEP 4A | Submit score |
| GET | `/games/player/:userId/history` | ✅ STEP 4A | Get game history |
| POST | `/games/:gameType/invite` | ⏳ STEP 4 | Invite to multiplayer |
| GET | `/games/:gameType/active` | ⏳ STEP 4 | Get active games |

### 🏆 Leaderboard
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/leaderboard` | ✅ STEP 1 Foundation | Global leaderboard |
| GET | `/leaderboard/:gameSlug` | ✅ STEP 1 Foundation | Game leaderboard |
| GET | `/leaderboard/friends` | ⏳ STEP 5 | Friends leaderboard |
| GET | `/leaderboard/:period` | ⏳ STEP 5 | Time-based leaderboard |
| GET | `/leaderboard/:gameSlug/user/:userId` | ✅ STEP 1 Foundation | User rank |

### 📊 Game Stats
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/stats/platform` | ✅ STEP 1 Foundation | Platform-level stats |
| GET | `/stats/games/:gameSlug` | ✅ STEP 1 Foundation | Per-game stats |

### 💬 Messages/Chat
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/messages` | ⏳ STEP 6 | Get conversations |
| GET | `/messages/:userId` | ⏳ STEP 6 | Get conversation |
| POST | `/messages` | ⏳ STEP 6 | Send message |
| PUT | `/messages/:id` | ⏳ STEP 6 | Edit message |
| DELETE | `/messages/:id` | ⏳ STEP 6 | Delete message |
| POST | `/messages/:id/read` | ⏳ STEP 6 | Mark as read |
| POST | `/messages/:id/reaction` | ⏳ STEP 6 | Add reaction |

### 🔔 Notifications
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/notifications` | ⏳ STEP 3/7 | Get notifications |
| PUT | `/notifications/:id/read` | ⏳ STEP 3/7 | Mark as read |
| DELETE | `/notifications/:id` | ⏳ STEP 3/7 | Delete notification |
| PUT | `/notifications/read-all` | ⏳ STEP 3/7 | Mark all as read |

### 🛡️ Admin
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/admin/users` | ⏳ FUTURE | List users |
| PUT | `/admin/users/:id/ban` | ⏳ FUTURE | Ban user |
| PUT | `/admin/users/:id/suspend` | ⏳ FUTURE | Suspend user |
| GET | `/admin/reports` | ⏳ FUTURE | Get reports |
| GET | `/admin/analytics` | ⏳ FUTURE | Get analytics |

### ⚡ System
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/health` | ✅ STEP 1 | Server health |
| GET | `/` | ✅ STEP 1 | API info |

---

## Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `UNAUTHORIZED` | 401 | Missing/invalid authentication |
| `FORBIDDEN` | 403 | Access denied |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

---

## Request Rate Limits

- **Default:** 100 requests per 15 minutes per IP
- **Auth endpoints:** 10 requests per 15 minutes
- **Upload endpoints:** 50 requests per 15 minutes

---

## STEP 1 Summary

✅ **Completed:**
- Server setup (Express.js)
- Database configuration (MongoDB)
- 7 Data models created
- Middleware setup
- Error handling
- JWT utilities
- Response handlers
- Security headers (Helmet, CORS, Rate Limiting)

**Next Step:** Reply with "next" to proceed to STEP 2 (Authentication)

---

**Last Updated:** March 23, 2026
**API Version:** 1.0.0
