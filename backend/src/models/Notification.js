/* Notification Model - Stores user notifications */
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // Recipient
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Sender (who triggered the notification)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Notification Type
    type: {
      type: String,
      enum: ['like', 'comment', 'follow', 'message', 'game_invite', 'achievement'],
      required: true,
    },

    // Reference to related document
    relatedTo: {
      model: {
        type: String,
        enum: ['Post', 'Comment', 'User', 'Message', 'GameScore'],
      },
      id: mongoose.Schema.Types.ObjectId,
    },

    // Notification Details
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      maxlength: 500,
    },
    actionUrl: String, // URL to navigate to

    // Achievement specific
    achievement: {
      badge: String,
      badgeIcon: String,
      description: String,
    },

    // Status
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
