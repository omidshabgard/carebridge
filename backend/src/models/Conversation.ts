import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    participantName: {
      type: String,
      required: true,
      trim: true,
    },

    participantRole: {
      type: String,
      default: "Care team",
      trim: true,
    },

    participantAvatar: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "general",
        "appointment",
        "medication",
        "care",
        "billing",
        "system",
      ],
      default: "general",
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    lastMessage: {
      type: String,
      default: "",
      trim: true,
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    unreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({
  patient: 1,
  lastMessageAt: -1,
});

export const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);