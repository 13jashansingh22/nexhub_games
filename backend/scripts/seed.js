/* Database Seed Script - Create test data */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Post = require('../src/models/Post');
const connectDB = require('../src/config/database');

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
