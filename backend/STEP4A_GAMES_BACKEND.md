# STEP 4A: Game Platform Backend - Complete Documentation

## Overview

The NexMeet Game Platform is a comprehensive backend system for managing games, game sessions, scoring, rewards, and leaderboards. This step implements the core game infrastructure with support for multiple game categories, multiplayer gaming, social competition, and progressive rewards.

## Architecture

### Models

#### 1. **Game Model** (`src/models/Game.js`)
Stores metadata and configuration for each game.

**Key Fields:**
- `title`: Game name
- `slug`: URL-friendly identifier (unique)
- `category`: casual, arcade, puzzle, action, multiplayer, unique
- `isMultiplayer`: Boolean flag for multiplayer support
- `hasAI`: AI opponent available
- `difficultyLevels`: array of supported difficulty levels
- `stats`: Download, play, and rating statistics
- `leaderboard/achievements/dailyChallenge`: Feature availability and configuration
- `rewards`: Base coin and XP values for winning

**Indexes:**
- `slug` (unique)
- `category + published`
- `averageRating` (descending)
- `totalPlays` (descending)

#### 2. **GameSession Model** (`src/models/GameSession.js`)
Tracks individual game plays and sessions.

**Key Fields:**
- `player`: User reference
- `game`: Game reference
- `sessionId`: Unique session identifier
- `score`: Final score for this session
- `result`: win, loss, draw, incomplete, quit
- `gameData`: Flexible field for game-specific state/progression
- `isNewPersonalRecord`: Boolean flag
- `pointsEarned`, `coinsEarned`, `xpEarned`: Reward values
- `performance metrics`: accuracy, efficiency, combo data
- `isMultiplayer`: Multiplayer flag
- `opponents`: Array of opponent player references

**Indexes:**
- `player + game + date` (complex query optimization)
- `game + result` (leaderboard queries)
- `player + score desc` (personal bests)

### Controllers

#### GameController (`src/controllers/gameController.js`)

**Game Discovery Functions:**
- `getAllGames()` - List all published games with filtering
- `getFeaturedGames()` - Get top featured games
- `getGamesByCategory()` - Get games by category
- `getGameBySlug()` - Get single game details

**Game Session Functions:**
- `startGameSession()` - Initialize new game session
- `submitGameScore()` - Save score and calculate rewards
- `getPlayerGameStats()` - Get player's aggregate stats for a game
- `getPlayerGameHistory()` - Get player's recent game sessions

**Leaderboard Functions:**
- `getGameLeaderboard()` - Get top players for a game
- `getFriendsLeaderboard()` - Get leaderboard filtered to friends

**Daily Challenge Functions:**
- `getDailyChallenge()` - Get today's featured daily challenge
- `completeDailyChallenge()` - Submit daily challenge completion

---

## API Endpoints

### Public Endpoints (No Authentication)

#### 1. **Get All Games**
```
GET /api/v1/games
```

**Query Parameters:**
- `category` (optional): casual, arcade, puzzle, action, multiplayer, unique
- `search` (optional): Search by title or description
- `limit` (optional): Default 20, max 100
- `page` (optional): Default 1
- `sort` (optional): Field to sort by, prefix with `-` for descending

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/v1/games?category=casual&search=snake&limit=20&page=1"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "games": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Snake Game",
        "slug": "snake",
        "category": "casual",
        "description": "Classic snake game with modern features",
        "thumbnail": "url",
        "stats": {
          "totalPlays": 15000,
          "totalDownloads": 8000,
          "averageRating": 4.5
        }
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 20,
      "page": 1,
      "pages": 1
    }
  }
}
```

#### 2. **Get Featured Games**
```
GET /api/v1/games/featured
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "games": [
      { ... },
      { ... }
    ]
  }
}
```

#### 3. **Get Games by Category**
```
GET /api/v1/games/category/:category
```

**Path Parameters:**
- `category`: casual, arcade, puzzle, action, multiplayer, unique

**Query Parameters:**
- `limit` (optional): Default 20
- `page` (optional): Default 1

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/category/casual?limit=10&page=1"
```

#### 4. **Get Single Game**
```
GET /api/v1/games/:slug
```

**Path Parameters:**
- `slug`: Game slug (e.g., "snake")

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/snake"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "game": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Snake Game",
      "slug": "snake",
      "description": "...",
      "category": "casual",
      "isMultiplayer": false,
      "hasAI": true,
      "difficultyLevels": ["easy", "medium", "hard"],
      "stats": {
        "totalPlays": 15000,
        "totalDownloads": 8000,
        "averageRating": 4.5,
        "totalRatings": 3200
      },
      "leaderboardEnabled": true,
      "achievementsEnabled": true,
      "dailyChallenge": {
        "enabled": true,
        "reward": 100
      }
    }
  }
}
```

#### 5. **Get Game Leaderboard**
```
GET /api/v1/games/:slug/leaderboard
```

**Path Parameters:**
- `slug`: Game slug

**Query Parameters:**
- `period` (optional): all_time, monthly, weekly, daily (default: all_time)
- `limit` (optional): Default 100, max 100
- `page` (optional): Default 1

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/snake/leaderboard?period=all_time&limit=10"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "game": {
      "title": "Snake Game",
      "slug": "snake"
    },
    "period": "all_time",
    "topPlayers": [
      {
        "player": {
          "_id": "507f1f77bcf86cd799439012",
          "username": "alex_gamer",
          "avatar": "url",
          "level": 15
        },
        "score": 5000,
        "wins": 150
      },
      {
        "player": {
          "_id": "507f1f77bcf86cd799439013",
          "username": "sarah_pro",
          "avatar": "url",
          "level": 12
        },
        "score": 4800,
        "wins": 145
      }
    ],
    "total": 2
  }
}
```

#### 6. **Get Daily Challenge**
```
GET /api/v1/games/challenge/daily
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "challenge": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Snake Game",
      "slug": "snake",
      "category": "casual",
      "dailyChallenge": {
        "enabled": true,
        "reward": 100,
        "resetTime": "00:00"
      }
    }
  }
}
```

---

### Protected Endpoints (Requires Authentication)

#### 1. **Start Game Session**
```
POST /api/v1/games/:slug/start
Authorization: Bearer {token}
```

**Path Parameters:**
- `slug`: Game slug

**Request Body:**
```json
{
  "difficulty": "medium",
  "isMultiplayer": false,
  "opponents": []
}
```

**Example cURL:**
```bash
curl -X POST "http://localhost:5000/api/v1/games/snake/start" \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "difficulty": "medium",
    "isMultiplayer": false
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Game session started",
  "statusCode": 201,
  "data": {
    "session": {
      "_id": "507f1f77bcf86cd799439014",
      "sessionId": "507f1f77bcf86cd799439012-snake-1698765432123",
      "player": "507f1f77bcf86cd799439012",
      "game": "507f1f77bcf86cd799439011",
      "gameTitle": "Snake Game",
      "gameSlug": "snake",
      "difficulty": "medium",
      "isMultiplayer": false,
      "startTime": "2024-11-01T10:30:32.123Z",
      "status": "active"
    }
  }
}
```

#### 2. **Submit Game Score**
```
POST /api/v1/games/:slug/submit-score
Authorization: Bearer {token}
```

**Path Parameters:**
- `slug`: Game slug

**Request Body:**
```json
{
  "sessionId": "507f1f77bcf86cd799439012-snake-1698765432123",
  "score": 1500,
  "result": "win",
  "level": 5,
  "accuracy": 92.5,
  "gameData": {
    "level": 5,
    "foodEaten": 45,
    "timePlayedSeconds": 120
  }
}
```

**Example cURL:**
```bash
curl -X POST "http://localhost:5000/api/v1/games/snake/submit-score" \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "507f1f77bcf86cd799439012-snake-1698765432123",
    "score": 1500,
    "result": "win",
    "level": 5,
    "accuracy": 92.5
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session": {
      "_id": "507f1f77bcf86cd799439014",
      "sessionId": "507f1f77bcf86cd799439012-snake-1698765432123",
      "score": 1500,
      "result": "win",
      "level": 5,
      "duration": 120,
      "pointsEarned": 150,
      "coinsEarned": 5,
      "xpEarned": 20,
      "bonusPoints": 30,
      "isNewPersonalRecord": true,
      "endTime": "2024-11-01T10:32:32.123Z"
    },
    "rewards": {
      "points": 150,
      "coins": 5,
      "xp": 20,
      "bonus": 30
    },
    "isNewPersonalRecord": true,
    "userStats": {
      "points": 5200,
      "level": 8,
      "coins": 500,
      "xp": 2400
    }
  }
}
```

#### 3. **Get Player Game Stats**
```
GET /api/v1/games/:slug/player-stats
Authorization: Bearer {token}
```

**Path Parameters:**
- `slug`: Game slug

**Example cURL:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/snake/player-stats" \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response:**
```json
{
  "success": true,
  "data": {
    "game": {
      "title": "Snake Game",
      "slug": "snake"
    },
    "stats": {
      "_id": "507f1f77bcf86cd799439011",
      "totalPlays": 25,
      "totalWins": 18,
      "totalLosses": 7,
      "averageScore": 1200,
      "highestScore": 3500,
      "totalPoints": 3000,
      "totalCoins": 120,
      "averageAccuracy": 88.5,
      "averageDuration": 180,
      "winRate": 72.0
    }
  }
}
```

#### 4. **Get Player Game History**
```
GET /api/v1/games/player/:userId/history
Authorization: Bearer {token}
```

**Path Parameters:**
- `userId`: Player's MongoDB user ID

**Query Parameters:**
- `limit` (optional): Default 20, max 50
- `page` (optional): Default 1
- `gameSlug` (optional): Filter by specific game

**Example cURL:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/player/507f1f77bcf86cd799439012/history?limit=10&gameSlug=snake" \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "game": {
          "_id": "507f1f77bcf86cd799439011",
          "title": "Snake Game",
          "slug": "snake"
        },
        "score": 1500,
        "result": "win",
        "duration": 120,
        "pointsEarned": 150,
        "endTime": "2024-11-01T10:32:32.123Z"
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 10,
      "page": 1,
      "pages": 3
    }
  }
}
```

#### 5. **Get Friends Leaderboard**
```
GET /api/v1/games/:slug/friends-leaderboard
Authorization: Bearer {token}
```

**Path Parameters:**
- `slug`: Game slug

**Example cURL:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/snake/friends-leaderboard" \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response:**
```json
{
  "success": true,
  "data": {
    "game": {
      "title": "Snake Game",
      "slug": "snake"
    },
    "leaderboard": [
      {
        "player": {
          "_id": "507f1f77bcf86cd799439012",
          "username": "you_gamer",
          "avatar": "url",
          "level": 10
        },
        "score": 2500,
        "wins": 18
      },
      {
        "player": {
          "_id": "507f1f77bcf86cd799439013",
          "username": "friend_one",
          "avatar": "url",
          "level": 8
        },
        "score": 2200,
        "wins": 15
      }
    ]
  }
}
```

#### 6. **Complete Daily Challenge**
```
POST /api/v1/games/daily-challenge/complete
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "gameSlug": "snake",
  "score": 2000,
  "result": "win"
}
```

**Example cURL:**
```bash
curl -X POST "http://localhost:5000/api/v1/games/daily-challenge/complete" \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "gameSlug": "snake",
    "score": 2000,
    "result": "win"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reward": 500,
    "streak": 5,
    "message": "Daily challenge completed! Streak: 5"
  }
}
```

---

## Reward System

### Points & Coins

**Base Rewards (per game):**
- Playing: 10 points
- Win: 50 points + 5 coins
- Loss: 5 points
- Draw: 25 points + 1 coin

**Bonuses:**
- First play of day: +20 points
- Win streak (per consecutive): +10 points
- New personal record: +100 bonus points
- Perfect game: +500 bonus points
- Daily challenge: +100 points, +25 coins

### XP System

**Base XP:**
- Playing: 5 XP
- Win: 20 XP
- Achievement unlock: 50 XP

### Level Progression

Leveling based on total points:
- Level 1: 0+ points
- Level 2: 1,000+ points
- Level 3: 5,000+ points
- Level 4: 15,000+ points
- Level 5: 30,000+ points
- Level 6+: Every 100,000 points

---

## Game Categories

The platform supports 6 game categories:

1. **Casual** - Simple, fun games
   - Examples: Snake, Flappy Bird, Tic Tac Toe, 2048

2. **Arcade** - Fast-paced action games
   - Examples: Brick Breaker, Space Shooter, Pacman

3. **Puzzle** - Brain teasers and logic games
   - Examples: Sudoku, Match-3, Word Puzzle, Maze

4. **Action** - High-intensity games
   - Examples: Shooting Game, Zombie Survival, Racing

5. **Multiplayer** - Competitive games
   - Examples: Chess, Ludo, 1v1 Shooter, Quiz Battle

6. **Unique** - Special games with unique mechanics
   - Examples: AI Opponent, Voice Controlled, AR Game

---

## Game Result Types

When submitting a score, use one of these results:

| Result | Points | Coins | XP | Description |
|--------|--------|-------|----|----|
| `win` | 50+ | 5+ | 20+ | Player won the game |
| `loss` | 5 | 0 | 5 | Player lost the game |
| `draw` | 25 | 1 | 5 | Game ended in draw |
| `incomplete` | 0 | 0 | 0 | Player quit mid-game |
| `quit` | 0 | 0 | 0 | Player willingly quit |

---

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "error": "error details"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad request (invalid parameters)
- `401` - Unauthorized (no/invalid token)
- `404` - Not found (game/session not found)
- `500` - Server error

---

## Authentication

All protected endpoints require JWT token in Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Obtain token via STEP 2 endpoints:
- `POST /api/v1/auth/register` - Register new account
- `POST /api/v1/auth/login` - Login and get token

---

## Database Indexes

For optimal performance, ensure these indexes are created:

**Game Collection:**
- `slug` (unique)
- `category + isPublished`
- `stats.averageRating` (descending)
- `stats.totalPlays` (descending)
- `isFeatured`

**GameSession Collection:**
- `player + gameDate` (compound)
- `game + result` (for leaderboard queries)
- `player + score desc`
- `sessionId` (unique)

---

## Next Steps (STEP 4B)

When you're ready to proceed, we'll create:
1. **Game Logic Implementation** - Actual game engines (Snake, Flappy Bird, Tic Tac Toe)
2. **Frontend Game UI** - Canvas/WebGL rendering for games
3. **Socket.io Integration** - Real-time multiplayer & leaderboard updates
4. **Mobile Support** - Flutter integration for mobile games

---

## Testing with cURL

### Test Workflow:

1. **Register & Get Token:**
```bash
curl -X POST "http://localhost:5000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

2. **Start Game Session:**
```bash
curl -X POST "http://localhost:5000/api/v1/games/snake/start" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "difficulty": "medium",
    "isMultiplayer": false
  }'
```

3. **Submit Score:**
```bash
curl -X POST "http://localhost:5000/api/v1/games/snake/submit-score" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "{sessionId}",
    "score": 1500,
    "result": "win",
    "accuracy": 90
  }'
```

4. **View Leaderboard:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/snake/leaderboard?period=all_time&limit=10"
```

---

## Summary

**Step 4A Complete:** Game Platform Backend Infrastructure
- ✅ Game Model with comprehensive schema
- ✅ GameSession Model for tracking plays
- ✅ Game Controller with 12+ functions
- ✅ Game Routes with 13+ endpoints
- ✅ Reward & XP system
- ✅ Leaderboard integration
- ✅ Daily challenge system
- ✅ Integration with authentication

**Ready for:** STEP 4B - Game Implementation & Frontend
