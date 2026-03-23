# 🗄️ MongoDB Schema Documentation

## User Collection

```javascript
{
  _id: ObjectId,
  
  // Basic Info
  username: String (unique, 3-30 chars),
  email: String (unique),
  password: String (hashed with bcrypt),
  
  // Profile
  firstName: String,
  lastName: String,
  bio: String (max 500 chars),
  avatar: {
    url: String,
    publicId: String (Cloudinary)
  },
  coverImage: {
    url: String,
    publicId: String
  },
  location: String,
  website: String,
  dateOfBirth: Date,
  
  // Account Status
  status: String (active|banned|suspended|inactive),
  isVerified: Boolean,
  verificationToken: String,
  verificationTokenExpire: Date,
  
  // Gamification
  points: Number (default: 0),
  level: Number (default: 1),
  badges: [String],
  totalGamesPlayed: Number,
  totalGamesWon: Number,
  streak: Number,
  lastLoginDate: Date,
  
  // Social
  followers: [ObjectId],
  following: [ObjectId],
  followerCount: Number,
  followingCount: Number,
  
  // Preferences
  preferences: {
    darkMode: Boolean,
    notifications: {
      likes: Boolean,
      comments: Boolean,
      follows: Boolean,
      messages: Boolean
    },
    privacy: {
      profilePublic: Boolean,
      allowMessages: Boolean
    }
  },
  
  // Admin
  role: String (user|moderator|admin),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

## Post Collection

```javascript
{
  _id: ObjectId,
  
  // Author
  author: ObjectId (ref: User),
  
  // Content
  caption: String (max 2000 chars),
  type: String (text|image|video|reel),
  media: [{
    url: String,
    publicId: String,
    type: String (image|video)
  }],
  
  // Engagement
  hashtags: [String],
  mentions: [ObjectId],
  likes: [{
    user: ObjectId,
    createdAt: Date
  }],
  likeCount: Number,
  commentCount: Number,
  shareCount: Number,
  
  // Video/Reel
  duration: Number,
  thumbnail: String,
  
  // Location
  location: String,
  coordinates: {
    type: "Point",
    coordinates: [Number, Number] // [longitude, latitude]
  },
  
  // Visibility
  visibility: String (public|private|friends),
  allowComments: Boolean,
  
  // Status
  isDeleted: Boolean,
  deletedAt: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

## GameScore Collection

```javascript
{
  _id: ObjectId,
  
  // Player
  player: ObjectId (ref: User),
  playerUsername: String,
  
  // Game Info
  gameType: String (snake|flappy_bird|tic_tac_toe),
  gameMode: String (single_player|multiplayer|ai),
  
  // Score Details
  score: Number,
  level: Number,
  duration: Number (seconds),
  maxCombo: Number,
  
  // Multiplayer
  opponent: ObjectId (ref: User),
  opponentScore: Number,
  isMultiplayer: Boolean,
  
  // Result
  result: String (win|loss|draw|incomplete),
  
  // Rewards
  pointsEarned: Number,
  bonusPointsEarned: Number,
  
  // Game State
  gameState: Mixed (JSON object),
  deviceInfo: {
    platform: String (web|mobile),
    userAgent: String
  },
  
  // Analysis
  accuracy: Number,
  consistency: String,
  
  // AI
  isAIOpponent: Boolean,
  aiDifficulty: String (easy|medium|hard),
  
  // Timestamps
  createdAt: Date,
  completedAt: Date
}
```

## Message Collection

```javascript
{
  _id: ObjectId,
  
  // Sender & Receiver
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  conversationId: String,
  
  // Content
  content: String (max 5000 chars),
  media: [{
    url: String,
    publicId: String,
    type: String (image|video|document)
  }],
  
  // Type
  messageType: String (text|image|video|game_invite|system),
  
  // Game Invite
  gameInvite: {
    gameType: String,
    gameMode: String,
    status: String (pending|accepted|rejected)
  },
  
  // Status
  isRead: Boolean,
  readAt: Date,
  isDeleted: Boolean,
  deletedAt: Date,
  
  // Reactions
  reactions: [{
    emoji: String,
    users: [ObjectId]
  }],
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

## Comment Collection

```javascript
{
  _id: ObjectId,
  
  // References
  post: ObjectId (ref: Post),
  author: ObjectId (ref: User),
  parentComment: ObjectId (for nested replies),
  
  // Content
  content: String (max 500 chars),
  mentions: [ObjectId],
  
  // Engagement
  likes: [{
    user: ObjectId,
    createdAt: Date
  }],
  likeCount: Number,
  replyCount: Number,
  
  // Status
  isEdited: Boolean,
  editedAt: Date,
  isDeleted: Boolean,
  deletedAt: Date,
  
  // Moderation
  isReported: Boolean,
  reportCount: Number,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

## Notification Collection

```javascript
{
  _id: ObjectId,
  
  // Users
  recipient: ObjectId (ref: User),
  sender: ObjectId (ref: User),
  
  // Type
  type: String (like|comment|follow|message|game_invite|achievement),
  
  // Related Document
  relatedTo: {
    model: String (Post|Comment|User|Message|GameScore),
    id: ObjectId
  },
  
  // Details
  title: String,
  message: String (max 500 chars),
  actionUrl: String,
  
  // Achievement
  achievement: {
    badge: String,
    badgeIcon: String,
    description: String
  },
  
  // Status
  isRead: Boolean,
  readAt: Date,
  
  // Timestamps
  createdAt: Date
}
```

## Leaderboard Collection

```javascript
{
  _id: ObjectId,
  
  // Player
  player: ObjectId (ref: User),
  username: String,
  avatar: String,
  
  // Game
  gameType: String (all|snake|flappy_bird|tic_tac_toe),
  
  // Stats
  totalScore: Number,
  gamesPlayed: Number,
  gamesWon: Number,
  gamesLost: Number,
  winRate: Number,
  averageScore: Number,
  bestScore: Number,
  
  // Ranking
  rank: Number,
  rankChange: Number,
  
  // Period
  period: String (all_time|monthly|weekly|daily),
  
  // Points
  totalPoints: Number,
  
  // Timestamps
  lastUpdated: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Database Indexes Created

For optimal query performance, the following indexes are automatically created:

### User Indexes
- `username` - For unique username lookups
- `email` - For unique email lookups
- `createdAt` - For sorting users by registration date
- `status` - For filtering active/banned users

### Post Indexes
- `author, createdAt` - For user timeline queries
- `hashtags` - For hashtag searches
- `coordinates` - Geospatial index for location-based posts
- `visibility` - For privacy-aware queries

### GameScore Indexes
- `gameType, score` - For leaderboard queries
- `player, gameType` - For user game history
- `result` - For win/loss tracking
- `pointsEarned` - For reward tracking

### Message Indexes
- `conversationId, createdAt` - For message history
- `sender, receiver` - For conversation lookup
- `conversationId, isRead` - For unread messages

### Comment Indexes
- `post, createdAt` - For post comments
- `parentComment` - For reply threads
- `author` - For user comments

### Notification Indexes
- `recipient, isRead, createdAt` - For notification feed
- `createdAt` - For timeline sorting

### Leaderboard Indexes
- `gameType, period, rank` - Compound index for leaderboard queries
- `player, gameType, period` - For user stats (unique)
- `totalScore` - For sorting by score
- `totalPoints` - For sorting by points

---

**All models include automatic timestamps (createdAt, updatedAt) for audit trails.**
