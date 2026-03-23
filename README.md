# NexMeet Backend - Complete Setup Guide

## 🎮 Project Overview

**NexMeet** is a hybrid social media + gaming platform that combines Instagram-like features with an arcade of mini games. This backend provides:

- ✅ User authentication (JWT)
- ✅ Social features (posts, comments, likes)
- ✅ Real-time messaging
- ✅ Game management and leaderboards
- ✅ Gamification system
- ✅ Admin panel foundation

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   ├── env.js          # Environment variables
│   │   └── constants.js    # App constants
│   │
│   ├── models/              # MongoDB schemas
│   │   ├── User.js         # User schema
│   │   ├── Post.js         # Post schema
│   │   ├── Comment.js      # Comment schema
│   │   ├── Message.js      # Direct messages
│   │   ├── GameScore.js    # Game sessions & scores
│   │   ├── Notification.js # User notifications
│   │   └── Leaderboard.js  # Leaderboard data
│   │
│   ├── controllers/         # Business logic (STEP 2+)
│   ├── routes/             # API routes (STEP 2+)
│   ├── middleware/         # Express middleware
│   │   ├── auth.js        # JWT authentication
│   │   ├── errorHandler.js # Error handling
│   │   └── validation.js  # Input validation
│   │
│   ├── utils/             # Helper functions
│   │   ├── jwt.js        # JWT token generation
│   │   └── response.js   # Response formatting
│   │
│   └── server.js         # Main Express app
│
├── scripts/              # Database scripts
│   └── seed.js          # Seed test data (STEP 2+)
│
├── .env.example         # Environment template
├── package.json         # Dependencies
├── README.md           # This file
└── .gitignore          # Git ignore rules
```

---

## 🚀 Quick Start

### 1. **Install Node.js & npm**
```bash
# Check if installed
node --version  # v16+
npm --version   # v8+

# Download from: https://nodejs.org/
```

### 2. **Install Dependencies**
```bash
cd backend
npm install
```

### 3. **Setup MongoDB**

#### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get connection string
5. Add to `.env` file

#### Option B: Local MongoDB
```bash
# Windows (download installer)
# https://www.mongodb.com/try/download/community

# macOS (with Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu)
sudo apt-get install mongodb
sudo systemctl start mongod
```

### 4. **Setup Environment Variables**
```bash
# Copy example file
cp .env.example .env

# Edit .env and add your values
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexmeet_db
# JWT_SECRET=your_secret_key_here
# ... (other variables)
```

### 5. **Start Server**
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

**Expected Output:**
```
╔════════════════════════════════════════════╗
║    🎮 NexMeet Backend Server Started       ║
╚════════════════════════════════════════════╝

📡 Server running on: http://localhost:5000
🌍 Environment: development
📊 Database: Connected ✅
```

---

## 🗄️ Database Schema Overview

### Collections:

#### 1. **Users**
- Authentication & profile data
- Gamification stats (points, level, badges)
- Social connections (followers/following)
- User preferences & settings

#### 2. **Posts**
- User-generated content (text, images, videos, reels)
- Engagement metrics (likes, comments, shares)
- Hashtags and mentions
- Visibility settings

#### 3. **Comments**
- Comments on posts
- Nested replies
- Like counts
- Edit/delete tracking

#### 4. **Messages**
- Direct messages between users
- Media support
- Read status
- Game invites

#### 5. **GameScores**
- Individual game sessions
- Score tracking
- Multiplayer data
- Game state snapshots

#### 6. **Notifications**
- Activity notifications
- Achievement badges
- Real-time updates

#### 7. **Leaderboards**
- Aggregated rankings
- Global & game-specific leaderboards
- Multiple time periods (all-time, monthly, weekly, daily)

---

## 📊 API Endpoints Structure

### **STEP 1 Status: ✅ Complete**
- ✅ Server Setup
- ✅ Database Configuration
- ✅ Models & Schemas
- ✅ Middleware
- ✅ Error Handling

### **STEP 2: Authentication** (Next)
```
POST   /api/v1/auth/register     - Register new user
POST   /api/v1/auth/login        - Login user
POST   /api/v1/auth/logout       - Logout
POST   /api/v1/auth/refresh      - Refresh token
POST   /api/v1/auth/google       - Google OAuth login
```

### **STEP 3: Social Feed** (Following)
```
GET    /api/v1/posts            - Get feed
POST   /api/v1/posts            - Create post
GET    /api/v1/posts/:id        - Get single post
PUT    /api/v1/posts/:id        - Update post
DELETE /api/v1/posts/:id        - Delete post
POST   /api/v1/posts/:id/like   - Like post
GET    /api/v1/posts/:id/comments - Get comments
POST   /api/v1/posts/:id/comments - Add comment
```

### **STEP 4: Games**
```
GET    /api/v1/games            - List games
POST   /api/v1/games/:id/play   - Start game
POST   /api/v1/games/:id/score  - Submit score
GET    /api/v1/games/:id/history - Game history
```

### **STEP 5: Leaderboard**
```
GET    /api/v1/leaderboard      - Global leaderboard
GET    /api/v1/leaderboard/:gameType - Game leaderboard
GET    /api/v1/leaderboard/friends - Friends leaderboard
```

### **STEP 6: Chat**
```
GET    /api/v1/messages/:userId - Get conversation
POST   /api/v1/messages         - Send message
GET    /api/v1/messages         - Get all conversations
WebSocket events for real-time messaging
```

---

## 🔐 Security Features Implemented

- ✅ **JWT Authentication** - Token-based authentication
- ✅ **Helmet.js** - HTTP security headers
- ✅ **CORS** - Cross-origin request handling
- ✅ **Rate Limiting** - DDoS protection
- ✅ **Input Validation** - Express-validator
- ✅ **Password Hashing** - bcryptjs
- ✅ **Error Handling** - Centralized error management
- ✅ **Environment Variables** - Sensitive data protection

---

## 🛠️ Development Tips

### Useful Commands
```bash
# Install a package
npm install package-name

# Run tests (when available)
npm test

# Seed database with test data (coming in STEP 2)
npm run seed

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Testing the Server
```bash
# Test health endpoint
curl http://localhost:5000/api/v1/health

# Expected response:
# {
#   "success": true,
#   "message": "NexMeet API is running",
#   "version": "1.0.0",
#   "environment": "development"
# }
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `Cannot find module 'dotenv'` | Run `npm install` |
| `MongoDB connection failed` | Check MONGODB_URI in .env |
| `Port 5000 already in use` | Change PORT in .env or kill process: `lsof -ti:5000 \| xargs kill -9` |
| `JWT_SECRET not found` | Copy .env.example to .env and update values |
| `CORS errors` | Update CLIENT_URL in .env to match frontend |

---

## 📦 Environment Variables Reference

```env
# Port
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nexmeet_db
MONGODB_TEST_URI=mongodb://localhost:27017/nexmeet_test

# Authentication
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Cloudinary (for future media uploads)
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Frontend URLs
CLIENT_URL=http://localhost:3000
MOBILE_APP_URL=https://app.nexmeet.com

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## 🎯 Next Steps

After STEP 1 completion, message **"next"** to proceed to:

### 📝 STEP 2: Authentication System
- JWT-based authentication
- User registration & login
- Email verification
- Password reset
- Google OAuth integration
- Token refresh mechanism

**Coming up next!** ⏳

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose ORM](https://mongoosejs.com/)
- [JWT Introduction](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)

---

## 📞 Support

For issues or questions, check:
1. `.env` file configuration
2. MongoDB connection status
3. Node.js version compatibility (v16+)
4. Firewall/VPN blocking ports
5. Error logs in terminal output

---

## 📄 License

MIT License - Free to use and modify

---

**Created with ❤️ for NexMeet Platform**

*Your complete social gaming ecosystem awaits!* 🚀🎮
