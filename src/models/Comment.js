/* Comment Model - Stores comments on posts */
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    // Post Reference
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },

    // Author
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Content
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },

    // Mentions
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

    // Replies (nested comments - optional)
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    replyCount: {
      type: Number,
      default: 0,
    },

    // Status
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,

    // Moderation
    isReported: {
      type: Boolean,
      default: false,
    },
    reportCount: {
      type: Number,
      default: 0,
    },

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

// Indexes
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);
