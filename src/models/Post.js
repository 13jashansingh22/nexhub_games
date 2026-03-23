/* Post Model - Stores user posts/content */
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    // Author
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Content
    caption: {
      type: String,
      maxlength: [2000, 'Caption cannot exceed 2000 characters'],
    },
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'reel'],
      default: 'text',
    },
    media: [
      {
        url: String,
        publicId: String,
        type: {
          type: String,
          enum: ['image', 'video'],
        },
      },
    ],

    // Hashtags and mentions
    hashtags: [String],
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Engagement
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
    },

    // Comments (stored in separate Collection for scalability)
    // Ref: Comment model

    // Video/Reel specific
    duration: Number, // in seconds
    thumbnail: String,

    // Location
    location: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },

    // Visibility
    visibility: {
      type: String,
      enum: ['public', 'private', 'friends'],
      default: 'public',
    },
    allowComments: {
      type: Boolean,
      default: true,
    },

    // Status
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create geospatial index for location-based queries
postSchema.index({ 'coordinates.coordinates': '2dsphere' });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ visibility: 1 });

module.exports = mongoose.model('Post', postSchema);
