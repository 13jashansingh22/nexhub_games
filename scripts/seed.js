/* Database Seed Script - Create test data */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Post = require('../src/models/Post');
const Game = require('../src/models/Game');
const connectDB = require('../src/config/database');

const testGames = [
  {
    title: 'Snake',
    slug: 'snake',
    description: 'Classic arcade with a sharp neon board.',
    category: 'casual',
    developer: 'NexMeet Studio',
    platforms: ['mobile', 'web', 'both'],
    features: ['leaderboard', 'achievements'],
    tags: ['arcade', 'touch', 'keyboard'],
    instructions: 'Use swipe, arrow keys, or WASD to guide the snake.',
    rules: ['Collect food', 'Avoid the walls', 'Do not crash into your body'],
    tips: ['Plan turns early', 'Use the edges to control space'],
    isPublished: true,
    isFeatured: true,
    basePoints: 100,
    leaderboardEnabled: true,
    achievementsEnabled: true,
    averageDuration: 120,
  },
  {
    title: 'Asteroids',
    slug: 'asteroids',
    description: 'Dodge debris and survive the field.',
    category: 'action',
    developer: 'NexMeet Studio',
    platforms: ['mobile', 'web', 'both'],
    features: ['leaderboard'],
    tags: ['action', 'space'],
    instructions: 'Rotate, thrust, and fire to destroy asteroids.',
    rules: ['Avoid collisions', 'Shoot asteroids for points'],
    tips: ['Keep moving', 'Fire from a safe distance'],
    isPublished: true,
    isFeatured: true,
    basePoints: 200,
    leaderboardEnabled: true,
    achievementsEnabled: false,
    averageDuration: 180,
  },
  {
    title: 'Flappy Bird',
    slug: 'flappy-bird',
    description: 'Tap into a brighter take on the classic flyer.',
    category: 'casual',
    developer: 'NexMeet Studio',
    platforms: ['mobile', 'web', 'both'],
    features: ['leaderboard', 'achievements'],
    tags: ['arcade', 'tap'],
    instructions: 'Tap or press space to stay airborne.',
    rules: ['Pass through pipes', 'Do not hit obstacles'],
    tips: ['Short taps are safer', 'Keep the bird centered'],
    isPublished: true,
    isFeatured: true,
    basePoints: 100,
    leaderboardEnabled: true,
    achievementsEnabled: true,
    averageDuration: 90,
  },
  {
    title: 'Tic Tac Toe',
    slug: 'tic-tac-toe',
    description: 'Fast matches with a clean neon board.',
    category: 'casual',
    developer: 'NexMeet Studio',
    platforms: ['mobile', 'web', 'both'],
    features: ['leaderboard', 'multiplayer'],
    tags: ['quick', 'multiplayer'],
    instructions: 'Tap a square to place your mark.',
    rules: ['Get three in a row', 'Draw ends the match'],
    tips: ['Control the center', 'Block fork threats'],
    isPublished: true,
    isFeatured: true,
    basePoints: 50,
    leaderboardEnabled: true,
    achievementsEnabled: false,
    averageDuration: 45,
  },
  {
    title: '2048',
    slug: '2048',
    description: 'Merge tiles and push the score higher.',
    category: 'puzzle',
    developer: 'NexMeet Studio',
    platforms: ['mobile', 'web', 'both'],
    features: ['leaderboard', 'achievements'],
    tags: ['puzzle', 'merge'],
    instructions: 'Swipe or use arrow keys to combine tiles.',
    rules: ['Merge matching tiles', 'Reach higher values'],
    tips: ['Keep your biggest tile in a corner', 'Plan several moves ahead'],
    isPublished: true,
    isFeatured: true,
    basePoints: 100,
    leaderboardEnabled: true,
    achievementsEnabled: true,
    averageDuration: 240,
  },
  {
    title: 'Sudoku',
    slug: 'sudoku',
    description: 'Focus, logic, and a polished puzzle grid.',
    category: 'puzzle',
    developer: 'NexMeet Studio',
    platforms: ['mobile', 'web', 'both'],
    features: ['leaderboard', 'achievements'],
    tags: ['logic', 'numbers'],
    instructions: 'Tap a cell and choose a number from the palette.',
    rules: ['Each row, column, and box needs 1-9'],
    tips: ['Start with obvious singles', 'Scan rows and columns together'],
    isPublished: true,
    isFeatured: true,
    basePoints: 100,
    leaderboardEnabled: true,
    achievementsEnabled: true,
    averageDuration: 600,
  },
  {
    title: 'Memory Match',
    slug: 'memory-match',
    description: 'Train your recall with crisp feedback.',
    category: 'puzzle',
    developer: 'NexMeet Studio',
    platforms: ['mobile', 'web', 'both'],
    features: ['leaderboard', 'achievements'],
    tags: ['memory', 'pairs'],
    instructions: 'Flip two cards at a time and remember their positions.',
    rules: ['Match all pairs', 'Unmatched cards flip back'],
    tips: ['Track each revealed symbol', 'Work in pairs and quadrants'],
    isPublished: true,
    isFeatured: true,
    basePoints: 100,
    leaderboardEnabled: true,
    achievementsEnabled: true,
    averageDuration: 180,
  },
  {
    title: 'Chess',
    slug: 'chess',
    description: 'A classic strategy board with a dark polish.',
    category: 'multiplayer',
    developer: 'NexMeet Studio',
    platforms: ['mobile', 'web', 'both'],
    features: ['leaderboard', 'multiplayer'],
    tags: ['strategy', 'board'],
    instructions: 'Tap a piece, then tap a legal destination square.',
    rules: ['Win by checkmate', 'Stalemate ends the game'],
    tips: ['Develop pieces early', 'Protect your king'],
    isPublished: true,
    isFeatured: true,
    basePoints: 100,
    leaderboardEnabled: true,
    achievementsEnabled: true,
    averageDuration: 900,
  },
  {
    title: 'Minesweeper',
    slug: 'minesweeper',
    description: 'Careful reveals and a crisp victory path.',
    category: 'puzzle',
    developer: 'NexMeet Studio',
    platforms: ['mobile', 'web', 'both'],
    features: ['leaderboard', 'achievements'],
    tags: ['logic', 'mines'],
    instructions: 'Tap cells to reveal them and avoid the mines.',
    rules: ['Clear every safe cell', 'Do not reveal a mine'],
    tips: ['Use number clues', 'Flag risky cells'],
    isPublished: true,
    isFeatured: false,
    basePoints: 100,
    leaderboardEnabled: true,
    achievementsEnabled: true,
    averageDuration: 180,
  },
  {
    title: 'Pong',
    slug: 'pong',
    description: 'Retro paddle action with a modern skin.',
    category: 'arcade',
    developer: 'NexMeet Studio',
    platforms: ['mobile', 'web', 'both'],
    features: ['leaderboard'],
    tags: ['retro', 'arcade'],
    instructions: 'Drag your paddle to return the ball.',
    rules: ['Keep the ball in play', 'Score against the AI'],
    tips: ['Follow the ball trajectory', 'Use controlled movement'],
    isPublished: true,
    isFeatured: false,
    basePoints: 100,
    leaderboardEnabled: true,
    achievementsEnabled: false,
    averageDuration: 180,
  },
  {
    title: 'Breakout',
    slug: 'breakout',
    description: 'Smash through bricks with reactive play.',
    category: 'arcade',
    developer: 'NexMeet Studio',
    platforms: ['mobile', 'web', 'both'],
    features: ['leaderboard'],
    tags: ['arcade', 'paddle'],
    instructions: 'Move the paddle with drag or mouse to bounce the ball.',
    rules: ['Break all bricks', 'Keep the ball from falling'],
    tips: ['Aim the ball with paddle edges', 'Clear side bricks first'],
    isPublished: true,
    isFeatured: false,
    basePoints: 100,
    leaderboardEnabled: true,
    achievementsEnabled: false,
    averageDuration: 240,
  },
  {
    title: 'Coming Soon',
    slug: 'coming-soon',
    description: 'New experiences are already in the queue.',
    category: 'unique',
    developer: 'NexMeet Studio',
    platforms: ['mobile', 'web', 'both'],
    features: [],
    tags: ['preview'],
    instructions: 'Preview the next game releases.',
    rules: ['These games are not yet available'],
    tips: ['Check back for new titles'],
    isPublished: true,
    isComingSoon: true,
    basePoints: 0,
    leaderboardEnabled: false,
    achievementsEnabled: false,
    averageDuration: 0,
  },
];

const testUsers = [
  {
    username: 'alex_developer',
    email: 'alex@example.com',
    password: 'TestPassword123',
    firstName: 'Alex',
    lastName: 'Developer',
    bio: '🚀 Full-stack developer | Gaming enthusiast',
    location: 'San Francisco, CA',
    website: 'https://alexdev.com',
    avatar: {
      url: 'https://i.pravatar.cc/150?img=1',
    },
    isVerified: true,
    status: 'active',
    points: 1500,
    level: 5,
    badges: ['first_post', 'game_master'],
    totalGamesPlayed: 42,
    totalGamesWon: 28,
    streak: 7,
  },
  {
    username: 'sarah_gamer',
    email: 'sarah@example.com',
    password: 'TestPassword123',
    firstName: 'Sarah',
    lastName: 'Gamer',
    bio: '🎮 Competitive gamer | Streamer',
    location: 'Los Angeles, CA',
    website: 'https://twitch.tv/sarah_gamer',
    avatar: {
      url: 'https://i.pravatar.cc/150?img=2',
    },
    isVerified: true,
    status: 'active',
    points: 3200,
    level: 8,
    badges: ['game_master', 'social_butterfly', 'top_scorer'],
    totalGamesPlayed: 156,
    totalGamesWon: 109,
    streak: 15,
  },
  {
    username: 'mike_creative',
    email: 'mike@example.com',
    password: 'TestPassword123',
    firstName: 'Mike',
    lastName: 'Creative',
    bio: '🎨 Designer | Content Creator',
    location: 'New York, NY',
    website: 'https://mikecreative.com',
    avatar: {
      url: 'https://i.pravatar.cc/150?img=3',
    },
    isVerified: true,
    status: 'active',
    points: 2100,
    level: 6,
    badges: ['social_butterfly', 'first_post'],
    totalGamesPlayed: 34,
    totalGamesWon: 18,
    streak: 3,
  },
  {
    username: 'lisa_explorer',
    email: 'lisa@example.com',
    password: 'TestPassword123',
    firstName: 'Lisa',
    lastName: 'Explorer',
    bio: '✈️ Travel enthusiast | Adventure seeker',
    location: 'Austin, TX',
    website: 'https://lisaexplores.com',
    avatar: {
      url: 'https://i.pravatar.cc/150?img=4',
    },
    isVerified: true,
    status: 'active',
    points: 2800,
    level: 7,
    badges: ['social_butterfly', 'streak_warrior'],
    totalGamesPlayed: 89,
    totalGamesWon: 52,
    streak: 21,
  },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Game.deleteMany({});

    // Create test users
    console.log('👥 Creating test users...');
    const createdUsers = await User.insertMany(testUsers);
    console.log(`✅ Created ${createdUsers.length} test users`);

    // Log user credentials
    console.log('\n📝 Test User Credentials:\n');
    createdUsers.forEach((user) => {
      console.log(`Email: ${user.email}`);
      console.log(`Username: ${user.username}`);
      console.log(`Password: TestPassword123`);
      console.log('---');
    });

    // Create sample posts
    console.log('\n📸 Creating sample posts...');
    const samplePosts = [
      {
        author: createdUsers[0]._id,
        caption: '🚀 Just launched my new project! Excited to share it with everyone #coding #development',
        type: 'text',
        hashtags: ['coding', 'development', 'github'],
        visibility: 'public',
        allowComments: true,
      },
      {
        author: createdUsers[1]._id,
        caption: '🎮 Just beat my high score in Snake! 🐍 #gaming #nexmeet #highscore',
        type: 'text',
        hashtags: ['gaming', 'nexmeet', 'highscore'],
        visibility: 'public',
        allowComments: true,
      },
      {
        author: createdUsers[2]._id,
        caption: 'New design system coming soon! Can\'t wait to share 🎨 #design #ui #ux',
        type: 'text',
        hashtags: ['design', 'ui', 'ux'],
        visibility: 'public',
        allowComments: true,
      },
      {
        author: createdUsers[3]._id,
        caption: 'Beautiful sunset from today\'s adventure 🌅 #travel #adventure #sunset',
        type: 'text',
        hashtags: ['travel', 'adventure', 'sunset'],
        visibility: 'public',
        allowComments: true,
      },
    ];

    const createdPosts = await Post.insertMany(samplePosts);
    console.log(`✅ Created ${createdPosts.length} sample posts`);

    // Create game catalog entries
    console.log('\n🎮 Creating game catalog...');
    const createdGames = await Game.insertMany(testGames);
    console.log(`✅ Created ${createdGames.length} game entries`);

    // Set up some follow relationships
    console.log('\n👫 Setting up follow relationships...');

    // Sarah follows Alex and Mike
    await User.findByIdAndUpdate(createdUsers[1]._id, {
      following: [createdUsers[0]._id, createdUsers[2]._id],
      followingCount: 2,
    });

    // Alex follows Sarah
    await User.findByIdAndUpdate(createdUsers[0]._id, {
      following: [createdUsers[1]._id],
      followingCount: 1,
    });

    // Set followers for users
    await User.findByIdAndUpdate(createdUsers[0]._id, {
      followers: [createdUsers[1]._id],
      followerCount: 1,
    });

    await User.findByIdAndUpdate(createdUsers[1]._id, {
      followers: [createdUsers[0]._id, createdUsers[2]._id],
      followerCount: 2,
    });

    await User.findByIdAndUpdate(createdUsers[2]._id, {
      followers: [createdUsers[1]._id],
      followerCount: 1,
    });

    console.log('✅ Follow relationships created');

    // Add likes to posts
    console.log('\n❤️  Adding likes to posts...');
    await Post.findByIdAndUpdate(createdPosts[0]._id, {
      likes: [
        { user: createdUsers[1]._id },
        { user: createdUsers[2]._id },
      ],
      likeCount: 2,
    });

    await Post.findByIdAndUpdate(createdPosts[1]._id, {
      likes: [
        { user: createdUsers[0]._id },
        { user: createdUsers[2]._id },
        { user: createdUsers[3]._id },
      ],
      likeCount: 3,
    });

    console.log('✅ Likes added to posts');

    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('🎮 You can now login with any of the test users above.');
    console.log('📊 Stats:');
    console.log(`   - Users created: ${createdUsers.length}`);
    console.log(`   - Posts created: ${createdPosts.length}`);
    console.log(`   - Games created: ${createdGames.length}`);
    console.log(`   - Follow relationships: 3`);
    console.log(`   - Likes: ${2 + 3}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
