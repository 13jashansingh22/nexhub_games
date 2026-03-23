# STEP 4A: Game Platform - Testing Guide

## Setup

Before testing, ensure:
1. MongoDB is running
2. Backend server is running on `http://localhost:5000`
3. You have Postman or cURL installed
4. You have a valid user account (from STEP 2 Auth)

## Test Sequence

### Phase 1: Authentication (From STEP 2 Auth)

#### 1.1 Register New Test User

**Endpoint:** `POST /api/v1/auth/register`

**Body:**
```json
{
  "username": "gamester",
  "email": "gamester@example.com",
  "password": "GamePass123!",
  "firstName": "Game",
  "lastName": "Master"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "USER_ID",
      "username": "gamester",
      "email": "gamester@example.com",
      "firstName": "Game",
      "lastName": "Master",
      "points": 0,
      "level": 1,
      "avatar": null
    },
    "tokens": {
      "accessToken": "ACCESS_TOKEN",
      "refreshToken": "REFRESH_TOKEN"
    }
  }
}
```

**Save the response:**
- `USER_ID` - You'll need this for player stats
- `ACCESS_TOKEN` - Use this for all protected endpoints

#### 1.2 Login (Alternative if already registered)

**Endpoint:** `POST /api/v1/auth/login`

**Body:**
```json
{
  "email": "gamester@example.com",
  "password": "GamePass123!"
}
```

**Save the access token for next requests**

---

### Phase 2: Game Discovery

#### 2.1 Get All Games

**Endpoint:** `GET /api/v1/games`

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/v1/games?limit=10&page=1" \
  -H "Content-Type: application/json"
```

**Expected Response:**
Should return empty array initially (we haven't created games yet in Step 4)

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "games": [],
    "pagination": {
      "total": 0,
      "limit": 10,
      "page": 1,
      "pages": 0
    }
  }
}
```

#### 2.2 Get Games by Category

**Endpoint:** `GET /api/v1/games/category/casual`

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/category/casual?limit=10" \
  -H "Content-Type: application/json"
```

**Expected Response:** Empty (no games created yet)

#### 2.3 Get Featured Games

**Endpoint:** `GET /api/v1/games/featured`

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/featured" \
  -H "Content-Type: application/json"
```

#### 2.4 Get Daily Challenge

**Endpoint:** `GET /api/v1/games/challenge/daily`

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/challenge/daily" \
  -H "Content-Type: application/json"
```

---

### Phase 3: Game Session Flow (Requires Game Data)

**Note:** These tests require games to be created first. In Step 4B, we'll populate games.

#### 3.1 Start Game Session

**Endpoint:** `POST /api/v1/games/:slug/start`

**Headers:**
```
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "difficulty": "medium",
  "isMultiplayer": false,
  "opponents": []
}
```

**cURL:**
```bash
curl -X POST "http://localhost:5000/api/v1/games/snake/start" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "difficulty": "medium",
    "isMultiplayer": false
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Game session started",
  "data": {
    "session": {
      "_id": "SESSION_ID",
      "sessionId": "USER_ID-snake-TIMESTAMP",
      "player": "USER_ID",
      "game": "GAME_ID",
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

**Save:** 
- `SESSION_ID` - For next request
- `sessionId` string - For submitting score

---

### Phase 4: Score Submission

#### 4.1 Submit Game Score (Win)

**Endpoint:** `POST /api/v1/games/:slug/submit-score`

**Headers:**
```
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "sessionId": "USER_ID-snake-TIMESTAMP",
  "score": 1500,
  "result": "win",
  "level": 5,
  "accuracy": 92.5,
  "gameData": {
    "foodEaten": 45,
    "timePlayedSeconds": 120,
    "maxCombo": 12
  }
}
```

**cURL:**
```bash
curl -X POST "http://localhost:5000/api/v1/games/snake/submit-score" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "USER_ID-snake-TIMESTAMP",
    "score": 1500,
    "result": "win",
    "level": 5,
    "accuracy": 92.5,
    "gameData": {
      "foodEaten": 45,
      "timePlayedSeconds": 120
    }
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "session": {
      "_id": "SESSION_ID",
      "sessionId": "USER_ID-snake-TIMESTAMP",
      "score": 1500,
      "result": "win",
      "level": 5,
      "duration": 120,
      "pointsEarned": 150,
      "coinsEarned": 5,
      "xpEarned": 20,
      "bonusPoints": 30,
      "isNewPersonalRecord": true,
      "accuracy": 92.5,
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

**What Happened:**
- Game session completed with score 1500
- Player earned 150 base points + 30 bonus = 180 total points
- Player earned 5 coins
- Player earned 20 XP
- New personal record detected
- User points, level, coins, XP updated
- Notification created for personal record

#### 4.2 Submit Game Score (Loss)

**Body:**
```json
{
  "sessionId": "USER_ID-snake-TIMESTAMP2",
  "score": 800,
  "result": "loss",
  "level": 3,
  "accuracy": 78.0,
  "gameData": {
    "foodEaten": 28,
    "timePlayedSeconds": 60
  }
}
```

**Expected:** Lower rewards than win

#### 4.3 Submit Game Score (Incomplete)

**Body:**
```json
{
  "sessionId": "USER_ID-snake-TIMESTAMP3",
  "score": 0,
  "result": "quit",
  "level": 1,
  "accuracy": 0,
  "gameData": {}
}
```

**Expected:** No rewards (0 points, 0 coins, 0 XP)

---

### Phase 5: Player Stats

#### 5.1 Get Player Game Stats

**Endpoint:** `GET /api/v1/games/:slug/player-stats`

**Headers:**
```
Authorization: Bearer ACCESS_TOKEN
```

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/snake/player-stats" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "game": {
      "title": "Snake Game",
      "slug": "snake"
    },
    "stats": {
      "totalPlays": 3,
      "totalWins": 1,
      "totalLosses": 1,
      "averageScore": 1100,
      "highestScore": 1500,
      "totalPoints": 180,
      "totalCoins": 5,
      "averageAccuracy": 85.25,
      "averageDuration": 100,
      "winRate": 33.33
    }
  }
}
```

---

### Phase 6: Game History

#### 6.1 Get Player Game History (All Games)

**Endpoint:** `GET /api/v1/games/player/:userId/history`

**Headers:**
```
Authorization: Bearer ACCESS_TOKEN
```

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/player/USER_ID/history?limit=10&page=1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "sessions": [
      {
        "_id": "SESSION_ID_1",
        "game": {
          "_id": "GAME_ID",
          "title": "Snake Game",
          "slug": "snake"
        },
        "score": 1500,
        "result": "win",
        "duration": 120,
        "pointsEarned": 150,
        "endTime": "2024-11-01T10:32:32.123Z"
      },
      {
        "_id": "SESSION_ID_2",
        "game": {
          "_id": "GAME_ID",
          "title": "Snake Game",
          "slug": "snake"
        },
        "score": 0,
        "result": "quit",
        "duration": 10,
        "pointsEarned": 0,
        "endTime": "2024-11-01T10:35:32.123Z"
      }
    ],
    "pagination": {
      "total": 3,
      "limit": 10,
      "page": 1,
      "pages": 1
    }
  }
}
```

#### 6.2 Get Player Game History (Specific Game)

**Endpoint:** `GET /api/v1/games/player/:userId/history?gameSlug=snake`

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/player/USER_ID/history?gameSlug=snake&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### Phase 7: Leaderboards

#### 7.1 Get Global Leaderboard (All Time)

**Endpoint:** `GET /api/v1/games/:slug/leaderboard`

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/snake/leaderboard?period=all_time&limit=10"
```

**Expected Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "game": {
      "title": "Snake Game",
      "slug": "snake"
    },
    "period": "all_time",
    "topPlayers": [
      {
        "player": {
          "_id": "USER_ID",
          "username": "gamester",
          "avatar": null,
          "level": 8
        },
        "score": 1500,
        "wins": 1
      }
    ],
    "total": 1
  }
}
```

#### 7.2 Get Weekly Leaderboard

**Endpoint:** `GET /api/v1/games/:slug/leaderboard?period=weekly`

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/snake/leaderboard?period=weekly&limit=10"
```

#### 7.3 Get Monthly Leaderboard

**Endpoint:** `GET /api/v1/games/:slug/leaderboard?period=monthly`

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/snake/leaderboard?period=monthly&limit=10"
```

#### 7.4 Get Friends Leaderboard

**Endpoint:** `GET /api/v1/games/:slug/friends-leaderboard`

**Headers:**
```
Authorization: Bearer ACCESS_TOKEN
```

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/snake/friends-leaderboard" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "game": {
      "title": "Snake Game",
      "slug": "snake"
    },
    "leaderboard": [
      {
        "player": {
          "_id": "USER_ID",
          "username": "gamester",
          "avatar": null,
          "level": 8
        },
        "score": 1500,
        "wins": 1
      }
    ]
  }
}
```

---

### Phase 8: Daily Challenge

#### 8.1 Get Daily Challenge

**Endpoint:** `GET /api/v1/games/challenge/daily`

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/v1/games/challenge/daily"
```

**Expected Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "challenge": {
      "_id": "GAME_ID",
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

#### 8.2 Complete Daily Challenge

**Endpoint:** `POST /api/v1/games/daily-challenge/complete`

**Headers:**
```
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "gameSlug": "snake",
  "score": 2000,
  "result": "win"
}
```

**cURL:**
```bash
curl -X POST "http://localhost:5000/api/v1/games/daily-challenge/complete" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "gameSlug": "snake",
    "score": 2000,
    "result": "win"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "reward": 100,
    "streak": 1,
    "message": "Daily challenge completed! Streak: 1"
  }
}
```

**Note:** Can only complete once per day. Next attempt will return 400 error.

---

## Testing Checklist

### Phase 1: Authentication ✓
- [ ] Register new user
- [ ] Login and get access token

### Phase 2: Game Discovery ✓
- [ ] Get all games (empty initially)
- [ ] Get games by category
- [ ] Get featured games
- [ ] Get daily challenge

### Phase 3: Game Sessions (After Step 4B)
- [ ] Start game session
- [ ] Track session ID

### Phase 4: Score Submission (After Step 4B)
- [ ] Submit winning score
- [ ] Submit losing score
- [ ] Submit incomplete game
- [ ] Verify rewards are calculated correctly
- [ ] Check user points/coins/XP updated

### Phase 5: Player Stats (After Step 4B)
- [ ] Get player game stats
- [ ] Verify aggregation calculations
- [ ] Check win rate calculation

### Phase 6: Game History (After Step 4B)
- [ ] Get all game history
- [ ] Filter by specific game

### Phase 7: Leaderboards (After Step 4B)
- [ ] Get global all-time leaderboard
- [ ] Get weekly leaderboard
- [ ] Get monthly leaderboard
- [ ] Get friends leaderboard
- [ ] Verify top players sorted by score

### Phase 8: Daily Challenge (After Step 4B)
- [ ] Get daily challenge
- [ ] Complete daily challenge (only once)
- [ ] Attempt second completion (should fail)

---

## Common Issues & Solutions

### Issue: 404 Not Found on Game Endpoints
**Cause:** Game doesn't exist in database yet
**Solution:** Will be resolved in Step 4B when we populate games

### Issue: 401 Unauthorized
**Cause:** Missing or invalid access token
**Solution:** Ensure you're using the token from login/register response

### Issue: Null Pointer on Game Stats
**Cause:** Player has never played the game
**Solution:** Start and submit at least one game session first

### Issue: Score Not Updated on Leaderboard
**Cause:** Leaderboard aggregation delay
**Solution:** May take a moment to update, try again in a few seconds

### Issue: Higher Score Not Appearing on Leaderboard
**Cause:** Session score might be in losing result
**Solution:** Only wins are recorded on leaderboard. Submit with result: "win"

---

## Expected Database State After Testing

**Users Collection:**
```javascript
{
  _id: ObjectId,
  username: "gamester",
  email: "gamester@example.com",
  points: 180,         // From game wins
  level: 8,            // Calculated from points
  coins: 5,            // From game rewards
  xp: 20,              // From game rewards
  dailyChallengeStreak: 1,
  lastDailyChallenge: ISODate
}
```

**GameSession Collection:** (3+ documents)
```javascript
{
  _id: ObjectId,
  player: ObjectId,
  game: ObjectId,
  sessionId: "unique-string",
  score: 1500,
  result: "win",
  pointsEarned: 150,
  coinsEarned: 5,
  xpEarned: 20,
  isNewPersonalRecord: true,
  startTime: ISODate,
  endTime: ISODate
}
```

**Leaderboard Collection:** (1+ documents)
```javascript
{
  _id: ObjectId,
  game: ObjectId,
  period: "all_time",
  topPlayers: [
    {
      player: ObjectId,
      score: 1500,
      timestamp: ISODate
    }
  ]
}
```

---

## Next Steps

When STEP 4B is complete, you'll have:
1. ✅ Actual game implementations (Snake, Flappy Bird, Tic Tac Toe code)
2. ✅ Database seeding with game records
3. ✅ Frontend game interfaces
4. ✅ Real-time multiplayer support

Then this testing guide will be fully applicable!

---

**Status:** STEP 4A Testing Documentation Complete ✅
