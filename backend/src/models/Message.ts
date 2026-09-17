import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    senderType: {
      type: String,
      enum: ["patient", "provider", "system"],
      required: true,
    },

    senderName: {
      type: String,
      required: true,
      trim: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
    },

    read: {
      type: Boolean,
      default: false,
    },

    attachment: {
      name: {
        type: String,
        default: "",
      },

      url: {
        type: String,
        default: "",
      },

      type: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({
  conversation: 1,
  createdAt: 1,
});

messageSchema.index({
  patient: 1,
  read: 1,
});

export const Message = mongoose.model(
  "Message",
  messageSchema
);