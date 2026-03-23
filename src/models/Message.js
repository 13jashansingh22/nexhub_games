/* Message Model - Stores direct messages between users */
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    // Sender & Receiver
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Conversation ID (unique for each conversation)
    conversationId: {
      type: String,
      required: true,
      index: true,
    },

    // Message Content
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },

    // Media in messages
    media: [
      {
        url: String,
        publicId: String,
        type: {
          type: String,
          enum: ['image', 'video', 'document'],
        },
      },
    ],

    // Message Type
    messageType: {
      type: String,
      enum: ['text', 'image', 'video', 'game_invite', 'system'],
      default: 'text',
    },

    // Game Invite (if applicable)
    gameInvite: {
      gameType: String,
      gameMode: String,
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
      },
    },

    // Message Status
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,

    // Reactions/Emojis
    reactions: [
      {
        emoji: String,
        users: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
      },
    ],

    // Message Metadata
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

// Indexes for efficient querying
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ isRead: 1 });
messageSchema.index({ createdAt: -1 });

// Compound index for message retrieval optimization
messageSchema.index({ conversationId: 1, isRead: 1 });

module.exports = mongoose.model('Message', messageSchema);
