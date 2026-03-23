/* Main Server Application */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const config = require('./config/env');
const { errorHandler, asyncHandler } = require('./middleware/errorHandler');
const { authMiddleware, optionalAuthMiddleware } = require('./middleware/auth');

// Initialize Express app
const app = express();

// ============================================
// ⚙️  MIDDLEWARE SETUP
// ============================================

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: [config.CLIENT_URL, config.MOBILE_APP_URL].filter(Boolean),
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging (development only)
if (config.isDevelopment()) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// 🗄️  DATABASE CONNECTION
// ============================================

let dbConnection;
(async () => {
  try {
    dbConnection = await connectDB();
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
})();

// ============================================
// 🛣️  API ROUTES
// ============================================

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'NexMeet API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.NODE_ENV,
  });
});

// API Documentation
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Welcome to NexMeet API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      posts: '/api/v1/posts',
      games: '/api/v1/games',
      messages: '/api/v1/messages',
      notifications: '/api/v1/notifications',
      leaderboard: '/api/v1/leaderboard',
    },
  });
});

// ✅ Auth Routes (STEP 2: IMPLEMENTED)
app.use('/api/v1/auth', require('./routes/auth'));

// ✅ Game Routes (STEP 4A: IMPLEMENTED)
app.use('/api/v1/games', require('./routes/games'));

// Routes structure (to be filled in following steps)
// app.use('/api/v1/users', require('./routes/users'));
// app.use('/api/v1/posts', require('./routes/posts'));
// app.use('/api/v1/messages', require('./routes/messages'));
// app.use('/api/v1/notifications', require('./routes/notifications'));
// app.use('/api/v1/leaderboard', require('./routes/leaderboard'));

// ============================================
// 404 & ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use(errorHandler);

// ============================================
// 🚀 SERVER STARTUP
// ============================================

const PORT = config.PORT;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║    🎮 NexMeet Backend Server Started       ║
╚════════════════════════════════════════════╝

📡 Server running on: http://localhost:${PORT}
🌍 Environment: ${config.NODE_ENV}
📊 Database: ${config.MONGODB_URI ? 'Connected ✅' : 'Pending ⏳'}

📚 API Endpoints:
   ▸ Health: GET /api/v1/health
   ▸ Docs: GET /api/v1
   
🔧 Configuration:
   ▸ JWT Expiry: ${config.JWT_EXPIRE}
   ▸ CORS Origins: ${config.CLIENT_URL}
   
🚀 Ready to process requests...
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server shut down');
    process.exit(0);
  });
});

// Unhandled rejection
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = { app, server };
